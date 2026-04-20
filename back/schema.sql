-- AUventura Database Schema Reference
-- This is a reference file showing the complete database structure.
-- Each microservice maintains its own schema file:
-- - services/user-service/schema.sql (users table)
-- - services/depoimentos-service/schema.sql (depoimentos table)

CREATE DATABASE IF NOT EXISTS auventura;
USE auventura;

-- User Service Tables
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(180) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Depoimentos Service Tables
CREATE TABLE IF NOT EXISTS depoimentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nomeCachorro VARCHAR(100) NOT NULL,
  nomeTutor VARCHAR(100) NOT NULL,
  raca VARCHAR(100) NOT NULL,
  comentario TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_criado_em ON depoimentos(criado_em);
