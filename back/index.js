require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_HOST = process.env.DB_HOST || "127.0.0.1";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_DATABASE || "auventura";
const DB_PORT = process.env.DB_PORT || 3306;
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_login_key";
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "2h";

const rootPool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 2,
  queueLimit: 0,
});

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
}).promise();

const ensureDatabase = async () => {
  await rootPool.promise().query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
};

const initializeDatabase = async () => {
  console.log("Initializing database...");
  await ensureDatabase();
  console.log("Database ensured.");

  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(180) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`);
  console.log("Database table 'users' is ready.");

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

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token de autenticaçao ausente." });
  }

  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token invalido ou expirado." });
  }
};

app.use(cors());
app.use(express.json());

app.post("/api/signup", async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const [existingUsers] = await pool.query("SELECT id FROM users WHERE email = ?", [normalizedEmail]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "Este e-mail já está em uso." });
    }

    const passwordHash = bcrypt.hashSync(senha, 10);
    const [result] = await pool.query(
      "INSERT INTO users (nome, email, password_hash) VALUES (?, ?, ?)",
      [nome.trim(), normalizedEmail, passwordHash]
    );

    res.status(201).json({ id: result.insertId, nome: nome.trim(), email: normalizedEmail });
  } catch (error) {
    console.error("POST /api/signup error:", error);
    res.status(500).json({ error: "Não foi possível criar a conta." });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "E-mail e senha são obrigatórios." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const [rows] = await pool.query("SELECT id, nome, email, password_hash FROM users WHERE email = ?", [normalizedEmail]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    const user = rows[0];
    const isPasswordValid = bcrypt.compareSync(senha, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "E-mail ou senha inválidos." });
    }

    const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRATION,
    });

    res.json({ token, user: { id: user.id, nome: user.nome, email: user.email } });
  } catch (error) {
    console.error("POST /api/login error:", error);
    res.status(500).json({ error: "Não foi possível fazer login." });
  }
});

app.get("/api/me", authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, nome, email FROM users WHERE id = ?", [req.user.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }
    res.json({ user: rows[0] });
  } catch (error) {
    console.error("GET /api/me error:", error);
    res.status(500).json({ error: "Não foi possível buscar o perfil." });
  }
});

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
  console.log("POST /api/depoimentos received:", req.body);
  const { nomeCachorro, nomeTutor, raca, comentario } = req.body;

  if (!nomeCachorro || !nomeTutor || !raca || !comentario) {
    console.log("Missing fields");
    return res.status(400).json({ error: "Todos os campos são obrigatórios." });
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO depoimentos (nomeCachorro, nomeTutor, raca, comentario) VALUES (?, ?, ?, ?)",
      [nomeCachorro, nomeTutor, raca, comentario]
    );
    console.log("Insert successful, ID:", result.insertId);

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
