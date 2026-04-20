import bdConnection from "../repo/bdConnection";
import mysql from "mysql2";
import express from "express"

const app = express();

class user{

    constructor(dbPool){
        this.pool = dbPool;
        this.initializeTable();
    }

    async initializeTable(){
        await this.pool.query(`CREATE TABLE IF NOT EXISTS usuarios (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(100) NOT NULL,
            email VARCHAR(180) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`);
          console.log("Database table 'users' is ready.");
    }

    async create(nome, email, senha) {
        const normalizedEmail = email.trim().toLowerCase();
        
        const [result] = await this.pool.query(
            "INSERT INTO usuarios (nome, email, password) VALUES (?, ?, ?)", 
            [nome.trim(), normalizedEmail, senha]
        );

        return {
            id: result.insertId,
            nome: nome.trim(),
            email: normalizedEmail
        };
    }

    async findByEmail(email) {
        const normalizedEmail = email.trim().toLowerCase();

        const [rows] = await this.pool.query(
            "SELECT id, nome, email, password FROM users WHERE email = ?", 
            [normalizedEmail]
        );
        return rows.length > 0 ? rows[0] : null;
    }

    async findByIDl(id) {

        const [rows] = await this.pool.query(
            "SELECT nome, email, password FROM users WHERE id = ?", 
            [id]
        );
        return rows.length > 0 ? rows[0] : null;
    }

        
}



module.exports = user;