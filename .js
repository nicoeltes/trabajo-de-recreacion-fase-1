const formLogin = document.getElementById("loginForm");

formLogin.addEventListener("submit", function(e) {

    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioExiste = usuarios.find(function(u) {
        return u.usuario === usuario;
    });

    const usuarioValido = usuarios.find(function(u) {
        return u.usuario === usuario && u.password === password;
    });

    const mensaje = document.getElementById("mensaje");

    if (!usuarioExiste) {

        mensaje.textContent = "Este usuario no existe.";
        mensaje.style.color = "red";

    } else if (!usuarioValido) {

        mensaje.textContent = "Contraseña incorrecta.";
        mensaje.style.color = "red";

    } else {

        window.location.href = "pagina principal.html";

    }

});