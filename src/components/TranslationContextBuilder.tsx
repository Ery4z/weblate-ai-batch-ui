import React, { useState, useEffect } from "react";
import TranslationEntry from "./TranslationEntry"; // Import the new component
import {
  fetchFullTranslationFromWeblate,
  fetchTranslationFromOpenRouter,
  submitTranslationToWeblate,
} from "../utils/api"; // Replace with your actual API utilities
import { generateInsight } from "../utils/insights"; // Replace with your actual insights utilities
import { Button, Checkbox, Group, Select } from "@mantine/core";

interface TranslationContextBuilderProps {
  openrouterApiKey: string;
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
}) => {
  const [_, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [batchSize, setBatchSize] = useState(3); // Default batch size is 3
  const [autoSuggest, setAutoSuggest] = useState(false); // Auto-suggest toggle

  const [sourceText, setSourceText] = useState<any | null>(null);
  const [untranslatedText, setUntranslatedText] = useState<any | null>(null);
  const [translatedText, setTranslatedText] = useState<any | null>(null);

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
    fetchWeblateInfo();
  }, [weblateApiKey, weblateProject, weblateComponent, weblateLanguage]);

  return (
    <div style={{ padding: "20px" }}>
      <Group justify="center">
        <Button
          onClick={() => {
            fetchWeblateInfo();
          }}
        >
          {" "}
          Refresh{" "}
        </Button>
      </Group>
      {sourceText && untranslatedText && translatedText ? (
        <div>
          <h1>{weblateProject} Information:</h1>
          <p>Source Language: English</p>
          <p>Target Language: {weblateLanguage}</p>
          <p>Total Strings: {Object.keys(sourceText).length}</p>
          <p>
            Translated Strings ({weblateLanguage}) :{" "}
            {Object.keys(translatedText).length}
          </p>
          <p>
            To Translate ({weblateLanguage}) :{" "}
            {Object.keys(untranslatedText).length}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default TranslationContextBuilder;
