import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import Svg, { Circle, Rect, Polygon, Path, Text, G, Line } from 'react-native-svg';

interface UniversityLogoProps {
  size?: number;
  color?: string;
  secondaryColor?: string;
  useImage?: boolean;
}

const UniversityLogo: React.FC<UniversityLogoProps> = ({ 
  size = 60, 
  color = '#1e3a8a', 
  secondaryColor = '#fbbf24',
  useImage = true
}) => {
  const scale = size / 200;
  const scaledSize = 200 * scale;

  // محاولة استخدام الصورة أولاً
  if (useImage) {
    try {
      const logoSource: ImageSourcePropType = require('../assets/alexandria-university-logo.png');
      
      return (
        <View style={[styles.container, { width: size, height: size }]}>
          <Image
            source={logoSource}
            style={[styles.logo, { width: size, height: size }]}
            resizeMode="contain"
          />
        </View>
      );
    } catch (error) {
      console.log('الصورة غير متوفرة، استخدام SVG كبديل');
      // إذا لم توجد الصورة، استخدم SVG
    }
  }

  // SVG كبديل
  return (
    <Svg width={scaledSize} height={scaledSize} viewBox="0 0 200 200">
      {/* خلفية دائرية */}
      <Circle cx="100" cy="100" r="95" fill={color} stroke={secondaryColor} strokeWidth="2"/>
      
      {/* برج الفنار - القاعدة العريضة */}
      <Rect x="75" y="125" width="50" height="12" fill={secondaryColor} rx="2"/>
      
      {/* برج الفنار - الجزء الرئيسي */}
      <Rect x="82" y="90" width="36" height="35" fill={secondaryColor} rx="1"/>
      <Rect x="84" y="92" width="32" height="31" fill={color}/>
      
      {/* قمة البرج - الجزء العلوي */}
      <Rect x="85" y="80" width="34" height="10" fill={secondaryColor} rx="1"/>
      <Rect x="87" y="82" width="30" height="6" fill={color}/>
      
      {/* قمة البرج - النقطة العليا */}
      <Polygon points="100,70 107,80 93,80" fill={secondaryColor}/>
      
      {/* النوافذ في البرج - صفان */}
      <Rect x="88" y="95" width="6" height="6" fill={secondaryColor}/>
      <Rect x="106" y="95" width="6" height="6" fill={secondaryColor}/>
      <Rect x="88" y="103" width="6" height="6" fill={secondaryColor}/>
      <Rect x="106" y="103" width="6" height="6" fill={secondaryColor}/>
      <Rect x="88" y="111" width="6" height="6" fill={secondaryColor}/>
      <Rect x="106" y="111" width="6" height="6" fill={secondaryColor}/>
      
      {/* البحر */}
      <Path d="M 20 160 Q 50 150 100 160 Q 150 150 180 160 L 180 180 L 20 180 Z" fill="#3b82f6"/>
      
      {/* الشمس */}
      <Circle cx="170" cy="60" r="8" fill={secondaryColor}/>
      <Circle cx="170" cy="60" r="5" fill="#fef3c7"/>
      
      {/* النص العربي - جامعة الإسكندرية */}
      <Text 
        x="100" 
        y="190" 
        textAnchor="middle" 
        fontSize="8" 
        fontWeight="bold" 
        fill={color}
        fontFamily="Arial, sans-serif"
      >
        جامعة الإسكندرية
      </Text>
      
      {/* النص العربي - كلية التربية */}
      <Text 
        x="100" 
        y="200" 
        textAnchor="middle" 
        fontSize="6" 
        fill={color}
        fontFamily="Arial, sans-serif"
      >
        كلية التربية
      </Text>
    </Svg>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    // الصورة ستأخذ الحجم المحدد
  },
});

export default UniversityLogo; 