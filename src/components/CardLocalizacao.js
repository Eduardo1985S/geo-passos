import { useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import * as Location from 'expo-location';

// Dica de aula:
// GPS (expo-location) usa satélites e sensores locais (alta precisão).
// Geolocalização por IP (ex: http://ip-api.com/json/ via fetch) é estimada pela rede.

export default function CardLocalizacao() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function obterLocalizacao() {
    try {
      setCarregando(true);
      setMensagem('');

      // solicita permissão para acessar a localização
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setMensagem('Permissão de localização negada.');
        return;
      }

      // obtém a posição atual do celular
      const localizacao = await Location.getCurrentPositionAsync({});

      setLatitude(localizacao.coords.latitude);
      setLongitude(localizacao.coords.longitude);
    } catch (error) {
      console.log(error);
      setMensagem('Não foi possível obter sua localização.');
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitulo}>📍 Minha Localização</Text>
      </View>

      <View style={styles.dadoBloco}>
        <Text style={styles.dadoLabel}>Latitude</Text>
        <Text style={styles.dadoValor}>
          {latitude !== null ? latitude.toFixed(6) : '--'}
        </Text>
      </View>

      <View style={styles.dadoBloco}>
        <Text style={styles.dadoLabel}>Longitude</Text>
        <Text style={styles.dadoValor}>
          {longitude !== null ? longitude.toFixed(6) : '--'}
        </Text>
      </View>

      {mensagem ? <Text style={styles.mensagemAlerta}>{mensagem}</Text> : null}

      <Pressable
        style={({ pressed }) => [
          styles.botao,
          styles.botaoAzul,
          pressed && styles.botaoPressionado,
        ]}
        onPress={obterLocalizacao}
        disabled={carregando}
      >
        <Text style={styles.textoBotao}>
          {carregando ? 'Obtendo...' : 'Obter localização'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
  },
  cardTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  dadoBloco: {
    marginBottom: 12,
  },
  dadoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dadoValor: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  mensagemAlerta: {
    fontSize: 13,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 12,
  },
  botao: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  botaoAzul: {
    backgroundColor: '#0284C7',
  },
  botaoPressionado: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
