fetch("http://localhost:3000/recetas")
.then(response => response.json())
.then(recetas => {
    const zonaRecetas = document.getElementById("zone");

    recetas.forEach(function(receta) {
        const articulo = document.createElement("article");
        articulo.classList.add("recetas");

        const foto = document.createElement("section");
        foto.classList.add("foto");
        foto.textContent = receta.nombre;

        const nombre = document.createElement("h2");
        nombre.textContent = receta.nombre;

        articulo.appendChild(foto);
        articulo.appendChild(nombre);

        zonaRecetas.appendChild(articulo);
    });
})
.catch(error => {
    console.error("Error al cargar las recetas:", error);
});