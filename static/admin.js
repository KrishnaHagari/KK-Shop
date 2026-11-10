console.log("KK Admin come To Rule");

let adminProducts = [
  { name: "Shirt", stock: 10 },
  { name: "Jeans", stock: 5 },
  { name: "T-Shirt", stock: 8 },
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
            <td>${product.stock}</td>
            <td class="${statusClass}">${status}</td>
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
