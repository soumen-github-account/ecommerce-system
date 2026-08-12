import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function Step2ProductDetails({ next, previous }) {
  const { register, control } = useFormContext();

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({ control, name: "highlights" });
  const { fields: tagFields, append: appendTag, remove: removeTag } = useFieldArray({ control, name: "tags" });
  const { fields: conditionFields, append: appendCondition, remove: removeCondition } = useFieldArray({ control, name: "services.returnPolicy.conditions" });

  return (
    <div className="bg-white rounded-xl shadow p-8">
      <h2 className="text-2xl font-bold mb-6">Product Details</h2>
      <div>
        <label className="block font-semibold mb-2">Description</label>
        <textarea rows={4} className="w-full border rounded-lg p-3" {...register("description")} />
      </div>
      <DynamicList title="Highlights" fields={highlightFields} append={appendHighlight} remove={removeHighlight} placeholder="Add highlight..." />
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div>
          <label className="block font-semibold mb-1">Manufacturer</label>
          <input {...register("manufacturer")} className="w-full border rounded-lg p-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">Country Of Origin</label>
          <input {...register("countryOfOrigin")} className="w-full border rounded-lg p-2" />
        </div>
      </div>
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-bold mb-4">Return Policy</h3>
        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2"><input type="checkbox" {...register("services.returnPolicy.returnable")} /> Returnable</label>
          <input type="number" placeholder="Days" className="border rounded-lg p-2 w-20" {...register("services.returnPolicy.returnDays")} />
          <select className="border rounded-lg p-2 flex-1" {...register("services.returnPolicy.returnType")}>
            <option value="replacement">Replacement</option>
            <option value="refund">Refund</option>
          </select>
        </div>
        <DynamicList fields={conditionFields} append={appendCondition} remove={removeCondition} placeholder="Add condition..." />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="border p-4 rounded-lg">
          <h4 className="font-bold mb-2">COD</h4>
          <label className="flex items-center gap-2"><input type="checkbox" {...register("services.cashOnDelivery.available")} /> Available</label>
        </div>
        <div className="border p-4 rounded-lg">
          <h4 className="font-bold mb-2">Warranty</h4>
          <label className="flex items-center gap-2 mb-2"><input type="checkbox" {...register("services.warranty.available")} /> Available</label>
          <input placeholder="1 Year" className="w-full border rounded p-1 mb-2" {...register("services.warranty.duration")} />
          <select className="w-full border rounded p-1" {...register("services.warranty.type")}>
            <option value="none">None</option><option value="brand">Brand</option>
          </select>
        </div>
        <div className="border p-4 rounded-lg">
          <h4 className="font-bold mb-2">Support</h4>
          <label className="flex items-center gap-2 mb-2"><input type="checkbox" {...register("services.support.available")} /> Available</label>
          <select className="w-full border rounded p-1" {...register("services.support.contactType")}>
            <option value="seller">Seller</option><option value="brand">Brand</option>
          </select>
        </div>
      </div>
      <DynamicList title="Tags" fields={tagFields} append={appendTag} remove={removeTag} placeholder="Add Tag..." />
        <div className="flex justify-between mt-10 pt-6 border-t">
          <button type="button" onClick={previous} className="text-gray-600 font-medium px-6 py-3 rounded-lg">← Previous Step</button>
          <button type="button" onClick={next} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold">Save & Continue →</button>
        </div>
    </div>
  );
}

function DynamicList({ title, fields, append, remove, placeholder }) {
  const [val, setVal] = useState("");
  return (
    <div className="mt-6">
      {title && <h3 className="text-lg font-bold mb-2">{title}</h3>}
      <div className="flex flex-wrap gap-2 mb-3">
        {fields.map((f, i) => (
          <span key={f.id} className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2">
            {f.value} <button type="button" onClick={() => remove(i)} className="text-red-500 font-bold">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={val} onChange={(e) => setVal(e.target.value)} placeholder={placeholder} className="flex-1 border rounded-lg p-2" />
        <button type="button" onClick={() => { if(val.trim()){ append({ value: val.trim() }); setVal(""); } }} className="bg-blue-600 text-white px-4 rounded-lg">Add</button>
      </div>
    </div>
  );
}