import { StyleSheet, Text, View } from 'react-native';

export default function Header() {
  return (
    <View style={styles.header}>
      <Text style={styles.tituloApp}>GeoPassos</Text>
      <Text style={styles.subtituloApp}>
        Demonstração Educacional de Sensores Nativos
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  tituloApp: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  subtituloApp: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
});
