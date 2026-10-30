
const zonaRecetas = document.getElementById("zone");

const botonFiltros = document.getElementById("botonFiltros");
const panelFiltros = document.getElementById("panelFiltros");
const cerrarFiltros = document.getElementById("cerrarFiltros");
const limpiarFiltros = document.getElementById("limpiarFiltros");

const opcionesCalificacion = document.querySelectorAll(".opcionesCalificacion input");
const opcionesRestriccion = document.querySelectorAll(".opcionesRestriccion input");

let todasLasRecetas = [];

async function cargarRecetas() {
    zonaRecetas.innerHTML = "";

    try {
        const respuesta = await fetch("http://localhost:3000/recetas");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las recetas.");
        }

        todasLasRecetas = await respuesta.json();

        mostrarRecetas(todasLasRecetas);

    } catch (error) {
        console.error("Error al cargar las recetas:", error);

        zonaRecetas.textContent =
            "No se pudieron cargar las recetas. Verificá que el servidor esté funcionando.";
    }
}

function mostrarRecetas(recetas) {
    zonaRecetas.innerHTML = "";

    if (recetas.length === 0) {
        zonaRecetas.textContent = "No se encontraron recetas con esos filtros.";
        return;
    }

    recetas.forEach(function(receta) {
        const articulo = document.createElement("article");
        articulo.classList.add("recetas");

        const foto = document.createElement("section");
        foto.classList.add("foto");

        if (receta.fotos && receta.fotos.length > 0) {
            const imagen = document.createElement("img");

            imagen.src = receta.fotos[0];
            imagen.alt = receta.nombre;
            imagen.style.width = "100%";
            imagen.style.height = "100%";
            imagen.style.objectFit = "cover";

            foto.appendChild(imagen);
        } else {
            foto.textContent = receta.nombre;
        }

        const nombre = document.createElement("h2");
        nombre.textContent = receta.nombre;

        articulo.appendChild(foto);
        articulo.appendChild(nombre);

        zonaRecetas.appendChild(articulo);
    });
}

function aplicarFiltros() {
    const calificacionesSeleccionadas = Array.from(opcionesCalificacion)
        .filter(function(opcion) {
            return opcion.checked;
        })
        .map(function(opcion) {
            return Number(opcion.value);
        });

    const restriccionesSeleccionadas = Array.from(opcionesRestriccion)
        .filter(function(opcion) {
            return opcion.checked;
        })
        .map(function(opcion) {
            return opcion.value;
        });

    const calificacionMinima = calificacionesSeleccionadas.length > 0
        ? Math.min(...calificacionesSeleccionadas)
        : 0;

    const recetasFiltradas = todasLasRecetas.filter(function(receta) {
        const calificacion = Number(receta.calificacion || 0);

        const cumpleCalificacion =
            calificacionesSeleccionadas.length === 0 ||
            calificacion >= calificacionMinima;

        const cumpleRestriccion =
            restriccionesSeleccionadas.length === 0 ||
            restriccionesSeleccionadas.some(function(restriccion) {
                return (
                    receta[restriccion] === true ||
                    receta[restriccion] === "true" ||
                    (Array.isArray(receta.restricciones) &&
                     receta.restricciones.includes(restriccion))
                );
            });

        return cumpleCalificacion && cumpleRestriccion;
    });

    mostrarRecetas(recetasFiltradas);
}

botonFiltros.addEventListener("click", function() {
    panelFiltros.classList.toggle("mostrar");
});

cerrarFiltros.addEventListener("click", function() {
    panelFiltros.classList.remove("mostrar");
});

opcionesCalificacion.forEach(function(opcion) {
    opcion.addEventListener("change", aplicarFiltros);
});

opcionesRestriccion.forEach(function(opcion) {
    opcion.addEventListener("change", aplicarFiltros);
});

limpiarFiltros.addEventListener("click", function() {
    opcionesCalificacion.forEach(function(opcion) {
        opcion.checked = false;
    });

    opcionesRestriccion.forEach(function(opcion) {
        opcion.checked = false;
    });

    mostrarRecetas(todasLasRecetas);
});

cargarRecetas();
