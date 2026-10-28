
const formLogin = document.getElementById("loginForm");

formLogin.addEventListener("submit", function(e) {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value;
    const mensaje = document.getElementById("mensaje");

    mensaje.textContent = "";

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
    .then(async function(respuesta) {
        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje || "No se pudo iniciar sesión."
            );
        }

        return resultado;
    })
    .then(function(resultado) {
        if (!resultado.exito) {
            mensaje.textContent =
                resultado.mensaje || "Usuario o contraseña incorrectos.";
            mensaje.style.color = "red";
        } else {
            localStorage.setItem(
                "usuarioActual",
                JSON.stringify(resultado.usuario)
            );

            window.location.href = "pagina principal.html";
        }
    })
    .catch(function(error) {
        console.log(error);

        mensaje.textContent = error.message ===
            "Failed to fetch"
            ? "No se pudo conectar con el servidor."
            : error.message;

        mensaje.style.color = "red";
    });
});
