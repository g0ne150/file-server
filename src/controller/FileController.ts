import Router from "@koa/router"
import { fileService } from "../service/FileService"

const fileController = new Router()

fileController.get("/", async (ctx) => {
    ctx.state.title = "New file"
    await ctx.render("index")
})

fileController.get("/file/list", async (ctx) => {
    ctx.state = {
        title: "File list",
        fileList: await fileService.queryAllFiles(),
    }
    await ctx.render("fileList")
})

export default fileController
