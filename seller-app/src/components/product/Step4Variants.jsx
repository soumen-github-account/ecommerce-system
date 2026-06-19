import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import VariantCard from "./VariantCard";

export default function Step4Variants({ next, previous }) {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const createVariant = () => ({
    sku: "",
    attributes: { color: "", size: "", material: "" },
    images: [],
    mrp: "",
    sellingPrice: "",
    costPrice: "",
    stock: "",
    reservedStock: "",
    weight: "",
    dimensions: { length: "", breadth: "", height: "" },
    barcode: "",
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">

      {/* HEADER */}
      <div className="flex justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Product Variants</h2>
        </div>

        <button
          type="button"
          onClick={() => append(createVariant())}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          + Add Variant
        </button>
      </div>

      {/* LIST */}
      <div className="space-y-6">
        {fields.map((field, index) => (
          <VariantCard
            key={field.id}
            index={index}
            control={control}
            remove={() => remove(index)}
          />
        ))}
      </div>

      {/* FOOTER */}
      <div className="flex justify-between mt-10">
        <button onClick={previous} className="border px-6 py-3 rounded-lg">
          ← Previous
        </button>

        <button onClick={next} className="bg-blue-600 text-white px-6 py-3 rounded-lg">
          Next →
        </button>
      </div>
    </div>
  );
}