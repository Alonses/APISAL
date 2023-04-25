const app = require('./app')

let port = 8080 || process.env.PORT

app.listen(port, () => {
    console.log("Servidor ligado na porta", port)
})