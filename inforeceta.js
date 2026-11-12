const API = "http://localhost:3000";

const nombreReceta = document.getElementById("nombreReceta");
const ingredientesReceta = document.getElementById("ingredientesReceta");
const instruccionesReceta = document.getElementById("instruccionesReceta");
const fotosReceta = document.getElementById("fotosReceta");

const estrellas = document.querySelectorAll("#estrellasCalificar button");
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

function obtenerUsuarioActual() {
    try {
        return JSON.parse(localStorage.getItem("usuarioActual"));
    } catch (error) {
        return null;
    }
}

// MOSTRAR LA RECETA

function cargarReceta() {
    if (!receta) {
        nombreReceta.textContent = "No se encontró la receta.";
        return;
    }

    nombreReceta.textContent = receta.titulo;

    ingredientesReceta.innerHTML = "";

    receta.ingredientes.forEach(function (ingrediente) {
        const elemento = document.createElement("li");
        elemento.textContent = ingrediente;
        ingredientesReceta.appendChild(elemento);
    });

    instruccionesReceta.innerHTML = "";

    receta.pasos.forEach(function (paso) {
        const elemento = document.createElement("li");
        elemento.textContent = paso;
        instruccionesReceta.appendChild(elemento);
    });

    fotosReceta.innerHTML = "";

    if (receta.foto) {
        const imagen = document.createElement("img");
        imagen.src = receta.foto;
        imagen.alt = receta.titulo;
        fotosReceta.appendChild(imagen);
    } else {
        fotosReceta.textContent = "Esta receta no tiene fotos.";
    }
}

// ELEGIR ESTRELLAS

estrellas.forEach(function (estrella) {
    estrella.addEventListener("click", function () {
        puntuacionSeleccionada = Number(estrella.dataset.valor);

        estrellas.forEach(function (otraEstrella) {
            const valor = Number(otraEstrella.dataset.valor);

            otraEstrella.textContent = valor <= puntuacionSeleccionada ? "★" : "☆";
            otraEstrella.style.color = "#FFD700";
        });

        calificacionEnviada = false;

        const usuarioActual = obtenerUsuarioActual();

        mensajeCalificacion.textContent =
            usuarioActual && usuarioActual.id_usuario
                ? "La calificación se enviará cuando salgas de esta pantalla."
                : "Tenés que iniciar sesión para calificar.";
    });
});

// TRAER LAS CALIFICACIONES DEL BACK Y CALCULAR EL PROMEDIO

async function cargarCalificacion() {
    if (!receta) {
        return;
    }

    try {
        const respuesta = await fetch(API + "/recetas/" + receta.id_receta + "/calificaciones");

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar la calificación.");
        }

        const calificaciones = await respuesta.json();

        if (calificaciones.length === 0) {
            promedioCalificacion.textContent = "Todavía no hay calificaciones.";
            return;
        }

        let suma = 0;

        calificaciones.forEach(function (calificacion) {
            suma = suma + calificacion.estrellas;
        });

        const promedio = suma / calificaciones.length;
        const cantidadEstrellas = Math.round(promedio);

        promedioCalificacion.textContent =
            "★".repeat(cantidadEstrellas) + "☆".repeat(5 - cantidadEstrellas) +
            " (" + promedio.toFixed(1) + "/5)";

    } catch (error) {
        console.error("Error al cargar la calificación:", error);

        promedioCalificacion.textContent = "No se pudo cargar la calificación.";
    }
}

// MANDAR LA CALIFICACION AL BACK CUANDO SE SALE DE LA PAGINA

async function enviarCalificacion() {
    const usuarioActual = obtenerUsuarioActual();

    if (
        puntuacionSeleccionada === 0 ||
        calificacionEnviada ||
        !receta ||
        !usuarioActual ||
        !usuarioActual.id_usuario
    ) {
        return;
    }

    calificacionEnviada = true;

    try {
        await fetch(API + "/recetas/" + receta.id_receta + "/calificaciones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            keepalive: true,
            body: JSON.stringify({
                id_usuario: usuarioActual.id_usuario,
                estrellas: puntuacionSeleccionada,
                descripcion: "",
                foto: null
            })
        });
    } catch (error) {
        calificacionEnviada = false;
        console.error("Error al enviar la calificación:", error);
    }
}

window.addEventListener("pagehide", enviarCalificacion);

cargarReceta();
cargarCalificacion();   