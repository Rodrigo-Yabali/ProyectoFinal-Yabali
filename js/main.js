
let productos = [];

fetch("./js/productos.json")
    .then(response => response.json())
    .then(data => {
        productos = data;
        cargarProductos(productos);
    })

    


const contenedorProductos = document.querySelector("#contenedor-productos");
const botonesCategorias = document.querySelectorAll(".boton-categoria");
const tituloPrincipal = document.querySelector("#titulo-principal");
let botonesAgregar = document.querySelectorAll(".producto-agregar");
const numerito = document.querySelector("#numerito");

//PLANILLA DE ACCESO A LAS CUENTAS

const form = document.querySelector("form");

form.addEventListener("submit", event => {
    event.preventDefault();
    const username = document.querySelector("[name='usuario']").value.trim();
    const email = document.querySelector("[name='correo']").value.trim();
    const password = document.querySelector("[name='contraseña']").value.trim();
    const confirmPassword = document.querySelector("[name='repetir-contraseña']").value.trim()
    const errors = [];

    if(username === '')
        errors.push("Ingrese un usuario");
    if(email === '')
        errors.push("Ingrese un correo");
    if(password === '')
        errors.push("Ingrese una contraseña");
    if(password !== confirmPassword)
        errors.push("Ambas contraseñas deben coincidir");
    
    if(errors.length > 0)
    {
        for(let i = 0; i < errors.length; i++)
        {
            Toastify({
                text: errors[i],
                duration: 4000,
                gravity: "top",
                position: "center",
                style: {
                    background: "#DF1C24"
                }
            }).showToast();
        }
    }
    else
    {
        Toastify({
            text:"Ingresando...",
            duration: 4000,
            gravity: "top",
            position: "center",
            style: {
                background: "#4bab4e"
            }
        }).showToast();
    }
});

//CARGAR PRODUCTOS AL CARRITO

function cargarProductos(productosElegidos) {

    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(producto => {const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `<img class="producto-imagen" src="${producto.imagen}" alt="${producto.titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${producto.titulo}</h3>
                <p class="producto-precio">$${producto.precio}</p>
                <button class="producto-agregar" id="${producto.id}">Añadir al Carrito</button>
            </div>`;

        contenedorProductos.append(div);
    })

    actualizarBotonesAgregar();
}

// BOTON DE PROMOCIONES
document.getElementById("boton-log").addEventListener("click", function() {
    Swal.fire({
        title: '¡Bienvenido/a, Gracias por Visitarnos!',
        text: 'Por el momento no contamos con promociones disponibles',
        icon: 'success'
    });
});

// BOTONES POR CATEGORIA
botonesCategorias.forEach(boton => {boton.addEventListener("click", (e) => {
        botonesCategorias.forEach(boton => boton.classList.remove("active"));
        e.currentTarget.classList.add("active");

        if (e.currentTarget.id != "todos") {
            const productoCategoria = productos.find(producto => producto.categoria.id === e.currentTarget.id);
            tituloPrincipal.innerText = productoCategoria.categoria.nombre;
            const productosBoton = productos.filter(producto => producto.categoria.id === e.currentTarget.id);
            cargarProductos(productosBoton);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }

    })
});

// BOTON AÑADIR AL CARRITO
function actualizarBotonesAgregar() {botonesAgregar = document.querySelectorAll(".producto-agregar");

    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    });
}


let productosEnCarrito;
let productosEnCarritoLS = localStorage.getItem("productos-en-carrito");

if (productosEnCarritoLS) {
    productosEnCarrito = JSON.parse(productosEnCarritoLS);
    actualizarNumerito();
} else {
    productosEnCarrito = [];
}

function agregarAlCarrito(e) {

    Toastify({
        text: "Se Añadio Nuevo Producto!",
        duration: 6000,
        close: true,
        gravity: "top",
        position: "left", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(90deg, rgba(32,38,156,1) 0%, rgba(29,79,253,1) 35%, rgba(50,160,212,1) 90%)",
          borderRadius: "2rem",
          textTransform: "uppercase",
          fontSize: ".75rem"
        },
        offset: {
            x: '1.5rem', 
            y: '1.5rem' 
          },
        onClick: function(){} 
      }).showToast();

    const idBoton = e.currentTarget.id;
    const productoAgregado = productos.find(producto => producto.id === idBoton);

    if(productosEnCarrito.some(producto => producto.id === idBoton)) {
        const index = productosEnCarrito.findIndex(producto => producto.id === idBoton);
        productosEnCarrito[index].cantidad++;
    } else {
        productoAgregado.cantidad = 1;
        productosEnCarrito.push(productoAgregado);
    }

    actualizarNumerito();

    localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));
}

function actualizarNumerito() {
    let nuevoNumerito = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
    numerito.innerText = nuevoNumerito;
}


