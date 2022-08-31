const express = require('express')
const cors = require('cors')
const routes = require('./routes')

class App {
    constructor() {
        this.app = express()
        this.middlewares()
        this.routes()
    }

    middlewares() {
        this.app.use(express.json())

        this.app.use((req, res, next) => {
            res.header("Access-Controll-Allow-Origin", "*")
            res.header("Access-Controll-Allow-Methods", "Get")
            
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