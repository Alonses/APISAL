const express = require("express")
const app = express()
const port = process.env.PORT || 3000

const cantadas = require("./src/cantadas/cantadas.json")
let retiradas = []

app.get("/cantadas", (req, res) => {

    if(retiradas.length == cantadas.length) // Reinicia o vetor
        retiradas = []

    let num

    do{
        num = Math.round((cantadas.length - 1) * Math.random())
    }while(retiradas.includes(num)) // Escolhendo uma cantada aleatória
    
    retiradas.push(num)
    return res.json(cantadas[num])
})

app.listen(port, () => {
    console.log("Servidor ligado na porta ", port);
})