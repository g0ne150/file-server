import Router from "@koa/router"

const indexController = new Router()

indexController.get("/", (ctx) => {
    ctx.redirect("/file/new")
})

export default indexController
