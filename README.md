### Won 'Special Prize -- Iteration Machine' in DSH Hacks
---

# VisionAId Congo

> **Turning a standard laptop into a full awareness system for the visually impaired in the DRC.**

VisionAId Congo scans the environment in real time, identifies objects, and converts detections into directional audio cues that tell the user what is around them and where — replicating the situational awareness that sighted people take for granted. Everything runs on-device with no internet connection and under 100ms of latency.

---

## The Problem

In the Democratic Republic of Congo, access to assistive technology for the visually impaired is severely limited. Cloud-dependent tools fail without reliable internet. Specialist hardware is unaffordable. VisionAId Congo is built for this reality — running entirely on a standard laptop, offline, in the local languages.

---

## How It Works

```
Camera Feed → Frame Capture (every 500ms) → YOLO Detection → Spatial Calculation → Audio Cue
```

1. The webcam captures a frame every 500ms.
2. The frame is sent to a local FastAPI backend running YOLOv8n.
3. Each detected object is assigned a real-world distance (via pinhole camera model) and a directional position (N, NNE, NE … WNW).
4. The result is spoken aloud in the user's language using the browser's built-in Web Speech API.
5. A visual log of recent cues is displayed alongside the live camera feed.

---

## Features

| Feature | Details |
|---|---|
| **Real-time object detection** | YOLOv8n (6.5 MB) — runs locally, no GPU required |
| **Directional audio cues** | 7-zone spatial map (far left → center → far right) spoken aloud |
| **Distance estimation** | Pinhole camera model using known object heights |
| **Alert deduplication** | Same obstacle/direction pair suppressed for 4 seconds to prevent fatigue |
| **Speech queuing** | Current cue plays to completion; only the latest queued alert plays next |
| **4 languages** | English, French, Lingala, Swahili — including TTS voice selection |
| **Male / Female voice** | Browser-native voice matched by language and gender preference |
| **Priority filter** | Per-object priority levels (High / Medium / Low / Off) + distance threshold slider |
| **On-device only** | No internet, no cloud, no external APIs |
| **< 100ms latency** | End-to-end from frame capture to audio output |

---

## Tech Stack

### Backend
- **FastAPI** — async Python web framework
- **Ultralytics YOLOv8n** — lightweight object detection model (~6.5 MB)
- **Pillow** — image decoding from uploaded frames

### Frontend
- **React 19** + **Vite** — UI and dev tooling
- **Web Speech API** — built-in browser TTS, no external dependency
- **MediaDevices API** — webcam capture
- **Canvas API** — frame extraction from video

---

## Project Structure

```
TillyHacks_26/
├── backend/
│   ├── main.py                          # FastAPI app, CORS, router registration
│   └── routes/
│       ├── yolo_endpoints.py            # POST /yolo/detect endpoint
│       └── helper_methods/
│           └── yolo_helpers.py          # Distance & direction calculations
├── frontend/
│   └── src/
│       ├── App.jsx                      # Root — landing ↔ app routing
│       ├── context/
│       │   └── LanguageContext.jsx      # i18n for EN / FR / LN / SW
│       └── components/
│           ├── landing/                 # Splash / entry screen
│           ├── sidebar/                 # Navigation panel
│           ├── home/
│           │   └── live_environment/
│           │       ├── Webcam.jsx       # Camera + frame dispatch
│           │       └── AudioCues.jsx    # TTS alert engine
│           ├── priority_filter/         # Per-object priority & distance threshold
│           ├── settings/                # General, display, language, privacy
│           └── system_monitoring/       # Live latency, uptime, diagnostics
└── yolov8n.pt                           # YOLOv8 Nano weights
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install fastapi uvicorn ultralytics pillow
uvicorn main:app --reload
```

The backend runs at `http://localhost:8000`. On first request, `yolov8n.pt` downloads automatically if not present.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

---

## How Distance Is Estimated

Distance is calculated using the pinhole camera model:

```
distance = (real_height × focal_length) / pixel_height
```

Each known object class has a mapped real-world height (e.g. `person: 1.7m`, `door: 2.0m`, `chair: 0.8m`). Unknown objects default to `1.0m`. The focal length defaults to `640px`, matching a standard webcam field of view.

---

## Languages

| Code | Language | Native |
|---|---|---|
| `en` | English | English |
| `fr` | French | Français |
| `ln` | Lingala | Lingála |
| `sw` | Swahili | Kiswahili |

Lingala has no built-in browser TTS voice — the system falls back to French, the official language of the DRC and the closest available match.

---

## Pages

| Page | Description |
|---|---|
| **Home** | Live camera feed + real-time audio cue log |
| **Priority Filter** | Set alert priority per object type; configure distance threshold (1–15m) |
| **Settings** | Units, theme, language, display options, privacy status |
| **System** | Live latency, uptime, inference rate, diagnostics runner |

---

## Built for TillyHacks 2026 🌍
