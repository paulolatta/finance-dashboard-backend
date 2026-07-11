from fastapi import APIRouter, HTTPException, Query, status

from app.models.account import Account
from app.models.category import Category
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionRead, TransactionUpdate

router = APIRouter(prefix="/transactions", tags=["transactions"])


def to_read(transaction: Transaction) -> TransactionRead:
    return TransactionRead(
        id=str(transaction.id),
        description=transaction.description,
        amount=transaction.amount,
        date=transaction.date,
        type=transaction.type,
        account_id=str(transaction.account.ref.id),
        category_id=str(transaction.category.ref.id),
        tags=transaction.tags,
        created_at=transaction.created_at,
    )


@router.get("/", response_model=list[TransactionRead])
async def list_transactions(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
):
    transactions = (
        await Transaction.find_all()
        .sort(-Transaction.date)
        .skip(skip)
        .limit(limit)
        .to_list()
    )
    return [to_read(t) for t in transactions]


@router.get("/{transaction_id}", response_model=TransactionRead)
async def get_transaction(transaction_id: str):
    transaction = await Transaction.get(transaction_id)
    if transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    return to_read(transaction)


@router.post("/", response_model=TransactionRead, status_code=status.HTTP_201_CREATED)
async def create_transaction(payload: TransactionCreate):
    account = await Account.get(payload.account_id)
    if account is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")

    category = await Category.get(payload.category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    transaction = Transaction(
        description=payload.description,
        amount=payload.amount,
        date=payload.date,
        type=payload.type,
        account=account,
        category=category,
        tags=payload.tags,
    )
    await transaction.insert()
    return to_read(transaction)


@router.patch("/{transaction_id}", response_model=TransactionRead)
async def update_transaction(transaction_id: str, payload: TransactionUpdate):
    transaction = await Transaction.get(transaction_id)
    if transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    update_data = payload.model_dump(exclude_unset=True, exclude={"account_id", "category_id"})
    for field, value in update_data.items():
        setattr(transaction, field, value)

    if payload.account_id is not None:
        account = await Account.get(payload.account_id)
        if account is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
        transaction.account = account

    if payload.category_id is not None:
        category = await Category.get(payload.category_id)
        if category is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        transaction.category = category

    await transaction.save()
    return to_read(transaction)


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(transaction_id: str):
    transaction = await Transaction.get(transaction_id)
    if transaction is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")
    await transaction.delete()