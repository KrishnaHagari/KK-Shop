console.log("KK SHOP UPDATED CODE LOADED");
// 1. Product Details
let products = [
    {
        name: "Shirt",
        price: 500,
        stock: 10
    },
    {
        name: "Jeans",
        price: 1200,
        stock: 5
    },
    {
        name: "T-Shirt",
        price: 400,
        stock: 8
    }
];

// 2. Empty Cart
let cart = [];

// 3. Display Products
let productList = document.getElementById("product-list");

for (let i = 0; i < products.length; i++) {

    let status;

    if (products[i].stock > 0) {
        status = "In Stock";
    } else {
        status = "Out of Stock";
    }

    productList.innerHTML += `
        <div class="product-card">
            <h3>${products[i].name}</h3>
            <p>Price: ₹${products[i].price}</p>
            <p>Stock: ${products[i].stock}</p>
            <p>${status}</p>
            <button onclick="addToCart(${i})">Add to Cart</button>
        </div>
    `;
}

// 4. Add to Cart Function
function addToCart(index) {

    let selectedProduct = products[index];

    if (selectedProduct.stock <= 0) {
        alert("Out of Stock!");
        return;
    }

    let existingProduct = cart.find(
        item => item.name === selectedProduct.name
    );

    if (existingProduct)
        {

    if (existingProduct.quantity >= selectedProduct.stock) {
        alert("Maximum stock reached!");
        return;
    }
    
        existingProduct.quantity++;
    } else {
        cart.push({...selectedProduct, quantity: 1});
    }

    // 5. Update Cart Count
    let cartCount = document.getElementById("cart-count");
    let cartItems = document.getElementById("cart-items");

    let totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    cartCount.innerText = "My Cart: " + totalQuantity;
    let totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
);

document.getElementById("cart-total").innerText =
    "Total: ₹" + totalAmount;

    // 6. Display Cart Products
    cartItems.innerHTML = "";

    for (let item of cart) {
    cartItems.innerHTML += `
        <p>${item.name} - Price: ₹${item.price} - Quantity: ${item.quantity}
        <button onclick="increaseQuantity('${item.name}')">+</button>
        <button onclick="decreaseQuantity('${item.name}')">-</button>
        <button onclick="removeFromCart('${item.name}')">Remove
                </button>
        </p>
    `;
}
}

function increaseQuantity(productName) {
    let item = cart.find(
        product => product.name === productName
    );

    let originalProduct = products.find(
        product => product.name === productName
    );

    if (item.quantity >= originalProduct.stock) {
        alert("Maximum stock reached!");
        return;
    }

    item.quantity++;

    updateCart();
}

function decreaseQuantity(productName) {
    let item = cart.find(
        product => product.name === productName
    );

    if (item.quantity > 1) {
        item.quantity--;
    } else {
        cart = cart.filter(
            product => product.name !== productName
        );
    }

    updateCart();
}

function removeFromCart(productName) {
    cart = cart.filter(
        item => item.name !== productName
    );

    updateCart();
}

function updateCart() {
    let cartItems = document.getElementById("cart-items");

    cartItems.innerHTML = "";

    for (let item of cart) {
        cartItems.innerHTML += `
            <p>
                ${item.name} - ₹${item.price}
                Quantity: ${item.quantity}
                <button onclick="increaseQuantity('${item.name}')">+</button>
                <button onclick="decreaseQuantity('${item.name}')">-</button>
                <button onclick="removeFromCart('${item.name}')">Remove
                </button>
            </p>
        `;
    }

    let totalQuantity = cart.reduce(
        (sum, item) => sum + item.quantity, 0
    );

    document.getElementById("cart-count").innerText =
        "My Cart: " + totalQuantity;

    let totalAmount = cart.reduce(
        (sum, item) => sum + item.price * item.quantity, 0
    );

    document.getElementById("cart-total").innerText =
        "Total: ₹" + totalAmount;
}

let checkoutButton = document.getElementById("checkout-btn");

checkoutButton.addEventListener("click", checkout);

function checkout() {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    alert("Order placed successfully!");

    cart = [];

    updateCart();
}