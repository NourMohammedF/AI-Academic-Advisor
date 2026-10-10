// حاسبة المعدل التراكمي - جامعة الإسكندرية

export interface Grade {
  courseCode: string;
  courseName: string;
  credits: number;
  grade: string;
  gradePoints: number;
  semester: string;
  year: number;
}

export interface GPAResult {
  totalCredits: number;
  totalGradePoints: number;
  gpa: number;
  letterGrade: string;
  status: string;
  courses: Grade[];
  semesterGPA?: number;
  cumulativeGPA?: number;
}

// نظام الدرجات في جامعة الإسكندرية
export const gradeScale = {
  'A+': { points: 4.0, percentage: 95, description: 'ممتاز' },
  'A': { points: 3.7, percentage: 90, description: 'ممتاز' },
  'A-': { points: 3.3, percentage: 85, description: 'جيد جداً' },
  'B+': { points: 3.0, percentage: 80, description: 'جيد جداً' },
  'B': { points: 2.7, percentage: 75, description: 'جيد جداً' },
  'B-': { points: 2.3, percentage: 70, description: 'جيد' },
  'C+': { points: 2.0, percentage: 65, description: 'جيد' },
  'C': { points: 1.7, percentage: 60, description: 'جيد' },
  'C-': { points: 1.3, percentage: 55, description: 'مقبول' },
  'D+': { points: 1.0, percentage: 50, description: 'مقبول' },
  'D': { points: 0.7, percentage: 45, description: 'مقبول' },
  'F': { points: 0.0, percentage: 0, description: 'راسب' }
};

// حساب نقاط الدرجة
export const getGradePoints = (grade: string): number => {
  const gradeUpper = grade.toUpperCase();
  return gradeScale[gradeUpper as keyof typeof gradeScale]?.points || 0;
};

// حساب المعدل التراكمي
export const calculateGPA = (grades: Grade[]): GPAResult => {
  if (grades.length === 0) {
    return {
      totalCredits: 0,
      totalGradePoints: 0,
      gpa: 0,
      letterGrade: 'N/A',
      status: 'لا توجد درجات',
      courses: []
    };
  }

  let totalCredits = 0;
  let totalGradePoints = 0;

  grades.forEach(grade => {
    const gradePoints = getGradePoints(grade.grade);
    totalCredits += grade.credits;
    totalGradePoints += grade.credits * gradePoints;
  });

  const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

  return {
    totalCredits,
    totalGradePoints,
    gpa: Math.round(gpa * 100) / 100, // تقريب لرقمين عشريين
    letterGrade: getLetterGrade(gpa),
    status: getAcademicStatus(gpa),
    courses: grades
  };
};

// تحويل المعدل إلى درجة حرفية
export const getLetterGrade = (gpa: number): string => {
  if (gpa >= 3.7) return 'A';
  if (gpa >= 3.3) return 'A-';
  if (gpa >= 3.0) return 'B+';
  if (gpa >= 2.7) return 'B';
  if (gpa >= 2.3) return 'B-';
  if (gpa >= 2.0) return 'C+';
  if (gpa >= 1.7) return 'C';
  if (gpa >= 1.3) return 'C-';
  if (gpa >= 1.0) return 'D+';
  if (gpa >= 0.7) return 'D';
  return 'F';
};

// تحديد الحالة الأكاديمية
export const getAcademicStatus = (gpa: number): string => {
  if (gpa >= 3.5) return 'متفوق';
  if (gpa >= 3.0) return 'ممتاز';
  if (gpa >= 2.5) return 'جيد جداً';
  if (gpa >= 2.0) return 'جيد';
  if (gpa >= 1.5) return 'مقبول';
  if (gpa >= 1.0) return 'تحذير أكاديمي';
  return 'فصل أكاديمي';
};

// حساب المعدل الفصلي
export const calculateSemesterGPA = (grades: Grade[], semester: string, year: number): number => {
  const semesterGrades = grades.filter(grade => 
    grade.semester === semester && grade.year === year
  );
  
  if (semesterGrades.length === 0) return 0;

  let totalCredits = 0;
  let totalGradePoints = 0;

  semesterGrades.forEach(grade => {
    const gradePoints = getGradePoints(grade.grade);
    totalCredits += grade.credits;
    totalGradePoints += grade.credits * gradePoints;
  });

  return totalCredits > 0 ? Math.round((totalGradePoints / totalCredits) * 100) / 100 : 0;
};

// تحليل الأداء الأكاديمي
export const analyzePerformance = (grades: Grade[]): string[] => {
  const analysis: string[] = [];
  const gpaResult = calculateGPA(grades);

  // تحليل المعدل العام
  if (gpaResult.gpa >= 3.5) {
    analysis.push('🎓 أداء ممتاز! أنت في الطريق الصحيح للتفوق الأكاديمي');
  } else if (gpaResult.gpa >= 3.0) {
    analysis.push('⭐ أداء جيد جداً، استمر في العمل الجاد');
  } else if (gpaResult.gpa >= 2.5) {
    analysis.push('📚 أداء جيد، يمكنك التحسين أكثر');
  } else if (gpaResult.gpa >= 2.0) {
    analysis.push('⚠️ أداء مقبول، تحتاج للمزيد من الجهد');
  } else {
    analysis.push('🚨 أداء ضعيف، تحتاج لمراجعة شاملة لاستراتيجيات الدراسة');
  }

  // تحليل المقررات
  const failedCourses = grades.filter(grade => grade.grade === 'F');
  if (failedCourses.length > 0) {
    analysis.push(`❌ لديك ${failedCourses.length} مقرر راسب، تحتاج لإعادة دراستها`);
  }

  const excellentGrades = grades.filter(grade => 
    ['A+', 'A', 'A-'].includes(grade.grade.toUpperCase())
  );
  if (excellentGrades.length > 0) {
    analysis.push(`🌟 ممتاز! لديك ${excellentGrades.length} مقرر بدرجة ممتازة`);
  }

  // نصائح للتحسين
  if (gpaResult.gpa < 3.0) {
    analysis.push('💡 نصائح للتحسين:');
    analysis.push('   • راجع مع المدرسين في أوقات المكتب الإرشادي');
    analysis.push('   • انضم لمجموعات الدراسة');
    analysis.push('   • استخدم موارد المكتبة الإضافية');
    analysis.push('   • نظم وقت الدراسة بشكل أفضل');
  }

  return analysis;
};

// توقع الأداء المستقبلي
export const predictFuturePerformance = (grades: Grade[]): string => {
  const gpaResult = calculateGPA(grades);
  
  if (grades.length < 3) {
    return '📊 تحتاج لمزيد من الدرجات لتوقع أداء دقيق';
  }

  // حساب اتجاه الأداء
  const recentGrades = grades.slice(-3);
  const recentGPA = calculateGPA(recentGrades).gpa;
  
  if (recentGPA > gpaResult.gpa + 0.3) {
    return '📈 أداؤك في تحسن مستمر! استمر في هذا الاتجاه';
  } else if (recentGPA < gpaResult.gpa - 0.3) {
    return '📉 أداؤك في تراجع، تحتاج لمراجعة استراتيجيات الدراسة';
  } else {
    return '➡️ أداؤك مستقر، يمكنك التحسين أكثر';
  }
};

// حساب الساعات المتبقية للتخرج
export const calculateRemainingCredits = (completedCredits: number, totalRequired: number = 132): {
  remaining: number;
  semesters: number;
  message: string;
} => {
  const remaining = Math.max(0, totalRequired - completedCredits);
  const semesters = Math.ceil(remaining / 18); // متوسط 18 ساعة في الفصل

  let message = '';
  if (remaining === 0) {
    message = '🎓 مبروك! أكملت جميع الساعات المطلوبة للتخرج';
  } else if (remaining <= 18) {
    message = `🎯 باقي ${remaining} ساعة فقط! فصل دراسي واحد للتخرج`;
  } else {
    message = `📚 باقي ${remaining} ساعة، تحتاج تقريباً ${semesters} فصول دراسية`;
  }

  return { remaining, semesters, message };
}; 