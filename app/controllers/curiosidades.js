const curiosidades = require("../database/curiosidades.json")
let retiradas = []

class Curiosidades {
    show(req, res) {
        let num = escolhe_texto(curiosidades, 4, 0)
        const key = Object.keys(curiosidades[num])

        let img_curio_dinamic = null

        if (curiosidades[num][key] !== null)
            img_curio_dinamic = curiosidades[num][key].toString()

        let json_final = {
            nome: "Curiosidade",
            foto: "https://static.historiadomundo.com.br/conteudo/images/a-renovacao-saber-historico-abre-caminho-para-outra-relacao-com-passado-53f65ed4b070b.jpg",
            texto: key[0],
            img_curio: img_curio_dinamic
        }

        return res.json(json_final)
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