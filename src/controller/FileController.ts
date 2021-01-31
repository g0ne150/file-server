import Router from "@koa/router"
import { LOCK_DURATION } from "../config"
import EditFileDTO from "../service/dto/EditFileDTO"
import { fileService } from "../service/FileService"
import { generateUserToken } from "../util/userUtils"

export const FILE_CONTROLLER_PREFIX = "/file"

const EDIT_FILE_USER_TOKEN_KEY = "edit-file-user-token"

const getEditFileUserTokenKey = (fileId: number) =>
    `${EDIT_FILE_USER_TOKEN_KEY}-${fileId}`

const fileController = new Router({ prefix: FILE_CONTROLLER_PREFIX })

fileController.get("/new", async (ctx) => {
    ctx.state.title = "New file"
    await ctx.render("index")
})

fileController.post("/new/save", async (ctx) => {
    const fileName = ctx.request.body["file-name"]
    const fileContent = ctx.request.body["file-content"]

    await fileService.addFile(fileName, fileContent)
    ctx.redirect(`${FILE_CONTROLLER_PREFIX}/list`)
})

fileController.get("/download/:id", async (ctx) => {
    const fileId = parseInt(ctx.params["id"])
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

fileController.get("/edit/:id", async (ctx) => {
    const now = Date.now()
    const fileId = parseInt(ctx.params["id"])
    const tokenKey = getEditFileUserTokenKey(fileId)

    const userTokenFromCookie = ctx.cookies.get(tokenKey) || null
    const currentUserToken = userTokenFromCookie || generateUserToken()

    const file = await fileService.tryEditFile(fileId, currentUserToken, now)

    if (
        userTokenFromCookie === null &&
        EditFileDTO.getIsLockedBy(file, currentUserToken)
    ) {
        ctx.cookies.set(tokenKey, currentUserToken, {
            expires: new Date(now + LOCK_DURATION),
        })
    }

    ctx.state = { file, title: "File edit" }

    await ctx.render("fileEdit")
})

fileController.post("/edit/udpate/:id", async (ctx) => {
    const fileId = parseInt(ctx.params["id"])
    const currentUserToken =
        ctx.cookies.get(getEditFileUserTokenKey(fileId)) || null
    const fileContent: string = ctx.request.body["file-content"]

    await fileService.updateFile(fileId, currentUserToken, fileContent)
    ctx.redirect(`${FILE_CONTROLLER_PREFIX}/list`)
})

export default fileController
