export default async function handler(req, res) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    // Call MyMemory Translation API
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|en`
    );

    const data = await response.json();

    console.log("Translation response:", data); // Debug log for MyMemory API response

    // Check for successful translation
    if (data.responseStatus === 200 && data.responseData.translatedText) {
      return res.status(200).json({ translatedText: data.responseData.translatedText });
    }

    // Fallback: Strip diacritics (for languages like Bengali, Hindi, etc.)
    const transliterated = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return res.status(200).json({ translatedText: transliterated });

  } catch (error) {
    console.error("Translation error:", error);
    return res.status(500).json({ error: "Translation failed" });
  }
}
