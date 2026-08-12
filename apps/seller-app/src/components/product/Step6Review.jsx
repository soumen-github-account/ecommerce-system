import React from "react";
import { useFormContext } from "react-hook-form";

export default function Step6Review({ previous, loading, isSubmitting }) {
  const { watch } = useFormContext();
  const data = watch(); // Poora form data yahan mil jayega

  return (
    <div className="space-y-8 bg-white p-8 rounded-2xl shadow-sm border">
      <h2 className="text-3xl font-extrabold text-gray-800">Review Product</h2>

      {/* 1. Basic Info Section */}
      <section>
        <h3 className="text-xl font-bold border-b pb-2 mb-4 text-blue-600">Basic Information</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <p><span className="font-semibold text-gray-500">Title:</span> {data.title}</p>
          <p><span className="font-semibold text-gray-500">Brand:</span> {data.brand}</p>
          <p className="col-span-2"><span className="font-semibold text-gray-500">Short Desc:</span> {data.shortDescription}</p>
        </div>
      </section>

      {/* 2. Variants Section */}
      <section>
        <h3 className="text-xl font-bold border-b pb-2 mb-4 text-blue-600">Variants & Pricing</h3>
        <div className="space-y-4">
          {data.variants?.map((v, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg border">
              <p className="font-bold mb-2">Variant {i + 1}: {v.attributes?.map(a => a.value).join(" - ")}</p>
              <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                <p>MRP: ₹{v.pricing?.mrp}</p>
                <p>Selling Price: ₹{v.pricing?.sellingPrice}</p>
                <p>Cost: ₹{v.pricing?.cost}</p>
              </div>
              
              {/* Specification Preview inside Variant */}
              {v.specGroups?.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="font-semibold text-xs mb-2 uppercase text-gray-400">Specifications</p>
                  {v.specGroups.map((group, gIndex) => (
                    <div key={gIndex} className="mb-2">
                      <p className="font-bold text-xs">{group.title}</p>
                      <ul className="text-[11px] text-gray-600">
                        {group.fields?.map((f, fIndex) => (
                          <li key={fIndex}>• {f.key}: {f.value}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 3. SEO & Tags */}
      <section>
        <h3 className="text-xl font-bold border-b pb-2 mb-4 text-blue-600">SEO & Metadata</h3>
        <div className="text-sm space-y-2">
          <p><span className="font-semibold">Meta Title:</span> {data.seo?.metaTitle}</p>
          <p><span className="font-semibold">Keywords:</span> {data.seo?.keywords?.map(k => k.value).join(", ")}</p>
        </div>
      </section>

      {/* Navigation & Submit */}
      <div className="flex justify-between pt-8 border-t">
        <button type="button" onClick={previous} className="px-8 py-3 rounded-lg border text-gray-600">Back</button>
        <button
          type="submit"
          disabled={loading || isSubmitting}
          className={`px-8 py-3 rounded-lg text-white font-semibold transition
            ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Creating Product...
            </div>
          ) : (
            "Confirm & Publish"
          )}
        </button>
      </div>
    </div>
  );
}