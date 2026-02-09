
from pydantic import BaseModel, ConfigDict


class ProductBase(BaseModel):
    name: str
    description: str
    price: float
    quantity: int


class ProductCreate(ProductBase):
    """Schema for creating a product (no id from client)."""
    pass


class Product(ProductBase):
    """Schema returned from the API (includes id)."""
    id: int

    # This line is CRITICAL for working with SQLAlchemy
    model_config = ConfigDict(from_attributes=True)
