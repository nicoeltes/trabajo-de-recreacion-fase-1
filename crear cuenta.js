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


// BOTON PARA VER U OCULTAR LA CONTRASEÑA
// Se agrega solo a todos los campos de contraseña de la página

const camposContraseña = document.querySelectorAll('input[type="password"]');

camposContraseña.forEach(function (campo) {

    // Si el campo ya tiene su propio botón (como en el perfil), no se agrega otro
    if (campo.dataset.sinBoton === "true") {
        return;
    }

    // Caja que envuelve el campo y el botón
    const caja = document.createElement("span");
    caja.classList.add("campoContraseña");

    campo.parentNode.insertBefore(caja, campo);
    caja.appendChild(campo);

    // Botón con el ojito
    const boton = document.createElement("button");
    boton.type = "button";
    boton.classList.add("botonVerContraseña");
    boton.title = "Mostrar contraseña";

    const imagen = document.createElement("img");
    imagen.src = "revelar inforacion.png";
    imagen.alt = "Mostrar contraseña";

    boton.appendChild(imagen);
    caja.appendChild(boton);

    // Centra el botón a la altura del campo
    boton.style.top = (campo.offsetHeight - boton.offsetHeight) / 2 + "px";

    boton.addEventListener("click", function () {
        if (campo.type === "password") {
            campo.type = "text";
            boton.title = "Ocultar contraseña";
            boton.classList.add("visible");
        } else {
            campo.type = "password";
            boton.title = "Mostrar contraseña";
            boton.classList.remove("visible");
        }
    });

});
