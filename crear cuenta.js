
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

    const datosCuenta = {
        usuario: usuario.value.trim(),
        email: email.value.trim(),
        password: password.value,
        preferencias: obtenerPreferencias()
    };

    if (
        !datosCuenta.usuario ||
        !datosCuenta.email ||
        !datosCuenta.password ||
        !confirmarPassword.value
    ) {
        mensaje.textContent = "Completá todos los campos.";
        return;
    }

    if (datosCuenta.password !== confirmarPassword.value) {
        mensaje.textContent = "Las contraseñas no coinciden.";
        return;
    }

    if (datosCuenta.preferencias.length === 0) {
        mensaje.textContent = "Debés seleccionar al menos una restricción alimenticia.";
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

        if (!respuesta.ok) {
            mensaje.textContent =
                resultado.mensaje ||
                resultado.message ||
                "No se pudo crear la cuenta.";
            return;
        }

        mensaje.textContent = "¡La cuenta se creó correctamente!";
        formulario.reset();

    } catch (error) {
        mensaje.textContent =
            "No se pudo conectar con el servidor. Verificá que esté iniciado.";

        console.error("Error al crear la cuenta:", error);
    }
});
