import { LOCK_DURATION } from "../config"
import FileDO from "../dao/do/FileDO"
import { fileDAO } from "../dao/FileDAO"
import TryEditFileDTO from "./dto/TryEditFileDTO"

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
     * Try lock file (try edit file)
     * @param fileId File ID
     * @param currentUserToken lock token
     */
    async tryLockFile(fileId: number, currentUserToken: string) {
        const fileDO = await this.queryFile(fileId)
        const now = Date.now()
        let fileDTO: TryEditFileDTO = { ...fileDO }

        // TODO 读取本地文件
        fileDTO.content = ""

        // when file is unlocked
        if (!this.isFileLocked(fileDO, now)) {
            const lockedFile = await this.lockFile(
                fileId,
                now,
                currentUserToken
            )
            fileDTO = { ...fileDTO, ...lockedFile }
        }

        if (this.isLockedBy(fileDO, currentUserToken)) {
            fileDTO.isEditable = true
        } else {
            fileDTO.isEditable = false
        }

        if (fileDTO.latestLockTime) {
            fileDTO.lockDuration = now + LOCK_DURATION - fileDTO.latestLockTime
        }

        return fileDTO
    }

    /**
     * Try update file's latest_lock_time and latest_lock_token to lock file
     * @param fileId File ID
     * @param now milliseconds for current time
     * @param lockToken Lock token
     */
    async lockFile(fileId: number, now: number, lockToken: string) {
        await fileDAO.updateLockInfo(fileId, now, lockToken)
        return await this.queryFile(fileId)
    }

    private isLockedBy(file: FileDO, token: string) {
        if (file.latestLockToken === token) {
            return true
        } else {
            return false
        }
    }

    private isFileLocked(file: FileDO, now: number) {
        if (file.latestLockTime && now - file.latestLockTime <= LOCK_DURATION) {
            return true
        } else {
            return false
        }
    }
}

export const fileService = new FileService()
