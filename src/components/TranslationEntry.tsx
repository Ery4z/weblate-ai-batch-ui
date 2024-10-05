import React from "react";
import {
    ActionIcon,
    Button,
    Textarea,
    Tooltip,
    rem,
    Group,
} from "@mantine/core";
import {
    IconAlertCircle,
    IconCheck,
    IconBrandOpenai,
} from "@tabler/icons-react";

interface TranslationEntryProps {
    source: string[];
    translation: string[];
    context: string;
    prefill?: string[];
    onTranslationChange: (index: number, value: string) => void;
    onPrefill: (index: number) => void;
    onValidate: () => Promise<boolean>; // This is now global for all translations
}

const TranslationEntry: React.FC<TranslationEntryProps> = ({
    source,
    translation,
    context,
    prefill,
    onTranslationChange,
    onPrefill,
    onValidate,
}) => {
    const [isValidating, setIsValidating] = React.useState(false);
    const [isPrefilling, setIsPrefilling] = React.useState<number | null>(null);
    const [isValidated, setIsValidated] = React.useState<boolean>(false);
    const [hasValidationErrors, setHasValidationErrors] =
        React.useState<boolean>(false);

    const handlePrefill = async (index: number) => {
        setIsPrefilling(index);
        await onPrefill(index);
        setIsPrefilling(null);
    };

    const handleValidate = async () => {
        setIsValidating(true);
        const result = await onValidate();
        setIsValidated(true);
        setHasValidationErrors(!result);
        setIsValidating(false);
    };

    const renderTranslationEntry = (
        src: string,
        trans: string,
        index: number
    ) => (
        <div
            className="grid grid-cols-6 gap-3 border border-b-0 border-t-0 border-l-0 border-neutral-600 p-2 min-h-48"
            key={index}
        >
            {/* Original and Translation labels */}
            <div className="col-span-6 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <Group justify="space-between">
                        <div className="font-bold text-xs text-neutral-600 mb-2">
                            Original
                        </div>
                        <div className="text-xs text-neutral-600 mb-2">
                            {context}
                        </div>
                    </Group>
                    <Textarea
                        value={src}
                        readOnly
                        styles={{
                            wrapper: { height: "100%" },
                            input: { height: "100%" },
                        }}
                        h={"100%"}
                    />
                </div>

                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-xs text-neutral-600">
                            Translation
                        </span>
                        <Tooltip label="Click to prefill translation using AI">
                            <ActionIcon
                                variant="outline"
                                aria-label="AI"
                                size="md"
                                loading={isPrefilling === index}
                                onClick={() => handlePrefill(index)}
                            >
                                <IconBrandOpenai
                                    stroke={1.5}
                                    className="w-5 h-5"
                                />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                    <Textarea
                        placeholder="Translation goes here..."
                        value={trans}
                        onChange={(e) =>
                            onTranslationChange(index, e.target.value)
                        }
                        styles={{
                            wrapper: { height: "100%" },
                            input: { height: "100%" },
                        }}
                        h={"100%"}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-8 border border-neutral-600 min-h-48">
            <div className="col-span-6">
                {source.map((src, index) =>
                    renderTranslationEntry(src, translation[index] || "", index)
                )}
            </div>

            {/* Single Validate Button for all entries */}
            <div className="col-span-2 justify-self-center flex items-center ">
                {isValidated ? (
                    <Tooltip
                        label={
                            hasValidationErrors
                                ? "An error occurred"
                                : "Validated"
                        }
                    >
                        <Button
                            loading={isValidating}
                            onClick={handleValidate}
                            variant="outline"
                            className="ml-auto"
                        >
                            {hasValidationErrors ? (
                                <IconAlertCircle />
                            ) : (
                                <IconCheck />
                            )}
                        </Button>
                    </Tooltip>
                ) : (
                    <Tooltip label="Click to validate this unit">
                        <Button
                            loading={isValidating}
                            onClick={handleValidate}
                            className="ml-auto"
                        >
                            Validate
                        </Button>
                    </Tooltip>
                )}
            </div>
        </div>
    );
};

export default TranslationEntry;
