// Obtener los elementos con la clase "input-group-text"
const toggleBtns = document.querySelectorAll(".input-group-text");

// Obtener los elementos input que contienen las contraseñas
const loginPasswordInput = document.querySelector("#login-password");
const signupPasswordInput = document.querySelector("#signup-password");

// Cambiar el tipo de input de contraseña a texto y viceversa al hacer clic en el botón
toggleBtns.forEach(function (toggleBtn) {
  toggleBtn.addEventListener("click", function () {
    if (loginPasswordInput.type === "password") {
      loginPasswordInput.type = "text";
    } else {
      loginPasswordInput.type = "password";
    }

    if (signupPasswordInput.type === "password") {
      signupPasswordInput.type = "text";
    } else {
      signupPasswordInput.type = "password";
    }
  });
});
