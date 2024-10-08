// TranslationContextBuilder.tsx

import React, { useState, useEffect } from "react";
import { Button, Group, Progress, TextInput, Text } from "@mantine/core";
import EmbeddingManager from "./EmbeddingManager";
import { EmbeddingInfo } from "../utils/embeddings";
import { cosineSimilarity } from "../utils/cosineSimilarity"; // We'll create this utility
import { createEmbeddings } from "../utils/openai"; // Import createEmbeddings function
import { fetchFullTranslationFromWeblate } from "../utils/api";
import { getAllEmbeddings } from "../utils/indexeddb"; // Import getAllEmbeddings

interface TranslationContextBuilderProps {
    openaiApiKey: string;
    weblateApiKey: string;
    weblateProject: string;
    weblateComponent: string;
    weblateLanguage: string;
    model: string;
}

const TranslationContextBuilder: React.FC<TranslationContextBuilderProps> = ({
    weblateProject,
    weblateComponent,
    weblateLanguage,
    weblateApiKey,
    openaiApiKey,
}) => {
    const [sourceText, setSourceText] = useState<any | null>(null);
    const [untranslatedText, setUntranslatedText] = useState<any | null>(null);
    const [translatedText, setTranslatedText] = useState<any | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [embeddingDone, setEmbeddingDone] = useState(false);
    const [embeddingToCreate, setEmbeddingToCreate] = useState<EmbeddingInfo[]>(
        []
    );
    const [storedEmbeddings, setStoredEmbeddings] = useState<EmbeddingInfo[]>(
        []
    );
    const [searchResults, setSearchResults] = useState<EmbeddingInfo[]>([]);

    async function fetchWeblateInfo() {
        const sourceText = await fetchFullTranslationFromWeblate(
            weblateProject,
            weblateComponent,
            "en",
            weblateApiKey
        );
        setSourceText(sourceText);
        const untranslatedText = await fetchFullTranslationFromWeblate(
            weblateProject,
            weblateComponent,
            weblateLanguage,
            weblateApiKey,
            "state:<translated"
        );
        setUntranslatedText(untranslatedText);
        const translatedText = await fetchFullTranslationFromWeblate(
            weblateProject,
            weblateComponent,
            weblateLanguage,
            weblateApiKey,
            "state:translated"
        );
        setTranslatedText(translatedText);
    }

    useEffect(() => {
        async function loadEmbeddings() {
            const embeddings = await getAllEmbeddings();
            if (embeddings && embeddings.length > 0) {
                setStoredEmbeddings(embeddings);
                setEmbeddingDone(true);
            }
        }
        loadEmbeddings();
    }, []);

    useEffect(() => {
        fetchWeblateInfo();
    }, [weblateApiKey, weblateProject, weblateComponent, weblateLanguage]);

    useEffect(() => {
        if (sourceText && translatedText) {
            const embeddings: EmbeddingInfo[] = Object.keys(sourceText).map(
                (key) => ({
                    source: sourceText[key],
                    translation: translatedText[key] ? translatedText[key] : "",
                    key: key,
                })
            );
            setEmbeddingToCreate(embeddings);
        }
    }, [sourceText, translatedText]);

    // Load embeddings from localStorage on component mount
    useEffect(() => {
        const embeddingsData = localStorage.getItem("embeddings");
        if (embeddingsData) {
            const embeddings = JSON.parse(embeddingsData);
            setStoredEmbeddings(embeddings);
            setEmbeddingDone(true);
        }
    }, []);

    const performSimilaritySearch = async (query: string) => {
        if (!storedEmbeddings.length) return;

        try {
            // Get embedding for the query
            const queryEmbeddingArray = await createEmbeddings(
                [query],
                openaiApiKey
            );
            const queryEmbedding = queryEmbeddingArray[0];

            const similarities = storedEmbeddings.map((embeddingInfo) => {
                if (!embeddingInfo.embedding) {
                    return { ...embeddingInfo, similarity: 0 };
                }

                const similarity = cosineSimilarity(
                    embeddingInfo.embedding,
                    queryEmbedding
                );
                return { ...embeddingInfo, similarity };
            });

            // Sort results by similarity score
            const sortedResults = similarities.sort(
                (a, b) => b.similarity - a.similarity
            );

            setSearchResults(sortedResults.slice(0, 5)); // Show top 5 results
        } catch (error) {
            console.error("Error performing similarity search:", error);
        }
    };

    const handleSearchQueryChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const query = event.currentTarget.value;
        setSearchQuery(query);

        if (query && embeddingDone) {
            performSimilaritySearch(query);
        } else {
            setSearchResults([]);
        }
    };

    const totalStrings = sourceText ? Object.keys(sourceText).length : 0;
    const translatedStrings = translatedText
        ? Object.keys(translatedText).length
        : 0;
    const translationPercentage =
        totalStrings > 0 ? (translatedStrings / totalStrings) * 100 : 0;

    return (
        <div className="p-5">
            <Group justify="center">
                <Button
                    onClick={() => {
                        fetchWeblateInfo();
                    }}
                >
                    Refresh
                </Button>
            </Group>
            {sourceText && untranslatedText && translatedText ? (
                <div>
                    <h1>{weblateProject} Information:</h1>
                    <p>Source Language: English</p>
                    <p>Target Language: {weblateLanguage}</p>
                    <p>Total Strings: {totalStrings}</p>
                    <p>
                        Translated Strings ({weblateLanguage}):{" "}
                        {translatedStrings}
                    </p>
                    <p>
                        To Translate ({weblateLanguage}):{" "}
                        {Object.keys(untranslatedText).length}
                    </p>
                    <Progress value={translationPercentage} />
                    <p>{translationPercentage.toFixed(2)}% Translated</p>

                    <TextInput
                        placeholder="Search by key or similar text"
                        value={searchQuery}
                        onChange={handleSearchQueryChange}
                        className="mt-5 mb-5"
                    />

                    {/* Display search results */}
                    {searchResults.length > 0 && (
                        <div className="mt-5">
                            <Text fw={500}>Search Results:</Text>
                            {searchResults.map((result) => (
                                <div key={result.key} className="mb-4">
                                    <h3 className="font-bold">{result.key}</h3>
                                    <p>Original: {result.source}</p>
                                    <p>
                                        Translation:{" "}
                                        {result.translation
                                            ? result.translation
                                            : "Not Translated"}
                                    </p>
                                    <p>
                                        Similarity Score:{" "}
                                        {result.similarity
                                            ? result.similarity.toFixed(4)
                                            : "N/A"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Display Embedding Existence */}
                    {embeddingDone ? (
                        <Text color="green" className="mt-5">
                            Embeddings are loaded from IndexedDB.
                        </Text>
                    ) : (
                        <Text color="red" className="mt-5">
                            Embeddings are not available.
                        </Text>
                    )}

                    {/* Embedding Manager */}
                    <EmbeddingManager
                        totalStrings={totalStrings}
                        embeddings={embeddingToCreate}
                        embeddingDone={embeddingDone}
                        setEmbeddingDone={setEmbeddingDone}
                        openaiApiKey={openaiApiKey} // Pass the API key to EmbeddingManager
                    />
                </div>
            ) : null}
        </div>
    );
};

export default TranslationContextBuilder;
