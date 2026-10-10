import { COMMAND_PATTERNS } from '../config';

export interface ParsedCommand {
  type: 'joke' | 'time' | 'date' | 'help' | 'ai' | 
        'course' | 'gpa' | 'schedule' | 'events' | 'library' | 'office' | 'grades' | 'academic' |
        'exam' | 'financial' | 'email' | 'services' | 'results' | 'analysis';
  params?: string[];
  originalMessage: string;
}

export const parseCommand = (message: string): ParsedCommand => {
  const trimmedMessage = message.trim();
  
  // فحص الأوامر باستخدام Regex
  if (COMMAND_PATTERNS.JOKE.test(trimmedMessage)) {
    return { type: 'joke', originalMessage: message };
  }

  if (COMMAND_PATTERNS.TIME.test(trimmedMessage)) {
    return { type: 'time', originalMessage: message };
  }

  if (COMMAND_PATTERNS.DATE.test(trimmedMessage)) {
    return { type: 'date', originalMessage: message };
  }

  if (COMMAND_PATTERNS.HELP.test(trimmedMessage)) {
    return { type: 'help', originalMessage: message };
  }

  // الأوامر الأكاديمية الجديدة
  const courseMatch = trimmedMessage.match(/(?:مقرر|كورس|course)\s+(.+)/i);
  if (courseMatch) {
    return {
      type: 'course',
      params: [courseMatch[1]],
      originalMessage: message
    };
  }

  const gpaMatch = trimmedMessage.match(/(?:معدل|gpa|حساب المعدل)\s*(.+)?/i);
  if (gpaMatch) {
    return {
      type: 'gpa',
      params: gpaMatch[1] ? [gpaMatch[1]] : [],
      originalMessage: message
    };
  }

  const scheduleMatch = trimmedMessage.match(/(?:جدول|schedule|مواعيد)\s*(.+)?/i);
  if (scheduleMatch) {
    return {
      type: 'schedule',
      params: scheduleMatch[1] ? [scheduleMatch[1]] : [],
      originalMessage: message
    };
  }

  const eventsMatch = trimmedMessage.match(/(?:فعاليات|events|مواعيد مهمة)\s*(.+)?/i);
  if (eventsMatch) {
    return {
      type: 'events',
      params: eventsMatch[1] ? [eventsMatch[1]] : [],
      originalMessage: message
    };
  }

  const libraryMatch = trimmedMessage.match(/(?:مكتبة|library|كتب)\s*(.+)?/i);
  if (libraryMatch) {
    return {
      type: 'library',
      params: libraryMatch[1] ? [libraryMatch[1]] : [],
      originalMessage: message
    };
  }

  const officeMatch = trimmedMessage.match(/(?:مكتب إرشادي|office hours|ساعات مكتب)\s*(.+)?/i);
  if (officeMatch) {
    return {
      type: 'office',
      params: officeMatch[1] ? [officeMatch[1]] : [],
      originalMessage: message
    };
  }

  const gradesMatch = trimmedMessage.match(/(?:درجات|grades|تقييم)\s*(.+)?/i);
  if (gradesMatch) {
    return {
      type: 'grades',
      params: gradesMatch[1] ? [gradesMatch[1]] : [],
      originalMessage: message
    };
  }

  const academicMatch = trimmedMessage.match(/(?:أكاديمي|academic|استشارة)\s*(.+)?/i);
  if (academicMatch) {
    return {
      type: 'academic',
      params: academicMatch[1] ? [academicMatch[1]] : [],
      originalMessage: message
    };
  }

  // الأوامر الجديدة للخدمات الجامعية
  const examMatch = trimmedMessage.match(/(?:امتحانات|exam|جداول امتحانات)\s*(.+)?/i);
  if (examMatch) {
    return {
      type: 'exam',
      params: examMatch[1] ? [examMatch[1]] : [],
      originalMessage: message
    };
  }

  const financialMatch = trimmedMessage.match(/(?:مالية|financial|مديونية|رسوم)\s*(.+)?/i);
  if (financialMatch) {
    return {
      type: 'financial',
      params: financialMatch[1] ? [financialMatch[1]] : [],
      originalMessage: message
    };
  }

  const emailMatch = trimmedMessage.match(/(?:بريد|email|ايميل|جامعي)\s*(.+)?/i);
  if (emailMatch) {
    return {
      type: 'email',
      params: emailMatch[1] ? [emailMatch[1]] : [],
      originalMessage: message
    };
  }

  const servicesMatch = trimmedMessage.match(/(?:خدمات|services|روابط)\s*(.+)?/i);
  if (servicesMatch) {
    return {
      type: 'services',
      params: servicesMatch[1] ? [servicesMatch[1]] : [],
      originalMessage: message
    };
  }

  // أوامر التحليل الأكاديمي الجديدة
  const resultsMatch = trimmedMessage.match(/(?:رفع نتائج|نتائج|results|تحليل نتائج|رفع درجات|تحليل درجات)\s*(.+)?/i);
  if (resultsMatch) {
    return {
      type: 'results',
      params: resultsMatch[1] ? [resultsMatch[1]] : [],
      originalMessage: message
    };
  }

  const analysisMatch = trimmedMessage.match(/(?:تحليل أكاديمي|تحليل أدائي|analysis|توصيات)\s*(.+)?/i);
  if (analysisMatch) {
    return {
      type: 'analysis',
      params: analysisMatch[1] ? [analysisMatch[1]] : [],
      originalMessage: message
    };
  }

  // أوامر رفع الملفات
  const uploadMatch = trimmedMessage.match(/(?:pdf|ملف pdf|رفع ملف|upload file)\s*(.+)?/i);
  if (uploadMatch) {
    return {
      type: 'results',
      params: uploadMatch[1] ? [uploadMatch[1]] : [],
      originalMessage: message
    };
  }

  // إذا لم يطابق أي أمر، فهو رسالة عادية للذكاء الاصطناعي
  return { type: 'ai', originalMessage: message };
}; 