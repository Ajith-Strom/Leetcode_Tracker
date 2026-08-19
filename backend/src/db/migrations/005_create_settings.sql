CREATE TABLE settings (
  `key` VARCHAR(64) PRIMARY KEY,
  `value` VARCHAR(255) NOT NULL
);

INSERT INTO settings (`key`, `value`) VALUES ('revision_interval_days', '14');
