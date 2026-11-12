const mapa = L.map("mapa").setView([-34.6037, -58.3816], 14);

L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
    attribution: '&copy; Esri',
    maxZoom: 19
}).addTo(mapa);

const marcadores = [];

// LOCALES DE OPENSTREETMAP

async function buscarLocales() {

    const consulta = `
        [out:json][timeout:30];
        (
            nwr["amenity"~"restaurant|cafe|fast_food"](around:10000,-34.6037,-58.3816);
        );
        out center tags 100;
    `;

    const servidores = [
        "https://overpass-api.de/api/interpreter",
        "https://overpass.kumi.systems/api/interpreter",
        "https://overpass.nchc.org.tw/api/interpreter"
    ];

    let datos = null;

    for (const servidor of servidores) {
        try {
            const respuesta = await fetch(servidor, {
                method: "POST",
                body: new URLSearchParams({
                    data: consulta
                })
            });

            if (!respuesta.ok) {
                throw new Error("Error HTTP: " + respuesta.status);
            }

            datos = await respuesta.json();
            break;

        } catch (error) {
            console.error("Falló el servidor:", error);
        }
    }

    if (!datos) {
        console.error("Ningún servidor pudo devolver los locales.");
        return;
    }

    datos.elements.forEach(function(local) {
        const latitud = local.lat ?? local.center?.lat;
        const longitud = local.lon ?? local.center?.lon;

        if (latitud === undefined || longitud === undefined) {
            return;
        }

        const etiquetas = local.tags || {};
        const nombre = etiquetas.name || "Local gastronómico";
        const direccion = [etiquetas["addr:street"], etiquetas["addr:housenumber"]].filter(Boolean).join(" ");

        const datosDelLocal = new URLSearchParams({
            nombre: nombre,
            direccion: direccion,
            tipo: etiquetas.amenity || "",
            lat: latitud,
            lon: longitud
        });

        const marcador = L.marker([latitud, longitud])
            .bindPopup(`
                <b>${nombre}</b><br>
                <a href="infolocal.html?${datosDelLocal}">
                    <button type="button" class="botonVerLocal">Ver información</button>
                </a>
            `);

        marcadores.push({
            marcador: marcador,
            nombre: nombre
        });
    });

    aplicarBusqueda();
}

// LOCALES GUARDADOS EN EL BACK DE MARCOS

async function cargarLocalesDelBack() {
    try {
        const respuesta = await fetch("http://localhost:3000/locales");

        if (!respuesta.ok) {
            throw new Error("Error HTTP: " + respuesta.status);
        }

        const locales = await respuesta.json();

        locales.forEach(function(local) {
            // Si el local no tiene ubicación, no se muestra en el mapa
            if (local.latitud === null || local.longitud === null) {
                return;
            }

            const marcador = L.marker([local.latitud, local.longitud])
                .bindPopup(`
                    <b>${local.nombre}</b><br>
                    <a href="infolocal.html?id_local=${local.id_local}">
                        <button type="button" class="botonVerLocal">Ver información</button>
                    </a>
                `);

            marcadores.push({
                marcador: marcador,
                nombre: local.nombre
            });
        });

        aplicarBusqueda();

    } catch (error) {
        console.error("No se pudieron cargar los locales del back:", error);
    }
}

// BUSCADOR

function aplicarBusqueda() {
    const busqueda = document.getElementById("busquedaLocal").value.toLowerCase();

    marcadores.forEach(function(local) {
        if (local.nombre.toLowerCase().includes(busqueda)) {
            local.marcador.addTo(mapa);
        } else {
            mapa.removeLayer(local.marcador);
        }
    });
}

document.getElementById("busquedaLocal").addEventListener("input", aplicarBusqueda);

cargarLocalesDelBack();
buscarLocales();