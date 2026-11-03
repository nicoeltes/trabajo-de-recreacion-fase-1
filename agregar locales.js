
const nombre = document.getElementById("nombre");
const direccion = document.getElementById("direccion");
const menu = document.getElementById("menu");
const fotos = document.getElementById("fotos");
const nombreFotos = document.getElementById("nombre-fotos");
const mapa = document.querySelector(".mapa-contenedor");
const marcador = document.getElementById("marcador");
const estadoMapa = document.getElementById("estado-mapa");
const botonAgregar = document.querySelector(".botonesdelfooter button.Añadir");

let ubicacionSeleccionada = false;
let coordenadas = null;

fotos.addEventListener("change", function () {

    nombreFotos.textContent = "";

    if (fotos.files.length > 0) {
        const nombres = Array.from(fotos.files).map(foto => foto.name);
        nombreFotos.textContent = nombres.join(", ");
    }

});

mapa.addEventListener("click", function (evento) {

    const rectangulo = mapa.getBoundingClientRect();

    const x = evento.clientX - rectangulo.left;
    const y = evento.clientY - rectangulo.top;

    marcador.textContent = "📍";

    marcador.style.position = "absolute";
    marcador.style.left = x + "px";
    marcador.style.top = y + "px";

    ubicacionSeleccionada = true;

    coordenadas = {
        x: x,
        y: y
    };

    estadoMapa.textContent = "Ubicación seleccionada";

});

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
