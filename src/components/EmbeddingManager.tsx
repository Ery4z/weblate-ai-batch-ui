import React, { useState } from "react";
import { Button, Modal, Text, Progress, Card } from "@mantine/core";
import { EmbeddingInfo } from "../utils/embeddings";
import { createEmbeddings } from "../utils/openai";
import { saveEmbeddings, clearEmbeddings } from "../utils/indexeddb"; // Import functions

interface EmbeddingManagerProps {
    totalStrings: number;
    embeddings: EmbeddingInfo[];
    embeddingDone: boolean;
    setEmbeddingDone: React.Dispatch<React.SetStateAction<boolean>>;
    openaiApiKey: string;
}

const EmbeddingManager: React.FC<EmbeddingManagerProps> = ({
    totalStrings,
    embeddings,
    embeddingDone,
    setEmbeddingDone,
    openaiApiKey,
}) => {
    const [modalOpened, setModalOpened] = useState(false);
    const [embeddingInProgress, setEmbeddingInProgress] = useState(false);
    const [progressValue, setProgressValue] = useState(0);

    const handleStartEmbedding = async () => {
        setEmbeddingInProgress(true);
        setModalOpened(false);
        setProgressValue(0);

        try {
            // Prepare the input texts
            const inputTexts = embeddings.map((e) => e.source);
            const totalInputs = inputTexts.length;

            // Define batch size and delay
            const batchSize = 1000; // Adjust based on your rate limits and preferences
            const delayBetweenBatches = 50; // Milliseconds

            const embeddingsVectors: number[][] = [];

            // Clear previous embeddings from IndexedDB
            await clearEmbeddings();

            for (let i = 0; i < totalInputs; i += batchSize) {
                const batch = inputTexts.slice(i, i + batchSize);

                // Create embeddings for the current batch
                const batchEmbeddings = await createEmbeddings(
                    batch,
                    openaiApiKey
                );

                embeddingsVectors.push(...batchEmbeddings);

                // Update the progress value
                const progress = ((i + batch.length) / totalInputs) * 100;
                setProgressValue(progress);

                // Wait between batches if needed
                if (i + batchSize < totalInputs) {
                    await new Promise((resolve) =>
                        setTimeout(resolve, delayBetweenBatches)
                    );
                }
            }

            const embeddingsWithVectors = embeddings.map((e, index) => ({
                ...e,
                embedding: embeddingsVectors[index],
            }));

            // Store the embeddings in IndexedDB
            await saveEmbeddings(embeddingsWithVectors);

            setEmbeddingInProgress(false);
            setEmbeddingDone(true);
            setProgressValue(100);
        } catch (error) {
            console.error("Embedding failed:", error);
            setEmbeddingInProgress(false);
        }
    };

    const millionTokenEstimate =
        embeddings
            .map((embedding) => embedding.source.length)
            .reduce((a, b) => a + b, 0) /
        4.3 /
        1e6;

    return (
        <Card withBorder shadow="sm" className="mt-5">
            <Text fw={500} size="lg">
                Embedding Manager
            </Text>
            {embeddingDone ? (
                <Text color="green" size="sm">
                    Embedding is already done.
                </Text>
            ) : (
                <Text color="red" size="sm">
                    Embedding not done.
                </Text>
            )}
            <Button onClick={() => setModalOpened(true)} className="mt-2">
                {embeddingDone ? "Re-Embed Dataset" : "Embed Dataset"}
            </Button>

            <Modal
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                title="Embedding Dataset"
            >
                <Text>
                    This will embed {embeddings.length} strings. Estimated cost:
                    $
                    {(millionTokenEstimate * 0.02).toFixed(
                        millionTokenEstimate * 0.02 > 0.01
                            ? 2
                            : Math.min(
                                  5,
                                  -Math.floor(
                                      Math.log10(millionTokenEstimate * 0.02)
                                  )
                              )
                    )}
                </Text>
                <Button onClick={handleStartEmbedding} className="mt-5">
                    Start Embedding
                </Button>
            </Modal>

            {embeddingInProgress && (
                <div className="mt-5">
                    <Progress value={progressValue} />
                    <Text>{progressValue.toFixed(2)}% Completed</Text>
                </div>
            )}
        </Card>
    );
};

export default EmbeddingManager;
