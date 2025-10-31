"use client";
import { Switch } from "@headlessui/react";

interface ToggleProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export default function Toggle({ label, enabled, onChange }: ToggleProps) {
  return (
    <Switch.Group as="div" className="flex items-center justify-between">
      <Switch.Label as="span" className="text-sm font-medium text-gray-700">
        {label}
      </Switch.Label>
      <Switch
        checked={enabled}
        onChange={onChange}
        className={`${
          enabled ? "bg-blue-600" : "bg-gray-200"
        } relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${
            enabled ? "translate-x-5" : "translate-x-0"
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </Switch>
    </Switch.Group>
  );
}
