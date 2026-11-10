console.log("KK Admin come To Rule");

let adminProducts = [
  { name: "Shirt", price: 500, stock: 10 },
  { name: "Jeans", price: 1200, stock: 5 },
  { name: "T-Shirt", price: 400, stock: 8 },
];

function displayAdminProducts() {
  let totalProducts = adminProducts.length;

  let availableStock = adminProducts.reduce(
    (total, product) => total + product.stock,
    0,
  );

  document.getElementById("total-products").innerText = totalProducts;

  document.getElementById("total-orders").innerText = 0;

  document.getElementById("available-stock").innerText = availableStock;

  let adminProductList = document.getElementById("admin-product-list");
  adminProductList.innerHTML = "";

  for (let product of adminProducts) {
    let status;

    let statusClass;

    if (product.stock > 0) {
      status = "In Stock";
      statusClass = "in-stock";
    } else {
      status = "Out of Stock";
      statusClass = "out-stock";
    }

    adminProductList.innerHTML += `
        <tr>
            <td>${product.name}</td>
            <td>${product.price || 0}</td>
            <td>${product.stock}</td>
            <td class="${statusClass}">${status}</td>
            <td>
    <button onclick="editProduct(${adminProducts.indexOf(product)})">
        Edit
    </button>

    <button onclick="deleteProduct(${adminProducts.indexOf(product)})">
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

  if (newStock === null) return;

  product.name = newName;
  product.price = Number(newPrice);
  product.stock = Number(newStock);

  displayAdminProducts();
}
