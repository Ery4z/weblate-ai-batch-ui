import React, { useEffect } from 'react';
import { Drawer, TextInput, Button, Textarea, Group, ActionIcon } from '@mantine/core';

interface DrawerSettingsProps {
  openrouterApiKey: string;
  setOpenrouterApiKey: (key: string) => void;
  weblateApiKey: string;
  setWeblateApiKey: (key: string) => void;
  weblateProject: string;
  setWeblateProject: (project: string) => void;
  weblateComponent: string;
  setWeblateComponent: (component: string) => void;
  weblateLanguage: string;
  setWeblateLanguage: (language: string) => void;
  model: string;
  setModel: (model: string) => void;
  insights: string;
  setInsights: (insights: string) => void;
  drawerOpened: boolean;
  setDrawerOpened: (opened: boolean) => void;
}

const DrawerSettings: React.FC<DrawerSettingsProps> = ({
  openrouterApiKey,
  setOpenrouterApiKey,
  weblateApiKey,
  setWeblateApiKey,
  weblateProject,
  setWeblateProject,
  weblateComponent,
  setWeblateComponent,
  weblateLanguage,
  setWeblateLanguage,
  model,
  setModel,
  insights,
  setInsights,
  drawerOpened,
  setDrawerOpened,
}) => {
  // Load values from localStorage on mount
  useEffect(() => {
    const savedOpenRouterKey = localStorage.getItem('openrouterApiKey');
    const savedWeblateApiKey = localStorage.getItem('weblateApiKey');
    const savedWeblateProject = localStorage.getItem('weblateProject');
    const savedWeblateComponent = localStorage.getItem('weblateComponent');
    const savedWeblateLanguage = localStorage.getItem('weblateLanguage');
    const savedModel = localStorage.getItem('model');
    const savedInsights = localStorage.getItem('insights');

    if (savedOpenRouterKey) setOpenrouterApiKey(savedOpenRouterKey);
    if (savedWeblateApiKey) setWeblateApiKey(savedWeblateApiKey);
    if (savedWeblateProject) setWeblateProject(savedWeblateProject);
    if (savedWeblateComponent) setWeblateComponent(savedWeblateComponent);
    if (savedWeblateLanguage) setWeblateLanguage(savedWeblateLanguage);
    if (savedModel) setModel(savedModel);
    if (savedInsights) setInsights(savedInsights);
  }, []);

  // Save values into localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('openrouterApiKey', openrouterApiKey);
  }, [openrouterApiKey]);

  useEffect(() => {
    localStorage.setItem('weblateApiKey', weblateApiKey);
  }, [weblateApiKey]);

  useEffect(() => {
    localStorage.setItem('weblateProject', weblateProject);
  }, [weblateProject]);

  useEffect(() => {
    localStorage.setItem('weblateComponent', weblateComponent);
  }, [weblateComponent]);

  useEffect(() => {
    localStorage.setItem('weblateLanguage', weblateLanguage);
  }, [weblateLanguage]);

  useEffect(() => {
    localStorage.setItem('model', model);
  }, [model]);

  useEffect(() => {
    localStorage.setItem('insights', insights);
  }, [insights]);

  return (
    <Drawer
      opened={drawerOpened}
      onClose={() => setDrawerOpened(false)}
      title="Settings"
      padding="xl"
      size="md"
    >
      <TextInput
        label="OpenRouter API Key"
        placeholder="Enter OpenRouter API key"
        value={openrouterApiKey}
        onChange={(e) => setOpenrouterApiKey(e.target.value)}
        required
      />
      <TextInput
        label="Weblate API Key"
        placeholder="Enter Weblate API key"
        value={weblateApiKey}
        onChange={(e) => setWeblateApiKey(e.target.value)}
        required
        mt="md"
      />
      <TextInput
        label="Weblate Project"
        placeholder="Enter Weblate project slug"
        value={weblateProject}
        onChange={(e) => setWeblateProject(e.target.value)}
        required
        mt="md"
      />
      <TextInput
        label="Weblate Component"
        placeholder="Enter Weblate component slug"
        value={weblateComponent}
        onChange={(e) => setWeblateComponent(e.target.value)}
        required
        mt="md"
      />
      <TextInput
        label="Weblate Language Code"
        placeholder="Enter language code (e.g., fr for French)"
        value={weblateLanguage}
        onChange={(e) => setWeblateLanguage(e.target.value)}
        required
        mt="md"
      />
      
      {/* Model Input with a clickable question mark to open the link */}
      <Group mt="md" >
        <TextInput
          label="Model"
          placeholder="Enter a model (e.g., openai/gpt-3.5-turbo)"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
          style={{ flex: 1 }}
        />
        <ActionIcon
          onClick={() => window.open('https://openrouter.ai/models', '_blank')}
          title="View available models"
          variant="light"
        >
          ?
        </ActionIcon>
      </Group>

      <Textarea
        label="Translation Insights"
        placeholder="Enter any insights for future translations"
        value={insights}
        onChange={(e) => setInsights(e.target.value)}
        mt="md"
        autosize
        minRows={4}
      />
      <Button fullWidth mt="lg" onClick={() => setDrawerOpened(false)}>
        Save & Close
      </Button>
    </Drawer>
  );
};

export default DrawerSettings;
