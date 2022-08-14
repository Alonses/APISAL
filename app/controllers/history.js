const fetch = (...args) =>
import('node-fetch').then(({ default: fetch }) => fetch(...args));

let datas = [], fontes = [], ano_materias = [], acontecimento_final = []
let acontecimentos = []
let data_anterior = ""

class History {
    show(req, res){

        // Coletando os parâmetros da requisição
        const requisicao = req.query
        let data, dia, mes, idioma_definido = "pt-br", acontecimento = "lista"

        if(!requisicao.data){
            data = new Date()
            dia = data.getDate()
            mes = data.getMonth() + 1

            data = `${data.getDate()}/${("0"+ (data.getMonth() + 1)).substr(-2)}`
        }else{
            data = requisicao.data
            dia = data.slice(0, 2)
            mes = data.slice(4, 5)
        }

        // Organizando os parâmetros
        if(requisicao.lang)
            idioma_definido = requisicao.lang

        if(requisicao.acon)
            acontecimento = requisicao.acon

        const url_completa = `https://history.uol.com.br/hoje-na-historia/${data}`

        if(acontecimento_final.length < 1 || data !== data_anterior){

            // Limpando os dados anteriores
            datas = [], fontes = [], ano_materias = [], acontecimento_final = []
            acontecimentos = []
            
            fetch(url_completa)
            .then(response => response.text())
            .then(async resultados => {
                
                // Separando os acontecimentos
                let alvos = resultados.split("<div class=\"card-img-overlay\">")
                alvos.shift()

                for(let i = 0; i < alvos.length; i++){
                    data = alvos[i].split("<div class=\"field field--name-field-date field--type-datetime field--label-hidden field__item\">")[1]
                    const ano_materia = data.slice(0, 4)
                    
                    let acontece = alvos[i].split("hreflang=\"pt-br\">")[1]
                    acontece = acontece.split("</a>")[0]
    
                    let link_materia = alvos[i].split("hreflang=\"pt-br\">")[0]
                    link_materia = link_materia.split("<a href=\"")[1]
                    link_materia = link_materia.replace("\"", "")
                    
                    if(idioma_definido === "pt-br")
                        datas.push(`${dia}/${("0"+ mes).substr(-2)}, ${ano_materia}`)
                    else
                        datas.push(`${mes} ${dia}, ${ano_materia}`)
    
                    ano_materias.push(ano_materia)
                    acontecimento_final.push(acontece)
                    fontes.push(`https://history.uol.com.br${link_materia}`)
                }

                if(acontecimento_final.length < 1)
                    return res.json({ status: "404" })
                
                retorna_valores(res, acontecimento)
            })
        }else
            retorna_valores(res, acontecimento)

        data_anterior = data
    }
}

// Retorna os eventos ou o evento personalizado escolhido
function retorna_valores(res, acontecimento){

    if(acontecimento == "lista"){ // Lista de acontecimentos em uma data
        
        let lista_acontecimentos = [];

        for(let i = 0; i < datas.length; i++){
            lista_acontecimentos.push({
                "acontecimento": acontecimento_final[i],
                "data_acontecimento": datas[i],                
                "fonte": fontes[i],
                "ano": ano_materias[i]
            })
        }
        
        return res.json(lista_acontecimentos);
    }else if(acontecimento == "alea"){

        if(acontecimentos.length == datas.length) // Limpando os acontecimentos aleatórios
            acontecimentos = []

        let num

        do{
            num = Math.round(Math.random() * datas.length)
        }while(acontecimentos.includes(num))
        
        let acontecimento_aleatorio = {
            "acontecimento": acontecimento_final[num],
            "data_acontecimento": datas[num],                
            "fonte": fontes[num],
            "ano": ano_materias[num]
        }

        return res.json(acontecimento_aleatorio)

    }else{ // Acontecimento escolhido

        if(acontecimento < datas.length + 1 && acontecimento > 0){

            let acontecimento_escolhido = {
                "acontecimento": acontecimento_final[acontecimento - 1],
                "data_acontecimento": datas[acontecimento - 1],
                "fonte": fontes[acontecimento - 1],
                "ano": ano_materias[acontecimento - 1]
            }

            return res.json(acontecimento_escolhido)
        }else
            return res.json({status: "404" })
    }
}

module.exports = new History()