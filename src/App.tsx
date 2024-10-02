import React, { useState } from 'react';
import { Container, Group, Title, Burger } from '@mantine/core';
import TranslationInput from './components/TranslationInput';
import TranslationBatch from './components/TranslationBatch';
import DrawerSettings from './components/DrawerSettings';
import '@mantine/core/styles.css';

const App: React.FC = () => {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [openrouterApiKey, setOpenrouterApiKey] = useState('');
  const [weblateApiKey, setWeblateApiKey] = useState('');
  const [weblateProject, setWeblateProject] = useState('');
  const [weblateComponent, setWeblateComponent] = useState('');
  const [weblateLanguage, setWeblateLanguage] = useState('fr'); // Default to French
  const [model, setModel] = useState('openai/gpt-4o-mini');
  const [insights, setInsights] = useState('');

  return (
    <Container>
      <Group  mb="lg">
        <Title>Weblate Translation Assistant</Title>
        <Burger opened={drawerOpened} onClick={() => setDrawerOpened(!drawerOpened)} />
      </Group>

      <DrawerSettings
        openrouterApiKey={openrouterApiKey}
        setOpenrouterApiKey={setOpenrouterApiKey}
        weblateApiKey={weblateApiKey}
        setWeblateApiKey={setWeblateApiKey}
        weblateProject={weblateProject}
        setWeblateProject={setWeblateProject}
        weblateComponent={weblateComponent}
        setWeblateComponent={setWeblateComponent}
        weblateLanguage={weblateLanguage}
        setWeblateLanguage={setWeblateLanguage}
        model={model}
        setModel={setModel}
        insights={insights}
        setInsights={setInsights}
        drawerOpened={drawerOpened}
        setDrawerOpened={setDrawerOpened}
      />

      <TranslationBatch
        setInsights={setInsights}
        openrouterApiKey={openrouterApiKey}
        weblateApiKey={weblateApiKey}
        weblateProject={weblateProject}
        weblateComponent={weblateComponent}
        weblateLanguage={weblateLanguage}
        model={model}
        insights={insights}
      />
    </Container>
  );
};

export default App;
