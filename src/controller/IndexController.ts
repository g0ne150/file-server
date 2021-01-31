import Router from "@koa/router"
import { FILE_CONTROLLER_PREFIX } from "./FileController"

const indexController = new Router()

indexController.get("/", (ctx) => {
    ctx.redirect(`${FILE_CONTROLLER_PREFIX}/new`)
})

export default indexController
