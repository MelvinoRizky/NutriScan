import argparse
import json
import sys
import torch
from PIL import Image

try:
    from ultralytics import YOLO
    ULTRALYTICS_AVAILABLE = True
except ImportError:
    ULTRALYTICS_AVAILABLE = False
    print("⚠ ultralytics not installed", file=sys.stderr)


def load_yolo_model(model_path: str):
    """Load YOLOv8 model from best.pt"""
    try:
        if not ULTRALYTICS_AVAILABLE:
            raise RuntimeError("ultralytics library is required for best.pt")
        
        print(f"Loading YOLOv8 model from {model_path}...", file=sys.stderr)
        model = YOLO(model_path)
        print(f"✓ YOLOv8 model loaded successfully", file=sys.stderr)
        return model
    except Exception as e:
        print(f"Failed to load YOLOv8 model: {e}", file=sys.stderr)
        raise RuntimeError(f'Could not load YOLOv8 model: {e}')


def to_label(index: int, custom_labels, model_names=None):
    """Convert index to label name - prioritize custom labels, then model names, then default"""
    if custom_labels and index < len(custom_labels):
        return custom_labels[index]
    if model_names and index in model_names:
        return model_names[index]
    return f'class_{index}'


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', required=True)
    parser.add_argument('--image', required=True)
    parser.add_argument('--labels', default='')
    args = parser.parse_args()

    labels = []
    if args.labels:
        labels = [v.strip() for v in args.labels.split(',') if v.strip()]

    try:
        print(f"Loading model from {args.model}...", file=sys.stderr)
        model = load_yolo_model(args.model)
        
        print(f"Running inference on {args.image}...", file=sys.stderr)
        
        # Verify image exists
        import os
        if not os.path.exists(args.image):
            raise FileNotFoundError(f"Image file not found: {args.image}")
        
        # Check file size
        file_size = os.path.getsize(args.image)
        if file_size == 0:
            raise ValueError(f"Image file is empty (0 bytes)")
        
        if file_size < 1024:
            raise ValueError(f"Image file too small ({file_size} bytes) - not a valid image")
        
        print(f"✓ Image file valid: {file_size} bytes", file=sys.stderr)
        
        # Open and verify image
        try:
            image = Image.open(args.image).convert('RGB')
            print(f"✓ Image loaded: {image.size}", file=sys.stderr)
        except Exception as e:
            raise ValueError(f"Cannot read image file - file may be corrupt or not an image: {str(e)}")
        
        # Run YOLOv8 inference
        results = model(image, verbose=False, conf=0.1)
        
        if not results or len(results) == 0:
            raise RuntimeError("No inference results returned")
        
        result = results[0]
        
        # Debug: Print available attributes
        print(f"Result type: {type(result)}", file=sys.stderr)
        result_attributes = [attr for attr in dir(result) if not attr.startswith('_')]
        print(f"Result attributes: {result_attributes}", file=sys.stderr)
        
        # Check what kind of model output we have
        if hasattr(result, 'probs') and result.probs is not None:
            print(f"✓ Found probs - Classification model", file=sys.stderr)
            probs = result.probs
            
            # Extract model names for label fallback
            model_names = result.names if hasattr(result, 'names') else None
            
            # Get top prediction
            top_idx = int(probs.top1)
            top_conf = float(probs.top1conf.item()) if hasattr(probs.top1conf, 'item') else float(probs.top1conf)
            
            # Get top 3 predictions
            top_k = min(3, len(probs.data))
            top_probs, top_indices = torch.topk(torch.tensor(probs.data, dtype=torch.float32), k=top_k, dim=0)
            
            top_predictions = []
            for rank, (prob, idx) in enumerate(zip(top_probs, top_indices)):
                label_idx = int(idx.item())
                confidence = float(prob.item())
                top_predictions.append({
                    'label': to_label(label_idx, labels, model_names),
                    'confidence': confidence,
                })
            
            result_json = {
                'prediction': to_label(top_idx, labels, model_names),
                'confidence': top_conf,
                'top_predictions': top_predictions,
            }
        elif hasattr(result, 'boxes') and result.boxes is not None:
            # Detection model (YOLOv8 Detection)
            print(f"✓ Found boxes - Detection model", file=sys.stderr)
            boxes = result.boxes
            
            # Extract model names for label fallback
            model_names = result.names if hasattr(result, 'names') else None
            
            # ✅ Handle empty detections gracefully
            if len(boxes) == 0:
                print(f"⚠ No objects detected in image", file=sys.stderr)
                result_json = {
                    'prediction': None,
                    'confidence': 0.0,
                    'top_predictions': [],
                    'all_detections': [],
                    'message': 'No objects detected'
                }
            else:
                print(f"✓ Detected {len(boxes)} objects total", file=sys.stderr)
                
                # Get top detected object by confidence (for main prediction)
                confidences = boxes.conf
                top_idx = int(torch.argmax(confidences).item())
                top_conf = float(confidences[top_idx].item())
                top_class = int(boxes.cls[top_idx].item())
                top_label = to_label(top_class, labels, model_names)
                
                # ✅ Return ALL detections (not just top 3) with bbox
                all_detections = []
                for i in range(len(boxes)):
                    bbox = boxes.xyxy[i].tolist() if hasattr(boxes, 'xyxy') else None
                    pred_class = int(boxes.cls[i].item())
                    pred_label = to_label(pred_class, labels, model_names)
                    pred_conf = float(boxes.conf[i].item())
                    
                    detection_dict = {
                        'label': pred_label,
                        'confidence': pred_conf,
                    }
                    if bbox:
                        detection_dict['bbox'] = bbox
                    
                    all_detections.append(detection_dict)
                
                result_json = {
                    'prediction': top_label,
                    'confidence': top_conf,
                    'top_predictions': all_detections,  # Return ALL detections
                    'all_detections': all_detections,  # Also duplicate for clarity
                    'total_detections': len(all_detections),
                }
        else:
            print(f"⚠ No probs or boxes found. Available: {result_attributes}", file=sys.stderr)
            # Fallback: try to get any output
            if hasattr(result, 'names') and result.names:
                print(f"Model has names dict: {result.names}", file=sys.stderr)
            raise RuntimeError(f"Model output structure not recognized. Attributes: {result_attributes}")
        
        print(json.dumps(result_json))
        print(f"✓ Inference successful: {result_json.get('prediction', 'Unknown')}", file=sys.stderr)

    except Exception as exc:
        import traceback
        traceback.print_exc(file=sys.stderr)
        print(json.dumps({'error': str(exc)}))
        sys.exit(1)


if __name__ == '__main__':
    main()
