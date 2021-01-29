DROP TABLE IF EXISTS `file`;
create TABLE IF NOT EXISTS `file` (
    `id` INTEGER NOT NULL PRIMARY KEY,
    `file_name` TEXT NOT NULL,
    `latest_lock_time` INTEGER,
    `latest_lock_token` TEXT
)