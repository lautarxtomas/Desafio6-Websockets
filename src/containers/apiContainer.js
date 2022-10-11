const fs = require('fs');

class ApiContainer {
    constructor(file){
        this.file = file
    }

    async save(product){
        let content = await fs.promises.readFile(this.file)
        let contObj = JSON.parse(content)

        let newId
        newId = contObj.length ? contObj[contObj.length - 1].id + 1 : 1 // Si hay aunque sea 1 objeto en contObj, busca el último objeto del array y le suma 1 al newId, sino, queda en 1.
        product.id = newId;

        contObj.push(product)
        await fs.promises.writeFile(this.file, JSON.stringify(contObj))
    }

    async getAll(){
        let content = await fs.promises.readFile(this.file)
        let contObj = JSON.parse(content)
        return contObj
    }

    async getById(id){
        let contObj = await this.getAll()
        let result = contObj.find(obj => obj.id == id)
        console.log(result)
        return(result)
    }

    async deleteById(id){
        let contObj = await this.getAll()
        let newObj = contObj.filter(obj => obj.id != id)
        await fs.promises.writeFile(this.file, JSON.stringify(newObj))
    }

    async deleteAll(){
        await fs.promises.writeFile(this.file, "[]")
    }

    async getLength(){
        let list = await this.getAll();
        return await list.length;
    }
}


module.exports = ApiContainer // --> exporto clase constructora e importo en server.js










//class ApiContainer{
    //     constructor(products) {
    //         this.products = products
    //     }
    
    //     // METHODS
    //     getById = (id) => {
    //         return this.products.find(product => product.id == id)
    //     }
        
    //     addProduct = (req, res) => {
    //         const product = req.body
    //         product.id = (this.products.length + 1)
    //         this.products.push(product)
    //         res.json(product)
    //     }
        
    //     getProduct = (req, res) => {
    //         const { id } = req.params
    //         this.getById(id) != null ? res.send({ product: this.getById(id) }) : res.send({ error: "Product not found" })
    //     }
        
    //     modifyProduct = (req, res) => {
    //         const { id } = req.params
    //         const product = req.body
    //         product.id = id
    //         this.products.splice(parseInt(id - 1), 1, product)
    //         res.send({ modifiedProduct: product })
    //     }
        
    //     deleteProduct = (req, res) => {
    //         const { id } = req.params
    //         const product = this.products.splice(parseInt(id - 1), 1)
    //         res.send({ deletedProduct: product })
    //     }
    // }