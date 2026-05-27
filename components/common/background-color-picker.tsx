import { useState } from "react";
import { ChromePicker, type ColorResult } from "react-color";

const DEFAULT_PRESETS = [
  "#F8F9F7",
  "#00AE88",
  "#F36A3D",
  "#224CA0",
  // "#026630",
  "#183F35",
  "#020618",
];

interface BackgroundColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  label?: string;
  name?: string;
  className?: string;
}

export function BackgroundColorPicker({
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  label = "Background Color",
  name,
  className,
}: BackgroundColorPickerProps) {
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className={`space-y-3 ${className}`}>
      {name && <input type="hidden" name={name} value={value} />}

      <label className="block text-sm font-medium text-foreground">
        {label}
      </label>

      <p className="text-xs my-2">Presets:</p>

      <div className="flex flex-wrap gap-3">
        {presets.map((preset) => {
          const isActive = value.toLowerCase() === preset.toLowerCase();
          return (
            <button
              key={preset}
              type="button"
              onClick={() => {
                onChange(preset);
                setShowPicker(false);
              }}
              aria-label={`Select ${preset}`}
              aria-pressed={isActive}
              className={`h-10 w-10 rounded-lg transition-transform hover:scale-105 cursor-pointer ${
                isActive
                  ? "ring-2 ring-offset-2 ring-primary border-2 border-background"
                  : "border border-border"
              }`}
              style={{ backgroundColor: preset }}
            />
          );
        })}
      </div>

      <p className="text-xs my-2">Preview:</p>
      <div className="flex items-center gap-3">
        <div
          className="h-10 w-52 border border-border"
          style={{ backgroundColor: value }}
        />
        <span className="text-sm font-mono text-muted-foreground uppercase">
          {value}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setShowPicker((s) => !s)}
          className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors cursor-pointer"
        >
          {showPicker ? "Close picker" : "Custom color"}
        </button>
      </div>

      {showPicker && (
        <div className="inline-block">
          <ChromePicker
            color={value}
            onChange={(c: ColorResult) => onChange(c.hex)}
          />
        </div>
      )}
    </div>
  );
}
