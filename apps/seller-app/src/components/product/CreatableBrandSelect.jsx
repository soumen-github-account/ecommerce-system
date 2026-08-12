import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { useFormContext, Controller } from 'react-hook-form';

export default function CreatableBrandSelect({ name, options, placeholder }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, ref } }) => (
        <CreatableSelect
          ref={ref}
          isClearable
          placeholder={placeholder}
          options={options}
          // Agar value string hai, to object mein convert karke dikhayein
          value={options.find(c => c.value === value) || (value ? { label: value, value: value } : null)}
          onChange={(val) => onChange(val ? val.value : "")}
          onCreateOption={(inputValue) => {
            // Naya option create hote hi use select kar le
            onChange(inputValue);
          }}
          className="mt-2"
        />
      )}
    />
  );
}