const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

class Mine {
    show(req, res) {

        const requisicao = req.query
        let objeto_encontrado = false, i = 0, pesquisa_crua = ""
        let url_icon = "", descricao_item = ""

        if (requisicao.item)
            pesquisa_crua = requisicao.item

        let idioma_definido = requisicao.idioma ? requisicao.idioma : 'pt-br'

        // Salva um provável nome interno
        const nome_interno = pesquisa_crua.split(" ").join("_").toLocaleLowerCase()
        const random = pesquisa_crua === ""

        fetch('https://raw.githubusercontent.com/odnols/inventario-mine/main/files/JSON/dados_locais.json')
            .then(response => response.json())
            .then(async lista_itens => {
                let descr_pesquisa, pesquisa

                while (i < lista_itens.length && !objeto_encontrado) {

                    let descri = false, nota_rodape = "⠀"
                    const nome_simplificado = lista_itens[i].name.replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase()

                    let auto_compl = nome_simplificado
                    auto_compl = auto_compl.toLocaleLowerCase()

                    if (lista_itens[i].item_descricao) {
                        descr_pesquisa = lista_itens[i].item_descricao[0].descricao.toLocaleLowerCase()

                        if (descr_pesquisa.includes(pesquisa_crua.toLocaleLowerCase()))
                            descri = true
                    }

                    // Responsável pelo auto completa da pesquisa
                    let nome_simplificado_verif = false, nome_interno_verif = false, auto_compl_verif = false

                    if (!pesquisa_crua.includes("\"")) { // Verificando se não é uma pesquisa bruta
                        auto_compl_verif = auto_compl.includes(pesquisa_crua.toLocaleLowerCase())
                        nome_simplificado_verif = pesquisa_crua === nome_simplificado
                        nome_interno_verif = pesquisa_crua === lista_itens[i].internal_name

                        pesquisa = pesquisa_crua
                    } else { // Pesquisa bruta
                        pesquisa = pesquisa_crua.replaceAll("\"", "")
                        auto_compl_verif = (pesquisa.length === nome_simplificado.length) && (pesquisa === nome_simplificado)
                    }

                    if (((nome_simplificado_verif || nome_interno_verif) || random || nome_interno === lista_itens[i].internal_name || descri || auto_compl_verif) && !objeto_encontrado) {

                        if (random && !objeto_encontrado)
                            i = Math.round((lista_itens.length - 1) * Math.random())

                        url_icon = `https://raw.githubusercontent.com/odnols/inventario-mine/main/img/itens/new/${lista_itens[i].type}/${lista_itens[i].icon}`

                        objeto_encontrado = true

                        if (lista_itens[i].description)
                            descricao_item = formata_descricao(lista_itens[i], idioma_definido, nome_interno)
                    }

                    if (objeto_encontrado) {

                        let descricao_item_wiki = ""
                        let nome_wiki = idioma_definido == "pt-br" ? lista_itens[i].name : lista_itens[i].internal_name;

                        // Procurando na wiki sobre a pesquisa
                        await fetch(`https://minecraft.fandom.com/${idioma_definido.slice(0, 2)}/wiki/${nome_wiki}`)
                            .then(response => response.text())
                            .then(async res => {

                                try { // Verifica se o item possui uma breve descrição
                                    descricao_item_wiki = res.split(`<meta name="description" content="`)[1]
                                    descricao_item_wiki = descricao_item_wiki.split(`"/>`)[0]
                                } catch (err) {
                                    descricao_item_wiki = ""
                                }
                            })

                        if (descricao_item.length > 0 && lista_itens[i].durability)
                            return res.json({ name: lista_itens[i].name, internal_name: lista_itens[i].internal_name, icon: url_icon, stats: { version: lista_itens[i].version, collectable: lista_itens[i].collectable, renewable: lista_itens[i].renewable, stackable: lista_itens[i].stackable, craftable: lista_itens[i].renewable, type: lista_itens[i].type, hide: lista_itens[i].hide, durability: lista_itens[i].durability[0].value }, description: descricao_item, wiki: descricao_item_wiki })
                        else if (descricao_item.length > 0)
                            return res.json({ name: lista_itens[i].name, internal_name: lista_itens[i].internal_name, icon: url_icon, stats: { version: lista_itens[i].version, collectable: lista_itens[i].collectable, renewable: lista_itens[i].renewable, stackable: lista_itens[i].stackable, craftable: lista_itens[i].renewable, type: lista_itens[i].type, hide: lista_itens[i].hide }, description: descricao_item, wiki: descricao_item_wiki })
                        else
                            return res.json({ name: lista_itens[i].name, internal_name: lista_itens[i].internal_name, icon: url_icon, stats: { version: lista_itens[i].version, collectable: lista_itens[i].collectable, renewable: lista_itens[i].renewable, stackable: lista_itens[i].stackable, craftable: lista_itens[i].renewable, type: lista_itens[i].type, hide: lista_itens[i].hide }, wiki: descricao_item_wiki })
                    }

                    i++
                }

                return res.json({ status: 404 })
            })
            .catch(() => {
                return res.json({ status: 502 })
            })
    }
}

function formata_descricao(dados_item, idioma, nome_interno) {

    let valores_item = ''

    if (dados_item.description[0].value.includes("[&")) { // Poções

        let nome_item = dados_item.name
        valores_item = dados_item.description[0].value

        valores_item = valores_item.replace("[&s[&3Efeito aplicado: ", "")
        valores_item = valores_item.replaceAll(") ", ")")
        valores_item = valores_item.replace("[&s[&r", "\n")
        valores_item = valores_item.replace("&s[&r", "\n")

        for (let i = 1; i < 4; i++)
            valores_item = valores_item.replaceAll(`[&${i}`, "\n")

        valores_item = valores_item.replaceAll("&2", "\n")
        valores_item = valores_item.replaceAll("&r", "")
        valores_item = valores_item.substr(1)

        if (!nome_item.includes("Poção") && !nome_item.includes("Frasco") && !nome_item.includes("Flecha"))

            if (nome_item === "Disco musical") {
                nome_item = 'Disco musical'

                valores_item = valores_item.replace("[&r", "")
                nome_item += ` | ${valores_item}`
                nome_pesquisa_wiki = valores_item
            }

        if (nome_item === "Livro encantado") {
            nome_item = 'Livro encantado'

            valores_item = valores_item.replace("[&r", "")
            nome_item += ` | ${valores_item}`
            nome_pesquisa_wiki = valores_item
        } else
            if (idioma !== "pt-br" || nome_interno === dados_item.internal_name)
                nome_item = dados_item.internal_name.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase())
    }

    return valores_item
}

module.exports = new Mine()