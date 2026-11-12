const API = "http://localhost:3000";

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
    coordenadas = {
        lat: evento.latlng.lat,
        lng: evento.latlng.lng
    };

    if (marcador) {
        mapaLocal.removeLayer(marcador);
    }

    marcador = L.marker([coordenadas.lat, coordenadas.lng]).addTo(mapaLocal);
    marcador.bindPopup("Ubicación de tu local").openPopup();

    ubicacionSeleccionada = true;
    estadoMapa.textContent = "Ubicación seleccionada";
});

// MOSTRAR NOMBRES DE LAS FOTOS

fotos.addEventListener("change", function () {
    nombreFotos.textContent = Array.from(fotos.files).map(foto => foto.name).join(", ");
});

// CONVIERTE UNA FOTO EN TEXTO PARA MANDARLA AL BACK

function leerFoto(archivo) {
    return new Promise(function (resolver, rechazar) {
        const lector = new FileReader();
        lector.onload = () => resolver(lector.result);
        lector.onerror = rechazar;
        lector.readAsDataURL(archivo);
    });
}

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

    try {
        const listaFotos = [];

        for (let i = 0; i < fotos.files.length; i++) {
            listaFotos.push(await leerFoto(fotos.files[i]));
        }

        const respuesta = await fetch(API + "/locales", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                nombre: nombre.value.trim(),
                direccion: direccion.value.trim(),
                codigo_postal: "",
                link_menu: menu.value.trim(),
                fotos: listaFotos,
                latitud: coordenadas.lat,
                longitud: coordenadas.lng,
                celiaco: document.getElementById("celiaco").checked,
                vegano: document.getElementById("veganismo").checked,
                vegetariano: document.getElementById("vegetarianismo").checked
            })
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