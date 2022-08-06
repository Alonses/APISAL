const app = require('./app')

let port = process.env.PORT || 3000

app.listen(port, () => {
    console.log("Servidor ligado na porta ", port)
})