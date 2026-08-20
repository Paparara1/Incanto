from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/telemetry", tags=["Telemetry Ingress"])


class TelemetryRequest(BaseModel):
    device_id: str
    signal_type: str  # np. 'eeg', 'eye_tracker'
    data_points: list[float]


class TelemetryResponse(BaseModel):
    received: bool
    processed_signals: int
    focus_index: float


@router.post("/ingress", response_model=TelemetryResponse)
async def ingest_telemetry(payload: TelemetryRequest) -> TelemetryResponse:
    """Odbiera i waliduje dane telemetrii biologicznej z urządzeń BCI (ThinkLink)."""
    count = len(payload.data_points)
    avg_signal = sum(payload.data_points) / count if count > 0 else 0.0

    return TelemetryResponse(
        received=True,
        processed_signals=count,
        focus_index=min(1.0, max(0.0, avg_signal / 100.0)),
    )
