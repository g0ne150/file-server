import { Field } from "../../util/db"

export default class FileDO {
    /**
     * file ID
     */
    @Field("id")
    public id: number = 0

    /**
     * file name
     */
    @Field("file_name")
    public fileName: string = ""

    /**
     * latest lock time, milliseconds
     */
    @Field("latest_lock_time")
    public latestLockTime: number | null = null

    /**
     * latest lock token
     */
    @Field("latest_lock_token")
    public latestLockToken: string | null = null
}
