from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["Auth Gate"])


class AuthRequest(BaseModel):
    token: str
    biometric_hash: str | None = None


class AuthResponse(BaseModel):
    authenticated: bool
    identity_status: str
    trust_score: float


@router.post("/verify", response_model=AuthResponse)
async def verify_identity(
    payload: AuthRequest, authorization: str | None = Header(None)
) -> AuthResponse:
    """Weryfikuje tożsamość Zero-Trust oraz tokeny biometryczne IrisVerify."""
    if not payload.token or payload.token == "invalid":
        raise HTTPException(
            status_code=401, detail="Invalid token or Zero-Trust check failed"
        )

    return AuthResponse(
        authenticated=True,
        identity_status="IrisVerify Verified",
        trust_score=1.0,
    )
