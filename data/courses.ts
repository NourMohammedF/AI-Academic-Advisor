// قاعدة بيانات المقررات الدراسية - كلية التربية - جامعة الإسكندرية

export interface Course {
  id: string;
  code: string;
  name: string;
  arabicName: string;
  credits: number;
  level: number;
  semester: 'first' | 'second' | 'summer';
  description: string;
  prerequisites: string[];
  objectives: string[];
  topics: string[];
  assessment: string;
  instructor: string;
  officeHours: string;
  textbook: string;
  resources: string[];
}

export const courses: Course[] = [
  {
    id: '1',
    code: 'EDU101',
    name: 'Introduction to Education',
    arabicName: 'مقدمة في التربية',
    credits: 3,
    level: 1,
    semester: 'first',
    description: 'مقدمة شاملة في مجال التربية والتعليم، يتعرف الطالب من خلالها على المفاهيم الأساسية في التربية.',
    prerequisites: [],
    objectives: [
      'فهم المفاهيم الأساسية في التربية',
      'التعرف على نظريات التعلم',
      'فهم دور المعلم في العملية التعليمية',
      'التعرف على أساليب التدريس الحديثة'
    ],
    topics: [
      'مفهوم التربية وأهدافها',
      'نظريات التعلم',
      'دور المعلم والمتعلم',
      'أساليب التدريس',
      'التقويم التربوي'
    ],
    assessment: 'امتحان نهائي 60% + أعمال السنة 40%',
    instructor: 'د. أحمد محمد',
    officeHours: 'الأحد والثلاثاء 10:00-12:00',
    textbook: 'مقدمة في التربية - د. علي حسن',
    resources: [
      'مكتبة كلية التربية',
      'قاعدة بيانات EBSCO',
      'موقع الجامعة الإلكتروني'
    ]
  },
  {
    id: '2',
    code: 'EDU102',
    name: 'Educational Psychology',
    arabicName: 'علم النفس التربوي',
    credits: 3,
    level: 1,
    semester: 'first',
    description: 'دراسة العوامل النفسية المؤثرة في عملية التعلم والتعليم.',
    prerequisites: ['EDU101'],
    objectives: [
      'فهم النظريات النفسية في التعلم',
      'التعرف على خصائص النمو',
      'فهم الدوافع والتحفيز',
      'التعرف على صعوبات التعلم'
    ],
    topics: [
      'نظريات التعلم',
      'خصائص النمو',
      'الدوافع والتحفيز',
      'الذكاء والقدرات',
      'صعوبات التعلم'
    ],
    assessment: 'امتحان نهائي 70% + مشروع 30%',
    instructor: 'د. فاطمة أحمد',
    officeHours: 'الاثنين والأربعاء 14:00-16:00',
    textbook: 'علم النفس التربوي - د. محمد علي',
    resources: [
      'مختبر علم النفس',
      'قاعدة بيانات PsycINFO',
      'أدوات القياس النفسي'
    ]
  },
  {
    id: '3',
    code: 'EDU201',
    name: 'Curriculum Development',
    arabicName: 'تطوير المناهج',
    credits: 3,
    level: 2,
    semester: 'second',
    description: 'دراسة أسس تطوير المناهج الدراسية وتصميمها وتقويمها.',
    prerequisites: ['EDU101', 'EDU102'],
    objectives: [
      'فهم أسس تطوير المناهج',
      'التعرف على نماذج تصميم المناهج',
      'فهم عملية تقويم المناهج',
      'التعرف على المناهج الحديثة'
    ],
    topics: [
      'أسس تطوير المناهج',
      'نماذج تصميم المناهج',
      'تطوير الأهداف التعليمية',
      'اختيار المحتوى',
      'تقويم المناهج'
    ],
    assessment: 'امتحان نهائي 50% + مشروع تطوير منهج 50%',
    instructor: 'د. سارة محمود',
    officeHours: 'الثلاثاء والخميس 11:00-13:00',
    textbook: 'تطوير المناهج - د. أحمد سعيد',
    resources: [
      'نماذج مناهج مختلفة',
      'قاعدة بيانات المناهج',
      'أدوات التصميم التعليمي'
    ]
  },
  {
    id: '4',
    code: 'EDU202',
    name: 'Teaching Methods',
    arabicName: 'طرق التدريس',
    credits: 3,
    level: 2,
    semester: 'second',
    description: 'دراسة الطرق والأساليب المختلفة في التدريس.',
    prerequisites: ['EDU101', 'EDU102'],
    objectives: [
      'التعرف على طرق التدريس المختلفة',
      'فهم أساليب التدريس الحديثة',
      'تطبيق طرق التدريس المناسبة',
      'تقويم فاعلية طرق التدريس'
    ],
    topics: [
      'طرق التدريس التقليدية',
      'الطرق الحديثة في التدريس',
      'التدريس بالحاسوب',
      'التدريس التعاوني',
      'تقويم طرق التدريس'
    ],
    assessment: 'امتحان نهائي 40% + تطبيق عملي 60%',
    instructor: 'د. خالد عبدالله',
    officeHours: 'الأحد والأربعاء 15:00-17:00',
    textbook: 'طرق التدريس - د. ليلى أحمد',
    resources: [
      'مختبر التدريس',
      'أدوات التدريس الحديثة',
      'فيديوهات تعليمية'
    ]
  },
  {
    id: '5',
    code: 'EDU301',
    name: 'Educational Technology',
    arabicName: 'التكنولوجيا التعليمية',
    credits: 3,
    level: 3,
    semester: 'first',
    description: 'دراسة استخدام التكنولوجيا في التعليم وتطبيقاتها.',
    prerequisites: ['EDU201', 'EDU202'],
    objectives: [
      'فهم دور التكنولوجيا في التعليم',
      'التعرف على الأدوات التكنولوجية',
      'تصميم مواد تعليمية رقمية',
      'تطبيق التكنولوجيا في التدريس'
    ],
    topics: [
      'مفهوم التكنولوجيا التعليمية',
      'الأدوات التكنولوجية',
      'تصميم المواد التعليمية',
      'التعلم الإلكتروني',
      'تقويم التكنولوجيا التعليمية'
    ],
    assessment: 'امتحان نهائي 30% + مشروع رقمي 70%',
    instructor: 'د. عمر محمد',
    officeHours: 'الاثنين والثلاثاء 13:00-15:00',
    textbook: 'التكنولوجيا التعليمية - د. نادية علي',
    resources: [
      'مختبر الحاسوب',
      'أدوات التصميم الرقمي',
      'منصات التعلم الإلكتروني'
    ]
  }
];

// دوال مساعدة
export const getCourseByCode = (code: string): Course | undefined => {
  return courses.find(course => course.code === code);
};

export const getCoursesByLevel = (level: number): Course[] => {
  return courses.filter(course => course.level === level);
};

export const getCoursesBySemester = (semester: 'first' | 'second' | 'summer'): Course[] => {
  return courses.filter(course => course.semester === semester);
};

export const searchCourses = (query: string): Course[] => {
  const lowerQuery = query.toLowerCase();
  return courses.filter(course => 
    course.name.toLowerCase().includes(lowerQuery) ||
    course.arabicName.includes(query) ||
    course.code.toLowerCase().includes(lowerQuery) ||
    course.description.includes(query)
  );
}; 