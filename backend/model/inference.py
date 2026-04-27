import argparse
import json
import sys
import torch
import torch.nn as nn
from PIL import Image
from torchvision import transforms
import torchvision.models as models


def load_model_with_checkpoint(model_path: str):
    """Load model from checkpoint - handles custom architecture."""
    checkpoint = torch.load(model_path, map_location='cpu', weights_only=False)
    
    # If checkpoint.pth is the model itself (already a model with architecture)
    if isinstance(checkpoint, nn.Module):
        checkpoint.eval()
        return checkpoint, checkpoint.get('class_names', [])
    
    # If it's a dict with model_state_dict, need to reconstruct
    if isinstance(checkpoint, dict) and 'model_state_dict' in checkpoint:
        state_dict = checkpoint['model_state_dict']
        num_classes = checkpoint.get('num_classes', 101)
        class_names = checkpoint.get('class_names', [])
        
        # Try loading as ResNet50 with strict=False
        model = _build_model_from_state_dict(state_dict, num_classes)
        return model, class_names
    else:
        raise RuntimeError(f'Checkpoint format tidak dikenali: {type(checkpoint)}, keys: {checkpoint.keys() if isinstance(checkpoint, dict) else "not a dict"}')


def _build_model_from_state_dict(state_dict, num_classes):
    """Build and load model from state dict - MobileNetV2 with correct 2-layer classifier."""
    try:
        print(f"Loading MobileNetV2...", file=sys.stderr)
        
        base_model = models.mobilenet_v2(pretrained=False)
        
        # Checkpoint classifier structure: Sequential with non-parameterized layers at 0,2,3
        # and Linear layers at 1 and 4
        # Rebuild to match: [Dropout, Linear(1280->512), ReLU, Dropout, Linear(512->101)]
        base_model.classifier = nn.Sequential(
            nn.Dropout(0.2),  # index 0 - non-parameterized
            nn.Linear(1280, 512),  # index 1 - has weights
            nn.ReLU(inplace=True),  # index 2 - non-parameterized  
            nn.Dropout(0.2),  # index 3 - non-parameterized
            nn.Linear(512, num_classes),  # index 4 - has weights
        )
        
        # Now strict load should work!
        missing, unexpected = base_model.load_state_dict(state_dict, strict=False)
        if missing:
            print(f"⚠ Missing keys: {missing}", file=sys.stderr)
        if unexpected:
            print(f"⚠ Unexpected keys: {unexpected}", file=sys.stderr)
        
        # CRITICAL: Ensure eval mode for deterministic inference
        base_model.eval()
        for param in base_model.parameters():
            param.requires_grad = False
            
        print(f"✓ Model loaded in eval mode with classifier weights", file=sys.stderr)
        return base_model
    except Exception as e:
        print(f"Model load failed: {e}", file=sys.stderr)
        raise RuntimeError(f'Could not load model: {e}')


def softmax(logits: torch.Tensor):
    return torch.nn.functional.softmax(logits, dim=1)


def to_label(index: int, custom_labels):
    if custom_labels and index < len(custom_labels):
        return custom_labels[index]
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

    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

    try:
        print(f"Loading model from {args.model}...", file=sys.stderr)
        model, checkpoint_labels = load_model_with_checkpoint(args.model)
        model.eval()  # CRITICAL: Disable Dropout and Batch Norm randomness
        print(f"Model loaded and set to eval mode. Running inference...", file=sys.stderr)

        # Use checkpoint labels if available, otherwise use command-line labels
        labels = checkpoint_labels if checkpoint_labels else labels

        image = Image.open(args.image).convert('RGB')
        tensor = transform(image).unsqueeze(0)

        with torch.no_grad():
            output = model(tensor)
            if isinstance(output, (list, tuple)):
                output = output[0]

            if not isinstance(output, torch.Tensor):
                raise RuntimeError('Output model bukan tensor')

            probs = softmax(output)
            confidence, pred_idx = torch.max(probs, dim=1)
            pred_idx = int(pred_idx.item())
            confidence = float(confidence.item())

            topk = min(3, probs.shape[1])
            top_probs, top_indices = torch.topk(probs, k=topk, dim=1)

            top_predictions = []
            for idx_tensor, prob_tensor in zip(top_indices[0], top_probs[0]):
                idx = int(idx_tensor.item())
                top_predictions.append({
                    'label': to_label(idx, labels),
                    'confidence': float(prob_tensor.item()),
                })

        result = {
            'prediction': to_label(pred_idx, labels),
            'confidence': confidence,
            'top_predictions': top_predictions,
        }
        print(json.dumps(result))

    except Exception as exc:
        import traceback
        traceback.print_exc(file=sys.stderr)
        print(json.dumps({'error': str(exc)}))
        sys.exit(1)


if __name__ == '__main__':
    main()
