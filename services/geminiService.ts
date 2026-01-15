
import { GoogleGenAI } from "@google/genai";
import { SummaryData, SimulationInputs } from "../types";

export const getFinancialInsight = async (summary: SummaryData, inputs: SimulationInputs) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Como um consultor financeiro especialista, analise esta simulação de juros compostos:
    - Valor Inicial: R$ ${inputs.initialAmount}
    - Aporte Mensal: R$ ${inputs.monthlyContribution}
    - Taxa de Juros: ${inputs.interestRate}% (${inputs.rateType === 'yearly' ? 'ao ano' : 'ao mês'})
    - Período: ${inputs.period} ${inputs.periodType === 'years' ? 'anos' : 'meses'}

    Resultados obtidos:
    - Valor Total Final: R$ ${summary.totalAmount.toFixed(2)}
    - Total Investido: R$ ${summary.totalInvested.toFixed(2)}
    - Total em Juros: R$ ${summary.totalInterest.toFixed(2)}
    - Rendimento sobre o capital: ${summary.yieldPercentage.toFixed(2)}%

    Forneça 3 dicas curtas e práticas em português para o usuário melhorar seu resultado ou entender o poder desse investimento. Seja motivador e técnico.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Não foi possível gerar insights no momento. Mas lembre-se: a constância é a chave para o sucesso financeiro!";
  }
};
