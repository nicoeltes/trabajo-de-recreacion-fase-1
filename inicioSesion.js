const API = "http://localhost:3000";

const formLogin = document.getElementById("loginForm");

formLogin.addEventListener("submit", async function(e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value;
    const mensaje = document.getElementById("mensaje");

    mensaje.textContent = "";

    try {
        const respuesta = await fetch(API + "/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                usuario_o_mail: usuario,
                contrasena: password
            })
        });

        const resultado = await respuesta.json();

        // El back manda id_usuario solo cuando el login es correcto
        if (resultado.id_usuario === undefined) {
            mensaje.textContent = "Usuario o contraseña incorrectos.";
            mensaje.style.color = "red";
            return;
        }

        // Guarda el usuario para usarlo en las otras páginas (perfil, recetas, etc.)
        localStorage.setItem(
            "usuarioActual",
            JSON.stringify({
                id_usuario: resultado.id_usuario,
                usuario: usuario,
                contrasena: password
            })
        );

        mensaje.textContent = "Inicio de sesión correcto.";
        mensaje.style.color = "white";

        window.location.href = "pagina principal.html";

    } catch (error) {
        console.log(error);

        mensaje.textContent = "No se pudo conectar con el servidor.";
        mensaje.style.color = "red";
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
