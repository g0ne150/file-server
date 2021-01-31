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
app.on("error", (err) => {
    console.error("server error", err)
})

render(app, {
    root: path.join(__dirname, "view"),
})

app.use(bodyParser())

applyController(indexController)
applyController(fileController)

app.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}`)
})
