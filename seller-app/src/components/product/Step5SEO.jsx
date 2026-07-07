import React, { useState } from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Trash2 } from "lucide-react";

export default function Step5SEO({ next, previous }) {
  const { register, control, watch } = useFormContext();
  const [keywordInput, setKeywordInput] = useState("");
  const { fields, append, remove } = useFieldArray({ control, name: "seo.keywords" });

  const metaTitle = watch("seo.metaTitle") || "Product Title will appear here";
  const metaDescription = watch("seo.metaDescription") || "Your product description preview...";

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <h2 className="text-2xl font-bold mb-2">Search Engine Optimization</h2>
      <p className="text-gray-500 mb-8">Optimize your product visibility for search engines.</p>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <label className="block font-semibold mb-2">Meta Title</label>
            <input {...register("seo.metaTitle")} maxLength={60} className="w-full border rounded-lg p-3" placeholder="e.g. iPhone 16 Pro Max - Best Price & Warranty" />
            <p className="text-xs text-gray-400 mt-1">Recommended: 50-60 characters</p>
          </div>
          <div>
            <label className="block font-semibold mb-2">Meta Description</label>
            <textarea {...register("seo.metaDescription")} rows={3} maxLength={160} className="w-full border rounded-lg p-3" placeholder="Write a catchy description..." />
            <p className="text-xs text-gray-400 mt-1">Recommended: 150-160 characters</p>
          </div>
          <div>
            <label className="block font-semibold mb-2">Focus Keywords</label>
            <div className="flex gap-2">
              <input 
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                placeholder="Add keyword..." 
                className="flex-1 border rounded-lg p-3"
              />
              <button 
                type="button" 
                onClick={() => { if(keywordInput.trim()){ append({ value: keywordInput.trim() }); setKeywordInput(""); } }} 
                className="bg-blue-600 text-white px-4 rounded-lg"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {fields.map((field, index) => (
                <span key={field.id} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-blue-100">
                  {field.value}
                  <button type="button" onClick={() => remove(index)}><Trash2 size={14}/></button>
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl border border-dashed border-gray-300">
          <h4 className="font-bold text-gray-700 mb-4">Google Search Preview</h4>
          <div className="bg-white p-5 rounded-lg border shadow-sm">
            <p className="text-blue-800 text-lg hover:underline cursor-pointer">{metaTitle}</p>
            <p className="text-green-800 text-sm mt-1">https://yourstore.com/products/iphone-16</p>
            <p className="text-gray-600 text-sm mt-1">{metaDescription.substring(0, 150)}...</p>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-10 pt-6 border-t">
        <button type="button" onClick={previous} className="text-gray-600 font-medium px-6 py-3 rounded-lg">← Previous Step</button>
        <button type="button" onClick={next} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold">Save & Continue →</button>
      </div>
    </div>
  );
}