from fastapi import APIRouter, HTTPException, status

from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryRead, CategoryUpdate

router = APIRouter(prefix="/categories", tags=["categories"])


def to_read(category: Category) -> CategoryRead:
    return CategoryRead(
        id=str(category.id),
        name=category.name,
        type=category.type,
        color=category.color,
        icon=category.icon,
    )


@router.get("/", response_model=list[CategoryRead])
async def list_categories():
    categories = await Category.find_all().to_list()
    return [to_read(c) for c in categories]


@router.get("/{category_id}", response_model=CategoryRead)
async def get_category(category_id: str):
    category = await Category.get(category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return to_read(category)


@router.post("/", response_model=CategoryRead, status_code=status.HTTP_201_CREATED)
async def create_category(payload: CategoryCreate):
    category = Category(**payload.model_dump())
    await category.insert()
    return to_read(category)


@router.patch("/{category_id}", response_model=CategoryRead)
async def update_category(category_id: str, payload: CategoryUpdate):
    category = await Category.get(category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)

    await category.save()
    return to_read(category)


@router.delete("/{category_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_category(category_id: str):
    category = await Category.get(category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    await category.delete()