const { getGames } = require("epic-free-games")

let dados = []

class Games {
    show(req, res){
        
        if(dados.length < 1){
            getGames("BR", true).then(data => {
                dados = data.currentGames
                
                retorna_games(res)
            })
            .catch(err => {
                console.log(err)
                return res.json({status: "404"})
            })
        }else
            retorna_games(res)
    }
}

function retorna_games(res){

    let array_games = []

    dados.forEach(jogo => {
        array_games.push({
            nome: jogo.title,
            descricao: jogo.description,
            thumbnail: jogo.keyImages[0].url,
            link: `https://store.epicgames.com/pt-BR/p/${jogo.catalogNs.mappings[0].pageSlug}`,
            data_inicio: jogo.promotions.promotionalOffers[0].promotionalOffers[0].startDate.slice(5, 10),
            data_final: jogo.promotions.promotionalOffers[0].promotionalOffers[0].endDate.slice(5, 10)
        })
    });

    return res.json(array_games)
}

module.exports = new Games()