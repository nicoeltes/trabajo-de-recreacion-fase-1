const titulo = document.querySelector(".h2");
const enlace = document.querySelector(".link");
const botonCrearCuenta = document.querySelector(".crearcuenta");
botonCrearCuenta.addEventListener("click", function() {
    window.location.href = "crear cuenta.html";
});
const formLogin = document.getElementById("loginForm");
formLogin.addEventListener("submit", function(e) {
e.preventDefault();
const usuario = document.getElementById("usuario").value;
document.getElementById("usuario").value
const password = document.getElementById("password").value;
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
});
