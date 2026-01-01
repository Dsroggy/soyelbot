import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const CHAT_FILE = "./chats.json";

/* ensure chats.json exists */
if (!fs.existsSync(CHAT_FILE)) {
  fs.writeFileSync(CHAT_FILE, JSON.stringify({}));
}

/* helpers */
function readChats() {
  return JSON.parse(fs.readFileSync(CHAT_FILE, "utf8"));
}
function saveChats(data) {
  fs.writeFileSync(CHAT_FILE, JSON.stringify(data, null, 2));
}

/* health check */
app.get("/", (req, res) => {
  res.send("DSR AI Backend is running (HF)");
});

/* login */
app.post("/login", (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });
  res.json({ success: true });
});

/* history */
app.get("/history/:user", (req, res) => {
  const chats = readChats();
  res.json(chats[req.params.user] || []);
});

/* chat (Hugging Face) */
app.post("/chat", async (req, res) => {
  try {
    const { user, message } = req.body;
    if (!user || !message) {
      return res.json({ reply: "Invalid input" });
    }

    const apiRes = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ inputs: message })
      }
    );

    const data = await apiRes.json();

    const reply =
      data?.[0]?.generated_text ||
      "AI did not respond. Please try again.";

    const chats = readChats();
    if (!chats[user]) chats[user] = [];
    chats[user].push({ user: message, ai: reply });
    saveChats(chats);

    res.json({ reply });

  } catch (err) {
    console.error("HF ERROR:", err);
    res.json({
      reply: "AI service unavailable. Try again later."
    });
  }
});

/* start */
app.listen(PORT, () => {
  console.log(`🔥 DSR AI Backend running on port ${PORT}`);
});
