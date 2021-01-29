import sqlite3 from "sqlite3"
import { open } from "sqlite"
import { sqliteDataBaseFilePath } from "../config"
import { Awaited } from "./typeUtils"

export type Connection = Awaited<ReturnType<typeof open>> | null

let conn: Connection = null

/**
 * Get singleton db connection
 */
export const getConnection = async () => {
    if (conn === null) {
        conn = await open({
            filename: sqliteDataBaseFilePath,
            driver: sqlite3.cached.Database,
        })
    }
    return conn
}

// DB field metadata key
const DB_FIELD_METADATA_KEY = Symbol("db-field-key")

/**
 * Annotation which indictes the database table field keys on Data Objects properties
 * @param dbField Field key in database
 */
export const Field = function (dbField: string) {
    return Reflect.metadata(DB_FIELD_METADATA_KEY, dbField)
}

/**
 * Convert data to Data Object
 * @param targetDO target Data Object
 * @param dataFromDb Data object from database connection
 */
export function mapToDO<T>(targetDO: T, dataFromDb: any): T {
    for (let k in targetDO) {
        const dbPropertyKey = Reflect.getMetadata(
            DB_FIELD_METADATA_KEY,
            targetDO,
            k
        )
        targetDO[k] = dataFromDb[dbPropertyKey]
    }
    return targetDO
}
