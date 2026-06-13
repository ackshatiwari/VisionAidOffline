# Map of indoor objects that can pose a navigation/trip/collision hazard to blind people
OBJECT_HEIGHTS = {
    # Structure & Architectural Hazards
    "wall": 2.4,
    "walls": 2.4,
    "stairs": 2.0,
    "staircase": 2.0,
    "steps": 1.0,
    "door": 2.0,
    "doorway": 2.0,
    "window": 1.2,
    
    # Furniture & Large Obstacles
    "chair": 0.8,
    "stool": 0.6,
    "couch": 0.85,
    "sofa": 0.85,
    "bed": 0.6,
    "dining table": 0.75,
    "table": 0.75,
    "desk": 0.75,
    "refrigerator": 1.75,
    "fridge": 1.75,
    "toilet": 0.8,
    "sink": 0.85,
    "oven": 0.85,
    "microwave": 0.35,
    
    # Electronics (large TVs can be bumped/damaged)
    "tv": 0.5,
    
    # Dynamic Obstacles
    "person": 1.7,
}

DEFAULT_HEIGHT = 0.5  # meters

def get_angle_direction_and_distance(bbox, frame_width, label, focal_length=640):
    """
    Calculates angle, cardinal direction, and real-world distance (in meters) to an object.
    
    bbox format: [xmin, ymin, width, height]
    """
    x, w = bbox[0], bbox[2]
    center_x = x + w / 2

    # Calculate angle relative to center (-50 to +50 degrees)
    normalized = (center_x / frame_width) - 0.5
    angle = normalized * 100

    # Determine direction
    if angle < -40: direction = "WNW"
    elif angle < -20: direction = "NW"
    elif angle < -5: direction = "NNW"
    elif angle < 5: direction = "N"
    elif angle < 20: direction = "NNE"
    elif angle < 40: direction = "NE"
    else: direction = "ENE"

    # Estimate distance: distance = (real_height * focal_length) / pixel_height
    # bbox[3] is the height of the bounding box in pixels (pixel_height)
    pixel_height = bbox[3]
    real_height = OBJECT_HEIGHTS.get(label, DEFAULT_HEIGHT)

    if pixel_height > 0:
        distance = (real_height * focal_length) / pixel_height
    else:
        distance = 0.0

    return angle, distance, direction
