import { transliterate } from 'transliteration';

export default async function handler(req, res) {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    // Try MyMemory Translation API first
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|en`
    );
    
    const data = await response.json();
    
    // Validate translation result
    if (data.responseStatus === 200 && data.responseData.translatedText) {
      const translated = data.responseData.translatedText;
      // Check if the result is actually English
      if (/^[a-zA-Z0-9\s.,!?;:'"()\-]+$/.test(translated)) {
        return res.status(200).json({ translatedText: translated });
      }
    }

    // Fallback to transliteration if translation fails
    const transliterated = transliterate(text);
    return res.status(200).json({ translatedText: transliterated });

  } catch (error) {
    // Final fallback to transliteration
    const transliterated = transliterate(text);
    return res.status(200).json({ translatedText: transliterated });
  }
}
