require("dotenv").config();
const mysql = require("mysql2");

const repoParameters = {
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "auventura",
    dbPort: process.env.DB_PORT || 3306,
    port: PORT = process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "super_secret_login_key"
}

class bdConnection {
    constructor() {
        this.config = repoParameters
        this.pool = null

    }

    async init() {

        const rootPool = mysql.createPool({
            host: this.config.host,
            user: this.config.user,
            password: this.config.password,
            port: this.config.dbPort
        }).promise();

        console.log("Verificando se o banco de dados existe...");

        await rootPool.query(`CREATE DATABASE IF NOT EXISTS \`${this.config.database}\``);
        
        this.pool = mysql.createPool({
            host: this.config.host,
            user: this.config.user,
            password: this.config.password,
            database: this.config.database,
            port: this.config.dbPort,
            connectionLimit: 10
        }).promise();

        console.log(`Banco de dados '${this.config.database}' inicializado e pronto para uso!`);
    }
}

module.exports = bdConnection;


