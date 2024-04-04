CREATE TABLE IF NOT EXISTS tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    token_data json
);