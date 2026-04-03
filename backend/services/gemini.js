const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function gerarPost(tema) {
  console.log(`🤖 Gerando post sobre: ${tema}`);

  // gemini-2.0-flash é o modelo atual e gratuito
  const model = genAI.getGenerativeModel(
    { model: 'gemini-2.0-flash' },
    { apiVersion: 'v1beta' }
  );

  const prompt = `
    Você é um jornalista esportivo especializado em futebol brasileiro.
    Escreva um post completo e otimizado para SEO sobre: ${tema}
    
    Retorne APENAS um JSON válido com esta estrutura, sem markdown, sem backticks:
    {
      "titulo": "título do post com palavra-chave",
      "slug": "titulo-em-kebab-case",
      "resumo": "resumo de 2 linhas para SEO",
      "conteudo": "<h2>Seção</h2><p>Conteúdo completo em HTML</p>",
      "tags": ["tag1", "tag2", "tag3"],
      "tema": "${tema}"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const texto = result.response.text();
    console.log(`📝 Resposta bruta (200 chars): ${texto.slice(0, 200)}`);

    const json = texto
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(json);
    console.log(`✅ Post parseado: ${parsed.titulo}`);
    return parsed;

  } catch (err) {
    console.error(`❌ Erro na Gemini: ${err.message}`);
    throw err;
  }
}

module.exports = { gerarPost };
