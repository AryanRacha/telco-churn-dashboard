from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from contextlib import asynccontextmanager

# Import your API routes and services
from api import predict, figures, explorer 
from services import model_service 

# Lifespan context manager to handle startup and shutdown events.
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("--- 🚀 Application Startup ---")
    model_service.load_all_models()
    
    yield
    
    print("--- 🔌 Application Shutdown ---")

app = FastAPI(
    title="Customer Churn Dashboard API",
    description="API for the DWM Churn Project",
    version="1.0.0",
    lifespan=lifespan
)

# --- Add CORS Middleware ---
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- (The @app.on_event("startup") decorator is GONE) ---

# --- Include API Routes ---
app.include_router(predict.router, prefix="/api/predict", tags=["Predictions"])
app.include_router(figures.router, prefix="/api/figures", tags=["Model Figures"])
app.include_router(explorer.router, prefix="/api/explorer", tags=["Explorer"])

# --- Root Health Check ---
@app.get("/api", tags=["Health Check"])
def read_root():
    return {"status": "ok", "message": "Welcome to the Churn API!"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)