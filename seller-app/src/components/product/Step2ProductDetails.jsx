// import { useState } from "react";
// import { useFieldArray, useFormContext } from "react-hook-form";

// // export default function Step2ProductDetails({ next, previous }) {
// //   const [highlight, setHighlight] = useState("");
// //   const [tag, setTag] = useState("");

// //   const {
// //     register,
// //     control,
// //     getValues,
// //     watch,
// //     setValue,
// //     formState: { errors },
// //   } = useFormContext();

// //   const highlights = watch("highlights") || [];
// //   const tags = watch("tags") || [];

// //   // -------------------------
// //   // Highlights
// //   // -------------------------

// //   const {
// //     fields: highlightFields,
// //     append: addHighlightField,
// //     remove: removeHighlightField,
// //   } = useFieldArray({
// //     control,
// //     name: "highlights",
// //   });

// //   // -------------------------
// //   // Tags
// //   // -------------------------

// //   const {
// //     fields: tagFields,
// //     append: addTagField,
// //     remove: removeTagField,
// //   } = useFieldArray({
// //     control,
// //     name: "tags",
// //   });

// //   // -------------------------
// //   // Add Highlight
// //   // -------------------------

// //   const addHighlight = () => {
// //     const value = highlight.trim();

// //     if (!value) return;

// //     setValue("highlights", [...highlights, value], {
// //       shouldValidate: true,
// //     });

// //     setHighlight("");
// //   };
// //   const removeHighlight = (index) => {
// //     setValue(
// //       "highlights",
// //       highlights.filter((_, i) => i !== index),
// //       {
// //         shouldValidate: true,
// //       },
// //     );
// //   };
// //   // -------------------------
// //   // Add Tag
// //   // -------------------------

// //   const addTag = () => {
// //     const value = tag.trim();

// //     if (!value) return;

// //     if (tags.includes(value)) {
// //       setTag("");
// //       return;
// //     }

// //     setValue("tags", [...tags, value], {
// //       shouldValidate: true,
// //     });

// //     setTag("");
// //   };

// //   return (
// //     <div className="bg-white shadow rounded-xl p-8">
// //       <h2 className="text-2xl font-bold mb-8">Product Details</h2>

// //       {/* Description */}

// //       <div className="mb-8">
// //         <label className="block font-semibold mb-2">Description</label>

// //         <textarea
// //           rows={6}
// //           placeholder="Write product description..."
// //           className="w-full border rounded-lg p-3"
// //           {...register("description")}
// //         />

// //         <p className="text-red-500 text-sm mt-1">
// //           {errors.description?.message}
// //         </p>
// //       </div>

// //       {/* Highlights */}

// //       <div className="mb-8">
// //         <label className="block font-semibold mb-4">Highlights</label>

// //         <div className="space-y-3">
// //           {highlightFields.map((item, index) => (
// //             <div
// //               key={item.id}
// //               className="flex justify-between items-center bg-gray-100 rounded-lg px-4 py-3"
// //             >
// //               <span>{item}</span>

// //               <button
// //                 type="button"
// //                 onClick={() => removeHighlightField(index)}
// //                 className="text-red-600 font-bold"
// //               >
// //                 ✕
// //               </button>
// //             </div>
// //           ))}
// //         </div>

// //         <div className="flex gap-3 mt-4">
// //           <input
// //             value={highlight}
// //             onChange={(e) => setHighlight(e.target.value)}
// //             placeholder="Add highlight..."
// //             className="flex-1 border rounded-lg p-3"
// //           />

// //           <button
// //             type="button"
// //             onClick={addHighlight}
// //             className="bg-blue-600 text-white px-5 rounded-lg"
// //           >
// //             Add
// //           </button>
// //         </div>
// //       </div>

// //       {/* Warranty */}

// //       <div className="mb-8">
// //         <label className="block font-semibold mb-2">Warranty</label>

// //         <input
// //           placeholder="Eg. 1 Year Manufacturer Warranty"
// //           className="w-full border rounded-lg p-3"
// //           {...register("warranty")}
// //         />
// //       </div>

// //       {/* Return Policy */}

// //       <div className="mb-10">
// //         <label className="block font-semibold mb-2">Return Policy</label>

// //         <textarea
// //           rows={4}
// //           placeholder="Eg. 7 Days Easy Return"
// //           className="w-full border rounded-lg p-3"
// //           {...register("returnPolicy")}
// //         />
// //       </div>
// //       <div className="mb-8">
// //         <label className="block font-semibold mb-4">Tags</label>

// //         <div className="flex flex-wrap gap-2 mb-4">
// //           {tags.map((item, index) => (
// //             <div
// //               key={index}
// //               className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-full"
// //             >
// //               {item}

// //               <button type="button" onClick={() => removeTag(index)}>
// //                 ✕
// //               </button>
// //             </div>
// //           ))}
// //         </div>

// //         <div className="flex gap-3">
// //           <input
// //             value={tag}
// //             onChange={(e) => setTag(e.target.value)}
// //             placeholder="Add tag..."
// //             className="flex-1 border rounded-lg p-3"
// //           />

// //           <button
// //             type="button"
// //             onClick={addTag}
// //             className="bg-blue-600 text-white px-5 rounded-lg"
// //           >
// //             Add
// //           </button>
// //         </div>
// //       </div>
// //       <div className="flex justify-between">
// //         <button
// //           type="button"
// //           onClick={previous}
// //           className="px-6 py-3 rounded-lg border"
// //         >
// //           ← Previous
// //         </button>

// //         <button
// //           type="button"
// //           onClick={next}
// //           className="bg-blue-600 text-white px-6 py-3 rounded-lg"
// //         >
// //           Next →
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }


import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

export default function Step2ProductDetails({ next, previous }) {
  const [highlightInput, setHighlightInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  // Highlights Field Array
  const {
    fields: highlightFields,
    append: appendHighlight,
    remove: removeHighlightField,
  } = useFieldArray({ control, name: "highlights" });

  // Tags Field Array
  const {
    fields: tagFields,
    append: appendTag,
    remove: removeTagField,
  } = useFieldArray({ control, name: "tags" });

  // const addHighlight = () => {
  //   if (!highlightInput.trim()) return;
  //   // String ki jagah object pass karein
  //   appendHighlight({ value: highlightInput.trim() }); 
  //   setHighlightInput("");
  // };

  // const addTag = () => {
  //   if (!tagInput.trim()) return;
  //   const isDuplicate = tagFields.some((t) => t.value === tagInput.trim());
  //   if (isDuplicate) return;
    
  //   // String ki jagah object pass karein
  //   appendTag({ value: tagInput.trim() }); 
  //   setTagInput("");
  // };
  const addHighlight = () => {
  if (!highlightInput.trim()) return;
  appendHighlight({ value: highlightInput.trim() }); // Object pass karein
  setHighlightInput("");
};

const addTag = () => {
  if (!tagInput.trim()) return;
  appendTag({ value: tagInput.trim() }); // Object pass karein
  setTagInput("");
};

  return (
    <div className="bg-white shadow rounded-xl p-8">
      <h2 className="text-2xl font-bold mb-8">Product Details</h2>

      {/* Description */}
      <div className="mb-8">
        <label className="block font-semibold mb-2">Description</label>
        <textarea
          rows={6}
          placeholder="Write product description..."
          className="w-full border rounded-lg p-3"
          {...register("description")}
        />
        <p className="text-red-500 text-sm mt-1">{errors.description?.message}</p>
      </div>

      {/* Highlights */}
      <div className="mb-8">
        <label className="block font-semibold mb-4">Highlights</label>
        <div className="space-y-3">
          {highlightFields.map((field, index) => (
            <div key={field.id} className="flex justify-between items-center bg-gray-100 rounded-lg px-4 py-3">
              <span>{field.value}</span>
              <button 
                type="button" 
                onClick={() => removeHighlightField(index)} 
                className="text-red-600 font-bold"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          <input
            value={highlightInput}
            onChange={(e) => setHighlightInput(e.target.value)}
            placeholder="Add highlight..."
            className="flex-1 border rounded-lg p-3"
          />
          <button type="button" onClick={addHighlight} className="bg-blue-600 text-white px-5 rounded-lg">Add</button>
        </div>
      </div>

      {/* Warranty & Return Policy */}
      <div className="mb-8">
        <label className="block font-semibold mb-2">Warranty</label>
        <input {...register("warranty")} className="w-full border rounded-lg p-3" placeholder="Eg. 1 Year" />
      </div>

      <div className="mb-10">
        <label className="block font-semibold mb-2">Return Policy</label>
        <textarea {...register("returnPolicy")} rows={4} className="w-full border rounded-lg p-3" placeholder="Eg. 7 Days" />
      </div>

      {/* Tags */}
      <div className="mb-8">
        <label className="block font-semibold mb-4">Tags</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {tagFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-2 rounded-full">
              {field.value}
              <button type="button" onClick={() => removeTagField(index)}>✕</button>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tag..."
            className="flex-1 border rounded-lg p-3"
          />
          <button type="button" onClick={addTag} className="bg-blue-600 text-white px-5 rounded-lg">Add</button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button type="button" onClick={previous} className="px-6 py-3 rounded-lg border">← Previous</button>
        <button type="button" onClick={next} className="bg-blue-600 text-white px-6 py-3 rounded-lg">Next →</button>
      </div>
    </div>
  );
}