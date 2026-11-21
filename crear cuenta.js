const formulario = document.getElementById("loginForm");
const usuario = document.getElementById("usuario");
const email = document.getElementById("Email");
const password = document.getElementById("password");
const confirmarPassword = document.getElementById("Confirmarpassword");
const celiaco = document.getElementById("celiaco");
const veganismo = document.getElementById("veganismo");
const vegetarianismo = document.getElementById("vegetarianismo");
const mensaje = document.getElementById("mensaje");

// Muestra el cartel de abajo: tipo puede ser "exito" o "error"
function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = tipo;
}

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    mostrarMensaje("", "");

    const datosCuenta = {
        usuario: usuario.value.trim(),
        mail: email.value.trim(),
        contrasena: password.value,
        confirmar_contrasena: confirmarPassword.value,
        vegano: veganismo.checked,
        vegetariano: vegetarianismo.checked,
        celiaco: celiaco.checked
    };

    if (
        !datosCuenta.usuario ||
        !datosCuenta.mail ||
        !datosCuenta.contrasena ||
        !datosCuenta.confirmar_contrasena
    ) {
        mostrarMensaje("Completá todos los campos.", "error");
        return;
    }

    if (datosCuenta.contrasena !== datosCuenta.confirmar_contrasena) {
        mostrarMensaje("Las contraseñas no coinciden.", "error");
        return;
    }

    if (!celiaco.checked && !veganismo.checked && !vegetarianismo.checked) {
        mostrarMensaje("Tenés que seleccionar al menos una restricción alimenticia.", "error");
        return;
    }

    try {
        const respuesta = await fetch("http://localhost:3000/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosCuenta)
        });

        const resultado = await respuesta.json();

        if (resultado.id_usuario === undefined) {
            mostrarMensaje("No se pudo crear la cuenta.", "error");
            return;
        }

        // Deja la sesión iniciada con la cuenta nueva
        localStorage.setItem(
            "usuarioActual",
            JSON.stringify({
                id_usuario: resultado.id_usuario,
                usuario: datosCuenta.usuario,
                contrasena: datosCuenta.contrasena
            })
        );

        mostrarMensaje("¡La cuenta se creó correctamente!", "exito");

        // Cuando se toca "Aceptar", lleva a la página principal
        alert("¡La cuenta se creó correctamente!");
        window.location.href = "pagina principal.html";

    } catch (error) {
        console.error("Error al crear la cuenta:", error);

        mostrarMensaje("No se pudo conectar con el servidor.", "error");
    }
});
