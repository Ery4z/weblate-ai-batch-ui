import React from "react";
import "@mantine/core/styles.css";
import {
  ActionIcon,
  Button,
  CheckIcon,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { IconAlertCircle, IconCheck, IconRobot } from "@tabler/icons-react";
interface TranslationEntryProps {
  source: string;
  translation: string;
  prefill?: string;
  onTranslationChange: (value: string) => void;
  onPrefill: () => void;
  onValidate: () => Promise<boolean>;
}

const TranslationEntry: React.FC<TranslationEntryProps> = ({
  source,
  translation,
  prefill,
  onTranslationChange,
  onPrefill,
  onValidate,
}) => {
  const [isValidating, setIsValidating] = React.useState(false);
  const [isPrefilling, setIsPrefilling] = React.useState(false);
  const [isValidated, setIsValidated] = React.useState(false);
  const [hasValidationErrors, setHasValidationErrors] = React.useState(false);
  const [isPrefilled, setIsPrefilled] = React.useState(false);

  const handlePrefill = async () => {
    setIsPrefilling(true);
    await onPrefill();
    setIsPrefilled(true);
    setIsPrefilling(false);
  };

  const handleValidate = async () => {
    setIsValidating(true);
    const result = await onValidate();
    if (!result) {
      setHasValidationErrors(true);
    }
    setIsValidated(true);
    setIsValidating(false);
  };

  return (
    <div className="grid grid-cols-8 gap-3 border border-b-0 border-neutral-600 p-2 min-h-48">
      <div className="col-span-3 flex flex-col">
        <div className="font-bold text-xs text-neutral-600 mb-2">Original</div>
        <Textarea
          value={source}
          onChange={(e) => onTranslationChange(e.target.value)}
          styles={{ wrapper: { height: "100%" }, input: { height: "100%" } }}
          h={"100%"}
          readOnly
        />
      </div>
      <div className="flex flex-col col-span-3 border-r border-l border-neutral-600 px-2">
        <div className="font-bold text-xs text-neutral-600 mb-2">
          Translation
        </div>
        <Textarea
          placeholder="Translation goes here..."
          value={translation}
          onChange={(e) => onTranslationChange(e.target.value)}
          styles={{ wrapper: { height: "100%" }, input: { height: "100%" } }}
          h={"100%"}
        />
      </div>
      <div className="col-span-2">
        <div className="grid grid-cols-1 gap-2 items-center justify-center h-full">
          <Tooltip label="Click to prefill translation using OpenRouter">
            <Button
              loading={isPrefilling}
              onClick={handlePrefill}
              variant="light"
            >
              AI Prefill
            </Button>
          </Tooltip>
          {isValidated ? (
            <Tooltip label={hasValidationErrors ? "An error occured" : "Validated"}>
              <Button
                loading={isValidating}
                onClick={handleValidate}
                data-disabled
                variant="outline"
              >
                {hasValidationErrors ? <IconAlertCircle /> : <IconCheck />}
              </Button>
            </Tooltip>
          ) : (
            <Tooltip label="Click to validate translation">
              <Button loading={isValidating} onClick={handleValidate}>
                Validate
              </Button>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
};

export default TranslationEntry;
