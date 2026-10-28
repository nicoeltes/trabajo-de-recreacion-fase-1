
formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    const datosReceta = new FormData();

    datosReceta.append(
        "nombre",
        document.getElementById("nombre").value.trim()
    );

    datosReceta.append(
        "ingredientes",
        JSON.stringify(
            ingredientes.value
                .split("\n")
                .map(item => item.replace(/^- /, "").trim())
                .filter(item => item !== "")
        )
    );

    datosReceta.append(
        "instrucciones",
        JSON.stringify(
            instrucciones.value
                .split("\n")
                .map(item => item.replace(/^- /, "").trim())
                .filter(item => item !== "")
        )
    );

    Array.from(fotos.files).forEach(function(foto) {
        datosReceta.append("fotos", foto);
    });

    try {
        const respuesta = await fetch("http://localhost:3000/recetas", {
            method: "POST",
            body: datosReceta
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo enviar la receta.");
        }

        mensaje.textContent = "¡La receta se envió correctamente!";
        formulario.reset();
        vistaFotos.innerHTML = "";
        textoFotos.textContent = "Subir foto/s";

    } catch (error) {
        mensaje.textContent =
            "No se pudo conectar con el servidor. Verificá que esté iniciado.";
    }
});
