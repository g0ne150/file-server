import { getConnection } from "../util/db"

export class FileDO {
    /**
     * FileDO construtor
     *
     * @param id file ID
     * @param fileName file name
     * @param latestLockTime latest lock time, milliseconds
     * @param latestLockToken latest lock token
     */
    constructor(
        public id: number,
        public fileName: string,
        public latestLockTime?: number,
        public latestLockToken?: string
    ) {}
}

class FileDAO {
    /**
     * insert file data to db
     *
     * @param fileName file name ()
     */
    async newFile(fileName: string) {
        const conn = await getConnection()
        await conn.run(`insert into file (file_name) values (${fileName});`)
    }

    /**
     * query for file list
     * @param fileIds target file ids, return all files if falsy (null/undefind/empty)
     * @returns target files
     */
    async queryFiles(fileIds?: number[]): Promise<FileDO[]> {
        const conn = await getConnection()
        const fileResults = await conn.all(
            `select * from file ${
                fileIds ? `where id in ( ${fileIds.join(", ")} )` : ``
            };`
        )
        return fileResults.map(this.mapToDO)
    }

    /**
     * update a file data by it's id
     * @param file file id and it's data for updating
     */
    async updateFileById(file: FileDO) {
        const conn = await getConnection()
        // conn.run(`update file set `)
    }

    /**
     * map data to FileDO
     *
     */
    //TODO 改成装饰器实现
    private mapToDO(files: any): FileDO {
        return new FileDO(123, "123.tet")
    }
}

export const fileDAO = new FileDAO()
