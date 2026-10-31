
const mapa = L.map("mapa").setView([-34.6037, -58.3816], 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap',
    maxZoom: 19
}).addTo(mapa);

const marcadores = [];

async function buscarLocales() {

    const consulta = `
        [out:json];
        (
            node["amenity"~"restaurant|cafe|fast_food"](around:3000,-34.6037,-58.3816);
            way["amenity"~"restaurant|cafe|fast_food"](around:3000,-34.6037,-58.3816);
            relation["amenity"~"restaurant|cafe|fast_food"](around:3000,-34.6037,-58.3816);
        );
        out center tags;
    `;

    try {

        const respuesta = await fetch(
            "https://overpass-api.de/api/interpreter",
            {
                method: "POST",
                body: new URLSearchParams({
                    data: consulta
                })
            }
        );

        if (!respuesta.ok) {
            throw new Error("No se pudieron obtener los locales.");
        }

        const datos = await respuesta.json();

        datos.elements.forEach(function(local) {

            const latitud = local.lat ?? local.center?.lat;
            const longitud = local.lon ?? local.center?.lon;

            if (latitud === undefined || longitud === undefined) {
                return;
            }

            const nombre = local.tags.name || "Local gastronómico";

            const vegetariano = local.tags.vegetarian === "yes";
            const vegano = local.tags.vegan === "yes";
            const celiaco = local.tags.gluten_free === "yes";

            const marcador = L.marker([latitud, longitud])
                .bindPopup(`
                    <b>${nombre}</b>
                    <p>Vegetariano: ${vegetariano ? "Sí" : "Sin información"}</p>
                    <p>Vegano: ${vegano ? "Sí" : "Sin información"}</p>
                    <p>Celíaco: ${celiaco ? "Sí" : "Sin información"}</p>
                `);

            marcadores.push({
                marcador: marcador,
                vegetariano: vegetariano,
                vegano: vegano,
                celiaco: celiaco
            });

        });

        aplicarFiltros();

    } catch (error) {

        console.error("Error al buscar locales:", error);

    }
}


function aplicarFiltros() {

    const filtroCeliacos = document.getElementById("filtroCeliacos").checked;
    const filtroVeganos = document.getElementById("filtroVeganos").checked;
    const filtroVegetarianos = document.getElementById("filtroVegetarianos").checked;

    marcadores.forEach(function(local) {

        const cumpleCeliacos = !filtroCeliacos || local.celiaco;
        const cumpleVeganos = !filtroVeganos || local.vegano;
        const cumpleVegetarianos = !filtroVegetarianos || local.vegetariano;

        if (cumpleCeliacos && cumpleVeganos && cumpleVegetarianos) {
            local.marcador.addTo(mapa);
        } else {
            mapa.removeLayer(local.marcador);
        }

    });
}


document.getElementById("filtroCeliacos").addEventListener("change", aplicarFiltros);

document.getElementById("filtroVeganos").addEventListener("change", aplicarFiltros);

document.getElementById("filtroVegetarianos").addEventListener("change", aplicarFiltros);


buscarLocales();
