from ultralytics import YOLO
from PIL import Image, ImageDraw, ImageFont
import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(BASE_DIR, "..", "assets", "models", "best (17).pt")
model = YOLO(model_path)


def predict_image(image_path: str, output_path: str, json_path: str):
    results = model(image_path, conf=0.75, iou=0.45, max_det=1000)
    result = results[0]

    img = Image.open(image_path).convert("RGB")
    draw = ImageDraw.Draw(img)

    class_counts = {}
    detections = []

    try:
        font = ImageFont.truetype("arial.ttf", 28)
    except:
        font = ImageFont.load_default()

    BOX_THICKNESS = 10
    TEXT_PADDING = 6

    for box in result.boxes:
        cls_id = int(box.cls[0])
        cls_name = model.names[cls_id]
        conf = float(box.conf[0])
        x1, y1, x2, y2 = map(int, box.xyxy[0].tolist())

        class_counts[cls_name] = class_counts.get(cls_name, 0) + 1

        detections.append(
            {
                "class_id": cls_id,
                "class_name": cls_name,
                "confidence": round(conf, 3),
                "bbox": {
                    "x1": x1,
                    "y1": y1,
                    "x2": x2,
                    "y2": y2,
                },
            }
        )

        for i in range(BOX_THICKNESS):
            draw.rectangle(
                [x1 - i, y1 - i, x2 + i, y2 + i],
                outline="red",
            )

        label = f"{cls_name} {conf:.2f}"
        bbox = draw.textbbox((0, 0), label, font=font)
        text_h = bbox[3] - bbox[1]

        draw.text(
            (x1 + TEXT_PADDING, y1 - text_h - TEXT_PADDING),
            label,
            fill="red",
            font=font,
        )

    img.save(output_path)

    json_data = {
        "image": os.path.basename(image_path),
        "output_image": os.path.basename(output_path),
        "summary": [{"label": k, "qty": v} for k, v in class_counts.items()],
        "detections": detections,
    }

    with open(json_path, "w") as f:
        json.dump(json_data, f, indent=4)

    return output_path, json_path, json_data
