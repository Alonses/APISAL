const curiosidades = require("../database/curiosidades.json")
let retiradas = []

class Curiosidades {
    show(req, res) {
        let num = escolhe_texto(curiosidades, 4, 0)
        const key = Object.keys(curiosidades[num])

        let data_curio = null

        if (curiosidades[num][key] !== null)
            data_curio = curiosidades[num][key].toString()

        const dados = {
            texto: key[0],
            data_curio: data_curio
        }

        return res.json(dados)
    }
}

function escolhe_texto(vetor_json) {

    let num

    // Reseta o vetor de repetidas em mudança de comando
    if (vetor_json.length === retiradas.length)
        retiradas = []

    do {
        num = Math.round((vetor_json.length - 1) * Math.random())
    } while (retiradas.includes(num))

    retiradas.push(num)

    return num
}

module.exports = new Curiosidades()