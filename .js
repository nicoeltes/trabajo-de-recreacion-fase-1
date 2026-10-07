const formLogin = document.getElementById("loginForm");

formLogin.addEventListener("submit", function(e) {

    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;

    const mensaje = document.getElementById("mensaje");

    fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            usuario: usuario,
            password: password
        })
    })

    .then(function(respuesta) {
        return respuesta.json();
    })

    .then(function(resultado) {

        if (!resultado.exito) {

            mensaje.textContent = resultado.mensaje;
            mensaje.style.color = "red";

        } else {

            window.location.href = "pagina principal.html";

        }

    })

    .catch(function(error) {

        console.log(error);

        mensaje.textContent = "No se pudo conectar con el servidor.";
        mensaje.style.color = "red";

    });

});