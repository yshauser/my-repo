// src/components/ui/input.tsx
import React from 'react';

type InputProps = {
  label: string;
  placeholder: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string; // Optional, defaults to 'text'
};

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
}) => {
  return (
    <div className="w-full max-w-xs">
      <label htmlFor={label} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        id={label}
        name={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
      />
    </div>
  );
};
