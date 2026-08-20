import pytest
from httpx import ASGITransport, AsyncClient
from services.main import app


@pytest.mark.asyncio
async def test_ingress_telemetry():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.post(
            "/telemetry/ingress",
            json={
                "device_id": "bci-thinklink-01",
                "signal_type": "eeg",
                "data_points": [50.0, 75.0, 85.0],
            },
        )
    assert response.status_code == 200
    data = response.json()
    assert data["received"] is True
    assert data["processed_signals"] == 3
    assert data["focus_index"] > 0
