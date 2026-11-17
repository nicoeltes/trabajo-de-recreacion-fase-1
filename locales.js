const API = "http://localhost:3000";

const nombreLocal = document.getElementById("nombre-local");
const linkMenu = document.getElementById("link-menu");
const direccion = document.getElementById("direccion");
const cajaFotos = document.getElementById("fotos");

const checkCeliaco = document.getElementById("celiaco");
const checkVegano = document.getElementById("veganismo");
const checkVegetariano = document.getElementById("vegetarianismo");

// LEER LOS DATOS DE LA URL
// Ejemplo: locales.html?id_local=5

const parametros = new URLSearchParams(window.location.search);
const idLocal = parametros.get("id_local");

// BUSCAR EL LOCAL EN EL BACK

async function buscarLocal(id) {
    // Primero prueba pedir el local solo
    try {
        const respuesta = await fetch(API + "/locales/" + id);

        if (respuesta.ok) {
            const datos = await respuesta.json();
            // Por si el back lo devuelve dentro de un array
            return Array.isArray(datos) ? datos[0] : datos;
        }
    } catch (error) {
        console.error("No se pudo pedir el local solo:", error);
    }

    // Si no funciona, trae todos los locales y busca el que tiene ese id
    const respuesta = await fetch(API + "/locales");

    if (!respuesta.ok) {
        throw new Error("Error HTTP: " + respuesta.status);
    }

    const locales = await respuesta.json();

    return locales.find(local => String(local.id_local) === String(id));
}

// MOSTRAR LOS DATOS EN LA PAGINA

function mostrarLocal(local) {
    nombreLocal.textContent = local.nombre || "Local sin nombre";
    document.title = local.nombre || "Local";

    direccion.textContent = local.direccion || "Sin dirección";

    if (local.link_menu) {
        linkMenu.textContent = local.link_menu;
        linkMenu.href = local.link_menu;
    } else {
        linkMenu.textContent = "Este local no tiene link del menú";
        linkMenu.removeAttribute("href");
    }

    mostrarFotos(local.fotos);

    // El back puede devolver true/false o 1/0
    checkCeliaco.checked = Boolean(Number(local.celiaco)) || local.celiaco === true;
    checkVegano.checked = Boolean(Number(local.vegano)) || local.vegano === true;
    checkVegetariano.checked = Boolean(Number(local.vegetariano)) || local.vegetariano === true;
}

// MOSTRAR LAS FOTOS (si hay varias, cambian al hacer click)

function mostrarFotos(fotos) {
    // Por si el back guarda las fotos como texto JSON
    if (typeof fotos === "string") {
        try {
            fotos = JSON.parse(fotos);
        } catch {
            fotos = [fotos];
        }
    }

    if (!Array.isArray(fotos) || fotos.length === 0) {
        cajaFotos.innerHTML = "<h2>Sin fotos</h2>";
        return;
    }

    let fotoActual = 0;

    const imagen = document.createElement("img");
    imagen.src = fotos[0];
    imagen.alt = "Foto del local";

    cajaFotos.innerHTML = "";
    cajaFotos.appendChild(imagen);

    if (fotos.length > 1) {
        imagen.style.cursor = "pointer";
        imagen.title = "Click para ver la siguiente foto";

        imagen.addEventListener("click", function () {
            fotoActual = (fotoActual + 1) % fotos.length;
            imagen.src = fotos[fotoActual];
        });
    }
}

// CARGAR LA PAGINA

async function cargarPagina() {
    // Locales de OpenStreetMap: los datos vienen en la URL, no en el back
    if (!idLocal) {
        if (parametros.get("nombre")) {
            mostrarLocal({
                nombre: parametros.get("nombre"),
                direccion: parametros.get("direccion"),
                link_menu: "",
                fotos: [],
                celiaco: false,
                vegano: false,
                vegetariano: false
            });
        } else {
            nombreLocal.textContent = "No se encontró el local";
        }
        return;
    }

    try {
        const local = await buscarLocal(idLocal);

        if (!local) {
            nombreLocal.textContent = "No se encontró el local";
            return;
        }

        mostrarLocal(local);

    } catch (error) {
        console.error(error);
        nombreLocal.textContent = "No se pudo conectar con el servidor";
    }
}

cargarPagina();