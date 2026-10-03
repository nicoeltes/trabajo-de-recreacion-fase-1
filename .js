const titulo = document.querySelector(".h2");

const enlace = document.querySelector(".link");

const botonCrearCuenta = document.querySelector(".crearcuenta");

botonCrearCuenta.addEventListener("click", function() {

    window.location.href = "crear cuenta.html";

});

const formLogin = document.getElementById("loginForm");

formLogin.addEventListener("submit", function(e) {
<<<<<<< HEAD

    e.preventDefault();

    const usuario = document.getElementById("usuario").value;

    const password = document.getElementById("password").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioValido = usuarios.find(function(u) {

        return u.usuario === usuario && u.password === password;

    });

    if (usuarioValido) {

        window.location.href = "pagina principal.html";

    } else {

        const mensaje = document.getElementById("mensaje");

        mensaje.textContent = "Usuario o contraseña incorrectos.";

    }

=======
    e.preventDefault();
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioValido = usuarios.find(function(u) {
    return u.usuario === usuario && u.password === password; 
    });
    if (usuarioValido) {
        window.location.href = "pagina principal.html";
    }else {
        const mensaje = document.getElementById("mensaje");
        mensaje.textContent = "Usuario o contraseña incorrectos.";
    }
>>>>>>> 462108b4040db25f9b90b7a142e7e5c653f41d45
});
