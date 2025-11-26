const musics = require("../database/musics.json")
const props = require("../database/props.json")

const played = [], tocando = {}
let montante = 0

class Radio {
    show(req, res) { return res.json(tocando) }
}

function select_random(start) {

    // Removendo metade a primeira metade do array após encher
    if (played.length > Math.floor(musics.length / 2))
        played.splice(0, Math.floor(musics.length / 2))

    if (montante > 1000) {
        track = Math.floor(Math.random() * props.length)
    } else
        do {
            track = Math.floor(Math.random() * musics.length)
        } while (played.includes(track))

    if (montante > 1000)
        played.push(track)

    // Verificando se foi uma requisição automática para iniciar com um tempo aleatório
    if (start) tocando.tempo = Math.floor(Math.random() * (montante > 1000 ? props[track].duration : musics[track].duration))
    else tocando.tempo = 0

    tocando.started = Math.floor(new Date().getTime() / 1000)
    tocando.music = montante > 1000 ? props[track] : musics[track]

    if (montante < 1000)
        montante += musics[track].duration

    // Reinicando contagem da propaganda
    if (montante > 1000) montante = 0

    sincroniza_tempo()
}

function sincroniza_tempo() {

    const tempo_agora = Math.floor(new Date().getTime() / 1000)
    let diferenca = tempo_agora - tocando.started

    // Apenas quando a música acaba
    if ((tocando.tempo + diferenca) < tocando.music.duration)
        setTimeout(() => { sincroniza_tempo() }, 1000)
    else
        select_random()
}

module.exports = new Radio()
module.exports.select_random = select_random