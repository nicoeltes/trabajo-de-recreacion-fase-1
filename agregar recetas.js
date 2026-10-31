
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

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    const datosReceta = new FormData();

    datosReceta.append(
        "nombre",
        document.getElementById("nombre").value.trim()
    );

    datosReceta.append(
        "ingredientes",
        JSON.stringify(
            ingredientes.value
                .split("\n")
                .map(item => item.replace(/^- /, "").trim())
                .filter(item => item !== "")
        )
    );

    datosReceta.append(
        "instrucciones",
        JSON.stringify(
            instrucciones.value
                .split("\n")
                .map(item => item.replace(/^- /, "").trim())
                .filter(item => item !== "")
        )
    );

    const restricciones = [];

    if (document.getElementById("celiaco").checked) {
        restricciones.push("celiaco");
    }

    if (document.getElementById("veganismo").checked) {
        restricciones.push("veganismo");
    }

    if (document.getElementById("vegetarianismo").checked) {
        restricciones.push("vegetarianismo");
    }

    datosReceta.append(
        "restricciones",
        JSON.stringify(restricciones)
    );

    Array.from(fotos.files).forEach(function(foto) {
        datosReceta.append("fotos", foto);
    });

    try {
        const respuesta = await fetch("http://localhost:3000/recetas", {
            method: "POST",
            body: datosReceta
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(
                resultado.mensaje || "No se pudo enviar la receta."
            );
        }

        mensaje.textContent =
            resultado.mensaje || "¡La receta se envió correctamente!";
        mensaje.style.color = "green";

        formulario.reset();
        vistaFotos.innerHTML = "";
        textoFotos.textContent = "Subir foto/s";

    } catch (error) {
        console.log(error);

        mensaje.textContent =
            error.message === "Failed to fetch"
                ? "No se pudo conectar con el servidor."
                : error.message;

        mensaje.style.color = "red";
    }
});
