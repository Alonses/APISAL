const GTAWeather = require("../../data/modules/gtaweather")

class GtaWeather {
    show(req, res) {

        let weather = ""

        try {
            weather = GTAWeather.GetForecast();
        } catch (err) {
            return res.json({ status: "504" })
        }

        return res.json(weather)
    }
}

module.exports = new GtaWeather()