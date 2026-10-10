// التقويم الأكاديمي - جامعة الإسكندرية - كلية التربية

export interface AcademicEvent {
  id: string;
  title: string;
  arabicTitle: string;
  description: string;
  date: string;
  endDate?: string;
  type: 'registration' | 'exam' | 'project' | 'library' | 'office' | 'holiday' | 'event';
  priority: 'high' | 'medium' | 'low';
  location?: string;
  contact?: string;
  requirements?: string[];
  notes?: string;
}

export interface Semester {
  name: string;
  startDate: string;
  endDate: string;
  events: AcademicEvent[];
}

// الفصل الدراسي الأول 2024/2025
export const firstSemester: Semester = {
  name: 'الفصل الدراسي الأول 2024/2025',
  startDate: '2024-09-15',
  endDate: '2025-01-15',
  events: [
    {
      id: '1',
      title: 'Registration Period',
      arabicTitle: 'فترة التسجيل',
      description: 'بداية التسجيل للمقررات الدراسية للفصل الأول',
      date: '2024-09-01',
      endDate: '2024-09-10',
      type: 'registration',
      priority: 'high',
      location: 'مكتب التسجيل - كلية التربية',
      contact: 'تليفون: 03-4871234',
      requirements: ['بطاقة الطالب', 'الجدول الدراسي', 'الموافقة الأكاديمية'],
      notes: 'يجب إكمال التسجيل قبل نهاية الفترة المحددة'
    },
    {
      id: '2',
      title: 'Classes Begin',
      arabicTitle: 'بداية المحاضرات',
      description: 'بداية المحاضرات والدروس للفصل الدراسي الأول',
      date: '2024-09-15',
      type: 'event',
      priority: 'high',
      notes: 'تأكد من حضور المحاضرة الأولى لكل مقرر'
    },
    {
      id: '3',
      title: 'Add/Drop Period',
      arabicTitle: 'فترة الإضافة والحذف',
      description: 'فترة تعديل الجدول الدراسي (إضافة أو حذف مقررات)',
      date: '2024-09-16',
      endDate: '2024-09-25',
      type: 'registration',
      priority: 'medium',
      location: 'مكتب التسجيل',
      contact: 'تليفون: 03-4871234',
      notes: 'يمكن تعديل الجدول خلال هذه الفترة فقط'
    },
    {
      id: '4',
      title: 'Midterm Exams',
      arabicTitle: 'امتحانات منتصف الفصل',
      description: 'امتحانات منتصف الفصل الدراسي',
      date: '2024-11-01',
      endDate: '2024-11-15',
      type: 'exam',
      priority: 'high',
      location: 'قاعات الامتحانات',
      notes: 'تحقق من جدول الامتحانات لكل مقرر'
    },
    {
      id: '5',
      title: 'Project Submission Deadline',
      arabicTitle: 'موعد تسليم المشاريع',
      description: 'آخر موعد لتسليم المشاريع والبحوث',
      date: '2024-12-01',
      type: 'project',
      priority: 'high',
      location: 'مكاتب المدرسين',
      notes: 'تأكد من اتباع معايير التنسيق المطلوبة'
    },
    {
      id: '6',
      title: 'Final Exams',
      arabicTitle: 'الامتحانات النهائية',
      description: 'امتحانات نهاية الفصل الدراسي',
      date: '2024-12-20',
      endDate: '2025-01-10',
      type: 'exam',
      priority: 'high',
      location: 'قاعات الامتحانات',
      notes: 'تحقق من جدول الامتحانات النهائية'
    },
    {
      id: '7',
      title: 'Office Hours - Dr. Ahmed',
      arabicTitle: 'ساعات المكتب الإرشادي - د. أحمد',
      description: 'ساعات المكتب الإرشادي للدكتور أحمد محمد',
      date: '2024-09-20',
      type: 'office',
      priority: 'medium',
      location: 'مكتب 201 - الدور الثاني',
      contact: 'د. أحمد محمد - تليفون: 03-4871235',
      notes: 'الأحد والثلاثاء 10:00-12:00'
    },
    {
      id: '8',
      title: 'Library Orientation',
      arabicTitle: 'تعريف بالمكتبة',
      description: 'جولة تعريفية بمكتبة كلية التربية وخدماتها',
      date: '2024-09-25',
      type: 'library',
      priority: 'low',
      location: 'مكتبة كلية التربية',
      contact: 'أمين المكتبة - تليفون: 03-4871236',
      notes: 'مفيد للطلاب الجدد'
    }
  ]
};

// الفصل الدراسي الثاني 2024/2025
export const secondSemester: Semester = {
  name: 'الفصل الدراسي الثاني 2024/2025',
  startDate: '2025-02-15',
  endDate: '2025-06-15',
  events: [
    {
      id: '9',
      title: 'Registration Period',
      arabicTitle: 'فترة التسجيل',
      description: 'بداية التسجيل للمقررات الدراسية للفصل الثاني',
      date: '2025-02-01',
      endDate: '2025-02-10',
      type: 'registration',
      priority: 'high',
      location: 'مكتب التسجيل - كلية التربية',
      contact: 'تليفون: 03-4871234',
      requirements: ['بطاقة الطالب', 'الجدول الدراسي', 'الموافقة الأكاديمية'],
      notes: 'يجب إكمال التسجيل قبل نهاية الفترة المحددة'
    },
    {
      id: '10',
      title: 'Classes Begin',
      arabicTitle: 'بداية المحاضرات',
      description: 'بداية المحاضرات والدروس للفصل الدراسي الثاني',
      date: '2025-02-15',
      type: 'event',
      priority: 'high',
      notes: 'تأكد من حضور المحاضرة الأولى لكل مقرر'
    },
    {
      id: '11',
      title: 'Midterm Exams',
      arabicTitle: 'امتحانات منتصف الفصل',
      description: 'امتحانات منتصف الفصل الدراسي',
      date: '2025-04-01',
      endDate: '2025-04-15',
      type: 'exam',
      priority: 'high',
      location: 'قاعات الامتحانات',
      notes: 'تحقق من جدول الامتحانات لكل مقرر'
    },
    {
      id: '12',
      title: 'Final Exams',
      arabicTitle: 'الامتحانات النهائية',
      description: 'امتحانات نهاية الفصل الدراسي',
      date: '2025-05-20',
      endDate: '2025-06-10',
      type: 'exam',
      priority: 'high',
      location: 'قاعات الامتحانات',
      notes: 'تحقق من جدول الامتحانات النهائية'
    }
  ]
};

// الفصل الصيفي 2025
export const summerSemester: Semester = {
  name: 'الفصل الصيفي 2025',
  startDate: '2025-07-01',
  endDate: '2025-08-31',
  events: [
    {
      id: '13',
      title: 'Summer Registration',
      arabicTitle: 'التسجيل الصيفي',
      description: 'التسجيل للمقررات الصيفية',
      date: '2025-06-15',
      endDate: '2025-06-25',
      type: 'registration',
      priority: 'high',
      location: 'مكتب التسجيل',
      notes: 'المقررات الصيفية مكثفة ومختصرة'
    },
    {
      id: '14',
      title: 'Summer Classes Begin',
      arabicTitle: 'بداية المحاضرات الصيفية',
      description: 'بداية المحاضرات للفصل الصيفي',
      date: '2025-07-01',
      type: 'event',
      priority: 'high',
      notes: 'الجدول الصيفي مكثف'
    },
    {
      id: '15',
      title: 'Summer Final Exams',
      arabicTitle: 'الامتحانات النهائية الصيفية',
      description: 'امتحانات نهاية الفصل الصيفي',
      date: '2025-08-20',
      endDate: '2025-08-31',
      type: 'exam',
      priority: 'high',
      location: 'قاعات الامتحانات',
      notes: 'امتحانات مكثفة'
    }
  ]
};

// جميع الفصول الدراسية
export const allSemesters: Semester[] = [firstSemester, secondSemester, summerSemester];

// دوال مساعدة
export const getUpcomingEvents = (days: number = 30): AcademicEvent[] => {
  const today = new Date();
  const upcomingEvents: AcademicEvent[] = [];
  
  allSemesters.forEach(semester => {
    semester.events.forEach(event => {
      const eventDate = new Date(event.date);
      const diffTime = eventDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= 0 && diffDays <= days) {
        upcomingEvents.push(event);
      }
    });
  });
  
  return upcomingEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getEventsByType = (type: AcademicEvent['type']): AcademicEvent[] => {
  const events: AcademicEvent[] = [];
  
  allSemesters.forEach(semester => {
    semester.events.forEach(event => {
      if (event.type === type) {
        events.push(event);
      }
    });
  });
  
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const getEventsByPriority = (priority: AcademicEvent['priority']): AcademicEvent[] => {
  const events: AcademicEvent[] = [];
  
  allSemesters.forEach(semester => {
    semester.events.forEach(event => {
      if (event.priority === priority) {
        events.push(event);
      }
    });
  });
  
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const searchEvents = (query: string): AcademicEvent[] => {
  const lowerQuery = query.toLowerCase();
  const events: AcademicEvent[] = [];
  
  allSemesters.forEach(semester => {
    semester.events.forEach(event => {
      if (
        event.title.toLowerCase().includes(lowerQuery) ||
        event.arabicTitle.includes(query) ||
        event.description.includes(query)
      ) {
        events.push(event);
      }
    });
  });
  
  return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// تحويل نوع الحدث إلى نص عربي
export const getEventTypeArabic = (type: AcademicEvent['type']): string => {
  const types = {
    registration: 'تسجيل',
    exam: 'امتحان',
    project: 'مشروع',
    library: 'مكتبة',
    office: 'مكتب إرشادي',
    holiday: 'إجازة',
    event: 'فعالية'
  };
  return types[type];
};

// تحويل الأولوية إلى نص عربي
export const getPriorityArabic = (priority: AcademicEvent['priority']): string => {
  const priorities = {
    high: 'عالية',
    medium: 'متوسطة',
    low: 'منخفضة'
  };
  return priorities[priority];
}; 