import translator from 'google-translator';

// Translate the title to English if it's not already in English
export const translateText = (title) => {
  return new Promise((resolve, reject) => {
    translator('auto', 'en', title, (response) => {
      if (response.isCorrect) {
        resolve(response.text); // Return the translated text (English)
      } else {
        reject('Translation failed');
      }
    });
  });
};
