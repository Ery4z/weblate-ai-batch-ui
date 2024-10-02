import React, { useState, useEffect } from 'react';
import { TextInput, Textarea, Button, Group, LoadingOverlay, Container, Center } from '@mantine/core';
import { fetchTranslationFromOpenRouter, submitTranslationToWeblate } from '../utils/api'; // API Utilities
import { generateInsight } from '../utils/insights'; // Insight Utilities

interface Translation {
  id: number;
  source: string;
  translation: string;
  url: string;
  prefill?: string;
}

interface TranslationInputProps {
  openrouterApiKey: string;
  weblateApiKey: string;
  weblateProject: string;
  weblateComponent: string;
  weblateLanguage: string;
  model: string;
  insights: string;
  setInsights: (insight: string) => void;
}

const TranslationInput: React.FC<TranslationInputProps> = ({
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentTranslation, setCurrentTranslation] = useState<Translation | null>(null);

  useEffect(() => {
    fetchUntranslatedStrings(); // Fetch on mount
  }, []);

  useEffect(() => {
    if (untranslatedText.length > 0) {
      setCurrentTranslation(untranslatedText[currentIndex]);
    }
  }, [untranslatedText, currentIndex]);

  const fetchUntranslatedStrings = async () => {
    setLoading(true);
    if (!weblateApiKey || !weblateProject || !weblateComponent || !weblateLanguage) {
      alert('Please provide your Weblate API key, project, component, and language.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `https://hosted.weblate.org/api/translations/${weblateProject}/${weblateComponent}/${weblateLanguage}/units/?q=state%3Auntranslated`,
        {
          headers: {
            Authorization: `Token ${weblateApiKey}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch translations');
      }

      const data = await response.json();
      const untranslatedUnits = data.results.map((unit: any) => ({
        id: unit.id,
        source: unit.source[0],
        translation: unit.target ? unit.target[0] : '',
        url: unit.url,
      }));

      setUntranslatedText(untranslatedUnits);
    } catch (error) {
      console.error(error);
      alert('Error fetching untranslated strings');
    } finally {
      setLoading(false);
    }
  };

  const handlePrefill = async () => {
    if (!currentTranslation) return;

    const textToTranslate = currentTranslation.source;

    if (!openrouterApiKey) {
      alert('Please provide your OpenRouter API key.');
      return;
    }

    const translatedText = await fetchTranslationFromOpenRouter(
      textToTranslate,
      model,
      insights,
      openrouterApiKey
    );

    if (translatedText) {
      const updatedTranslations = [...untranslatedText];
      updatedTranslations[currentIndex].translation = translatedText;
      updatedTranslations[currentIndex].prefill = translatedText; // Save the prefill
      setUntranslatedText(updatedTranslations);
      setCurrentTranslation(updatedTranslations[currentIndex]);
    }
  };

  const handleValidation = async () => {
    if (!currentTranslation) return;

    const validatedTranslation = currentTranslation.translation;
    const prefilledTranslation = currentTranslation.prefill;
    const originalText = currentTranslation.source;
    const unitId = currentTranslation.id;

    // Submit the validated translation to Weblate
    await submitTranslationToWeblate(unitId, validatedTranslation, weblateApiKey);

    // If the validated translation differs from the prefill, send to the LLM for insight generation
    if (validatedTranslation !== prefilledTranslation) {
      const newInsight = await generateInsight(originalText, prefilledTranslation || "", validatedTranslation, openrouterApiKey, model);
      setInsights(insights + '\n' + newInsight); // Append new insight to existing insights
    }

    // Move to the next translation unit or show success message
    if (currentIndex < untranslatedText.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert('All translations completed');
    }
  };

  const handleInputChange = (value: string) => {
    if (currentTranslation) {
      const updatedTranslations = [...untranslatedText];
      updatedTranslations[currentIndex].translation = value;
      setUntranslatedText(updatedTranslations);
      setCurrentTranslation(updatedTranslations[currentIndex]);
    }
  };

  return (
    <Container>
      <LoadingOverlay visible={loading} />

      <Center>
        <Button onClick={fetchUntranslatedStrings} disabled={loading}>
          Refresh Untranslated Strings
        </Button>
      </Center>

      {currentTranslation && (
        <>
          <TextInput label={`Source: ${currentTranslation.source}`} value={currentTranslation.source} readOnly mb="sm" />

          <Textarea
            label="Translation"
            value={currentTranslation.translation}
            onChange={(e) => handleInputChange(e.target.value)}
            autosize
            minRows={3}
            mb="sm"
          />
          <Center>
            <Group>
              <Button onClick={handlePrefill} disabled={loading}>
                Prefill with OpenRouter
              </Button>
              <Button onClick={handleValidation} disabled={loading}>
                Validate and Submit Translation
              </Button>
            </Group>
          </Center>
        </>
      )}
      
      <Center>
        <Group mt="md">
          <Button onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}>
            Previous
          </Button>
          <Button onClick={() => setCurrentIndex(Math.min(untranslatedText.length - 1, currentIndex + 1))} disabled={currentIndex >= untranslatedText.length - 1}>
            Next
          </Button>
        </Group>
      </Center>
    </Container>
  );
};

export default TranslationInput;
