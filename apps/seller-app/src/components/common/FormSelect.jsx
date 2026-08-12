import Select from "react-select";
import { Controller, useFormContext } from "react-hook-form";

export default function FormSelect({
  name,
  label,
  options = [],
  placeholder,
  isLoading = false,
  isDisabled = false,
}) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <div>
      <label className="block mb-2 font-medium">
        {label}
      </label>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            placeholder={placeholder}
            options={options}
            isLoading={isLoading}
            isDisabled={isDisabled}
            value={options.find(
              (item) => item.value === field.value
            )}
            onChange={(option) =>
              field.onChange(option?.value || "")
            }
          />
        )}
      />

      <p className="text-sm text-red-500 mt-1">
        {errors[name]?.message}
      </p>
    </div>
  );
}