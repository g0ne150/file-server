import { PORT } from "./config"
import "reflect-metadata"

import Koa from "koa"
import staticServe from "koa-static"

const app = new Koa()

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

// serve for static resources
app.use(staticServe(`${__dirname}/../public`))

app.listen(PORT, () => {
    console.log(`Server is running: http://localhost:${PORT}`)
})
