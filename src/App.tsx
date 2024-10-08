import React, { useEffect, useState } from "react";
import { Container, Group, Title, Burger } from "@mantine/core";
import TranslationBatch from "./components/TranslationBatch";
import DrawerSettings from "./components/DrawerSettings";
import "@mantine/core/styles.css";
import { Tabs } from "@mantine/core";
import TranslationContextBuilder from "./components/TranslationContextBuilder";
const App: React.FC = () => {
  // Initialize state from localStorage or provide defaults
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [openrouterApiKey, setOpenrouterApiKey] = useState(
    () => localStorage.getItem("openrouterApiKey") || ""
  );
  const [weblateApiKey, setWeblateApiKey] = useState(
    () => localStorage.getItem("weblateApiKey") || ""
  );
  const [weblateProject, setWeblateProject] = useState(
    () => localStorage.getItem("weblateProject") || ""
  );
  const [weblateComponent, setWeblateComponent] = useState(
    () => localStorage.getItem("weblateComponent") || ""
  );
  const [weblateLanguage, setWeblateLanguage] = useState(
    () => localStorage.getItem("weblateLanguage") || "fr" // Default to French
  );
  const [model, setModel] = useState(
    () => localStorage.getItem("model") || "openai/gpt-4o-mini"
  );
  const [insights, setInsights] = useState(
    () => localStorage.getItem("insights") || ""
  );

  // Save to localStorage when any settings change
  useEffect(() => {
    localStorage.setItem("openrouterApiKey", openrouterApiKey);
  }, [openrouterApiKey]);

  useEffect(() => {
    localStorage.setItem("weblateApiKey", weblateApiKey);
  }, [weblateApiKey]);

  useEffect(() => {
    localStorage.setItem("weblateProject", weblateProject);
  }, [weblateProject]);

  useEffect(() => {
    localStorage.setItem("weblateComponent", weblateComponent);
  }, [weblateComponent]);

  useEffect(() => {
    localStorage.setItem("weblateLanguage", weblateLanguage);
  }, [weblateLanguage]);

  useEffect(() => {
    localStorage.setItem("model", model);
  }, [model]);

  useEffect(() => {
    localStorage.setItem("insights", insights);
  }, [insights]);

  return (
    <Container>
      <Group mb="lg">
        <Title>Weblate Translation Assistant</Title>
        <Burger
          opened={drawerOpened}
          onClick={() => setDrawerOpened(!drawerOpened)}
        />
      </Group>
      <Tabs defaultValue="bulk">
        <Tabs.List>
          <Tabs.Tab value="bulk">Bulk Translation</Tabs.Tab>
          <Tabs.Tab value="context">Translation Context</Tabs.Tab>
        </Tabs.List>
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

      <Tabs.Panel value="bulk">
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
      </Tabs.Panel>
      <Tabs.Panel value="context">
        <TranslationContextBuilder
          openrouterApiKey={openrouterApiKey}
          weblateApiKey={weblateApiKey}
          weblateProject={weblateProject}
          weblateComponent={weblateComponent}
          weblateLanguage={weblateLanguage}
          model={model}
          />
      </Tabs.Panel>
          </Tabs>
    </Container>
  );
};

export default App;
