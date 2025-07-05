// require('dotenv').config(); // Load .env values
// const express = require('express');
// const bodyParser = require('body-parser');
// const runPython = require('./server/run-python');
// const runGo = require('./server/run-go');

// const app = express();
// app.use(bodyParser.json());
// app.use(express.static('.')); // serve index.html

// app.post('/run/python', (req, res) => {
//   runPython(req.body.code, (output) => {
//     res.send({ output });
//   });
// });

// app.post('/run/go', (req, res) => {
//   runGo(req.body.code, (output) => {
//     res.send({ output });
//   });
// });

// app.listen(3000, () => {
//   console.log('🚀 Server listening on http://localhost:3000');
// });

require("dotenv").config(); // Load .env values

const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("@notionhq/client");
const runPython = require("./server/run-python");
const runGo = require("./server/run-go");

const app = express();
app.use(bodyParser.json());
app.use(express.static(".")); // serve index.html

const notion = new Client({ auth: process.env.NOTION_SECRET });

// 🔁 API: Run Python
app.post("/run/python", (req, res) => {
  runPython(req.body.code, (output) => {
    res.send({ output });
  });
});

// 🔁 API: Run Go
app.post("/run/go", (req, res) => {
  runGo(req.body.code, (output) => {
    res.send({ output });
  });
});

// 🧠 API: Fetch Topic Content from Notion
app.get("/topic/:slug", async (req, res) => {
  try {
    const slug = req.params.slug;

    const response = await notion.databases.query({
      database_id: process.env.NOTION_DB_ID,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    });

    const page = response.results[0];

    const content =
      page?.properties?.Content?.rich_text
        ?.map((t) => t.text.content)
        .join("\n") || "No content available.";
    const text =
      page?.properties?.Text?.rich_text
        ?.map((t) => t.text.content)
        .join("\n") || "";
    const topic = page?.properties?.Topic?.title?.[0]?.plain_text || "";

    const pageUrl = page?.properties?.Link?.url || null;
    res.json({ topic, content, text, pageUrl });
  } catch (err) {
    console.error("❌ Notion fetch failed:", err.message);
    res.status(500).send("Failed to fetch topic content");
  }
});

// ✅ Health check for Render deployment
app.get("/healthz", (req, res) => {
  res.send("OK");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
