// معالج الأوامر الأكاديمية - المرشد الأكاديمي الذكي

import { courses, getCourseByCode, searchCourses, getCoursesByLevel } from '../data/courses';
import { calculateGPA, analyzePerformance, predictFuturePerformance, calculateRemainingCredits, Grade } from './gpaCalculator';
import { getUpcomingEvents, getEventsByType, searchEvents, getEventTypeArabic, getPriorityArabic } from '../data/academicCalendar';
import { universityServices, getServiceByCategory, searchServices } from '../data/universityServices';

export interface AcademicResponse {
  message: string;
  data?: any;
  type: 'info' | 'success' | 'warning' | 'error';
}

// معالج أمر المقررات
export const handleCourseCommand = (params: string[]): AcademicResponse => {
  if (!params || params.length === 0) {
    return {
      message: `📚 **المقررات المتاحة في كلية التربية:**
      
${courses.map(course => 
  `• **${course.code}** - ${course.arabicName}
   ${course.credits} ساعة معتمدة - المستوى ${course.level}`
).join('\n')}

💡 **للحصول على تفاصيل مقرر معين، اكتب:**
مقرر EDU101
أو
كورس مقدمة في التربية`,
      type: 'info'
    };
  }

  const query = params.join(' ');
  const foundCourses = searchCourses(query);

  if (foundCourses.length === 0) {
    return {
      message: `❌ **لم يتم العثور على مقرر:** "${query}"
      
🔍 **جرب البحث بـ:**
• رمز المقرر (مثل: EDU101)
• اسم المقرر (مثل: مقدمة في التربية)
• كلمة مفتاحية`,
      type: 'error'
    };
  }

  if (foundCourses.length === 1) {
    const course = foundCourses[0];
    return {
      message: `📖 **${course.code} - ${course.arabicName}**
      
📝 **الوصف:** ${course.description}

📊 **التفاصيل:**
• الساعات المعتمدة: ${course.credits}
• المستوى: ${course.level}
• الفصل الدراسي: ${course.semester === 'first' ? 'الأول' : course.semester === 'second' ? 'الثاني' : 'الصيفي'}

🎯 **الأهداف التعليمية:**
${course.objectives.map(obj => `• ${obj}`).join('\n')}

📚 **الموضوعات:**
${course.topics.map(topic => `• ${topic}`).join('\n')}

📋 **طريقة التقييم:** ${course.assessment}

👨‍🏫 **المدرس:** ${course.instructor}
🕐 **ساعات المكتب الإرشادي:** ${course.officeHours}

📖 **الكتاب المقرر:** ${course.textbook}

📚 **الموارد المتاحة:**
${course.resources.map(resource => `• ${resource}`).join('\n')}

${course.prerequisites.length > 0 ? `\n⚠️ **المتطلبات السابقة:** ${course.prerequisites.join(', ')}` : ''}`,
      type: 'info',
      data: course
    };
  }

  return {
    message: `🔍 **نتائج البحث عن:** "${query}"
    
${foundCourses.map(course => 
  `• **${course.code}** - ${course.arabicName}
   ${course.credits} ساعة معتمدة - المستوى ${course.level}`
).join('\n')}

💡 **للحصول على تفاصيل مقرر معين، اكتب:**
مقرر ${foundCourses[0].code}`,
    type: 'info',
    data: foundCourses
  };
};

// معالج أمر المعدل التراكمي
export const handleGPACommand = (params: string[]): AcademicResponse => {
  // بيانات تجريبية للطالب
  const sampleGrades: Grade[] = [
    {
      courseCode: 'EDU101',
      courseName: 'مقدمة في التربية',
      credits: 3,
      grade: 'A',
      gradePoints: 3.7,
      semester: 'first',
      year: 2024
    },
    {
      courseCode: 'EDU102',
      courseName: 'علم النفس التربوي',
      credits: 3,
      grade: 'B+',
      gradePoints: 3.0,
      semester: 'first',
      year: 2024
    },
    {
      courseCode: 'EDU201',
      courseName: 'تطوير المناهج',
      credits: 3,
      grade: 'A-',
      gradePoints: 3.3,
      semester: 'second',
      year: 2024
    }
  ];

  const gpaResult = calculateGPA(sampleGrades);
  const analysis = analyzePerformance(sampleGrades);
  const prediction = predictFuturePerformance(sampleGrades);
  const remainingCredits = calculateRemainingCredits(gpaResult.totalCredits);

  return {
    message: `📊 **المعدل التراكمي - جامعة الإسكندرية**

🎯 **المعدل التراكمي:** ${gpaResult.gpa} (${gpaResult.letterGrade})
📚 **إجمالي الساعات:** ${gpaResult.totalCredits} ساعة
🏆 **الحالة الأكاديمية:** ${gpaResult.status}

📋 **تفاصيل المقررات:**
${sampleGrades.map(grade => 
  `• ${grade.courseCode} - ${grade.courseName}: ${grade.grade} (${grade.gradePoints} نقطة)`
).join('\n')}

📈 **تحليل الأداء:**
${analysis.map(item => `• ${item}`).join('\n')}

🔮 **التوقع المستقبلي:**
${prediction}

🎓 **التخرج:**
${remainingCredits.message}

💡 **للحصول على حساب دقيق، أدخل درجاتك الفعلية**`,
    type: 'info',
    data: { gpaResult, analysis, prediction, remainingCredits }
  };
};

// معالج أمر المواعيد والفعاليات
export const handleEventsCommand = (params: string[]): AcademicResponse => {
  const upcomingEvents = getUpcomingEvents(60); // الأحداث القادمة خلال 60 يوم

  if (upcomingEvents.length === 0) {
    return {
      message: `📅 **لا توجد فعاليات قادمة خلال الشهرين القادمين**
      
💡 **يمكنك البحث عن:**
• فعاليات التسجيل
• امتحانات منتصف الفصل
• امتحانات نهائية
• ساعات المكتب الإرشادي`,
      type: 'info'
    };
  }

  return {
    message: `📅 **الفعاليات القادمة - جامعة الإسكندرية**

${upcomingEvents.map(event => {
  const eventDate = new Date(event.date);
  const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return `📌 **${event.arabicTitle}**
📅 التاريخ: ${eventDate.toLocaleDateString('ar-EG')} (بعد ${daysUntil} يوم)
📍 المكان: ${event.location || 'غير محدد'}
🎯 الأولوية: ${getPriorityArabic(event.priority)}
📝 ${event.description}
${event.notes ? `💡 ملاحظة: ${event.notes}` : ''}
${event.contact ? `📞 التواصل: ${event.contact}` : ''}
---`;
}).join('\n')}

💡 **للحصول على فعاليات محددة، اكتب:**
• فعاليات التسجيل
• امتحانات
• مكتب إرشادي`,
    type: 'info',
    data: upcomingEvents
  };
};

// معالج أمر المكتب الإرشادي
export const handleOfficeCommand = (params: string[]): AcademicResponse => {
  const officeEvents = getEventsByType('office');

  if (officeEvents.length === 0) {
    return {
      message: `👨‍🏫 **لا توجد ساعات مكتب إرشادي محددة حالياً**
      
💡 **يمكنك:**
• التواصل مع مدرسك مباشرة
• زيارة مكتب الإرشاد الأكاديمي
• إرسال استفسار عبر البريد الإلكتروني`,
      type: 'info'
    };
  }

  return {
    message: `👨‍🏫 **ساعات المكتب الإرشادي - كلية التربية**

${officeEvents.map(event => 
  `📌 **${event.arabicTitle}**
📅 التاريخ: ${new Date(event.date).toLocaleDateString('ar-EG')}
📍 المكان: ${event.location}
📞 التواصل: ${event.contact}
📝 ${event.description}
${event.notes ? `💡 ${event.notes}` : ''}
---`
).join('\n')}

💡 **نصائح للاستفادة من المكتب الإرشادي:**
• احضر مستعداً بأسئلتك
• احمل المواد المطلوبة
• احترم الوقت المحدد
• اكتب الملاحظات المهمة`,
    type: 'info',
    data: officeEvents
  };
};

// معالج أمر المكتبة
export const handleLibraryCommand = (params: string[]): AcademicResponse => {
  return {
    message: `📚 **مكتبة كلية التربية - جامعة الإسكندرية**

🏢 **معلومات المكتبة:**
• العنوان: الدور الأول - كلية التربية
• ساعات العمل: الأحد - الخميس (8:00 ص - 4:00 م)
• الهاتف: 03-4871236
• البريد الإلكتروني: library@edu.alexu.edu.eg

📖 **الخدمات المتاحة:**
• استعارة الكتب (3 كتب لمدة أسبوعين)
• البحث في قواعد البيانات العلمية
• استخدام أجهزة الحاسوب
• خدمات الطباعة والنسخ
• جلسات البحث الجماعية

🔍 **قواعد البيانات المتاحة:**
• EBSCO (المجلات العلمية)
• PsycINFO (علم النفس)
• ERIC (التربية والتعليم)
• JSTOR (الأبحاث الأكاديمية)

📋 **إجراءات الاستعارة:**
1. احضر بطاقة الطالب
2. ابحث في فهرس المكتبة
3. املأ نموذج الاستعارة
4. احترم مواعيد الإرجاع

💡 **للحصول على مساعدة في البحث، تواصل مع أمين المكتبة**`,
    type: 'info'
  };
};

// معالج أمر الاستشارات الأكاديمية العامة
export const handleAcademicCommand = (params: string[]): AcademicResponse => {
  const query = params?.join(' ') || '';

  if (!query) {
    return {
      message: `🎓 **المرشد الأكاديمي الذكي - جامعة الإسكندرية**

مرحباً بك في المرشد الأكاديمي! يمكنني مساعدتك في:

📚 **المقررات الدراسية:**
• معلومات المقررات
• المتطلبات السابقة
• طرق التقييم

📊 **الأداء الأكاديمي:**
• حساب المعدل التراكمي
• تحليل الأداء
• نصائح للتحسين

📅 **المواعيد المهمة:**
• مواعيد التسجيل
• امتحانات
• فعاليات الجامعة

👨‍🏫 **الخدمات الطلابية:**
• المكتب الإرشادي
• المكتبة
• الاستشارات

💡 **اكتب استفسارك أو اختر من القائمة أعلاه**`,
      type: 'info'
    };
  }

  // معالجة استفسارات محددة
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes('تخرج') || lowerQuery.includes('graduation')) {
    return {
      message: `🎓 **متطلبات التخرج - كلية التربية**

📚 **الساعات المطلوبة:** 132 ساعة معتمدة

📋 **متطلبات التخرج:**
• إكمال جميع المقررات الإجبارية
• المعدل التراكمي لا يقل عن 2.0
• إكمال مشروع التخرج
• اجتياز امتحان التخرج الشامل

📅 **إجراءات التخرج:**
1. تقديم طلب التخرج قبل الفصل الأخير
2. مراجعة الساعات المكتملة
3. إكمال مشروع التخرج
4. دفع رسوم التخرج
5. حضور حفل التخرج

💡 **للحصول على تقرير مفصل، اكتب: حساب المعدل**`,
      type: 'info'
    };
  }

  if (lowerQuery.includes('منح') || lowerQuery.includes('scholarship')) {
    return {
      message: `💰 **المنح الدراسية - جامعة الإسكندرية**

🎯 **أنواع المنح المتاحة:**
• منح التفوق الأكاديمي
• منح الطلاب المتفوقين
• منح الطلاب المحتاجين
• منح التبادل الطلابي

📋 **شروط التقديم:**
• المعدل التراكمي لا يقل عن 3.0
• عدم وجود إنذارات أكاديمية
• إكمال 30 ساعة معتمدة على الأقل

📅 **مواعيد التقديم:**
• الفصل الدراسي الأول: سبتمبر
• الفصل الدراسي الثاني: فبراير

📞 **معلومات التواصل:**
• مكتب المنح الدراسية
• الهاتف: 03-4871237
• البريد الإلكتروني: scholarships@alexu.edu.eg

💡 **للحصول على تفاصيل أكثر، زر مكتب المنح الدراسية**`,
      type: 'info'
    };
  }

  return {
    message: `🤔 **استفسارك:** "${query}"

أعتذر، لم أفهم استفسارك بالكامل. يمكنني مساعدتك في:

📚 **معلومات المقررات** - اكتب: مقرر EDU101
📊 **حساب المعدل** - اكتب: حساب المعدل
📅 **المواعيد المهمة** - اكتب: فعاليات
👨‍🏫 **المكتب الإرشادي** - اكتب: مكتب إرشادي
📖 **المكتبة** - اكتب: مكتبة

أو اكتب استفسارك بطريقة أخرى وسأحاول مساعدتك!`,
    type: 'warning'
  };
};

// معالج أمر جداول الامتحانات
export const handleExamCommand = (params: string[]): AcademicResponse => {
  const examServices = getServiceByCategory('exam');
  
  if (examServices.length === 0) {
    return {
      message: '❌ لا توجد خدمات امتحانات متاحة حالياً',
      type: 'error'
    };
  }

  const service = examServices[0];
  
  return {
    message: `📅 **جداول الامتحانات - جامعة الإسكندرية**

📋 **${service.arabicName}**
${service.description}

🔗 **الرابط المباشر:**
${service.url}

📝 **خطوات الاستخدام:**
${service.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

💡 **ملاحظات مهمة:**
• تأكد من اختيار الفصل الدراسي الصحيح
• احفظ الجدول على جهازك للرجوع إليه
• تحقق من مواعيد الامتحانات مبكراً
• احضر قبل موعد الامتحان بـ 30 دقيقة`,
    type: 'info',
    data: service
  };
};

// معالج أمر الاستعلام المالي
export const handleFinancialCommand = (params: string[]): AcademicResponse => {
  const financialServices = getServiceByCategory('financial');
  
  if (financialServices.length === 0) {
    return {
      message: '❌ لا توجد خدمات مالية متاحة حالياً',
      type: 'error'
    };
  }

  const service = financialServices[0];
  
  return {
    message: `💰 **الاستعلام عن المديونية - جامعة الإسكندرية**

📋 **${service.arabicName}**
${service.description}

🔗 **الرابط المباشر:**
${service.url}

📝 **خطوات الاستخدام:**
${service.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

💡 **معلومات مهمة:**
• تحتاج بيانات تسجيل الدخول الخاصة بك
• يمكنك طباعة تقرير المديونية
• تحقق من مواعيد دفع الرسوم
• تواصل مع الشؤون المالية إذا كان لديك استفسار`,
    type: 'info',
    data: service
  };
};

// معالج أمر البريد الإلكتروني الجامعي
export const handleEmailCommand = (params: string[]): AcademicResponse => {
  const emailServices = getServiceByCategory('email');
  
  if (emailServices.length === 0) {
    return {
      message: '❌ لا توجد خدمات بريد إلكتروني متاحة حالياً',
      type: 'error'
    };
  }

  const service = emailServices[0];
  
  return {
    message: `📧 **البريد الإلكتروني الجامعي - جامعة الإسكندرية**

📋 **${service.arabicName}**
${service.description}

🔗 **الرابط المباشر:**
${service.url}

📝 **خطوات الاستخدام:**
${service.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}

⚠️ **تنبيهات مهمة:**
• استخدم الرقم القومي في كلا الحقلين
• تأكد من صحة الرقم القومي
• احفظ معلومات البريد الإلكتروني
• لا تشارك كلمة المرور مع أحد

💡 **فوائد البريد الجامعي:**
• التواصل الرسمي مع الجامعة
• استلام الإشعارات المهمة
• الوصول للموارد التعليمية
• التواصل مع المدرسين`,
    type: 'info',
    data: service
  };
};

// معالج أمر جميع الخدمات
export const handleServicesCommand = (params: string[]): AcademicResponse => {
  if (!params || params.length === 0) {
    return {
      message: `🔗 **الخدمات الجامعية - جامعة الإسكندرية**

📋 **الخدمات المتاحة:**

📅 **جداول الامتحانات**
• تحميل جداول الامتحانات
• اكتب: "امتحانات" أو "exam"

💰 **الاستعلام المالي**
• الاستعلام عن المديونية
• اكتب: "مالية" أو "مديونية"

📧 **البريد الإلكتروني الجامعي**
• الاستعلام عن البريد الجامعي
• اكتب: "بريد" أو "ايميل"

💡 **للحصول على خدمة محددة، اكتب:**
• امتحانات
• مالية
• بريد
• أو اكتب "خدمات" + اسم الخدمة`,
      type: 'info',
      data: universityServices
    };
  }

  const query = params.join(' ');
  const foundServices = searchServices(query);

  if (foundServices.length === 0) {
    return {
      message: `❌ **لم يتم العثور على خدمة:** "${query}"
      
🔍 **الخدمات المتاحة:**
• جداول الامتحانات
• الاستعلام المالي
• البريد الإلكتروني الجامعي

💡 **جرب البحث بـ:**
• امتحانات
• مالية
• بريد`,
      type: 'error'
    };
  }

  if (foundServices.length === 1) {
    const service = foundServices[0];
    return {
      message: `🔗 **${service.arabicName}**

📝 **الوصف:** ${service.description}

🔗 **الرابط المباشر:**
${service.url}

📋 **خطوات الاستخدام:**
${service.instructions.map((instruction, index) => `${index + 1}. ${instruction}`).join('\n')}`,
      type: 'info',
      data: service
    };
  }

  return {
    message: `🔍 **نتائج البحث عن:** "${query}"
    
${foundServices.map(service => 
  `• **${service.arabicName}** - ${service.description}`
).join('\n')}

💡 **للحصول على تفاصيل خدمة معينة، اكتب:**
${foundServices[0].arabicName}`,
    type: 'info',
    data: foundServices
  };
}; 