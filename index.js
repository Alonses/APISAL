const express = require("express")
const app = express()
const port = process.env.PORT || 3000

const cantadas = require("./src/base/cantadas.json")
const jailson = require("./src/base/jailson.json")
const rasputia = require("./src/base/rasputia.json")
const textoes = require("./src/base/textoes.json")

let retiradas = []
let caso = 0 // Redefine o array de retiradas caso altere o valor

app.get("/cantadas", (req, res) => {

    let json_final = {
        nome: "Vai dar namoro",
        foto: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjlN00fmdjOpxTAglegPf4-i7_YDQCfFDZK94TUVyORci0HVQN7-UcQezywuYMWJg1-BWn14JTFChll8LuHttNwxVIDmh0KtyFwtQOgOOOi8z54-z4kzqzLCD1MbSSc2_XnlD-9p8XSo5Wkwz9ZkdheKaDKnzuJJ1KsAHoKIaSt-c9ORDW4Fgd9m2lg/s990/rodrigo-faro-record-fase-ruim-audiencia-reproducao-grande_fixed_large.jpg",
        texto: cantadas[escolhe_numero(cantadas, 0)]
    }

    return res.json(json_final)
})

app.get("/jailson", (req, res) => {
    
    // Há frases do jailson e do guina aqui
    let num = escolhe_numero(jailson, 1);
    let nome_wbk = "Jailson Mendes";
    let foto_wbk = "https://upload.wikimedia.org/wikipedia/pt/8/8d/Jailson_Mendes.jpg"
    let texto_wbk = jailson[num]

    // Frases do guina
    if(jailson[num].startsWith("G|")){
        nome_wbk = "Paulo Guina"
        foto_wbk = "https://pbs.twimg.com/profile_images/1404555803646963712/nEtaBLBK_400x400.jpg"
        texto_wbk = jailson[num].replace("G|", "");
    }

    let json_final = {
        nome: nome_wbk,
        foto: foto_wbk,
        texto: texto_wbk
    }

    return res.json(json_final)
});

app.get("/rasputia", (req, res) => {
    let json_final = {
        nome: "Rasputia Latimore",
        foto: "https://static.wikia.nocookie.net/antagonists/images/4/40/Rasputia_Latimore.jpg/revision/latest/scale-to-width-down/300?cb=20121110030016",
        texto: rasputia[escolhe_numero(rasputia, 2)]
    }

    return res.json(json_final)
})

app.get("/textoes", (req, res) => {

    const num = escolhe_numero(textoes, 3)
    const key = Object.keys(textoes[num])

    if(textoes[num][key] !== null){
        json_final = {
            nome: "Bluezão",
            foto: "https://pbs.twimg.com/media/CuiC11VXgAAW5Kv.jpg",
            texto: key.toString(),
            texto_2: textoes[num][key].toString()
        }
    }else{
        json_final = {
            nome: "Bluezão",
            foto: "https://pbs.twimg.com/media/CuiC11VXgAAW5Kv.jpg",
            texto: key.toString()
        }
    }
    
    return res.json(json_final)
})

app.listen(port, () => {
    console.log("Servidor ligado na porta ", port)
})

function escolhe_numero(vetor_json, caso_acionado){
    
    let num;

    // Reseta o vetor de repetidas em mudança de comando
    if(vetor_json.length == retiradas.length || caso_acionado != caso){
        retiradas = [];
    }

    caso = caso_acionado;

    do{
        num = Math.round((vetor_json.length - 1) * Math.random())
    }while(retiradas.includes(num))

    retiradas.push(num)

    return num;
}