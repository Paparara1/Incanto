import pytest
from httpx import ASGITransport, AsyncClient
from services.main import app


@pytest.mark.asyncio
async def test_compile_intent():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.post(
            "/intent/compile",
            json={"intent": "Zbuduj suwerenny skarbiec danych"},
        )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "compiled"
    assert "compiled_spec" in data
    assert data["sovereignty_level"] == "100% Zero Lock-In"
