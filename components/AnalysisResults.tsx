import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal
} from 'react-native';

interface AnalysisResultsProps {
  analysis: any;
  visible: boolean;
  onClose: () => void;
}

export default function AnalysisResults({ analysis, visible, onClose }: AnalysisResultsProps) {
  if (!analysis) return null;

  const { student, regulation, analysis: academicAnalysis, performance, courseRecommendations, gpaPlan, graduationPlan } = analysis;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f97316';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>📊 نتائج التحليل الأكاديمي</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* معلومات الطالب */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👨‍🎓 معلومات الطالب</Text>
            <View style={styles.studentCard}>
              <Text style={styles.studentName}>{student.name}</Text>
              <Text style={styles.studentId}>رقم الطالب: {student.studentId}</Text>
              <Text style={styles.regulationName}>{regulation.arabicName}</Text>
              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{student.gpa.toFixed(2)}</Text>
                  <Text style={styles.statLabel}>المعدل التراكمي</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{student.completedCredits}</Text>
                  <Text style={styles.statLabel}>الساعات المكتملة</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{student.currentSemester}</Text>
                  <Text style={styles.statLabel}>الفصل الحالي</Text>
                </View>
              </View>
            </View>
          </View>

          {/* التحذيرات */}
          {academicAnalysis.warnings.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>⚠️ التحذيرات</Text>
              {academicAnalysis.warnings.map((warning: any, index: number) => (
                <View key={index} style={[styles.warningCard, { borderLeftColor: getSeverityColor(warning.severity) }]}>
                  <Text style={styles.warningTitle}>{warning.title}</Text>
                  <Text style={styles.warningDescription}>{warning.description}</Text>
                  <View style={styles.recommendationsList}>
                    {warning.recommendations.map((rec: string, recIndex: number) => (
                      <Text key={recIndex} style={styles.recommendationItem}>• {rec}</Text>
                    ))}
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* التوصيات */}
          {academicAnalysis.recommendations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>💡 التوصيات</Text>
              {academicAnalysis.recommendations.map((rec: any, index: number) => (
                <View key={index} style={[styles.recommendationCard, { borderLeftColor: getPriorityColor(rec.priority) }]}>
                  <Text style={styles.recommendationTitle}>{rec.title}</Text>
                  <Text style={styles.recommendationDescription}>{rec.description}</Text>
                  {rec.courses && rec.courses.length > 0 && (
                    <View style={styles.coursesList}>
                      <Text style={styles.coursesTitle}>المواد المقترحة:</Text>
                      {rec.courses.map((course: string, courseIndex: number) => (
                        <Text key={courseIndex} style={styles.courseItem}>• {course}</Text>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {/* تحليل الأداء */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📈 تحليل الأداء</Text>
            <View style={styles.performanceCard}>
              <View style={styles.performanceRow}>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceLabel}>المواد القوية</Text>
                  <Text style={styles.performanceValue}>{performance.strongSubjects.length}</Text>
                </View>
                <View style={styles.performanceItem}>
                  <Text style={styles.performanceLabel}>المواد الضعيفة</Text>
                  <Text style={styles.performanceValue}>{performance.weakSubjects.length}</Text>
                </View>
              </View>
              
              {performance.strongSubjects.length > 0 && (
                <View style={styles.subjectsList}>
                  <Text style={styles.subjectsTitle}>✅ المواد القوية:</Text>
                  {performance.strongSubjects.map((subject: string, index: number) => (
                    <Text key={index} style={styles.subjectItem}>• {subject}</Text>
                  ))}
                </View>
              )}

              {performance.weakSubjects.length > 0 && (
                <View style={styles.subjectsList}>
                  <Text style={styles.subjectsTitle}>❌ المواد الضعيفة:</Text>
                  {performance.weakSubjects.map((subject: string, index: number) => (
                    <Text key={index} style={styles.subjectItem}>• {subject}</Text>
                  ))}
                </View>
              )}

              {performance.improvementAreas.length > 0 && (
                <View style={styles.subjectsList}>
                  <Text style={styles.subjectsTitle}>🔧 مجالات التحسين:</Text>
                  {performance.improvementAreas.map((area: string, index: number) => (
                    <Text key={index} style={styles.subjectItem}>• {area}</Text>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* خطة تحسين GPA */}
          {student.gpa < regulation.minGPAForGraduation && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📊 خطة تحسين المعدل التراكمي</Text>
              <View style={styles.gpaCard}>
                <View style={styles.gpaHeader}>
                  <Text style={styles.gpaCurrent}>المعدل الحالي: {gpaPlan.currentGPA.toFixed(2)}</Text>
                  <Text style={styles.gpaTarget}>المعدل المطلوب: {gpaPlan.targetGPA}</Text>
                </View>
                
                <View style={styles.gpaCourses}>
                  <Text style={styles.gpaCoursesTitle}>المواد المطلوب التركيز عليها:</Text>
                  {gpaPlan.coursesToFocus.map((course: string, index: number) => (
                    <Text key={index} style={styles.gpaCourseItem}>• {course}</Text>
                  ))}
                </View>

                <View style={styles.gpaRecommendations}>
                  <Text style={styles.gpaRecommendationsTitle}>التوصيات:</Text>
                  {gpaPlan.recommendations.map((rec: string, index: number) => (
                    <Text key={index} style={styles.gpaRecommendationItem}>• {rec}</Text>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* خطة التخرج */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🎓 خطة التخرج</Text>
            <View style={styles.graduationCard}>
              <View style={styles.graduationStats}>
                <View style={styles.graduationStat}>
                  <Text style={styles.graduationStatValue}>{graduationPlan.remainingCredits}</Text>
                  <Text style={styles.graduationStatLabel}>ساعة معتمدة متبقية</Text>
                </View>
                <View style={styles.graduationStat}>
                  <Text style={styles.graduationStatValue}>{graduationPlan.remainingSemesters}</Text>
                  <Text style={styles.graduationStatLabel}>فصل دراسي متبقي</Text>
                </View>
                <View style={styles.graduationStat}>
                  <Text style={styles.graduationStatValue}>{graduationPlan.estimatedGraduationDate}</Text>
                  <Text style={styles.graduationStatLabel}>تاريخ التخرج المتوقع</Text>
                </View>
              </View>

              {graduationPlan.risks.length > 0 && (
                <View style={styles.risksList}>
                  <Text style={styles.risksTitle}>⚠️ المخاطر:</Text>
                  {graduationPlan.risks.map((risk: string, index: number) => (
                    <Text key={index} style={styles.riskItem}>• {risk}</Text>
                  ))}
                </View>
              )}

              <View style={styles.graduationRecommendations}>
                <Text style={styles.graduationRecommendationsTitle}>التوصيات:</Text>
                {graduationPlan.recommendations.map((rec: string, index: number) => (
                  <Text key={index} style={styles.graduationRecommendationItem}>• {rec}</Text>
                ))}
              </View>
            </View>
          </View>

          {/* المواد المقترحة */}
          {courseRecommendations.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📚 المواد المقترحة للفصل القادم</Text>
              {courseRecommendations.slice(0, 5).map((course: any, index: number) => (
                <View key={index} style={[styles.courseCard, { borderLeftColor: getPriorityColor(course.priority) }]}>
                  <View style={styles.courseHeader}>
                    <Text style={styles.courseCode}>{course.courseCode}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(course.priority) }]}>
                      <Text style={styles.priorityText}>{course.priority === 'high' ? 'عالية' : course.priority === 'medium' ? 'متوسطة' : 'منخفضة'}</Text>
                    </View>
                  </View>
                  <Text style={styles.courseName}>{course.courseName}</Text>
                  <Text style={styles.courseReason}>{course.reason}</Text>
                  {course.prerequisites.length > 0 && (
                    <Text style={styles.coursePrerequisites}>
                      المتطلبات السابقة: {course.prerequisites.join(', ')}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1e3a8a',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
  },
  studentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  studentId: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
  },
  regulationName: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  warningCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  warningDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
  },
  recommendationsList: {
    marginTop: 10,
  },
  recommendationItem: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 3,
  },
  recommendationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  recommendationDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 10,
  },
  coursesList: {
    marginTop: 10,
  },
  coursesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
  },
  courseItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  performanceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  performanceItem: {
    alignItems: 'center',
    flex: 1,
  },
  performanceLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5,
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  subjectsList: {
    marginBottom: 15,
  },
  subjectsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
  },
  subjectItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  gpaCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  gpaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  gpaCurrent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ef4444',
  },
  gpaTarget: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  gpaCourses: {
    marginBottom: 15,
  },
  gpaCoursesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
  },
  gpaCourseItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  gpaRecommendations: {
    marginTop: 10,
  },
  gpaRecommendationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
  },
  gpaRecommendationItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  graduationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  graduationStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  graduationStat: {
    alignItems: 'center',
    flex: 1,
  },
  graduationStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e3a8a',
  },
  graduationStatLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
    textAlign: 'center',
  },
  risksList: {
    marginBottom: 15,
  },
  risksTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 5,
  },
  riskItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  graduationRecommendations: {
    marginTop: 10,
  },
  graduationRecommendationsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 5,
  },
  graduationRecommendationItem: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  courseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  courseName: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 5,
  },
  courseReason: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 5,
  },
  coursePrerequisites: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
}); 