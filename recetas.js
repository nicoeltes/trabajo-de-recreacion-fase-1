
const zonaRecetas = document.getElementById("zone");

const botonFiltros = document.getElementById("botonFiltros");
const panelFiltros = document.getElementById("panelFiltros");
const filtroCalificacion = document.getElementById("filtroCalificacion");
const filtroRestriccion = document.getElementById("filtroRestriccion");
const aplicarFiltros = document.getElementById("aplicarFiltros");
const limpiarFiltros = document.getElementById("limpiarFiltros");

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

botonFiltros.addEventListener("click", function() {
    panelFiltros.classList.toggle("mostrar");
});

aplicarFiltros.addEventListener("click", function() {
    const calificacionMinima = Number(filtroCalificacion.value);
    const restriccion = filtroRestriccion.value;

    const recetasFiltradas = todasLasRecetas.filter(function(receta) {
        const calificacion = Number(receta.calificacion || 0);

        const cumpleCalificacion =
            filtroCalificacion.value === "" ||
            calificacion >= calificacionMinima;

        let cumpleRestriccion = true;

        if (restriccion !== "") {
            cumpleRestriccion =
                receta[restriccion] === true ||
                receta[restriccion] === "true" ||
                (Array.isArray(receta.restricciones) &&
                 receta.restricciones.includes(restriccion));
        }

        return cumpleCalificacion && cumpleRestriccion;
    });

    mostrarRecetas(recetasFiltradas);
    panelFiltros.classList.remove("mostrar");
});

limpiarFiltros.addEventListener("click", function() {
    filtroCalificacion.value = "";
    filtroRestriccion.value = "";

    mostrarRecetas(todasLasRecetas);
});

cargarRecetas();
