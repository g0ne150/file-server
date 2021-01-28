import { port } from "./config"

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
            ctx.body = {
                code: 500,
                msg: e.message,
            }
        }
    }
})

// serve for static resources
app.use(staticServe(`${__dirname}/../public`))

app.listen(port, () => {
    console.log(`Server is running: http://localhost:${port}`)
})
