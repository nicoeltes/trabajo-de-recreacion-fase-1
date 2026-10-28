
const formulario = document.getElementById("formularioReceta");
const fotos = document.getElementById("fotos");
const vistaFotos = document.getElementById("vistaFotos");
const textoFotos = document.getElementById("textoFotos");
const mensaje = document.getElementById("mensaje");

const ingredientes = document.getElementById("ingredientes");
const instrucciones = document.getElementById("instrucciones");

function agregarListado(textarea) {
    textarea.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();

            const inicio = textarea.selectionStart;
            const final = textarea.selectionEnd;
            const texto = textarea.value;

            const antes = texto.substring(0, inicio);
            const despues = texto.substring(final);

            const nuevoTexto = antes + "\n- " + despues;

            textarea.value = nuevoTexto;
            textarea.selectionStart = inicio + 4;
            textarea.selectionEnd = inicio + 4;
        }
    });
}

agregarListado(ingredientes);
agregarListado(instrucciones);

fotos.addEventListener("change", function() {
    vistaFotos.innerHTML = "";

    const archivos = Array.from(fotos.files);

    textoFotos.textContent = archivos.length > 0
        ? archivos.length + " foto/s seleccionada/s"
        : "Subir foto/s";

    archivos.forEach(function(archivo) {
        if (!archivo.type.startsWith("image/")) {
            return;
        }

        const imagen = document.createElement("img");
        imagen.src = URL.createObjectURL(archivo);
        imagen.alt = archivo.name;

        vistaFotos.appendChild(imagen);
    });
});

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const receta = {
        nombre: document.getElementById("nombre").value.trim(),
        ingredientes: ingredientes.value
            .split("\n")
            .map(item => item.replace(/^- /, "").trim())
            .filter(item => item !== ""),
        instrucciones: instrucciones.value
            .split("\n")
            .map(item => item.replace(/^- /, "").trim())
            .filter(item => item !== ""),
        fotos: Array.from(fotos.files)
    };

    console.log(receta);

    mensaje.textContent =
        "La receta está preparada. Falta conectarla al backend para guardarla.";

});
