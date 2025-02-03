const translator = require("google-translator");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { text, targetLang } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  translator(undefined, targetLang || "en", text, (response) => {
    if (!response || !response.text) {
      return res.status(500).json({ error: "Translation failed" });
    }
    res.status(200).json({ translatedText: response.text });
  });
}
