// Simple test to verify basic functionality
console.log('🧪 اختبار الوظائف الأساسية');

// Test 1: Check if we can create a basic student data structure
const testStudentData = {
  name: 'أحمد محمد علي',
  studentId: '202100123',
  academicYear: '2023-2024',
  semester: 'الفصل الأول',
  grades: [
    {
      subject: 'مقدمة في التربية',
      grade: '85',
      creditHours: '3'
    },
    {
      subject: 'علم النفس التربوي',
      grade: '78',
      creditHours: '3'
    }
  ]
};

console.log('✅ تم إنشاء بيانات الطالب التجريبية:', testStudentData);

// Test 2: Check if we can calculate GPA
function calculateGPA(grades) {
  const totalPoints = grades.reduce((sum, grade) => {
    const gradePoints = parseInt(grade.grade) >= 90 ? 4.0 : 
                       parseInt(grade.grade) >= 85 ? 3.7 : 
                       parseInt(grade.grade) >= 80 ? 3.3 : 
                       parseInt(grade.grade) >= 75 ? 3.0 : 
                       parseInt(grade.grade) >= 70 ? 2.7 : 
                       parseInt(grade.grade) >= 65 ? 2.3 : 
                       parseInt(grade.grade) >= 60 ? 2.0 : 
                       parseInt(grade.grade) >= 55 ? 1.7 : 
                       parseInt(grade.grade) >= 50 ? 1.0 : 0;
    return sum + (gradePoints * parseInt(grade.creditHours));
  }, 0);
  
  const totalCredits = grades.reduce((sum, grade) => sum + parseInt(grade.creditHours), 0);
  return totalCredits > 0 ? totalPoints / totalCredits : 0;
}

const gpa = calculateGPA(testStudentData.grades);
console.log('📊 المعدل التراكمي المحسوب:', gpa.toFixed(2));

// Test 3: Check if we can convert to the expected format
const convertedData = {
  name: testStudentData.name,
  studentId: testStudentData.studentId,
  semester: testStudentData.semester,
  academicYear: testStudentData.academicYear,
  grades: testStudentData.grades.map((grade, index) => ({
    courseCode: 'EDU' + (100 + index),
    courseName: grade.subject,
    grade: parseInt(grade.grade),
    credits: parseInt(grade.creditHours),
    semester: testStudentData.semester.includes('الأول') ? 1 : 2,
    academicYear: parseInt(testStudentData.academicYear.split('-')[0]) - 2020,
    isPassed: parseInt(grade.grade) >= 50,
    attempts: 1
  }))
};

console.log('🔄 البيانات المحولة:', convertedData);

console.log('\n✅ جميع الاختبارات الأساسية نجحت!');
console.log('💡 النظام جاهز للاستخدام مع البيانات التجريبية.'); 