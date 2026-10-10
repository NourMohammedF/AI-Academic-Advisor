// إعدادات API - يمكن نقلها إلى ملف .env في الإنتاج
export const API_CONFIG = {
  // مفتاح Gemini API الحقيقي
  // تأكد من أن المفتاح صحيح وتم تفعيله في Google AI Studio
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  
  // APIs مجانية (لا تحتاج مفاتيح)
  JOKE_API_URL: process.env.JOKE_API_URL || 'https://official-joke-api.appspot.com/random_joke',
};

// إعدادات الأداء
export const PERFORMANCE_CONFIG = {
  MAX_MESSAGE_LENGTH: 4000, // حماية من تجاوز حدود السياق
  MAX_HISTORY_LINES: 20, // آخر 20 سطر في التاريخ
  REQUEST_TIMEOUT: 30000, // 30 ثانية timeout
};

// أنماط الأوامر
export const COMMAND_PATTERNS = {
  JOKE: /^(نكتة|joke)$/i,
  TIME: /^(الوقت|time)$/i,
  DATE: /^(التاريخ|date)$/i,
  HELP: /^(مساعدة|help)$/i,
  // أنماط جديدة لرفع النتائج
  UPLOAD_GRADES: /^(رفع نتائج|رفع درجات|upload grades|تحليل نتائج|تحليل درجات)$/i,
  PDF_UPLOAD: /^(pdf|ملف pdf|رفع ملف|upload file)$/i,
}; 
