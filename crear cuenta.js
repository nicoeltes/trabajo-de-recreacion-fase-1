const formulario = document.getElementById("loginForm");
const usuario = document.getElementById("usuario");
const email = document.getElementById("Email");
const password = document.getElementById("password");
const confirmarPassword = document.getElementById("Confirmarpassword");
const celiaco = document.getElementById("celiaco");
const veganismo = document.getElementById("veganismo");
const vegetarianismo = document.getElementById("vegetarianismo");
const mensaje = document.getElementById("mensaje");

formulario.addEventListener("submit", async function(evento) {
    evento.preventDefault();

    mensaje.textContent = "";

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
        mensaje.textContent = "Completá todos los campos.";
        mensaje.style.color = "red";
        return;
    }

    if (datosCuenta.contrasena !== datosCuenta.confirmar_contrasena) {
        mensaje.textContent = "Las contraseñas no coinciden.";
        mensaje.style.color = "red";
        return;
    }

    if (!celiaco.checked && !veganismo.checked && !vegetarianismo.checked) {
        mensaje.textContent = "Debés seleccionar al menos una restricción alimenticia.";
        mensaje.style.color = "red";
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
            mensaje.textContent = resultado.mensaje || "No se pudo crear la cuenta.";
            mensaje.style.color = "red";
            return;
        }

        mensaje.textContent = resultado.mensaje || "¡La cuenta se creó correctamente!";
        mensaje.style.color = "green";
        formulario.reset();

    } catch (error) {
        console.error("Error al crear la cuenta:", error);

        mensaje.textContent = "No se pudo conectar con el servidor.";
        mensaje.style.color = "red";
    }
});