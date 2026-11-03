
const mapa = L.map("mapa").setView([-34.6037, -58.3816], 14);

L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
    attribution: '&copy; Esri',
    maxZoom: 19
}).addTo(mapa);

const marcadores = [];

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

            console.log("Probando servidor:", servidor);

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

            console.log("Locales encontrados:", datos.elements.length);

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

        const marcador = L.marker([latitud, longitud])
            .bindPopup(`
                <b>${nombre}</b>
            `);

        marcadores.push({
            marcador: marcador,
            nombre: nombre
        });

    });

    console.log("Marcadores creados:", marcadores.length);

    aplicarBusqueda();

}


function aplicarBusqueda() {

    const busqueda = document.getElementById("busquedaLocal").value.toLowerCase();

    marcadores.forEach(function(local) {

        const cumpleBusqueda = local.nombre.toLowerCase().includes(busqueda);

        if (cumpleBusqueda) {
            local.marcador.addTo(mapa);
        } else {
            mapa.removeLayer(local.marcador);
        }

    });

}


document.getElementById("busquedaLocal").addEventListener("input", aplicarBusqueda);


buscarLocales();
