import { readPDFFile } from './pdfReader';

export interface CurriculumContext {
  regulationName: string;
  totalCredits: number;
  courses: CourseInfo[];
  rules: AcademicRule[];
  graduationRequirements: GraduationRequirement[];
}

export interface CourseInfo {
  code: string;
  name: string;
  arabicName: string;
  credits: number;
  semester: number;
  academicYear: number;
  prerequisites: string[];
  isRequired: boolean;
  description: string;
}

export interface AcademicRule {
  id: string;
  title: string;
  description: string;
  type: 'gpa' | 'credits' | 'prerequisites' | 'graduation';
  conditions: {
    minGPA?: number;
    maxFailures?: number;
    requiredCredits?: number;
    maxSemesters?: number;
  };
}

export interface GraduationRequirement {
  type: string;
  description: string;
  minimum: number;
  current?: number;
  status: 'completed' | 'in_progress' | 'not_started';
}

export interface StudentAnalysis {
  studentId: string;
  name: string;
  currentGPA: number;
  completedCredits: number;
  remainingCredits: number;
  completedCourses: string[];
  failedCourses: string[];
  remainingCourses: string[];
  warnings: AnalysisWarning[];
  recommendations: AnalysisRecommendation[];
  graduationPlan: GraduationPlan;
}

export interface AnalysisWarning {
  type: 'gpa' | 'failures' | 'prerequisites' | 'credits';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  recommendations: string[];
}

export interface AnalysisRecommendation {
  type: 'course_selection' | 'gpa_improvement' | 'study_plan';
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  courses?: string[];
  actions: string[];
}

export interface GraduationPlan {
  estimatedGraduationDate: string;
  remainingSemesters: number;
  coursesPerSemester: CourseInfo[][];
  risks: string[];
  recommendations: string[];
}

class RAGSystem {
  private curriculumContext: CurriculumContext | null = null;
  private OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || "";

  // Initialize RAG system with curriculum PDF
  async initializeCurriculum(regulationName: string): Promise<void> {
    try {
      // Load curriculum data based on regulation
      this.curriculumContext = await this.loadCurriculumData(regulationName);
      console.log('RAG System initialized with curriculum:', regulationName);
    } catch (error) {
      console.error('Error initializing RAG system:', error);
      throw error;
    }
  }

  // Load curriculum data for different regulations
  private async loadCurriculumData(regulationName: string): Promise<CurriculumContext> {
    switch (regulationName) {
      case 'طفولة':
        return this.getChildhoodRegulation();
      case 'خاصة':
        return this.getSpecialEducationRegulation();
      case 'رياضية':
        return this.getPhysicalEducationRegulation();
      default:
        return this.getChildhoodRegulation(); // Default
    }
  }

  // Childhood Education Regulation
  private getChildhoodRegulation(): CurriculumContext {
    return {
      regulationName: 'لائحة شعبة الطفولة',
      totalCredits: 132,
      courses: [
        {
          code: 'EDU101',
          name: 'Foundations of Education',
          arabicName: 'أصول التربية',
          credits: 3,
          semester: 1,
          academicYear: 1,
          prerequisites: [],
          isRequired: true,
          description: 'مقدمة في أصول التربية ومبادئها الأساسية'
        },
        {
          code: 'EDU102',
          name: 'Educational Psychology',
          arabicName: 'علم النفس التربوي',
          credits: 3,
          semester: 1,
          academicYear: 1,
          prerequisites: [],
          isRequired: true,
          description: 'دراسة السلوك الإنساني في المواقف التعليمية'
        },
        {
          code: 'EDU103',
          name: 'Curriculum and Teaching Methods',
          arabicName: 'مناهج وطرق التدريس',
          credits: 3,
          semester: 2,
          academicYear: 1,
          prerequisites: ['EDU101'],
          isRequired: true,
          description: 'طرق التدريس الحديثة وتطوير المناهج'
        },
        {
          code: 'CHD201',
          name: 'Child Development',
          arabicName: 'نمو وتطور الطفل',
          credits: 3,
          semester: 1,
          academicYear: 2,
          prerequisites: ['EDU102'],
          isRequired: true,
          description: 'دراسة مراحل نمو وتطور الطفل'
        },
        {
          code: 'CHD202',
          name: 'Early Childhood Education',
          arabicName: 'تربية الطفولة المبكرة',
          credits: 3,
          semester: 2,
          academicYear: 2,
          prerequisites: ['CHD201'],
          isRequired: true,
          description: 'أسس وطرق تربية الأطفال في المراحل المبكرة'
        }
      ],
      rules: [
        {
          id: 'gpa_rule',
          title: 'معدل التخرج',
          description: 'يجب أن يكون المعدل التراكمي 2.0 على الأقل للتخرج',
          type: 'gpa',
          conditions: { minGPA: 2.0 }
        },
        {
          id: 'credits_rule',
          title: 'الساعات المعتمدة',
          description: 'يجب إكمال 132 ساعة معتمدة للتخرج',
          type: 'credits',
          conditions: { requiredCredits: 132 }
        },
        {
          id: 'failures_rule',
          title: 'المواد الراسبة',
          description: 'لا يجوز رسب أكثر من 6 مواد خلال الدراسة',
          type: 'prerequisites',
          conditions: { maxFailures: 6 }
        }
      ],
      graduationRequirements: [
        {
          type: 'credits',
          description: 'الساعات المعتمدة المطلوبة',
          minimum: 132,
          status: 'not_started'
        },
        {
          type: 'gpa',
          description: 'المعدل التراكمي المطلوب',
          minimum: 2.0,
          status: 'not_started'
        },
        {
          type: 'required_courses',
          description: 'المواد الإجبارية',
          minimum: 40,
          status: 'not_started'
        }
      ]
    };
  }

  // Special Education Regulation
  private getSpecialEducationRegulation(): CurriculumContext {
    return {
      regulationName: 'لائحة شعبة التربية الخاصة',
      totalCredits: 132,
      courses: [
        {
          code: 'SPE101',
          name: 'Introduction to Special Education',
          arabicName: 'مقدمة في التربية الخاصة',
          credits: 3,
          semester: 1,
          academicYear: 1,
          prerequisites: [],
          isRequired: true,
          description: 'مقدمة في التربية الخاصة وأسسها'
        }
      ],
      rules: [
        {
          id: 'gpa_rule',
          title: 'معدل التخرج',
          description: 'يجب أن يكون المعدل التراكمي 2.0 على الأقل للتخرج',
          type: 'gpa',
          conditions: { minGPA: 2.0 }
        }
      ],
      graduationRequirements: [
        {
          type: 'credits',
          description: 'الساعات المعتمدة المطلوبة',
          minimum: 132,
          status: 'not_started'
        }
      ]
    };
  }

  // Physical Education Regulation
  private getPhysicalEducationRegulation(): CurriculumContext {
    return {
      regulationName: 'لائحة شعبة التربية الرياضية',
      totalCredits: 132,
      courses: [
        {
          code: 'PED101',
          name: 'Introduction to Physical Education',
          arabicName: 'مقدمة في التربية الرياضية',
          credits: 3,
          semester: 1,
          academicYear: 1,
          prerequisites: [],
          isRequired: true,
          description: 'مقدمة في التربية الرياضية وأسسها'
        }
      ],
      rules: [
        {
          id: 'gpa_rule',
          title: 'معدل التخرج',
          description: 'يجب أن يكون المعدل التراكمي 2.0 على الأقل للتخرج',
          type: 'gpa',
          conditions: { minGPA: 2.0 }
        }
      ],
      graduationRequirements: [
        {
          type: 'credits',
          description: 'الساعات المعتمدة المطلوبة',
          minimum: 132,
          status: 'not_started'
        }
      ]
    };
  }

  // Analyze student data using RAG
  async analyzeStudentData(studentData: any): Promise<StudentAnalysis> {
    if (!this.curriculumContext) {
      throw new Error('RAG System not initialized. Please initialize curriculum first.');
    }

    try {
      const analysis = await this.performRAGAnalysis(studentData);
      return analysis;
    } catch (error) {
      console.error('Error in RAG analysis:', error);
      throw error;
    }
  }

  // Perform RAG-based analysis
  private async performRAGAnalysis(studentData: any): Promise<StudentAnalysis> {
    const context = this.buildAnalysisContext(studentData);
    const prompt = this.buildAnalysisPrompt(context);

    const response = await this.callRAGAPI(prompt);
    return this.parseAnalysisResponse(response, studentData);
  }

  // Build analysis context
  private buildAnalysisContext(studentData: any): string {
    if (!this.curriculumContext) return '';

    const context = `
معلومات اللائحة الدراسية:
- اسم اللائحة: ${this.curriculumContext.regulationName}
- إجمالي الساعات المطلوبة: ${this.curriculumContext.totalCredits}
- المواد المتاحة: ${this.curriculumContext.courses.map(c => `${c.arabicName} (${c.code})`).join(', ')}

قواعد اللائحة:
${this.curriculumContext.rules.map(rule => `- ${rule.title}: ${rule.description}`).join('\n')}

متطلبات التخرج:
${this.curriculumContext.graduationRequirements.map(req => `- ${req.description}: ${req.minimum}`).join('\n')}

بيانات الطالب:
- الاسم: ${studentData.name}
- الرقم الجامعي: ${studentData.studentId}
- النتائج: ${studentData.grades.map(g => `${g.courseName}: ${g.grade}/100`).join(', ')}
`;

    return context;
  }

  // Build analysis prompt
  private buildAnalysisPrompt(context: string): string {
    return `أنت المرشد الأكاديمي الذكي لجامعة الإسكندرية - كلية التربية.

${context}

قم بتحليل نتائج الطالب بناءً على اللائحة الدراسية وقدم:

1. **المعدل التراكمي الحالي**
2. **الساعات المكتملة والمتبقية**
3. **المواد المكتملة والفاشلة**
4. **التحذيرات الأكاديمية** (إن وجدت)
5. **التوصيات المخصصة**
6. **خطة التخرج**

أجب باللغة العربية وبشكل مفصل ومفيد.`;
  }

  // Call RAG API
  private async callRAGAPI(prompt: string): Promise<string> {
    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost",
          "X-Title": "Co App RAG System"
        },
        body: JSON.stringify({
          model: "openai/gpt-4o-mini",
          messages: [
            { 
              role: "system", 
              content: "أنت مرشد أكاديمي ذكي متخصص في تحليل النتائج الدراسية بناءً على اللوائح الرسمية. أجب باللغة العربية وبشكل مفصل ومفيد." 
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0] && data.choices[0].message) {
        return data.choices[0].message.content;
      } else {
        throw new Error('Invalid response from RAG API');
      }
    } catch (error) {
      console.error('Error calling RAG API:', error);
      throw error;
    }
  }

  // Parse analysis response
  private parseAnalysisResponse(response: string, studentData: any): StudentAnalysis {
    // Calculate basic metrics
    const grades = studentData.grades || [];
    const totalCredits = grades.reduce((sum: number, grade: any) => sum + grade.credits, 0);
    const totalGradePoints = grades.reduce((sum: number, grade: any) => {
      const gradePoints = this.calculateGradePoints(grade.grade);
      return sum + (gradePoints * grade.credits);
    }, 0);
    const currentGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;

    const completedCourses = grades.filter((g: any) => g.grade >= 60).map((g: any) => g.courseName);
    const failedCourses = grades.filter((g: any) => g.grade < 60).map((g: any) => g.courseName);

    // Generate warnings
    const warnings = this.generateWarnings(currentGPA, failedCourses.length, totalCredits);

    // Generate recommendations
    const recommendations = this.generateRecommendations(currentGPA, completedCourses, failedCourses);

    // Generate graduation plan
    const graduationPlan = this.generateGraduationPlan(currentGPA, totalCredits, completedCourses);

    return {
      studentId: studentData.studentId,
      name: studentData.name,
      currentGPA: Math.round(currentGPA * 100) / 100,
      completedCredits: totalCredits,
      remainingCredits: (this.curriculumContext?.totalCredits || 132) - totalCredits,
      completedCourses,
      failedCourses,
      remainingCourses: this.getRemainingCourses(completedCourses),
      warnings,
      recommendations,
      graduationPlan
    };
  }

  // Calculate grade points
  private calculateGradePoints(grade: number): number {
    if (grade >= 90) return 4.0;
    if (grade >= 85) return 3.7;
    if (grade >= 80) return 3.3;
    if (grade >= 75) return 3.0;
    if (grade >= 70) return 2.7;
    if (grade >= 65) return 2.3;
    if (grade >= 60) return 2.0;
    if (grade >= 55) return 1.7;
    if (grade >= 50) return 1.3;
    return 0.0;
  }

  // Generate warnings
  private generateWarnings(gpa: number, failures: number, credits: number): AnalysisWarning[] {
    const warnings: AnalysisWarning[] = [];

    if (gpa < 2.0) {
      warnings.push({
        type: 'gpa',
        severity: gpa < 1.5 ? 'critical' : 'high',
        title: 'معدل تراكمي منخفض',
        description: `معدلك التراكمي الحالي (${gpa}) أقل من الحد الأدنى المطلوب (2.0)`,
        recommendations: [
          'ركز على المواد الأساسية لرفع المعدل',
          'احصل على مساعدة أكاديمية إضافية',
          'خطط لدراسة أكثر فعالية'
        ]
      });
    }

    if (failures > 3) {
      warnings.push({
        type: 'failures',
        severity: failures > 5 ? 'critical' : 'high',
        title: 'عدد مواد راسبة مرتفع',
        description: `عدد المواد الراسبة (${failures}) يتجاوز الحد المسموح`,
        recommendations: [
          'راجع أسباب الرسوب في المواد',
          'احصل على دعم أكاديمي',
          'خطط لإعادة دراسة المواد الراسبة'
        ]
      });
    }

    return warnings;
  }

  // Generate recommendations
  private generateRecommendations(gpa: number, completed: string[], failed: string[]): AnalysisRecommendation[] {
    const recommendations: AnalysisRecommendation[] = [];

    if (gpa < 2.5) {
      recommendations.push({
        type: 'gpa_improvement',
        priority: 'high',
        title: 'خطة تحسين المعدل التراكمي',
        description: 'تحتاج لخطة مكثفة لرفع معدلك التراكمي',
        actions: [
          'ركز على المواد الأساسية',
          'احصل على دروس خصوصية',
          'حسن مهارات الدراسة'
        ]
      });
    }

    recommendations.push({
      type: 'course_selection',
      priority: 'medium',
      title: 'توصيات اختيار المواد',
      description: 'اختر المواد المناسبة لمستواك الحالي',
      courses: this.getRecommendedCourses(completed, failed),
      actions: [
        'راجع المتطلبات السابقة للمواد',
        'اختر مواد متوازنة في الصعوبة',
        'استشر المرشد الأكاديمي'
      ]
    });

    return recommendations;
  }

  // Generate graduation plan
  private generateGraduationPlan(gpa: number, credits: number, completed: string[]): GraduationPlan {
    const remainingCredits = (this.curriculumContext?.totalCredits || 132) - credits;
    const estimatedSemesters = Math.ceil(remainingCredits / 18); // Assuming 18 credits per semester

    return {
      estimatedGraduationDate: this.calculateGraduationDate(estimatedSemesters),
      remainingSemesters: estimatedSemesters,
      coursesPerSemester: this.planCoursesPerSemester(remainingCredits, completed),
      risks: this.identifyGraduationRisks(gpa, credits),
      recommendations: [
        'حافظ على معدل تراكمي 2.0 على الأقل',
        'أكمل المتطلبات الإجبارية أولاً',
        'خطط للمواد الصعبة مبكراً'
      ]
    };
  }

  // Helper methods
  private getRemainingCourses(completed: string[]): string[] {
    if (!this.curriculumContext) return [];
    return this.curriculumContext.courses
      .filter(course => !completed.includes(course.arabicName))
      .map(course => course.arabicName);
  }

  private getRecommendedCourses(completed: string[], failed: string[]): string[] {
    if (!this.curriculumContext) return [];
    return this.curriculumContext.courses
      .filter(course => 
        !completed.includes(course.arabicName) && 
        !failed.includes(course.arabicName)
      )
      .slice(0, 5)
      .map(course => course.arabicName);
  }

  private calculateGraduationDate(semesters: number): string {
    const currentDate = new Date();
    const graduationDate = new Date(currentDate);
    graduationDate.setMonth(graduationDate.getMonth() + (semesters * 6));
    return graduationDate.toLocaleDateString('ar-SA');
  }

  private planCoursesPerSemester(remainingCredits: number, completed: string[]): CourseInfo[][] {
    if (!this.curriculumContext) return [];
    
    const semesters: CourseInfo[][] = [];
    const availableCourses = this.curriculumContext.courses.filter(c => 
      !completed.includes(c.arabicName)
    );

    let currentSemester: CourseInfo[] = [];
    let currentCredits = 0;

    for (const course of availableCourses) {
      if (currentCredits + course.credits <= 18) {
        currentSemester.push(course);
        currentCredits += course.credits;
      } else {
        if (currentSemester.length > 0) {
          semesters.push([...currentSemester]);
        }
        currentSemester = [course];
        currentCredits = course.credits;
      }
    }

    if (currentSemester.length > 0) {
      semesters.push(currentSemester);
    }

    return semesters;
  }

  private identifyGraduationRisks(gpa: number, credits: number): string[] {
    const risks: string[] = [];

    if (gpa < 2.0) {
      risks.push('المعدل التراكمي أقل من الحد المطلوب للتخرج');
    }

    if (credits < 100) {
      risks.push('عدد الساعات المكتملة قليل مقارنة بالمطلوب');
    }

    return risks;
  }

  // Get curriculum context
  getCurriculumContext(): CurriculumContext | null {
    return this.curriculumContext;
  }

  // Get course information
  getCourseInfo(courseCode: string): CourseInfo | null {
    if (!this.curriculumContext) return null;
    return this.curriculumContext.courses.find(c => c.code === courseCode) || null;
  }

  // Get all courses
  getAllCourses(): CourseInfo[] {
    return this.curriculumContext?.courses || [];
  }

  // Get academic rules
  getAcademicRules(): AcademicRule[] {
    return this.curriculumContext?.rules || [];
  }
}

// Export singleton instance
export const ragSystem = new RAGSystem();
export default ragSystem; 