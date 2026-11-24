
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

// CARGAR RECETAS DEL BACKEND

async function cargarRecetas() {
    zonaRecetas.innerHTML = "";

    try {
        const respuesta = await fetch(API + "/recetas");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las recetas.");
        }

        todasLasRecetas = await respuesta.json();

        await calcularPromedios();

        aplicarFiltros();

    } catch (error) {
        console.error("Error al cargar las recetas:", error);

        zonaRecetas.textContent =
            "No se pudieron cargar las recetas. Verificá que el servidor esté funcionando.";
    }
}

// CALCULAR PROMEDIOS DE CALIFICACIONES

async function calcularPromedios() {
    await Promise.all(todasLasRecetas.map(async function (receta) {
        try {
            const respuesta = await fetch(
                API + "/recetas/" + receta.id_receta + "/calificaciones"
            );

            if (!respuesta.ok) {
                throw new Error("No se pudieron obtener las calificaciones.");
            }

            const calificaciones = await respuesta.json();

            if (calificaciones.length === 0) {
                receta.promedio = 0;
                return;
            }

            let suma = 0;

            calificaciones.forEach(function (calificacion) {
                suma += Number(calificacion.estrellas);
            });

            receta.promedio = suma / calificaciones.length;

        } catch (error) {
            console.error("Error al calcular promedio:", error);
            receta.promedio = 0;
        }
    }));
}

// MOSTRAR RECETAS

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
            localStorage.setItem(
                "idRecetaSeleccionada",
                receta.id_receta
            );

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

// APLICAR FILTROS

function aplicarFiltros() {
    const calificacionesSeleccionadas = Array.from(opcionesCalificacion)
        .filter(opcion => opcion.checked)
        .map(opcion => Number(opcion.value));

    const restriccionesSeleccionadas = Array.from(opcionesRestriccion)
        .filter(opcion => opcion.checked)
        .map(opcion => opcion.value);

    const textoBuscado = buscador.value.trim().toLowerCase();

    const recetasFiltradas = todasLasRecetas.filter(function (receta) {

        const cumpleBusqueda =
            String(receta.titulo || "").toLowerCase().includes(textoBuscado);

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
            restriccionesSeleccionadas.some(function (restriccion) {
                return receta[restriccion] === true;
            });

        return cumpleBusqueda && cumpleCalificacion && cumpleRestriccion;
    });

    mostrarRecetas(recetasFiltradas);
}

// ABRIR Y CERRAR FILTROS

botonFiltros.addEventListener("click", function () {
    panelFiltros.classList.toggle("mostrar");
});

cerrarFiltros.addEventListener("click", function () {
    panelFiltros.classList.remove("mostrar");
});

// CAMBIOS EN LOS FILTROS

opcionesCalificacion.forEach(function (opcion) {
    opcion.addEventListener("change", aplicarFiltros);
});

opcionesRestriccion.forEach(function (opcion) {
    opcion.addEventListener("change", aplicarFiltros);
});

// LIMPIAR FILTROS

limpiarFiltros.addEventListener("click", function () {
    opcionesCalificacion.forEach(opcion => opcion.checked = false);
    opcionesRestriccion.forEach(opcion => opcion.checked = false);

    aplicarFiltros();
});

// BUSCADOR

buscador.addEventListener("input", aplicarFiltros);

// INICIAR

cargarRecetas();
