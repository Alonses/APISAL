const { getGames } = require("epic-free-games")

let dados = []

class Games {
    show(req, res) {

        // Coletando os parâmetros da requisição
        const requisicao = req.query
        let reload = false

        if (requisicao.reload)
            reload = true

        if (dados.length < 1 || reload) { // Se reload for definido, força o update
            getGames("BR", true).then(data => {
                dados = data.currentGames

                retorna_games(res)
            })
                .catch(err => {
                    console.log(err)
                    return res.json({ status: "404" })
                })
        } else
            retorna_games(res)
    }
}

function retorna_games(res) {

    let array_games = []

    dados.forEach(jogo => {

        let thumbnail_game = jogo.keyImages[0].url

        array_games.push({
            nome: jogo.title,
            preco: parseFloat(jogo.price.totalPrice.fmtPrice.originalPrice.replace("R$", "")),
            descricao: jogo.description,
            thumbnail: thumbnail_game,
            link: `https://store.epicgames.com/pt-BR/p/${jogo.catalogNs.mappings[0].pageSlug}`,
            inicia: formata_data(jogo.promotions.promotionalOffers[0].promotionalOffers[0].startDate.slice(5, 10)),
            expira: formata_data(jogo.promotions.promotionalOffers[0].promotionalOffers[0].endDate.slice(5, 10))
        })
    })

    return res.json(array_games)
}

function formata_data(data) {
    return `${data.slice(3, 5)}/${data.slice(0, 2)}`
}

module.exports = new Games()