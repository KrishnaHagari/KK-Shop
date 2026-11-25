from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os

sys.path.append(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)

from database.db import get_all_products, insert_order, get_all_orders

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

@app.route("/api/orders", methods=["POST"])
def create_order():

    data = request.get_json()

    customer_name = data.get("customer_name")
    total = data.get("total")

    insert_order(customer_name, total)

    return jsonify({
        "message": "Order saved successfully!"
    }), 201

@app.route("/api/orders", methods=["GET"])
def display_orders():

    orders = get_all_orders()

    order_list = []

    for order in orders:
        order_list.append({
            "id": order[0],
            "customer_name": order[1],
            "total": order[2],
            "status": order[3],
            "order_date": order[4]
        })

    return jsonify({
        "message": "Orders loaded successfully!",
        "orders": order_list
    })

if __name__ == "__main__":
    app.run(debug=True)