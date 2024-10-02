export const generateInsight = async (
  original: string,
  prefill: string,
  validated: string,
  apiKey: string,
  model: string
): Promise<string> => {
  const data = {
    model,
    messages: [
      {
        role: 'system',
        content: 'Analyze the differences between the prefill and the validated translation, and provide insights to improve future translations.',
      },
      {
        role: 'user',
        content: `Original Text: ${original}\nPrefilled Translation: ${prefill}\nValidated Translation: ${validated}`,
      },
    ],
  };

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const responseData = await response.json();
  return responseData.choices[0]?.message?.content || '';
};


export const loadInsights = (): string => {
    const storedInsights = localStorage.getItem('translation_insights');
    return storedInsights ? storedInsights : '';
  };
  
  export const saveInsight = (newInsight: string): void => {
    const existingInsights = loadInsights();
    const updatedInsights = `${existingInsights}\n${newInsight}`;
    localStorage.setItem('translation_insights', updatedInsights);
  };
  