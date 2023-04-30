require('dotenv').config()

const express = require('express')
const cors = require('cors')
const routes = require('./routes')

const database = require('./app/database/database')

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
            res.header("Access-Control-Allow-Credentials", 'true')
            res.header("Access-Control-Allow-Origin", "*")
            res.header("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT")
            res.header("Access-Control-Allow-Headers", 'X-CSRF-Token, X-Requested-With')

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

database.setup(process.env.url_dburi)

module.exports = new App().app