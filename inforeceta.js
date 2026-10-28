let puntuacionSeleccionada = 0;

const estrellas = document.querySelectorAll("#estrellasCalificar button");
const botonEnviar = document.getElementById("enviarCalificacion");
const mensajeCalificacion = document.getElementById("mensajeCalificacion");
const promedioCalificacion = document.getElementById("promedioCalificacion");

estrellas.forEach(function (estrella) {
    estrella.addEventListener("click", function () {
        puntuacionSeleccionada = Number(estrella.dataset.valor);

        estrellas.forEach(function (otraEstrella) {
            const valor = Number(otraEstrella.dataset.valor);

            otraEstrella.textContent =
                valor <= puntuacionSeleccionada ? "★" : "☆";
        });
    });
});

async function cargarCalificacion() {
    const receta = JSON.parse(
        localStorage.getItem("recetaSeleccionada")
    );

    if (!receta || !receta.id) {
        promedioCalificacion.textContent =
            "No se encontró el identificador de la receta.";
        return;
    }

    try {
        const respuesta = await fetch(
            `http://localhost:3000/recetas/${encodeURIComponent(receta.id)}/calificacion`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la calificación.");
        }

        const resultado = await respuesta.json();

        if (resultado.cantidad === 0 || resultado.promedio == null) {
            promedioCalificacion.textContent =
                "Todavía no hay calificaciones.";
            return;
        }

        const promedio = Number(resultado.promedio);

        promedioCalificacion.textContent =
            `${"★".repeat(Math.round(promedio))}${"☆".repeat(5 - Math.round(promedio))} (${promedio.toFixed(1)}/5 - ${resultado.cantidad} calificaciones)`;

    } catch (error) {
        promedioCalificacion.textContent =
            "No se pudo cargar la calificación.";
    }
}

botonEnviar.addEventListener("click", async function () {
    if (puntuacionSeleccionada === 0) {
        mensajeCalificacion.textContent =
            "Primero elegí una puntuación.";
        return;
    }

    const receta = JSON.parse(
        localStorage.getItem("recetaSeleccionada")
    );

    if (!receta || !receta.id) {
        mensajeCalificacion.textContent =
            "No se encontró la receta.";
        return;
    }

    botonEnviar.disabled = true;
    mensajeCalificacion.textContent = "Enviando calificación...";

    try {
        const respuesta = await fetch(
            `http://localhost:3000/recetas/${encodeURIComponent(receta.id)}/calificacion`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    puntuacion: puntuacionSeleccionada
                })
            }
        );

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje || "No se pudo guardar la calificación."
            );
        }

        mensajeCalificacion.textContent =
            resultado.mensaje || "¡Calificación guardada correctamente!";

        puntuacionSeleccionada = 0;

        estrellas.forEach(function (estrella) {
            estrella.textContent = "☆";
        });

        await cargarCalificacion();

    } catch (error) {
        mensajeCalificacion.textContent =
            error.message || "No se pudo conectar con el servidor.";
    } finally {
        botonEnviar.disabled = false;
    }
});

cargarCalificacion();