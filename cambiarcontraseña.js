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
