import React, { useEffect, useState } from "react";
import {
    Drawer,
    TextInput,
    Button,
    Textarea,
    Group,
    ActionIcon,
    Select,
} from "@mantine/core";
import { getModelsFromOpenRouter, ModelInfo } from "../utils/openrouter";

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
    const [localOpenrouterApiKey, setLocalOpenrouterApiKey] =
        useState(openrouterApiKey);
    const [localWeblateApiKey, setLocalWeblateApiKey] = useState(weblateApiKey);
    const [localWeblateProject, setLocalWeblateProject] =
        useState(weblateProject);
    const [localWeblateComponent, setLocalWeblateComponent] =
        useState(weblateComponent);
    const [localWeblateLanguage, setLocalWeblateLanguage] =
        useState(weblateLanguage);
    const [localModel, setLocalModel] = useState(model);
    const [localInsights, setLocalInsights] = useState(insights);
    const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]); // [1

  


    // Load data from localStorage when the drawer is opened
    useEffect(() => {
        if (drawerOpened) {
            const storedOpenrouterApiKey =
                localStorage.getItem("openrouterApiKey") || openrouterApiKey;
            const storedWeblateApiKey =
                localStorage.getItem("weblateApiKey") || weblateApiKey;
            const storedWeblateProject =
                localStorage.getItem("weblateProject") || weblateProject;
            const storedWeblateComponent =
                localStorage.getItem("weblateComponent") || weblateComponent;
            const storedWeblateLanguage =
                localStorage.getItem("weblateLanguage") || weblateLanguage;
            const storedModel = localStorage.getItem("model") || model;
            const storedInsights = localStorage.getItem("insights") || insights;

            // Set local state with stored values
            setLocalOpenrouterApiKey(storedOpenrouterApiKey);
            setLocalWeblateApiKey(storedWeblateApiKey);
            setLocalWeblateProject(storedWeblateProject);
            setLocalWeblateComponent(storedWeblateComponent);
            setLocalWeblateLanguage(storedWeblateLanguage);
            setLocalModel(storedModel);
            setLocalInsights(storedInsights);

            // Update global state as well
            setOpenrouterApiKey(storedOpenrouterApiKey);
            setWeblateApiKey(storedWeblateApiKey);
            setWeblateProject(storedWeblateProject);
            setWeblateComponent(storedWeblateComponent);
            setWeblateLanguage(storedWeblateLanguage);
            setModel(storedModel);
            setInsights(storedInsights);
        }
    }, [
        drawerOpened,
        openrouterApiKey,
        weblateApiKey,
        weblateProject,
        weblateComponent,
        weblateLanguage,
        model,
        insights,
        setOpenrouterApiKey,
        setWeblateApiKey,
        setWeblateProject,
        setWeblateComponent,
        setWeblateLanguage,
        setModel,
        setInsights,
    ]);

    useEffect(() =>  {
        // Fetch available models when OpenRouter API key is updated

        if (!openrouterApiKey) {
            if (localStorage.getItem("availableModels")) {
                try {

                    setAvailableModels(JSON.parse(localStorage.getItem("availableModels") || "[]"));
                }
                catch (error) {
                 setAvailableModels([]);
                }

            }
            return;
        }

        getModelsFromOpenRouter(openrouterApiKey).then((models) => {
            if (models) {
                setAvailableModels(models);
                localStorage.setItem("availableModels", JSON.stringify(availableModels));

            }
        });

    }, [openrouterApiKey]);

    const handleSave = () => {
        // Save to global state
        setOpenrouterApiKey(localOpenrouterApiKey);
        setWeblateApiKey(localWeblateApiKey);
        setWeblateProject(localWeblateProject);
        setWeblateComponent(localWeblateComponent);
        setWeblateLanguage(localWeblateLanguage);
        setModel(localModel);
        setInsights(localInsights);

        // Save to localStorage
        localStorage.setItem("openrouterApiKey", localOpenrouterApiKey);
        localStorage.setItem("weblateApiKey", localWeblateApiKey);
        localStorage.setItem("weblateProject", localWeblateProject);
        localStorage.setItem("weblateComponent", localWeblateComponent);
        localStorage.setItem("weblateLanguage", localWeblateLanguage);
        localStorage.setItem("model", localModel);
        localStorage.setItem("insights", localInsights);
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
                onChange={(e: any) => setLocalOpenrouterApiKey(e.target.value)}
                required
            />
            <TextInput
                label="Weblate API Key"
                placeholder="Enter Weblate API key"
                value={localWeblateApiKey}
                onChange={(e: any) => setLocalWeblateApiKey(e.target.value)}
                required
                mt="md"
            />
            <TextInput
                label="Weblate Project"
                placeholder="Enter Weblate project slug"
                value={localWeblateProject}
                onChange={(e: any) => setLocalWeblateProject(e.target.value)}
                required
                mt="md"
            />
            <TextInput
                label="Weblate Component"
                placeholder="Enter Weblate component slug"
                value={localWeblateComponent}
                onChange={(e: any) => setLocalWeblateComponent(e.target.value)}
                required
                mt="md"
            />
            <TextInput
                label="Weblate Language Code"
                placeholder="Enter language code (e.g., fr for French)"
                value={localWeblateLanguage}
                onChange={(e: any) => setLocalWeblateLanguage(e.target.value)}
                required
                mt="md"
            />

            <Group mt="md">
                <Select
                    label="Model"
                    placeholder="Enter a model (e.g., openai/gpt-3.5-turbo)"
                    value={localModel}
                    onChange={(e: any) => setLocalModel(e.target.value)}
                    required
                    style={{ flex: 1 }}
                    data={availableModels.map((model) => ({
                        value: model.id,
                        label: `${model.id} (${Math.round(parseFloat(model.pricing.completion)*1000000*1000)/1000} $/M)`,
                    }))}

                    searchable
                />
                <ActionIcon
                    onClick={() =>
                        window.open("https://openrouter.ai/models", "_blank")
                    }
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
                onChange={(e: any) => setLocalInsights(e.target.value)}
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
