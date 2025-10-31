"use client";
import { RadioGroup } from "@headlessui/react";

interface SegmentedControlProps {
  label: string;
  options: { name: string; value: string }[];
  selected: string;
  onChange: (value: string) => void;
}

export default function SegmentedControl({
  label,
  options,
  selected,
  onChange,
}: SegmentedControlProps) {
  return (
    <RadioGroup value={selected} onChange={onChange}>
      <RadioGroup.Label className="block text-sm font-medium text-gray-700">
        {label}
      </RadioGroup.Label>
      <div className="mt-1 flex items-center justify-between gap-2 rounded-md bg-gray-100 p-1">
        {options.map((option) => (
          <RadioGroup.Option
            key={option.name}
            value={option.value}
            className={({ active, checked }) =>
              `cursor-pointer rounded-md p-2 text-center text-sm font-medium transition-colors w-full
               ${
                 checked
                   ? "bg-blue-600 text-white shadow"
                   : "text-gray-700 hover:bg-gray-200"
               }
               ${active ? "ring-2 ring-blue-500 ring-offset-2" : ""}`
            }
          >
            {option.name}
          </RadioGroup.Option>
        ))}
      </div>
    </RadioGroup>
  );
}
