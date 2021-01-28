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

export const Field = function (field: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {}
}
