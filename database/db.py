import sqlite3

def connect_db():
    connection = sqlite3.connect("database/kkclothes.db")

    return connection

def create_products_table():

    connection = connect_db()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            price REAL NOT NULL,
            stock INTEGER DEFAULT 0,
            category TEXT,
            image TEXT
        )
    """)

    connection.commit()
    connection.close()

def create_orders_table():

    connection = connect_db()

    connection.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            customer_name TEXT NOT NULL,
            total REAL NOT NULL,
            status TEXT DEFAULT 'Pending',
            order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)

    connection.commit()
    connection.close()

    print("Orders Table Created Successfully!")

def insert_order(customer_name, total):

    connection = connect_db()

    connection.execute("""
        INSERT INTO orders (customer_name, total)
        VALUES (?, ?)
    """, (customer_name, total))

    connection.commit()
    connection.close()

    print("Order Saved Successfully!")

def get_all_orders():

    connection = connect_db()

    orders = connection.execute(
        "SELECT * FROM orders"
    ).fetchall()

    connection.close()

    return orders

def insert_sample_products():

    connection = connect_db()

    products = [
        ("Shirt", 500, 10, "Men", "shirt.jpg"),
        ("Jeans", 1200, 5, "Men", "jeans.jpg"),
        ("T-Shirt", 400, 8, "Men", "tshirt.jpg")
    ]

    existing_products = connection.execute(
        "SELECT COUNT(*) FROM products"
    ).fetchone()[0]

    if existing_products > 0:
        connection.close()
        print("Products Already Exist!")
        return

    connection.executemany("""
        INSERT INTO products (name, price, stock, category, image)
        VALUES (?, ?, ?, ?, ?)
    """, products)

    connection.commit()
    connection.close()

    print("Sample Products Inserted Successfully!")

def remove_duplicate_products():

    connection = connect_db()

    connection.execute("""
        DELETE FROM products
        WHERE id NOT IN (
            SELECT MIN(id)
            FROM products
            GROUP BY name, price, stock, category, image
        )
    """)

    connection.commit()
    connection.close()

    print("Duplicate Products Removed!")

def get_all_products():

    connection = connect_db()

    products = connection.execute(
        "SELECT * FROM products"
    ).fetchall()

    connection.close()

    return products

if __name__ == "__main__":

    create_products_table()
    create_orders_table()

    insert_order("Rahul", 1700)

    orders = get_all_orders()

    for order in orders:
        print(order)