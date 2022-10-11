const socket = io.connect(); // se conecta el cliente con el servidor

socket.on('chats', data => {
    console.log(data)
    renderMessages(data)
})

socket.on('products', data => {
    console.log(data)
    renderProducts(data)
})

const addMessage = (e) => {
    const message = {
        author: document.getElementById('email').value,
        message: document.getElementById('comment').value
    }
    socket.emit('new-message', message)
    
}

const addProduct = (e) => {
    const product = {
        name: document.getElementById('productName').value,
        price: document.getElementById('price').value
    }
    socket.emit('new-product', product)
    
}

function renderMessages(data){
    const date = new Date();
    const html = data.map((elem)=>{
        return `<div>
                    <strong style="color:blue;">${elem.author} </strong> <span style="color:brown";>${date.getDay()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} : </span> 
                    <em style="color:green;">${elem.message}</em>
                </div>`
    }).join(" ");
    document.getElementById('messages').innerHTML = html
}

function renderProducts(data){
    const html = data.map((prod)=>{
        return `<div>
                    <strong> ${prod.name} : </strong>
                    <em> $ ${prod.price} </em>
                </div>`
    }).join(" ");
    document.getElementById('products').innerHTML = html
}

socket.on('chats', function(data){renderMessages(data);})
socket.on('products', function(data){renderProducts(data);})