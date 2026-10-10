// إعدادات النظام الذكي - المرشد الأكاديمي

export interface AIConfig {
  // إعدادات التحليل الذكي
  smartAnalysis: {
    enabled: boolean;
    confidenceThreshold: number;
    enableContextAnalysis: boolean;
    enableKeywordAnalysis: boolean;
    enableAdvancedAnalysis: boolean;
  };
  
  // مصادر البيانات
  dataSources: {
    universityServices: boolean;
    academicCalendar: boolean;
    courses: boolean;
    gpaCalculator: boolean;
    jokes: boolean;
    timeDate: boolean;
  };
  
  // إعدادات الردود
  responses: {
    enableConfidenceDisplay: boolean;
    enableReasonDisplay: boolean;
    enableSuggestions: boolean;
    enableFallback: boolean;
  };
  
  // إعدادات التخصيص
  customization: {
    universityName: string;
    universityLogo: string;
    primaryColor: string;
    secondaryColor: string;
    language: 'ar' | 'en';
  };
}

// الإعدادات الافتراضية
export const defaultAIConfig: AIConfig = {
  smartAnalysis: {
    enabled: true,
    confidenceThreshold: 0.5,
    enableContextAnalysis: true,
    enableKeywordAnalysis: true,
    enableAdvancedAnalysis: true,
  },
  
  dataSources: {
    universityServices: true,
    academicCalendar: true,
    courses: true,
    gpaCalculator: true,
    jokes: true,
    timeDate: true,
  },
  
  responses: {
    enableConfidenceDisplay: false,
    enableReasonDisplay: false,
    enableSuggestions: true,
    enableFallback: true,
  },
  
  customization: {
    universityName: 'جامعة الإسكندرية',
    universityLogo: 'alexandria-university-logo.png',
    primaryColor: '#1e3a8a', // أزرق داكن
    secondaryColor: '#f59e0b', // ذهبي
    language: 'ar',
  },
};

// دوال مساعدة للتحكم في الإعدادات
export const updateAIConfig = (updates: Partial<AIConfig>): AIConfig => {
  return { ...defaultAIConfig, ...updates };
};

export const getAIConfig = (): AIConfig => {
  // يمكن إضافة منطق لقراءة الإعدادات من التخزين المحلي
  return defaultAIConfig;
};

export const isSmartAnalysisEnabled = (): boolean => {
  const config = getAIConfig();
  return config.smartAnalysis.enabled;
};

export const getConfidenceThreshold = (): number => {
  const config = getAIConfig();
  return config.smartAnalysis.confidenceThreshold;
};

export const isDataSourceEnabled = (source: keyof AIConfig['dataSources']): boolean => {
  const config = getAIConfig();
  return config.dataSources[source];
};

export const shouldShowConfidence = (): boolean => {
  const config = getAIConfig();
  return config.responses.enableConfidenceDisplay;
};

export const shouldShowReason = (): boolean => {
  const config = getAIConfig();
  return config.responses.enableReasonDisplay;
};

export const shouldShowSuggestions = (): boolean => {
  const config = getAIConfig();
  return config.responses.enableSuggestions;
};

export const shouldUseFallback = (): boolean => {
  const config = getAIConfig();
  return config.responses.enableFallback;
}; 