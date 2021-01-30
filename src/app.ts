import "reflect-metadata"
import path from "path"
import Koa from "koa"
import render from "koa-ejs"
import { PORT } from "./config"
import fileController from "./controller/FileController"

const app = new Koa()

render(app, {
    root: path.join(__dirname, "view"),
    debug: true,
})

// Simple error handlingd
app.use(async (ctx, next) => {
    try {
        await next()
    } catch (e) {
        console.error(`error: `, e)
        if (e instanceof Error) {
            ctx.status = 500
            ctx.body = {
                code: 500,
                msg: e.message,
            }
        }
    }
})

app.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}`)
})

app.use(fileController.routes()).use(fileController.allowedMethods())
