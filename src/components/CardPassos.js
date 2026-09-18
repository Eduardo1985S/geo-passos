import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function CardPassos() {
  const [passos, setPassos] = useState(0);
  const [ativo, setAtivo] = useState(false);
  const [sensorDisponivel, setSensorDisponivel] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [mensagem, setMensagem] = useState('');

  useEffect(() => {
    // verifica se o sensor está disponível no aparelho
    async function verificarDisponibilidade() {
      try {
        const disponivel = await Pedometer.isAvailableAsync();
        setSensorDisponivel(disponivel);
      } catch (error) {
        console.log(error);
        setSensorDisponivel(false);
      }
    }

    verificarDisponibilidade();

    // remove o listener do sensor ao sair da tela
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [subscription]);

  async function alternarContador() {
    // para o contador e limpa o listener
    if (ativo) {
      if (subscription) {
        // remove o listener do sensor
        subscription.remove();
        setSubscription(null);
      }
      setAtivo(false);
      return;
    }

    if (!sensorDisponivel) {
      setMensagem('Sensor não disponível neste dispositivo.');
      return;
    }

    try {
      setMensagem('');

      // solicita permissão de atividade física quando necessário
      if (Pedometer.requestPermissionsAsync) {
        const permissao = await Pedometer.requestPermissionsAsync();
        if (permissao && !permissao.granted) {
          setMensagem('Permissão para contagem de passos negada.');
          return;
        }
      }

      // começa a observar os passos
      const novaSubscricao = Pedometer.watchStepCount((result) => {
        setPassos(result.steps);
      });

      setSubscription(novaSubscricao);
      setAtivo(true);
    } catch (error) {
      console.log(error);
      setMensagem('Erro ao iniciar o sensor de passos.');
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitulo}>🚶 Contador de Passos</Text>
      </View>

      <Text style={styles.dadoLabel}>Passos realizados</Text>
      <Text style={styles.passosDestaque}>{passos}</Text>
      <Text style={styles.passosSubtexto}>passos</Text>

      {/* Status do Sensor */}
      <View style={styles.statusSensorContainer}>
        <Text style={styles.statusSensorTexto}>
          Status:{' '}
          {sensorDisponivel === null
            ? 'Verificando sensor...'
            : sensorDisponivel
            ? 'Sensor disponível ✅'
            : 'Sensor indisponível ❌'}
        </Text>
      </View>

      {mensagem ? <Text style={styles.mensagemAlerta}>{mensagem}</Text> : null}

      <Pressable
        style={({ pressed }) => [
          styles.botao,
          ativo ? styles.botaoVermelho : styles.botaoVerde,
          pressed && styles.botaoPressionado,
        ]}
        onPress={alternarContador}
      >
        <Text style={styles.textoBotao}>
          {ativo ? '⏹ Parar contador' : '🚶 Iniciar contador'}
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
  dadoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  passosDestaque: {
    fontSize: 54,
    fontWeight: 'bold',
    color: '#16A34A',
    textAlign: 'center',
    marginTop: 8,
  },
  passosSubtexto: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 16,
  },
  statusSensorContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  statusSensorTexto: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
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
  botaoVerde: {
    backgroundColor: '#16A34A',
  },
  botaoVermelho: {
    backgroundColor: '#DC2626',
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
