# 📱 GeoPassos - Tutorial Passo a Passo do Zero

Guia completo e didático para construir o **GeoPassos**, um aplicativo mobile desenvolvido com **React Native** e **Expo** para leitura de sensores nativos do dispositivo: **Geolocalização (GPS)** e **Contador de Passos (Pedômetro)**.

---

## 📋 Índice

1. [Sobre o Projeto](#-sobre-o-projeto)
2. [Pré-requisitos](#-pré-requisitos)
3. [Passo 1: Criar o Projeto Expo](#-passo-1-criar-o-projeto-expo)
4. [Passo 2: Instalar as Dependências dos Sensores](#-passo-2-instalar-as-dependências-dos-sensores)
5. [Passo 3: Configurar Permissões Nativas (`app.json`)](#-passo-3-configurar-permissões-nativas-appjson)
6. [Passo 4: Estrutura de Diretórios](#-passo-4-estrutura-de-diretórios)
7. [Passo 5: Criação dos Componentes](#-passo-5-criação-dos-componentes)
   - [5.1 Cabeçalho (`Header.js`)](#51-cabeçalho-srccomponentsheaderjs)
   - [5.2 Rodapé (`Rodape.js`)](#52-rodapé-srccomponentsrodapejs)
   - [5.3 Card de Geolocalização (`CardLocalizacao.js`)](#53-card-de-geolocalização-srccomponentscardlocalizacaojs)
   - [5.4 Card de Contador de Passos (`CardPassos.js`)](#54-card-de-contador-de-passos-srccomponentscardpassosjs)
8. [Passo 6: Montagem da Tela Principal (`App.js`)](#-passo-6-montagem-da-tela-principal-appjs)
9. [Passo 7: Executar e Testar no Aparelho](#-passo-7-executar-e-testar-no-aparelho)
10. [Solução de Problemas (Troubleshooting)](#-solução-de-problemas-troubleshooting)
11. [Conceitos Importantes Aprendidos](#-conceitos-importantes-aprendidos)

---

## 🎯 Sobre o Projeto

O **GeoPassos** demonstra como acessar recursos físicos de um smartphone em aplicações móveis híbridas:
- **`expo-location`**: Acessa o GPS nativo do dispositivo para capturar latitude e longitude com alta precisão.
- **`expo-sensors` (Pedometer)**: Monitora os sensores de movimento (acelerômetro / coprocessador de movimento) para contar os passos do usuário em tempo real.
- **Interface Reativa**: Feedback instantâneo com status dos sensores, tratamento de permissões negadas e estados de carregamento.

---

## 🛠 Pré-requisitos

Antes de iniciar, certifique-se de possuir em sua máquina:
- **Node.js** (versão 18.x ou superior recomendada): [nodejs.org](https://nodejs.org/)
- **npm** (incluso com Node) ou **yarn**
- **Expo Go**: Aplicativo instalado no seu celular físico:
  - [Expo Go no Google Play (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)
  - [Expo Go na App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779)

> **Nota sobre testes de sensores:** Emuladores de computador não possuem sensores físicos de movimento. O contador de passos deve preferencialmente ser testado em um **dispositivo físico real**.

---

## 🚀 Passo 1: Criar o Projeto Expo

Abra seu terminal na pasta desejada e execute o comando de criação do Expo com o template padrão:

```bash
npx create-expo-app@latest geo-passos
```

Entre na pasta do projeto recém-criado:

```bash
cd geo-passos
```

---

## 📦 Passo 2: Instalar as Dependências dos Sensores

Utilizamos o comando `npx expo install` para garantir a instalação de versões perfeitamente compatíveis com o SDK do Expo em uso:

```bash
npx expo install expo-location expo-sensors
```

Essas duas bibliotecas fornecem:
- `expo-location`: Permissões e captura de posição geográfica via GPS.
- `expo-sensors`: Pacote de sensores físicos que inclui o módulo `Pedometer`.

---

## ⚙️ Passo 3: Configurar Permissões Nativas (`app.json`)

Para que o Android e o iOS permitam o acesso ao GPS e aos sensores corporais/movimento, configure as permissões no arquivo `app.json`:

Abra o arquivo `app.json` e configure a seção `ios` e `android`:

```json
{
  "expo": {
    "name": "geo-passos",
    "slug": "geo-passos",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSLocationWhenInUseUsageDescription": "Permita acesso à sua localização para exibir suas coordenadas no app GeoPassos.",
        "NSMotionUsageDescription": "Permita acesso aos sensores de movimento para contar seus passos no app GeoPassos."
      }
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/android-icon-foreground.png",
        "backgroundImage": "./assets/android-icon-background.png",
        "monochromeImage": "./assets/android-icon-monochrome.png"
      },
      "permissions": [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "ACTIVITY_RECOGNITION"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

### Explicação das Permissões:
- **`ACCESS_FINE_LOCATION` & `ACCESS_COARSE_LOCATION`**: Permitem ao app acessar dados exatos e aproximados de GPS no Android.
- **`ACTIVITY_RECOGNITION`**: Permissão necessária a partir do Android 10 para ler dados de contagem de passos físicos.
- **`NSLocationWhenInUseUsageDescription`**: Justificativa exibida na caixa de diálogo de permissão do iOS ao solicitar localização.
- **`NSMotionUsageDescription`**: Justificativa exibida no iOS para uso do sensor de movimento (*CoreMotion*).

---

## 📁 Passo 4: Estrutura de Diretórios

Organize o projeto criando a pasta `src/components`:

```text
geo-passos/
├── assets/
├── src/
│   └── components/
│       ├── Header.js
│       ├── Rodape.js
│       ├── CardLocalizacao.js
│       └── CardPassos.js
├── App.js
├── app.json
├── package.json
└── README.md
```

Crie a pasta executando no terminal:
```bash
mkdir -p src/components
```
*(No Windows PowerShell: `New-Item -ItemType Directory -Force -Path src/components`)*

---

## 🧩 Passo 5: Criação dos Componentes

### 5.1 Cabeçalho (`src/components/Header.js`)

Crie o arquivo `src/components/Header.js` para exibir a identidade visual do app:

```javascript
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
```

---

### 5.2 Rodapé (`src/components/Rodape.js`)

Crie o arquivo `src/components/Rodape.js` indicando as tecnologias nativas utilizadas:

```javascript
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
```

---

### 5.3 Card de Geolocalização (`src/components/CardLocalizacao.js`)

Crie o arquivo `src/components/CardLocalizacao.js`. Ele gerencia a solicitação de permissão em tempo de execução e a captura das coordenadas atuais:

```javascript
import { useState } from 'react';
import { StyleSheet, Text, View, Pressable, Linking } from 'react-native';
import * as Location from 'expo-location';

export default function CardLocalizacao() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [precisao, setPrecisao] = useState(null);
  const [endereco, setEndereco] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function obterLocalizacao() {
    try {
      setCarregando(true);
      setMensagem('');

      // 1. Solicita permissão para acessar a localização em primeiro plano
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        setMensagem('Permissão de localização negada.');
        return;
      }

      // 2. Obtém a posição geográfica atual do celular via GPS
      const localizacao = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const lat = localizacao.coords.latitude;
      const lon = localizacao.coords.longitude;

      setLatitude(lat);
      setLongitude(lon);
      setPrecisao(
        localizacao.coords.accuracy
          ? Math.round(localizacao.coords.accuracy)
          : null
      );

      // 3. Geocodificação reversa: transforma coordenadas em nome de rua, bairro e cidade
      try {
        const respostaEndereco = await Location.reverseGeocodeAsync({
          latitude: lat,
          longitude: lon,
        });

        if (respostaEndereco && respostaEndereco.length > 0) {
          const dados = respostaEndereco[0];
          setEndereco({
            rua: dados.street || dados.name || '',
            numero: dados.streetNumber || '',
            bairro: dados.district || dados.subregion || '',
            cidade: dados.city || dados.subregion || '',
            estado: dados.region || '',
          });
        }
      } catch (errGeo) {
        console.log('Erro na geocodificação reversa:', errGeo);
      }
    } catch (error) {
      console.log(error);
      setMensagem('Não foi possível obter sua localização. Verifique se o GPS está ativado.');
    } finally {
      setCarregando(false);
    }
  }

  function abrirNoMapa() {
    if (latitude && longitude) {
      const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitulo}>📍 Minha Localização</Text>
      </View>

      {/* Endereço Identificado */}
      {endereco ? (
        <View style={styles.enderecoContainer}>
          <Text style={styles.enderecoTitulo}>Endereço identificado:</Text>
          {endereco.rua ? (
            <Text style={styles.enderecoRua}>
              {endereco.rua}
              {endereco.numero ? `, ${endereco.numero}` : ''}
            </Text>
          ) : null}
          <Text style={styles.enderecoCidade}>
            {[endereco.bairro, endereco.cidade, endereco.estado]
              .filter(Boolean)
              .join(' • ')}
          </Text>
        </View>
      ) : null}

      {/* Coordenadas */}
      <View style={styles.coordenadasRow}>
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
      </View>

      {precisao !== null ? (
        <Text style={styles.precisaoTexto}>
          Precisão do GPS: ± {precisao} metros
        </Text>
      ) : null}

      {mensagem ? <Text style={styles.mensagemAlerta}>{mensagem}</Text> : null}

      {/* Botões de Ação */}
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
          {carregando ? 'Buscando GPS...' : '📍 Obter localização'}
        </Text>
      </Pressable>

      {latitude && longitude ? (
        <Pressable
          style={({ pressed }) => [
            styles.botaoMapa,
            pressed && styles.botaoPressionado,
          ]}
          onPress={abrirNoMapa}
        >
          <Text style={styles.textoBotaoMapa}>🗺️ Ver no Google Maps</Text>
        </Pressable>
      ) : null}
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
  enderecoContainer: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  enderecoTitulo: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  enderecoRua: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0C4A6E',
  },
  enderecoCidade: {
    fontSize: 13,
    color: '#0284C7',
    marginTop: 2,
    fontWeight: '500',
  },
  coordenadasRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  dadoBloco: {
    flex: 1,
  },
  dadoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dadoValor: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 2,
  },
  precisaoTexto: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 12,
    textAlign: 'center',
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
  botaoMapa: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  textoBotaoMapa: {
    color: '#15803D',
    fontSize: 14,
    fontWeight: '600',
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
```

---

### 5.4 Card de Contador de Passos (`src/components/CardPassos.js`)

Crie o arquivo `src/components/CardPassos.js`. Ele verifica a disponibilidade do sensor no aparelho, escuta os passos usando subscrição e gerencia o ciclo de vida do sensor para evitar desperdício de bateria:

```javascript
import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Linking } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function CardPassos() {
  const [passos, setPassos] = useState(0);
  const [ativo, setAtivo] = useState(false);
  const [sensorDisponivel, setSensorDisponivel] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [permissaoNegada, setPermissaoNegada] = useState(false);

  useEffect(() => {
    // 1. Verifica se o sensor de pedômetro está disponível no aparelho
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

    // 2. Função de limpeza (cleanup): cancela a subscrição ao desmontar a tela
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [subscription]);

  async function alternarContador() {
    // Caso já esteja ativo, cancela o listener e para a contagem
    if (ativo) {
      if (subscription) {
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

      setPermissaoNegada(false);

      // Solicita permissão de atividade física (quando aplicável)
      if (Pedometer.requestPermissionsAsync) {
        const permissao = await Pedometer.requestPermissionsAsync();
        if (permissao && !permissao.granted) {
          setMensagem('Permissão negada. Ative o acesso à Atividade Física nas permissões do app.');
          setPermissaoNegada(true);
          return;
        }
      }

      // Inicia o listener de passos em tempo real
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

      {permissaoNegada ? (
        <Pressable
          style={({ pressed }) => [
            styles.botaoConfiguracoes,
            pressed && styles.botaoPressionado,
          ]}
          onPress={() => Linking.openSettings()}
        >
          <Text style={styles.textoBotaoConfiguracoes}>
            ⚙️ Abrir Configurações do Celular
          </Text>
        </Pressable>
      ) : null}

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
  botaoConfiguracoes: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  textoBotaoConfiguracoes: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '600',
  },
});
```

---

## 📱 Passo 6: Montagem da Tela Principal (`App.js`)

Substitua o conteúdo de `App.js` na raiz do projeto para integrar todos os componentes em uma visualização com rolagem segura:

```javascript
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
```

---

## 🏃 Passo 7: Executar e Testar no Aparelho

1. Inicie o servidor de desenvolvimento do Expo:
   ```bash
   npx expo start
   ```

2. Um QR Code será exibido no terminal.
3. **No Android**: Abra o app **Expo Go** e escaneie o QR Code.
4. **No iOS**: Abra a câmera nativa do iPhone, aponte para o QR Code e toque no link para abrir no **Expo Go**.
5. **No primeiro uso**: O app solicitará as permissões de acesso:
   - Permissão de **Localização** ao pressionar "Obter localização".
   - Permissão de **Atividade Física / Movimento** ao iniciar o contador de passos.
6. Caminhe alguns metros com o aparelho para ver o número de passos aumentando em tempo real!

---

## ❓ Solução de Problemas (Troubleshooting)

### "Permissão para contagem de passos negada"
Se ao tocar em **"Iniciar contador"** aparecer a mensagem de permissão negada:
1. **O que aconteceu:** O Android ou iOS bloqueou a permissão de Atividade Física/Movimento para o Expo Go (ou você tocou em "Não permitir" anteriormente).
2. **Como resolver no Android:**
   - Abra as **Configurações** do seu celular.
   - Acesse **Apps** > **Expo Go** > **Permissões**.
   - Toque em **Atividade física** (ou *Physical Activity*) e escolha **Permitir**.
   - No app, você também pode tocar no botão **"⚙️ Abrir Configurações do Celular"** que aparece automaticamente quando a permissão é recusada.
3. **Como resolver no iPhone (iOS):**
   - Acesse **Ajustes** > **Expo Go**.
   - Ative a opção **Movimento e Preparo Físico** (*Motion & Fitness*).
   - Volte ao app e inicie o contador.

### Dispositivos sem chip de pedômetro dedicado (ex: Motorola Edge 30 Neo)
- O **Motorola Edge 30 Neo** não possui o chip físico de pedômetro integrado no hardware (`Sensor.TYPE_STEP_COUNTER`).
- Por isso, o sistema Android **não exibe a opção de "Atividade Física"** na lista de permissões do Expo Go.
- **Solução implementada no app:** O app detecta automaticamente esse cenário e ativa o **Acelerômetro** como fallback inteligente para calcular os passos através da variação da gravidade/movimento ($\sqrt{x^2 + y^2 + z^2}$), sem necessitar de permissões bloqueantes!
- 📖 **Veja o guia completo de ajuste de sensibilidade:** [Guia de Calibração dos Passos (CALIBRACAO_PASSOS.md)](file:///c:/Users/sn1090634/Desktop/contador-passos/geo-passos/CALIBRACAO_PASSOS.md).

---

## 💡 Conceitos Importantes Aprendidos

| Conceito | Aplicação no Projeto |
| :--- | :--- |
| **Runtime Permissions** | Solicitação de permissões dinamicamente com `requestForegroundPermissionsAsync` e `requestPermissionsAsync`. |
| **Hardware Subscriptions** | O sensor de passos usa o padrão Observer/Listener com `Pedometer.watchStepCount`. |
| **Limpeza de Memória (Cleanup)** | O retorno do `useEffect` e o botão parar chamam `subscription.remove()`, evitando vazamento de memória e economia de bateria. |
| **Diferença GPS vs IP** | GPS nativo utiliza satélites/hardware interno (alta precisão). Consultas por IP externo dependem da rede e têm precisão regional. |
| **Componentização** | Separação das responsabilidades em cards reutilizáveis com estilos encapsulados via `StyleSheet`. |

---

Desenvolvido para fins de estudo e demonstração de sensores nativos com **Expo** e **React Native**.
