// import React, { useState, useEffect } from "react";
// import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
// import { ChevronDown, ChevronUp, Plus, Trash2, X, Star } from "lucide-react";

// export default function Step4Variants({ next, previous }) {
//   const { control } = useFormContext();
//   const { fields, append, remove } = useFieldArray({ control, name: "variants" });

//   const addNewVariant = () => {
//     // append({
//     //   attributes: [], // Dynamic selection for attributes
//     //   pricing: { mrp: 0, sellingPrice: 0, cost: 0 },
//     //   images: [], // Dynamic array for images
//     //   primaryImageIndex: 0,
//     //   sku: "",
//     // });
//     append({
//       sku: "",
//       barcode: "",
//       variantName: "",

//       attributes: [],
//       specifications: [],

//       images: [],

//       pricing: {
//         mrp: 0,
//         sellingPrice: 0,
//         costPrice: 0,
//         tax: 0,
//         discount: 0,
//       },

//       inventory: {
//         stock: 0,
//         reserved: 0,
//         lowStockAlert: 5,
//       },

//       shipping: {
//         weight: 0,
//         length: 0,
//         breadth: 0,
//         height: 0,
//       },

//       isDefault: false,
//       status: "active",

//       primaryImageIndex: 0,
//     });
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
//         <h2 className="text-2xl font-bold">Variant Management</h2>
//         <button type="button" onClick={addNewVariant} className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
//           <Plus size={20} /> Add New Variant
//         </button>
//       </div>

//       {fields.map((field, index) => (
//         <VariantAccordion key={field.id} index={index} remove={remove} />
//       ))}
      
//       <div className="flex justify-between mt-10 pt-6 border-t">
//         <button type="button" onClick={previous} className="text-gray-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-100">← Previous Step</button>
//         <button type="button" onClick={next} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">Save & Continue →</button>
//       </div>
//     </div>
//   );
// }

// function VariantAccordion({ index, remove }) {
//   const [isOpen, setIsOpen] = useState(true);
//   const { register, control, setValue } = useFormContext();
  
//   // Watch pricing for auto-discount
//   const pricing = useWatch({ name: `variants.${index}.pricing`, control });
//   const discount = pricing.mrp > 0 ? (((pricing.mrp - pricing.sellingPrice) / pricing.mrp) * 100).toFixed(1) : 0;
//   const title = useWatch({
//     control,
//     name: "title",
//   });

//   const attributes = useWatch({
//     control,
//     name: `variants.${index}.attributes`,
//   });

//   useEffect(() => {

//     const variantName = createVariantName(attributes);

//     setValue(
//       `variants.${index}.variantName`,
//       variantName
//     );

//     const sku = createSku(
//       title,
//       attributes
//     );

//     setValue(
//       `variants.${index}.sku`,
//       sku
//     );

//   }, [title, attributes]);

//   return (
//     <div className="border border-gray-200 rounded-xl bg-white mb-4">
//       <div className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
//         <span className="font-bold">Variant {index + 1}</span>
//         <button type="button" onClick={(e) => { e.stopPropagation(); remove(index); }} className="text-red-500"><Trash2 size={18} /></button>
//       </div>

//       {isOpen && (
//         <div className="p-6 space-y-6">
//           {/* 1. Dynamic Attribute Section */}
//           <AttributeManager index={index} />

//           {/* 2. Pricing & Auto-Discount */}
//           <div className="grid grid-cols-4 gap-4 bg-blue-50 p-4 rounded-lg">
//             <input type="number" {...register(`variants.${index}.pricing.mrp`)} placeholder="MRP" className="p-2 border rounded" />
//             <input type="number" {...register(`variants.${index}.pricing.sellingPrice`)} placeholder="Selling Price" className="p-2 border rounded" />
//             <input type="number" {...register(`variants.${index}.pricing.costPrice`)} placeholder="Cost Price" className="p-2 border rounded" />
//             <input type="text" value={`${discount}% OFF`} readOnly className="p-2 border rounded bg-gray-100 font-bold text-green-600" />
//           </div>
//           {/* SKU / Barcode */}
//           <div className="grid md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border">

//             <div>
//               <label className="block text-sm font-semibold mb-2">
//                 SKU <span className="text-red-500">*</span>
//               </label>

//               <input
//                 readOnly
//                 {...register(`variants.${index}.sku`)}
//                 placeholder="e.g. IP16PM-BLK-256"
//                 className="w-full border rounded-lg p-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold mb-2">
//                 Barcode
//               </label>

//               <input
//                 type="text"
//                 {...register(`variants.${index}.barcode`)}
//                 placeholder="Barcode"
//                 className="w-full border rounded-lg p-2"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold mb-2">
//                 Variant Name
//               </label>

//               <input
//                 readOnly
//                 {...register(`variants.${index}.variantName`)}
//                 placeholder="Black / 256GB"
//                 className="w-full border rounded-lg p-2"
//               />
//             </div>

//           </div>

//           {/* 3. Image Management */}
//           <ImageManager index={index} />
//           {/* 4. Inventory & Shipping */}
//           <div className="grid lg:grid-cols-2 gap-6">

//             {/* Inventory */}
//             <div className="bg-gray-50 border rounded-xl p-5">
//               <h3 className="text-lg font-semibold mb-4">
//                 Inventory
//               </h3>

//               <div className="grid grid-cols-3 gap-4">

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Stock
//                   </label>

//                   <input
//                     type="number"
//                     min={0}
//                     {...register(`variants.${index}.inventory.stock`, {
//                       valueAsNumber: true,
//                     })}
//                     placeholder="0"
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Reserved
//                   </label>

//                   <input
//                     type="number"
//                     min={0}
//                     {...register(`variants.${index}.inventory.reserved`, {
//                       valueAsNumber: true,
//                     })}
//                     placeholder="0"
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Low Stock Alert
//                   </label>

//                   <input
//                     type="number"
//                     min={0}
//                     {...register(
//                       `variants.${index}.inventory.lowStockAlert`,
//                       {
//                         valueAsNumber: true,
//                       }
//                     )}
//                     placeholder="5"
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>

//               </div>
//             </div>

//             {/* Shipping */}
//             <div className="bg-gray-50 border rounded-xl p-5">
//               <h3 className="text-lg font-semibold mb-4">
//                 Shipping Profile
//               </h3>

//               <div className="grid grid-cols-2 gap-4">

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Weight (kg)
//                   </label>

//                   <input
//                     type="number"
//                     step="0.01"
//                     min={0}
//                     {...register(`variants.${index}.shipping.weight`, {
//                       valueAsNumber: true,
//                     })}
//                     placeholder="0.50"
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Length (cm)
//                   </label>

//                   <input
//                     type="number"
//                     step="0.1"
//                     min={0}
//                     {...register(`variants.${index}.shipping.length`, {
//                       valueAsNumber: true,
//                     })}
//                     placeholder="20"
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Breadth (cm)
//                   </label>

//                   <input
//                     type="number"
//                     step="0.1"
//                     min={0}
//                     {...register(`variants.${index}.shipping.breadth`, {
//                       valueAsNumber: true,
//                     })}
//                     placeholder="15"
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">
//                     Height (cm)
//                   </label>

//                   <input
//                     type="number"
//                     step="0.1"
//                     min={0}
//                     {...register(`variants.${index}.shipping.height`, {
//                       valueAsNumber: true,
//                     })}
//                     placeholder="8"
//                     className="w-full border rounded-lg p-2"
//                   />
//                 </div>

//               </div>

//               <p className="text-xs text-gray-500 mt-3">
//                 Used for courier charge calculation and volumetric weight.
//               </p>

//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">
//                 Package Type
//               </label>

//               <select
//                 {...register(`variants.${index}.shipping.packageType`)}
//                 className="w-full border rounded-lg p-2"
//               >
//                 <option value="box">Box</option>
//                 <option value="polybag">Poly Bag</option>
//                 <option value="envelope">Envelope</option>
//                 <option value="tube">Tube</option>
//                 <option value="crate">Crate</option>
//                 <option value="pallet">Pallet</option>
//               </select>
//             </div>

//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // Sub-components for better organization
// function AttributeManager({ index }) {
//   const { control, register } = useFormContext();
//   const { fields, append, remove } = useFieldArray({ 
//     control, 
//     name: `variants.${index}.attributes` 
//   });

//   // Predefined options
//   const attributeOptions = ["Color", "RAM", "Storage", "Material", "Size", "Weight", "Warranty"];

//   const handleSelectAttribute = (attrName) => {
//     // Check karein ki pehle se add toh nahi hai
//     const exists = fields.find((f) => f.name === attrName);
//     if (!exists) {
//       append({ name: attrName, value: "" });
//     }
//   };

//   return (
//     <div className="space-y-4">
//       {/* 1. Selection Menu */}
//       <div>
//         <label className="text-sm font-semibold text-gray-600 mb-2 block">Add Attribute</label>
//         <div className="flex gap-2 flex-wrap">
//           {attributeOptions.map((opt) => (
//             <button
//               key={opt}
//               type="button"
//               onClick={() => handleSelectAttribute(opt)}
//               className="px-3 py-1 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 border rounded-full text-xs transition-colors"
//             >
//               + {opt}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* 2. Dynamic Fields */}
//       {fields.length > 0 && (
//         <div className="grid grid-cols-2 gap-4">
//           {fields.map((field, attrIdx) => (
//             <div key={field.id} className="relative border rounded-lg p-3 bg-gray-50">
//               <label className="text-[10px] uppercase font-bold text-gray-500">{field.name}</label>
//               <input 
//                 {...register(`variants.${index}.attributes.${attrIdx}.value`)} 
//                 placeholder={`Enter ${field.name}`}
//                 className="w-full bg-transparent outline-none mt-1"
//               />
//               <button 
//                 type="button"
//                 onClick={() => remove(attrIdx)}
//                 className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
//               >
//                 <X size={14} />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function ImageManager({ index }) {
//   const { control, setValue, watch } = useFormContext();
//   const images = watch(`variants.${index}.images`) || [];
//   const primaryIdx = watch(`variants.${index}.primaryImageIndex`) || 0;

//   const handleFile = (e) => {
//     if (e.target.files) {
//       const newFiles = Array.from(e.target.files);
//       setValue(`variants.${index}.images`, [...images, ...newFiles]);
//     }
//   };

//   const removeImage = (e, imgIdx) => {
//     e.stopPropagation(); // Parent click se bachne ke liye
//     const updatedImages = images.filter((_, i) => i !== imgIdx);
//     setValue(`variants.${index}.images`, updatedImages);
//     // Agar primary image delete hui toh index reset karein
//     if (primaryIdx >= updatedImages.length) setValue(`variants.${index}.primaryImageIndex`, 0);
//   };

//   return (
//     <div>
//       <label className="block text-sm font-semibold mb-2">Product Images</label>
//       <input type="file" multiple onChange={handleFile} className="mb-4" />
      
//       <div className="flex gap-4 flex-wrap">
//         {images.map((img, i) => {
//           // SAFE CHECK: Check if it's a valid File/Blob
//           const isFile = img instanceof File || img instanceof Blob;
          
//           return (
//             <div 
//               key={i} 
//               className={`relative w-24 h-24 border-2 rounded-lg cursor-pointer ${primaryIdx === i ? 'border-blue-500' : 'border-gray-200'}`} 
//               onClick={() => setValue(`variants.${index}.primaryImageIndex`, i)}
//             >
//               {isFile ? (
//                 <img 
//                   src={URL.createObjectURL(img)} 
//                   alt="preview" 
//                   className="w-full h-full object-cover rounded-lg" 
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Preview</div>
//               )}
              
//               {/* Cross Icon for Remove */}
//               <button 
//                 type="button"
//                 onClick={(e) => removeImage(e, i)}
//                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//               >
//                 <X size={12} />
//               </button>

//               {primaryIdx === i && (
//                 <div className="absolute bottom-0 w-full bg-blue-500 text-white text-[10px] text-center rounded-b-md">
//                   Primary
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// function createVariantName(attributes = []) {

//   return attributes
//     .filter(a => a.value)
//     .map(a => a.value)
//     .join(" / ");

// }

// function createSku(title = "", attributes = []) {

//   const product = title
//     .replace(/[^a-zA-Z0-9 ]/g, "")
//     .split(" ")
//     .map(word => word.substring(0, 3).toUpperCase())
//     .join("-");

//   const attr = attributes
//     .filter(a => a.value)
//     .map(a =>
//       a.value
//         .replace(/[^a-zA-Z0-9]/g, "")
//         .substring(0, 4)
//         .toUpperCase()
//     )
//     .join("-");

//   const random = Math.random()
//     .toString(36)
//     .substring(2, 6)
//     .toUpperCase();

//   return `${product}-${attr}-${random}`;


import React, { useState, useEffect } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { Plus, Trash2, X, ClipboardCheck } from "lucide-react";

export default function Step4Variants({ next, previous }) {
  const { control } = useFormContext();
  const { fields, append, remove } = useFieldArray({ control, name: "variants" });

  const addNewVariant = () => {
    append({
      sku: "", barcode: "", variantName: "", attributes: [], specifications: [], images: [],
      pricing: { mrp: 0, sellingPrice: 0, costPrice: 0, tax: 0, discount: 0 },
      inventory: { stock: 0, reserved: 0, lowStockAlert: 5 },
      shipping: { weight: 0, length: 0, breadth: 0, height: 0, packageType: "box" },
      isDefault: false, status: "active", primaryImageIndex: 0,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold">Variant Management</h2>
        <button type="button" onClick={addNewVariant} className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Plus size={20} /> Add New Variant
        </button>
      </div>

      {fields.map((field, index) => (
        <VariantAccordion key={field.id} index={index} remove={remove} />
      ))}
      
      <div className="flex justify-between mt-10 pt-6 border-t">
        <button type="button" onClick={previous} className="text-gray-600 font-medium px-6 py-3 rounded-lg hover:bg-gray-100">← Previous Step</button>
        <button type="button" onClick={next} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700">Save & Continue →</button>
      </div>
    </div>
  );
}

function VariantAccordion({ index, remove }) {
  const [isOpen, setIsOpen] = useState(true);
  const { register, control, setValue, getValues, reset } = useFormContext();
  
  const pricing = useWatch({ name: `variants.${index}.pricing`, control });
  const discount = pricing?.mrp > 0 ? (((pricing.mrp - pricing.sellingPrice) / pricing.mrp) * 100).toFixed(1) : 0;
  const title = useWatch({ control, name: "title" });
  const attributes = useWatch({ control, name: `variants.${index}.attributes` });

  // Copy Logic with Reset (Fix for useFieldArray)
  const copyFromPrevious = () => {
    if (index === 0) return;
    const allData = getValues();
    const prevVariant = allData.variants[index - 1];
    
    // Deep clone to avoid references
    const updatedVariants = [...allData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      pricing: structuredClone(prevVariant.pricing),
      inventory: structuredClone(prevVariant.inventory),
      shipping: structuredClone(prevVariant.shipping),
      specifications: structuredClone(prevVariant.specifications),
      attributes: structuredClone(prevVariant.attributes),
    };

    // Reset forces FieldArray to re-render properly
    reset({ ...allData, variants: updatedVariants });
  };

  useEffect(() => {
    setValue(`variants.${index}.variantName`, createVariantName(attributes));
    setValue(`variants.${index}.sku`, createSku(title, attributes));
  }, [title, attributes, index, setValue]);

  return (
    <div className="border border-gray-200 rounded-xl bg-white mb-4">
      <div className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center gap-4">
          <span className="font-bold">Variant {index + 1}</span>
          {index > 0 && (
            <button type="button" onClick={(e) => { e.stopPropagation(); copyFromPrevious(); }} className="text-xs flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200">
              <ClipboardCheck size={14} /> Copy from previous
            </button>
          )}
        </div>
        <button type="button" onClick={(e) => { e.stopPropagation(); remove(index); }} className="text-red-500"><Trash2 size={18} /></button>
      </div>

      {isOpen && (
        <div className="p-6 space-y-6">
          <AttributeManager index={index} />
          <div className="grid grid-cols-4 gap-4 bg-blue-50 p-4 rounded-lg">
            <input type="number" {...register(`variants.${index}.pricing.mrp`, { valueAsNumber: true })} placeholder="MRP" className="p-2 border rounded" />
            <input type="number" {...register(`variants.${index}.pricing.sellingPrice`, { valueAsNumber: true })} placeholder="Selling Price" className="p-2 border rounded" />
            <input type="number" {...register(`variants.${index}.pricing.costPrice`, { valueAsNumber: true })} placeholder="Cost Price" className="p-2 border rounded" />
            <input type="text" value={`${discount}% OFF`} readOnly className="p-2 border rounded bg-gray-100 font-bold text-green-600" />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <input readOnly {...register(`variants.${index}.sku`)} className="w-full border rounded-lg p-2 bg-gray-50" placeholder="SKU" />
            <input {...register(`variants.${index}.barcode`)} placeholder="Barcode" className="w-full border rounded-lg p-2" />
            <input readOnly {...register(`variants.${index}.variantName`)} className="w-full border rounded-lg p-2 bg-gray-50" placeholder="Variant Name" />
          </div>

          <ImageManager index={index} />
          {/* Add remaining sections (Inventory/Shipping) here exactly as per your original file */}

          <div className="grid lg:grid-cols-2 gap-6">

            {/* Inventory */}
            <div className="bg-gray-50 border rounded-xl p-5">
              <h3 className="text-lg font-semibold mb-4">
                Inventory
              </h3>

              <div className="grid grid-cols-3 gap-4">

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Stock
                  </label>

                  <input
                    type="number"
                    min={0}
                    {...register(`variants.${index}.inventory.stock`, {
                      valueAsNumber: true,
                    })}
                    placeholder="0"
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reserved
                  </label>

                  <input
                    type="number"
                    min={0}
                    {...register(`variants.${index}.inventory.reserved`, {
                      valueAsNumber: true,
                    })}
                    placeholder="0"
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Low Stock Alert
                  </label>

                  <input
                    type="number"
                    min={0}
                    {...register(
                      `variants.${index}.inventory.lowStockAlert`,
                      {
                        valueAsNumber: true,
                      }
                    )}
                    placeholder="5"
                    className="w-full border rounded-lg p-2"
                  />
                </div>

              </div>
            </div>

            {/* Shipping */}
            <div className="bg-gray-50 border rounded-xl p-5">
              <h3 className="text-lg font-semibold mb-4">
                Shipping Profile
              </h3>

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Weight (kg)
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    {...register(`variants.${index}.shipping.weight`, {
                      valueAsNumber: true,
                    })}
                    placeholder="0.50"
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Length (cm)
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    {...register(`variants.${index}.shipping.length`, {
                      valueAsNumber: true,
                    })}
                    placeholder="20"
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Breadth (cm)
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    {...register(`variants.${index}.shipping.breadth`, {
                      valueAsNumber: true,
                    })}
                    placeholder="15"
                    className="w-full border rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Height (cm)
                  </label>

                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    {...register(`variants.${index}.shipping.height`, {
                      valueAsNumber: true,
                    })}
                    placeholder="8"
                    className="w-full border rounded-lg p-2"
                  />
                </div>

              </div>

              <p className="text-xs text-gray-500 mt-3">
                Used for courier charge calculation and volumetric weight.
              </p>

            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Package Type
              </label>

              <select
                {...register(`variants.${index}.shipping.packageType`)}
                className="w-full border rounded-lg p-2"
              >
                <option value="box">Box</option>
                <option value="polybag">Poly Bag</option>
                <option value="envelope">Envelope</option>
                <option value="tube">Tube</option>
                <option value="crate">Crate</option>
                <option value="pallet">Pallet</option>
              </select>
            </div>

          </div>
        
        </div>
      )}
    </div>
  );
}

// Keep your existing AttributeManager, ImageManager, createVariantName, and createSku helper functions below...

function AttributeManager({ index }) {
  const { control, register } = useFormContext();
  const { fields, append, remove } = useFieldArray({ 
    control, 
    name: `variants.${index}.attributes` 
  });

  // Predefined options
  const attributeOptions = ["Color", "RAM", "Storage", "Material", "Size", "Weight", "Warranty"];

  const handleSelectAttribute = (attrName) => {
    // Check karein ki pehle se add toh nahi hai
    const exists = fields.find((f) => f.name === attrName);
    if (!exists) {
      append({ name: attrName, value: "" });
    }
  };

  return (
    <div className="space-y-4">
      {/* 1. Selection Menu */}
      <div>
        <label className="text-sm font-semibold text-gray-600 mb-2 block">Add Attribute</label>
        <div className="flex gap-2 flex-wrap">
          {attributeOptions.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelectAttribute(opt)}
              className="px-3 py-1 bg-gray-100 hover:bg-blue-100 hover:text-blue-700 border rounded-full text-xs transition-colors"
            >
              + {opt}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Dynamic Fields */}
      {fields.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {fields.map((field, attrIdx) => (
            <div key={field.id} className="relative border rounded-lg p-3 bg-gray-50">
              <label className="text-[10px] uppercase font-bold text-gray-500">{field.name}</label>
              <input 
                {...register(`variants.${index}.attributes.${attrIdx}.value`)} 
                placeholder={`Enter ${field.name}`}
                className="w-full bg-transparent outline-none mt-1"
              />
              <button 
                type="button"
                onClick={() => remove(attrIdx)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ImageManager({ index }) {
  const { control, setValue, watch } = useFormContext();
  const images = watch(`variants.${index}.images`) || [];
  const primaryIdx = watch(`variants.${index}.primaryImageIndex`) || 0;

  const handleFile = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setValue(`variants.${index}.images`, [...images, ...newFiles]);
    }
  };

  const removeImage = (e, imgIdx) => {
    e.stopPropagation(); // Parent click se bachne ke liye
    const updatedImages = images.filter((_, i) => i !== imgIdx);
    setValue(`variants.${index}.images`, updatedImages);
    // Agar primary image delete hui toh index reset karein
    if (primaryIdx >= updatedImages.length) setValue(`variants.${index}.primaryImageIndex`, 0);
  };

  return (
    <div>
      <label className="block text-sm font-semibold mb-2">Product Images</label>
      <input type="file" multiple onChange={handleFile} className="mb-4" />
      
      <div className="flex gap-4 flex-wrap">
        {images.map((img, i) => {
          // SAFE CHECK: Check if it's a valid File/Blob
          const isFile = img instanceof File || img instanceof Blob;
          
          return (
            <div 
              key={i} 
              className={`relative w-24 h-24 border-2 rounded-lg cursor-pointer ${primaryIdx === i ? 'border-blue-500' : 'border-gray-200'}`} 
              onClick={() => setValue(`variants.${index}.primaryImageIndex`, i)}
            >
              {isFile ? (
                <img 
                  src={URL.createObjectURL(img)} 
                  alt="preview" 
                  className="w-full h-full object-cover rounded-lg" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Preview</div>
              )}
              
              {/* Cross Icon for Remove */}
              <button 
                type="button"
                onClick={(e) => removeImage(e, i)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <X size={12} />
              </button>

              {primaryIdx === i && (
                <div className="absolute bottom-0 w-full bg-blue-500 text-white text-[10px] text-center rounded-b-md">
                  Primary
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function createVariantName(attributes = []) {

  return attributes
    .filter(a => a.value)
    .map(a => a.value)
    .join(" / ");

}

function createSku(title = "", attributes = []) {

  const product = title
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .map(word => word.substring(0, 3).toUpperCase())
    .join("-");

  const attr = attributes
    .filter(a => a.value)
    .map(a =>
      a.value
        .replace(/[^a-zA-Z0-9]/g, "")
        .substring(0, 4)
        .toUpperCase()
    )
    .join("-");

  const random = Math.random()
    .toString(36)
    .substring(2, 6)
    .toUpperCase();

  return `${product}-${attr}-${random}`;

}