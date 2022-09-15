const rasputia = require("../database/rasputia.json")
const jailson = require("../database/jailson.json")
const textoes = require("../database/textoes.json")
const cantadas = require("../database/cantadas.json")

let retiradas = []
let caso = 0

class txt_wbk {
    show(req, res) {

        // Coleta apenas a key da requisição
        const alvo_requisita = Object.keys(req.query)[0]
        let nome_wbk, foto_wbk, texto_wbk

        if (alvo_requisita === "rasputia") {
            nome_wbk = "Rasputia Latimore"
            foto_wbk = "https://static.wikia.nocookie.net/antagonists/images/4/40/Rasputia_Latimore.jpg/revision/latest/scale-to-width-down/300?cb=20121110030016"
            texto_wbk = escolhe_texto(rasputia, 2, 0)

            // Frases do Norbit
            if (texto_wbk.startsWith("N|")) {
                nome_wbk = "Norbit"
                foto_wbk = "https://m.media-amazon.com/images/S/aplus-media/vc/32d0f854-071e-41ba-b15d-d12e8f5c94a7.__CR0,0,220,220_PT0_SX220_V1___.jpg"
                texto_wbk = texto_wbk.replace("N|", "")
            }

            // Frases do Mr. Wong
            if (texto_wbk.startsWith("W|")) {
                nome_wbk = "Mr. Wong"
                foto_wbk = "https://www.personality-database.com/profile_images/342912.png"
                texto_wbk = texto_wbk.replace("W|", "")
            }
        } else if (alvo_requisita === "jailson") {
            nome_wbk = "Jailson Mendes"
            foto_wbk = "https://upload.wikimedia.org/wikipedia/pt/8/8d/Jailson_Mendes.jpg"
            texto_wbk = escolhe_texto(jailson, 1, 0)

            // Frases do guina
            if (texto_wbk.startsWith("G|")) {
                nome_wbk = "Paulo Guina"
                foto_wbk = "https://pbs.twimg.com/profile_images/1404555803646963712/nEtaBLBK_400x400.jpg"
                texto_wbk = texto_wbk.replace("G|", "")
            }

        } else if (alvo_requisita === "textoes") {
            nome_wbk = "Bluezão"
            foto_wbk = "https://pbs.twimg.com/media/CuiC11VXgAAW5Kv.jpg"
            texto_wbk = escolhe_texto(textoes, 3, 0)
        } else if (alvo_requisita === "cantadas") {
            nome_wbk = "Vai dar namoro"
            foto_wbk = "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjlN00fmdjOpxTAglegPf4-i7_YDQCfFDZK94TUVyORci0HVQN7-UcQezywuYMWJg1-BWn14JTFChll8LuHttNwxVIDmh0KtyFwtQOgOOOi8z54-z4kzqzLCD1MbSSc2_XnlD-9p8XSo5Wkwz9ZkdheKaDKnzuJJ1KsAHoKIaSt-c9ORDW4Fgd9m2lg/s990/rodrigo-faro-record-fase-ruim-audiencia-reproducao-grande_fixed_large.jpg"
            texto_wbk = escolhe_texto(cantadas, 0, 0)
        }

        let json_final = {
            nome: nome_wbk,
            foto: foto_wbk,
            texto: texto_wbk
        }

        return res.json(json_final)
    }
}

function escolhe_texto(vetor_json, caso_acionado, alvo) {

    let num, texto_completo

    // Reseta o vetor de repetidas em mudança de comando
    if (vetor_json.length === retiradas.length || caso_acionado !== caso)
        retiradas = []

    caso = caso_acionado

    do {
        num = Math.round((vetor_json.length - 1) * Math.random())
    } while (retiradas.includes(num))

    retiradas.push(num)

    if (caso === 4) return num // Curiosidades

    if (caso_acionado !== 3 && caso_acionado !== 4)
        texto_completo = vetor_json[num]
    else { // Casos com textos acima de 500 caracteres
        const key = Object.keys(vetor_json[num])

        texto_completo = key.toString()

        if (vetor_json[num][key] !== null)
            texto_completo += ` ${vetor_json[num][key].toString()}`
    }

    return texto_completo
}

module.exports = new txt_wbk()