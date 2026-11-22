const API = "http://localhost:3000";

const zonaRecetas = document.getElementById("zone");

const botonFiltros = document.getElementById("botonFiltros");
const panelFiltros = document.getElementById("panelFiltros");
const cerrarFiltros = document.getElementById("cerrarFiltros");
const limpiarFiltros = document.getElementById("limpiarFiltros");

const buscador = document.getElementById("busqueda");

const opcionesCalificacion = document.querySelectorAll(".opcionesCalificacion input");
const opcionesRestriccion = document.querySelectorAll(".opcionesRestriccion input");

let todasLasRecetas = [];

async function cargarRecetas() {
    zonaRecetas.innerHTML = "";

    try {
        const respuesta = await fetch(API + "/recetas");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las recetas.");
        }

        todasLasRecetas = await respuesta.json();

        mostrarRecetas(todasLasRecetas);

        await calcularPromedios();

    } catch (error) {
        console.error("Error al cargar las recetas:", error);

        zonaRecetas.textContent =
            "No se pudieron cargar las recetas. Verificá que el servidor esté funcionando.";
    }
}

// Trae las calificaciones de cada receta y calcula su promedio (de 1 a 5)
async function calcularPromedios() {
    await Promise.all(todasLasRecetas.map(async function (receta) {
        try {
            const respuesta = await fetch(API + "/recetas/" + receta.id_receta + "/calificaciones");
            const calificaciones = await respuesta.json();

            if (calificaciones.length === 0) {
                receta.promedio = 0;
                return;
            }

            let suma = 0;

            calificaciones.forEach(function (calificacion) {
                suma = suma + calificacion.estrellas;
            });

            receta.promedio = suma / calificaciones.length;

        } catch (error) {
            receta.promedio = 0;
        }
    }));
}

function mostrarRecetas(recetas) {
    zonaRecetas.innerHTML = "";

    if (recetas.length === 0) {
        zonaRecetas.textContent = "No se encontraron recetas.";
        return;
    }

    recetas.forEach(function (receta) {
        const articulo = document.createElement("article");
        articulo.classList.add("recetas");

        articulo.addEventListener("click", function () {
            localStorage.setItem("idRecetaSeleccionada", receta.id_receta);
            window.location.href = "inforeceta.html";
        });

        const foto = document.createElement("section");
        foto.classList.add("foto");

        if (receta.foto) {
            const imagen = document.createElement("img");

            imagen.src = receta.foto;
            imagen.alt = receta.titulo;
            imagen.style.width = "100%";
            imagen.style.height = "100%";
            imagen.style.objectFit = "cover";

            // Si la foto no existe, se muestra el nombre en vez de una imagen rota
            imagen.addEventListener("error", function () {
                foto.textContent = receta.titulo;
            });

            foto.appendChild(imagen);
        } else {
            foto.textContent = receta.titulo;
        }

        const nombre = document.createElement("h2");
        nombre.textContent = receta.titulo;

        articulo.appendChild(foto);
        articulo.appendChild(nombre);

        zonaRecetas.appendChild(articulo);
    });
}

function aplicarFiltros() {
    const calificacionesSeleccionadas = Array.from(opcionesCalificacion)
        .filter(opcion => opcion.checked)
        .map(opcion => Number(opcion.value));

    const restriccionesSeleccionadas = Array.from(opcionesRestriccion)
        .filter(opcion => opcion.checked)
        .map(opcion => opcion.value);

    const textoBuscado = buscador.value.trim().toLowerCase();

    const recetasFiltradas = todasLasRecetas.filter(function (receta) {
        const cumpleBusqueda = receta.titulo.toLowerCase().includes(textoBuscado);

        // Cada opción es un intervalo: "1" = de 1 a 2, "2" = de 2 a 3, ..., "4" = de 4 a 5
        const promedio = receta.promedio || 0;

        const cumpleCalificacion =
            calificacionesSeleccionadas.length === 0 ||
            calificacionesSeleccionadas.some(function (desde) {
                if (desde === 4) {
                    return promedio >= 4 && promedio <= 5;
                }

                return promedio >= desde && promedio < desde + 1;
            });

        const cumpleRestriccion =
            restriccionesSeleccionadas.length === 0 ||
            restriccionesSeleccionadas.some(restriccion => receta[restriccion] === true);

        return cumpleBusqueda && cumpleCalificacion && cumpleRestriccion;
    });

    mostrarRecetas(recetasFiltradas);
}

botonFiltros.addEventListener("click", function () {
    panelFiltros.classList.toggle("mostrar");
});

cerrarFiltros.addEventListener("click", function () {
    panelFiltros.classList.remove("mostrar");
});

opcionesCalificacion.forEach(opcion => opcion.addEventListener("change", aplicarFiltros));
opcionesRestriccion.forEach(opcion => opcion.addEventListener("change", aplicarFiltros));

limpiarFiltros.addEventListener("click", function () {
    opcionesCalificacion.forEach(opcion => opcion.checked = false);
    opcionesRestriccion.forEach(opcion => opcion.checked = false);

    aplicarFiltros();
});

// BUSCADOR: filtra mientras escribís
buscador.addEventListener("input", aplicarFiltros);

cargarRecetas();