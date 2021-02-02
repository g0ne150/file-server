import { LOCK_DURATION } from "../../config"
import FileDO from "../../dao/do/FileDO"

export default class EditFileDTO extends FileDO {
    constructor(
        fileDO: FileDO,
        currentUserToken: string | null = null,
        now: number = Date.now()
    ) {
        super()
        this.id = fileDO.id
        this.fileName = fileDO.fileName
        this.latestLockTime = fileDO.latestLockTime
        this.latestLockToken = fileDO.latestLockToken
        this.currentUserToken = currentUserToken
        this.now = now
    }

    currentUserToken: string | null

    now: number

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
    get isEditable() {
        return !this.isFileLocked || this.isLockedByCurrentUser
    }

    get isFileLocked() {
        return (
            this.latestLockTime !== null &&
            this.now - this.latestLockTime <= LOCK_DURATION
        )
    }

    get isLockedByCurrentUser() {
        return this.latestLockToken === this.currentUserToken
    }

    /**
     * If file is locked, file will be unlocked after lock duration,
     * milliseconds
     */
    get lockDuration(): number | null {
        if (this.latestLockTime === null || !this.isFileLocked) {
            return null
        }
        return this.latestLockTime + LOCK_DURATION - this.now
    }
}
