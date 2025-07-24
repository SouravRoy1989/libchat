// src/components/modals/ModelSettings.tsx

import React, { useState } from 'react';

// A reusable component for the parameter sliders
interface SliderProps {
  label: string;
  id: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  description: string;
}

function ParameterSlider({ label, id, min, max, step, value, onChange, description }: SliderProps) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="block text-sm font-medium text-white">
          {label}
        </label>
        <span className="text-sm text-zinc-400">{value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className="w-full h-2 mt-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
      <p className="text-xs text-zinc-500 mt-1">{description}</p>
    </div>
  );
}

export default function ModelSettings() {
  const [apiKey, setApiKey] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(1);

  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-white">Model Settings</h3>
      <p className="mt-1 text-sm text-zinc-400">
        Configure parameters for the AI model.
      </p>
      <div className="mt-6 flex flex-col gap-6">
        {/* API Key Input */}
        <div>
          <label htmlFor="api-key" className="block text-sm font-medium text-white">
            API Key
          </label>
          <input
            type="password"
            id="api-key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
            className="mt-1 block w-full rounded-md border-zinc-600 bg-zinc-700 p-3 text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Temperature Slider */}
        <ParameterSlider
          label="Temperature"
          id="temperature"
          min={0}
          max={1}
          step={0.1}
          value={temperature}
          onChange={(e) => setTemperature(parseFloat(e.target.value))}
          description="Controls randomness. Lower is more predictable."
        />

        {/* Top P Slider */}
        <ParameterSlider
          label="Top P"
          id="top-p"
          min={0}
          max={1}
          step={0.1}
          value={topP}
          onChange={(e) => setTopP(parseFloat(e.target.value))}
          description="Controls nucleus sampling. Considers a smaller set of tokens."
        />
      </div>
    </div>
  );
}