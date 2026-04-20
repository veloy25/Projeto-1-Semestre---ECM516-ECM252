-- Depoimentos Service Schema
-- Handles testimonials/feedback from pet tutors

CREATE DATABASE IF NOT EXISTS auventura;
USE auventura;

CREATE TABLE IF NOT EXISTS depoimentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nomeCachorro VARCHAR(100) NOT NULL,
  nomeTutor VARCHAR(100) NOT NULL,
  raca VARCHAR(100) NOT NULL,
  comentario TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_criado_em ON depoimentos(criado_em);
