import { StyleSheet, SafeAreaView, ScrollView, StatusBar } from 'react-native';

import Header from './src/components/Header';
import CardLocalizacao from './src/components/CardLocalizacao';
import CardPassos from './src/components/CardPassos';
import Rodape from './src/components/Rodape';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F6F8" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Header />
        <CardLocalizacao />
        <CardPassos />
        <Rodape />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
});
