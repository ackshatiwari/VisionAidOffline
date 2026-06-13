from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


from routes import yolo_endpoints
app.include_router(yolo_endpoints.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}
