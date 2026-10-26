
document.addEventListener("DOMContentLoaded", function () {

    const nombreDeUsuario = document.querySelector(".nombredeusuario");
    const correo = document.querySelector(".correo");
    const restriccion = document.querySelector(".restriccion");
    const password = document.getElementById("password");
    const mostrarPassword = document.getElementById("mostrarPassword");
    const botonCambiar = document.querySelector(".btn-link");

    // Mostrar los datos del usuario
    const usuarioGuardado = localStorage.getItem("usuarioActual");

    if (usuarioGuardado) {
        try {
            const usuario = JSON.parse(usuarioGuardado);

            nombreDeUsuario.textContent =
                "Nombre de usuario: " + (usuario.usuario || "No disponible");

            correo.textContent =
                "Correo electrónico: " + (usuario.email || "No disponible");

            let preferencias = usuario.preferencias;

            if (Array.isArray(preferencias)) {
                preferencias = preferencias.join(", ");
            }

            restriccion.textContent =
                "Restricción alimenticia: " +
                (preferencias || "No disponible");

        } catch (error) {
            console.error("Error al cargar los datos del usuario:", error);
        }
    }

    // Ajustar el ancho según la longitud de la contraseña
    function ajustarAnchoPassword() {
        password.style.width =
            Math.max(30, password.value.length * 15) + "px";
    }

    if (password) {
        ajustarAnchoPassword();
    }

    // Mostrar u ocultar la contraseña
    if (password && mostrarPassword) {
        mostrarPassword.addEventListener("click", function () {

            if (password.type === "password") {
                password.type = "text";
            } else {
                password.type = "password";
            }

            ajustarAnchoPassword();
        });
    }

    // Ir a cambiar contraseña
    if (botonCambiar) {
        botonCambiar.addEventListener("click", function (evento) {
            evento.preventDefault();
            window.location.href = "cambiarcontraseña.html";
        });
    }

});
