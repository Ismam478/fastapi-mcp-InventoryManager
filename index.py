
from fastapi import Depends, FastAPI
from models import Product, ProductCreate
import database_models
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from fastapi_mcp import FastApiMCP
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
database_models.Base.metadata.create_all(bind=engine)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    db = SessionLocal()
    count = db.query(database.Product.count)
    if count == 0:
        for product in products:
            db.add(database_models.Product(**product.model_dump))
        db.commit()

@app.get("/")
def greet():
    return "Hello Guys, Me here!!"


@app.get("/products", response_model=list[Product], operation_id="display_products")
def display_products(db: Session = Depends(get_db)):
    db_products = db.query(database_models.Product).all()
    if db_products:
        return db_products
    else:
        return []

@app.get("/products/{product_id}", response_model=Product, operation_id="get_product_by_id")
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    db_products = db.query(database_models.Product).filter(database_models.Product.id == product_id).first()
    if db_products:
        return db_products
    else:
        return {"id": 0, "name": "", "description": "", "price": 0.0, "quantity": 0}

@app.post("/products", response_model=Product, operation_id="create_products")
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = database_models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

@app.put("/products/{product_id}", response_model=Product, operation_id="update_products")
def update_product(product_id: int, product: ProductCreate, db: Session = Depends(get_db)):
    db_products = db.query(database_models.Product).filter(database_models.Product.id == product_id).first()
    if db_products:
        db_products.id = product_id
        db_products.name = product.name
        db_products.description = product.description
        db_products.price = product.price
        db_products.quantity = product.quantity
        db.commit()
        db.refresh(db_products)
        return db_products
    else:
        return "No Product Found"

@app.delete("/products/{product_id}", operation_id="delete_products")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    db_products = db.query(database_models.Product).filter(database_models.Product.id == product_id).first()
    if db_products:
        db.delete(db_products)
        db.commit()
        return f"ID-'{product_id}' has been Deleted!"
    else:
        return "No Product Found"


mcp = FastApiMCP(app, include_operations = ["display_products", "get_product_by_id", "create_products", "update_products", "delete_products"])
mcp.mount()

# if __name__ == "__main__":
    # import uvicorn
    # uvicorn.run(app, host="127.0.0.1", port= 8000)
