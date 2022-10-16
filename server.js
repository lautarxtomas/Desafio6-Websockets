const express = require('express');
const app = express();
const { Router } = express
const routerProducts = Router()
const apiContainer = require ('./src/containers/apiContainer') // import de clase constructora

// websockets
const server = require('http').Server(app)
const io = require('socket.io')(server)

app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use('/api/products', routerProducts)
app.use(express.static('public'))


// const products = []
// const chats = []

// ACLARACION IMPORTANTE: en los archivos products.txt y chat.txt, hay que agregar "[]" para que funcione, sino no se meten los productos

let containerProducts = new apiContainer('products.txt')
let containerChats = new apiContainer('chat.txt')


// opcion A: guardar solo usando los contenedores, sin usar los arrays. Cada vez que llamemos a algun metodo del contenedor hay que usar await porque son todos los metodos async. Tambien tiene que ser async el message/product, como aca abajo.
io.on('connection', async (socket) => {
    console.log("Nuevo cliente conectado")
    socket.emit('chats', await containerChats.getAll()) // se emiten TODOS los chats al NUEVO CLIENTE (primer parametro nombre del socket, segundo parametro el array de chats)
    socket.emit('products', await containerProducts.getAll()) // se emiten TODOS los productos al NUEVO CLIENTE

    socket.on('new-message', async message => {
        io.sockets.emit('chats', containerChats.getAll()); // se emiten TODOS los chats a TODOS los clientes conectados
        if (containerChats.getLength() == 0){
            await containerChats.save(chats)
        }
        else{
            await containerChats.save(message);  
        }
    })
    socket.on('new-product', async product => {
        io.sockets.emit('products', containerProducts.getAll()); // se emiten TODOS los productos a TODOS los clientes conectados
        if (containerProducts.getLength() == 0){
            await containerProducts.save(products)
        }
        else{
            await containerProducts.save(product); // si ya habia productos en el array, pushea SOLO EL NUEVO PRODUCTO para no sobreescribir los que ya estaban en el array
        }
    })
})


// OPCION B: usando contenedores y products (es al pedo, usar contenedores o usar arreglos)
// io.on('connection', (socket)=>{
//     console.log("Nuevo cliente conectado");
//     socket.emit('chats', chats) // se emiten TODOS los chats al NUEVO CLIENTE (primer parametro nombre del socket, segundo parametro el array de chats)
//     socket.emit('products', products) // se emiten TODOS los productos al NUEVO CLIENTE

//     socket.on('new-message', message => {
//         io.sockets.emit('chats', chats); // se emiten TODOS los chats a TODOS los clientes conectados
//         if (chats.length == 0){
//             chats.push(message);
//             containerChats.save(chats);
//         }
//         else{
//             chats.push(message);
//             containerChats.save(message);  
//         }
//     })
//     socket.on('new-product', product => {
//         io.sockets.emit('products', products); // se emiten TODOS los productos a TODOS los clientes conectados
//         if (products.length == 0){
//             products.push(product);
//             containerProducts.save(products);
//         }
//         else{
//             products.push(product);
//             containerProducts.save(product); // si ya habia productos en el array, pushea SOLO EL NUEVO PRODUCTO para no sobreescribir los que ya estaban en el array
//         }
//     })
// })


// running server
const PORT = process.env.PORT || 8080;

const srv = server.listen(PORT, () => { 
    console.log(`Servidor Http con Websockets escuchando en el puerto ${srv.address().port}`);
})
srv.on('error', error => console.log(`Error en servidor ${error}`))
