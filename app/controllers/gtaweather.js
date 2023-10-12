const GTAWeather = require("../../data/modules/gtaweather")

class GtaWeather {
    show(req, res) {

        const requisicao = req.query
        const language = requisicao.idioma ? requisicao.idioma : 'pt-br'

        let weather = ""

        try {
            weather = GTAWeather.GetForecast(language)
        } catch (err) {
            return res.json({ status: "504" })
        }

        return res.json(weather)
    }
}

module.exports = new GtaWeather()