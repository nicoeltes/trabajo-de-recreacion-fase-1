
const formulario = document.getElementById("loginForm");

const contraseñaActual = document.getElementById("contraseñaActual");
const contraseñaNueva = document.getElementById("contraseñaNueva");
const confirmarContraseña = document.getElementById("confirmarContraseña");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    mensaje.textContent = "";

    if (
        contraseñaActual.value === "" ||
        contraseñaNueva.value === "" ||
        confirmarContraseña.value === ""
    ) {
        mensaje.textContent = "Completá todos los campos.";
        return;
    }

    if (contraseñaNueva.value !== confirmarContraseña.value) {
        mensaje.textContent = "Las contraseñas nuevas no coinciden.";
        return;
    }

    if (contraseñaActual.value === contraseñaNueva.value) {
        mensaje.textContent = "La nueva contraseña debe ser diferente de la actual.";
        return;
    }

    try {
        const respuesta = await fetch("/cambiar-contraseña", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                contraseñaActual: contraseñaActual.value,
                contraseñaNueva: contraseñaNueva.value
            })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.textContent = resultado.mensaje || "No se pudo cambiar la contraseña.";
            return;
        }

        mensaje.textContent = resultado.mensaje || "La contraseña se cambió correctamente.";

        formulario.reset();

    } catch (error) {
        mensaje.textContent = "No se pudo conectar con el servidor.";
    }
});
