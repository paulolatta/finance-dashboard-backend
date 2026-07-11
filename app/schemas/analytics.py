from pydantic import BaseModel


class CategoryTotal(BaseModel):
    category_id: str
    category_name: str
    category_color: str
    total: float