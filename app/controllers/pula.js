
// const { token_pula } = require('../../config.json')
const { existsSync, writeFileSync, readdirSync } = require('fs')

class Pula {
    show(req, res) {

        const requisicao = req.query
        const token_pula = "placholder"

        if (!requisicao.token || requisicao.token !== token_pula) return res.json({ status: 404 })

        if (requisicao.new)
            return new_user(res)

        if (requisicao.sync)
            return sincronizar(res)

        if (requisicao.save)
            return salvar_dados(res)

        return res.json({ status: 200 })
    }
}

function new_user(res) {

    let token

    do {
        token = gera_token()
    } while (existsSync(`./data/pula/${token.slice(0, 5)}.json`))

    const data = {
        money: null,
        pulos: null,
        mortes: null
    }

    writeFileSync(`./data/pula/${token.slice(0, 5)}.json`, JSON.stringify(data))
    delete require.cache[require.resolve(`../../data/pula/${token.slice(0, 5)}.json`)]

    return res.json({ status: "Ok", token: token })
}

function sincronizar(res) {

    const token = res.token_user

    if (existsSync(`./data/pula/${token.slice(0, 5)}.json`)) {
        const data = require(`../../data/pula/${token.slice(0, 5)}.json`)

        return res.json({ data: data })
    } else
        return res.json({ status: 404 })
}

function salvar_dados(res) {

    const token = res.token_user

    if (existsSync(`./data/pula/${token.slice(0, 5)}.json`)) {

        console.log(res.data)

        return res.json({ status: 200 })
    } else
        return res.json({ status: 404 })
}

function gera_token() {

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