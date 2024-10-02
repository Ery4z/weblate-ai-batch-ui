export const fetchTranslationFromOpenRouter = async (
    text: string,
    model: string,
    insights: string,
    apiKey: string
  ): Promise<string> => {
    const data = {
      model,
      temperature: 0,
      messages: [
        {
          role: 'system',
          content: `Translate the following from English to French. Consider the context: UI/UX software elements.\nInsights from previous translations: ${insights}`,
        },
        {
          role: 'user',
          content: text,
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
  
  export const submitTranslationToWeblate = async (
    unitId: number,
    translation: string,
    apiKey: string
  ) => {
    try {
      const response = await fetch(`https://hosted.weblate.org/api/units/${unitId}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          target: [translation], // Weblate expects `target` as an array of strings
          state: 20, // Set the state as "translated"
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to submit translation for unit ID ${unitId}`);
      }
  
      return response.json();
    } catch (error: any) {
      console.error(error);
      return null;
    }
  };
  