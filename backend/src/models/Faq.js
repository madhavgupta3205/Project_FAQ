import mongoose from 'mongoose';

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  },
  translations: {
    hi: {
      question: String,
      answer: String
    },
    bn: {
      question: String,
      answer: String
    }
  }
}, { 
  timestamps: true 
});

faqSchema.methods.getTranslatedContent = function(lang = 'en') {
  if (lang === 'en') {
    return {
      id: this._id,
      question: this.question,
      answer: this.answer
    };
  }
  
  return {
    id: this._id,
    question: this.translations[lang]?.question || this.question,
    answer: this.translations[lang]?.answer || this.answer
  };
};

export default mongoose.model('FAQ', faqSchema);