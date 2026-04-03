const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function gerarPost(tema) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    Você é um jornalista esportivo especializado em futebol brasileiro.
    Escreva um post completo e otimizado para SEO sobre: ${tema}
    
    Retorne APENAS um JSON válido com esta estrutura:
    {
      "titulo": "título do post com palavra-chave",
      "slug": "titulo-em-kebab-case",
      "resumo": "resumo de 2 linhas para SEO",
      "conteudo": "post completo em HTML com headings h2 e h3",
      "tags": ["tag1", "tag2", "tag3"],
      "tema": "${tema}"
    }
  `;

  const result = await model.generateContent(prompt);
  const texto = result.response.text();
  const json = texto.replace(/```json|```/g, '').trim();
  return JSON.parse(json);
}

module.exports = { gerarPost };