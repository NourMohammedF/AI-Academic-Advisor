// روابط الخدمات الجامعية - جامعة الإسكندرية

export interface UniversityService {
  id: string;
  name: string;
  arabicName: string;
  description: string;
  url: string;
  instructions: string[];
  category: 'academic' | 'financial' | 'email' | 'exam';
}

export const universityServices: UniversityService[] = [
  {
    id: '1',
    name: 'Exam Schedules',
    arabicName: 'جداول الامتحانات',
    description: 'تحميل جداول الامتحانات للفصول الدراسية المختلفة',
    url: 'https://edu.alexu.edu.eg/index.php/ar/2015-06-09-13-55-42/2015-09-16-10-05-41/2015-12-13-10-14-46',
    instructions: [
      'اضغط على الرابط أدناه',
      'اختر الفصل الدراسي المطلوب',
      'تحميل الجدول بصيغة PDF',
      'احفظ الجدول على جهازك'
    ],
    category: 'exam'
  },
  {
    id: '2',
    name: 'Financial Inquiry',
    arabicName: 'الاستعلام عن المديونية',
    description: 'الاستعلام عن الرسوم الدراسية والمديونية المالية',
    url: 'http://epay.fis.alexu.edu.eg/AlexPay/Registration/ED_Login.aspx',
    instructions: [
      'اضغط على الرابط أدناه',
      'أدخل بيانات تسجيل الدخول',
      'استعرض المديونية المالية',
      'اطبع تقرير المديونية إذا لزم الأمر'
    ],
    category: 'financial'
  },
  {
    id: '3',
    name: 'University Email',
    arabicName: 'البريد الإلكتروني الجامعي',
    description: 'الاستعلام عن البريد الإلكتروني الجامعي',
    url: 'http://umis.alexu.edu.eg/umisapp/Registration/ED_Login.aspx',
    instructions: [
      'اضغط على الرابط أدناه',
      'أدخل الرقم القومي في حقل "كود الطالب"',
      'أدخل نفس الرقم القومي في حقل "كلمة السر"',
      'اضغط على "الحصول على البريد الجامعي"',
      'اضغط على "الاسم صحيح"',
      'انسخ جميع المعلومات المعروضة'
    ],
    category: 'email'
  }
];

// دوال مساعدة
export const getServiceByCategory = (category: UniversityService['category']): UniversityService[] => {
  return universityServices.filter(service => service.category === category);
};

export const getServiceById = (id: string): UniversityService | undefined => {
  return universityServices.find(service => service.id === id);
};

export const searchServices = (query: string): UniversityService[] => {
  const lowerQuery = query.toLowerCase();
  return universityServices.filter(service => 
    service.name.toLowerCase().includes(lowerQuery) ||
    service.arabicName.includes(query) ||
    service.description.includes(query)
  );
}; 