from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/tools/health")
    assert response.status_code == 200
    assert response.json() == {"message": "Tools router is healthy", "status": "ok"}
