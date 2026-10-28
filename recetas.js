
const zonaRecetas = document.getElementById("zone");

async function cargarRecetas() {
    zonaRecetas.innerHTML = "";

    try {
        const respuesta = await fetch("http://localhost:3000/recetas");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar las recetas.");
        }

        const recetas = await respuesta.json();

        recetas.forEach(function(receta) {
            const articulo = document.createElement("article");
            articulo.classList.add("recetas");

            const foto = document.createElement("section");
            foto.classList.add("foto");

            if (receta.fotos && receta.fotos.length > 0) {
                const imagen = document.createElement("img");

                imagen.src = receta.fotos[0];
                imagen.alt = receta.nombre;
                imagen.style.width = "100%";
                imagen.style.height = "100%";
                imagen.style.objectFit = "cover";

                foto.appendChild(imagen);
            } else {
                foto.textContent = receta.nombre;
            }

            const nombre = document.createElement("h2");
            nombre.textContent = receta.nombre;

            articulo.appendChild(foto);
            articulo.appendChild(nombre);

            zonaRecetas.appendChild(articulo);
        });

    } catch (error) {
        console.error("Error al cargar las recetas:", error);

        zonaRecetas.textContent =
            "No se pudieron cargar las recetas. Verificá que el servidor esté funcionando.";
    }
}

cargarRecetas();
