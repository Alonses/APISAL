const { Router } = require("express");

const Comandos = require('../app/controllers/comandos');
const txt_wbk = require('../app/controllers/txt_wbk');
const Curiosidades = require('../app/controllers/curiosidades');

const routes = new Router();

routes.get('/comandos', Comandos.show);
routes.get('/random', txt_wbk.show);
routes.get('/curiosidades', Curiosidades.show);

module.exports = routes;