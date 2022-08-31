
const { token_pula } = require('../../config.json')

class Pula {
    show(req, res){
        
        const requisicao = req.query

        if(!requisicao.token || requisicao.token !== token_pula) return res.json({status: 404})

        const token = gera_token()

        return res.json({status: "Ok", token: token})
    }
}

function gera_token(){

    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-'
    let randomString = ''

    for (let i = 0; i < 21; i++) {
        let randomPoz = Math.floor(Math.random() * charSet.length)
        randomString += charSet.slice(randomPoz, randomPoz + 1)
    }
    
    return shuffle(randomString.split(''))

}

function shuffle(o) {
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x)
    return o.join("")
}


module.exports = new Pula()