const { Router } = require("express")

const Comandos = require('../app/controllers/comandos')
const txt_wbk = require('../app/controllers/txt_wbk')
const Curiosidades = require('../app/controllers/curiosidades')
const History = require('../app/controllers/history')
const Games = require("../app/controllers/games")

const routes = new Router()

routes.get('/comandos', Comandos.show)
routes.get('/random', txt_wbk.show)
routes.get('/curiosidades', Curiosidades.show)
routes.get('/history', History.show)
routes.get('/games', Games.show)

module.exports = routes