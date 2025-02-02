import FAQ from '../models/Faq.js';
import { redisClient } from '../config/redis.js';
import { translateText } from '../utils/translator.js';

export const createFaq = async (req, res) => {
  try {
    const { question, answer } = req.body;

    // Translate plain text versions
    const translations = {};
    const supportedLanguages = ['hi', 'bn'];

    for (const lang of supportedLanguages) {
      try {
        const [translatedQuestion, translatedAnswer] = await Promise.all([
          translateText(question, lang),
          translateText(answer, lang)
        ]);

        translations[lang] = {
          question: translatedQuestion,
          answer: translatedAnswer
        };
      } catch (err) {
        console.error(`Translation failed for language ${lang}:`, err);
      }
    }

    const faq = new FAQ({
      question,
      answer,
      translations
    });

    await faq.save();
    
    // Clear cache
    const keys = await redisClient.keys('faqs:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }

    res.status(201).json({
      success: true,
      data: faq
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({
      success: false,
      error: 'Error creating FAQ'
    });
  }
};

export const getFaqs = async (req, res) => {
  try {
    const lang = req.query.lang || 'en';
    const cacheKey = `faqs:${lang}`;

    // Try to get from cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      return res.json({
        success: true,
        data: JSON.parse(cachedData),
        source: 'cache'
      });
    }

    // Get from database
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    const translatedFaqs = faqs.map(faq => faq.getTranslatedContent(lang));

    // Set cache with 1-hour expiration
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(translatedFaqs));

    res.json({
      success: true,
      data: translatedFaqs,
      source: 'database'
    });
  } catch (error) {
    console.error('Error getting FAQs:', error);
    res.status(500).json({
      success: false,
      error: 'Error fetching FAQs',
      details: error.message
    });
  }
};


export const deleteFaq = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedFaq = await FAQ.findByIdAndDelete(id);

    if (!deletedFaq) {
      return res.status(404).json({
        success: false,
        error: 'FAQ not found'
      });
    }

    // Clear cache for all languages
    const keys = await redisClient.keys('faqs:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }

    res.json({
      success: true,
      message: 'FAQ deleted successfully',
      data: deletedFaq
    });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({
      success: false,
      error: 'Error deleting FAQ',
      details: error.message
    });
  }
};



export const updateFaq = async (req, res) => {
  try {
    const { id } = req.params;
    const { question, answer, lang = 'en' } = req.body; // Assume 'en' if no language is specified

    // Fetch the existing FAQ
    const existingFaq = await FAQ.findById(id);
    if (!existingFaq) {
      return res.status(404).json({
        success: false,
        error: 'FAQ not found'
      });
    }

    // Prepare translations object
    const translations = existingFaq.translations || {};

    if (lang === 'en') {
      // Update English content and translate to other languages
      for (const lang of ['hi', 'bn']) {
        try {
          const [translatedQuestion, translatedAnswer] = await Promise.all([
            translateText(question, lang),
            translateText(answer, lang)
          ]);

          translations[lang] = {
            question: translatedQuestion,
            answer: translatedAnswer
          };
        } catch (err) {
          console.error(`Translation failed for language ${lang}:`, err);
        }
      }
    } else {
      // Update only the specific language translation
      translations[lang] = {
        question,
        answer
      };
    }

    // Update the FAQ
    const updatedFaq = await FAQ.findByIdAndUpdate(
      id,
      {
        question: lang === 'en' ? question : existingFaq.question,
        answer: lang === 'en' ? answer : existingFaq.answer,
        translations
      },
      { new: true }
    );

    // Clear cache
    const keys = await redisClient.keys('faqs:*');
    if (keys.length > 0) {
      await redisClient.del(keys);
    }

    res.json({
      success: true,
      data: updatedFaq
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({
      success: false,
      error: 'Error updating FAQ',
      details: error.message
    });
  }
};