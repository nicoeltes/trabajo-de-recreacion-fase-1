const esVegano = document.getElementById('vegano').checked;
const esCeliaco = document.getElementById('celiaco').checked;
const esVegetariano = document.getElementById('vegetariano').checked;

// Al guardar el usuario:
usuarios.push({ 
    usuario, 
    password, 
    vegano: esVegano,
    celiaco: esCeliaco,
    vegetariano: esVegetariano
});

