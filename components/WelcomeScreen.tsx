import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface WelcomeScreenProps {
  onUploadGrades?: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onUploadGrades }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.uploadButton} onPress={onUploadGrades}>
        <Text style={styles.uploadButtonText}>📊 رفع النتائج الدراسية</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
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
});

export default WelcomeScreen; 