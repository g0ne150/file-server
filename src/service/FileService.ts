import { LOCK_DURATION } from "../config"
import FileDO from "../dao/do/FileDO"
import { fileDAO } from "../dao/FileDAO"
import EditFileDTO from "./dto/TryEditFileDTO"

class FileService {
    /**
     * Add a new file, write file data to local file system and insert data to database
     * @param fileName File name (assume unique)
     */
    async addFile(fileName: string) {
        // TODO 创建文件到本地

        await fileDAO.addFile(fileName)
    }

    /**
     * Save file content when file is editable
     * @param fileId File ID
     * @param content File content
     * @param currentUserToken current user token
     */
    async saveFile(fileId: number, content: string, currentUserToken: string) {
        const fileDO = await this.queryFile(fileId)
        const now = Date.now()
        if (!this.isFileEditable(fileDO, now, currentUserToken)) {
            // file is locked by another user
            throw new Error(`File is locked for now`)
        }
        // TODO 更新本地文件内容
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
     * @param currentUserToken lock token
     */
    async tryEditFile(fileId: number, currentUserToken: string) {
        let fileDO = await this.queryFile(fileId)
        const now = Date.now()

        // Try lock
        fileDO = await this.tryLockFile(fileDO, now, currentUserToken)
        const fileDTO: EditFileDTO = { ...fileDO }

        // TODO 读取本地文件
        // Read file content from locl file
        fileDTO.content = ""

        // Confirm if the file is editable or not
        fileDTO.isEditable = this.isFileEditable(fileDO, now, currentUserToken)

        // Set lock duration
        fileDTO.lockDuration = this.calculateLockDuration(
            fileDTO.latestLockTime,
            now
        )

        return fileDTO
    }

    /**
     * Try update file's latest_lock_time and latest_lock_token to lock file.
     *
     * Only success when file is unlocked.
     *
     * Reentrancy.
     * @param fileId File ID
     * @param now milliseconds for current time
     * @param lockToken Lock token
     */
    async tryLockFile(fileDO: FileDO, now: number, lockToken: string) {
        if (this.isFileLocked(fileDO, now)) {
            return fileDO
        }
        await fileDAO.updateLockInfo(fileDO.id, now, lockToken)
        fileDO.latestLockTime = now
        fileDO.latestLockToken = lockToken
        return fileDO
    }

    /**
     *  File is uneditable only if the file is locked by another user
     * @param file File data object
     * @param now Current time, milliseconds
     * @param currentUserToken Current user token
     */
    private isFileEditable(
        file: FileDO,
        now: number,
        currentUserToken: string
    ) {
        if (
            this.isFileLocked(file, now) &&
            !this.isLockedBy(file, currentUserToken)
        ) {
            return false
        } else {
            return true
        }
    }

    // Calculate for lock duration
    private calculateLockDuration(latestLockTime: number | null, now: number) {
        if (latestLockTime === null) {
            return
        }
        return now + LOCK_DURATION - latestLockTime
    }

    private isLockedBy(file: FileDO, token: string | null) {
        if (file.latestLockToken === token) {
            return true
        } else {
            return false
        }
    }

    private isFileLocked(fileDO: FileDO, now: number) {
        if (
            fileDO.latestLockTime &&
            now - fileDO.latestLockTime <= LOCK_DURATION
        ) {
            return true
        } else {
            return false
        }
    }
}

export const fileService = new FileService()
