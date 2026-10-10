export interface CourseRequirement {
  courseCode: string;
  courseName: string;
  credits: number;
  prerequisites?: string[];
  isRequired: boolean;
  semester: number;
  academicYear: number;
}

export interface AcademicRule {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'requirement' | 'graduation' | 'gpa';
  conditions: {
    minGPA?: number;
    maxFailures?: number;
    requiredCourses?: string[];
    maxSemesters?: number;
  };
  consequences: string[];
  recommendations: string[];
}

export interface CurriculumRegulation {
  id: string;
  name: string;
  arabicName: string;
  department: string;
  totalCredits: number;
  maxSemesters: number;
  minGPAForGraduation: number;
  maxFailuresAllowed: number;
  courses: CourseRequirement[];
  rules: AcademicRule[];
}

// لائحة شعبة الطفولة
export const CHILDHOOD_CURRICULUM: CurriculumRegulation = {
  id: 'childhood-2024',
  name: 'Childhood Education Curriculum',
  arabicName: 'لائحة شعبة الطفولة',
  department: 'كلية التربية - جامعة الإسكندرية',
  totalCredits: 132,
  maxSemesters: 8,
  minGPAForGraduation: 2.0,
  maxFailuresAllowed: 3,
  
  courses: [
    // السنة الأولى - الفصل الأول
    {
      courseCode: 'EDU101',
      courseName: 'مقدمة في التربية',
      credits: 3,
      semester: 1,
      academicYear: 1,
      isRequired: true
    },
    {
      courseCode: 'EDU102',
      courseName: 'علم النفس التربوي',
      credits: 3,
      semester: 1,
      academicYear: 1,
      isRequired: true
    },
    {
      courseCode: 'EDU103',
      courseName: 'طرق التدريس العامة',
      credits: 3,
      semester: 1,
      academicYear: 1,
      isRequired: true
    },
    {
      courseCode: 'EDU104',
      courseName: 'تقنيات التعليم',
      credits: 2,
      semester: 1,
      academicYear: 1,
      isRequired: true
    },
    {
      courseCode: 'EDU105',
      courseName: 'اللغة العربية',
      credits: 2,
      semester: 1,
      academicYear: 1,
      isRequired: true
    },
    {
      courseCode: 'EDU106',
      courseName: 'اللغة الإنجليزية',
      credits: 2,
      semester: 1,
      academicYear: 1,
      isRequired: true
    },
    
    // السنة الأولى - الفصل الثاني
    {
      courseCode: 'EDU107',
      courseName: 'مناهج وطرق تدريس رياض الأطفال',
      credits: 3,
      semester: 2,
      academicYear: 1,
      isRequired: true,
      prerequisites: ['EDU101', 'EDU103']
    },
    {
      courseCode: 'EDU108',
      courseName: 'علم نفس النمو',
      credits: 3,
      semester: 2,
      academicYear: 1,
      isRequired: true,
      prerequisites: ['EDU102']
    },
    {
      courseCode: 'EDU109',
      courseName: 'التربية الإسلامية',
      credits: 2,
      semester: 2,
      academicYear: 1,
      isRequired: true
    },
    {
      courseCode: 'EDU110',
      courseName: 'الحاسوب في التعليم',
      credits: 2,
      semester: 2,
      academicYear: 1,
      isRequired: true,
      prerequisites: ['EDU104']
    },
    {
      courseCode: 'EDU111',
      courseName: 'التربية الصحية',
      credits: 2,
      semester: 2,
      academicYear: 1,
      isRequired: true
    },
    
    // السنة الثانية - الفصل الأول
    {
      courseCode: 'EDU201',
      courseName: 'مناهج وطرق تدريس اللغة العربية',
      credits: 3,
      semester: 3,
      academicYear: 2,
      isRequired: true,
      prerequisites: ['EDU105', 'EDU107']
    },
    {
      courseCode: 'EDU202',
      courseName: 'مناهج وطرق تدريس الرياضيات',
      credits: 3,
      semester: 3,
      academicYear: 2,
      isRequired: true,
      prerequisites: ['EDU107']
    },
    {
      courseCode: 'EDU203',
      courseName: 'مناهج وطرق تدريس العلوم',
      credits: 3,
      semester: 3,
      academicYear: 2,
      isRequired: true,
      prerequisites: ['EDU107']
    },
    {
      courseCode: 'EDU204',
      courseName: 'التربية الفنية',
      credits: 2,
      semester: 3,
      academicYear: 2,
      isRequired: true
    },
    {
      courseCode: 'EDU205',
      courseName: 'التربية الموسيقية',
      credits: 2,
      semester: 3,
      academicYear: 2,
      isRequired: true
    },
    
    // السنة الثانية - الفصل الثاني
    {
      courseCode: 'EDU206',
      courseName: 'مناهج وطرق تدريس الدراسات الاجتماعية',
      credits: 3,
      semester: 4,
      academicYear: 2,
      isRequired: true,
      prerequisites: ['EDU107']
    },
    {
      courseCode: 'EDU207',
      courseName: 'مناهج وطرق تدريس اللغة الإنجليزية',
      credits: 3,
      semester: 4,
      academicYear: 2,
      isRequired: true,
      prerequisites: ['EDU106', 'EDU107']
    },
    {
      courseCode: 'EDU208',
      courseName: 'التربية البدنية',
      credits: 2,
      semester: 4,
      academicYear: 2,
      isRequired: true
    },
    {
      courseCode: 'EDU209',
      courseName: 'الإرشاد التربوي',
      credits: 2,
      semester: 4,
      academicYear: 2,
      isRequired: true,
      prerequisites: ['EDU102', 'EDU108']
    },
    
    // السنة الثالثة - الفصل الأول
    {
      courseCode: 'EDU301',
      courseName: 'التقويم التربوي',
      credits: 3,
      semester: 5,
      academicYear: 3,
      isRequired: true,
      prerequisites: ['EDU102', 'EDU103']
    },
    {
      courseCode: 'EDU302',
      courseName: 'إدارة الفصل الدراسي',
      credits: 3,
      semester: 5,
      academicYear: 3,
      isRequired: true,
      prerequisites: ['EDU103', 'EDU107']
    },
    {
      courseCode: 'EDU303',
      courseName: 'التعليم التعاوني',
      credits: 2,
      semester: 5,
      academicYear: 3,
      isRequired: true,
      prerequisites: ['EDU107']
    },
    {
      courseCode: 'EDU304',
      courseName: 'التعليم الإلكتروني',
      credits: 2,
      semester: 5,
      academicYear: 3,
      isRequired: true,
      prerequisites: ['EDU104', 'EDU110']
    },
    
    // السنة الثالثة - الفصل الثاني
    {
      courseCode: 'EDU305',
      courseName: 'التدريب الميداني',
      credits: 6,
      semester: 6,
      academicYear: 3,
      isRequired: true,
      prerequisites: ['EDU301', 'EDU302']
    },
    {
      courseCode: 'EDU306',
      courseName: 'مشروع التخرج',
      credits: 3,
      semester: 6,
      academicYear: 3,
      isRequired: true,
      prerequisites: ['EDU301']
    },
    
    // السنة الرابعة - الفصل الأول
    {
      courseCode: 'EDU401',
      courseName: 'التدريب الميداني المتقدم',
      credits: 6,
      semester: 7,
      academicYear: 4,
      isRequired: true,
      prerequisites: ['EDU305']
    },
    {
      courseCode: 'EDU402',
      courseName: 'مشروع التخرج النهائي',
      credits: 3,
      semester: 7,
      academicYear: 4,
      isRequired: true,
      prerequisites: ['EDU306']
    },
    
    // السنة الرابعة - الفصل الثاني
    {
      courseCode: 'EDU403',
      courseName: 'التدريب الميداني النهائي',
      credits: 6,
      semester: 8,
      academicYear: 4,
      isRequired: true,
      prerequisites: ['EDU401']
    },
    {
      courseCode: 'EDU404',
      courseName: 'مشروع التخرج النهائي',
      credits: 3,
      semester: 8,
      academicYear: 4,
      isRequired: true,
      prerequisites: ['EDU402']
    }
  ],
  
  rules: [
    {
      id: 'gpa-warning-1',
      title: 'تحذير GPA منخفض',
      description: 'المعدل التراكمي أقل من 2.0',
      type: 'warning',
      conditions: {
        minGPA: 2.0
      },
      consequences: [
        'عدم القدرة على التخرج',
        'الحاجة لرفع المعدل التراكمي'
      ],
      recommendations: [
        'ركز على المواد الأساسية لرفع المعدل',
        'احصل على درجات عالية في المواد القادمة',
        'استشر المرشد الأكاديمي'
      ]
    },
    {
      id: 'gpa-warning-2',
      title: 'تحذير GPA حرج',
      description: 'المعدل التراكمي أقل من 1.5',
      type: 'warning',
      conditions: {
        minGPA: 1.5
      },
      consequences: [
        'خطر الفصل الأكاديمي',
        'الحاجة لتحسين فوري'
      ],
      recommendations: [
        'راجع جميع المواد الراسبة',
        'احصل على مساعدة أكاديمية',
        'قلل عدد المواد المسجلة'
      ]
    },
    {
      id: 'failure-limit',
      title: 'حد الفشل المسموح',
      description: 'عدد مرات الفشل في المواد',
      type: 'warning',
      conditions: {
        maxFailures: 3
      },
      consequences: [
        'خطر الفصل الأكاديمي',
        'الحاجة لخطة استرداد'
      ],
      recommendations: [
        'راجع المواد الراسبة بعناية',
        'احصل على دروس خصوصية',
        'استشر المرشد الأكاديمي'
      ]
    },
    {
      id: 'prerequisites',
      title: 'متطلبات سابقة',
      description: 'ضرورة إكمال المتطلبات السابقة',
      type: 'requirement',
      conditions: {},
      consequences: [
        'عدم القدرة على التسجيل في المواد المتقدمة'
      ],
      recommendations: [
        'أكمل جميع المتطلبات السابقة أولاً',
        'راجع خطة الدراسة',
        'استشر المرشد الأكاديمي'
      ]
    },
    {
      id: 'graduation-requirements',
      title: 'متطلبات التخرج',
      description: 'إكمال جميع متطلبات التخرج',
      type: 'graduation',
      conditions: {
        minGPA: 2.0,
        requiredCourses: ['EDU305', 'EDU306', 'EDU401', 'EDU402', 'EDU403', 'EDU404']
      },
      consequences: [
        'عدم القدرة على التخرج'
      ],
      recommendations: [
        'أكمل جميع المواد المطلوبة',
        'احصل على المعدل المطلوب للتخرج',
        'أكمل مشروع التخرج'
      ]
    }
  ]
};

// قائمة جميع اللوائح المتاحة
export const AVAILABLE_REGULATIONS: CurriculumRegulation[] = [
  CHILDHOOD_CURRICULUM
];

// دالة للحصول على لائحة معينة
export function getRegulationById(id: string): CurriculumRegulation | null {
  return AVAILABLE_REGULATIONS.find(regulation => regulation.id === id) || null;
}

// دالة للحصول على جميع اللوائح
export function getAllRegulations(): CurriculumRegulation[] {
  return AVAILABLE_REGULATIONS;
} 