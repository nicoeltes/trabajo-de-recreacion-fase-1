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
