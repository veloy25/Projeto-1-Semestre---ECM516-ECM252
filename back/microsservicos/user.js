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

    async createUser(nome, email, senha) {
        const normalizedEmail = email.trim().toLowerCase();
        
        if (!email || !senha || !nome){
            return [null, {error: "É necesário preencher todos os campos."}]
        }

        const [existingUsers] = await this.pool.query("SELECT id FROM users WHERE email = ?", [normalizedEmail]);
        
        if (existingUsers.length > 0) {
            return [null, {error: "Este e-mail já está em uso."}]
        }

        const [result] = await this.pool.query(
            "INSERT INTO usuarios (nome, email, password) VALUES (?, ?, ?)", 
            [nome.trim(), normalizedEmail, senha]
        );
        
        return [true, {
            id: result.insertId,
            nome: nome.trim(),
            email: normalizedEmail
        }];
        
    }

    async findByEmail(email, senha) { 
        if (!email || !senha || typeof email !== 'string') {
            return [null, {error: "os dados não são válidos"}]; 
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (!normalizedEmail.includes("@")) {
            return [null, {error: "O email deve incluir @"}];
        }

        const [rows] = await this.pool.query(
            "SELECT id, nome, email, password FROM users WHERE email = ? AND password = ?", 
            [normalizedEmail, senha]
        );

        return rows.length > 0 ? rows[0] : null;
    }

    async findById(id) {

        const [rows] = await this.pool.query(
            "SELECT nome, email, password FROM users WHERE id = ?", 
            [id]
        );

        if (rows.length === 0){
            return [null, {error: "Usuário não encontrado."}]
        }
        return rows.length > 0 ? rows[0] : null;
    }

        
}

export default user;