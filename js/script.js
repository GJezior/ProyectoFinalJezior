//Defino un listado de productos como objetos ya con sus img definidas para utlizarse desde el js por medio del DOM

document.addEventListener("DOMContentLoaded", () => {
    const productos = {
        "1": { nombre: "Fender Vintage II 1961 Stratocaster - Fiesta Red", precio: 2299, img: "./img/fenderstratocaster60.jpg" },
        "2": { nombre: "Fender Pro II Telecaster - Butterscotch Blonde", precio: 1899, img: "./img/fendertelecasterpro.jpg" },
        "3": { nombre: "Gibson Les Paul Standard '60s - Honey Amber", precio: 2799, img: "./img/gibsonlespaulstandard60.jpg" },
        "4": { nombre: "Gibson ES-335 Semi-hollowbody - Sixties Cherry", precio: 3499, img: "./img/gibsones335.jpg" },
        "5": { nombre: "Ibanez Genesis RG550 - Desert Sun Yellow", precio: 999, img: "./img/ibanez550.jpg" },
        "6": { nombre: "Ibanez Prestige AZ2204NW - Pastel Pink Rose", precio: 1999, img: "./img/ibanezaz2204.jpg" }
    };

    const contenedorProductos = document.getElementById("productos-container");

//Aplico como sera el diseño y la visualizacion de nuestros productos

    const renderizarProductos = () => {
        contenedorProductos.innerHTML = "";

        for (const id in productos) {
            const producto = productos[id];
            const tarjetaProducto = `
                <div class="col mb-4">
                    <div class="card custom-card">
                        <img src="${producto.img}" alt="${producto.nombre}" class="card-img-top mb-3">
                        <div class="card-body">
                            <h5 class="card-title mb-0">${producto.nombre}</h5>
                        </div>
                        <div class="card-body d-flex justify-content-around">
                            <p class="fs-3 fw-bold mb-0">$${producto.precio}</p>
                            <button class="btn btn-outline-light" data-id="${id}">Agregar al carrito</button>
                        </div>
                    </div>
                </div>
            `;
            contenedorProductos.insertAdjacentHTML("beforeend", tarjetaProducto);
        }

        document.querySelectorAll(".btn-outline-light").forEach(boton => {
            boton.addEventListener("click", agregarAlCarrito);
        });
    };

//Defino el evento del carrito de compras utilizando JSON y estructuro los diferentes casos posibles de seleccion

    const agregarAlCarrito = (event) => {
        const productoId = event.target.getAttribute("data-id");
        let carrito = JSON.parse(localStorage.getItem("productosSeleccionados")) || [];
        const productoExistente = carrito.find(item => item.id === productoId);

        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carrito = [...carrito, { id: productoId, cantidad: 1 }];
        }

        localStorage.setItem("productosSeleccionados", JSON.stringify(carrito));
        actualizarVisualizacionCarrito();

//Utilizo toastify para generar un mensaje emergente al presionar el boton "agregar al carrito" y defino su estilo

        Toastify({
            text: "Producto agregado al carrito",
            className: "info",
            style: {
                background: "#444",
            }
        }).showToast();
    };

    const eliminarDelCarrito = (productoId) => {
        let carrito = JSON.parse(localStorage.getItem("productosSeleccionados")) || [];
        carrito = carrito.filter(item => item.id !== productoId);
        localStorage.setItem("productosSeleccionados", JSON.stringify(carrito));
        actualizarVisualizacionCarrito();
    };

// Seteo la calculadora del carrito de compras para sumar el total de valor de los productos seleccionados

    const actualizarVisualizacionCarrito = () => {
        const carrito = JSON.parse(localStorage.getItem("productosSeleccionados")) || [];
        const contenedorProductosCompra = document.getElementById("productosCompra");
        const totalElemento = document.getElementById("total");

        contenedorProductosCompra.innerHTML = "";
        let total = 0;

        carrito.forEach(item => {
            const producto = productos[item.id];
            total += producto.precio * item.cantidad;

            const itemCarrito = `
                <div>
                    <div class="img">
                        <img src="${producto.img}" alt="${producto.nombre}">
                        <span>${producto.nombre}</span>
                    </div>
                    <div>
                        <span>${item.cantidad} x $${producto.precio}</span>
                        <button class="btn-remover" data-id="${item.id}">x</button>
                    </div>
                </div>
            `;
            contenedorProductosCompra.insertAdjacentHTML("beforeend", itemCarrito);
        });

        totalElemento.innerHTML = `Total: $${total}`;

        document.querySelectorAll(".btn-remover").forEach(boton => {
            boton.addEventListener("click", (e) => {
                const productoId = e.target.getAttribute("data-id");
                eliminarDelCarrito(productoId);
            });
        });
    };

// Arranque de las funciones para la visualizacion de los productos al cargar la pagina 

renderizarProductos();
actualizarVisualizacionCarrito();

// Defino acciones al seleccionar distintos elementos del carrito de compras

    const iconoCarrito = document.getElementById("carritoIcono");
    const contenedorCompra = document.getElementById("contenedorCompra");
    const botonCerrar = document.getElementById("x");

    iconoCarrito.addEventListener("click", (e) => {
        e.preventDefault();
        contenedorCompra.style.display = "flex";
    });

    botonCerrar.addEventListener("click", () => {
        contenedorCompra.style.display = "none";
    });
});