import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import path from 'path';
import { mkdirSync, writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const posts = [];
const imagesDir = path.join(__dirname, 'public', 'images');
mkdirSync(imagesDir, { recursive: true });

let scheduledTime = '08:00';
let cronJob = null;

// Cache de imagens para evitar requisições repetidas
const imageCache = new Map();
const CACHE_LIMIT = 20;

// Configurações de overlay
const overlayConfig = {
  enabled: true,
  colorSchemes: {
    dark: { color: '#000000', opacity: 0.5 },
    medium: { color: '#1a1a1a', opacity: 0.45 },
    light: { color: '#333333', opacity: 0.4 },
    carnival: { color: '#FF006E', opacity: 0.3 },
    purple: { color: '#6A0572', opacity: 0.35 }
  }
};

const phrasePool = [
  'A expectativa já começa a bater no compasso da folia.',
  'O melhor da vida é contar os dias pra chamar o bloco.',
  'O Brasil já sente o axé chegando.',
  'A alegria começa antes do primeiro passo no trio.'
];

const carnavalSearchTerms = ['carnival', 'carnaval', 'party', 'celebration', 'dancing', 'colorful', 'feathers', 'festival', 'samba', 'parade'];

function getFromImageCache(searchTerm) {
  if (imageCache.has(searchTerm)) {
    return imageCache.get(searchTerm);
  }
  return null;
}

function addToImageCache(searchTerm, imageUrl) {
  if (imageCache.size >= CACHE_LIMIT) {
    const firstKey = imageCache.keys().next().value;
    imageCache.delete(firstKey);
  }
  imageCache.set(searchTerm, imageUrl);
}

async function fetchRandomCarnivalImage() {
  try {
    const searchTerm = carnavalSearchTerms[Math.floor(Math.random() * carnavalSearchTerms.length)];
    
    const cachedUrl = getFromImageCache(searchTerm);
    if (cachedUrl) {
      console.log(`Imagem do cache para: ${searchTerm}`);
      return cachedUrl;
    }
    
    const params = new URLSearchParams({
      query: searchTerm,
      client_id: 'kVLPHP5NnHNP3QKsj0V55eWzKDVmTqmFhXW0VN5rUEg',
      orientation: 'portrait',
      count: 1
    });
    
    const response = await fetch(`https://api.unsplash.com/photos/random?${params}`);
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    const imageUrl = data.urls.regular;
    
    addToImageCache(searchTerm, imageUrl);
    console.log(`Imagem buscada e cacheada para: ${searchTerm}`);
    
    return imageUrl;
  } catch (error) {
    console.error('Erro ao buscar imagem:', error);
    return null;
  }
}

async function downloadImage(url) {
  try {
    const response = await fetch(url);
    return await response.buffer();
  } catch (error) {
    console.error('Erro ao fazer download:', error);
    return null;
  }
}

function parseDate(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function calculateDays(postDate, carnavalDate) {
  const start = parseDate(postDate);
  const end = parseDate(carnavalDate);
  return Math.round((end - start) / (1000 * 60 * 60 * 24));
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function buildPost(payload = {}) {
  const postDate = payload.postDate || new Date().toISOString().slice(0, 10);
  const carnavalDate = payload.carnavalDate || '2027-02-09';
  const phrase = payload.phrase || phrasePool[Math.floor(Math.random() * phrasePool.length)];
  const days = calculateDays(postDate, carnavalDate);

  return {
    projeto: 'Frases pra Esperar o Carnaval',
    data_post: postDate,
    data_carnaval: carnavalDate,
    dias_restantes: days,
    post: {
      formato: '1080x1350',
      texto_principal: `Faltam ${days} dias para o Carnaval`,
      texto_secundario: phrase,
      assinatura: 'Frases pra Esperar o Carnaval',
      paleta_de_cores: ['#FF4D6D', '#FFD166', '#06D6A0'],
      descricao_visual: 'Post vertical com elementos vibrantes e carnavalescos para feed do Instagram.'
    },
    legenda: `A contagem começou, meu povo! 🎭✨\n\nFaltam ${days} dias para o Carnaval, mas a energia já tá querendo sair no trio.\n\n${phrase}\n\nQuem aí também já tá contando os dias pra bloquinho, fantasia e axé estourando? 👀\n\n#Carnaval #Carnaval2027 #ContagemRegressiva #FrasesPraEsperarOCarnaval #Axé #Folia`,
    hashtags: ['#Carnaval', '#Carnaval2027', '#ContagemRegressiva', '#FrasesPraEsperarOCarnaval', '#Axé', '#Folia'],
    status: 'pronto_para_publicar'
  };
}

function getRandomColor() {
  const colors = [
    '#FFD166', // Amarelo
    '#FF6B6B', // Vermelho
    '#FF4D6D', // Rosa
    '#FF006E', // Pink vibrante
    '#FB5607', // Laranja
    '#FFBE0B', // Amarelo ouro
    '#FB5607', // Laranja queimado
    '#FF006E', // Magenta
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomPurpleAccent() {
  const purples = [
    '#5D3FD3', // Roxo
    '#7B2CBF', // Roxo escuro
    '#C72C6F', // Magenta roxo
    '#FF006E', // Pink roxo
    '#6A0572', // Roxo profundo
  ];
  return purples[Math.floor(Math.random() * purples.length)];
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

async function createImageFileWithBackground(postData) {
  const baseName = `${postData.data_post}-${postData.dias_restantes}`.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const fileName = `${baseName}.png`;
  const filePath = path.join(imagesDir, fileName);
  const imageUrl = `/images/${fileName}`;
  
  const dias = postData.dias_restantes;
  const frase = postData.post.texto_secundario;
  const assinatura = postData.post.assinatura;
  
  // Selecionar configuração de overlay
  const overlaySchemes = Object.keys(overlayConfig.colorSchemes);
  const selectedScheme = overlaySchemes[Math.floor(Math.random() * overlaySchemes.length)];
  const currentOverlay = overlayConfig.colorSchemes[selectedScheme];
  
  console.log(`Usando overlay scheme: ${selectedScheme}`);
  
  // Buscar imagem de fundo
  const imageUrl_bg = await fetchRandomCarnivalImage();
  let imageBuffer = null;
  
  if (imageUrl_bg) {
    imageBuffer = await downloadImage(imageUrl_bg);
  }
  
  // Criar imagem com Sharp
  let image;
  
  if (imageBuffer) {
    // Usar imagem como fundo
    image = sharp(imageBuffer)
      .resize(1080, 1350, {
        fit: 'cover',
        position: 'center'
      });
  } else {
    // Usar cor sólida se não conseguir imagem
    const bgColor = getRandomColor();
    image = sharp({
      create: {
        width: 1080,
        height: 1350,
        channels: 3,
        background: bgColor
      }
    });
  }
  
  // Adicionar overlay com configurações customizáveis
  if (overlayConfig.enabled) {
    const overlayColor = hexToRgb(currentOverlay.color);
    const overlayAlpha = currentOverlay.opacity;
    
    const overlayBuffer = await sharp({
      create: {
        width: 1080,
        height: 1350,
        channels: 4,
        background: {
          r: overlayColor.r,
          g: overlayColor.g,
          b: overlayColor.b,
          alpha: overlayAlpha
        }
      }
    }).png().toBuffer();
    
    // Adicionar o overlay
    image = image.composite([{ input: overlayBuffer, blend: 'over' }]);
  }
  
  // Criar SVG com o texto com configurações customizáveis
  const fraseWords = frase.split(' ');
  let line1 = '';
  let line2 = '';
  let line3 = '';
  
  if (fraseWords.length <= 3) {
    line1 = fraseWords.join(' ');
  } else if (fraseWords.length <= 6) {
    line1 = fraseWords.slice(0, Math.ceil(fraseWords.length / 2)).join(' ');
    line2 = fraseWords.slice(Math.ceil(fraseWords.length / 2)).join(' ');
  } else {
    line1 = fraseWords.slice(0, Math.ceil(fraseWords.length / 3)).join(' ');
    line2 = fraseWords.slice(Math.ceil(fraseWords.length / 3), Math.ceil(2 * fraseWords.length / 3)).join(' ');
    line3 = fraseWords.slice(Math.ceil(2 * fraseWords.length / 3)).join(' ');
  }
  
  let fraseSvg = `<text x="540" y="500" text-anchor="middle" font-family="Baloo 2, Arial, sans-serif" font-size="68" font-weight="900" fill="#ffffff" stroke="#000000" stroke-width="1">
`;
  fraseSvg += `<tspan x="540" dy="0">${line1}</tspan>`;
  if (line2) fraseSvg += `<tspan x="540" dy="90">${line2}</tspan>`;
  if (line3) fraseSvg += `<tspan x="540" dy="90">${line3}</tspan>`;
  fraseSvg += `</text>`;
  
  // Variar o tamanho da fonte e posicionamento para mais dinamismo
  const fontSizes = { phrase: [68, 72, 64], top: [56, 60, 52], signature: [38, 42, 34] };
  const phraseFontSize = fontSizes.phrase[Math.floor(Math.random() * fontSizes.phrase.length)];
  const topFontSize = fontSizes.top[Math.floor(Math.random() * fontSizes.top.length)];
  const signatureFontSize = fontSizes.signature[Math.floor(Math.random() * fontSizes.signature.length)];
  
  const textSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
    <text x="540" y="140" text-anchor="middle" font-family="Fredoka One, Arial, sans-serif" font-size="${topFontSize}" font-weight="700" fill="#ffffff" opacity="0.95" stroke="#000000" stroke-width="0.5">Faltam ${dias} dias</text>
    ${fraseSvg}
    <text x="540" y="1280" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="${signatureFontSize}" font-weight="700" fill="#ffffff" stroke="#000000" stroke-width="0.5">${escapeXml(assinatura)}</text>
  </svg>`;
  
  const textBuffer = Buffer.from(textSvg);
  
  // Compositar o texto sobre a imagem
  image = image.composite([{ input: textBuffer }]);
  
  // Salvar a imagem
  await image.png().toFile(filePath);
  
  return { filePath, imageUrl };
}

// Manter a função SVG como fallback
async function createImageFileOld(postData) {
  const baseName = `${postData.data_post}-${postData.dias_restantes}`.replace(/[^a-z0-9]+/gi, '-').toLowerCase();
  const fileName = `${baseName}.svg`;
  const filePath = path.join(imagesDir, fileName);
  const imageUrl = `/images/${fileName}`;
  
  const bgColor = getRandomColor();
  const accentColor = getRandomPurpleAccent();
  
  const frase = escapeXml(postData.post.texto_secundario);
  const dias = postData.dias_restantes;
  
  // Quebra a frase em linhas para melhor apresentação
  const fraseWords = frase.split(' ');
  let line1 = '';
  let line2 = '';
  let line3 = '';
  
  if (fraseWords.length <= 3) {
    line1 = fraseWords.join(' ');
  } else if (fraseWords.length <= 6) {
    line1 = fraseWords.slice(0, Math.ceil(fraseWords.length / 2)).join(' ');
    line2 = fraseWords.slice(Math.ceil(fraseWords.length / 2)).join(' ');
  } else {
    line1 = fraseWords.slice(0, Math.ceil(fraseWords.length / 3)).join(' ');
    line2 = fraseWords.slice(Math.ceil(fraseWords.length / 3), Math.ceil(2 * fraseWords.length / 3)).join(' ');
    line3 = fraseWords.slice(Math.ceil(2 * fraseWords.length / 3)).join(' ');
  }

  let fraseSvg = `<text x="540" y="500" text-anchor="middle" font-family="Baloo 2, Arial, sans-serif" font-size="68" font-weight="900" fill="#ffffff">\n`;
  fraseSvg += `<tspan x="540" dy="0">${line1}</tspan>`;
  if (line2) fraseSvg += `<tspan x="540" dy="90">${line2}</tspan>`;
  if (line3) fraseSvg += `<tspan x="540" dy="90">${line3}</tspan>`;
  fraseSvg += `</text>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350"><rect width="1080" height="1350" fill="${bgColor}" /><text x="540" y="140" text-anchor="middle" font-family="Fredoka One, Arial, sans-serif" font-size="56" font-weight="700" fill="#ffffff" opacity="0.85">Faltam ${dias} dias</text>${fraseSvg}<text x="540" y="1280" text-anchor="middle" font-family="Poppins, Arial, sans-serif" font-size="38" font-weight="700" fill="#ffffff">${escapeXml(postData.post.assinatura)}</text></svg>`;

  writeFileSync(filePath, svg, 'utf8');
  return { filePath, imageUrl };
}

async function createImageFile(postData) {
  // Usar a nova função com background
  return await createImageFileWithBackground(postData);
}

async function generateAndStorePost(payload = {}) {
  const postData = buildPost(payload);
  const { imageUrl } = await createImageFile(postData);
  postData.imageUrl = imageUrl;
  posts.push(postData);
  return postData;
}

function scheduleDailyGeneration(time = scheduledTime) {
  scheduledTime = time;
  if (cronJob) {
    cronJob.stop();
  }
  const [hours, minutes] = time.split(':').map(Number);
  cronJob = cron.schedule(`${minutes} ${hours} * * *`, async () => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      await generateAndStorePost({
        postDate: today,
        carnavalDate: '2027-02-09',
        phrase: phrasePool[Math.floor(Math.random() * phrasePool.length)]
      });
      console.log(`Post diário gerado em ${scheduledTime}`);
    } catch (error) {
      console.error('Erro ao gerar post diário:', error);
    }
  });
  return { ok: true, message: `Publicação diária agendada para ${scheduledTime}` };
}


app.post('/api/generate-post', async (req, res) => {
  try {
    const payload = req.body || {};
    const result = await generateAndStorePost(payload);
    res.json(result);
  } catch (error) {
    console.error('Erro ao gerar post:', error);
    res.status(500).json({ error: 'Erro ao gerar o post' });
  }
});

app.post('/api/publish-post', (req, res) => {
  const payload = req.body || {};
  const published = { ...payload, publishedAt: new Date().toISOString() };
  posts.push(published);
  res.json({ ok: true, message: 'Post simulado como publicado com sucesso.', payload: published });
});

app.post('/api/schedule-daily', (req, res) => {
  const result = scheduleDailyGeneration(req.body.time || scheduledTime);
  res.json(result);
});

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// Endpoint para limpar o cache de imagens
app.post('/api/clear-cache', (req, res) => {
  const cacheSize = imageCache.size;
  imageCache.clear();
  res.json({ ok: true, message: `Cache limpo. ${cacheSize} imagens removidas.` });
});

// Endpoint para obter estatísticas do cache
app.get('/api/cache-stats', (req, res) => {
  res.json({
    cacheSize: imageCache.size,
    cacheLimit: CACHE_LIMIT,
    cachedTerms: Array.from(imageCache.keys()),
    overlaySchemes: Object.keys(overlayConfig.colorSchemes),
    currentOverlayEnabled: overlayConfig.enabled
  });
});

app.use('/images', express.static(imagesDir));
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

scheduleDailyGeneration(scheduledTime);

app.listen(3001, () => {
  console.log('Servidor rodando em http://localhost:3001');
});
