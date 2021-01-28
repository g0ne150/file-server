import { port } from "./config"

import Koa from "koa"
import staticServe from "koa-static"

const app = new Koa();

// 简单错误处理
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        console.error(`error: `, e)
        if (e instanceof Error) {
            ctx.body = {
                code: 500,
                msg: e.message
            };
        }
    }
})

// 静态资源
app.use(staticServe(`${__dirname}/../public`))

app.listen(port, () => {
    console.log(`Server is running: http://localhost:${port}`)
})