console.log("KK Admin come To Rule");

let adminProducts = JSON.parse(localStorage.getItem("kkProducts")) || [
  { name: "Shirt", price: 500, stock: 10, category: "Men" },
  { name: "Jeans", price: 1200, stock: 5, category: "Men" },
  { name: "T-Shirt", price: 400, stock: 8, category: "Men" },
];

function saveAdminProducts() {
  localStorage.setItem("kkProducts", JSON.stringify(adminProducts));
}

let adminOrders = JSON.parse(localStorage.getItem("kkOrders")) || [
  { id: "KK101", customer: "Rahul", total: 1700, status: "Pending" },
  { id: "KK102", customer: "Ananya", total: 1200, status: "Processing" },
  { id: "KK103", customer: "Kiran", total: 800, status: "Delivered" },
];

function saveAdminOrders() {
  localStorage.setItem("kkOrders", JSON.stringify(adminOrders));
}

let orderSearch = document.getElementById("order-search");

let orderStatusFilter = document.getElementById("order-status-filter");

orderSearch.addEventListener("input", displayAdminOrders);

orderStatusFilter.addEventListener("change", displayAdminOrders);

let productSearch = document.getElementById("product-search");

let productStatusFilter = document.getElementById("product-search-filter");

let productSort = document.getElementById("product-sort");

productSort.addEventListener("change", displayAdminProducts);

productSearch.addEventListener("input", displayAdminProducts);

productStatusFilter.addEventListener("change", displayAdminProducts);

function displayAdminOrders() {
  let adminOrderList = document.getElementById("admin-order-list");

  adminOrderList.innerHTML = "";
  let searchText = orderSearch.value.toLowerCase();

  let selectedStatus = orderStatusFilter.value;

  let filteredOrders = adminOrders.filter((order) => {
    let matchesSearch =
      order.id.toLowerCase().includes(searchText) ||
      order.customer.toLowerCase().includes(searchText);

    let matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  for (let order of filteredOrders) {
    adminOrderList.innerHTML += `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>₹${order.total}</td>
                <td>${order.status}</td>
                <td>${order.date || "Not available"}</td>
                <td>
    <select
    class="order-status-select"
    id="order-status-${adminOrders.indexOf(order)}"
    name="order-status"
    onchange="updateOrderStatus(${adminOrders.indexOf(order)}, this.value)">
        <option value="Pending">Pending</option>
        <option value="Processing">Processing</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
    </select>
</td>
<td>
    <button class="view-details-btn" onclick="viewOrderDetails(${adminOrders.indexOf(order)})">
    View Details
</button>

<button class="delete-order-btn" onclick="deleteOrder(${adminOrders.indexOf(order)})">
    Delete
</button>
</td>
            </tr>
        `;
  }
  if (filteredOrders.length === 0) {
    adminOrderList.innerHTML = `
        <tr>
            <td colspan="7">No Orders Found</td>
        </tr>
    `;
  }
}

displayAdminOrders();

function updateOrderStatus(index, newStatus) {
  adminOrders[index].status = newStatus;

  saveAdminOrders();

  displayAdminOrders();
}

function viewOrderDetails(index) {
  let order = adminOrders[index];

  let productDetails = "";

  if (order.products) {
    for (let item of order.products) {
      productDetails +=
        "\n" +
        item.name +
        " - Qty: " +
        item.quantity +
        " - Price: ₹" +
        item.price;
    }
  } else {
    productDetails = "\nProduct details not available";
  }

  alert(
    "Order ID: " +
      order.id +
      "\nCustomer: " +
      order.customer +
      "\nProducts: " +
      productDetails +
      "\nTotal Amount: ₹" +
      order.total +
      "\nStatus: " +
      order.status,
  );
}

function displayAdminProducts() {
  let totalProducts = adminProducts.length;

  let availableStock = adminProducts.reduce(
    (total, product) => total + product.stock,
    0,
  );

  let lowStockCount = adminProducts.filter(
    (product) => product.stock > 0 && product.stock <= 5,
  ).length;

  let outStockCount = adminProducts.filter(
    (product) => product.stock === 0,
  ).length;

  document.getElementById("out-stock-count").innerText = outStockCount;

  document.getElementById("low-stock-count").innerText = lowStockCount;

  document.getElementById("total-products").innerText = totalProducts;

  document.getElementById("total-orders").innerText = adminOrders.length;

  document.getElementById("available-stock").innerText = availableStock;

  let adminProductList = document.getElementById("admin-product-list");
  adminProductList.innerHTML = "";

  let searchText = productSearch.value.toLowerCase();

  let selectedStatus = productStatusFilter.value;

  let filteredProducts = adminProducts.filter((product) => {
    let matchesSearch =
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText);

    let matchesStatus = true;

    if (selectedStatus === "in-stock") {
      matchesStatus = product.stock > 5;
    } else if (selectedStatus === "low-stock") {
      matchesStatus = product.stock > 0 && product.stock <= 5;
    } else if (selectedStatus === "out-stock") {
      matchesStatus = product.stock === 0;
    }

    return matchesSearch && matchesStatus;
  });

  let sortOrder = productSort.value;

  if (sortOrder === "price-low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "price-high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortOrder === "stock-low") {
    filteredProducts.sort((a, b) => a.stock - b.stock);
  } else if (sortOrder === "stock-high") {
    filteredProducts.sort((a, b) => b.stock - a.stock);
  }

  for (let product of filteredProducts) {
    let status;

    let statusClass;

    if (product.stock === 0) {
      status = "Out of Stock";
      statusClass = "out-stock";
    } else if (product.stock <= 5) {
      status = "Low Stock";
      statusClass = "low-stock";
    } else {
      status = "In Stock";
      statusClass = "in-stock";
    }

    adminProductList.innerHTML += `
        <tr>
            <td>${product.name}</td>
            <td>${product.price || 0}</td>
            <td>${product.stock}</td>
            <td class="${statusClass}">${status}</td>
            <td>${product.category || "Uncategorized"}</td>
            <td>
    <button onclick="editProduct(${adminProducts.indexOf(product)})">
        Edit
    </button>

    <button onclick="deleteProduct(${adminProducts.indexOf(product)})">
        Delete
    </button>

    <button onclick="updateStock(${adminProducts.indexOf(product)}, 1)">
    Stock +
</button>

<button onclick="updateStock(${adminProducts.indexOf(product)}, -1)">
    Stock -
</button>

<button onclick="setStock(${adminProducts.indexOf(product)})">
    Update Stock
</button>
</td>
        </tr>
    `;
  }
  if (filteredProducts.length === 0) {
    adminProductList.innerHTML = `
        <tr>
            <td colspan="6">No Products Found</td>
        </tr>
    `;
  }
}
displayAdminProducts();

function updateStock(index, change) {
  if (adminProducts[index].stock + change < 0) {
    alert("Stock cannot be negative!");
    return;
  }

  adminProducts[index].stock += change;

  saveAdminProducts();

  displayAdminProducts();
}

function setStock(index) {
  let newStock = prompt("Enter New Stock Quantity:");

  if (newStock === null || newStock.trim() === "") {
    return;
  }

  newStock = Number(newStock);

  if (!Number.isInteger(newStock) || newStock < 0) {
    alert("Please enter a valid stock quantity!");
    return;
  }

  adminProducts[index].stock = newStock;

  saveAdminProducts();

  displayAdminProducts();
}

let productForm = document.getElementById("product-form");
productForm.addEventListener("submit", function (event) {
  event.preventDefault();

  console.log("Add Product Form Submitted");

  let productName = document.getElementById("product-name").value;
  let productPrice = Number(document.getElementById("product-price").value);
  let productStock = Number(document.getElementById("product-stock").value);
  let productCategory = document.getElementById("product-category").value;

  console.log(productName, productPrice, productStock, productCategory);

  let newProduct = {
    name: productName,
    price: productPrice,
    stock: productStock,
    category: productCategory,
  };

  console.log(newProduct);

  let duplicateProduct = adminProducts.some((product) => {
    return product.name.toLowerCase() === productName.toLowerCase();
  });

  if (duplicateProduct) {
    alert("Product already exists!");
    return;
  }

  adminProducts.push(newProduct);
  saveAdminProducts();
  displayAdminProducts();
  productForm.reset();

  console.log(adminProducts);
});

function deleteOrder(index) {
  let confirmDelete = confirm("Are you sure you want to delete this order?");

  if (confirmDelete) {
    adminOrders.splice(index, 1);

    saveAdminOrders();

    displayAdminOrders();
    displayAdminProducts();
  }
}

function deleteProduct(index) {
  adminProducts.splice(index, 1);
  saveAdminProducts();
  displayAdminProducts();
}

function editProduct(index) {
  let product = adminProducts[index];

  let newName = prompt("Enter Product Name", product.name);

  if (newName === null) return;

  let newPrice = prompt("Enter Product Price", product.price);

  if (newPrice === null) return;

  let newStock = prompt("Enter Product Stock", product.stock);

  let newCategory = prompt("Enter Product Category", product.category);

  if (newCategory === null) return;

  if (newCategory.trim() === "") {
    alert("Please enter valid category!");
    return;
  }

  if (newStock === null) return;

  if (newName.trim() === "") {
    alert("Product name cannot be empty!");
    return;
  }

  if (
    newPrice.trim() === "" ||
    isNaN(Number(newPrice)) ||
    Number(newPrice) <= 0
  ) {
    alert("Please enter valid price!");
    return;
  }

  if (
    newStock.trim() === "" ||
    isNaN(Number(newStock)) ||
    Number(newStock) < 0 ||
    !Number.isInteger(Number(newStock))
  ) {
    alert("Please enter valid whole number stock!");
    return;
  }

  product.name = newName;
  product.price = Number(newPrice);
  product.stock = Number(newStock);
  product.category = newCategory;

  saveAdminProducts();

  displayAdminProducts();
}
