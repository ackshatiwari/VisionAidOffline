# router for fastapi
# pyrefly: ignore [missing-import]
import io
import logging
from fastapi import APIRouter, File, UploadFile, HTTPException

logger = logging.getLogger(__name__)
from PIL import Image
from ultralytics import YOLO
from routes.helper_methods.yolo_helpers import get_angle_direction_and_distance

router = APIRouter()

# Load the YOLOv8 model (lightweight model, ~6MB).
# It will download automatically on first request if not present.
try:
    model = YOLO("yolov8n.pt")
except Exception:
    model = None

@router.post("/yolo/detect")
async def detect_objects(file: UploadFile = File(...)):
    # Validate file type is an image
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image.")

    try:
        # Read the file content
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Get frame dimensions
        frame_width = image.width
        frame_height = image.height

        # Lazy load model if loading failed at startup
        global model
        if model is None:
            model = YOLO("yolov8n.pt")

        # Run inference
        results = model(image)

        # Parse inference results
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                # Coordinate bounding box [xmin, ymin, xmax, ymax]
                xyxy = box.xyxy[0].tolist()
                confidence = float(box.conf[0])
                cls = int(box.cls[0])
                label = result.names[cls]

                # Convert xyxy [xmin, ymin, xmax, ymax] to xywh [xmin, ymin, w, h] for helper function
                xmin, ymin, xmax, ymax = xyxy
                w = xmax - xmin
                h = ymax - ymin
                bbox = [xmin, ymin, w, h]

                if confidence > 0.5:
                    angle, distance, direction = get_angle_direction_and_distance(bbox, frame_width, label)
                    detections.append({
                        "box": xyxy,
                        "confidence": confidence,
                        "class": label,
                        "angle": angle,
                        "distance": distance,
                        "direction": direction
                    })

        return {"predictions": detections}

    except Exception as e:
        logger.exception("500 error in /yolo/detect: %s", e)
        raise HTTPException(status_code=500, detail=f"Failed to process image: {str(e)}")
