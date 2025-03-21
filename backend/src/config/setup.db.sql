CREATE DATABASE IF NOT EXISTS cnpm_db;
USE cnpm_db;

CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 

-- CREATE TABLE IF NOT EXISTS topics (
--     topic_id INT AUTO_INCREMENT PRIMARY KEY,
--     user_id INT NOT NULL,
--     topic_name VARCHAR(255) NOT NULL UNIQUE,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );

CREATE TABLE IF NOT EXISTS exercises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    topic_id INT NOT NULL,
    type ENUM('flashcard', 'dienkhuyet', 'nghenoi', 'viet') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(topic_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS flashcard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_id INT NOT NULL,
    image_url VARCHAR(255),
    eng_word VARCHAR(255) NOT NULL,
    vie_word VARCHAR(255) NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS dienkhuyet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_id INT,
    sentence TEXT NOT NULL,
    correct_answer VARCHAR(255) NOT NULL,
    answer1 VARCHAR(255) NOT NULL,
    answer2 VARCHAR(255) NOT NULL,
    answer3 VARCHAR(255) NOT NULL, 
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS nghenoi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_id INT,
    question_text TEXT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS viet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_id INT,
    eng_word TEXT NOT NULL,
    vie_word TEXT NOT NULL,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS practice_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    exercise_id INT NOT NULL,
    user_id INT NOT NULL,
    score INT,
    total_questions INT NOT NULL,
    datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
