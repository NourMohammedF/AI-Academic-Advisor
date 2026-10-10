const { extractPdfData, testPythonScript } = require('./utils/pdfTool');

async function testPdfTool() {
    console.log('🧪 بدء اختبار أداة استخراج PDF...\n');

    // اختبار سكريبت Python
    console.log('1. اختبار سكريبت Python...');
    const pythonReady = await testPythonScript();
    
    if (!pythonReady) {
        console.log('❌ فشل في اختبار سكريبت Python');
        return;
    }

    // اختبار استخراج البيانات من ملف PDF
    console.log('\n2. اختبار استخراج البيانات...');
    
    // مسار ملف PDF للاختبار (استبدل بمسار ملف حقيقي)
    const testPdfPath = './assets/pdf/لائحة شعبة طفولة.pdf';
    
    try {
        const result = await extractPdfData(testPdfPath);
        
        if (result.success) {
            console.log('✅ تم استخراج البيانات بنجاح!');
            console.log('📊 البيانات المستخرجة:');
            console.log(`   الاسم: ${result.data.name}`);
            console.log(`   الرقم القومي: ${result.data.studentId}`);
            console.log(`   السنة الدراسية: ${result.data.academicYear}`);
            console.log(`   الفصل الدراسي: ${result.data.semester}`);
            console.log(`   عدد المواد: ${result.data.grades.length}`);
            
            if (result.data.grades.length > 0) {
                console.log('\n📚 المواد:');
                result.data.grades.forEach((grade, index) => {
                    console.log(`   ${index + 1}. ${grade.subject} - ${grade.grade} (${grade.creditHours} ساعة)`);
                });
            }
        } else {
            console.log('❌ فشل في استخراج البيانات');
        }
        
    } catch (error) {
        console.log('❌ خطأ في استخراج البيانات:', error.message);
    }
}

// تشغيل الاختبار
testPdfTool().catch(console.error); 