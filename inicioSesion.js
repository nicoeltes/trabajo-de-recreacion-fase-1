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
            mensaje.textContent = resultado.mensaje || "Usuario o contraseña incorrectos.";
            mensaje.style.color = "red";
            return;
        }

        // Guarda el usuario para usarlo en las otras páginas (perfil, recetas, etc.)
        localStorage.setItem(
            "usuarioActual",
            JSON.stringify({
                id_usuario: resultado.id_usuario,
                usuario: usuario
            })
        );

        mensaje.textContent = resultado.mensaje;
        mensaje.style.color = "white";

        window.location.href = "pagina principal.html";

    } catch (error) {
        console.log(error);

        mensaje.textContent = "No se pudo conectar con el servidor.";
        mensaje.style.color = "red";
    }
});