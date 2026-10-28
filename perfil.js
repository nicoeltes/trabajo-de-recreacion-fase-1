
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
        mensaje.style.color = "red";
        return;
    }

    if (contraseñaNueva.value !== confirmarContraseña.value) {
        mensaje.textContent = "Las contraseñas nuevas no coinciden.";
        mensaje.style.color = "red";
        return;
    }

    if (contraseñaActual.value === contraseñaNueva.value) {
        mensaje.textContent =
            "La nueva contraseña debe ser diferente de la actual.";
        mensaje.style.color = "red";
        return;
    }

    try {
        const respuesta = await fetch(
            "http://localhost:3000/cambiar-contraseña",
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    contraseñaActual: contraseñaActual.value,
                    contraseñaNueva: contraseñaNueva.value
                })
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.textContent =
                resultado.mensaje ||
                "No se pudo cambiar la contraseña.";
            mensaje.style.color = "red";
            return;
        }

        const usuarioGuardado = localStorage.getItem("usuarioActual");

        if (usuarioGuardado) {
            const usuario = JSON.parse(usuarioGuardado);

            delete usuario.password;

            localStorage.setItem(
                "usuarioActual",
                JSON.stringify(usuario)
            );
        }

        mensaje.textContent =
            resultado.mensaje ||
            "La contraseña se cambió correctamente.";

        mensaje.style.color = "green";

        formulario.reset();

    } catch (error) {
        console.error("Error al cambiar la contraseña:", error);

        mensaje.textContent =
            "No se pudo conectar con el servidor.";
        mensaje.style.color = "red";
    }
});
