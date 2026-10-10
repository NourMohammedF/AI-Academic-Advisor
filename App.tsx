import React, { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Animated,
  Modal,
  ScrollView,
} from "react-native";
import UniversityLogo from "./components/UniversityLogo";
import { ErrorBoundary } from './components/ErrorBoundary';
import ragSystem, { StudentAnalysis } from './utils/ragSystem';
import { readPDFFile } from './utils/pdfReader';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'text' | 'upload' | 'analysis';
  analysis?: StudentAnalysis;
}

interface StudentData {
  name: string;
  studentId: string;
  regulation: string;
  grades: Array<{
    courseCode: string;
    courseName: string;
    grade: number;
    credits: number;
  }>;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [selectedRegulation, setSelectedRegulation] = useState('طفولة');
  const [ragInitialized, setRagInitialized] = useState(false);
  
  // Manual entry form state
  const [manualName, setManualName] = useState('');
  const [manualStudentId, setManualStudentId] = useState('');
  const [manualGrades, setManualGrades] = useState([
    { courseCode: '', courseName: '', grade: '', credits: '' }
  ]);
  
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Available regulations
  const regulations = [
    { id: 'طفولة', name: 'لائحة شعبة الطفولة', arabicName: 'شعبة الطفولة' },
    { id: 'خاصة', name: 'لائحة شعبة التربية الخاصة', arabicName: 'شعبة التربية الخاصة' },
    { id: 'رياضية', name: 'لائحة شعبة التربية الرياضية', arabicName: 'شعبة التربية الرياضية' },
  ];

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Initialize RAG system
    initializeRAGSystem();
  }, []);

  const initializeRAGSystem = async () => {
    try {
      await ragSystem.initializeCurriculum(selectedRegulation);
      setRagInitialized(true);
      console.log('RAG System initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RAG system:', error);
    }
  };

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

  // RAG System for Curriculum Analysis
  const getRAGResponse = async (userMessage: string, context?: string): Promise<string> => {
    try {
      const systemPrompt = `أنت المرشد الأكاديمي الذكي لجامعة الإسكندرية - كلية التربية. 
      
أنت متخصص في تحليل النتائج الدراسية بناءً على اللوائح الدراسية الرسمية.

المعلومات المتوفرة عن اللائحة الدراسية:
${context || 'لائحة شعبة الطفولة - جامعة الإسكندرية'}

مهمتك:
1. تحليل النتائج الدراسية بدقة
2. تقديم توصيات مخصصة بناءً على اللائحة
3. حساب المعدل التراكمي
4. تحديد المواد المطلوبة للتخرج
5. تقديم خطط تحسين الأداء

أجب باللغة العربية دائماً وبشكل مفصل ومفيد.`;

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost",
          "X-Title": "Co App"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        return "❌ لم يتم الحصول على رد من الذكاء الاصطناعي.";
      }
    } catch (error) {
      console.error("خطأ في RAG System:", error);
      return "❌ حدث خطأ في الاتصال بنظام التحليل الذكي.";
    }
  };

  const handleMessage = async (message: string): Promise<string> => {
    // Check for upload command
    if (message.toLowerCase().includes('رفع') || message.toLowerCase().includes('نتائج') || message.toLowerCase().includes('تحليل')) {
      setShowUploadModal(true);
      return `📊 **تم فتح نافذة رفع النتائج**

🎓 **اللوائح الدراسية المتاحة:**
${regulations.map(reg => `• ${reg.arabicName}`).join('\n')}

💡 **الميزات المتاحة:**
• اختيار اللائحة الدراسية المناسبة
• رفع ملف PDF أو Word مباشرة
• إدخال البيانات يدوياً للتجربة
• تحليل ذكي باستخدام نظام RAG المتقدم
• استخراج البيانات الفعلية من الملف
• تحليل الأداء الأكاديمي بناءً على اللائحة
• توصيات اختيار المواد
• خطة تحسين المعدل التراكمي
• خطة التخرج التفصيلية
• تحذيرات المخاطر الأكاديمية

🤖 **نظام RAG المتقدم:**
• تحليل ذكي للوائح الدراسية
• فهم عميق للمتطلبات الأكاديمية
• توصيات مخصصة بناءً على البيانات الفعلية
• خطط تحسين ذكية

⚠️ **مهم:** النظام يعتمد على البيانات الفعلية من ملفك واللائحة الدراسية فقط.`;
    }
    
    // Use RAG system for other questions
    return await getRAGResponse(message);
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message
    setMessages(prev => [
      ...prev,
      { 
        id: Date.now().toString(), 
        text: userMessage, 
        sender: 'user',
        timestamp: new Date()
      },
    ]);

    setIsLoading(true);

    try {
      const aiResponse = await handleMessage(userMessage);

      // Add AI response
      setMessages(prev => [
        ...prev,
        { 
          id: (Date.now() + 1).toString(), 
          text: aiResponse, 
          sender: 'ai',
          timestamp: new Date()
        },
      ]);
      
    } catch (error) {
      console.error('خطأ في معالجة الرسالة:', error);
      setMessages(prev => [
        ...prev,
        { 
          id: (Date.now() + 1).toString(), 
          text: 'عذراً، حدث خطأ في معالجة رسالتك. حاول مرة أخرى.', 
          sender: 'ai',
          timestamp: new Date()
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle real file upload
  const handleRealFileUpload = async (file: any) => {
    try {
      setIsLoading(true);
      
      // Process file using PDF reader
      const extractedData = await readPDFFile(file);
      
      // Convert to StudentData format
      const studentData: StudentData = {
        name: extractedData.name,
        studentId: extractedData.studentId,
        regulation: selectedRegulation,
        grades: extractedData.grades.map(grade => ({
          courseCode: grade.subject.substring(0, 6).toUpperCase(),
          courseName: grade.subject,
          grade: parseInt(grade.grade),
          credits: parseInt(grade.creditHours)
        }))
      };

      await processStudentData(studentData);
      
    } catch (error) {
      console.error('خطأ في معالجة الملف:', error);
      Alert.alert('خطأ', 'حدث خطأ في معالجة الملف. جرب إدخال البيانات يدوياً.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual data entry
  const handleManualEntry = () => {
    if (!manualName.trim() || !manualStudentId.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال الاسم والرقم الجامعي');
      return;
    }

    const validGrades = manualGrades.filter(g => 
      g.courseName.trim() && g.grade.trim() && g.credits.trim()
    );

    if (validGrades.length === 0) {
      Alert.alert('خطأ', 'يرجى إدخال مادة واحدة على الأقل');
      return;
    }

    const studentData: StudentData = {
      name: manualName.trim(),
      studentId: manualStudentId.trim(),
      regulation: selectedRegulation,
      grades: validGrades.map(grade => ({
        courseCode: grade.courseCode.trim() || grade.courseName.substring(0, 6).toUpperCase(),
        courseName: grade.courseName.trim(),
        grade: parseInt(grade.grade),
        credits: parseInt(grade.credits)
      }))
    };

    processStudentData(studentData);
    setShowManualEntryModal(false);
  };

  // Process student data and generate analysis
  const processStudentData = async (studentData: StudentData) => {
    try {
      setStudentData(studentData);
      setShowUploadModal(false);

      // Initialize RAG system with selected regulation
      if (!ragInitialized || selectedRegulation !== studentData.regulation) {
        await ragSystem.initializeCurriculum(selectedRegulation);
        setRagInitialized(true);
      }

      // Generate analysis using RAG system
      const analysis = await ragSystem.analyzeStudentData(studentData);
      
      // Format analysis for display
      const analysisText = formatAnalysisForDisplay(analysis);
      
      setMessages(prev => [
        ...prev,
        { 
          id: Date.now().toString(), 
          text: `📊 **تم رفع النتائج بنجاح**

${analysisText}`, 
          sender: 'ai',
          timestamp: new Date(),
          type: 'analysis',
          analysis: analysis
        },
      ]);

    } catch (error) {
      console.error('خطأ في تحليل البيانات:', error);
      Alert.alert('خطأ', 'حدث خطأ في تحليل البيانات. حاول مرة أخرى.');
    }
  };

  // Handle file upload (simulated for now)
  const handleFileUpload = async (fileData: any) => {
    try {
      // For now, use mock data but show the option for real upload
      Alert.alert(
        'خيارات رفع النتائج',
        'اختر طريقة إدخال النتائج:',
        [
          {
            text: 'إدخال يدوي',
            onPress: () => setShowManualEntryModal(true)
          },
          {
            text: 'ملف PDF/Word',
            onPress: () => {
              // Simulate file upload for now
              const mockStudentData: StudentData = {
                name: "أحمد محمد علي",
                studentId: "202100123",
                regulation: selectedRegulation,
                grades: [
                  { courseCode: "EDU101", courseName: "أصول التربية", grade: 85, credits: 3 },
                  { courseCode: "EDU102", courseName: "علم النفس التربوي", grade: 78, credits: 3 },
                  { courseCode: "EDU103", courseName: "مناهج وطرق التدريس", grade: 92, credits: 3 },
                  { courseCode: "CHD201", courseName: "نمو وتطور الطفل", grade: 88, credits: 3 },
                  { courseCode: "CHD202", courseName: "تربية الطفولة المبكرة", grade: 95, credits: 3 },
                ]
              };
              processStudentData(mockStudentData);
            }
          },
          {
            text: 'إلغاء',
            style: 'cancel'
          }
        ]
      );
    } catch (error) {
      console.error('خطأ في رفع الملف:', error);
      Alert.alert('خطأ', 'حدث خطأ في رفع الملف. حاول مرة أخرى.');
    }
  };

  // Add new grade row
  const addGradeRow = () => {
    setManualGrades([...manualGrades, { courseCode: '', courseName: '', grade: '', credits: '' }]);
  };

  // Remove grade row
  const removeGradeRow = (index: number) => {
    if (manualGrades.length > 1) {
      const newGrades = manualGrades.filter((_, i) => i !== index);
      setManualGrades(newGrades);
    }
  };

  // Update grade row
  const updateGradeRow = (index: number, field: string, value: string) => {
    const newGrades = [...manualGrades];
    newGrades[index] = { ...newGrades[index], [field]: value };
    setManualGrades(newGrades);
  };

  const formatAnalysisForDisplay = (analysis: StudentAnalysis): string => {
    return `🎓 **تحليل النتائج الدراسية**

👤 **معلومات الطالب:**
• الاسم: ${analysis.name}
• الرقم الجامعي: ${analysis.studentId}
• المعدل التراكمي: ${analysis.currentGPA}
• الساعات المكتملة: ${analysis.completedCredits}
• الساعات المتبقية: ${analysis.remainingCredits}

📚 **المواد الدراسية:**
• المواد المكتملة: ${analysis.completedCourses.length} مادة
• المواد الفاشلة: ${analysis.failedCourses.length} مادة
• المواد المتبقية: ${analysis.remainingCourses.length} مادة

⚠️ **التحذيرات:**
${analysis.warnings.length > 0 
  ? analysis.warnings.map(w => `• ${w.title}: ${w.description}`).join('\n')
  : '• لا توجد تحذيرات أكاديمية'
}

💡 **التوصيات:**
${analysis.recommendations.map(rec => `• ${rec.title}: ${rec.description}`).join('\n')}

🎯 **خطة التخرج:**
• تاريخ التخرج المتوقع: ${analysis.graduationPlan.estimatedGraduationDate}
• الفصول المتبقية: ${analysis.graduationPlan.remainingSemesters}
• المخاطر: ${analysis.graduationPlan.risks.length > 0 ? analysis.graduationPlan.risks.join(', ') : 'لا توجد مخاطر'}

🤖 **تم التحليل باستخدام نظام RAG المتقدم**`;
  };

  const scrollToBottom = useCallback(() => {
    if (flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderItem = ({ item }: { item: Message }) => (
    <Animated.View 
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userContainer : styles.aiContainer
      ]}
    >
      <View style={[
        styles.message, 
        item.sender === 'user' ? styles.userMessage : styles.aiMessage
      ]}>
        <View style={styles.messageHeader}>
          {item.sender === 'ai' && (
            <View style={styles.logoContainer}>
              <UniversityLogo size={20} />
            </View>
          )}
          {item.sender === 'user' && (
            <Text style={styles.messageIcon}>👨‍🎓</Text>
          )}
          <Text style={[
            styles.senderName,
            item.sender === 'user' ? styles.userName : styles.aiName
          ]}>
            {item.sender === 'user' ? 'الطالب' : 'المرشد الأكاديمي الذكي'}
          </Text>
        </View>
        <Text style={[
          styles.messageText,
          item.sender === 'user' ? styles.userText : styles.aiText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.timestamp,
          item.sender === 'user' ? styles.userTimestamp : styles.aiTimestamp
        ]}>
          {formatTime(item.timestamp)}
        </Text>
      </View>
    </Animated.View>
  );

  const renderLoading = () => {
    if (!isLoading) return null;
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.aiMessage}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size="small" color="#1e3a8a" />
            <Text style={styles.loadingText}>جاري التحليل الذكي...</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderWelcomeMessage = () => (
    <View style={styles.welcomeContainer}>
      <UniversityLogo size={80} />
      <Text style={styles.welcomeTitle}>المرشد الأكاديمي الذكي</Text>
      <Text style={styles.welcomeSubtitle}>جامعة الإسكندرية - كلية التربية</Text>
      <Text style={styles.welcomeText}>
        مرحباً بك في المرشد الأكاديمي الذكي! 🤖
      </Text>
      <Text style={styles.welcomeFeatures}>
        💡 يمكنني مساعدتك في:
        {'\n'}• تحليل نتائجك الدراسية
        {'\n'}• حساب المعدل التراكمي
        {'\n'}• تقديم توصيات أكاديمية
        {'\n'}• إرشادك للوائح الدراسية
        {'\n'}• خطط تحسين الأداء
        {'\n'}• خطة التخرج التفصيلية
      </Text>
      <Text style={styles.ragInfo}>
        🤖 **نظام RAG المتقدم:**
        {'\n'}• تحليل ذكي للوائح الدراسية
        {'\n'}• فهم عميق للمتطلبات الأكاديمية
        {'\n'}• توصيات مخصصة بناءً على البيانات الفعلية
      </Text>
          <TouchableOpacity 
        style={styles.uploadButton}
        onPress={() => setShowUploadModal(true)}
          >
        <Text style={styles.uploadButtonText}>📊 رفع النتائج الدراسية</Text>
          </TouchableOpacity>
        </View>
    );

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
        
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerContent}>
            <View style={styles.avatarContainer}>
              <UniversityLogo size={40} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>المرشد الأكاديمي الذكي</Text>
              <Text style={styles.headerSubtitle}>جامعة الإسكندرية - كلية التربية</Text>
            </View>
          </View>
        </Animated.View>
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          ListHeaderComponent={messages.length === 0 ? renderWelcomeMessage() : null}
          ListFooterComponent={renderLoading}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
          showsVerticalScrollIndicator={false}
          bounces={true}
        />
        
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="اكتب رسالتك هنا..."
              placeholderTextColor="#9ca3af"
              multiline
              maxLength={10000}
              onSubmitEditing={sendMessage}
              blurOnSubmit={false}
              returnKeyType="send"
            />
            <TouchableOpacity 
              style={[styles.sendButton, isLoading && styles.sendButtonDisabled]} 
              onPress={sendMessage}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.sendButtonText}>📤</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upload Modal */}
        <Modal
          visible={showUploadModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowUploadModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>رفع النتائج الدراسية</Text>
                <TouchableOpacity 
                  onPress={() => setShowUploadModal(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalSectionTitle}>اختر اللائحة الدراسية:</Text>
                {regulations.map((regulation) => (
                  <TouchableOpacity
                    key={regulation.id}
                    style={[
                      styles.regulationOption,
                      selectedRegulation === regulation.id && styles.selectedRegulation
                    ]}
                    onPress={() => setSelectedRegulation(regulation.id)}
                  >
                    <Text style={[
                      styles.regulationText,
                      selectedRegulation === regulation.id && styles.selectedRegulationText
                    ]}>
                      {regulation.arabicName}
                    </Text>
                  </TouchableOpacity>
                ))}
                
                <Text style={styles.modalSectionTitle}>طريقة رفع النتائج:</Text>
                
                <TouchableOpacity 
                  style={styles.uploadOptionButton}
                  onPress={() => setShowManualEntryModal(true)}
                >
                  <Text style={styles.uploadOptionText}>✏️ إدخال البيانات يدوياً</Text>
                  <Text style={styles.uploadOptionSubtext}>للتجربة السريعة</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.uploadOptionButton}
                  onPress={() => handleFileUpload(null)}
                >
                  <Text style={styles.uploadOptionText}>📁 رفع ملف PDF أو Word</Text>
                  <Text style={styles.uploadOptionSubtext}>للملفات الحقيقية</Text>
                </TouchableOpacity>
                
                <Text style={styles.modalNote}>
                  💡 **ملاحظة:** يمكنك إدخال بياناتك يدوياً للتجربة السريعة، أو رفع ملف حقيقي للتحليل الدقيق.
                  
                  🤖 **ميزات RAG:**
                  • فهم عميق للوائح الدراسية
                  • تحليل ذكي للنتائج
                  • توصيات مخصصة
                  • خطط تحسين ذكية
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Manual Entry Modal */}
        <Modal
          visible={showManualEntryModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowManualEntryModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { maxHeight: '90%' }]}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>إدخال البيانات يدوياً</Text>
                <TouchableOpacity 
                  onPress={() => setShowManualEntryModal(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalBody}>
                <Text style={styles.modalSectionTitle}>معلومات الطالب:</Text>
                
                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>الاسم الكامل:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={manualName}
                    onChangeText={setManualName}
                    placeholder="أدخل اسمك الكامل"
                    placeholderTextColor="#9ca3af"
                  />
                </View>

                <View style={styles.inputField}>
                  <Text style={styles.inputLabel}>الرقم الجامعي:</Text>
                  <TextInput
                    style={styles.textInput}
                    value={manualStudentId}
                    onChangeText={setManualStudentId}
                    placeholder="أدخل رقمك الجامعي"
                    placeholderTextColor="#9ca3af"
                    keyboardType="numeric"
                  />
                </View>

                <Text style={styles.modalSectionTitle}>النتائج الدراسية:</Text>
                
                {manualGrades.map((grade, index) => (
                  <View key={index} style={styles.gradeRow}>
                    <View style={styles.gradeHeader}>
                      <Text style={styles.gradeTitle}>المادة {index + 1}</Text>
                      {manualGrades.length > 1 && (
                        <TouchableOpacity 
                          onPress={() => removeGradeRow(index)}
                          style={styles.removeButton}
                        >
                          <Text style={styles.removeButtonText}>حذف</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    
                    <View style={styles.gradeInputs}>
                      <View style={styles.inputField}>
                        <Text style={styles.inputLabel}>رمز المادة:</Text>
                        <TextInput
                          style={styles.textInput}
                          value={grade.courseCode}
                          onChangeText={(value) => updateGradeRow(index, 'courseCode', value)}
                          placeholder="مثال: EDU101"
                          placeholderTextColor="#9ca3af"
                        />
                      </View>
                      
                      <View style={styles.inputField}>
                        <Text style={styles.inputLabel}>اسم المادة:</Text>
                        <TextInput
                          style={styles.textInput}
                          value={grade.courseName}
                          onChangeText={(value) => updateGradeRow(index, 'courseName', value)}
                          placeholder="مثال: أصول التربية"
                          placeholderTextColor="#9ca3af"
                        />
                      </View>
                      
                      <View style={styles.gradeRowInputs}>
                        <View style={styles.inputField}>
                          <Text style={styles.inputLabel}>الدرجة:</Text>
                          <TextInput
                            style={styles.textInput}
                            value={grade.grade}
                            onChangeText={(value) => updateGradeRow(index, 'grade', value)}
                            placeholder="0-100"
                            placeholderTextColor="#9ca3af"
                            keyboardType="numeric"
                          />
                        </View>
                        
                        <View style={styles.inputField}>
                          <Text style={styles.inputLabel}>الساعات:</Text>
                          <TextInput
                            style={styles.textInput}
                            value={grade.credits}
                            onChangeText={(value) => updateGradeRow(index, 'credits', value)}
                            placeholder="3"
                            placeholderTextColor="#9ca3af"
                            keyboardType="numeric"
                          />
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
                
            <TouchableOpacity 
                  style={styles.addGradeButton}
                  onPress={addGradeRow}
            >
                  <Text style={styles.addGradeButtonText}>+ إضافة مادة أخرى</Text>
            </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.analyzeButton}
                  onPress={handleManualEntry}
                >
                  <Text style={styles.analyzeButtonText}>🔍 تحليل النتائج</Text>
                </TouchableOpacity>
              </ScrollView>
          </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1e3a8a',
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 8,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    padding: 5,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 10,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e3a8a',
    marginTop: 20,
    marginBottom: 5,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 18,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 20,
  },
  welcomeFeatures: {
    fontSize: 16,
    color: '#4b5563',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  ragInfo: {
    fontSize: 14,
    color: '#1e3a8a',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 30,
    backgroundColor: '#eff6ff',
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#1e3a8a',
  },
  uploadButton: {
    backgroundColor: '#1e3a8a',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 4,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    marginVertical: 8,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  aiContainer: {
    alignItems: 'flex-start',
  },
  message: {
    maxWidth: screenWidth * 0.75,
    padding: 15,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  userMessage: {
    backgroundColor: '#1e3a8a',
    borderBottomRightRadius: 5,
    borderLeftWidth: 3,
    borderLeftColor: '#fbbf24',
  },
  aiMessage: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRightWidth: 3,
    borderRightColor: '#1e3a8a',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  messageIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  senderName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  userName: {
    color: '#fff',
  },
  aiName: {
    color: '#1f2937',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 5,
  },
  userText: {
    color: '#fff',
  },
  aiText: {
    color: '#1f2937',
  },
  timestamp: {
    fontSize: 11,
    opacity: 0.7,
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'left',
  },
  aiTimestamp: {
    color: '#6b7280',
    textAlign: 'right',
  },
  loadingContainer: {
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  inputContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f9fafb',
    borderRadius: 25,
    paddingHorizontal: 5,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#1e3a8a',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 40,
    elevation: 2,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  sendButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  logoContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
    padding: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxHeight: '80%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#6b7280',
  },
  modalBody: {
    padding: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 15,
    marginTop: 10,
  },
  regulationOption: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  selectedRegulation: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  regulationText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedRegulationText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  uploadOptionButton: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  uploadOptionText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  uploadOptionSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
  modalNote: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 20,
  },
  gradeRow: {
    backgroundColor: '#f9fafb',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 10,
  },
  gradeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  gradeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  removeButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  gradeInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gradeInputs: {
    flex: 1,
  },
  gradeRowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  inputField: {
    flex: 1,
    marginRight: 10,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    fontSize: 16,
    color: '#1f2937',
  },
  addGradeButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  addGradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  analyzeButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
    shadowColor: '#1e3a8a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});