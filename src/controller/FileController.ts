import Router from "@koa/router"
import { fileService } from "../service/FileService"

const fileController = new Router({ prefix: "/file" })

fileController.get("/new", async (ctx) => {
    ctx.state.title = "New file"
    await ctx.render("index")
})

fileController.post("/new/save", async (ctx) => {
    console.log(ctx.request)
})

fileController.get("/download/:fileId", async (ctx) => {
    const fileId = parseInt(ctx.params["fileId"])
    const file = await fileService.queryFile(fileId)
    if (file === undefined || file === null) {
        ctx.throw(404, "Target file not found")
    }
    ctx.set({
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${file.fileName}"`,
    })
    // TODO 从本地文件读取文件内容
    ctx.body = "file content"
})

fileController.get("/list", async (ctx) => {
    ctx.state = {
        title: "File list",
        fileList: await fileService.queryAllFiles(),
    }
    await ctx.render("fileList")
})

export default fileController
