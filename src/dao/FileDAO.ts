import { getConnection, mapToDO } from "../util/db"
import FileDO from "./do/FileDO"

class FileDAO {
    /**
     * insert file data to db
     *
     * @param fileName file name ()
     */
    async newFile(fileName: string) {
        const conn = await getConnection()
        await conn.run(`insert into file (file_name) values (?);`, fileName)
    }

    /**
     * query for file list
     * @param fileIds target file ids, return all files if falsy (null/undefind/empty)
     * @returns target files
     */
    async queryFiles(fileIds?: number[]): Promise<FileDO[]> {
        const conn = await getConnection()
        let fileResults = []
        if (fileIds && fileIds.length > 0) {
            fileResults = await conn.all(
                `select * from file where id in ( ${fileIds
                    .map(() => "?")
                    .join(", ")} );`,
                fileIds
            )
        } else {
            fileResults = await conn.all(`select * from file`)
        }
        return fileResults.map((dataFromDb) =>
            mapToDO(new FileDO(), dataFromDb)
        )
    }

    /**
     * Update file's latest_lock_time and latest_lock_token to lock
     * @param file File id and it's data for updating
     */
    async lockFileById(file: FileDO) {
        const conn = await getConnection()
        conn.run(
            `update file set latest_lock_time = ?, latest_lock_token = ? where id = ?`,
            file.latestLockTime,
            file.latestLockToken,
            file.id
        )
    }
}

export const fileDAO = new FileDAO()
