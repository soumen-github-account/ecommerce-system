// import React from "react";
// import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
// import { Trash2, Plus, GripVertical } from "lucide-react";

// export default function Step3Specification({ next, previous }) {
//   const { control, register } = useFormContext();
//   const variants = useWatch({ name: "variants", control }) || [];

//   return (
//     <div className="space-y-10">
//       {variants.map((variant, vIndex) => {
//         const variantTitle = variant.attributes?.map(a => a.value).join(" / ") || `Variant ${vIndex + 1}`;

//         return (
//           <div key={vIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
//             <h2 className="text-2xl font-bold mb-6 text-gray-800">
//               Specifications of {variantTitle}
//             </h2>
            
//             {/* Har Variant ke liye ek separate SpecManager */}
//             <SpecManager control={control} register={register} vIndex={vIndex} />
//           </div>
//         );
//       })}

//       <div className="flex justify-between mt-10 pt-6 border-t">
//         <button type="button" onClick={previous} className="text-gray-600 font-medium px-6 py-3 rounded-lg">← Previous Step</button>
//         <button type="button" onClick={next} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold">Save & Continue →</button>
//       </div>
//     </div>
//   );
// }

// function SpecManager({ control, register, vIndex }) {
//   // Yahan hum variant ke andar 'specGroups' array use kar rahe hain
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: `variants.${vIndex}.specifications`, 
//   });

//   return (
//     <div className="space-y-6">
//       {fields.map((group, gIndex) => (
//         <GroupBlock 
//           key={group.id} 
//           control={control} 
//           register={register} 
//           vIndex={vIndex} 
//           gIndex={gIndex} 
//           removeGroup={() => remove(gIndex)} 
//         />
//       ))}

//       <button type="button" onClick={() => append({ group: "", fields: [] })} className="flex items-center gap-2 text-blue-600 font-semibold hover:underline">
//         <Plus size={20} /> Add Specification Group
//       </button>
//     </div>
//   );
// }

// function GroupBlock({ control, register, vIndex, gIndex, removeGroup }) {
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: `variants.${vIndex}.specifications.${gIndex}.fields`
//   });

//   return (
//     <div className="border border-gray-200 rounded-xl bg-gray-50 p-6 shadow-sm">
//       <div className="flex justify-between items-center mb-5">
//         <h3 className="text-sm font-bold text-gray-500 uppercase">Specification Group #{gIndex + 1}</h3>
//         <button type="button" onClick={removeGroup} className="text-red-600 text-sm font-medium flex items-center gap-1">
//           <Trash2 size={16} /> Delete Group
//         </button>
//       </div>

//       {/* Group Title Input */}
//       <input 
//         {...register(`variants.${vIndex}.specifications.${gIndex}.group`)} 
//         placeholder="Example: Display (e.g. AMOLED)" 
//         className="w-full border rounded-lg p-3 mb-5" 
//       />

//       {/* Key-Value Pairs */}
//       <div className="space-y-3">
//         {fields.map((field, fIndex) => (
//           <div key={field.id} className="grid grid-cols-12 gap-3 items-center">
//             <input {...register(`variants.${vIndex}.specifications.${gIndex}.fields.${fIndex}.key`)} placeholder="Key" className="col-span-5 border p-2.5 rounded-lg" />
//             <input {...register(`variants.${vIndex}.specifications.${gIndex}.fields.${fIndex}.value`)} placeholder="Value" className="col-span-5 border p-2.5 rounded-lg" />
//             <button type="button" onClick={() => remove(fIndex)} className="col-span-2 text-gray-400 hover:text-red-600 flex justify-center">
//               <Trash2 size={20} />
//             </button>
//           </div>
//         ))}
//       </div>

//       <button type="button" onClick={() => append({ key: "", value: "" })} className="mt-4 flex items-center gap-2 text-sm text-blue-600 font-medium">
//         <Plus size={16} /> Add Specification
//       </button>
//     </div>
//   );
// }


import React from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { Trash2, Plus, ClipboardCheck } from "lucide-react";

export default function Step3Specification({ next, previous }) {
  const { control, register, getValues, reset } = useFormContext();
  const variants = useWatch({ name: "variants", control }) || [];

  const copySpecsFromPrevious = (vIndex) => {
    const allData = getValues();
    // Previous variant ki specs copy karein
    const prevSpecs = structuredClone(allData.variants[vIndex - 1].specifications);
    
    // Naya data object banayein
    const updatedVariants = [...allData.variants];
    updatedVariants[vIndex].specifications = prevSpecs;

    // Reset se field array ka internal state refresh ho jayega
    reset({ ...allData, variants: updatedVariants });
  };

  return (
    <div className="space-y-10">
      {variants.map((variant, vIndex) => {
        const variantTitle = variant.attributes?.map(a => a.value).join(" / ") || `Variant ${vIndex + 1}`;

        return (
          <div key={vIndex} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Specifications of {variantTitle}</h2>
              {vIndex > 0 && (
                <button 
                  type="button" 
                  onClick={() => copySpecsFromPrevious(vIndex)} 
                  className="flex items-center gap-2 text-sm bg-green-50 text-green-700 px-4 py-2 rounded-lg hover:bg-green-100 font-semibold"
                >
                  <ClipboardCheck size={16} /> Copy from previous
                </button>
              )}
            </div>
            
            <SpecManager control={control} register={register} vIndex={vIndex} />
          </div>
        );
      })}

      <div className="flex justify-between mt-10 pt-6 border-t">
        <button type="button" onClick={previous} className="text-gray-600 font-medium px-6 py-3 rounded-lg">← Previous Step</button>
        <button type="button" onClick={next} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">Save & Continue →</button>
      </div>
    </div>
  );
}

function SpecManager({ control, register, vIndex }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${vIndex}.specifications`, 
  });

  return (
    <div className="space-y-6">
      {fields.map((group, gIndex) => (
        <GroupBlock 
          key={group.id} 
          control={control} 
          register={register} 
          vIndex={vIndex} 
          gIndex={gIndex} 
          removeGroup={() => remove(gIndex)} 
        />
      ))}

      <button type="button" onClick={() => append({ group: "", fields: [] })} className="flex items-center gap-2 text-blue-600 font-semibold hover:underline">
        <Plus size={20} /> Add Specification Group
      </button>
    </div>
  );
}

function GroupBlock({ control, register, vIndex, gIndex, removeGroup }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `variants.${vIndex}.specifications.${gIndex}.fields`
  });

  return (
    <div className="border border-gray-200 rounded-xl bg-gray-50 p-6 shadow-sm">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-sm font-bold text-gray-500 uppercase">Specification Group #{gIndex + 1}</h3>
        <button type="button" onClick={removeGroup} className="text-red-600 text-sm font-medium flex items-center gap-1">
          <Trash2 size={16} /> Delete Group
        </button>
      </div>

      <input 
        {...register(`variants.${vIndex}.specifications.${gIndex}.group`)} 
        placeholder="Example: Display (e.g. AMOLED)" 
        className="w-full border rounded-lg p-3 mb-5" 
      />

      <div className="space-y-3">
        {fields.map((field, fIndex) => (
          <div key={field.id} className="grid grid-cols-12 gap-3 items-center">
            <input {...register(`variants.${vIndex}.specifications.${gIndex}.fields.${fIndex}.key`)} placeholder="Key" className="col-span-5 border p-2.5 rounded-lg" />
            <input {...register(`variants.${vIndex}.specifications.${gIndex}.fields.${fIndex}.value`)} placeholder="Value" className="col-span-5 border p-2.5 rounded-lg" />
            <button type="button" onClick={() => remove(fIndex)} className="col-span-2 text-gray-400 hover:text-red-600 flex justify-center">
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <button type="button" onClick={() => append({ key: "", value: "" })} className="mt-4 flex items-center gap-2 text-sm text-blue-600 font-medium">
        <Plus size={16} /> Add Specification
      </button>
    </div>
  );
}

