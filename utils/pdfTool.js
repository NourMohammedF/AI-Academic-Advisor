const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');

/**
 * استخراج البيانات من ملف PDF باستخدام سكريبت Python
 * @param {string} pdfPath - مسار ملف PDF
 * @returns {Promise<Object>} البيانات المستخرجة
 */
function extractPdfData(pdfPath) {
    return new Promise((resolve, reject) => {
        // التحقق من وجود الملف
        if (!fs.existsSync(pdfPath)) {
            reject(new Error(`الملف غير موجود: ${pdfPath}`));
            return;
        }

        // مسار سكريبت Python
        const scriptPath = path.join(__dirname, '..', 'extract_pdf_data.py');
        
        // تشغيل سكريبت Python
        execFile('python', [scriptPath, pdfPath], (error, stdout, stderr) => {
            if (error) {
                console.error('خطأ في تشغيل سكريبت Python:', error);
                reject(new Error(`فشل في تشغيل سكريبت Python: ${error.message}`));
                return;
            }

            if (stderr) {
                console.warn('تحذير من سكريبت Python:', stderr);
            }

            try {
                // تحليل النتيجة JSON
                const result = JSON.parse(stdout);
                
                if (result.error) {
                    if (result.error.includes('Failed to extract data')) {
                        reject(new Error('❌ لم يتم العثور على بيانات طالب في الملف.\n\n🔍 **السبب المحتمل:**\n• الملف المرفوع ليس نتيجة طالب (مثل: لائحة، تعليمات، أو ملف عام)\n• الملف لا يحتوي على بيانات الطالب والدرجات\n• تنسيق الملف مختلف عن المتوقع\n\n💡 **الحل:**\n• تأكد من رفع ملف النتيجة الدراسية الصادر من الجامعة\n• تأكد من أن الملف يحتوي على: الرقم القومي، اسم الطالب، المواد والدرجات\n• جرب ملف نتيجة آخر إذا كان متوفر'));
                    } else {
                        reject(new Error(result.error));
                    }
                    return;
                }

                // تحويل البيانات إلى التنسيق المطلوب للتطبيق
                const appData = {
                    name: result.student_info.name,
                    studentId: result.student_info.national_id,
                    academicYear: result.latest_semester.academic_year,
                    semester: result.latest_semester.semester_name,
                    grades: []
                };

                // تحويل المواد
                for (const course of result.courses) {
                    appData.grades.push({
                        subject: course.course_name,
                        grade: course.grade_numeric.toString(),
                        creditHours: course.credit_hours.toString()
                    });
                }

                resolve({
                    success: true,
                    data: appData,
                    message: 'تم استخراج البيانات بنجاح'
                });

            } catch (parseError) {
                console.error('خطأ في تحليل النتيجة JSON:', parseError);
                reject(new Error('فشل في تحليل النتيجة من سكريبت Python'));
            }
        });
    });
}

/**
 * اختبار سكريبت Python
 * @returns {Promise<boolean>} نجح الاختبار أم لا
 */
function testPythonScript() {
    return new Promise((resolve) => {
        const scriptPath = path.join(__dirname, '..', 'extract_pdf_data.py');
        
        // التحقق من وجود السكريبت
        if (!fs.existsSync(scriptPath)) {
            console.error('سكريبت Python غير موجود:', scriptPath);
            resolve(false);
            return;
        }

        // اختبار تشغيل Python
        execFile('python', ['--version'], (error) => {
            if (error) {
                console.error('Python غير مثبت أو غير متاح في PATH');
                resolve(false);
                return;
            }

            console.log('✅ سكريبت Python جاهز للاستخدام');
            resolve(true);
        });
    });
}

module.exports = {
    extractPdfData,
    testPythonScript
}; 