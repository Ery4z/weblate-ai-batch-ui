export interface EmbeddingInfo {
    source: string;
    embedding?: number[];
    translation: string;
    key: string;
    similarity?: number; // Optional, for search results
}

export function estimateCallPrice(tokenCount: number): number {
    return tokenCount * 0.0001;
}
