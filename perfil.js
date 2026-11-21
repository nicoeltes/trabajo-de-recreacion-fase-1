const API = "http://localhost:3000";

const nombreDeUsuario = document.querySelector(".nombredeusuario");
const correo = document.querySelector(".correo");
const restriccion = document.querySelector(".restriccion");
const campoPassword = document.getElementById("password");

function obtenerUsuarioActual() {
    try {
        return JSON.parse(localStorage.getItem("usuarioActual"));
    } catch (error) {
        return null;
    }
}

async function cargarPerfil() {
    const usuarioActual = obtenerUsuarioActual();

    if (!usuarioActual || !usuarioActual.id_usuario) {
        nombreDeUsuario.textContent = "Tenés que iniciar sesión para ver tu perfil.";
        return;
    }

    try {
        const respuesta = await fetch(API + "/usuarios/" + usuarioActual.id_usuario);

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar el perfil.");
        }

        const usuario = await respuesta.json();

        const restricciones = [];

        if (usuario.celiaco === true) {
            restricciones.push("Celíaco");
        }

        if (usuario.vegano === true) {
            restricciones.push("Vegano");
        }

        if (usuario.vegetariano === true) {
            restricciones.push("Vegetariano");
        }

        nombreDeUsuario.textContent = "Nombre de usuario: " + usuario.usuario;
        correo.textContent = "Correo electrónico: " + usuario.mail;
        restriccion.textContent =
            "Restricción alimenticia: " +
            (restricciones.length > 0 ? restricciones.join(", ") : "Ninguna");

        // El back no devuelve la contraseña: se usa la que se guardó al iniciar sesión
        campoPassword.value = usuarioActual.contrasena || "";

    } catch (error) {
        console.error("Error al cargar el perfil:", error);

        nombreDeUsuario.textContent =
            "No se pudo cargar el perfil. Verificá que el servidor esté funcionando.";
    }
}

// BOTON DEL OJITO: MOSTRAR U OCULTAR LA CONTRASEÑA

const botonMostrarPassword = document.getElementById("mostrarPassword");

botonMostrarPassword.addEventListener("click", function () {
    if (campoPassword.type === "password") {
        campoPassword.type = "text";
    } else {
        campoPassword.type = "password";
    }
});

cargarPerfil();