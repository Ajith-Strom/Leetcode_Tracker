CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  problem_id INT NOT NULL,
  type ENUM('approach','review') NOT NULL,
  confidence_score TINYINT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
  INDEX idx_notes_problem_type (problem_id, type)
);
