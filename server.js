import dotenv from 'dotenv';
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const PROJECT_ID = process.env.SANITY_PROJECT_ID;
const DATASET = process.env.SANITY_DATASET;
const TOKEN = process.env.SANITY_TOKEN;

app.get('/api/posts', async (req, res) => {
  const query = encodeURIComponent(`*[_type == "post"]{title, slug, mainImage{asset->{url}}, bodyPreview, body, pdfFile, date}`);
  const url = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=${query}`;

  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const data = await response.json();
    res.json(data.result);
  } catch (err) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur API démarré sur http://localhost:${PORT}`);
});
