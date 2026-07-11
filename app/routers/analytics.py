from datetime import datetime

from fastapi import APIRouter, Query

from app.models.transaction import Transaction
from app.schemas.analytics import CategoryTotal

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/totals-by-category", response_model=list[CategoryTotal])
async def totals_by_category(
    start_date: datetime = Query(...),
    end_date: datetime = Query(...),
):
    pipeline = [
        {
            "$match": {
                "date": {"$gte": start_date, "$lte": end_date},
                "type": "expense",
            }
        },
        {
            "$group": {
                "_id": "$category.$id",
                "total": {"$sum": "$amount"},
            }
        },
        {
            "$lookup": {
                "from": "categories",
                "localField": "_id",
                "foreignField": "_id",
                "as": "category",
            }
        },
        {"$unwind": "$category"},
        {
            "$project": {
                "_id": 0,
                "category_id": {"$toString": "$_id"},
                "category_name": "$category.name",
                "category_color": "$category.color",
                "total": 1,
            }
        },
        {"$sort": {"total": -1}},
    ]

    results = await Transaction.get_motor_collection().aggregate(pipeline).to_list(None)
    return results