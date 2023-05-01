const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

let datas = [], fontes = [], ano_materias = [], acontecimento_final = []
let acontecimentos = []
let data_anterior = ""

class History {
    show(req, res) {

        // Coletando os parâmetros da requisição
        const requisicao = req.query
        let data, dia, mes, idioma_definido = "pt-br", acontecimento = "lista"

        if (!requisicao.data) {
            data = new Date()
            dia = data.getDate()
            mes = data.getMonth() + 1

            data = `${("0" + (data.getDate())).substr(-2)}/${("0" + (data.getMonth() + 1)).substr(-2)}`
        } else {
            data = requisicao.data
            dia = data.slice(0, 2)
            mes = data.slice(4, 5)
        }

        // Organizando os parâmetros
        if (requisicao.lang)
            idioma_definido = requisicao.lang

        if (requisicao.acon)
            acontecimento = requisicao.acon

        if (acontecimento_final.length < 1 || data !== data_anterior) {

            // Limpando os dados anteriores
            datas = [], fontes = [], ano_materias = [], acontecimento_final = []
            acontecimentos = []

            fetch(`https://history.uol.com.br/hoje-na-historia/${data}`)
                .then(response => response.text())
                .then(async resultados => {

                    // Separando os acontecimentos
                    let alvos = resultados.split("<div class=\"card-img-overlay\">")
                    alvos.shift()

                    for (let i = 0; i < alvos.length; i++) {
                        data = alvos[i].split("<div class=\"field field--name-field-date field--type-datetime field--label-hidden field__item\">")[1]
                        const ano_materia = data.slice(0, 4)

                        let acontece = alvos[i].split("hreflang=\"pt-br\">")[1]
                        acontece = acontece.split("</a>")[0]

                        let link_materia = alvos[i].split("hreflang=\"pt-br\">")[0]
                        link_materia = link_materia.split("<a href=\"")[1]
                        link_materia = link_materia.replace("\"", "")

                        if (idioma_definido === "pt-br")
                            datas.push(`${dia}/${("0" + mes).substr(-2)}, ${ano_materia}`)
                        else
                            datas.push(`${mes} ${dia}, ${ano_materia}`)

                        ano_materias.push(ano_materia)
                        acontecimento_final.push(acontece)
                        fontes.push(`https://history.uol.com.br${link_materia}`)
                    }

                    if (acontecimento_final.length < 1)
                        return res.json({ status: "404" })

                    retorna_valores(res, acontecimento)
                })
        } else
            retorna_valores(res, acontecimento)

        data_anterior = data
    }
}

// Retorna os eventos ou o evento personalizado escolhido
function retorna_valores(res, acontecimento) {

    if (acontecimento == "lista") { // Lista de acontecimentos em uma data

        let lista_acontecimentos = []

        for (let i = 0; i < datas.length; i++) {
            lista_acontecimentos.push({
                "acontecimento": acontecimento_final[i],
                "data_acontecimento": datas[i],
                "fonte": fontes[i],
                "ano": ano_materias[i]
            })
        }

        return res.json(lista_acontecimentos)
    } else {

        let num = acontecimento - 1

        if (acontecimento == "alea") { // Escolhendo um acontecimento aleatório

            if (acontecimentos.length == datas.length) // Limpando os acontecimentos aleatórios
                acontecimentos = []

            do {
                num = Math.round((datas.length - 1) * Math.random())
            } while (acontecimentos.includes(num))

            acontecimentos.push(num)
        }

        fetch(fontes[num])
            .then(response => response.text())
            .then(async res_artigo => {

                // Separando os dados do acontecimento
                let imagem = res_artigo.split("\"image\":{\"@type\":\"ImageObject\",\"url\":\"")[1]
                imagem = imagem.split("\"},\"datePublished\":\"")[0]

                let descricao = res_artigo.split("<div class=\"clearfix text-formatted field field--name-body field--type-text-with-summary field--label-hidden field__item\">")[1]

                descricao = descricao.split("</p>")[0]
                descricao = descricao.slice(0, 350) + "..."
                descricao = descricao.replace("<p>", "")
                descricao = descricao.replace("<div>", "")

                let detalhes_acontecimento = {
                    "acontecimento": acontecimento_final[num],
                    "data_acontecimento": datas[num],
                    "fonte": fontes[num],
                    "ano": ano_materias[num],
                    "descricao": descricao,
                    "imagem": imagem
                }

                return res.json(detalhes_acontecimento)
            })
            .catch(() => { // Consulta com erro
                return res.json({ status: "404" })
            })
    }
}

module.exports = new History()