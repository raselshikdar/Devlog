async function translateText(text, targetLang = "en") {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, targetLang }),
  });

  const data = await response.json();
  if (data.translatedText) {
    return data.translatedText;
  }
  return text; // If translation fails, return the original text
}

export default translateText;
