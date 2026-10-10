import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    // You can log error here
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>حدث خطأ في التطبيق</Text>
          <Text style={styles.error}>{String(this.state.error)}</Text>
          <TouchableOpacity style={styles.button} onPress={() => { this.setState({ hasError: false, error: null }); }}>
            <Text style={styles.buttonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fffbe9', padding: 32 },
  title: { fontSize: 20, color: 'red', marginBottom: 16, fontWeight: 'bold' },
  error: { color: '#b91c1c', marginBottom: 24, textAlign: 'center' },
  button: { backgroundColor: '#1e3a8a', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: 'bold' }
}); 