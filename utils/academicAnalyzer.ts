import { 
  CurriculumRegulation, 
  CourseRequirement, 
  AcademicRule 
} from '../data/curriculumRegulations';
import { 
  StudentProfile, 
  CourseGrade, 
  AcademicAnalysis,
  getFailedCourses,
  getCompletedCourses
} from '../data/studentData';

// دالة حساب GPA محسنة للتعامل مع CourseGrade
function calculateGPA(grades: CourseGrade[]): number {
  if (grades.length === 0) return 0;
  
  let totalPoints = 0;
  let totalCredits = 0;
  
  grades.forEach(grade => {
    if (grade.isPassed) {
      const points = grade.grade >= 90 ? 4.0 :
                    grade.grade >= 85 ? 3.7 :
                    grade.grade >= 80 ? 3.3 :
                    grade.grade >= 75 ? 3.0 :
                    grade.grade >= 70 ? 2.7 :
                    grade.grade >= 65 ? 2.3 :
                    grade.grade >= 60 ? 2.0 :
                    grade.grade >= 55 ? 1.7 :
                    grade.grade >= 50 ? 1.3 : 0.0;
      
      totalPoints += points * grade.credits;
      totalCredits += grade.credits;
    }
  });
  
  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

export interface CourseRecommendation {
  courseCode: string;
  courseName: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  prerequisites: string[];
  semester: number;
  academicYear: number;
}

export interface GPAImprovementPlan {
  currentGPA: number;
  targetGPA: number;
  requiredGrades: { [courseCode: string]: number };
  coursesToFocus: string[];
  recommendations: string[];
}

export interface GraduationPlan {
  remainingCredits: number;
  remainingSemesters: number;
  coursesPerSemester: CourseRequirement[][];
  estimatedGraduationDate: string;
  risks: string[];
  recommendations: string[];
}

// دالة التحليل الأكاديمي الرئيسية
export function analyzeStudentAcademicStatus(
  student: StudentProfile,
  regulation: CurriculumRegulation
): AcademicAnalysis {
  const analysis: AcademicAnalysis = {
    studentId: student.id,
    regulationId: regulation.id,
    analysisDate: new Date(),
    currentGPA: student.gpa,
    targetGPA: regulation.minGPAForGraduation,
    gpaToGraduate: regulation.minGPAForGraduation,
    completedCourses: getCompletedCourses(student.grades).map(c => c.courseCode),
    failedCourses: getFailedCourses(student.grades).map(c => c.courseCode),
    remainingCourses: getRemainingCourses(student, regulation),
    prerequisitesViolations: checkPrerequisitesViolations(student, regulation),
    warnings: generateWarnings(student, regulation),
    recommendations: generateRecommendations(student, regulation)
  };

  return analysis;
}

// دالة للحصول على المواد المتبقية
export function getRemainingCourses(
  student: StudentProfile,
  regulation: CurriculumRegulation
): string[] {
  const completedCourseCodes = student.grades
    .filter(grade => grade.isPassed)
    .map(grade => grade.courseCode);

  // البحث عن المواد المتبقية في اللائحة فقط
  return regulation.courses
    .filter(course => !completedCourseCodes.includes(course.courseCode))
    .map(course => course.courseCode);
}

// دالة للتحقق من انتهاكات المتطلبات السابقة
export function checkPrerequisitesViolations(
  student: StudentProfile,
  regulation: CurriculumRegulation
): string[] {
  const violations: string[] = [];
  const completedCourseCodes = student.grades
    .filter(grade => grade.isPassed)
    .map(grade => grade.courseCode);

  regulation.courses.forEach(course => {
    if (course.prerequisites) {
      const missingPrerequisites = course.prerequisites.filter(
        prereq => !completedCourseCodes.includes(prereq)
      );
      
      if (missingPrerequisites.length > 0) {
        violations.push(
          `${course.courseCode} (${course.courseName}): يحتاج ${missingPrerequisites.join(', ')}`
        );
      }
    }
  });

  return violations;
}

// دالة لتوليد التحذيرات
export function generateWarnings(
  student: StudentProfile,
  regulation: CurriculumRegulation
): AcademicAnalysis['warnings'] {
  const warnings: AcademicAnalysis['warnings'] = [];

  // تحذيرات GPA
  if (student.gpa < regulation.minGPAForGraduation) {
    warnings.push({
      type: 'gpa',
      title: 'تحذير GPA منخفض',
      description: `المعدل التراكمي الحالي (${student.gpa.toFixed(2)}) أقل من المطلوب للتخرج (${regulation.minGPAForGraduation})`,
      severity: student.gpa < 1.5 ? 'critical' : student.gpa < 2.0 ? 'high' : 'medium',
      recommendations: [
        'ركز على المواد الأساسية لرفع المعدل',
        'احصل على درجات عالية في المواد القادمة',
        'استشر المرشد الأكاديمي'
      ]
    });
  }

  // تحذيرات الفشل
  const failedCourses = getFailedCourses(student.grades);
  if (failedCourses.length >= regulation.maxFailuresAllowed) {
    warnings.push({
      type: 'failures',
      title: 'تحذير عدد المواد الراسبة',
      description: `عدد المواد الراسبة (${failedCourses.length}) وصل للحد الأقصى المسموح (${regulation.maxFailuresAllowed})`,
      severity: 'high',
      recommendations: [
        'راجع جميع المواد الراسبة بعناية',
        'احصل على مساعدة أكاديمية',
        'قلل عدد المواد المسجلة'
      ]
    });
  }

  // تحذيرات المتطلبات السابقة
  const violations = checkPrerequisitesViolations(student, regulation);
  if (violations.length > 0) {
    warnings.push({
      type: 'prerequisites',
      title: 'تحذير المتطلبات السابقة',
      description: `لديك ${violations.length} انتهاك للمتطلبات السابقة`,
      severity: 'medium',
      recommendations: [
        'أكمل جميع المتطلبات السابقة أولاً',
        'راجع خطة الدراسة',
        'استشر المرشد الأكاديمي'
      ]
    });
  }

  return warnings;
}

// دالة لتوليد التوصيات
export function generateRecommendations(
  student: StudentProfile,
  regulation: CurriculumRegulation
): AcademicAnalysis['recommendations'] {
  const recommendations: AcademicAnalysis['recommendations'] = [];

  // توصيات اختيار المواد
  const courseRecommendations = getCourseRecommendations(student, regulation);
  if (courseRecommendations.length > 0) {
    recommendations.push({
      type: 'course_selection',
      title: 'توصيات اختيار المواد',
      description: 'المواد المقترحة للتسجيل في الفصل القادم',
      priority: 'high',
      courses: courseRecommendations.map(c => c.courseCode)
    });
  }

  // توصيات تحسين GPA
  if (student.gpa < regulation.minGPAForGraduation) {
    const gpaPlan = createGPAImprovementPlan(student, regulation);
    recommendations.push({
      type: 'gpa_improvement',
      title: 'خطة تحسين المعدل التراكمي',
      description: `لرفع المعدل من ${student.gpa.toFixed(2)} إلى ${regulation.minGPAForGraduation}`,
      priority: 'high'
    });
  }

  // توصيات خطة التخرج
  const graduationPlan = createGraduationPlan(student, regulation);
  recommendations.push({
    type: 'graduation_plan',
    title: 'خطة التخرج',
    description: `إكمال ${graduationPlan.remainingCredits} ساعة معتمدة في ${graduationPlan.remainingSemesters} فصول دراسية`,
    priority: 'medium'
  });

  return recommendations;
}

// دالة للحصول على توصيات المواد
export function getCourseRecommendations(
  student: StudentProfile,
  regulation: CurriculumRegulation
): CourseRecommendation[] {
  const completedCourseCodes = student.grades
    .filter(grade => grade.isPassed)
    .map(grade => grade.courseCode);

  const recommendations: CourseRecommendation[] = [];

  regulation.courses.forEach(course => {
    // تحقق من أن المادة لم تكتمل بعد
    if (completedCourseCodes.includes(course.courseCode)) {
      return;
    }

    // تحقق من المتطلبات السابقة
    const prerequisitesMet = !course.prerequisites || 
      course.prerequisites.every(prereq => completedCourseCodes.includes(prereq));

    if (prerequisitesMet) {
      const priority = determineCoursePriority(course, student, regulation);
      
      recommendations.push({
        courseCode: course.courseCode,
        courseName: course.courseName,
        priority,
        reason: getCourseRecommendationReason(course, student, regulation),
        prerequisites: course.prerequisites || [],
        semester: course.semester,
        academicYear: course.academicYear
      });
    }
  });

  // ترتيب التوصيات حسب الأولوية
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

// دالة لتحديد أولوية المادة
export function determineCoursePriority(
  course: CourseRequirement,
  student: StudentProfile,
  regulation: CurriculumRegulation
): 'high' | 'medium' | 'low' {
  // المواد الأساسية للتخرج لها أولوية عالية
  if (course.courseCode.includes('EDU305') || 
      course.courseCode.includes('EDU306') ||
      course.courseCode.includes('EDU401') ||
      course.courseCode.includes('EDU402') ||
      course.courseCode.includes('EDU403') ||
      course.courseCode.includes('EDU404')) {
    return 'high';
  }

  // المواد في الفصل الحالي أو التالي لها أولوية عالية
  if (course.semester <= student.currentSemester + 1) {
    return 'high';
  }

  // المواد في الفصول القادمة لها أولوية متوسطة
  if (course.semester <= student.currentSemester + 2) {
    return 'medium';
  }

  return 'low';
}

// دالة للحصول على سبب التوصية
export function getCourseRecommendationReason(
  course: CourseRequirement,
  student: StudentProfile,
  regulation: CurriculumRegulation
): string {
  if (course.courseCode.includes('EDU305') || course.courseCode.includes('EDU306')) {
    return 'مادة أساسية للتخرج - التدريب الميداني';
  }

  if (course.courseCode.includes('EDU401') || course.courseCode.includes('EDU402')) {
    return 'مادة أساسية للتخرج - مشروع التخرج';
  }

  if (course.semester <= student.currentSemester) {
    return 'مادة متأخرة - يجب إكمالها فوراً';
  }

  if (course.semester === student.currentSemester + 1) {
    return 'مادة للفصل القادم - متطلبات سابقة مكتملة';
  }

  return 'مادة في الخطة الدراسية';
}

// دالة لإنشاء خطة تحسين GPA
export function createGPAImprovementPlan(
  student: StudentProfile,
  regulation: CurriculumRegulation
): GPAImprovementPlan {
  const currentGPA = student.gpa;
  const targetGPA = regulation.minGPAForGraduation;
  const remainingCredits = regulation.totalCredits - student.completedCredits;
  
  // حساب الدرجات المطلوبة لرفع GPA
  const requiredGrades: { [courseCode: string]: number } = {};
  const coursesToFocus: string[] = [];
  
  // المواد الراسبة - إعادة دراستها
  const failedCourses = getFailedCourses(student.grades);
  failedCourses.forEach(course => {
    requiredGrades[course.courseCode] = 85; // درجة عالية لرفع المعدل
    coursesToFocus.push(course.courseCode);
  });

  // المواد القادمة - التركيز على الدرجات العالية
  const upcomingCourses = getCourseRecommendations(student, regulation)
    .filter(c => c.priority === 'high')
    .slice(0, 5); // أول 5 مواد

  upcomingCourses.forEach(course => {
    requiredGrades[course.courseCode] = 80; // درجة جيدة جداً
    coursesToFocus.push(course.courseCode);
  });

  const recommendations = [
    'راجع المواد الراسبة بعناية',
    'احصل على درجات عالية في المواد القادمة',
    'استشر المرشد الأكاديمي',
    'احصل على مساعدة أكاديمية إذا لزم الأمر'
  ];

  return {
    currentGPA,
    targetGPA,
    requiredGrades,
    coursesToFocus,
    recommendations
  };
}

// دالة لإنشاء خطة التخرج
export function createGraduationPlan(
  student: StudentProfile,
  regulation: CurriculumRegulation
): GraduationPlan {
  const remainingCredits = regulation.totalCredits - student.completedCredits;
  const remainingSemesters = regulation.maxSemesters - student.currentSemester;
  const creditsPerSemester = Math.ceil(remainingCredits / remainingSemesters);

  // توزيع المواد على الفصول المتبقية
  const coursesPerSemester: CourseRequirement[][] = [];
  const remainingCourses = regulation.courses.filter(course => 
    !student.grades.some(grade => grade.courseCode === course.courseCode && grade.isPassed)
  );

  for (let semester = student.currentSemester + 1; semester <= regulation.maxSemesters; semester++) {
    const semesterCourses = remainingCourses.filter(course => 
      course.semester === semester && 
      course.prerequisites?.every(prereq => 
        student.grades.some(grade => grade.courseCode === prereq && grade.isPassed)
      )
    );
    coursesPerSemester.push(semesterCourses);
  }

  // حساب تاريخ التخرج المتوقع
  const currentDate = new Date();
  const graduationDate = new Date(currentDate);
  graduationDate.setMonth(graduationDate.getMonth() + (remainingSemesters * 6)); // 6 أشهر لكل فصل

  const risks: string[] = [];
  if (student.gpa < regulation.minGPAForGraduation) {
    risks.push('المعدل التراكمي أقل من المطلوب للتخرج');
  }
  if (getFailedCourses(student.grades).length >= regulation.maxFailuresAllowed) {
    risks.push('عدد المواد الراسبة وصل للحد الأقصى');
  }

  const recommendations = [
    'اتبع خطة الدراسة بدقة',
    'راجع المواد الراسبة فوراً',
    'احصل على درجات عالية في المواد القادمة',
    'استشر المرشد الأكاديمي بانتظام'
  ];

  return {
    remainingCredits,
    remainingSemesters,
    coursesPerSemester,
    estimatedGraduationDate: graduationDate.toLocaleDateString('ar-SA'),
    risks,
    recommendations
  };
}

// دالة لتحليل الأداء في المواد
export function analyzeCoursePerformance(
  student: StudentProfile,
  regulation: CurriculumRegulation
): {
  strongSubjects: string[];
  weakSubjects: string[];
  improvementAreas: string[];
} {
  const strongSubjects: string[] = [];
  const weakSubjects: string[] = [];
  const improvementAreas: string[] = [];

  // تحليل الأداء بناءً على الدرجات الفعلية فقط
  student.grades.forEach(grade => {
    if (grade.grade >= 85) {
      strongSubjects.push(grade.courseCode);
    } else if (grade.grade < 70) {
      weakSubjects.push(grade.courseCode);
    }
  });

  // تحديد مجالات التحسين بناءً على اللائحة الفعلية
  const courseCategories: { [key: string]: string[] } = {};
  
  // تجميع المواد حسب نوعها من اللائحة
  regulation.courses.forEach(course => {
    if (course.courseCode.includes('EDU1')) {
      if (!courseCategories['المواد الأساسية']) courseCategories['المواد الأساسية'] = [];
      courseCategories['المواد الأساسية'].push(course.courseCode);
    } else if (course.courseCode.includes('EDU2')) {
      if (!courseCategories['المواد التطبيقية']) courseCategories['المواد التطبيقية'] = [];
      courseCategories['المواد التطبيقية'].push(course.courseCode);
    } else if (course.courseCode.includes('EDU3')) {
      if (!courseCategories['المواد المتقدمة']) courseCategories['المواد المتقدمة'] = [];
      courseCategories['المواد المتقدمة'].push(course.courseCode);
    } else if (course.courseCode.includes('EDU4')) {
      if (!courseCategories['المواد التخرجية']) courseCategories['المواد التخرجية'] = [];
      courseCategories['المواد التخرجية'].push(course.courseCode);
    }
  });

  // تحليل الأداء في كل فئة
  Object.entries(courseCategories).forEach(([category, courses]) => {
    const categoryGrades = student.grades.filter(grade => 
      courses.includes(grade.courseCode)
    );
    
    if (categoryGrades.length > 0) {
      const avgGrade = categoryGrades.reduce((sum, grade) => sum + grade.grade, 0) / categoryGrades.length;
      if (avgGrade < 75) {
        improvementAreas.push(category);
      }
    }
  });

  return {
    strongSubjects,
    weakSubjects,
    improvementAreas
  };
} 