
// const { token_pula } = require('../../config.json')
const { existsSync, writeFileSync } = require('fs')

class Pula {
    show(req, res) {

        const requisicao = req.query
        const token_pula = "placholder"

        if (!requisicao.token || requisicao.token !== token_pula) return res.json({ status: 404 })

        if (requisicao.new)
            return new_user(res)

        if (requisicao.check)
            return check_user(res, requisicao)

        if (requisicao.sync)
            return sincronizar(res, requisicao)

        if (requisicao.save)
            return salvar_dados(res, requisicao)

        return res.json({ status: 200 })
    }
}

function new_user(res) {

    let token

    do {
        token = gera_token()
    } while (existsSync(`./data/pula/${token.slice(0, 5)}.json`))

    const data = {
        sync: 0
    }

    writeFileSync(`./data/pula/${token.slice(0, 5)}.json`, JSON.stringify(data))
    delete require.cache[require.resolve(`../../data/pula/${token.slice(0, 5)}.json`)]

    return res.json({ status: "Ok", token: token })
}

function check_user(res, requisicao) {
    // Verifica se o usuário existe
    if (existsSync(`./data/pula/${requisicao.token_user.slice(0, 5)}.json`))
        return res.json({ status: 200 })
    else
        return res.json({ status: 404 })
}

function sincronizar(res, requisicao) {
    // Envia os dados do usuário informado
    if (existsSync(`./data/pula/${requisicao.token_user.slice(0, 5)}.json`)) {
        const data = require(`../../data/pula/${requisicao.token_user.slice(0, 5)}.json`)

        return res.json({ data: data })
    } else
        return res.json({ status: 404 })
}

function salvar_dados(res, requisicao) {

    if (existsSync(`./data/pula/${requisicao.token_user.slice(0, 5)}.json`)) {

        // Salvando os dados no json do usuário
        writeFileSync(`./data/pula/${requisicao.token_user.slice(0, 5)}.json`, requisicao.data)
        delete require.cache[require.resolve(`../../data/pula/${requisicao.token_user.slice(0, 5)}.json`)]

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