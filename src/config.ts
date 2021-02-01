import path from "path"

/**
 * Server listen port
 */
export const PORT = 8080

/**
 * SQLite3 database file path
 */
export const SQLITE3_DATABASE_FILE_PATH = path.join(
    __dirname,
    `../sql/file-server.db`
)

/**
 * Upload file storage localtion
 */
export const FILE_STORAGE_PATH = path.join(__dirname, "../files")

/**
 * File lock duration, milliseconds
 */
export const LOCK_DURATION = 60 * 1000
