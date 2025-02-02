import translate from "@iamtraction/google-translate";

export const translateText = async (text, targetLang) => {
  try {
    if (targetLang === "en") {
      return text;
    }

    // Add delay to avoid rate limiting
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const result = await translate(text, { to: targetLang });
    return result.text;
  } catch (error) {
    console.error(`Translation error for ${targetLang}:`, error);
    return text; // Fallback to original text
  }
};
