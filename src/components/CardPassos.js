import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { Pedometer, Accelerometer } from 'expo-sensors';
import { Ionicons, Feather } from '@expo/vector-icons';

export default function CardPassos() {
  const [passos, setPassos] = useState(0);
  const [ativo, setAtivo] = useState(false);
  const [tipoSensor, setTipoSensor] = useState('verificando'); // 'pedometer' | 'accelerometer'
  const [subscription, setSubscription] = useState(null);
  const [mensagem, setMensagem] = useState('');

  // Referências para o algoritmo de contagem de passos via acelerômetro
  const lastStepTime = useRef(0);
  const wasAboveThreshold = useRef(false);

  useEffect(() => {
    // Detecta se o aparelho possui chip dedicado ou se usará o Acelerômetro (ex: Edge 30 Neo)
    async function detectarMelhorSensor() {
      try {
        const pedometerDisponivel = await Pedometer.isAvailableAsync();

        if (pedometerDisponivel) {
          if (Pedometer.getPermissionsAsync) {
            const perm = await Pedometer.getPermissionsAsync();
            if (perm.granted) {
              setTipoSensor('pedometer');
              return;
            }
          } else {
            setTipoSensor('pedometer');
            return;
          }
        }
        setTipoSensor('accelerometer');
      } catch {
        setTipoSensor('accelerometer');
      }
    }

    detectarMelhorSensor();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [subscription]);

  function iniciarComAcelerometro() {
    try {
      setTipoSensor('accelerometer');
      setMensagem('');
      Accelerometer.setUpdateInterval(50); // 50ms para capturar o impacto exato

      const novaSubscricao = Accelerometer.addListener((data) => {
        const { x, y, z } = data;
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        const now = Date.now();

        const LIMIAR_PASSO = 1.18;
        const INTERVALO_MINIMO = 260;

        if (magnitude > LIMIAR_PASSO && !wasAboveThreshold.current) {
          if (now - lastStepTime.current > INTERVALO_MINIMO) {
            wasAboveThreshold.current = true;
            lastStepTime.current = now;
            setPassos((prev) => prev + 1);
          }
        } else if (magnitude < 1.10 || now - lastStepTime.current > 350) {
          wasAboveThreshold.current = false;
        }
      });

      setSubscription(novaSubscricao);
      setAtivo(true);
    } catch (error) {
      console.log(error);
      setMensagem('Não foi possível iniciar o acelerômetro.');
    }
  }

  async function alternarContador() {
    if (ativo) {
      if (subscription) {
        subscription.remove();
        setSubscription(null);
      }
      setAtivo(false);
      return;
    }

    setMensagem('');

    if (tipoSensor === 'pedometer') {
      try {
        if (Pedometer.requestPermissionsAsync) {
          const permissao = await Pedometer.requestPermissionsAsync();
          if (!permissao.granted) {
            iniciarComAcelerometro();
            return;
          }
        }

        const novaSubscricao = Pedometer.watchStepCount((result) => {
          setPassos(result.steps);
        });

        setSubscription(novaSubscricao);
        setAtivo(true);
        return;
      } catch {
        iniciarComAcelerometro();
        return;
      }
    }

    iniciarComAcelerometro();
  }

  function zerarPassos() {
    setPassos(0);
  }

  // Cálculo da porcentagem da meta de 10.000 passos
  const porcentagemMeta = Math.min((passos / 10000) * 100, 100);

  return (
    <View style={styles.card}>
      {/* Cabeçalho do Card */}
      <View style={styles.cardHeader}>
        <View style={styles.cardTituloWrapper}>
          <View style={styles.iconBadgeVerde}>
            <Feather name="zap" size={17} color="#10B981" />
          </View>
          <Text style={styles.cardTitulo}>Contador de Passos</Text>
        </View>

        <Text style={styles.metaTexto}>Meta: 10.000</Text>
      </View>

      {/* Contagem Principal */}
      <View style={styles.centroContainer}>
        <Text style={styles.dadoLabel}>PASSOS REALIZADOS</Text>
        <Text style={styles.passosDestaque}>{passos}</Text>
        <Text style={styles.passosSubtexto}>passos</Text>

        {/* Barra de Progresso */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBar,
              { width: `${Math.max(porcentagemMeta, 3)}%` },
            ]}
          />
        </View>

        {/* Status do Sensor em Pílula */}
        <View style={styles.statusPill}>
          {tipoSensor === 'accelerometer' ? (
            <>
              <Feather
                name="zap"
                size={13}
                color="#F59E0B"
                style={styles.pillIconLeft}
              />
              <Text style={styles.statusPillTexto}>
                Acelerômetro • Motorola Edge 30 Neo
              </Text>
              <Feather
                name="check"
                size={13}
                color="#10B981"
                style={styles.pillIconRight}
              />
            </>
          ) : tipoSensor === 'pedometer' ? (
            <>
              <Ionicons
                name="footsteps"
                size={13}
                color="#10B981"
                style={styles.pillIconLeft}
              />
              <Text style={styles.statusPillTexto}>
                Pedômetro Nativo • Hardware
              </Text>
              <Feather
                name="check"
                size={13}
                color="#10B981"
                style={styles.pillIconRight}
              />
            </>
          ) : (
            <Text style={styles.statusPillTexto}>Identificando sensor...</Text>
          )}
        </View>
      </View>

      {mensagem ? <Text style={styles.mensagemAlerta}>{mensagem}</Text> : null}

      {/* Botão de Ação: Iniciar / Parar */}
      <Pressable
        style={({ pressed }) => [
          styles.botao,
          ativo ? styles.botaoVermelho : styles.botaoVerde,
          pressed && styles.botaoPressionado,
        ]}
        onPress={alternarContador}
      >
        {ativo ? (
          <Ionicons
            name="square"
            size={14}
            color="#FFFFFF"
            style={styles.btnIcon}
          />
        ) : (
          <Ionicons
            name="play"
            size={15}
            color="#FFFFFF"
            style={styles.btnIcon}
          />
        )}
        <Text style={styles.textoBotao}>
          {ativo ? 'Parar contador' : 'Iniciar contador'}
        </Text>
      </Pressable>

      {/* Botão para Zerar */}
      {passos > 0 && !ativo ? (
        <Pressable
          style={({ pressed }) => [
            styles.botaoZerar,
            pressed && styles.botaoPressionado,
          ]}
          onPress={zerarPassos}
        >
          <Feather
            name="rotate-ccw"
            size={13}
            color="#64748B"
            style={styles.btnIcon}
          />
          <Text style={styles.textoBotaoZerar}>Zerar contador</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardTituloWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBadgeVerde: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  metaTexto: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  centroContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  dadoLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  passosDestaque: {
    fontSize: 64,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    lineHeight: 74,
    marginTop: 4,
  },
  passosSubtexto: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 14,
    fontWeight: '500',
  },
  progressTrack: {
    width: '75%',
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 18,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#10B981',
    borderRadius: 3,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  pillIconLeft: {
    marginRight: 6,
  },
  pillIconRight: {
    marginLeft: 6,
  },
  statusPillTexto: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  mensagemAlerta: {
    fontSize: 13,
    color: '#DC2626',
    textAlign: 'center',
    marginBottom: 12,
  },
  botao: {
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  botaoVerde: {
    backgroundColor: '#059669',
  },
  botaoVermelho: {
    backgroundColor: '#DC2626',
  },
  btnIcon: {
    marginRight: 8,
  },
  textoBotao: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  botaoZerar: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  textoBotaoZerar: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  botaoPressionado: {
    opacity: 0.85,
    transform: [{ scale: 0.985 }],
  },
});
