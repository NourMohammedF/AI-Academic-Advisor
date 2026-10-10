import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

interface UniversityLogoImageProps {
  size?: number;
  style?: any;
}

const UniversityLogoImage: React.FC<UniversityLogoImageProps> = ({ 
  size = 60, 
  style 
}) => {
  // استيراد صورة اللوجو
  const logoSource: ImageSourcePropType = require('../assets/alexandria-university-logo.png');

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Image
        source={logoSource}
        style={[styles.logo, { width: size, height: size }]}
        resizeMode="contain"
      />
    </View>
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

export default UniversityLogoImage; 