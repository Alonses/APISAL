const express = require('express')
const cors = require('cors')
const routes = require('./routes')

class App {
    constructor() {
        this.app = express()
        this.middlewares()
        this.routes()
        this.app.options('*', cors())
    }

    middlewares() {
        this.app.use(express.json())

        this.app.use((req, res, next) => {
            res.header("Access-Controll-Allow-Credentials", 'true')
            res.header("Access-Controll-Allow-Origin", "*")
            res.header("Access-Controll-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT")
            res.header("Access-Controll-Allow-Headers", 'X-CSRF-Token, X-Requested-With')
            
            this.app.use(cors({
                origin: '*'
            }))
            next()
        })
    }

    routes() {
        this.app.use(routes)
    }
}

module.exports = new App().app