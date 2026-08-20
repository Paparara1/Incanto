from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/intent", tags=["Intent Engine"])


class IntentRequest(BaseModel):
    intent: str
    context: dict | None = None


class IntentResponse(BaseModel):
    status: str
    compiled_spec: dict
    sovereignty_level: str = "100% Zero Lock-In"


@router.post("/compile", response_model=IntentResponse)
async def compile_intent(payload: IntentRequest) -> IntentResponse:
    """Kompiluje intencję użytkownika w ustrukturyzowaną specyfikację wykonawczą."""
    spec = {
        "raw_intent": payload.intent,
        "blueprint": {
            "service_name": "sovereign_container",
            "runtime": "python:3.11",
            "security": "Zero-Trust Guaranteed",
        },
    }
    return IntentResponse(status="compiled", compiled_spec=spec)
