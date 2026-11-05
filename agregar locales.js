
const nombre = document.getElementById("nombre");
const direccion = document.getElementById("direccion");
const menu = document.getElementById("menu");
const fotos = document.getElementById("fotos");
const nombreFotos = document.getElementById("nombre-fotos");
const estadoMapa = document.getElementById("estado-mapa");

const botonAgregar = document.querySelector(".boton-anadir");

let ubicacionSeleccionada = false;
let coordenadas = null;
let marcador = null;

// CREAR MAPA

const mapaLocal = L.map("mapaLocal", {
    attributionControl: false
}).setView([-34.6037, -58.3816], 13);

L.control.attribution({
    prefix: false
}).addTo(mapaLocal);

L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
    attribution: "Tiles © Esri",
    maxZoom: 16
}).addTo(mapaLocal);

// SELECCIONAR UBICACION

mapaLocal.on("click", function (evento) {

    const latitud = evento.latlng.lat;
    const longitud = evento.latlng.lng;

    coordenadas = {
        lat: latitud,
        lng: longitud
    };

    if (marcador) {
        mapaLocal.removeLayer(marcador);
    }

    marcador = L.marker([latitud, longitud]).addTo(mapaLocal);

    marcador.bindPopup("Ubicación de tu local").openPopup();

    ubicacionSeleccionada = true;

    estadoMapa.textContent = "Ubicación seleccionada";

});

// MOSTRAR NOMBRES DE LAS FOTOS

fotos.addEventListener("change", function () {

    nombreFotos.textContent = "";

    if (fotos.files.length > 0) {

        const nombres = Array.from(fotos.files).map(foto => foto.name);

        nombreFotos.textContent = nombres.join(", ");

    }

});

// AGREGAR LOCAL

botonAgregar.addEventListener("click", async function () {

    if (nombre.value.trim() === "") {
        alert("Ingresá el nombre del local");
        return;
    }

    if (direccion.value.trim() === "") {
        alert("Ingresá la dirección del local");
        return;
    }

    if (!ubicacionSeleccionada) {
        alert("Marcá la ubicación del local en el mapa");
        return;
    }

    const preferencias = [];

    if (document.getElementById("celiaco").checked) {
        preferencias.push("celiaco");
    }

    if (document.getElementById("veganismo").checked) {
        preferencias.push("veganismo");
    }

    if (document.getElementById("vegetarianismo").checked) {
        preferencias.push("vegetarianismo");
    }

    const datosLocal = new FormData();

    datosLocal.append("nombre", nombre.value);
    datosLocal.append("direccion", direccion.value);
    datosLocal.append("menu", menu.value);
    datosLocal.append("preferencias", JSON.stringify(preferencias));

    datosLocal.append("coordenadas", JSON.stringify(coordenadas));

    for (let i = 0; i < fotos.files.length; i++) {
        datosLocal.append("fotos", fotos.files[i]);
    }

    try {

        const respuesta = await fetch("http://localhost:3000/locales", {
            method: "POST",
            body: datosLocal
        });

        if (!respuesta.ok) {
            throw new Error("No se pudo agregar el local");
        }

        alert("Local agregado correctamente");

        window.location.href = "mapa.html";

    } catch (error) {

        console.error(error);

        alert("No se pudo conectar con el servidor");

    }

});
