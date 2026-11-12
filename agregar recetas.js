const API = "http://localhost:3000";

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

            textarea.value = texto.substring(0, inicio) + "\n- " + texto.substring(final);
            textarea.selectionStart = inicio + 3;
            textarea.selectionEnd = inicio + 3;
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

function obtenerUsuarioActual() {
    try {
        return JSON.parse(localStorage.getItem("usuarioActual"));
    } catch (error) {
        return null;
    }
}

// Convierte la foto en texto para poder mandarla al back
function leerFoto(archivo) {
    return new Promise(function(resolver, rechazar) {
        const lector = new FileReader();
        lector.onload = () => resolver(lector.result);
        lector.onerror = rechazar;
        lector.readAsDataURL(archivo);
    });
}

// Convierte el texto del textarea en una lista
function limpiarLista(texto) {
    return texto
        .split("\n")
        .map(item => item.replace(/^- /, "").trim())
        .filter(item => item !== "");
}

formulario.addEventListener("submit", async function(event) {
    event.preventDefault();

    mensaje.textContent = "";

    const usuarioActual = obtenerUsuarioActual();

    if (!usuarioActual || !usuarioActual.id_usuario) {
        mensaje.textContent = "Tenés que iniciar sesión para agregar una receta.";
        mensaje.style.color = "red";
        return;
    }

    try {
        let foto = null;

        if (fotos.files.length > 0) {
            foto = await leerFoto(fotos.files[0]);
        }

        const datosReceta = {
            id_usuario: usuarioActual.id_usuario,
            titulo: document.getElementById("nombre").value.trim(),
            foto: foto,
            ingredientes: limpiarLista(ingredientes.value),
            pasos: limpiarLista(instrucciones.value),
            vegano: document.getElementById("veganismo").checked,
            vegetariano: document.getElementById("vegetarianismo").checked,
            celiaco: document.getElementById("celiaco").checked
        };

        const respuesta = await fetch(API + "/recetas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datosReceta)
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(resultado.mensaje || "No se pudo enviar la receta.");
        }

        mensaje.textContent = resultado.mensaje || "¡La receta se envió correctamente!";
        mensaje.style.color = "green";

        formulario.reset();
        vistaFotos.innerHTML = "";
        textoFotos.textContent = "Subir foto/s";

    } catch (error) {
        console.log(error);

        mensaje.textContent = "No se pudo conectar con el servidor.";
        mensaje.style.color = "red";
    }
});