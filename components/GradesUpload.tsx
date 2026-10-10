// GradesUpload.tsx
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import { readPDFFile } from '../utils/pdfReader';

interface GradesUploadProps {
  onAnalysisComplete: (analysis: any) => void;
  onClose: () => void;
}

interface ExtractedData {
  name: string;
  studentId: string;
  semester: string;
  academicYear: string;
  grades: Array<{
    courseCode: string;
    courseName: string;
    grade: number;
    credits: number;
    semester: number;
    academicYear: number;
    isPassed: boolean;
    attempts: number;
  }>;
}

interface Regulation {
  id: string;
  name: string;
  arabicName: string;
  description: string;
}

const availableRegulations: Regulation[] = [
  {
    id: 'childhood-2024',
    name: 'Childhood Education',
    arabicName: 'لائحة شعبة الطفولة',
    description: 'لائحة دراسية لشعبة الطفولة - كلية التربية - جامعة الإسكندرية'
  }
];

export default function GradesUpload({ onAnalysisComplete, onClose }: GradesUploadProps) {
  const [selectedRegulation, setSelectedRegulation] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectPDFFile = () => {
    if (!selectedRegulation) {
      Alert.alert('يرجى اختيار اللائحة أولاً', 'اختر اللائحة الدراسية قبل رفع الملف');
      return;
    }
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExts = ['.pdf', '.docx'];
    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() || '');

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      Alert.alert('ملف غير صالح', 'يرجى اختيار ملف PDF أو DOCX فقط');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      Alert.alert('ملف كبير جداً', 'يرجى اختيار ملف أقل من 10 ميجا');
      return;
    }

    setIsUploading(true);
    setUploadProgress('📤 جاري تحليل الملف...');
    setSelectedFile(file.name);

    try {
      console.log('📤 جاري تحليل الملف باستخدام الذكاء الاصطناعي...');
      setUploadProgress('🤖 جاري تحليل الملف باستخدام الذكاء الاصطناعي...');
      
      const result = await readPDFFile(file);
      
      console.log('✅ تم استخراج البيانات بنجاح:', result);
      
      // Convert the result to the expected format
      const convertedData: ExtractedData = {
        name: result.name,
        studentId: result.studentId,
        semester: result.semester,
        academicYear: result.academicYear,
        grades: result.grades.map((grade: any) => ({
          courseCode: 'EDU' + Math.floor(Math.random() * 900 + 100),
          courseName: grade.subject,
          grade: parseInt(grade.grade),
          credits: parseInt(grade.creditHours),
          semester: result.semester.includes('الأول') ? 1 : 2,
          academicYear: parseInt(result.academicYear.split('-')[0]) - 2020,
          isPassed: parseInt(grade.grade) >= 50,
          attempts: 1
        }))
      };
      
      setExtractedData(convertedData);
      setUploadProgress('✅ تم استخراج البيانات بنجاح');
      setErrorMessage(''); // Clear any previous errors
    } catch (err) {
      console.error('❌ خطأ في تحليل الملف:', err);
      const errorMessage = err instanceof Error ? err.message : 'فشل في تحليل الملف. تأكد من أن الملف صالح.';
      setErrorMessage(errorMessage);
      setUploadProgress('❌ فشل في تحليل الملف');
      
      // Provide sample data as fallback for testing
      console.log('🔄 استخدام بيانات تجريبية للاختبار...');
      const sampleData: ExtractedData = {
        name: 'أحمد محمد علي',
        studentId: '202100123',
        semester: 'الفصل الأول',
        academicYear: '2023-2024',
        grades: [
          {
            courseCode: 'EDU101',
            courseName: 'مقدمة في التربية',
            grade: 85,
            credits: 3,
            semester: 1,
            academicYear: 3,
            isPassed: true,
            attempts: 1
          },
          {
            courseCode: 'EDU102',
            courseName: 'علم النفس التربوي',
            grade: 78,
            credits: 3,
            semester: 1,
            academicYear: 3,
            isPassed: true,
            attempts: 1
          },
          {
            courseCode: 'EDU103',
            courseName: 'طرق التدريس',
            grade: 92,
            credits: 3,
            semester: 1,
            academicYear: 3,
            isPassed: true,
            attempts: 1
          }
        ]
      };
      
      setExtractedData(sampleData);
      setUploadProgress('✅ تم تحميل بيانات تجريبية للاختبار');
      setErrorMessage('تم استخدام بيانات تجريبية للاختبار. يمكنك تجربة التحليل الآن.');
    } finally {
      setIsUploading(false);
    }
  };

  const analyzeResults = async () => {
    if (!extractedData || !selectedRegulation) {
      Alert.alert('بيانات غير مكتملة', 'ارفع الملف واختار اللائحة');
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress('📈 جاري تحليل النتائج...');

    try {
      const analysis = {
        student: {
          name: extractedData.name,
          studentId: extractedData.studentId,
          currentGPA: calculateGPA(extractedData.grades),
          totalCredits: extractedData.grades.reduce((s, g) => s + g.credits, 0),
          completedCredits: extractedData.grades.reduce((s, g) => s + g.credits, 0),
        },
        regulation: {
          id: selectedRegulation,
          name: availableRegulations.find(r => r.id === selectedRegulation)?.arabicName || ''
        },
        warnings: [],
        recommendations: [],
        grades: extractedData.grades,
        uploadedFile: selectedFile
      };

      onAnalysisComplete(analysis);
    } catch (err) {
      console.error(err);
      setErrorMessage('فشل في التحليل. حاول مرة أخرى.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateGPA = (grades: ExtractedData['grades']) => {
    const totalPoints = grades.reduce((sum, g) => {
      const gradePoints = g.grade >= 90 ? 4.0 : g.grade >= 85 ? 3.7 : g.grade >= 80 ? 3.3 :
        g.grade >= 75 ? 3.0 : g.grade >= 70 ? 2.7 : g.grade >= 65 ? 2.3 :
        g.grade >= 60 ? 2.0 : g.grade >= 55 ? 1.7 : g.grade >= 50 ? 1.0 : 0;
      return sum + (gradePoints * g.credits);
    }, 0);
    const totalCredits = grades.reduce((sum, g) => sum + g.credits, 0);
    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  return (
    <Modal visible={true} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.header}>📄 رفع ملف النتائج</Text>

        <ScrollView style={styles.content}>
          <Text style={styles.label}>اختر اللائحة الدراسية:</Text>
          {availableRegulations.map(r => (
            <TouchableOpacity
              key={r.id}
              onPress={() => setSelectedRegulation(r.id)}
              style={[styles.option, selectedRegulation === r.id && styles.selectedOption]}
            >
              <Text style={styles.optionText}>{r.arabicName}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            onPress={selectPDFFile}
            style={[styles.uploadButton, !selectedRegulation && styles.disabled]}
            disabled={!selectedRegulation}
          >
            <Text style={styles.uploadText}>📎 اختر ملف PDF أو Word</Text>
          </TouchableOpacity>
          
          <Text style={styles.helpText}>
            💡 يدعم النظام ملفات PDF و Word (DOCX) التي تحتوي على نتائج دراسية.
            سيتم تحليل الملف باستخدام الذكاء الاصطناعي لاستخراج البيانات.
          </Text>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {uploadProgress ? <Text style={styles.status}>{uploadProgress}</Text> : null}

          {extractedData && (
            <>
              <Text style={styles.label}>الاسم: {extractedData.name}</Text>
              <Text style={styles.label}>رقم الطالب: {extractedData.studentId}</Text>
              <Text style={styles.note}>💡 تم استخراج البيانات من الملف. إذا لم تكن البيانات صحيحة، يمكنك تعديلها يدوياً.</Text>
              <TouchableOpacity onPress={analyzeResults} style={styles.analyzeButton}>
                {isAnalyzing ? <ActivityIndicator color="#fff" /> : <Text style={styles.analyzeText}>تحليل النتائج</Text>}
              </TouchableOpacity>
            </>
          )}

          {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#1e3a8a' },
  content: { flex: 1 },
  label: { fontSize: 16, marginVertical: 10 },
  option: { padding: 10, borderColor: '#ccc', borderWidth: 1, marginBottom: 5, borderRadius: 6 },
  selectedOption: { backgroundColor: '#1e3a8a' },
  optionText: { color: '#000' },
  uploadButton: { backgroundColor: '#10b981', padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 20 },
  disabled: { backgroundColor: '#ccc' },
  uploadText: { color: '#fff', fontSize: 16 },
  status: { fontStyle: 'italic', color: '#1e3a8a', marginBottom: 10 },
  analyzeButton: { backgroundColor: '#1e40af', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  analyzeText: { color: '#fff', fontSize: 16 },
  note: { color: '#1e40af', fontStyle: 'italic', marginTop: 10, fontSize: 14 },
  helpText: { color: '#666', fontSize: 12, marginTop: 10, textAlign: 'center' },
  error: { color: 'red', marginTop: 10 }
});
