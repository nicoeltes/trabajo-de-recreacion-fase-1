const formulario = document.getElementById("loginForm");
const usuario = document.getElementById("usuario");
const email = document.getElementById("Email");
const password = document.getElementById("password");
const confirmarPassword = document.getElementById("Confirmarpassword");
const celiaco = document.getElementById("celiaco");
const veganismo = document.getElementById("veganismo");
const vegetarianismo = document.getElementById("vegetarianismo");
const mensaje = document.getElementById("mensaje");

function obtenerPreferencias() {
    const preferencias = [];

    if (celiaco.checked) {
        preferencias.push("celiaco");
    }

    if (veganismo.checked) {
        preferencias.push("veganismo");
    }

    if (vegetarianismo.checked) {
        preferencias.push("vegetarianismo");
    }

    return preferencias;
}

formulario.addEventListener("submit", async function (evento) {
    evento.preventDefault();

    mensaje.textContent = "";

    const nombreUsuario = usuario.value.trim();
    const correo = email.value.trim();
    const contraseña = password.value;
    const confirmarContraseña = confirmarPassword.value;

    const preferencias = obtenerPreferencias();

    if (preferencias.length === 0) {
        mensaje.textContent = "Debés seleccionar al menos una restricción alimenticia.";
        return;
    }

    if (contraseña !== confirmarContraseña) {
        mensaje.textContent = "Las contraseñas no coinciden.";
        return;
    }

    const datosCuenta = {
        usuario: nombreUsuario,
        email: correo,
        password: contraseña,
        preferencias: preferencias
    };

    try {
        const respuesta = await fetch("http://localhost:3000/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosCuenta)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            mensaje.textContent =
                resultado.mensaje ||
                resultado.message ||
                "No se pudo crear la cuenta.";
            return;
        }

        mensaje.textContent = "¡La cuenta se creó correctamente!";

        formulario.reset();

        celiaco.checked = false;
        veganismo.checked = false;
        vegetarianismo.checked = false;

    } catch (error) {
        mensaje.textContent =
            "No se pudo conectar con el servidor. Verificá que esté iniciado.";

        console.error("Error al crear la cuenta:", error);
    }
});
