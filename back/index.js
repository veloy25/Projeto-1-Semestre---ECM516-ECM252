require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_DATABASE || "auventura";

const rootPool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0,
});

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
}).promise();

const ensureDatabase = async () => {
  await rootPool.promise().query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
};

const initializeDatabase = async () => {
  await ensureDatabase();
  await pool.query(`CREATE TABLE IF NOT EXISTS depoimentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nomeCachorro VARCHAR(100) NOT NULL,
    nomeTutor VARCHAR(100) NOT NULL,
    raca VARCHAR(100) NOT NULL,
    comentario TEXT NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log("Database table 'depoimentos' is ready.");
};

app.use(cors());
app.use(express.json());

app.get("/api/depoimentos", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM depoimentos ORDER BY criado_em DESC");
    res.json(rows);
  } catch (error) {
    console.error("GET /api/depoimentos error:", error);
    res.status(500).json({ error: "Não foi possível buscar depoimentos." });
  }
});

app.post("/api/depoimentos", async (req, res) => {
  const { nomeCachorro, nomeTutor, raca, comentario } = req.body;

  if (!nomeCachorro || !nomeTutor || !raca || !comentario) {
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO depoimentos (nomeCachorro, nomeTutor, raca, comentario) VALUES (?, ?, ?, ?)",
      [nomeCachorro, nomeTutor, raca, comentario]
    );

    res.status(201).json({
      id: result.insertId,
      nomeCachorro,
      nomeTutor,
      raca,
      comentario,
      criado_em: new Date().toISOString(),
    });
  } catch (error) {
    console.error("POST /api/depoimentos error:", error);
    res.status(500).json({ error: "Não foi possível salvar o depoimento." });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });
