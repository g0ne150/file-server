import { fileDAO } from "../dao/FileDAO"
import EditFileDTO from "./dto/EditFileDTO"
import { fileStorageService } from "./FileStorageService"

class FileService {
    /**
     * Add a new file, write file data to local file system and insert data to database
     * @param fileName File name (assume unique)
     */
    async addFile(fileName: string, fileContent: string) {
        if (!fileName) {
            throw new Error("File name cannot be falsy value")
        }
        await fileStorageService.createFile(fileName, fileContent)

        await fileDAO.addFile(fileName)
    }

    /**
     * Save file content when file is editable
     * @param fileId File ID
     * @param content File content
     * @param currentUserToken current user token
     */
    async updateFile(
        fileId: number,
        currentUserToken: string | null,
        fileContent: string
    ) {
        const fileDO = await this.queryFile(fileId)
        const file = new EditFileDTO(fileDO, currentUserToken)
        if (!file.isEditable) {
            // file is locked by another user
            throw new Error(`File is locked for now`)
        }

        await fileStorageService.writeFile(fileDO.fileName, fileContent)

        // Unlock file after update file
        await this.unlockFile(fileId)
    }

    /**
     * Query for all files data in database
     * @returns FileDO list
     */
    async queryAllFiles() {
        return await fileDAO.queryFiles()
    }

    /**
     * Query file by ID
     * @param fileId File ID
     * @returns see {@link FileDO}
     */
    async queryFile(fileId: number) {
        const [file] = await fileDAO.queryFiles([fileId])
        return file
    }

    /**
     * try edit file
     * @param fileId File ID
     * @param currentUserToken Lock token
     * @param now Current time, milliseconds
     */
    async tryAcquireFileLock(
        fileId: number,
        currentUserToken: string,
        now: number = Date.now()
    ) {
        // Try lock
        const { fileDO, isAcquired } = await this.tryLockFile(
            fileId,
            currentUserToken,
            now
        )
        const fileDTO = new EditFileDTO(fileDO, currentUserToken, now)

        // Read file content from locl file
        fileDTO.content = await fileStorageService.readFileContent(
            fileDTO.fileName
        )

        return { fileDTO, isAcquired }
    }

    /**
     * Try update file's latest_lock_time and latest_lock_token to lock file.
     *
     * Only lock successfully when file is unlocked.
     *
     * Reentrant.
     * @param fileId File ID
     * @param lockToken Lock token
     * @param now milliseconds for current time
     */
    async tryLockFile(
        fileId: number,
        lockToken: string,
        now: number = Date.now()
    ) {
        let fileDO = await this.queryFile(fileId)
        let file = new EditFileDTO(fileDO, lockToken, now)
        if (!file.isEditable) {
            // locked by another user, so try acquire lock fail
            return { fileDO, isAcquired: false }
        }
        await fileDAO.updateLockInfo(fileDO.id, now, lockToken)
        fileDO.latestLockTime = now
        fileDO.latestLockToken = lockToken
        return { fileDO, isAcquired: true }
    }

    async unlockFile(fileId: number) {
        await fileDAO.updateLockInfo(fileId, null, null)
    }
}

export const fileService = new FileService()
