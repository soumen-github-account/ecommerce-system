import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";

export default function Step3Specification({
  next,
  previous,
}) {
  const { control, register } = useFormContext();

  // -----------------------------
  // GROUPS
  // -----------------------------
  const {
    fields: groups,
    append: addGroup,
    remove: removeGroup,
  } = useFieldArray({
    control,
    name: "specification",
  });

  return (
    <div className="bg-white rounded-xl shadow p-8">
      <h2 className="text-2xl font-bold mb-8">
        Specifications
      </h2>

      {/* GROUP LIST */}
      {groups.map((group, groupIndex) => (
        <GroupBlock
          key={group.id}
          control={control}
          register={register}
          groupIndex={groupIndex}
          removeGroup={removeGroup}
        />
      ))}

      {/* ADD GROUP */}
      <button
        type="button"
        onClick={() =>
          addGroup({
            group: "",
            fields: [{ key: "", value: "" }],
          })
        }
        className="bg-green-600 text-white px-6 py-3 rounded mt-6"
      >
        + Add Group
      </button>

      {/* FOOTER */}
      <div className="flex justify-between mt-10">
        <button
          type="button"
          onClick={previous}
          className="border px-6 py-3 rounded"
        >
          Previous
        </button>

        <button
          type="button"
          onClick={next}
          className="bg-blue-600 text-white px-6 py-3 rounded"
        >
          Next
        </button>
      </div>
    </div>
  );
}

function GroupBlock({
  control,
  register,
  groupIndex,
  removeGroup,
}) {
  const {
    fields: fieldsList,
    append,
    remove,
  } = useFieldArray({
    control,
    name: `specification.${groupIndex}.fields`,
  });

  return (
    <div className="border rounded-lg p-5 mb-6">
      
      {/* GROUP NAME */}
      <div className="flex gap-3">
        <input
          {...register(
            `specification.${groupIndex}.group`
          )}
          placeholder="Group Name"
          className="border p-3 rounded w-full"
        />

        <button
          type="button"
          onClick={() => removeGroup(groupIndex)}
          className="text-red-600"
        >
          Delete
        </button>
      </div>

      {/* FIELDS */}
      <div className="mt-5 space-y-3">
        {fieldsList.map((field, fieldIndex) => (
          <div
            key={field.id}
            className="grid grid-cols-2 gap-4"
          >
            <input
              {...register(
                `specification.${groupIndex}.fields.${fieldIndex}.key`
              )}
              placeholder="Key"
              className="border p-3 rounded"
            />

            <input
              {...register(
                `specification.${groupIndex}.fields.${fieldIndex}.value`
              )}
              placeholder="Value"
              className="border p-3 rounded"
            />

            <button
              type="button"
              onClick={() => remove(fieldIndex)}
              className="text-red-500 col-span-2 text-left"
            >
              Delete Field
            </button>
          </div>
        ))}
      </div>

      {/* ADD FIELD */}
      <button
        type="button"
        onClick={() =>
          append({ key: "", value: "" })
        }
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Add Field
      </button>
    </div>
  );
}