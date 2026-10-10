# 🤖 تحويل النظام إلى الذكاء الاصطناعي لمعالجة PDF و Word

## 📋 ملخص التغييرات

تم تحويل النظام من استخدام Python scripts إلى الذكاء الاصطناعي لمعالجة ملفات PDF و Word واستخراج البيانات الأكاديمية.

## 🔄 التغييرات الرئيسية

### ✅ ما تم إزالته (Python):
- `pdf_api_server.py` - خادم Python API
- `extract_pdf_data.py` - سكريبت استخراج البيانات
- `integrate_data.py` - سكريبت دمج البيانات
- `test_extraction.py` - سكريبت اختبار الاستخراج
- `requirements.txt` - متطلبات Python
- `PYTHON_API_SETUP.md` - دليل إعداد Python
- `PDF_TOOL_README.md` - دليل أدوات PDF
- `PDF_EXTRACTION_README.md` - دليل استخراج PDF

### ✅ ما تم تحسينه (AI):
- `utils/pdfReader.ts` - محرك الذكاء الاصطناعي الجديد
- `components/GradesUpload.tsx` - واجهة رفع الملفات المحسنة
- `README.md` - تحديث الوثائق
- `QUICK_START.md` - دليل سريع محدث

## 🧠 كيف يعمل النظام الجديد

### 1. استخراج النص من الملفات
```typescript
// استخراج النص من PDF
async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(' ') + '\n';
  }
  return text;
}

// استخراج النص من Word
async function extractDocxText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const { value } = await mammoth.extractRawText({ arrayBuffer });
  return value;
}
```

### 2. تحليل النص بالذكاء الاصطناعي
```typescript
async function extractStudentDataWithAI(text: string): Promise<StudentData> {
  const prompt = `أنت خبير في تحليل النصوص الأكاديمية العربية. 
  قم بتحليل النص التالي واستخراج البيانات الأكاديمية للطالب.
  
  النص المطلوب تحليله:
  ${text}
  
  قم باستخراج المعلومات التالية بدقة:
  1. اسم الطالب الكامل
  2. رقم الطالب أو الرقم الجامعي
  3. السنة الدراسية
  4. الفصل الدراسي
  5. قائمة المواد مع درجاتها وساعاتها المعتمدة
  
  أرجع النتيجة كـ JSON object...`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost',
      'X-Title': 'Co App'
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'أنت مساعد متخصص في تحليل النصوص الأكاديمية العربية. أجب دائماً بـ JSON صحيح وقابل للتحليل.' 
        },
        { role: 'user', content: prompt }
      ],
      temperature: 0.1,
      max_tokens: 2000
    })
  });
  
  // معالجة الاستجابة والتحقق من صحة البيانات
  // ...
}
```

### 3. التحقق من صحة البيانات
```typescript
// التحقق من صحة البيانات المستخرجة
if (!parsedData.name || !parsedData.studentId || !parsedData.grades || !Array.isArray(parsedData.grades)) {
  throw new Error('Invalid data structure returned by AI');
}

// التأكد من وجود جميع الحقول المطلوبة
const validatedGrades = parsedData.grades.map((grade: any) => ({
  subject: grade.subject || 'مادة غير محددة',
  grade: grade.grade || '0',
  creditHours: grade.creditHours || '3'
}));
```

## 🎯 المزايا الجديدة

### ✅ دقة عالية:
- تحليل ذكي للنصوص العربية والإنجليزية
- استخراج دقيق للبيانات الأكاديمية
- معالجة الأخطاء والبيانات الناقصة

### ✅ سهولة الاستخدام:
- لا حاجة لبرمجة Python
- لا حاجة لتثبيت مكتبات إضافية
- يعمل مباشرة في المتصفح

### ✅ مرونة:
- يدعم أنواع مختلفة من الملفات
- يتعامل مع تنسيقات مختلفة
- يحلل النصوص المعقدة

### ✅ معالجة الأخطاء:
- رسائل خطأ واضحة باللغة العربية
- اقتراحات لحل المشاكل
- استخدام البيانات التجريبية كبديل

## 📁 الملفات المدعومة

### ✅ ملفات PDF (.pdf):
- نتائج الامتحانات
- كشوف الدرجات
- التقارير الأكاديمية

### ✅ ملفات Word (.docx):
- ملفات النتائج المحفوظة بصيغة Word
- التقارير الأكاديمية
- كشوف الدرجات

### ✅ النصوص المدعومة:
- العربية والإنجليزية
- جداول منظمة
- نصوص عادية

## 🔧 الإعدادات التقنية

### المكتبات المستخدمة:
- `pdfjs-dist` - لقراءة ملفات PDF
- `mammoth` - لقراءة ملفات Word
- `OpenRouter API` - للذكاء الاصطناعي

### إعدادات Babel:
```javascript
module.exports = {
  plugins: [
    "@babel/plugin-transform-class-static-block",
    "@babel/plugin-transform-private-methods",
    "@babel/plugin-transform-private-property-in-object",
    "@babel/plugin-transform-class-properties"
  ],
  presets: ['module:metro-react-native-babel-preset']
};
```

## 🚀 كيفية الاستخدام

### 1. رفع الملف:
```typescript
const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file) return;
  
  // التحقق من نوع الملف
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  
  // معالجة الملف
  await analyzePDFFile(file);
};
```

### 2. استخراج البيانات:
```typescript
const analyzePDFFile = async (file: any) => {
  try {
    // قراءة وتحليل ملف PDF أو DOCX باستخدام JS/AI
    const pdfData = await readPDFFile(file);
    
    // تحويل البيانات إلى التنسيق المطلوب
    const extracted: ExtractedData = {
      name: pdfData.name,
      studentId: pdfData.studentId,
      semester: pdfData.semester,
      academicYear: pdfData.academicYear,
      grades: pdfData.grades.map(grade => ({
        courseCode: 'EDU' + Math.floor(Math.random() * 900 + 100),
        courseName: grade.subject,
        grade: parseInt(grade.grade),
        credits: parseInt(grade.creditHours),
        semester: pdfData.semester.includes('الأول') ? 1 : 2,
        academicYear: parseInt(pdfData.academicYear.split('-')[0]) - 2020,
        isPassed: parseInt(grade.grade) >= 50,
        attempts: 1
      }))
    };
    
    setExtractedData(extracted);
  } catch (error) {
    // معالجة الأخطاء
    console.error('خطأ في تحليل الملف:', error);
  }
};
```

## 📊 مقارنة الأداء

| الميزة | النظام القديم (Python) | النظام الجديد (AI) |
|--------|------------------------|-------------------|
| **سهولة الاستخدام** | يتطلب تثبيت Python | يعمل مباشرة في المتصفح |
| **الدقة** | محدودة بالأنماط المبرمجة | ذكية ومتطورة |
| **المرونة** | محدودة | عالية |
| **معالجة الأخطاء** | بسيطة | متقدمة |
| **اللغة** | الإنجليزية فقط | العربية والإنجليزية |
| **التطوير** | يتطلب خبرة Python | JavaScript فقط |

## 🔮 التطوير المستقبلي

### تحسينات مقترحة:
1. **تحسين الـ prompt** - لجعل الاستخراج أكثر دقة
2. **إضافة دعم المزيد من الملفات** - مثل Excel
3. **تحسين معالجة الأخطاء** - رسائل أكثر وضوحاً
4. **إضافة خيارات متقدمة** - للمستخدمين المتقدمين

### إضافة ميزات جديدة:
1. **حفظ البيانات المستخرجة** - في localStorage
2. **تصدير التقارير** - بصيغ مختلفة
3. **مقارنة النتائج** - بين فصول مختلفة
4. **تحليل الاتجاهات** - عبر الزمن

## 📞 الدعم

للاستفسارات أو الإبلاغ عن مشاكل:
- راجع ملف `README.md` الرئيسي
- تحقق من إعدادات API في `config.ts`
- تأكد من صحة البيانات المدخلة
- راجع ملف `AI_SYSTEM_GUIDE.md` للتفاصيل التقنية

---

**تم تطوير هذا النظام لخدمة طلاب جامعة الإسكندرية - كلية التربية** 