const API = "http://localhost:3000";

const formulario = document.getElementById("loginForm");

const contraseñaActual = document.getElementById("password");
const contraseñaNueva = document.getElementById("passwordnueva");
const confirmarContraseña = document.getElementById("Confirmarpassword");
const mensaje = document.getElementById("mensaje");

function obtenerUsuarioActual() {
    try {
        return JSON.parse(localStorage.getItem("usuarioActual"));
    } catch (error) {
        return null;
    }
}

// Muestra el cartel de abajo: tipo puede ser "exito" o "error"
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = tipo;
}

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    mostrarMensaje("", "");

    const usuarioActual = obtenerUsuarioActual();

    if (!usuarioActual || !usuarioActual.id_usuario) {
        mostrarMensaje("Tenés que iniciar sesión para cambiar la contraseña.", "error");
        return;
    }

    if (
        contraseñaActual.value === "" ||
        contraseñaNueva.value === "" ||
        confirmarContraseña.value === ""
    ) {
        mostrarMensaje("Completá todos los campos.", "error");
        return;
    }

    if (contraseñaNueva.value !== confirmarContraseña.value) {
        mostrarMensaje("Las contraseñas nuevas no coinciden.", "error");
        return;
    }

    if (contraseñaActual.value === contraseñaNueva.value) {
        mostrarMensaje("La contraseña nueva tiene que ser distinta de la actual.", "error");
        return;
    }

    try {
        const respuesta = await fetch(
            API + "/usuarios/" + usuarioActual.id_usuario + "/contrasena",
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contrasena_actual: contraseñaActual.value,
                    contrasena_nueva: contraseñaNueva.value,
                    confirmar_contrasena: confirmarContraseña.value
                })
            }
        );

        if (!respuesta.ok) {
            // El back responde 400 cuando la contraseña actual está mal
            mostrarMensaje("La contraseña actual es incorrecta.", "error");
            return;
        }

        mostrarMensaje("¡Tu contraseña se cambió correctamente!", "exito");

        // Actualiza la contraseña guardada para que el perfil muestre la nueva
        usuarioActual.contrasena = contraseñaNueva.value;
        localStorage.setItem("usuarioActual", JSON.stringify(usuarioActual));

        formulario.reset();

    } catch (error) {
        console.log(error);

        mostrarMensaje("No se pudo conectar con el servidor.", "error");
    }
});
