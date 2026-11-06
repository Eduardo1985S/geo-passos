import { StyleSheet, Text, View } from 'react-native';

export default function Rodape() {
  return (
    <View style={styles.rodape}>
      <Text style={styles.rodapeTitulo}>TECNOLOGIAS UTILIZADAS</Text>
      <Text style={styles.rodapeTexto}>
        Expo Location • Expo Sensors (Pedometer)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  rodape: {
    alignItems: 'center',
    marginTop: 12,
    paddingVertical: 16,
  },
  rodapeTitulo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  rodapeTexto: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
});
