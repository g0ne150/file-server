import Router from "@koa/router"

const IndexController = new Router()

IndexController.get("/", (ctx) => {
    ctx.redirect("/file/new")
})

export default IndexController
