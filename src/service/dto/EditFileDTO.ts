import { LOCK_DURATION } from "../../config"
import FileDO from "../../dao/do/FileDO"

export default class EditFileDTO extends FileDO {
    /**
     * File content, could be empty
     */
    content?: string

    /**
     * Is this file editable for current user
     *
     * False: Current file is locked by other user
     *
     * Ture: Current file is locked by current user
     */
    isEditable?: boolean

    /**
     * If file is locked, file will be unlocked after lock duration,
     * milliseconds
     */
    lockDuration?: number | null

    /**
     *  File is uneditable only if the file is locked by another user
     * @param file File data object
     * @param now Current time, milliseconds
     * @param currentUserToken Current user token
     */
    static getIsEditable(
        file: FileDO,
        now: number,
        currentUserToken: string | null
    ) {
        return (
            !EditFileDTO.getIsFileLocked(file, now) ||
            EditFileDTO.getIsLockedBy(file, currentUserToken)
        )
    }

    static getLockDuration(file: FileDO, now: number = Date.now()) {
        if (file.latestLockTime === null || !this.getIsFileLocked(file, now)) {
            return null
        }
        return file.latestLockTime + LOCK_DURATION - now
    }

    static getIsFileLocked(file: FileDO, now: number = Date.now()) {
        return (
            file.latestLockTime !== null &&
            now - file.latestLockTime <= LOCK_DURATION
        )
    }

    static getIsLockedBy(file: EditFileDTO, userToken: string | null) {
        return file.latestLockToken === userToken
    }
}
