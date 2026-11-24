
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

const idReceta = localStorage.getItem("idRecetaSeleccionada");

// OBTENER USUARIO ACTUAL

function obtenerUsuarioActual() {
    try {
        return JSON.parse(localStorage.getItem("usuarioActual"));
    } catch (error) {
        return null;
    }
}

// CARGAR RECETA DEL BACKEND

async function cargarReceta() {

    if (!idReceta) {
        nombreReceta.textContent = "No se encontró la receta.";
        return;
    }

    try {
        const respuesta = await fetch(
            API + "/recetas?id_receta=" + encodeURIComponent(idReceta)
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo encontrar la receta.");
        }

        const datos = await respuesta.json();

        // Aceptar una receta individual o una lista de recetas
        receta = Array.isArray(datos)
            ? datos.find(item => String(item.id_receta) === String(idReceta))
            : datos;

        if (!receta || !receta.id_receta) {
            throw new Error("La receta no existe.");
        }

        mostrarReceta();

        await cargarCalificacion();

    } catch (error) {
        console.error("Error al cargar la receta:", error);

        nombreReceta.textContent = "No se pudo cargar la receta.";
    }
}

// MOSTRAR INFORMACIÓN DE LA RECETA

function mostrarReceta() {

    nombreReceta.textContent = receta.titulo || "Sin título";

    ingredientesReceta.innerHTML = "";

    if (Array.isArray(receta.ingredientes)) {
        receta.ingredientes.forEach(function (ingrediente) {
            const elemento = document.createElement("li");
            elemento.textContent = ingrediente;
            ingredientesReceta.appendChild(elemento);
        });
    }

    instruccionesReceta.innerHTML = "";

    if (Array.isArray(receta.pasos)) {
        receta.pasos.forEach(function (paso) {
            const elemento = document.createElement("li");
            elemento.textContent = paso;
            instruccionesReceta.appendChild(elemento);
        });
    }

    fotosReceta.innerHTML = "";

    if (!receta.foto) {
        fotosReceta.textContent = "Esta receta no tiene fotos.";
        return;
    }

    const imagen = document.createElement("img");

    imagen.src = receta.foto;
    imagen.alt = receta.titulo || "Foto de receta";

    imagen.addEventListener("error", function () {
        fotosReceta.textContent = "No se pudo cargar la foto de esta receta.";
    });

    fotosReceta.appendChild(imagen);
}

// PINTAR ESTRELLAS

function pintarEstrellas() {
    estrellas.forEach(function (estrella) {
        const valor = Number(estrella.dataset.valor);

        estrella.textContent =
            valor <= puntuacionSeleccionada ? "★" : "☆";
    });
}

// SELECCIONAR CALIFICACIÓN

estrellas.forEach(function (estrella) {

    estrella.addEventListener("click", function () {

        const valor = Number(estrella.dataset.valor);

        if (valor === puntuacionSeleccionada) {
            puntuacionSeleccionada = 0;
            pintarEstrellas();
            mensajeCalificacion.textContent = "";
            return;
        }

        puntuacionSeleccionada = valor;
        calificacionEnviada = false;

        pintarEstrellas();

        const usuarioActual = obtenerUsuarioActual();

        mensajeCalificacion.textContent =
            usuarioActual && usuarioActual.id_usuario
                ? "La calificación se enviará cuando salgas de esta pantalla."
                : "Tenés que iniciar sesión para calificar.";
    });
});

// CARGAR CALIFICACIONES

async function cargarCalificacion() {

    try {
        const respuesta = await fetch(
            API + "/recetas/" + receta.id_receta + "/calificaciones"
        );

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las calificaciones.");
        }

        const calificaciones = await respuesta.json();

        if (calificaciones.length === 0) {
            promedioCalificacion.textContent = "Todavía no hay calificaciones.";
            return;
        }

        let suma = 0;

        calificaciones.forEach(function (calificacion) {
            suma += Number(calificacion.estrellas);
        });

        const promedio = suma / calificaciones.length;
        const cantidadEstrellas = Math.round(promedio);

        promedioCalificacion.textContent =
            "★".repeat(cantidadEstrellas) +
            "☆".repeat(5 - cantidadEstrellas) +
            " (" + promedio.toFixed(1) + "/5)";

    } catch (error) {
        console.error("Error al cargar la calificación:", error);

        promedioCalificacion.textContent =
            "No se pudo cargar la calificación.";
    }
}

// ENVIAR CALIFICACIÓN

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
        const respuesta = await fetch(
            API + "/recetas/" + receta.id_receta + "/calificaciones",
            {
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
            }
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo enviar la calificación.");
        }

    } catch (error) {
        calificacionEnviada = false;
        console.error("Error al enviar la calificación:", error);
    }
}

// ENVIAR CALIFICACIÓN AL SALIR

document.addEventListener("click", async function (evento) {

    const link = evento.target.closest("a");

    if (!link || puntuacionSeleccionada === 0 || calificacionEnviada) {
        return;
    }

    evento.preventDefault();

    await enviarCalificacion();

    window.location.href = link.href;
});

// SI SE CIERRA O SE ABANDONA LA PÁGINA

window.addEventListener("pagehide", enviarCalificacion);

// INICIAR

cargarReceta();
