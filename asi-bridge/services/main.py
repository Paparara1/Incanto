from fastapi import FastAPI
from services.intent_engine import router as intent_router
from services.auth_gate import router as auth_router
from services.telemetry_ingress import router as telemetry_router

app = FastAPI(
    title="ASI BRIDGE API",
    description="Agencja Suwerennej Inteligencji - Intent-to-Action Engine",
    version="1.0.0",
)

app.include_router(intent_router)
app.include_router(auth_router)
app.include_router(telemetry_router)


@app.get("/")
async def root():
    return {
        "message": "ASI BRIDGE is operational",
        "manifesto": "Twoja intencja. Twoja technologia. Twoja własność.",
    }
