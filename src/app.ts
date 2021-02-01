import Koa from "koa"
import Router from "@koa/router"
import render from "koa-ejs"
import path from "path"
import "reflect-metadata"
import { PORT } from "./config"
import bodyParser from "koa-bodyparser"

import fileController from "./controller/FileController"
import indexController from "./controller/IndexController"

const applyController = (controller: Router) => {
    app.use(controller.routes()).use(controller.allowedMethods())
}

const app = new Koa()

// Simple error handling
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (e) {
        console.error(e)
        if (e instanceof Error) {
            ctx.body = e.message
        }
    }
})

render(app, {
    root: path.join(__dirname, "view"),
    async: true,
})

app.use(bodyParser())

applyController(indexController)
applyController(fileController)

app.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}`)
})
