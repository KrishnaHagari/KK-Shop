let registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  let name = document.getElementById("register-name").value.trim();
  let email = document.getElementById("register-email").value.trim();
  let password = document.getElementById("register-password").value;

  try {
    console.time("Registration Time");
    let response = await fetch("http://127.0.0.1:5000/api/register", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });

    let data = await response.json();

    console.timeEnd("Registration Time");

    alert(data.message);

    if (response.ok) {
      registerForm.reset();
    }
  } catch (error) {
    console.error("Registration Error:", error);

    alert("Registration failed! Please try again.");
  }
});
