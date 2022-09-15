class Comandos {
    show(req, res) {
        return res.json("Um comando enceirado vem por aí!")
    }
}

module.exports = new Comandos()