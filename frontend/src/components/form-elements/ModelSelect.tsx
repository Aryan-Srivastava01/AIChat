import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ModelSelect = ({
  models,
  setModel,
}: {
  models: { name: string; value: string; provider: string }[];
  setModel: React.Dispatch<
    React.SetStateAction<{ name: string; value: string; provider: string }>
  >;
}) => {
  return (
    <Select
      onValueChange={(value) =>
        setModel(models.find((m) => m.value === value) ?? models[0])
      }
      defaultValue={models[0].value}
    >
      <SelectTrigger>
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.value} value={model.value}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ModelSelect;
