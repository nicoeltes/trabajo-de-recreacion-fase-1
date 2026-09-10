/* =====================================================
   CREAR CUENTA
   ===================================================== */

   const formCrearCuenta = document.getElementById("crearCuentaForm");

   if (formCrearCuenta) {
   
       const mensaje = document.getElementById("mensaje");
   
       formCrearCuenta.addEventListener("submit", function (e) {
   
           e.preventDefault();
   
           const usuario = document.getElementById("usuario").value;
           const password = document.getElementById("password").value;
           const confirmarPassword = document.getElementById("confirmarPassword").value;
   
           // Preferencias alimenticias
           const esVegano = document.getElementById("vegano").checked;
           const esCeliaco = document.getElementById("celiaco").checked;
           const esVegetariano = document.getElementById("vegetariano").checked;
   
   
           // Verificar que haya seleccionado al menos una preferencia
           if (!esVegano && !esCeliaco && !esVegetariano) {
   
               mensaje.textContent =
                   "Debes seleccionar al menos una preferencia (Vegano, Celíaco o Vegetariano).";
   
               mensaje.style.color = "#ffdddd";
   
               return;
           }
   
   
           // Verificar que las contraseñas coincidan
           if (password !== confirmarPassword) {
   
               mensaje.textContent = "Las contraseñas no coinciden.";
   
               mensaje.style.color = "#ffdddd";
   
               return;
           }
   
   
           // Obtener los usuarios guardados
           const usuarios =
               JSON.parse(localStorage.getItem("usuarios")) || [];
   
   
           // Verificar si el usuario ya existe
           const yaExiste = usuarios.some(
               u => u.usuario === usuario
           );
   
           if (yaExiste) {
   
               mensaje.textContent = "Ese usuario ya existe.";
   
               mensaje.style.color = "#ffdddd";
   
               return;
           }
   
   
           // GUARDAR USUARIO
           // Mantengo tu código y tus datos
           usuarios.push({
   
               usuario,
               password,
   
               vegano: esVegano,
   
               celiaco: esCeliaco,
   
               vegetariano: esVegetariano
   
           });
   
   
           // Guardar usuarios en localStorage
           localStorage.setItem(
               "usuarios",
               JSON.stringify(usuarios)
           );
   
   
           // Mensaje de éxito
           mensaje.textContent =
               "¡Cuenta creada con éxito! Redirigiendo...";
   
           mensaje.style.color = "white";
   
   
           // Ir a la página principal
           setTimeout(function () {
   
               window.location.href = "pagina principal.html";
   
           }, 1000);
   
       });
   }
   
   
   
   /* =====================================================
      INICIAR SESIÓN
      ===================================================== */
   
   const formLogin = document.getElementById("loginForm");
   
   if (formLogin) {
   
       const mensaje = document.getElementById("mensaje");
   
       formLogin.addEventListener("submit", function (e) {
   
           e.preventDefault();
   
   
           const usuario =
               document.getElementById("usuario").value;
   
           const password =
               document.getElementById("password").value;
   
   
           // Obtener usuarios registrados
           const usuarios =
               JSON.parse(localStorage.getItem("usuarios")) || [];
   
   
           // Buscar usuario y contraseña
           const usuarioValido = usuarios.find(
   
               u =>
                   u.usuario === usuario &&
                   u.password === password
   
           );
   
   
           // Si los datos son correctos
           if (usuarioValido) {
   
               mensaje.textContent = "¡Bienvenido!";
   
               mensaje.style.color = "green";
   
   
               // Guardar usuario que inició sesión
               localStorage.setItem(
                   "usuarioActual",
                   usuario
               );
   
   
               // Ir a página principal
               window.location.href =
                   "pagina principal.html";
   
           }
   
           // Si los datos son incorrectos
           else {
   
               mensaje.textContent =
                   "Usuario o contraseña incorrectos.";
   
               mensaje.style.color = "red";
   
           }
   
       });
   }
   
   
   
   /* =====================================================
      PÁGINA PRINCIPAL
      ===================================================== */
   
   // Este código solamente se ejecuta si existe
   // algún elemento de la página principal.
   
   const paginaPrincipal =
       document.querySelector(".Recetas");
   
   if (paginaPrincipal) {
   
       console.log("Página principal cargada");
   
   }
   
   
   
   /* =====================================================
      RECETAS
      ===================================================== */
   
   // Buscamos la zona donde aparecen las recetas
   const zonaRecetas =
       document.getElementById("zone");
   
   
   if (zonaRecetas) {
   
       // Información dinámica de las recetas
       const recetas = [
   
           {
               nombre: "Torta Oreo",
               foto: "Foto de la receta"
           },
   
           {
               nombre: "Pizza",
               foto: "Foto de la receta"
           },
   
           {
               nombre: "Hamburguesa",
               foto: "Foto de la receta"
           },
   
           {
               nombre: "Pasta",
               foto: "Foto de la receta"
           },
   
           {
               nombre: "Tacos",
               foto: "Foto de la receta"
           },
   
           {
               nombre: "Milanesa",
               foto: "Foto de la receta"
           },
   
           {
               nombre: "Empanadas",
               foto: "Foto de la receta"
           },
   
           {
               nombre: "Panqueques",
               foto: "Foto de la receta"
           },
   
           {
               nombre: "Ensalada",
               foto: "Foto de la receta"
           },
   
           {
               nombre: "Brownie",
               foto: "Foto de la receta"
           }
   
       ];
   
   
       // Borrar las recetas que estén escritas
       // directamente en el HTML
       zonaRecetas.innerHTML = "";
   
   
       // Crear las recetas desde JavaScript
       recetas.forEach(function (receta) {
   
           const articulo =
               document.createElement("article");
   
           articulo.classList.add("recetas");
   
   
           const foto =
               document.createElement("section");
   
           foto.classList.add("foto");
   
           foto.textContent = receta.foto;
   
   
           const nombre =
               document.createElement("h2");
   
           nombre.textContent = receta.nombre;
   
   
           // Meter la foto y el nombre dentro
           // de la tarjeta
           articulo.appendChild(foto);
   
           articulo.appendChild(nombre);
   
   
           // Meter la tarjeta dentro de #zone
           zonaRecetas.appendChild(articulo);
   
       });
   
   }
   
   
   
   /* =====================================================
      USUARIO ACTUAL
      ===================================================== */
   
   // Si existe un usuario que inició sesión,
   // lo podemos obtener desde cualquier página.
   
   const usuarioActual =
       localStorage.getItem("usuarioActual");
   
   
   if (usuarioActual) {
   
       console.log(
           "Usuario actual:",
           usuarioActual
       );
   
   }