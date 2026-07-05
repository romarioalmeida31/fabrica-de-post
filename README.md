# 🎭 Frases pra Esperar o Carnaval - Fábrica de Posts

Uma aplicação completa para gerar, customizar e publicar posts automaticamente para Instagram com tema Carnaval. Sistema inteligente com múltiplos agentes especializados coordenados por um orquestrador central.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Como Executar](#como-executar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Endpoints](#api-endpoints)
- [Configurações Customizáveis](#configurações-customizáveis)
- [Agentes Especializados](#agentes-especializados)
- [Exemplos de Uso](#exemplos-de-uso)

---

## 🎯 Visão Geral

**Frases pra Esperar o Carnaval** é um sistema de automação de posts para Instagram que:

- 🎨 **Gera posts visualmente atraentes** em formato vertical (1080x1350px)
- 🔄 **Publica automaticamente todos os dias** em horários definidos
- 🖼️ **Integra imagens aleatórias** de Carnaval via Unsplash API
- 🎯 **Calcula dias restantes** até o Carnaval 2027
- 📝 **Cria frases engajantes** com captions e hashtags
- 💾 **Cache inteligente** para otimizar requisições de imagens
- 🌈 **Overlays dinâmicos** com cores e transparências variáveis

---

## ✨ Funcionalidades

### 1. **Geração Manual de Posts**
- Interface intuitiva para gerar posts sob demanda
- Entrada de data, frase customizada ou aleatória
- Visualização instantânea da imagem gerada

### 2. **Geração Automática Diária**
- Agendamento via cron jobs
- Horário personalizável
- Frase selecionada aleatoriamente do pool pré-definido
- Execução em background sem interrupção

### 3. **Imagens Dinâmicas com IA**
- **Busca no Unsplash**: Busca por termos carnavalescos (carnival, carnaval, party, celebration, dancing, colorful, feathers, festival, samba, parade)
- **Redimensionamento automático**: Ajusta imagens para 1080x1350px
- **Overlay inteligente**: 5 esquemas de cores com transparências variáveis
- **Fallback**: Usa cores sólidas se nenhuma imagem for encontrada

### 4. **Customização Visual**
- **Fontes tipográficas**:
  - 🎯 **Fredoka One** - Contador de dias (divertida, carnavalesca)
  - 📝 **Baloo 2** - Frase principal (amigável, alegre)
  - ✨ **Poppins** - Assinatura (clean, moderna)
- **Tamanhos dinâmicos**: Fontes variam entre 3 tamanhos diferentes
- **Stroke nos textos**: Melhora legibilidade sobre imagens
- **Cores aleatórias**: Paleta carnival-themed

### 5. **Cache Inteligente**
- Armazena até 20 imagens em memória
- Evita requisições repetidas
- FIFO (First-In-First-Out) quando limite é atingido
- Reduz latência de geração

### 6. **Publicação Simulada**
- Endpoint para simular publicação em redes sociais
- Registra timestamp de publicação
- Histórico completo de posts

---

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────┐
│                  React UI (Vite)                    │
│  - Form de geração manual                           │
│  - Visualização de posts                            │
│  - Toast notifications (react-hot-toast)            │
└──────────────────┬──────────────────────────────────┘
                   │ HTTP/REST API
                   ↓
┌─────────────────────────────────────────────────────┐
│            Express Backend (Node.js)                │
│  ┌───────────────────────────────────────────────┐  │
│  │  API Routes (Generate, Publish, Schedule)     │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  Image Generation Engine                      │  │
│  │  - Sharp (processamento de imagem)            │  │
│  │  - SVG composition                            │  │
│  │  - Overlay rendering                          │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  Orchestrator (coordena 5 agentes)            │  │
│  │  - João Search (frases criativas)             │  │
│  │  - Claudio Contador (dias restantes)          │  │
│  │  - Erico Creator (conceito visual)            │  │
│  │  - Antonio Organizado (review texto)          │  │
│  │  - Julia Social Mídia (captions + hashtags)   │  │
│  └───────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────┐  │
│  │  Integrations                                 │  │
│  │  - Unsplash API (busca de imagens)            │  │
│  │  - node-cron (agendamento)                    │  │
│  │  - node-fetch (requisições HTTP)              │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────┐
│         Storage & External Services                 │
│  - /public/images/ (imagens geradas)                │
│  - Unsplash API (banco de imagens)                  │
│  - Cache em memória (imagens do Unsplash)           │
└─────────────────────────────────────────────────────┘
```

---

## 🛠️ Tecnologias

### Frontend
- **React 18.3.1** - UI framework
- **Vite 5.4.21** - Build tool (ES modules, dev server)
- **React Hot Toast** - Notificações elegantes
- **@fontsource** - Google Fonts (Geist, Fredoka One, Baloo 2, Poppins)

### Backend
- **Node.js** - Runtime
- **Express 4.19.0** - Web framework
- **Sharp 1.x** - Processamento de imagens (PNG, JPEG, WebP)
- **node-cron 4.5.0** - Agendamento de tarefas
- **node-fetch** - HTTP client
- **CORS** - Cross-origin requests

### APIs Externas
- **Unsplash API** - Banco de imagens com permissão de uso

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 16+
- npm 7+

### Instalação

```bash
# Clone ou acesse o diretório do projeto
cd "Projetos/fabrica de post"

# Instale as dependências
npm install

# Build da aplicação
npm run build

# Inicie o servidor
npm run dev
```

### Modo Desenvolvimento
```bash
# Terminal 1: Backend (Express na porta 3001)
npm run server

# Terminal 2: Frontend (Vite na porta 5173)
npm run dev
```

### Modo Produção
```bash
npm run build
npm start
```

A aplicação estará disponível em `http://localhost:3001`

---

## 📁 Estrutura do Projeto

```
fabrica-de-post/
├── src/
│   ├── main.jsx              # Entry point React com importações de fontes
│   ├── App.jsx               # Componente principal com lógica de UI
│   ├── styles.css            # Estilos globais (tema dark, gradientes)
│
├── prompts/
│   └── agents/
│       ├── joao-search.prompt.md          # Gera frases criativas
│       ├── claudio-contador.prompt.md     # Calcula dias restantes
│       ├── erico-creator.prompt.md        # Conceito visual
│       ├── antonio-organizado.prompt.md   # Review de texto
│       ├── julia-social-midia.prompt.md   # Captions e hashtags
│       └── orquestrador-mestre.prompt.md  # Coordena todos os 5
│
├── public/
│   └── images/               # Imagens geradas (PNG)
│
├── dist/                     # Build de produção (Vite)
│
├── server.js                 # Backend Express com toda lógica
├── package.json              # Dependências e scripts
├── vite.config.js            # Configuração Vite
├── index.html                # HTML entry point
└── README.md                 # Este arquivo
```

---

## 🔌 API Endpoints

### 1. **POST /api/generate-post**
Gera um novo post com todos os dados necessários.

**Request:**
```json
{
  "postDate": "2026-07-04",
  "carnavalDate": "2027-02-09",
  "phrase": "O melhor da vida é contar os dias pra chamar o bloco."
}
```

**Response:**
```json
{
  "projeto": "Frases pra Esperar o Carnaval",
  "data_post": "2026-07-04",
  "data_carnaval": "2027-02-09",
  "dias_restantes": 221,
  "imageUrl": "/images/2026-07-04-221.png",
  "post": {
    "formato": "1080x1350",
    "texto_principal": "Faltam 221 dias para o Carnaval",
    "texto_secundario": "O melhor da vida é contar os dias pra chamar o bloco.",
    "assinatura": "Frases pra Esperar o Carnaval",
    "paleta_de_cores": ["#FF4D6D", "#FFD166", "#06D6A0"],
    "descricao_visual": "Post vertical com elementos vibrantes e carnavalescos"
  },
  "legenda": "A contagem começou, meu povo!...",
  "hashtags": ["#Carnaval", "#Carnaval2027", ...],
  "status": "pronto_para_publicar"
}
```

### 2. **POST /api/publish-post**
Simula a publicação de um post em rede social.

**Request:**
```json
{
  "projeto": "Frases pra Esperar o Carnaval",
  "dias_restantes": 221,
  "imageUrl": "/images/2026-07-04-221.png"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Post simulado como publicado com sucesso.",
  "payload": {
    "projeto": "...",
    "publishedAt": "2026-07-04T12:30:45.123Z"
  }
}
```

### 3. **POST /api/schedule-daily**
Agenda a geração automática de posts em horário específico.

**Request:**
```json
{
  "time": "08:30"
}
```

**Response:**
```json
{
  "ok": true,
  "message": "Publicação diária agendada para 08:30"
}
```

### 4. **GET /api/posts**
Retorna lista de todos os posts gerados.

**Response:**
```json
[
  {
    "projeto": "Frases pra Esperar o Carnaval",
    "data_post": "2026-07-04",
    "dias_restantes": 221,
    "imageUrl": "/images/2026-07-04-221.png",
    "status": "pronto_para_publicar"
  }
]
```

### 5. **GET /api/cache-stats**
Retorna estatísticas do cache de imagens.

**Response:**
```json
{
  "cacheSize": 5,
  "cacheLimit": 20,
  "cachedTerms": ["carnival", "party", "samba"],
  "overlaySchemes": ["dark", "medium", "light", "carnival", "purple"],
  "currentOverlayEnabled": true
}
```

### 6. **POST /api/clear-cache**
Limpa o cache de imagens armazenadas em memória.

**Response:**
```json
{
  "ok": true,
  "message": "Cache limpo. 5 imagens removidas."
}
```

---

## ⚙️ Configurações Customizáveis

### Overlay Schemes (em `server.js`)

```javascript
const overlayConfig = {
  enabled: true,  // Ativar/desativar overlay
  colorSchemes: {
    dark: { color: '#000000', opacity: 0.5 },      // Preto opaco
    medium: { color: '#1a1a1a', opacity: 0.45 },   // Cinza escuro
    light: { color: '#333333', opacity: 0.4 },     // Cinza médio
    carnival: { color: '#FF006E', opacity: 0.3 },  // Rosa vibrante
    purple: { color: '#6A0572', opacity: 0.35 }    // Roxo profundo
  }
};
```

### Pool de Frases (em `server.js`)

```javascript
const phrasePool = [
  'A expectativa já começa a bater no compasso da folia.',
  'O melhor da vida é contar os dias pra chamar o bloco.',
  'O Brasil já sente o axé chegando.',
  'A alegria começa antes do primeiro passo no trio.'
];
```

### Termos de Busca Unsplash (em `server.js`)

```javascript
const carnavalSearchTerms = [
  'carnival', 'carnaval', 'party', 'celebration', 
  'dancing', 'colorful', 'feathers', 'festival', 
  'samba', 'parade'
];
```

### Horário Padrão de Agendamento (em `server.js`)

```javascript
let scheduledTime = '08:00';  // HH:MM formato 24h
```

---

## 👥 Agentes Especializados

O sistema utiliza **5 agentes especializados** coordenados por um orquestrador:

### 1. **João Search** - Gerador de Frases
- **Função**: Cria frases criativas, curtas e engajantes sobre Carnaval
- **Output**: Frase única e poética
- **Estilo**: Lúdico, brasileiro, temático

### 2. **Claudio Contador** - Calculador de Dias
- **Função**: Calcula dias restantes entre data atual e Carnaval 2027
- **Output**: Número inteiro de dias
- **Fórmula**: (data_carnaval - data_post) em dias

### 3. **Erico Creator** - Designer Visual
- **Função**: Define conceito visual do post (cores, layout, elementos)
- **Output**: Especificações de design (paleta, tipografia, disposição)
- **Foco**: Instagram 1080x1350px

### 4. **Antonio Organizado** - Revisor de Texto
- **Função**: Valida gramática, clareza e impacto da mensagem
- **Output**: Frase revisada e otimizada
- **Critério**: Máximo 280 caracteres, engajamento alto

### 5. **Julia Social Mídia** - Especialista em Redes
- **Função**: Cria captions virais com emojis e hashtags
- **Output**: Caption completa + lista de hashtags
- **Objetivo**: Maximizar alcance e engajamento

### **Orquestrador Mestre**
- **Função**: Coordena execução dos 5 agentes em sequência
- **Output**: JSON unificado com todos os dados
- **Responsabilidade**: Garantir qualidade e consistência

---

## 📊 Estrutura de Dados - Post JSON

```javascript
{
  // Identificação
  "projeto": "Frases pra Esperar o Carnaval",
  "data_post": "2026-07-04",
  "data_carnaval": "2027-02-09",
  "dias_restantes": 221,

  // Dados Visuais
  "imageUrl": "/images/2026-07-04-221.png",
  "post": {
    "formato": "1080x1350",
    "texto_principal": "Faltam 221 dias para o Carnaval",
    "texto_secundario": "O melhor da vida é contar os dias pra chamar o bloco.",
    "assinatura": "Frases pra Esperar o Carnaval",
    "paleta_de_cores": ["#FF4D6D", "#FFD166", "#06D6A0"],
    "descricao_visual": "Post vertical com elementos vibrantes e carnavalescos para feed do Instagram."
  },

  // Conteúdo Social
  "legenda": "A contagem começou, meu povo! 🎭✨\n\nFaltam 221 dias para o Carnaval...",
  "hashtags": ["#Carnaval", "#Carnaval2027", "#ContagemRegressiva", ...],

  // Status
  "status": "pronto_para_publicar"
}
```

---

## 💡 Exemplos de Uso

### Exemplo 1: Gerar Post Manual

```javascript
// Frontend - src/App.jsx
const handleGenerate = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/generate-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        postDate: '2026-07-04',
        phrase: 'Minha frase customizada aqui'
      })
    });
    
    const result = await response.json();
    console.log('Post gerado:', result.imageUrl);
    setResult(result);
    toast.success('Post gerado com sucesso!');
  } catch (error) {
    toast.error('Erro ao gerar post');
  }
};
```

### Exemplo 2: Agendar Post Diário

```javascript
// Frontend - Agendamento automático
const handleSchedule = async () => {
  const response = await fetch('http://localhost:3001/api/schedule-daily', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ time: '08:30' })
  });
  
  const result = await response.json();
  console.log(result.message); // "Publicação diária agendada para 08:30"
};
```

### Exemplo 3: Publicar Post

```javascript
const handlePublish = async (postData) => {
  const response = await fetch('http://localhost:3001/api/publish-post', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  
  const result = await response.json();
  console.log('Publicado em:', result.payload.publishedAt);
};
```

### Exemplo 4: Consultar Cache

```javascript
// Verificar quanto espaço está em uso
const response = await fetch('http://localhost:3001/api/cache-stats');
const stats = await response.json();

console.log(`Cache: ${stats.cacheSize}/${stats.cacheLimit} slots`);
console.log(`Termos em cache: ${stats.cachedTerms.join(', ')}`);
```

---

## 🎨 Processo de Geração de Imagem

```
1. Buscar imagem no Unsplash
   ↓
   ├─→ Verificar cache primeiro
   │    ├─→ Cache HIT: Usar imagem em cache
   │    └─→ Cache MISS: Buscar via API
   │
   └─→ Download da imagem
   
2. Processar com Sharp
   ├─→ Redimensionar para 1080x1350
   ├─→ Selecionar overlay scheme aleatório
   └─→ Aplicar overlay (cor + transparência)
   
3. Renderizar textos SVG
   ├─→ Contador: Fredoka One (56-60px)
   ├─→ Frase: Baloo 2 (64-72px) com stroke
   └─→ Assinatura: Poppins (34-42px)
   
4. Compositar layers
   ├─→ Imagem + overlay
   ├─→ Texto principal
   └─→ Converter para PNG
   
5. Salvar em /public/images/
   └─→ Retornar URL da imagem
```

---

## 🔍 Troubleshooting

### Erro: "Unsplash API error"
- Verifique a chave da API em `server.js`
- Confirme a conexão com a internet
- Aguarde alguns segundos e tente novamente

### Imagens não aparecem
- Verifique permissões da pasta `/public/images/`
- Limpe o cache: `POST /api/clear-cache`
- Reinicie o servidor

### Posts não agendados
- Confirme o formato HH:MM (ex: "08:30")
- Verifique se o servidor está rodando sem interrupções
- Consulte logs do console

### Fontes não carregando
- Execute `npm run build` novamente
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Verifique conexão de internet

---

## 📝 Notas de Desenvolvimento

- **Data do Carnaval**: Hardcoded como 2027-02-09
- **Limite de Cache**: 20 imagens em memória
- **Tipos de Imagem**: PNG com 8-24 bits
- **Formato Instagram**: 1080x1350px (9:16)
- **Timeout API**: 30 segundos padrão

---

## 📄 Licença

Este projeto é de uso pessoal/comercial para fins carnavalescos.

---

## 🎉 Créditos

- **Unsplash API** - Imagens de alta qualidade
- **Google Fonts** - Tipografia (@fontsource)
- **Sharp** - Processamento de imagens
- **Express & Node.js** - Backend robusto

---

**Aproveite a folia! 🎭✨🎉**
