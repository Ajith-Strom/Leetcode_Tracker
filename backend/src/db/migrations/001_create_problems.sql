CREATE TABLE problems (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  leetcode_slug VARCHAR(255) NOT NULL UNIQUE,
  difficulty ENUM('Easy','Medium','Hard') NOT NULL,
  first_solved_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
