from datetime import datetime

from pydantic import BaseModel

from app.models.transaction import TransactionType


class TransactionCreate(BaseModel):
    description: str
    amount: float
    date: datetime
    type: TransactionType
    account_id: str
    category_id: str
    tags: list[str] = []


class TransactionUpdate(BaseModel):
    description: str | None = None
    amount: float | None = None
    date: datetime | None = None
    type: TransactionType | None = None
    account_id: str | None = None
    category_id: str | None = None
    tags: list[str] | None = None


class TransactionRead(BaseModel):
    id: str
    description: str
    amount: float
    date: datetime
    type: TransactionType
    account_id: str
    category_id: str
    tags: list[str]
    created_at: datetime