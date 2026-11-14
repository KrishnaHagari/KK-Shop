console.log("KK Admin come To Rule");

let adminProducts = [
  { name: "Shirt", price: 500, stock: 10, category: "Men" },
  { name: "Jeans", price: 1200, stock: 5, category: "Men" },
  { name: "T-Shirt", price: 400, stock: 8, category: "Men" },
];

let adminOrders = [
  { id: "KK101", customer: "Rahul", total: 1700, status: "Pending" },
  { id: "KK102", customer: "Ananya", total: 1200, status: "Processing" },
  { id: "KK103", customer: "Kiran", total: 800, status: "Delivered" },
];

let orderSearch = document.getElementById("order-search");

let orderStatusFilter = document.getElementById("order-status-filter");

orderSearch.addEventListener("input", displayAdminOrders);

orderStatusFilter.addEventListener("change", displayAdminOrders);

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
</td>
            </tr>
        `;
  }
  if (filteredOrders.length === 0) {
    adminOrderList.innerHTML = `
        <tr>
            <td colspan="6">No Orders Found</td>
        </tr>
    `;
  }
}

displayAdminOrders();

function updateOrderStatus(index, newStatus) {
  adminOrders[index].status = newStatus;

  displayAdminOrders();
}

function viewOrderDetails(index) {
  let order = adminOrders[index];

  alert(
    "Order ID: " +
      order.id +
      "\nCustomer: " +
      order.customer +
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

  document.getElementById("total-orders").innerText = 0;

  document.getElementById("available-stock").innerText = availableStock;

  let adminProductList = document.getElementById("admin-product-list");
  adminProductList.innerHTML = "";

  for (let product of adminProducts) {
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
    <button class="edit" onclick="editProduct(${adminProducts.indexOf(product)})">
        Edit
    </button>

    <button class="delete" onclick="deleteProduct(${adminProducts.indexOf(product)})">
        Delete
    </button>
</td>

        </tr>
    `;
  }
}
displayAdminProducts();

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
  displayAdminProducts();
  productForm.reset();

  console.log(adminProducts);
});

function deleteProduct(index) {
  adminProducts.splice(index, 1);

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

  displayAdminProducts();
}
