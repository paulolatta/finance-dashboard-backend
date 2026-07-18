import certifi
from fastapi import APIRouter
from motor.motor_asyncio import AsyncIOMotorClient

from app.core.config import settings

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    try:
        client = AsyncIOMotorClient(
            settings.mongodb_uri, tlsCAFile=certifi.where(), serverSelectionTimeoutMS=3000
        )
        await client.admin.command("ping")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "ok",
        "environment": settings.environment,
        "database": db_status,
    }