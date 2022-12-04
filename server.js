const app = require('./app')

let port = 8080

app.listen(port, () => {
    console.log("Servidor ligado na porta ", port)
})