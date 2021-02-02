import { LOCK_DURATION } from "../../config"
import FileDO from "../../dao/do/FileDO"
import { JSONData, JSONField } from "../../util/serializeUtils"
import { copyProperities } from "../../util/typeUtils"

@JSONData()
export default class EditFileDTO extends FileDO {
    constructor(
        fileDO: FileDO,
        currentUserToken: string | null = null,
        now: number = Date.now()
    ) {
        super()
        copyProperities(this, fileDO)
        this.currentUserToken = currentUserToken
        this.now = now
    }

    @JSONField({ ignore: true })
    currentUserToken: string | null

    @JSONField({ ignore: true })
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
    @JSONField()
    get lockDuration(): number | null {
        if (this.latestLockTime === null || !this.isFileLocked) {
            return null
        }
        return this.latestLockTime + LOCK_DURATION - this.now
    }
}
