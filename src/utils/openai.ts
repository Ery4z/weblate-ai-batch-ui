// utils/openai.ts

import axios from "axios";
export async function createEmbeddings(
    inputTexts: string[],
    apiKey: string
): Promise<number[][]> {
    const url = "https://api.openai.com/v1/embeddings";

    try {
        const response = await axios.post(
            url,
            {
                input: inputTexts,
                model: "text-embedding-ada-002",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        // Extract embeddings from the response
        const embeddings = response.data.data.map(
            (item: any) => item.embedding
        );

        return embeddings;
    } catch (error: any) {
        console.error(
            "Error creating embeddings:",
            error.response?.data || error.message
        );
        throw error;
    }
}
