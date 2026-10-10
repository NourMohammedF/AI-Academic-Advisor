// اختبار مفتاح Gemini API
const { GoogleGenerativeAI } = require('@google/generative-ai');

const API_KEY = 'AIzaSyBGSCXOaOiwXJfpEY08a0eNPb2bbJ1vbPc';

async function testGeminiAPI() {
  try {
    console.log('🔍 اختبار مفتاح Gemini API...');
    
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "مرحبا، كيف حالك؟";
    console.log('📤 إرسال رسالة اختبار:', prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    console.log('✅ نجح الاتصال!');
    console.log('📥 الرد:', response.text());
    
  } catch (error) {
    console.error('❌ فشل الاتصال:', error.message);
    console.error('🔍 تفاصيل الخطأ:', error);
  }
}

testGeminiAPI(); 