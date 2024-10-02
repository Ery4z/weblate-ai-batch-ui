import React, { useState, useEffect } from "react";
import TranslationEntry from "./TranslationEntry"; // Import the new component
import {
  fetchTranslationFromOpenRouter,
  submitTranslationToWeblate,
} from "../utils/api"; // Replace with your actual API utilities
import { generateInsight } from "../utils/insights"; // Replace with your actual insights utilities
import { Button, Checkbox, Group, Select } from "@mantine/core";

interface Translation {
  id: number;
  source: string;
  translation: string;
  url: string;
  prefill?: string;
}

interface TranslationBatchProps {
  openrouterApiKey: string;
  weblateApiKey: string;
  weblateProject: string;
  weblateComponent: string;
  weblateLanguage: string;
  model: string;
  insights: string;
  setInsights: (insight: string) => void;
}

const TranslationBatch: React.FC<TranslationBatchProps> = ({
  openrouterApiKey,
  weblateApiKey,
  weblateProject,
  weblateComponent,
  weblateLanguage,
  model,
  insights,
  setInsights,
}) => {
  const [untranslatedText, setUntranslatedText] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [batchSize, setBatchSize] = useState(3); // Default batch size is 3
  const [autoSuggest, setAutoSuggest] = useState(false); // Auto-suggest toggle

  useEffect(() => {
    fetchUntranslatedStrings();
  }, [weblateApiKey, weblateProject, weblateComponent, weblateLanguage]);

  const fetchUntranslatedStrings = async () => {
    setLoading(true);
    if (!weblateApiKey || !weblateProject || !weblateComponent || !weblateLanguage) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://hosted.weblate.org/api/translations/${weblateProject}/${weblateComponent}/${weblateLanguage}/units/?q=state%3Auntranslated`,
        {
          headers: { Authorization: `Token ${weblateApiKey}` },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch translations");
      }

      const data = await response.json();
      const untranslatedUnits = data.results.map((unit: any) => ({
        id: unit.id,
        source: unit.source[0],
        translation: unit.target ? unit.target[0] : "",
        url: unit.url,
      }));

      setUntranslatedText(untranslatedUnits);
    } catch (error) {
      console.error(error);
      alert("Error fetching untranslated strings");
    } finally {
      setLoading(false);
    }
  };

  const handlePrefill = async (index: number) => {
    const batch = getBatch();
    const currentTranslation = batch[index];
    if (!currentTranslation) return;

    const textToTranslate = currentTranslation.source;

    const translatedText = await fetchTranslationFromOpenRouter(
      textToTranslate,
      model,
      insights,
      openrouterApiKey
    );

    if (translatedText) {
      const updatedTranslations = [...untranslatedText];
      updatedTranslations[getCurrentPageStartIndex() + index].translation =
        translatedText;
      updatedTranslations[getCurrentPageStartIndex() + index].prefill =
        translatedText; // Save the prefill
      setUntranslatedText(updatedTranslations);
    }
  };

  const handleValidation = async (index: number) => {
    const batch = getBatch();
    const currentTranslation = batch[index];
    if (!currentTranslation) return false;

    const validatedTranslation = currentTranslation.translation;
    const prefilledTranslation = currentTranslation.prefill;
    const originalText = currentTranslation.source;
    const unitId = currentTranslation.id;

    const result = await submitTranslationToWeblate(unitId, validatedTranslation, weblateApiKey);
    if (!result) {
      return false;
    }

    if (validatedTranslation !== prefilledTranslation) {
      const newInsight = await generateInsight(
        originalText,
        prefilledTranslation || "",
        validatedTranslation,
        openrouterApiKey,
        model
      );
      setInsights(insights + "\n" + newInsight); // Append new insight to existing insights
    }
    return true;
  };

  const getBatch = () => {
    const start = getCurrentPageStartIndex();
    return untranslatedText.slice(start, start + batchSize);
  };

  const getCurrentPageStartIndex = () => {
    return currentPage * batchSize;
  };

  const handleInputChange = (index: number, value: string) => {
    const updatedTranslations = [...untranslatedText];
    updatedTranslations[getCurrentPageStartIndex() + index].translation = value;
    setUntranslatedText(updatedTranslations);
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(untranslatedText.length / batchSize) - 1;
    if (currentPage < maxPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Group justify="space-between" style={{ marginBottom: "10px" }}>
        <div>
            <label>
            Batch Size:{" "}
            <Select
                value={batchSize.toString()}
                onChange={(value) => setBatchSize(parseInt(value || "3"))}
                data={[
                { value: "3", label: "3 Translations" },
                { value: "5", label: "5 Translations" },
                { value: "10", label: "10 Translations" },
                ]}
            />
            </label>
        </div>

        <div>
            <Checkbox
            label="Auto Suggest on Display"
            checked={autoSuggest}
            onChange={(event) => setAutoSuggest(event.currentTarget.checked)}
            />
        </div>
        </Group>

      {getBatch().map((item, index) => (
        <TranslationEntry
          key={item.id}
          source={item.source}
          translation={item.translation}
          prefill={item.prefill}
          onTranslationChange={(value) => handleInputChange(index, value)}
          onPrefill={() => handlePrefill(index)}
          onValidate={() => handleValidation(index)}
        />
      ))}

      <div className="mt-6 flex justify-between">
        <Button onClick={handlePreviousPage} disabled={currentPage === 0}>
          Previous Page
        </Button>
        <Button
          onClick={handleNextPage}
          disabled={getCurrentPageStartIndex() >= untranslatedText.length}
        >
          Next Page
        </Button>
      </div>
    </div>
  );
};

export default TranslationBatch;
