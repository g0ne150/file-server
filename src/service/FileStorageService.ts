import path from "path"
import { createReadStream, constants } from "fs"

import { stat, readFile, writeFile, access } from "fs/promises"
import { FILE_STORAGE_PATH } from "../config"

const commonFileOptions: { encoding: BufferEncoding } = { encoding: "utf-8" }

class FileStorageService {
    async getFileReadStreamAndSize(fileName: string) {
        const filePath = this.getFilePath(fileName)
        return {
            fileReadStream: createReadStream(filePath, {
                ...commonFileOptions,
            }),
            size: (await stat(filePath)).size,
        }
    }

    async readFileContent(fileName: string) {
        const filePath = this.getFilePath(fileName)
        return await readFile(filePath, {
            ...commonFileOptions,
        })
    }

    async createFile(fileName: string, fileContent: string) {
        if (await this.isFileExists(fileName)) {
            throw new Error("File name is duplicated!")
        }
        await this.writeFile(fileName, fileContent)
    }

    async writeFile(fileName: string, fileContent: string) {
        const filePath = this.getFilePath(fileName)
        writeFile(filePath, fileContent, { ...commonFileOptions })
    }

    private getFilePath(fileName: string) {
        return path.join(FILE_STORAGE_PATH, fileName)
    }

    private async isFileExists(fileName: string) {
        const filePath = this.getFilePath(fileName)

        try {
            await access(filePath, constants.R_OK)
            return true
        } catch (error) {
            return false
        }
    }
}

export const fileStorageService = new FileStorageService()
