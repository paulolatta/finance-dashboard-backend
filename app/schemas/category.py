from pydantic import BaseModel

from app.models.category import CategoryType


class CategoryCreate(BaseModel):
    name: str
    type: CategoryType
    color: str = "#6B7280"
    icon: str | None = None


class CategoryUpdate(BaseModel):
    name: str | None = None
    type: CategoryType | None = None
    color: str | None = None
    icon: str | None = None


class CategoryRead(BaseModel):
    id: str
    name: str
    type: CategoryType
    color: str
    icon: str | None

    class Config:
        from_attributes = True