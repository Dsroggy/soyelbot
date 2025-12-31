import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const DB = "./chats.json";

/* helpers */
const readDB = () =>
  fs.existsSync(DB) ? JSON.parse(fs.readFileSync(DB, "utf8")) : {};
const writeDB = d => fs.writeFileSync(DB, JSON.stringify(d, null, 2));

/* login */
app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.json({ ok: false });

  const db = readDB();
  if (!db[username]) db[username] = [];
  writeDB(db);

  res.json({ ok: true });
});

/* get history */
app.get("/history/:user", (req, res) => {
  const db = readDB();
  res.json(db[req.params.user] || []);
});

/* delete history */
app.delete("/history/:user", (req, res) => {
  const db = readDB();
  db[req.params.user] = [];
  writeDB(db);
  res.json({ ok: true });
});

/* chat */
app.post("/chat", async (req, res) => {
  try {
    const { user, message } = req.body;
    if (!user || !message) return res.json({ reply: "Invalid input" });

    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are DSR AI.
Reply short, smart, friendly.
Language: Hinglish.

User: ${message}`
            }]
          }]
        })
      }
    );

    const j = await r.json();
    const reply =
      j.candidates?.[0]?.content?.parts?.[0]?.text || "Thinking...";

    const db = readDB();
    db[user].push({ user: message, ai: reply });
    writeDB(db);

    res.json({ reply });
  } catch (e) {
    res.json({ reply: "Server error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log("🔥 DSR AI Backend running on port " + PORT)
);
