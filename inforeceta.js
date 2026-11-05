
const nombreReceta = document.getElementById("nombreReceta");
const ingredientesReceta = document.getElementById("ingredientesReceta");
const instruccionesReceta = document.getElementById("instruccionesReceta");
const fotosReceta = document.getElementById("fotosReceta");

const estrellas = document.querySelectorAll("#estrellasCalificar button");
const botonEnviar = document.getElementById("enviarCalificacion");
const mensajeCalificacion = document.getElementById("mensajeCalificacion");
const promedioCalificacion = document.getElementById("promedioCalificacion");

let puntuacionSeleccionada = 0;
let calificacionEnviada = false;
let receta = null;

try {
    receta = JSON.parse(localStorage.getItem("recetaSeleccionada"));
} catch (error) {
    console.error("No se pudo leer la receta:", error);
}

// CARGAR INFORMACION DE LA RECETA

function convertirLista(datos) {
    if (Array.isArray(datos)) {
        return datos;
    }

    if (typeof datos === "string") {
        return datos.split("\n").filter(function (elemento) {
            return elemento.trim() !== "";
        });
    }

    return [];
}

function cargarReceta() {
    if (!receta) {
        nombreReceta.textContent = "No se encontró la receta.";
        return;
    }

    nombreReceta.textContent = receta.nombre || "Receta sin nombre";

    ingredientesReceta.innerHTML = "";

    convertirLista(receta.ingredientes).forEach(function (ingrediente) {
        const elemento = document.createElement("li");
        elemento.textContent = ingrediente;
        ingredientesReceta.appendChild(elemento);
    });

    instruccionesReceta.innerHTML = "";

    convertirLista(receta.instrucciones).forEach(function (instruccion) {
        const elemento = document.createElement("li");
        elemento.textContent = instruccion;
        instruccionesReceta.appendChild(elemento);
    });

    fotosReceta.innerHTML = "";

    if (receta.fotos && receta.fotos.length > 0) {
        receta.fotos.forEach(function (foto) {
            const imagen = document.createElement("img");
            imagen.src = typeof foto === "string" ? foto : foto.url;
            imagen.alt = receta.nombre || "Foto de la receta";
            fotosReceta.appendChild(imagen);
        });
    } else {
        fotosReceta.textContent = "Esta receta no tiene fotos.";
    }
}

// SELECCIONAR ESTRELLAS

estrellas.forEach(function (estrella) {
    estrella.addEventListener("click", function () {
        puntuacionSeleccionada = Number(estrella.dataset.valor);

        estrellas.forEach(function (otraEstrella) {
            const valor = Number(otraEstrella.dataset.valor);

            if (valor <= puntuacionSeleccionada) {
                otraEstrella.textContent = "★";
            } else {
                otraEstrella.textContent = "☆";
            }

            otraEstrella.style.color = "#FFD700";
        });

        calificacionEnviada = false;

        mensajeCalificacion.textContent =
            "La calificación se enviará cuando salgas de esta pantalla.";
    });
});

// CARGAR CALIFICACION DESDE EL BACKEND

async function cargarCalificacion() {
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
        const cantidadEstrellas = Math.round(promedio);

        promedioCalificacion.textContent =
            `${"★".repeat(cantidadEstrellas)}${"☆".repeat(5 - cantidadEstrellas)} (${promedio.toFixed(1)}/5 - ${resultado.cantidad} calificaciones)`;

    } catch (error) {
        console.error("Error al cargar la calificación:", error);

        promedioCalificacion.textContent =
            "No se pudo cargar la calificación.";
    }
}

// ENVIAR CALIFICACION AL SALIR DE LA PANTALLA

async function enviarCalificacion() {
    if (puntuacionSeleccionada === 0 || calificacionEnviada) {
        return;
    }

    if (!receta || !receta.id) {
        return;
    }

    calificacionEnviada = true;

    try {
        const respuesta = await fetch(
            `http://localhost:3000/recetas/${encodeURIComponent(receta.id)}/calificacion`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                keepalive: true,
                body: JSON.stringify({
                    puntuacion: puntuacionSeleccionada
                })
            }
        );

        if (!respuesta.ok) {
            calificacionEnviada = false;
            console.error("No se pudo guardar la calificación.");
        }

    } catch (error) {
        calificacionEnviada = false;
        console.error("Error al enviar la calificación:", error);
    }
}

// BOTON DE CALIFICAR

botonEnviar.addEventListener("click", function () {
    if (puntuacionSeleccionada === 0) {
        mensajeCalificacion.textContent =
            "Primero elegí una puntuación.";
        return;
    }

    mensajeCalificacion.textContent =
        "Tu calificación se enviará cuando salgas de esta pantalla.";
});

// DETECTAR CUANDO SE SALE DE LA PAGINA

window.addEventListener("pagehide", enviarCalificacion);

// EJECUTAR AL ABRIR LA PAGINA

cargarReceta();
cargarCalificacion();
