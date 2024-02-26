const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args))

const formata_texto = require('../formaters/formata_texto')
let horas_tocadas, horas_passadas

const months = {
    Fev: 'feb',
    Abr: 'apr',
    Maio: 'may',
    Ago: 'aug',
    Set: 'sep',
    Oct: 'oct',
    Dez: 'dec',
}

class Lastfm {
    show(req, res) {

        // Coletando os parâmetros da requisição
        const requisicao = req.query

        if (!requisicao.profile)
            return res.json({ status: "505" })

        const usuario_alvo = `https://www.last.fm/pt/user/${requisicao.profile}`
        const usuario_semanal = `https://www.last.fm/pt/user/${requisicao.profile}/listening-report/week`

        fetch(usuario_alvo)
            .then(response => response.text())
            .then(async resultado => {

                const convert = resultado.replace(/  /g, "").replace(/\n/g, "")

                try {
                    if (resultado.includes("Página não encontrada"))
                        return res.json({ status: "404" })

                    let descricao, criacao_conta, avatar, nome, obsessao, musica_obsessao, artista_obsessao, media_scrobbles = 0, musicas_ouvidas = 0, artistas_ouvidos, faixas_preferidas = 0, scrobble_atual, scrobble_atual_curtido, scrobble_atual_cover

                    if (!resultado.includes("ainda não ouviu nenhuma música.")) {
                        if (convert.includes("<h2>Sobre mim</h2><p>")) {
                            descricao = convert.split("<h2>Sobre mim</h2><p>")[1].split("</p></section><section")[0]
                            descricao = formata_texto(descricao.replace(/\s{2,}/g, ' ').replace("\" ", "\""))
                        }

                        if (resultado.includes("<span class=\"header-scrobble-since\">"))
                            criacao_conta = formata_data(resultado.split("<span class=\"header-scrobble-since\">")[1].split("</span>")[0].replace("• em scrobble desde ", "").trim().replace(/\n/g, ""))

                        avatar = `https://lastfm.freetls.fastly.net/i/u/avatar170s/${resultado.split("alt=\"Avatar de ")[0].split("https://lastfm.freetls.fastly.net/i/u/avatar170s/")[1].replace("\"", "").trim().replace(/\n/g, "")}`
                        nome = resultado.split("Perfil musical de ")[1].split(" | Last.fm</title>")[0]

                        if (resultado.includes("data-analytics-action=\"ObsessionTrackName\"")) {
                            obsessao = resultado.split("data-analytics-action=\"ObsessionTrackName\"")[1]

                            musica_obsessao = obsessao.split("</a>")[0].split(">")[1]
                            artista_obsessao = obsessao.split("data-analytics-action=\"ObsessionArtistName\"")[1].split("</a>")[0].split(">")[1]

                            obsessao = `${musica_obsessao} - ${artista_obsessao}`
                        }

                        if (convert.includes("<trclass=\"chartlist-rowchartlist-row--now-scrobblingchartlist-row")) {

                            scrobble_atual = `${convert.split("<trclass=\"chartlist-rowchartlist-row--now-scrobblingchartlist-row")[1].split("data-track-name=\"")[1].split("\"data-track-url=\"")[0]} - ${convert.split("<trclass=\"chartlist-rowchartlist-row--now-scrobblingchartlist-row")[1].split("\"data-artist-name=\"")[1].split("\"data-artist-url=")[0]}`

                            scrobble_atual_curtido = convert.split("\"data-toggle-button-current-state=\"")[1].split("\"><spanclass=\"")[0] === "unloved" ? "🖤" : "💙"

                            scrobble_atual_cover = convert.split("<trclass=\"chartlist-rowchartlist-row--now-scrobblingchartlist-row")[1].split("\"alt=\"")[0].split("class=\"cover-art\"><imgsrc=\"")[1].replace("/u/64s/", "/u/1020s/")
                        }

                        // Média de músicas ouvidas p/ dia
                        if (resultado.includes("Média de "))
                            media_scrobbles = resultado.split("Média de ")[1].split(" scrobble")[0]

                        // Músicas ouvidas
                        if (resultado.includes(" faixas executadas)."))
                            musicas_ouvidas = resultado.split(" faixas executadas).")[0].split(" com (")[1]

                        // Artistas ouvidos
                        artistas_ouvidos = resultado.split("/library/artists\"")[1].split("</a>")[0].replace(">", "").replace(/ /g, "").replace(/\n/g, "")

                        // Faixas favoritas
                        if (resultado.includes("/loved\""))
                            faixas_preferidas = resultado.split("/loved\"")[2].split("</a>")[0].replace(">", "").replace(/ /g, "").replace(/\n/g, "")

                        const dados_user = {
                            nome: nome,
                            avatar: avatar,
                            descricao: descricao,
                            obsessao: obsessao,
                            scrobble_atual: {
                                faixa: scrobble_atual,
                                curtida: scrobble_atual_curtido,
                                cover: scrobble_atual_cover
                            },
                            timestamp_entrada: criacao_conta,
                            stats: {
                                musicas_ouvidas: musicas_ouvidas,
                                media_scrobbles: media_scrobbles,
                                artistas_ouvidos: artistas_ouvidos,
                                faixas_preferidas: faixas_preferidas
                            }
                        }

                        // Buscando histórico semanal do usuário
                        fetch(usuario_semanal)
                            .then(response => response.text())
                            .then(async semanal => {

                                semanal = semanal.replace(/ /g, "").replace(/\n/g, "")

                                let scrobbles_semanal = 0, media_semanal = 0, tempo_reproducao = 0, artistas_semanal = 0, albuns_semanal = 0

                                let scrobbles_semana_passada = 0, media_semana_passada = 0, tempo_reproducao_passada = 0, artistas_semana_passada = 0, albuns_semana_passada = 0

                                let indicador_scrobbles = "⏺️", indicador_media = "⏺️", indicador_tempo = "⏺️", indicador_artista = "⏺️", indicador_album = "⏺️"

                                if (!semanal.includes("não ouviu nenhuma música :(")) {
                                    // Scrobbles p/ dia
                                    if (semanal.includes("<divclass=\"item\">Faixas<divclass=\"count\">")) {

                                        scrobbles_semanal = semanal.split("<divclass=\"item\">Faixas<divclass=\"count\">")[1].split("</div>")[0]

                                        scrobbles_semana_passada = semanal.split(`<divclass="item">Faixas<divclass="count">${scrobbles_semanal}</div><divclass="comparison"><divclass="comparison">versus.`)[1].split("(semanapassada)")[0]

                                        indicador_scrobbles = regula_porcentagem(scrobbles_semanal, scrobbles_semana_passada, 0)
                                    }

                                    // Média de Scrobbles p/ dia
                                    if (semanal.includes("<divclass='quick-fact-data-value'>")) {

                                        media_semanal = semanal.split("<divclass='quick-fact-data-value'>")[2].split("</div><divclass='")[0]

                                        media_semana_passada = semanal.split(`<divclass='quick-fact-data-value'>${media_semanal}</div><divclass='quick-fact-data-detail'>/dia</div></div><pclass='quick-fact-comparison-text'>versus.`)[1].split("(semanapassada)")[0]

                                        indicador_media = regula_porcentagem(media_semanal, media_semana_passada, 0)
                                    }

                                    // Tempo de reprodução
                                    if (semanal.includes("<spanclass=\"quick-fact-title\">Tempodereprodução</")) {

                                        tempo_reproducao = semanal.split("<divclass='quick-fact-data-value'>")[1].split("s</div></")[0]

                                        tempo_reproducao_passada = semanal.split("<pclass='quick-fact-comparison-text'>versus.")[1].split("(semanapassada)</p>")[0]

                                        indicador_tempo = regula_porcentagem(tempo_reproducao, tempo_reproducao_passada, 1)
                                    }

                                    // Álbuns
                                    if (semanal.includes("<divclass=\"item\">Álbuns<divclass=\"count\">")) {

                                        albuns_semanal = semanal.split("<divclass=\"item\">Álbuns<divclass=\"count\">")[1].split("</div>")[0]

                                        albuns_semana_passada = semanal.split(`<divclass="item">Álbuns<divclass="count">${albuns_semanal}</div><divclass="comparison">versus.`)[1].split("(semanapassada)")[0]

                                        indicador_album = regula_porcentagem(albuns_semanal, albuns_semana_passada, 0)
                                    }

                                    // Artistas
                                    if (semanal.includes("<divclass=\"item\">Artistas<divclass=\"count\">")) {

                                        artistas_semanal = semanal.split("<divclass=\"item\">Artistas<divclass=\"count\">")[1].split("</div>")[0]

                                        artistas_semana_passada = semanal.split(`<divclass="item">Artistas<divclass="count">${artistas_semanal}</div><divclass="comparison"><divclass="comparison">versus.`)[1].split("(semanapassada)")[0]

                                        indicador_artista = regula_porcentagem(artistas_semanal, artistas_semana_passada, 0)
                                    }

                                    dados_user.week_stats = {
                                        album: {
                                            porcent: indicador_album,
                                            now: parseInt(albuns_semanal),
                                            before: parseInt(albuns_semana_passada)
                                        },
                                        artistas: {
                                            porcent: indicador_artista,
                                            now: parseInt(artistas_semanal),
                                            before: parseInt(artistas_semana_passada)
                                        },
                                        scrobbles: {
                                            porcent: indicador_scrobbles,
                                            now: parseInt(scrobbles_semanal),
                                            before: parseInt(scrobbles_semana_passada)
                                        },
                                        media: {
                                            porcent: indicador_media,
                                            now: parseInt(media_semanal),
                                            before: parseInt(media_semana_passada)
                                        },
                                        tempo: {
                                            porcent: indicador_tempo,
                                            now: horas_tocadas,
                                            before: horas_passadas
                                        }
                                    }
                                }

                                return res.json(dados_user)
                            })
                    } else
                        return res.json({ status: "401" })
                } catch (err) {
                    return res.json({ status: "402" })
                }
            })
            .catch(() => {
                return res.json({ status: "402" })
            })
    }
}

regula_porcentagem = (stats_semana, stats_passado, hora) => {

    if (hora) { // Formatando a hora para números inteiros
        let hr_tempo = 0 // Usado para converter dias em horas

        // Checando se há dias de reprodução registrados
        if (stats_semana.includes("dia")) {
            hr_tempo = parseInt(stats_semana.split("dia")[0]) * 24

            hr_tempo += parseInt(stats_semana.split(",")[1].split("hora")[0])
            stats_semana = hr_tempo
        } else // Apenas horas
            stats_semana = parseInt(stats_semana.split(" horas")[0])

        // Checando se há dias de reprodução registrados
        if (stats_passado.includes("dia")) {
            hr_tempo = parseInt(stats_passado.split("dia")[0]) * 24

            hr_tempo += parseInt(stats_passado.split(",")[1].split("hora")[0])
            stats_passado = hr_tempo
        } else // Apenas horas
            stats_passado = parseInt(stats_passado.split(" horas")[0])

        horas_tocadas = stats_semana
        horas_passadas = stats_passado
    } else {
        // Convertendo os números em formato de string para poder calcular
        stats_semana = parseInt(stats_semana.replace(".", ""))
        stats_passado = parseInt(stats_passado.replace(".", ""))
    }

    porcentagem = (100 * stats_semana) / stats_passado

    if (stats_semana < stats_passado)
        porcentagem = `🔽 ${(100 - porcentagem).toFixed(2)}`
    else
        porcentagem = `🔼 ${(porcentagem - 100).toFixed(2)}`

    return porcentagem
}

formata_data = (data) => {

    if (!data)
        return "0"

    const ano = data.split(" ")[2]
    let mes = data.split(" ")[1]
    const dia = data.split(" ")[0]

    if (months[mes])
        mes = months[mes]

    return new Date(`${ano} ${mes} ${dia}`).getTime() / 1000
}

module.exports = new Lastfm()