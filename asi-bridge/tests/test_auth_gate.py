import pytest
from httpx import ASGITransport, AsyncClient
from services.main import app


@pytest.mark.asyncio
async def test_verify_auth_success():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.post(
            "/auth/verify",
            json={"token": "valid-token-123", "biometric_hash": "iris-hash-xyz"},
        )
    assert response.status_code == 200
    data = response.json()
    assert data["authenticated"] is True
    assert data["identity_status"] == "IrisVerify Verified"


@pytest.mark.asyncio
async def test_verify_auth_failure():
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        response = await ac.post(
            "/auth/verify",
            json={"token": "invalid"},
        )
    assert response.status_code == 401
