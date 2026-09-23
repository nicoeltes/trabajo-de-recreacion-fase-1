const recetas =[
{ nombre:"chocotorta",
  foto:"foto de la receta"
},
{ nombre:"chocotorta",
    foto:"foto de la receta"
  },
  { nombre:"chocotorta",
    foto:"foto de la receta"
  },
  { nombre:"chocotorta",
    foto:"foto de la receta"
  },
  { nombre:"chocotorta",
    foto:"foto de la receta"
  },
  { nombre:"chocotorta",
    foto:"foto de la receta"
  },
  { nombre:"chocotorta",
    foto:"foto de la receta"
  },
] 
recetas.forEach(function(receta){
    const articulo= document.createElement("article");
    const nombre= document.createElement("h2");

    nombre.textContent=receta.nombre;
    articulo.appendChild(nombre);

    const foto = document.createElement("section"); 

    foto.classList.add("foto");                     
    foto.textContent = receta.foto;   
              
    articulo.appendChild(foto);
    zonaRecetas.appendChild(articulo);
})
