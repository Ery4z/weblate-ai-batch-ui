import React, { useEffect, useState } from 'react';
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
  // Internal state for managing form values
  const [localOpenrouterApiKey, setLocalOpenrouterApiKey] = useState(openrouterApiKey);
  const [localWeblateApiKey, setLocalWeblateApiKey] = useState(weblateApiKey);
  const [localWeblateProject, setLocalWeblateProject] = useState(weblateProject);
  const [localWeblateComponent, setLocalWeblateComponent] = useState(weblateComponent);
  const [localWeblateLanguage, setLocalWeblateLanguage] = useState(weblateLanguage);
  const [localModel, setLocalModel] = useState(model);
  const [localInsights, setLocalInsights] = useState(insights);

  // Sync internal state with props when the drawer is opened
  useEffect(() => {
    if (drawerOpened) {
      setLocalOpenrouterApiKey(openrouterApiKey);
      setLocalWeblateApiKey(weblateApiKey);
      setLocalWeblateProject(weblateProject);
      setLocalWeblateComponent(weblateComponent);
      setLocalWeblateLanguage(weblateLanguage);
      setLocalModel(model);
      setLocalInsights(insights);
    }
  }, [drawerOpened, openrouterApiKey, weblateApiKey, weblateProject, weblateComponent, weblateLanguage, model, insights]);

  // Function to save the internal state to the app state
  const handleSave = () => {
    setOpenrouterApiKey(localOpenrouterApiKey);
    setWeblateApiKey(localWeblateApiKey);
    setWeblateProject(localWeblateProject);
    setWeblateComponent(localWeblateComponent);
    setWeblateLanguage(localWeblateLanguage);
    setModel(localModel);
    setInsights(localInsights);
    setDrawerOpened(false);
  };

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
        value={localOpenrouterApiKey}
        onChange={(e) => setLocalOpenrouterApiKey(e.target.value)}
        required
      />
      <TextInput
        label="Weblate API Key"
        placeholder="Enter Weblate API key"
        value={localWeblateApiKey}
        onChange={(e) => setLocalWeblateApiKey(e.target.value)}
        required
        mt="md"
      />
      <TextInput
        label="Weblate Project"
        placeholder="Enter Weblate project slug"
        value={localWeblateProject}
        onChange={(e) => setLocalWeblateProject(e.target.value)}
        required
        mt="md"
      />
      <TextInput
        label="Weblate Component"
        placeholder="Enter Weblate component slug"
        value={localWeblateComponent}
        onChange={(e) => setLocalWeblateComponent(e.target.value)}
        required
        mt="md"
      />
      <TextInput
        label="Weblate Language Code"
        placeholder="Enter language code (e.g., fr for French)"
        value={localWeblateLanguage}
        onChange={(e) => setLocalWeblateLanguage(e.target.value)}
        required
        mt="md"
      />

      <Group mt="md">
        <TextInput
          label="Model"
          placeholder="Enter a model (e.g., openai/gpt-3.5-turbo)"
          value={localModel}
          onChange={(e) => setLocalModel(e.target.value)}
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
        value={localInsights}
        onChange={(e) => setLocalInsights(e.target.value)}
        mt="md"
        autosize
        minRows={4}
      />
      <Button fullWidth mt="lg" onClick={handleSave}>
        Save & Close
      </Button>
    </Drawer>
  );
};

export default DrawerSettings;
