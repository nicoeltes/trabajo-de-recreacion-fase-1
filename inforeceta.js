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

// En recetas.html se guarda solo el número de la receta que tocaste
const idReceta = localStorage.getItem("idRecetaSeleccionada");

function obtenerUsuarioActual() {
    try {
        return JSON.parse(localStorage.getItem("usuarioActual"));
    } catch (error) {
        return null;
    }
}

// TRAER LA RECETA DEL BACK

async function cargarReceta() {
    if (!idReceta) {
        nombreReceta.textContent = "No se encontró la receta.";
        return;
    }

    try {
        const respuesta = await fetch(API + "/recetas?id_receta=" + idReceta);

        if (!respuesta.ok) {
            throw new Error("No se encontró la receta.");
        }

        receta = await respuesta.json();

        mostrarReceta();
        cargarCalificacion();

    } catch (error) {
        console.error("Error al cargar la receta:", error);

        nombreReceta.textContent = "No se pudo cargar la receta.";
    }
}

// MOSTRAR LA RECETA EN LA PÁGINA

function mostrarReceta() {
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

    if (!receta.foto) {
        fotosReceta.textContent = "Esta receta no tiene fotos.";
        return;
    }

    const imagen = document.createElement("img");
    imagen.src = receta.foto;
    imagen.alt = receta.titulo;

    // Si la foto no existe (por ejemplo "pizza.jpg"), se avisa en vez de mostrar una imagen rota
    imagen.addEventListener("error", function () {
        fotosReceta.textContent = "No se pudo cargar la foto de esta receta.";
    });

    fotosReceta.appendChild(imagen);
}

// ELEGIR ESTRELLAS
// Si tocás dos veces la misma estrella, se borra la calificación

function pintarEstrellas() {
    estrellas.forEach(function (estrella) {
        const valor = Number(estrella.dataset.valor);

        estrella.textContent = valor <= puntuacionSeleccionada ? "★" : "☆";
    });
}

estrellas.forEach(function (estrella) {
    estrella.addEventListener("click", function () {
        const valor = Number(estrella.dataset.valor);

        if (valor === puntuacionSeleccionada) {
            // Segundo toque en la misma estrella: se borra todo
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

// TRAER LAS CALIFICACIONES DEL BACK Y CALCULAR EL PROMEDIO

async function cargarCalificacion() {
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

// MANDAR LA CALIFICACIÓN AL BACK CUANDO SE SALE DE LA PÁGINA

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

// Cuando tocás un link para irte (Volver o el logo), primero se manda la calificación,
// se espera a que llegue al back y después se cambia de página
document.addEventListener("click", async function (evento) {
    const link = evento.target.closest("a");

    if (!link || puntuacionSeleccionada === 0 || calificacionEnviada) {
        return;
    }

    evento.preventDefault();

    await enviarCalificacion();

    window.location.href = link.href;
});

// Por si se cierra la pestaña o se usa la flecha de atrás del navegador
window.addEventListener("pagehide", enviarCalificacion);

cargarReceta();
