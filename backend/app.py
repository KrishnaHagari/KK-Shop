from flask import Flask
from flask_cors import CORS
import sys
import os

sys.path.append(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)

from database.db import get_all_products

app = Flask(__name__)

CORS(app)

@app.route("/")
def home():
    return "KK Clothes Backend is Running!"

@app.route("/api/products")
def get_products():

    products = get_all_products()

    product_list = []

    for product in products:
        product_list.append({
            "id": product[0],
            "name": product[1],
            "price": product[2],
            "stock": product[3],
            "category": product[4],
            "image": product[5]
        })

    return {
        "message": "Products loaded successfully!",
        "products": product_list
    }

if __name__ == "__main__":
    app.run(debug=True)