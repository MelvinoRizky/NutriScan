import argparse
import json
import sys
import os
import torch
from PIL import Image
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

try:
    from ultralytics import YOLO
    ULTRALYTICS_AVAILABLE = True
except ImportError:
    ULTRALYTICS_AVAILABLE = False
    print("⚠ ultralytics not installed", file=sys.stderr)

# Global model variable
model = None
custom_labels = []

def load_yolo_model(model_path: str):
    """Load YOLOv8 model from best.pt"""
    try:
        if not ULTRALYTICS_AVAILABLE:
            raise RuntimeError("ultralytics library is required for best.pt")
        
        print(f"Loading YOLOv8 model from {model_path}...", file=sys.stderr)
        m = YOLO(model_path)
        print(f"✓ YOLOv8 model loaded successfully", file=sys.stderr)
        return m
    except Exception as e:
        print(f"Failed to load YOLOv8 model: {e}", file=sys.stderr)
        raise RuntimeError(f'Could not load YOLOv8 model: {e}')

def to_label(index: int, labels, model_names=None):
    if labels and index < len(labels):
        return labels[index]
    if model_names and index in model_names:
        return model_names[index]
    return f'class_{index}'

def run_inference_on_image(image_path: str):
    global model, custom_labels
    if model is None:
        raise RuntimeError("Model is not loaded")
        
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image file not found: {image_path}")
        
    image = Image.open(image_path).convert('RGB')
    results = model(image, verbose=False, conf=0.1)
    
    if not results or len(results) == 0:
        raise RuntimeError("No inference results returned")
        
    result = results[0]
    
    if hasattr(result, 'probs') and result.probs is not None:
        probs = result.probs
        model_names = result.names if hasattr(result, 'names') else None
        
        top_idx = int(probs.top1)
        top_conf = float(probs.top1conf.item()) if hasattr(probs.top1conf, 'item') else float(probs.top1conf)
        
        top_k = min(3, len(probs.data))
        top_probs, top_indices = torch.topk(torch.tensor(probs.data, dtype=torch.float32), k=top_k, dim=0)
        
        top_predictions = []
        for rank, (prob, idx) in enumerate(zip(top_probs, top_indices)):
            label_idx = int(idx.item())
            confidence = float(prob.item())
            top_predictions.append({
                'label': to_label(label_idx, custom_labels, model_names),
                'confidence': confidence,
            })
        
        return {
            'prediction': to_label(top_idx, custom_labels, model_names),
            'confidence': top_conf,
            'top_predictions': top_predictions,
        }
    elif hasattr(result, 'boxes') and result.boxes is not None:
        boxes = result.boxes
        model_names = result.names if hasattr(result, 'names') else None
        
        if len(boxes) == 0:
            return {
                'prediction': None,
                'confidence': 0.0,
                'top_predictions': [],
                'all_detections': [],
                'message': 'No objects detected'
            }
        else:
            confidences = boxes.conf
            top_idx = int(torch.argmax(confidences).item())
            top_conf = float(confidences[top_idx].item())
            top_class = int(boxes.cls[top_idx].item())
            top_label = to_label(top_class, custom_labels, model_names)
            
            all_detections = []
            for i in range(len(boxes)):
                bbox = boxes.xyxy[i].tolist() if hasattr(boxes, 'xyxy') else None
                pred_class = int(boxes.cls[i].item())
                pred_label = to_label(pred_class, custom_labels, model_names)
                pred_conf = float(boxes.conf[i].item())
                
                detection_dict = {
                    'label': pred_label,
                    'confidence': pred_conf,
                }
                if bbox:
                    detection_dict['bbox'] = bbox
                
                all_detections.append(detection_dict)
            
            return {
                'prediction': top_label,
                'confidence': top_conf,
                'top_predictions': all_detections,
                'all_detections': all_detections,
                'total_detections': len(all_detections),
            }
    else:
        raise RuntimeError("Model output structure not recognized.")

class InferenceHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/predict':
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                self.send_error(400, "Empty request body")
                return
                
            post_data = self.rfile.read(content_length)
            
            try:
                req_json = json.loads(post_data.decode('utf-8'))
                image_path = req_json.get('image')
                if not image_path:
                    self.send_error(400, "Missing 'image' in JSON")
                    return
                
                result_json = run_inference_on_image(image_path)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(result_json).encode('utf-8'))
            except Exception as e:
                print(f"Error during inference: {e}", file=sys.stderr)
                import traceback
                traceback.print_exc(file=sys.stderr)
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        else:
            self.send_error(404, "Not Found")

def main():
    global model, custom_labels
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', required=True)
    parser.add_argument('--labels', default='')
    parser.add_argument('--port', type=int, default=5001)
    args = parser.parse_args()

    if args.labels:
        custom_labels = [v.strip() for v in args.labels.split(',') if v.strip()]

    print("Initializing Inference Server...", file=sys.stderr)
    model = load_yolo_model(args.model)
    
    server_address = ('127.0.0.1', args.port)
    httpd = ThreadingHTTPServer(server_address, InferenceHandler)
    print(f"Server listening on http://{server_address[0]}:{server_address[1]}", file=sys.stderr)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...", file=sys.stderr)
        httpd.server_close()

if __name__ == '__main__':
    main()
