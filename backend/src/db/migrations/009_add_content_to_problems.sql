ALTER TABLE problems
  ADD COLUMN content MEDIUMTEXT NULL AFTER first_solved_date,
  ADD COLUMN is_paid_only TINYINT(1) NOT NULL DEFAULT 0 AFTER content;
