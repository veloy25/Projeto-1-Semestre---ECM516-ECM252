import mysql from "mysql2";
import express from "express"


const app = express();

class reviews{
    constructor (dbPool){
        this.pool = dbPool
        this.initializeTable()
    }

    async initializeTable(){
        await this.pool.query(`CREATE TABLE IF NOT EXISTS depoimentos (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nomeCachorro VARCHAR(100) NOT NULL,
            nomeTutor VARCHAR(100) NOT NULL,
            raca VARCHAR(100) NOT NULL,
            comentario TEXT NOT NULL,
            criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )`);
        console.log("Database table 'depoimentos' is ready.")
    }

    async getReview(){
        const [rows] = await this.pool.query("SELECT * FROM depoimentos ORDER by criado_em")
        return rows
    }

    async createReview(nomeCachorro, nomeTutor, raca, comentario){
        if (!nomeCachorro || !nomeTutor || !raca){
            return [false, {error: "É necessário preencher todos os campos"}]
        }

        const [result] = await this.pool.query("INSERT INTO depoimentos (nomeCachorro, nomeTutor, raca, comentario) VALUES (?, ?, ?, ?)",
        [nomeCachorro, nomeTutor, raca, comentario]);

        return [true, {
            nomeCachorro: nomeCachorro,
            nomeTutor: nomeTutor,
            raca: raca,
            comentario: comentario,
            criado_em: new Date().toISOString(),
        }]
    }

}

export default reviews;
