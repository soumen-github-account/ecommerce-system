import React from "react";
import { useFormContext } from "react-hook-form";

export default function VariantCard({ index, remove }) {
  const { register, watch, setValue } = useFormContext();

  const variant = watch(`variants.${index}`);

  if (!variant) return null;

  const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);

  console.log("Selected Files:", files);

  const newImages = await Promise.all(
    files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();

        reader.onload = () => {
          console.log("Reader Loaded:", file.name);

          resolve({
            url: reader.result,
            file,
            isPrimary: false,
          });
        };

        reader.onerror = (err) => {
          console.log("Reader Error:", err);
        };

        reader.readAsDataURL(file);
      });
    })
  );

  console.log("newImages:", newImages);

  const updated = [
    ...(variant.images || []),
    ...newImages,
  ];

  console.log("updated:", updated);

  setValue(`variants.${index}.images`, updated);
};
  const setPrimary = (imgIndex) => {
    const updated = (variant.images || []).map((img, i) => ({
      ...img,
      isPrimary: i === imgIndex,
    }));
    console.log("Updated Images:", updated);
    setValue(`variants.${index}.images`, updated);
  };

  const removeImage = (imgIndex) => {
    const updatedImages = variant.images.filter((_, i) => i !== imgIndex);
    setValue(`variants.${index}.images`, updatedImages);
  };

  return (
    <div className="border p-6 rounded-lg bg-gray-50">

      {/* HEADER */}
      <div className="flex justify-between">
        <h3 className="font-bold">Variant #{index + 1}</h3>
        <button onClick={remove} className="text-red-600">Delete</button>
      </div>

      {/* SKU */}
      <input
        {...register(`variants.${index}.sku`)}
        placeholder="SKU"
        className="border p-2 w-full mt-3"
      />

      {/* ATTRIBUTES */}
      <div className="grid grid-cols-3 gap-3 mt-3">
        <input {...register(`variants.${index}.attributes.color`)} placeholder="Color" className="border p-2" />
        <input {...register(`variants.${index}.attributes.size`)} placeholder="Size" className="border p-2" />
        <input {...register(`variants.${index}.attributes.material`)} placeholder="Material" className="border p-2" />
      </div>

      {/* PRICING */}
      <div className="grid grid-cols-3 gap-3 mt-3">
        <input {...register(`variants.${index}.mrp`)} placeholder="MRP" className="border p-2" />
        <input {...register(`variants.${index}.sellingPrice`)} placeholder="Selling Price" className="border p-2" />
        <input {...register(`variants.${index}.costPrice`)} placeholder="Cost Price" className="border p-2" />
      </div>

      {/* STOCK */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <input {...register(`variants.${index}.stock`)} placeholder="Stock" className="border p-2" />
        <input {...register(`variants.${index}.barcode`)} placeholder="Barcode" className="border p-2" />
      </div>

      {/* ---------------- IMAGE SECTION ---------------- */}
      <div className="mt-5 border-t pt-4">

        <label className="font-semibold block mb-2">
          Images
        </label>

        {/* Upload */}
        <input
          type="file"
          multiple
          onChange={handleImageUpload}
        />

        
        {/* Preview */}
        <div className="flex gap-3 mt-3 flex-wrap">
          {(variant.images || []).map((img, i) => (
            <div key={i} className="relative w-20 h-20 group">
              <img
                src={img.url}
                className="w-full h-full object-cover rounded border"
              />

              {/* Xross Icon (Remove Button) */}
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow-md hover:bg-red-700"
              >
                ✕
              </button>

              <button
                type="button"
                onClick={() => setPrimary(i)}
                className={`absolute bottom-0 text-[10px] w-full ${
                  img.isPrimary ? "bg-blue-600 text-white" : "bg-gray-200"
                }`}
              >
                {img.isPrimary ? "Primary" : "Set"}
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}