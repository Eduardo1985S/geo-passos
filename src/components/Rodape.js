import { StyleSheet, Text, View } from 'react-native';

export default function Rodape() {
  return (
    <View style={styles.rodape}>
      <Text style={styles.rodapeTitulo}>Tecnologias utilizadas:</Text>
      <Text style={styles.rodapeTexto}>
        Expo Location • Expo Sensors (Pedometer)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rodape: {
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 12,
  },
  rodapeTitulo: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rodapeTexto: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
    marginTop: 2,
  },
});
