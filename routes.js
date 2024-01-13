const { Router } = require("express")

const Mine = require('./app/functions/mine')
const Randomicos = require('./app/functions/randomicos')
const Curiosidades = require('./app/functions/curiosidades')
const History = require('./app/functions/history')
const Games = require("./app/functions/games")
const Status = require("./app/functions/status")
const Pula = require("./app/functions/pula")
const GtaWeather = require("./app/functions/gtaweather")
const Charadas = require('./app/functions/charadas')
const Lastfm = require('./app/functions/lastfm')

const routes = new Router()

routes.get('/mine', Mine.show)
routes.get('/random', Randomicos.show)
routes.get('/curiosidades', Curiosidades.show)
routes.get('/history', History.show)
routes.get('/games', Games.show)
routes.get('/status', Status.show)
routes.get('/pula', Pula.show)
routes.get('/gta', GtaWeather.show)
routes.get('/charadas', Charadas.show)
routes.get('/lastfm', Lastfm.show)

module.exports = routes