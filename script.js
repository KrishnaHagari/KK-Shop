console.log("KK SHOP LOADED");

// 1. Product Details

let products = JSON.parse(localStorage.getItem("kkProducts")) || [
  {
    name: "Shirt",
    price: 500,
    stock: 10,
    category: "Men",
    description: "Premium cotton casual shirt",
    image: "shirt.jpg",
  },
  {
    name: "Jeans",
    price: 1200,
    stock: 5,
    category: "Men",
    description: "Premium Black jeans",
    image: "jeans.jpg",
  },
  {
    name: "T-Shirt",
    price: 400,
    stock: 8,
    category: "Men",
    description: "Premium cotton casual T-shirt",
    image: "tshirt.jpg",
  },
];

// 2. Empty Cart

let cart = [];

// 3. Display Products

let productList = document.getElementById("product-list");

function displayProducts(productArray) {
  productList.innerHTML = "";

  for (let i = 0; i < productArray.length; i++) {
    let status;

    if (productArray[i].stock > 0) {
      status = "In Stock";
    } else {
      status = "Out of Stock";
    }

    productList.innerHTML += `
            <div class="product-card">
               <img src="${
                 productArray[i].image.startsWith("data:")
                   ? productArray[i].image
                   : "images/" + productArray[i].image
               }"
    alt="${productArray[i].name}">

                <h3>${productArray[i].name}</h3>

                <p>Price: ₹${productArray[i].price}</p>

                <p>Stock: ${productArray[i].stock}</p>

                <p>${status}</p>

                <button onclick="viewDetails(${products.indexOf(productArray[i])})">
                    View Details
                </button>

                <button onclick="addToCart(${products.indexOf(productArray[i])})">
                    Add to Cart
                </button>

            </div>
        `;
  }
}

displayProducts(products);

// 4. View Product Details

function viewDetails(index) {
  let selectedProduct = products[index];
  let imagePath = "images/" + selectedProduct.image;

  let productDetails = document.getElementById("product-details");

  productDetails.innerHTML = `

    <div class="details-image">
        <img src="${imagePath}" alt="${selectedProduct.name}">

    </div>

    <div class="details-info">

        <h2>${selectedProduct.name}</h2>

        <p class="product-price">
            Price: ₹${selectedProduct.price}
        </p>

        <p class="product-category">
            Category: ${selectedProduct.category}
        </p>

        <p class="stock-status">
            Stock: ${selectedProduct.stock}
        </p>

        <p>${selectedProduct.description}</p>

        <button onclick="closeDetails()">Close Details</button>

    </div>

`;
}

function closeDetails() {
  document.getElementById("product-details").innerHTML = "";
}

// 5. Add to Cart

function addToCart(index) {
  let selectedProduct = products[index];

  if (selectedProduct.stock <= 0) {
    alert("Out of Stock!");
    return;
  }

  let existingProduct = cart.find((item) => item.name === selectedProduct.name);

  if (existingProduct) {
    if (existingProduct.quantity >= selectedProduct.stock) {
      alert("Maximum stock reached!");
      return;
    }

    existingProduct.quantity++;
  } else {
    cart.push({
      ...selectedProduct,
      quantity: 1,
    });
  }

  updateCart();
}

// 6. Increase Quantity

function increaseQuantity(productName) {
  let item = cart.find((product) => product.name === productName);

  let originalProduct = products.find(
    (product) => product.name === productName,
  );

  if (item.quantity >= originalProduct.stock) {
    alert("Maximum stock reached!");
    return;
  }

  item.quantity++;

  updateCart();
}

// 7. Decrease Quantity

function decreaseQuantity(productName) {
  let item = cart.find((product) => product.name === productName);

  if (item.quantity > 1) {
    item.quantity--;
  } else {
    cart = cart.filter((product) => product.name !== productName);
  }

  updateCart();
}

// 8. Remove From Cart

function removeFromCart(productName) {
  cart = cart.filter((item) => item.name !== productName);

  updateCart();
}

// 9. Update Cart

function updateCart() {
  let cartItems = document.getElementById("cart-items");

  cartItems.innerHTML = "";

  for (let item of cart) {
    cartItems.innerHTML += `
            <p>
                ${item.name} - ₹${item.price}

                Quantity: ${item.quantity}

                Subtotal: ₹${item.price * item.quantity}

                <button onclick="increaseQuantity('${item.name}')">
                    +
                </button>

                <button onclick="decreaseQuantity('${item.name}')">
                    -
                </button>

                <button onclick="removeFromCart('${item.name}')">
                    Remove
                </button>

                ${item.name} - ₹${item.price}

                Category: ${item.category}

                Quantity: ${item.quantity}
            </p>
        `;
  }

  let totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.getElementById("cart-count").innerText = "My Cart: " + totalQuantity;

  let totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  document.getElementById("cart-total").innerText = "Total: ₹" + totalAmount;
}

// 10. Checkout

let checkoutButton = document.getElementById("checkout-btn");

checkoutButton.addEventListener("click", checkout);

async function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let orderId = "KK" + Date.now();

  let orderTotal = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  let customerName = document.getElementById("customer-name").value.trim();

  if (customerName === "") {
    alert("Please enter your name!");
    return;
  }
  let newOrder = {
    id: orderId,
    customer: customerName,
    total: orderTotal,
    status: "Pending",
    date: new Date().toLocaleString("en-IN"),
    products: cart.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
  };

  try {
    let response = await fetch("http://127.0.0.1:5000/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_name: customerName,
        total: orderTotal,
      }),
    });

    let data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Order could not be saved!");
    }

    console.log(data.message);
  } catch (error) {
    console.error("Order Error:", error);
    alert("Order failed! Please try again.");
    return;
  }

  let orders = JSON.parse(localStorage.getItem("kkOrders")) || [];

  orders.push(newOrder);

  localStorage.setItem("kkOrders", JSON.stringify(orders));

  for (let item of cart) {
    let product = products.find((product) => product.name === item.name);

    product.stock = product.stock - item.quantity;
  }

  alert("Order placed successfully!");

  cart = [];

  updateCart();

  filterProducts();
}

// 11. Search Products

let searchInput = document.getElementById("search-input");

searchInput.addEventListener("input", filterProducts);

// 12. Category Filter

let categoryFilter = document.getElementById("category-filter");

categoryFilter.addEventListener("change", filterProducts);
// Product Sorting

let sortFilter = document.getElementById("sort-filter");

sortFilter.addEventListener("change", function () {
  console.log("Selected Sort:", sortFilter.value);
  filterProducts();
});
// 13. Filter Products

function filterProducts() {
  let searchText = searchInput.value.toLowerCase();

  let selectedCategory = categoryFilter.value;

  let filteredProducts = products.filter((product) => {
    let matchesSearch = product.name.toLowerCase().includes(searchText);

    let matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  let sortOrder = sortFilter.value;

  if (sortOrder === "low-high") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sortOrder === "high-low") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  displayProducts(filteredProducts);
}

console.log("KK SHOP ALL FEATURES LOADED");

let storeCategories = JSON.parse(localStorage.getItem("kkCategories")) || [
  "Men",
  "Women",
  "Kids",
];

function displayStoreCategories() {
  let categoryFilter = document.getElementById("category-filter");

  categoryFilter.innerHTML = `
        <option value="all">All Categories</option>
    `;

  storeCategories.forEach((category) => {
    let option = document.createElement("option");

    option.value = category;
    option.textContent = category;

    categoryFilter.appendChild(option);
  });
}

displayStoreCategories();

async function loadProductsFromBackend() {
  try {
    let response = await fetch("http://127.0.0.1:5000/api/products");

    let data = await response.json();

    products = data.products;

    filterProducts();

    console.log("Products loaded from Python Backend!");
  } catch (error) {
    console.log("Backend Connection Error:", error);
  }
}

loadProductsFromBackend();
