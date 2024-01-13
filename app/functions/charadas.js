const { getCharada } = require('../database/schemas/Charada')

class Charadas {
    async show(req, res) {

        const charada = await getCharada()

        const objeto = {
            question: charada[0].question,
            answer: charada[0].answer
        }

        return res.json(objeto)
    }
}

module.exports = new Charadas()