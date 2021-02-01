import { fileDAO } from "../dao/FileDAO"
import EditFileDTO from "./dto/EditFileDTO"
import { fileStorageService } from "./FileStorageService"

class FileService {
    /**
     * Add a new file, write file data to local file system and insert data to database
     * @param fileName File name (assume unique)
     */
    async addFile(fileName: string, fileContent: string) {
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
        const now = Date.now()
        if (!EditFileDTO.getIsEditable(fileDO, now, currentUserToken)) {
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
    async tryEditFile(
        fileId: number,
        currentUserToken: string,
        now: number = Date.now()
    ) {
        // Try lock
        const fileDO = await this.tryLockFile(fileId, currentUserToken, now)
        const fileDTO: EditFileDTO = { ...fileDO }

        // Read file content from locl file
        fileDTO.content = await fileStorageService.readFileContent(
            fileDTO.fileName
        )

        // Confirm if the file is editable or not
        fileDTO.isEditable = EditFileDTO.getIsEditable(
            fileDTO,
            now,
            currentUserToken
        )

        // Set lock duration
        fileDTO.lockDuration = EditFileDTO.getLockDuration(fileDTO, now)

        return fileDTO
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
        if (EditFileDTO.getIsFileLocked(fileDO, now)) {
            // try acquire lock failed
            return fileDO
        }
        await fileDAO.updateLockInfo(fileDO.id, now, lockToken)
        fileDO.latestLockTime = now
        fileDO.latestLockToken = lockToken
        return fileDO
    }

    async unlockFile(fileId: number) {
        await fileDAO.updateLockInfo(fileId, null, null)
    }
}

export const fileService = new FileService()
