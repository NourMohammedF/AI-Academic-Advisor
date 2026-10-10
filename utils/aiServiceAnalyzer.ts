// محلل ذكي للخدمات الجامعية باستخدام الذكاء الاصطناعي

import { universityServices, UniversityService } from '../data/universityServices';
import { getAIConfig, getConfidenceThreshold, shouldShowConfidence, shouldShowReason } from '../config/aiConfig';

export interface ServiceAnalysis {
  service: UniversityService | null;
  confidence: number;
  reason: string;
  keywords: string[];
  suggestedResponse: string;
}

// كلمات مفتاحية لكل خدمة
const serviceKeywords = {
  exam: [
    'امتحان', 'امتحانات', 'جدول', 'جداول', 'exam', 'schedule', 'test', 'tests',
    'موعد', 'مواعيد', 'فصل', 'ترم', 'semester', 'final', 'midterm',
    'تحميل', 'download', 'pdf', 'جدول امتحانات', 'exam schedule'
  ],
  financial: [
    'مالية', 'مالي', 'مديونية', 'رسوم', 'financial', 'money', 'fees', 'payment',
    'استعلام', 'inquiry', 'debt', 'dues', 'دفع', 'pay', 'account',
    'الرسوم الدراسية', 'financial inquiry', 'account balance'
  ],
  email: [
    'بريد', 'ايميل', 'email', 'جامعي', 'university', 'mail', 'gmail',
    'الرقم القومي', 'national id', 'كلمة سر', 'password', 'login',
    'البريد الجامعي', 'university email', 'student email'
  ]
};

// تحليل ذكي لرسالة المستخدم
export const analyzeUserRequest = (message: string): ServiceAnalysis => {
  const config = getAIConfig();
  
  // إذا كان التحليل الذكي معطل، استخدم الرد الافتراضي
  if (!config.smartAnalysis.enabled) {
    return {
      service: null,
      confidence: 0,
      reason: 'التحليل الذكي معطل',
      keywords: [],
      suggestedResponse: generateDefaultResponse()
    };
  }
  
  const lowerMessage = message.toLowerCase();
  const arabicMessage = message;
  
  // حساب النقاط لكل خدمة
  const scores = {
    exam: 0,
    financial: 0,
    email: 0
  };
  
  // تحليل الكلمات المفتاحية (إذا كان مفعلاً)
  if (config.smartAnalysis.enableKeywordAnalysis) {
    Object.entries(serviceKeywords).forEach(([service, keywords]) => {
      keywords.forEach(keyword => {
        if (lowerMessage.includes(keyword.toLowerCase()) || arabicMessage.includes(keyword)) {
          scores[service as keyof typeof scores] += 1;
        }
      });
    });
  }
  
  // تحليل السياق (إذا كان مفعلاً)
  if (config.smartAnalysis.enableContextAnalysis) {
    const contextAnalysis = analyzeContext(message);
    Object.entries(contextAnalysis).forEach(([service, score]) => {
      scores[service as keyof typeof scores] += score;
    });
  }
  
  // تحديد الخدمة الأكثر احتمالاً
  const maxScore = Math.max(...Object.values(scores));
  const bestService = Object.keys(scores).find(key => scores[key as keyof typeof scores] === maxScore);
  
  if (!bestService || maxScore === 0) {
    return {
      service: null,
      confidence: 0,
      reason: 'لم يتم العثور على خدمة مناسبة',
      keywords: [],
      suggestedResponse: generateDefaultResponse()
    };
  }
  
  const service = universityServices.find(s => s.category === bestService);
  const confidence = Math.min(maxScore / 3, 1); // تطبيع النتيجة
  
  return {
    service: service || null,
    confidence,
    reason: generateReason(bestService, scores),
    keywords: serviceKeywords[bestService as keyof typeof serviceKeywords] || [],
    suggestedResponse: generateServiceResponse(service, bestService, confidence)
  };
};

// تحليل السياق
const analyzeContext = (message: string): Record<string, number> => {
  const context = {
    exam: 0,
    financial: 0,
    email: 0
  };
  
  // تحليل السياق للامتحانات
  if (message.includes('متى') || message.includes('موعد') || message.includes('when')) {
    context.exam += 0.5;
  }
  
  if (message.includes('تحميل') || message.includes('download') || message.includes('جداول')) {
    context.exam += 0.5;
  }
  
  // تحليل السياق للمالية
  if (message.includes('كم') || message.includes('how much') || message.includes('رسوم')) {
    context.financial += 0.5;
  }
  
  if (message.includes('دفع') || message.includes('pay') || message.includes('حساب')) {
    context.financial += 0.5;
  }
  
  // تحليل السياق للبريد
  if (message.includes('الرقم القومي') || message.includes('national id')) {
    context.email += 1;
  }
  
  if (message.includes('كلمة سر') || message.includes('password')) {
    context.email += 0.5;
  }
  
  return context;
};

// توليد سبب التحليل
const generateReason = (service: string, scores: Record<string, number>): string => {
  const reasons = {
    exam: 'تم العثور على كلمات متعلقة بالامتحانات والجداول',
    financial: 'تم العثور على كلمات متعلقة بالشؤون المالية والمديونية',
    email: 'تم العثور على كلمات متعلقة بالبريد الإلكتروني الجامعي'
  };
  
  return reasons[service as keyof typeof reasons] || 'تحليل ذكي للرسالة';
};

// توليد رد الخدمة
const generateServiceResponse = (service: UniversityService | undefined, serviceType: string, confidence: number): string => {
  if (!service) {
    return generateDefaultResponse();
  }
  
  const config = getAIConfig();
  let response = '';
  
  const responses = {
    exam: `📅 **جداول الامتحانات - جامعة الإسكندرية**

🔗 **الرابط المباشر:**
${service.url}

📝 **خطوات الاستخدام:**
${service.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

💡 **ملاحظات مهمة:**
• تأكد من اختيار الفصل الدراسي الصحيح
• احفظ الجدول على جهازك للرجوع إليه
• تحقق من مواعيد الامتحانات مبكراً`,

    financial: `💰 **الاستعلام عن المديونية - جامعة الإسكندرية**

🔗 **الرابط المباشر:**
${service.url}

📝 **خطوات الاستخدام:**
${service.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

💡 **معلومات مهمة:**
• تحتاج بيانات تسجيل الدخول الخاصة بك
• يمكنك طباعة تقرير المديونية
• تحقق من مواعيد دفع الرسوم`,

    email: `📧 **البريد الإلكتروني الجامعي - جامعة الإسكندرية**

🔗 **الرابط المباشر:**
${service.url}

📝 **خطوات الاستخدام:**
${service.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

⚠️ **تنبيهات مهمة:**
• استخدم الرقم القومي في كلا الحقلين
• تأكد من صحة الرقم القومي
• احفظ معلومات البريد الإلكتروني`
  };
  
  response = responses[serviceType as keyof typeof responses] || generateDefaultResponse();
  
  // إضافة معلومات الثقة (إذا كان مفعلاً)
  if (config.responses.enableConfidenceDisplay && confidence > 0) {
    const confidencePercentage = Math.round(confidence * 100);
    response += `\n\n📊 **مستوى الثقة:** ${confidencePercentage}%`;
  }
  
  // إضافة سبب التحليل (إذا كان مفعلاً)
  if (config.responses.enableReasonDisplay) {
    const reason = generateReason(serviceType, {});
    response += `\n\n🔍 **سبب التحليل:** ${reason}`;
  }
  
  // إضافة تحذير إذا كانت الثقة منخفضة
  if (confidence < getConfidenceThreshold() && confidence > 0) {
    response += `\n\n⚠️ **تحذير:** مستوى الثقة منخفض. تأكد من أن هذا ما كنت تبحث عنه.`;
  }
  
  return response;
};

// رد افتراضي
const generateDefaultResponse = (): string => {
  return `🔍 **لم أفهم طلبك بوضوح**

📋 **الخدمات المتاحة:**

📅 **جداول الامتحانات**
• اكتب: "أريد جدول الامتحانات" أو "متى الامتحانات"

💰 **الاستعلام المالي**
• اكتب: "أريد معرفة مديونيتي" أو "كم الرسوم"

📧 **البريد الجامعي**
• اكتب: "أريد البريد الجامعي" أو "كيف أحصل على الإيميل"

💡 **أمثلة:**
• "متى امتحانات الفصل الثاني؟"
• "أريد معرفة رسومي الدراسية"
• "كيف أحصل على البريد الجامعي؟"`;
};

// تحليل متقدم للرسائل المعقدة
export const advancedAnalysis = (message: string): ServiceAnalysis[] => {
  const analysis = analyzeUserRequest(message);
  
  if (analysis.confidence > 0.7) {
    return [analysis];
  }
  
  // إذا كانت الثقة منخفضة، اقترح عدة خدمات
  const suggestions = universityServices.map(service => ({
    service,
    confidence: 0.3,
    reason: 'اقتراح عام',
    keywords: serviceKeywords[service.category as keyof typeof serviceKeywords] || [],
    suggestedResponse: generateServiceResponse(service, service.category, 0.3)
  }));
  
  return suggestions;
}; 