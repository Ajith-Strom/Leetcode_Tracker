CREATE TABLE problem_patterns (
  problem_id INT NOT NULL,
  pattern_id INT NOT NULL,
  PRIMARY KEY (problem_id, pattern_id),
  FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
  FOREIGN KEY (pattern_id) REFERENCES patterns(id) ON DELETE CASCADE
);
