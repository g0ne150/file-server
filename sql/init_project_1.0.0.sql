DROP TABLE IF EXISTS `file`;
create TABLE IF NOT EXISTS `file` (
    `id` INTEGER NOT NULL PRIMARY KEY,
    `file-name` TEXT NOT NULL,
    `latest-lock-time` INTEGER,
    `lock_token` TEXT
)