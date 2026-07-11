from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie

from app.core.config import settings

# Vamos adicionar os Document models aqui na Fase 2
DOCUMENT_MODELS: list = []


async def init_db() -> None:
    client = AsyncIOMotorClient(settings.mongodb_uri)
    database = client[settings.mongodb_db_name]

    await init_beanie(database=database, document_models=DOCUMENT_MODELS)