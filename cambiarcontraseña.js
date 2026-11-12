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

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    mensaje.textContent = "";

    const usuarioActual = obtenerUsuarioActual();

    if (!usuarioActual || !usuarioActual.id_usuario) {
        mensaje.textContent = "Tenés que iniciar sesión para cambiar la contraseña.";
        mensaje.style.color = "red";
        return;
    }

    if (
        contraseñaActual.value === "" ||
        contraseñaNueva.value === "" ||
        confirmarContraseña.value === ""
    ) {
        mensaje.textContent = "Completá todos los campos.";
        mensaje.style.color = "red";
        return;
    }

    if (contraseñaNueva.value !== confirmarContraseña.value) {
        mensaje.textContent = "Las contraseñas nuevas no coinciden.";
        mensaje.style.color = "red";
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

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.textContent = resultado.mensaje || "No se pudo cambiar la contraseña.";
            mensaje.style.color = "red";
            return;
        }

        mensaje.textContent = resultado.mensaje || "La contraseña se cambió correctamente.";
        mensaje.style.color = "green";

        formulario.reset();

    } catch (error) {
        console.log(error);

        mensaje.textContent = "No se pudo conectar con el servidor.";
        mensaje.style.color = "red";
    }
});