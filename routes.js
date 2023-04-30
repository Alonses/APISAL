const { Router } = require("express")

const Mine = require('./app/controllers/mine')
const Randomicos = require('./app/controllers/randomicos')
const Curiosidades = require('./app/controllers/curiosidades')
const History = require('./app/controllers/history')
const Games = require("./app/controllers/games")
const Status = require("./app/controllers/status")
const Pula = require("./app/controllers/pula")
const GtaWeather = require("./app/controllers/gtaweather")
const Charadas = require('./app/controllers/charadas')

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

module.exports = routes