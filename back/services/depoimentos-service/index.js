require("dotenv").config();
const express = require("express");
const { pool, initializeDatabase } = require("../../shared/database");
const messageBus = require("../../shared/messagebus");

const app = express();
const PORT = process.env.TESTIMONIALS_SERVICE_PORT || 3002;

app.use(express.json());

// Initialize database
initializeDatabase().catch((error) => {
  console.error("Failed to initialize database:", error);
  process.exit(1);
});

// Subscribe to user creation events
messageBus.subscribe("user:created", "testimonials-service", (event) => {
  console.log("[Testimonials Service] New user registered:", event.data);
  // You can add additional processing here if needed
});

// Routes

/**
 * GET / - Get all testimonials
 */
app.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM depoimentos ORDER BY criado_em DESC");
    res.json(rows);
  } catch (error) {
    console.error("GET / error:", error);
    res.status(500).json({ error: "Não foi possível buscar depoimentos." });
  }
});

/**
 * POST / - Create a new testimonial
 */
app.post("/", async (req, res) => {
  console.log("POST / received:", req.body);
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

    const testimonial = {
      id: result.insertId,
      nomeCachorro,
      nomeTutor,
      raca,
      comentario,
      criado_em: new Date().toISOString(),
    };

    // Publish testimonial created event
    messageBus.publish("testimonial:created", testimonial, "testimonials-service");

    res.status(201).json(testimonial);
  } catch (error) {
    console.error("POST / error:", error);
    res.status(500).json({ error: "Não foi possível salvar o depoimento." });
  }
});

/**
 * GET /:id - Get a specific testimonial
 */
app.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query("SELECT * FROM depoimentos WHERE id = ?", [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Depoimento não encontrado." });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("GET /:id error:", error);
    res.status(500).json({ error: "Não foi possível buscar o depoimento." });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.listen(PORT, () => {
  console.log(`[Testimonials Service] listening on port ${PORT}`);
});

module.exports = app;
