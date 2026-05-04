import "dotenv/config";
import mysql from "mysql2";


const repoParameters = {
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE,
    dbPort: process.env.DB_PORT || 3306,
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "super_secret_login_key"
}

class bdConnection {
    constructor(database) {
        this.config = repoParameters
        this.pool = null
    }
    
    async init() {
    console.log(`A ligar ao banco de dados na nuvem '${this.config.database}'...`);

       this.pool = mysql.createPool({
            host: this.config.host,
            user: this.config.user,
            password: this.config.password,
            database: this.config.database,
            port: this.config.dbPort,
            connectionLimit: 10,
            ssl: { rejectUnauthorized: false } 
        }).promise();

        console.log(`Ligação com '${this.config.database}' estabelecida com sucesso!`);

        return this.pool
    }
}

export default bdConnection


