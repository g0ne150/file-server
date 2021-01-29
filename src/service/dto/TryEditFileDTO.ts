import FileDO from "../../dao/do/FileDO"

export default class TryEditFileDTO extends FileDO {
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
    lockDuration?: number
}
