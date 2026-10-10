# 🤖 دليل النظام الذكي - المرشد الأكاديمي

## 🎯 نظرة عامة
النظام الذكي في المرشد الأكاديمي يمكنه تحليل رسائل المستخدم بشكل طبيعي وتحديد الخدمة المطلوبة تلقائياً.

## ⚙️ إعدادات النظام الذكي

### 📁 ملف الإعدادات: `config/aiConfig.ts`

```typescript
// تفعيل/تعطيل النظام الذكي
smartAnalysis: {
  enabled: true,                    // تفعيل التحليل الذكي
  confidenceThreshold: 0.5,         // عتبة الثقة (0-1)
  enableContextAnalysis: true,      // تحليل السياق
  enableKeywordAnalysis: true,      // تحليل الكلمات المفتاحية
  enableAdvancedAnalysis: true,     // التحليل المتقدم
}
```

### 🔧 التحكم في مصادر البيانات

```typescript
dataSources: {
  universityServices: true,         // الخدمات الجامعية
  academicCalendar: true,           // التقويم الأكاديمي
  courses: true,                    // المقررات الدراسية
  gpaCalculator: true,              // حاسبة المعدل
  jokes: true,                      // النكت التعليمية
  timeDate: true,                   // الوقت والتاريخ
}
```

### 📝 إعدادات الردود

```typescript
responses: {
  enableConfidenceDisplay: false,   // عرض مستوى الثقة
  enableReasonDisplay: false,       // عرض سبب التحليل
  enableSuggestions: true,          // الاقتراحات
  enableFallback: true,             // الرد الافتراضي
}
```

## 🎮 كيفية التحكم في النظام

### 1️⃣ تفعيل/تعطيل النظام الذكي
```typescript
import { updateAIConfig } from './config/aiConfig';

// تعطيل النظام الذكي
const config = updateAIConfig({
  smartAnalysis: {
    enabled: false
  }
});

// تفعيل النظام الذكي
const config = updateAIConfig({
  smartAnalysis: {
    enabled: true
  }
});
```

### 2️⃣ تعديل عتبة الثقة
```typescript
// رفع عتبة الثقة (أكثر دقة)
const config = updateAIConfig({
  smartAnalysis: {
    confidenceThreshold: 0.7
  }
});

// خفض عتبة الثقة (أكثر مرونة)
const config = updateAIConfig({
  smartAnalysis: {
    confidenceThreshold: 0.3
  }
});
```

### 3️⃣ تفعيل عرض معلومات التحليل
```typescript
// عرض مستوى الثقة وسبب التحليل
const config = updateAIConfig({
  responses: {
    enableConfidenceDisplay: true,
    enableReasonDisplay: true
  }
});
```

### 4️⃣ التحكم في مصادر البيانات
```typescript
// تعطيل خدمة معينة
const config = updateAIConfig({
  dataSources: {
    jokes: false,  // تعطيل النكت التعليمية
    timeDate: false // تعطيل الوقت والتاريخ
  }
});
```

## 🔍 كيف يعمل النظام الذكي

### 📊 تحليل الكلمات المفتاحية
النظام يبحث عن كلمات محددة في رسالة المستخدم:

**جداول الامتحانات:**
- امتحان، امتحانات، جدول، جداول
- exam, schedule, test, tests
- موعد، مواعيد، فصل، ترم

**الاستعلام المالي:**
- مالية، مالي، مديونية، رسوم
- financial, money, fees, payment
- استعلام، inquiry, debt, dues

**البريد الجامعي:**
- بريد، ايميل، email، جامعي
- university, mail, gmail
- الرقم القومي، national id

### 🧠 تحليل السياق
النظام يحلل سياق الرسالة:

```typescript
// أمثلة على تحليل السياق
"متى امتحانات الفصل الثاني؟" → امتحانات
"كم رسومي الدراسية؟" → مالية
"كيف أحصل على البريد الجامعي؟" → بريد
```

### 📈 حساب مستوى الثقة
```typescript
// مثال على حساب الثقة
const scores = {
  exam: 2,      // وجد كلمتين متعلقتين بالامتحانات
  financial: 0, // لم يجد كلمات مالية
  email: 0      // لم يجد كلمات متعلقة بالبريد
};

const confidence = Math.min(maxScore / 3, 1); // تطبيع النتيجة
```

## 🎯 أمثلة على الاستخدام

### ✅ رسائل واضحة (ثقة عالية)
```
"أريد جدول الامتحانات" → ثقة: 85%
"كيف أعرف مديونيتي؟" → ثقة: 90%
"أحتاج البريد الجامعي" → ثقة: 80%
```

### ⚠️ رسائل غامضة (ثقة متوسطة)
```
"جدول" → ثقة: 40% (قد يكون امتحانات أو مواعيد)
"رسوم" → ثقة: 50% (قد يكون مالية أو مدفوعات)
"بريد" → ثقة: 45% (قد يكون جامعي أو عادي)
```

### ❌ رسائل غير واضحة (ثقة منخفضة)
```
"مرحبا" → ثقة: 0%
"شكرا" → ثقة: 0%
"كيف حالك" → ثقة: 0%
```

## 🔧 تخصيص النظام

### إضافة كلمات مفتاحية جديدة
```typescript
// في ملف aiServiceAnalyzer.ts
const serviceKeywords = {
  exam: [
    // الكلمات الحالية...
    'جديد', 'new', 'مطلوب', 'needed'
  ],
  // باقي الخدمات...
};
```

### إضافة تحليل سياق جديد
```typescript
const analyzeContext = (message: string) => {
  const context = { exam: 0, financial: 0, email: 0 };
  
  // إضافة قواعد جديدة
  if (message.includes('مطلوب') || message.includes('needed')) {
    context.exam += 0.3;
  }
  
  return context;
};
```

## 📊 مراقبة الأداء

### تفعيل السجلات
```typescript
// في App.tsx
console.log('تحليل ذكي:', {
  message,
  service: analysis.service?.arabicName,
  confidence: analysis.confidence,
  reason: analysis.reason,
  config: {
    enabled: config.smartAnalysis.enabled,
    threshold: config.smartAnalysis.confidenceThreshold
  }
});
```

### تحليل النتائج
- **مستوى الثقة العالي (>0.7):** النظام يعمل بشكل ممتاز
- **مستوى الثقة المتوسط (0.3-0.7):** يحتاج تحسين
- **مستوى الثقة المنخفض (<0.3):** يحتاج إعادة تدريب

## 🚀 نصائح للتحسين

1. **جمع البيانات:** راقب الرسائل التي لا يفهمها النظام
2. **إضافة كلمات مفتاحية:** أضف الكلمات الشائعة التي يستخدمها الطلاب
3. **تحسين تحليل السياق:** أضف قواعد جديدة للسياق
4. **ضبط عتبة الثقة:** ارفعها للدقة أو اخفضها للمرونة
5. **اختبار مستمر:** اختبر النظام مع رسائل مختلفة

## 📞 الدعم
إذا واجهت مشاكل في النظام الذكي، راجع:
- سجلات التطبيق في Console
- إعدادات `aiConfig.ts`
- كلمات مفتاحية في `aiServiceAnalyzer.ts` 