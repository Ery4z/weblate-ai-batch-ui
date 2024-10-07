export const requestTranslationFromOpenRouter = async (
  openrouterApiKey: string,
  sourceTexts: string[],
  model: string,
  insights: string,
  context: string = "UI/UX software elements"
): Promise<string | null> => {
  const baseUrl = "https://openrouter.ai/api/v1/chat/completions";
  const headers = {
    Authorization: `Bearer ${openrouterApiKey}`,
    "Content-Type": "application/json",
  };

  const data = {
    model,
    temperature: 0,
    messages: [
      {
        role: "system",
        content: `Translate the following from English to French, considering the following context: ${context}. Do not chat, just translate.
          Insights from previous corrections:
          ${insights}`,
      },
      {
        role: "user",
        content: sourceTexts.join("\n"),
      },
    ],
  };

  try {
    const response = await fetch(baseUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (responseData.choices && responseData.choices.length > 0) {
      return responseData.choices[0].message.content;
    } else {
      console.error("Error: No translation returned.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching translation:", error);
    return null;
  }
};

export function getTokenEstimate(text: string): number {
  return Math.ceil(text.length / 4.3);
}

export function getCostEstimate(tokenCount: number): number {
  return tokenCount * 0.0001;
}


// Define the type for the model information returned by the API
export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  created: number;
  context_length: number;
  pricing: {
    completion: string;
    prompt: string;
  }
}

// Function to fetch model information from the OpenRouter API
export const getModelsFromOpenRouter = async (openrouterApiKey: string): Promise<ModelInfo[] | null> => {
  const baseUrl = "https://openrouter.ai/api/v1/models";
  const headers = {
    Authorization: `Bearer ${openrouterApiKey}`,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(baseUrl, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      console.error("Error fetching models:", response.statusText);
      return null;
    }

    const responseData = await response.json();
    return responseData.data as ModelInfo[]; // Assuming the models are under "data" key in the response
  } catch (error) {
    console.error("Error fetching models:", error);
    return null;
  }
};

export function estimateCallPrice(model: ModelInfo, tokenCount: number): number {
  // Here we assume the token cost is 0.0001 per token, as mentioned earlier
  const tokenPricePerUnit = 0.0001;

  // Estimate the cost
  const estimatedPrice = tokenCount * tokenPricePerUnit;

  console.log(`Model: ${model.id}, Token Count: ${tokenCount}, Estimated Price: $${estimatedPrice.toFixed(4)}`);
  return estimatedPrice;
}