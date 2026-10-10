export interface CourseGrade {
  courseCode: string;
  courseName: string;
  grade: number;
  credits: number;
  semester: number;
  academicYear: number;
  isPassed: boolean;
  attempts: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  studentId: string;
  regulationId: string;
  currentSemester: number;
  currentAcademicYear: number;
  totalCredits: number;
  completedCredits: number;
  gpa: number;
  grades: CourseGrade[];
  warnings: string[];
  recommendations: string[];
}

export interface AcademicAnalysis {
  studentId: string;
  regulationId: string;
  analysisDate: Date;
  currentGPA: number;
  targetGPA: number;
  gpaToGraduate: number;
  completedCourses: string[];
  failedCourses: string[];
  remainingCourses: string[];
  prerequisitesViolations: string[];
  warnings: {
    type: 'gpa' | 'failures' | 'prerequisites' | 'graduation';
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    recommendations: string[];
  }[];
  recommendations: {
    type: 'course_selection' | 'gpa_improvement' | 'graduation_plan';
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    courses?: string[];
  }[];
}

// لا توجد بيانات تجريبية - النظام يعتمد على البيانات الفعلية من ملفات PDF واللائحة فقط
export const SAMPLE_STUDENTS: StudentProfile[] = [];

// دالة لحساب المعدل التراكمي
export function calculateGPA(grades: CourseGrade[]): number {
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

// دالة لحساب عدد المواد المكتملة
export function calculateCompletedCredits(grades: CourseGrade[]): number {
  return grades
    .filter(grade => grade.isPassed)
    .reduce((total, grade) => total + grade.credits, 0);
}

// دالة للحصول على المواد الراسبة
export function getFailedCourses(grades: CourseGrade[]): CourseGrade[] {
  return grades.filter(grade => !grade.isPassed);
}

// دالة للحصول على المواد المكتملة
export function getCompletedCourses(grades: CourseGrade[]): CourseGrade[] {
  return grades.filter(grade => grade.isPassed);
}

// دالة لتحديث بيانات الطالب
export function updateStudentProfile(
  student: StudentProfile,
  newGrades: CourseGrade[]
): StudentProfile {
  const updatedGrades = [...student.grades, ...newGrades];
  const gpa = calculateGPA(updatedGrades);
  const completedCredits = calculateCompletedCredits(updatedGrades);
  
  return {
    ...student,
    grades: updatedGrades,
    gpa,
    completedCredits
  };
}

// دالة للحصول على طالب بواسطة المعرف
export function getStudentById(id: string): StudentProfile | null {
  // لا توجد بيانات تجريبية - النظام يعتمد على البيانات الفعلية من ملفات PDF
  return null;
}

// دالة للحصول على جميع الطلاب
export function getAllStudents(): StudentProfile[] {
  // لا توجد بيانات تجريبية - النظام يعتمد على البيانات الفعلية من ملفات PDF
  return [];
} 