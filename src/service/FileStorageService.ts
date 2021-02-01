import path from "path"
import { createReadStream } from "fs"

import { stat } from "fs/promises"
import { FILE_STORAGE_PATH } from "../config"

class FileStorageService {
    async getFileReadStreamAndSize(fileName: string) {
        const filePath = this.getFilePath(fileName)
        return {
            fileReadStream: createReadStream(filePath, {
                encoding: "utf-8",
            }),
            size: (await stat(filePath)).size,
        }
    }

    private getFilePath(fileName: string) {
        return path.join(FILE_STORAGE_PATH, fileName)
    }
}

export const fileStorageService = new FileStorageService()
