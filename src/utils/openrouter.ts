export const requestTranslationFromOpenRouter = async (
    openrouterApiKey: string,
    sourceTexts: string[],
    model: string,
    insights: string,
    context: string = 'UI/UX software elements'
  ): Promise<string | null> => {
    const baseUrl = 'https://openrouter.ai/api/v1/chat/completions';
    const headers = {
      Authorization: `Bearer ${openrouterApiKey}`,
      'Content-Type': 'application/json',
    };
  
    const data = {
      model,
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: `Translate the following from English to French, considering the following context: ${context}. Do not chat, just translate.
          Insights from previous corrections:
          ${insights}`,
        },
        {
          role: 'user',
          content: sourceTexts.join('\n'),
        },
      ],
    };
  
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      });
  
      const responseData = await response.json();
  
      if (responseData.choices && responseData.choices.length > 0) {
        return responseData.choices[0].message.content;
      } else {
        console.error('Error: No translation returned.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching translation:', error);
      return null;
    }
  };
  