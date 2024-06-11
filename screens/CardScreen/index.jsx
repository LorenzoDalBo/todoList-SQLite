import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Appbar, PaperProvider } from 'react-native-paper';

export default function CardScreen({ route }) {
  const { item, index } = route.params;

  return (
    <PaperProvider>

      <View style={styles.container}>
        <Text style={styles.title}>{item.todoTitle}</Text>
        <Text style={styles.text}>{item.todoText}</Text>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    marginTop: 10,
  },
});