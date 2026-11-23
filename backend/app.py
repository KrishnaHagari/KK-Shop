from flask import Flask
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

@app.route("/")
def home():
    return "KK Clothes Backend is Running!"

@app.route("/api/products")
def get_products():

    products = [
        {
            "id": 1,
            "name": "Shirt",
            "price": 500,
            "stock": 10,
            "category": "Men",
            "image": "shirt.jpg"
        },
        {
            "id": 2,
            "name": "Jeans",
            "price": 1200,
            "stock": 5,
            "category": "Men",
            "image": "jeans.jpg"
        },
        {
            "id": 3,
            "name": "T-Shirt",
            "price": 400,
            "stock": 8,
            "category": "Men",
            "image": "tshirt.jpg"
        }
    ]

    return {
        "message": "Products loaded successfully!",
        "products": products
    }

if __name__ == "__main__":
    app.run(debug=True)