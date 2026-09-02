// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   ArrowLeft,
//   Save,
//   RefreshCw,
//   Plus,
//   Trash2,
//   Image as ImageIcon,
//   Package,
//   Layers,
//   Tag,
//   Truck,
//   ShieldCheck,
//   Search,
//   ChevronDown,
//   ChevronUp,
//   X,
//   CheckCircle,
//   AlertCircle,
// } from "lucide-react";

// import {
//   getMyProducts,
//   updateProduct,
//   updateProductVariant,
// } from "../services/productEditApi";

// function EditProduct() {
//   const { productId } = useParams();
//   const navigate = useNavigate();

//   // =========================================================
//   // PRODUCT
//   // =========================================================

//   const [product, setProduct] = useState(null);

//   const [productForm, setProductForm] = useState(null);

//   // =========================================================
//   // VARIANT
//   // =========================================================

//   const [selectedVariantId, setSelectedVariantId] = useState("");
//   const [variantForm, setVariantForm] = useState(null);

//   // =========================================================
//   // UI STATES
//   // =========================================================

//   const [loading, setLoading] = useState(true);

//   const [savingProduct, setSavingProduct] = useState(false);
//   const [savingVariant, setSavingVariant] = useState(false);

//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const [activeSection, setActiveSection] = useState("basic");

//   // =========================================================
//   // IMAGE URL FIX
//   // =========================================================

//   const getImageUrl = (url) => {
//     if (!url) return "";

//     const markdownMatch = url.match(/^\[(.*?)\]\((.*?)\)$/);

//     if (markdownMatch) {
//       return markdownMatch[2];
//     }

//     return url;
//   };

//   // =========================================================
//   // FETCH PRODUCT
//   // =========================================================

//   const fetchProduct = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const data = await getMyProducts();

//       if (!data?.success) {
//         throw new Error(data?.message || "Failed to load products");
//       }

//       const foundProduct = data.products?.find(
//         (item) => item._id === productId
//       );

//       if (!foundProduct) {
//         throw new Error("Product not found");
//       }

//       setProduct(foundProduct);

//       // Product form
//       setProductForm(createProductForm(foundProduct));

//       // Default variant
//       const defaultVariant =
//         foundProduct.variants?.find(
//           (variant) => variant._id === foundProduct.defaultVariant
//         ) || foundProduct.variants?.[0];

//       if (defaultVariant) {
//         setSelectedVariantId(defaultVariant._id);
//         setVariantForm(createVariantForm(defaultVariant));
//       }
//     } catch (err) {
//       console.error("EDIT PRODUCT LOAD ERROR:", err);

//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           "Failed to load product"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProduct();
//   }, [productId]);

//   // =========================================================
//   // PRODUCT FORM FACTORY
//   // =========================================================

//   const createProductForm = (data) => ({
//     title: data.title || "",
//     slug: data.slug || "",
//     shortDescription: data.shortDescription || "",
//     description: data.description || "",

//     category: data.category?._id || data.category || "",
//     subCategory: data.subCategory?._id || data.subCategory || "",
//     subCategoryLevel2:
//       data.subCategoryLevel2?._id ||
//       data.subCategoryLevel2 ||
//       "",

//     brand: data.brand || "",

//     highlights: data.highlights || [],
//     tags: data.tags || [],

//     manufacturer: data.manufacturer || "",
//     countryOfOrigin: data.countryOfOrigin || "",

//     services: {
//       returnPolicy: {
//         returnable:
//           data.services?.returnPolicy?.returnable ?? true,

//         returnDays:
//           data.services?.returnPolicy?.returnDays ?? 7,

//         returnType:
//           data.services?.returnPolicy?.returnType ||
//           "replacement",

//         conditions:
//           data.services?.returnPolicy?.conditions || [],
//       },

//       cashOnDelivery: {
//         available:
//           data.services?.cashOnDelivery?.available ?? true,
//       },

//       warranty: {
//         available:
//           data.services?.warranty?.available ?? false,

//         duration:
//           data.services?.warranty?.duration || "",

//         type:
//           data.services?.warranty?.type || "none",
//       },

//       support: {
//         available:
//           data.services?.support?.available ?? true,

//         contactType:
//           data.services?.support?.contactType || "seller",
//       },
//     },

//     seo: {
//       metaTitle: data.seo?.metaTitle || "",

//       metaDescription:
//         data.seo?.metaDescription || "",

//       keywords: data.seo?.keywords || [],
//     },

//     status: data.status || "draft",

//     isPublished: data.isPublished ?? false,
//   });

//   // =========================================================
//   // VARIANT FORM FACTORY
//   // =========================================================

//   const createVariantForm = (data) => ({
//     sku: data.sku || "",
//     barcode: data.barcode || "",
//     variantName: data.variantName || "",

//     attributes:
//       data.attributes?.map((item) => ({
//         name: item.name || "",
//         value: item.value || "",
//       })) || [],

//     specifications:
//       data.specifications?.map((group) => ({
//         group: group.group || "",

//         fields:
//           group.fields?.map((field) => ({
//             key: field.key || "",
//             value: field.value || "",
//           })) || [],
//       })) || [],

//     images:
//       data.images?.map((image) => ({
//         url: getImageUrl(image.url),
//         public_id: image.public_id || "",
//         alt: image.alt || "",
//         isPrimary: image.isPrimary || false,
//         sortOrder: image.sortOrder ?? 0,
//       })) || [],

//     pricing: {
//       mrp: data.pricing?.mrp ?? 0,
//       sellingPrice: data.pricing?.sellingPrice ?? 0,
//       costPrice: data.pricing?.costPrice ?? 0,
//       tax: data.pricing?.tax ?? 0,
//       discount: data.pricing?.discount ?? 0,
//     },

//     inventory: {
//       stock: data.inventory?.stock ?? 0,
//       reserved: data.inventory?.reserved ?? 0,
//       lowStockAlert: data.inventory?.lowStockAlert ?? 5,
//     },

//     shipping: {
//       weight: data.shipping?.weight ?? 0,

//       dimensions: {
//         length:
//           data.shipping?.dimensions?.length ?? 0,

//         breadth:
//           data.shipping?.dimensions?.breadth ?? 0,

//         height:
//           data.shipping?.dimensions?.height ?? 0,
//       },

//       packageType:
//         data.shipping?.packageType || "box",

//       volumetricWeight:
//         data.shipping?.volumetricWeight ?? 0,
//     },

//     isDefault: data.isDefault ?? false,

//     status: data.status || "active",
//   });

//   // =========================================================
//   // PRODUCT INPUT UPDATE
//   // =========================================================

//   const updateProductField = (field, value) => {
//     setProductForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // =========================================================
//   // PRODUCT NESTED UPDATE
//   // =========================================================

//   const updateProductNested = (
//     section,
//     field,
//     value
//   ) => {
//     setProductForm((prev) => ({
//       ...prev,

//       [section]: {
//         ...prev[section],
//         [field]: value,
//       },
//     }));
//   };

//   // =========================================================
//   // VARIANT INPUT UPDATE
//   // =========================================================

//   const updateVariantField = (field, value) => {
//     setVariantForm((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   // =========================================================
//   // VARIANT NESTED UPDATE
//   // =========================================================

//   const updateVariantNested = (
//     section,
//     field,
//     value
//   ) => {
//     setVariantForm((prev) => ({
//       ...prev,

//       [section]: {
//         ...prev[section],
//         [field]: value,
//       },
//     }));
//   };

//   // =========================================================
//   // VARIANT DEEP UPDATE
//   // =========================================================

//   const updateVariantDeep = (
//     section,
//     parentField,
//     field,
//     value
//   ) => {
//     setVariantForm((prev) => ({
//       ...prev,

//       [section]: {
//         ...prev[section],

//         [parentField]: {
//           ...prev[section][parentField],
//           [field]: value,
//         },
//       },
//     }));
//   };

//   // =========================================================
//   // SELECT VARIANT
//   // =========================================================

//   const handleVariantChange = (variantId) => {
//     setSelectedVariantId(variantId);

//     const selected = product?.variants?.find(
//       (variant) => variant._id === variantId
//     );

//     if (selected) {
//       setVariantForm(createVariantForm(selected));
//     }
//   };

//   // =========================================================
//   // SAVE PRODUCT
//   // =========================================================

//   const handleSaveProduct = async () => {
//     try {
//       setSavingProduct(true);
//       setError("");
//       setSuccess("");

//       const payload = {
//         title: productForm.title,
//         slug: productForm.slug,
//         shortDescription:
//           productForm.shortDescription,

//         description: productForm.description,

//         category: productForm.category,
//         subCategory: productForm.subCategory || null,

//         subCategoryLevel2:
//           productForm.subCategoryLevel2 || null,

//         brand: productForm.brand,

//         highlights: productForm.highlights,
//         tags: productForm.tags,

//         manufacturer:
//           productForm.manufacturer,

//         countryOfOrigin:
//           productForm.countryOfOrigin,

//         services: productForm.services,

//         seo: productForm.seo,

//         status: productForm.status,

//         isPublished:
//           productForm.isPublished,
//       };

//       const data = await updateProduct(
//         productId,
//         payload
//       );

//       if (!data?.success) {
//         throw new Error(
//           data?.message || "Failed to update product"
//         );
//       }

//       setSuccess("Product updated successfully.");

//       setProduct((prev) => ({
//         ...prev,
//         ...data.product,
//       }));

//       setTimeout(() => {
//         setSuccess("");
//       }, 3000);
//     } catch (err) {
//       console.error("UPDATE PRODUCT ERROR:", err);

//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           "Failed to update product"
//       );
//     } finally {
//       setSavingProduct(false);
//     }
//   };

//   // =========================================================
//   // SAVE VARIANT
//   // =========================================================

//   const handleSaveVariant = async () => {
//     if (!selectedVariantId || !variantForm) {
//       return;
//     }

//     try {
//       setSavingVariant(true);
//       setError("");
//       setSuccess("");

//       const payload = {
//         sku: variantForm.sku,
//         barcode: variantForm.barcode,
//         variantName: variantForm.variantName,

//         attributes: variantForm.attributes,

//         specifications:
//           variantForm.specifications,

//         images: variantForm.images,

//         pricing: variantForm.pricing,

//         inventory: variantForm.inventory,

//         shipping: variantForm.shipping,

//         isDefault: variantForm.isDefault,

//         status: variantForm.status,
//       };

//       const data = await updateProductVariant(
//         productId,
//         selectedVariantId,
//         payload
//       );

//       if (!data?.success) {
//         throw new Error(
//           data?.message ||
//             "Failed to update variant"
//         );
//       }

//       setSuccess("Variant updated successfully.");

//       // Update local product state
//       setProduct((prev) => ({
//         ...prev,

//         variants: prev.variants?.map(
//           (variant) =>
//             variant._id === selectedVariantId
//               ? {
//                   ...variant,
//                   ...data.variant,
//                 }
//               : variant
//         ),
//       }));

//       setTimeout(() => {
//         setSuccess("");
//       }, 3000);
//     } catch (err) {
//       console.error("UPDATE VARIANT ERROR:", err);

//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           "Failed to update variant"
//       );
//     } finally {
//       setSavingVariant(false);
//     }
//   };

//   // =========================================================
//   // HIGHLIGHTS
//   // =========================================================

//   const addHighlight = () => {
//     setProductForm((prev) => ({
//       ...prev,
//       highlights: [
//         ...prev.highlights,
//         "",
//       ],
//     }));
//   };

//   const updateHighlight = (index, value) => {
//     setProductForm((prev) => ({
//       ...prev,

//       highlights: prev.highlights.map(
//         (item, i) =>
//           i === index ? value : item
//       ),
//     }));
//   };

//   const removeHighlight = (index) => {
//     setProductForm((prev) => ({
//       ...prev,

//       highlights: prev.highlights.filter(
//         (_, i) => i !== index
//       ),
//     }));
//   };

//   // =========================================================
//   // TAGS
//   // =========================================================

//   const addTag = () => {
//     setProductForm((prev) => ({
//       ...prev,

//       tags: [
//         ...prev.tags,
//         "",
//       ],
//     }));
//   };

//   const updateTag = (index, value) => {
//     setProductForm((prev) => ({
//       ...prev,

//       tags: prev.tags.map(
//         (item, i) =>
//           i === index ? value : item
//       ),
//     }));
//   };

//   const removeTag = (index) => {
//     setProductForm((prev) => ({
//       ...prev,

//       tags: prev.tags.filter(
//         (_, i) => i !== index
//       ),
//     }));
//   };

//   // =========================================================
//   // ATTRIBUTES
//   // =========================================================

//   const addAttribute = () => {
//     setVariantForm((prev) => ({
//       ...prev,

//       attributes: [
//         ...prev.attributes,
//         {
//           name: "",
//           value: "",
//         },
//       ],
//     }));
//   };

//   const updateAttribute = (
//     index,
//     field,
//     value
//   ) => {
//     setVariantForm((prev) => ({
//       ...prev,

//       attributes: prev.attributes.map(
//         (attribute, i) =>
//           i === index
//             ? {
//                 ...attribute,
//                 [field]: value,
//               }
//             : attribute
//       ),
//     }));
//   };

//   const removeAttribute = (index) => {
//     setVariantForm((prev) => ({
//       ...prev,

//       attributes:
//         prev.attributes.filter(
//           (_, i) => i !== index
//         ),
//     }));
//   };

//   // =========================================================
//   // SPECIFICATIONS
//   // =========================================================

//   const addSpecificationGroup = () => {
//     setVariantForm((prev) => ({
//       ...prev,

//       specifications: [
//         ...prev.specifications,

//         {
//           group: "",
//           fields: [],
//         },
//       ],
//     }));
//   };

//   const updateSpecificationGroup = (
//     groupIndex,
//     value
//   ) => {
//     setVariantForm((prev) => ({
//       ...prev,

//       specifications:
//         prev.specifications.map(
//           (group, i) =>
//             i === groupIndex
//               ? {
//                   ...group,
//                   group: value,
//                 }
//               : group
//         ),
//     }));
//   };

//   const removeSpecificationGroup = (
//     groupIndex
//   ) => {
//     setVariantForm((prev) => ({
//       ...prev,

//       specifications:
//         prev.specifications.filter(
//           (_, i) => i !== groupIndex
//         ),
//     }));
//   };

//   const addSpecificationField = (
//     groupIndex
//   ) => {
//     setVariantForm((prev) => ({
//       ...prev,

//       specifications:
//         prev.specifications.map(
//           (group, i) =>
//             i === groupIndex
//               ? {
//                   ...group,

//                   fields: [
//                     ...group.fields,

//                     {
//                       key: "",
//                       value: "",
//                     },
//                   ],
//                 }
//               : group
//         ),
//     }));
//   };

//   const updateSpecificationField = (
//     groupIndex,
//     fieldIndex,
//     field,
//     value
//   ) => {
//     setVariantForm((prev) => ({
//       ...prev,

//       specifications:
//         prev.specifications.map(
//           (group, i) => {
//             if (i !== groupIndex) {
//               return group;
//             }

//             return {
//               ...group,

//               fields:
//                 group.fields.map(
//                   (item, j) =>
//                     j === fieldIndex
//                       ? {
//                           ...item,
//                           [field]: value,
//                         }
//                       : item
//                 ),
//             };
//           }
//         ),
//     }));
//   };

//   const removeSpecificationField = (
//     groupIndex,
//     fieldIndex
//   ) => {
//     setVariantForm((prev) => ({
//       ...prev,

//       specifications:
//         prev.specifications.map(
//           (group, i) =>
//             i === groupIndex
//               ? {
//                   ...group,

//                   fields:
//                     group.fields.filter(
//                       (_, j) =>
//                         j !== fieldIndex
//                     ),
//                 }
//               : group
//         ),
//     }));
//   };

//   // =========================================================
//   // IMAGES
//   // =========================================================

//   const addImage = () => {
//     setVariantForm((prev) => ({
//       ...prev,

//       images: [
//         ...prev.images,

//         {
//           url: "",
//           public_id: "",
//           alt: "",
//           isPrimary:
//             prev.images.length === 0,
//           sortOrder:
//             prev.images.length,
//         },
//       ],
//     }));
//   };

//   const updateImage = (
//     index,
//     field,
//     value
//   ) => {
//     setVariantForm((prev) => ({
//       ...prev,

//       images: prev.images.map(
//         (image, i) =>
//           i === index
//             ? {
//                 ...image,
//                 [field]: value,
//               }
//             : image
//       ),
//     }));
//   };

//   const setPrimaryImage = (index) => {
//     setVariantForm((prev) => ({
//       ...prev,

//       images: prev.images.map(
//         (image, i) => ({
//           ...image,
//           isPrimary: i === index,
//         })
//       ),
//     }));
//   };

//   const removeImage = (index) => {
//     setVariantForm((prev) => ({
//       ...prev,

//       images: prev.images
//         .filter((_, i) => i !== index)
//         .map((image, i) => ({
//           ...image,
//           sortOrder: i,
//         })),
//     }));
//   };

//   // =========================================================
//   // LOADING
//   // =========================================================

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="flex items-center gap-3 text-gray-500">
//           <RefreshCw className="w-5 h-5 animate-spin" />

//           <span>
//             Loading product...
//           </span>
//         </div>
//       </div>
//     );
//   }

//   // =========================================================
//   // ERROR WITHOUT PRODUCT
//   // =========================================================

//   if (!product || !productForm) {
//     return (
//       <div className="min-h-screen bg-gray-50 p-6">

//         <button
//           onClick={() =>
//             navigate(-1)
//           }
//           className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back
//         </button>

//         <div className="max-w-xl mx-auto mt-20 bg-white border border-red-200 rounded-2xl p-8 text-center">

//           <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />

//           <h2 className="text-xl font-bold text-gray-800">
//             Product Not Found
//           </h2>

//           <p className="text-sm text-gray-500 mt-2">
//             {error ||
//               "Unable to load this product."}
//           </p>

//           <button
//             onClick={() =>
//               navigate(-1)
//             }
//             className="mt-6 px-5 py-2.5 bg-black text-white rounded-lg"
//           >
//             Go Back
//           </button>

//         </div>
//       </div>
//     );
//   }

//   // =========================================================
//   // MAIN UI
//   // =========================================================

//   return (
//     <div className="min-h-screen bg-gray-50">

//       {/* ================================================= */}
//       {/* HEADER */}
//       {/* ================================================= */}

//       <div className="sticky top-0 z-40 bg-white border-b">

//         <div className="px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

//           <div className="flex items-center gap-3">

//             <button
//               onClick={() =>
//                 navigate(-1)
//               }
//               className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </button>

//             <div>

//               <h1 className="text-xl font-bold text-gray-900">
//                 Edit Product
//               </h1>

//               <p className="text-sm text-gray-500 mt-0.5">
//                 {product.title}
//               </p>

//             </div>

//           </div>

//           <div className="flex items-center gap-3">

//             <StatusBadge
//               status={productForm.status}
//             />

//             <button
//               onClick={() =>
//                 navigate(-1)
//               }
//               className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
//             >
//               Cancel
//             </button>

//           </div>

//         </div>

//       </div>

//       {/* ================================================= */}
//       {/* NOTIFICATIONS */}
//       {/* ================================================= */}

//       <div className="max-w-7xl mx-auto px-6 pt-5">

//         {error && (
//           <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-start gap-3">

//             <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

//             <div className="text-sm">
//               {error}
//             </div>

//             <button
//               onClick={() =>
//                 setError("")
//               }
//               className="ml-auto"
//             >
//               <X className="w-4 h-4" />
//             </button>

//           </div>
//         )}

//         {success && (
//           <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-600 flex items-center gap-3">

//             <CheckCircle className="w-5 h-5" />

//             <span className="text-sm">
//               {success}
//             </span>

//           </div>
//         )}

//       </div>

//       {/* ================================================= */}
//       {/* CONTENT */}
//       {/* ================================================= */}

//       <div className="max-w-7xl mx-auto px-6 py-6">

//         <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-6">

//           {/* ================================================= */}
//           {/* SIDEBAR */}
//           {/* ================================================= */}

//           <aside className="lg:sticky lg:top-24 h-fit">

//             <div className="bg-white border border-gray-200 rounded-xl p-2">

//               <SidebarButton
//                 icon={Package}
//                 label="Basic Information"
//                 active={
//                   activeSection ===
//                   "basic"
//                 }
//                 onClick={() =>
//                   setActiveSection("basic")
//                 }
//               />

//               <SidebarButton
//                 icon={Tag}
//                 label="Details"
//                 active={
//                   activeSection ===
//                   "details"
//                 }
//                 onClick={() =>
//                   setActiveSection("details")
//                 }
//               />

//               <SidebarButton
//                 icon={ShieldCheck}
//                 label="Services"
//                 active={
//                   activeSection ===
//                   "services"
//                 }
//                 onClick={() =>
//                   setActiveSection("services")
//                 }
//               />

//               <SidebarButton
//                 icon={Search}
//                 label="SEO"
//                 active={
//                   activeSection ===
//                   "seo"
//                 }
//                 onClick={() =>
//                   setActiveSection("seo")
//                 }
//               />

//               <SidebarButton
//                 icon={Layers}
//                 label="Variants"
//                 active={
//                   activeSection ===
//                   "variants"
//                 }
//                 onClick={() =>
//                   setActiveSection("variants")
//                 }
//               />

//             </div>

//           </aside>

//           {/* ================================================= */}
//           {/* MAIN */}
//           {/* ================================================= */}

//           <main className="space-y-6">

//             {/* ================================================= */}
//             {/* BASIC INFORMATION */}
//             {/* ================================================= */}

//             {(activeSection ===
//               "basic" ||
//               activeSection ===
//                 "details") && (
//               <SectionCard
//                 title="Basic Information"
//                 icon={Package}
//               >

//                 <div className="grid md:grid-cols-2 gap-5">

//                   <InputField
//                     label="Product Title"
//                     value={
//                       productForm.title
//                     }
//                     onChange={(value) =>
//                       updateProductField(
//                         "title",
//                         value
//                       )
//                     }
//                     required
//                   />

//                   <InputField
//                     label="Brand"
//                     value={
//                       productForm.brand
//                     }
//                     onChange={(value) =>
//                       updateProductField(
//                         "brand",
//                         value
//                       )
//                     }
//                     required
//                   />

//                   <InputField
//                     label="Slug"
//                     value={
//                       productForm.slug
//                     }
//                     onChange={(value) =>
//                       updateProductField(
//                         "slug",
//                         value
//                       )
//                     }
//                     required
//                   />

//                   <InputField
//                     label="Manufacturer"
//                     value={
//                       productForm.manufacturer
//                     }
//                     onChange={(value) =>
//                       updateProductField(
//                         "manufacturer",
//                         value
//                       )
//                     }
//                   />

//                   <InputField
//                     label="Category ID"
//                     value={
//                       productForm.category
//                     }
//                     onChange={(value) =>
//                       updateProductField(
//                         "category",
//                         value
//                       )
//                     }
//                   />

//                   <InputField
//                     label="Sub Category ID"
//                     value={
//                       productForm.subCategory
//                     }
//                     onChange={(value) =>
//                       updateProductField(
//                         "subCategory",
//                         value
//                       )
//                     }
//                   />

//                   <InputField
//                     label="Sub Category Level 2 ID"
//                     value={
//                       productForm.subCategoryLevel2
//                     }
//                     onChange={(value) =>
//                       updateProductField(
//                         "subCategoryLevel2",
//                         value
//                       )
//                     }
//                   />

//                   <InputField
//                     label="Country Of Origin"
//                     value={
//                       productForm.countryOfOrigin
//                     }
//                     onChange={(value) =>
//                       updateProductField(
//                         "countryOfOrigin",
//                         value
//                       )
//                     }
//                   />

//                 </div>

//                 <div className="mt-5">

//                   <TextAreaField
//                     label="Short Description"
//                     value={
//                       productForm.shortDescription
//                     }
//                     onChange={(value) =>
//                       updateProductField(
//                         "shortDescription",
//                         value
//                       )
//                     }
//                     rows={3}
//                   />

//                 </div>

//                 <div className="mt-5">

//                   <TextAreaField
//                     label="Description"
//                     value={
//                       productForm.description
//                     }
//                     onChange={(value) =>
//                       updateProductField(
//                         "description",
//                         value
//                       )
//                     }
//                     rows={8}
//                   />

//                 </div>

//               </SectionCard>
//             )}

//             {/* ================================================= */}
//             {/* HIGHLIGHTS & TAGS */}
//             {/* ================================================= */}

//             {(activeSection ===
//               "details" ||
//               activeSection ===
//                 "basic") && (
//               <>

//                 <SectionCard
//                   title="Highlights"
//                   icon={Tag}
//                   action={
//                     <AddButton
//                       onClick={
//                         addHighlight
//                       }
//                       label="Add Highlight"
//                     />
//                   }
//                 >

//                   <div className="space-y-3">

//                     {productForm.highlights
//                       .length === 0 && (
//                       <EmptyText text="No highlights added." />
//                     )}

//                     {productForm.highlights.map(
//                       (
//                         highlight,
//                         index
//                       ) => (
//                         <div
//                           key={index}
//                           className="flex gap-2"
//                         >

//                           <input
//                             value={
//                               highlight
//                             }
//                             onChange={(e) =>
//                               updateHighlight(
//                                 index,
//                                 e.target.value
//                               )
//                             }
//                             placeholder="Enter product highlight"
//                             className="flex-1 input"
//                           />

//                           <button
//                             onClick={() =>
//                               removeHighlight(
//                                 index
//                               )
//                             }
//                             className="w-11 h-11 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>

//                         </div>
//                       )
//                     )}

//                   </div>

//                 </SectionCard>

//                 <SectionCard
//                   title="Tags"
//                   icon={Tag}
//                   action={
//                     <AddButton
//                       onClick={addTag}
//                       label="Add Tag"
//                     />
//                   }
//                 >

//                   <div className="space-y-3">

//                     {productForm.tags
//                       .length === 0 && (
//                       <EmptyText text="No tags added." />
//                     )}

//                     {productForm.tags.map(
//                       (tag, index) => (
//                         <div
//                           key={index}
//                           className="flex gap-2"
//                         >

//                           <input
//                             value={tag}
//                             onChange={(e) =>
//                               updateTag(
//                                 index,
//                                 e.target.value
//                               )
//                             }
//                             placeholder="Enter tag"
//                             className="flex-1 input"
//                           />

//                           <button
//                             onClick={() =>
//                               removeTag(
//                                 index
//                               )
//                             }
//                             className="w-11 h-11 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>

//                         </div>
//                       )
//                     )}

//                   </div>

//                 </SectionCard>

//               </>
//             )}

//             {/* ================================================= */}
//             {/* SERVICES */}
//             {/* ================================================= */}

//             {activeSection ===
//               "services" && (
//               <SectionCard
//                 title="Services"
//                 icon={ShieldCheck}
//               >

//                 {/* RETURN */}

//                 <div className="border border-gray-200 rounded-xl p-5">

//                   <div className="flex items-center justify-between">

//                     <div>
//                       <h3 className="font-semibold">
//                         Return Policy
//                       </h3>

//                       <p className="text-xs text-gray-500 mt-1">
//                         Configure product return policy
//                       </p>
//                     </div>

//                     <Toggle
//                       checked={
//                         productForm.services
//                           .returnPolicy
//                           .returnable
//                       }
//                       onChange={(value) =>
//                         updateProductNested(
//                           "services",
//                           "returnPolicy",
//                           {
//                             ...productForm
//                               .services
//                               .returnPolicy,
//                             returnable:
//                               value,
//                           }
//                         )
//                       }
//                     />

//                   </div>

//                   {productForm.services
//                     .returnPolicy
//                     .returnable && (
//                     <div className="grid md:grid-cols-2 gap-5 mt-5">

//                       <InputField
//                         label="Return Days"
//                         type="number"
//                         value={
//                           productForm
//                             .services
//                             .returnPolicy
//                             .returnDays
//                         }
//                         onChange={(value) =>
//                           updateProductNested(
//                             "services",
//                             "returnPolicy",
//                             {
//                               ...productForm
//                                 .services
//                                 .returnPolicy,

//                               returnDays:
//                                 Number(
//                                   value
//                                 ),
//                             }
//                           )
//                         }
//                       />

//                       <SelectField
//                         label="Return Type"
//                         value={
//                           productForm
//                             .services
//                             .returnPolicy
//                             .returnType
//                         }
//                         onChange={(value) =>
//                           updateProductNested(
//                             "services",
//                             "returnPolicy",
//                             {
//                               ...productForm
//                                 .services
//                                 .returnPolicy,

//                               returnType:
//                                 value,
//                             }
//                           )
//                         }
//                         options={[
//                           [
//                             "replacement",
//                             "Replacement",
//                           ],
//                           [
//                             "refund",
//                             "Refund",
//                           ],
//                           [
//                             "exchange",
//                             "Exchange",
//                           ],
//                           [
//                             "service-center",
//                             "Service Center",
//                           ],
//                           [
//                             "no-return",
//                             "No Return",
//                           ],
//                         ]}
//                       />

//                     </div>
//                   )}

//                 </div>

//                 {/* COD */}

//                 <div className="border border-gray-200 rounded-xl p-5 mt-4">

//                   <div className="flex items-center justify-between">

//                     <div>
//                       <h3 className="font-semibold">
//                         Cash On Delivery
//                       </h3>

//                       <p className="text-xs text-gray-500 mt-1">
//                         Allow customers to pay on delivery
//                       </p>
//                     </div>

//                     <Toggle
//                       checked={
//                         productForm.services
//                           .cashOnDelivery
//                           .available
//                       }
//                       onChange={(value) =>
//                         updateProductNested(
//                           "services",
//                           "cashOnDelivery",
//                           {
//                             available:
//                               value,
//                           }
//                         )
//                       }
//                     />

//                   </div>

//                 </div>

//                 {/* WARRANTY */}

//                 <div className="border border-gray-200 rounded-xl p-5 mt-4">

//                   <div className="flex items-center justify-between">

//                     <div>
//                       <h3 className="font-semibold">
//                         Warranty
//                       </h3>

//                       <p className="text-xs text-gray-500 mt-1">
//                         Product warranty information
//                       </p>
//                     </div>

//                     <Toggle
//                       checked={
//                         productForm.services
//                           .warranty
//                           .available
//                       }
//                       onChange={(value) =>
//                         updateProductNested(
//                           "services",
//                           "warranty",
//                           {
//                             ...productForm
//                               .services
//                               .warranty,

//                             available:
//                               value,
//                           }
//                         )
//                       }
//                     />

//                   </div>

//                   {productForm.services
//                     .warranty
//                     .available && (
//                     <div className="grid md:grid-cols-2 gap-5 mt-5">

//                       <InputField
//                         label="Duration"
//                         value={
//                           productForm
//                             .services
//                             .warranty
//                             .duration
//                         }
//                         onChange={(value) =>
//                           updateProductNested(
//                             "services",
//                             "warranty",
//                             {
//                               ...productForm
//                                 .services
//                                 .warranty,

//                               duration:
//                                 value,
//                             }
//                           )
//                         }
//                       />

//                       <SelectField
//                         label="Warranty Type"
//                         value={
//                           productForm
//                             .services
//                             .warranty
//                             .type
//                         }
//                         onChange={(value) =>
//                           updateProductNested(
//                             "services",
//                             "warranty",
//                             {
//                               ...productForm
//                                 .services
//                                 .warranty,

//                               type: value,
//                             }
//                           )
//                         }
//                         options={[
//                           [
//                             "brand",
//                             "Brand",
//                           ],
//                           [
//                             "seller",
//                             "Seller",
//                           ],
//                           [
//                             "manufacturer",
//                             "Manufacturer",
//                           ],
//                           [
//                             "none",
//                             "None",
//                           ],
//                         ]}
//                       />

//                     </div>
//                   )}

//                 </div>

//                 {/* SUPPORT */}

//                 <div className="border border-gray-200 rounded-xl p-5 mt-4">

//                   <div className="flex items-center justify-between">

//                     <div>
//                       <h3 className="font-semibold">
//                         Support
//                       </h3>
//                     </div>

//                     <Toggle
//                       checked={
//                         productForm.services
//                           .support
//                           .available
//                       }
//                       onChange={(value) =>
//                         updateProductNested(
//                           "services",
//                           "support",
//                           {
//                             ...productForm
//                               .services
//                               .support,

//                             available:
//                               value,
//                           }
//                         )
//                       }
//                     />

//                   </div>

//                   <div className="mt-5">

//                     <SelectField
//                       label="Contact Type"
//                       value={
//                         productForm.services
//                           .support
//                           .contactType
//                       }
//                       onChange={(value) =>
//                         updateProductNested(
//                           "services",
//                           "support",
//                           {
//                             ...productForm
//                               .services
//                               .support,

//                             contactType:
//                               value,
//                           }
//                         )
//                       }
//                       options={[
//                         [
//                           "seller",
//                           "Seller",
//                         ],
//                         [
//                           "brand",
//                           "Brand",
//                         ],
//                         [
//                           "marketplace",
//                           "Marketplace",
//                         ],
//                       ]}
//                     />

//                   </div>

//                 </div>

//               </SectionCard>
//             )}

//             {/* ================================================= */}
//             {/* SEO */}
//             {/* ================================================= */}

//             {activeSection ===
//               "seo" && (
//               <SectionCard
//                 title="SEO"
//                 icon={Search}
//               >

//                 <div className="space-y-5">

//                   <InputField
//                     label="Meta Title"
//                     value={
//                       productForm.seo
//                         .metaTitle
//                     }
//                     onChange={(value) =>
//                       updateProductNested(
//                         "seo",
//                         "metaTitle",
//                         value
//                       )
//                     }
//                   />

//                   <TextAreaField
//                     label="Meta Description"
//                     value={
//                       productForm.seo
//                         .metaDescription
//                     }
//                     onChange={(value) =>
//                       updateProductNested(
//                         "seo",
//                         "metaDescription",
//                         value
//                       )
//                     }
//                     rows={4}
//                   />

//                   <div>

//                     <label className="label">
//                       Keywords
//                     </label>

//                     <div className="space-y-3">

//                       {productForm.seo
//                         .keywords
//                         .map(
//                           (
//                             keyword,
//                             index
//                           ) => (
//                             <div
//                               key={index}
//                               className="flex gap-2"
//                             >

//                               <input
//                                 value={
//                                   keyword
//                                 }
//                                 onChange={(
//                                   e
//                                 ) =>
//                                   setProductForm(
//                                     (
//                                       prev
//                                     ) => ({
//                                       ...prev,

//                                       seo: {
//                                         ...prev.seo,

//                                         keywords:
//                                           prev.seo.keywords.map(
//                                             (
//                                               item,
//                                               i
//                                             ) =>
//                                               i ===
//                                               index
//                                                 ? e
//                                                     .target
//                                                     .value
//                                                 : item
//                                           ),
//                                       },
//                                     })
//                                   )
//                                 }
//                                 className="flex-1 input"
//                                 placeholder="SEO keyword"
//                               />

//                               <button
//                                 onClick={() =>
//                                   setProductForm(
//                                     (
//                                       prev
//                                     ) => ({
//                                       ...prev,

//                                       seo: {
//                                         ...prev.seo,

//                                         keywords:
//                                           prev.seo.keywords.filter(
//                                             (
//                                               _,
//                                               i
//                                             ) =>
//                                               i !==
//                                               index
//                                           ),
//                                       },
//                                     })
//                                   )
//                                 }
//                                 className="w-11 h-11 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                               </button>

//                             </div>
//                           )
//                         )}

//                     </div>

//                     <button
//                       onClick={() =>
//                         setProductForm(
//                           (prev) => ({
//                             ...prev,

//                             seo: {
//                               ...prev.seo,

//                               keywords: [
//                                 ...prev
//                                   .seo
//                                   .keywords,
//                                 "",
//                               ],
//                             },
//                           })
//                         )
//                       }
//                       className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
//                     >
//                       + Add Keyword
//                     </button>

//                   </div>

//                 </div>

//               </SectionCard>
//             )}

//             {/* ================================================= */}
//             {/* PRODUCT STATUS */}
//             {/* ================================================= */}

//             {(activeSection ===
//               "basic" ||
//               activeSection ===
//                 "details") && (
//               <SectionCard
//                 title="Product Status"
//                 icon={CheckCircle}
//               >

//                 <div className="grid md:grid-cols-2 gap-5">

//                   <SelectField
//                     label="Status"
//                     value={
//                       productForm.status
//                     }
//                     onChange={(value) =>
//                       updateProductField(
//                         "status",
//                         value
//                       )
//                     }
//                     options={[
//                       [
//                         "draft",
//                         "Draft",
//                       ],
//                       [
//                         "active",
//                         "Active",
//                       ],
//                       [
//                         "inactive",
//                         "Inactive",
//                       ],
//                       [
//                         "blocked",
//                         "Blocked",
//                       ],
//                     ]}
//                   />

//                   <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4">

//                     <div>
//                       <p className="font-medium text-sm">
//                         Published
//                       </p>

//                       <p className="text-xs text-gray-500">
//                         Make this product visible
//                       </p>
//                     </div>

//                     <Toggle
//                       checked={
//                         productForm.isPublished
//                       }
//                       onChange={(value) =>
//                         updateProductField(
//                           "isPublished",
//                           value
//                         )
//                       }
//                     />

//                   </div>

//                 </div>

//                 <div className="mt-6 flex justify-end">

//                   <button
//                     onClick={
//                       handleSaveProduct
//                     }
//                     disabled={
//                       savingProduct
//                     }
//                     className="px-5 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
//                   >

//                     {savingProduct ? (
//                       <RefreshCw className="w-4 h-4 animate-spin" />
//                     ) : (
//                       <Save className="w-4 h-4" />
//                     )}

//                     {savingProduct
//                       ? "Saving..."
//                       : "Save Product"}

//                   </button>

//                 </div>

//               </SectionCard>
//             )}

//             {/* ================================================= */}
//             {/* VARIANTS */}
//             {/* ================================================= */}

//             {activeSection ===
//               "variants" && (
//               <>

//                 <SectionCard
//                   title="Product Variants"
//                   icon={Layers}
//                 >

//                   <div className="mb-6">

//                     <label className="label">
//                       Select Variant
//                     </label>

//                     <select
//                       value={
//                         selectedVariantId
//                       }
//                       onChange={(e) =>
//                         handleVariantChange(
//                           e.target.value
//                         )
//                       }
//                       className="input"
//                     >

//                       {product.variants?.map(
//                         (variant) => (
//                           <option
//                             key={
//                               variant._id
//                             }
//                             value={
//                               variant._id
//                             }
//                           >
//                             {variant.variantName ||
//                               "Unnamed Variant"}{" "}
//                             — SKU:{" "}
//                             {variant.sku}
//                           </option>
//                         )
//                       )}

//                     </select>

//                   </div>

//                   {variantForm && (
//                     <VariantEditor
//                       variantForm={
//                         variantForm
//                       }
//                       updateVariantField={
//                         updateVariantField
//                       }
//                       updateVariantNested={
//                         updateVariantNested
//                       }
//                       updateVariantDeep={
//                         updateVariantDeep
//                       }
//                       updateAttribute={
//                         updateAttribute
//                       }
//                       addAttribute={
//                         addAttribute
//                       }
//                       removeAttribute={
//                         removeAttribute
//                       }
//                       addSpecificationGroup={
//                         addSpecificationGroup
//                       }
//                       updateSpecificationGroup={
//                         updateSpecificationGroup
//                       }
//                       removeSpecificationGroup={
//                         removeSpecificationGroup
//                       }
//                       addSpecificationField={
//                         addSpecificationField
//                       }
//                       updateSpecificationField={
//                         updateSpecificationField
//                       }
//                       removeSpecificationField={
//                         removeSpecificationField
//                       }
//                       addImage={addImage}
//                       updateImage={
//                         updateImage
//                       }
//                       removeImage={
//                         removeImage
//                       }
//                       setPrimaryImage={
//                         setPrimaryImage
//                       }
//                       savingVariant={
//                         savingVariant
//                       }
//                       handleSaveVariant={
//                         handleSaveVariant
//                       }
//                       getImageUrl={
//                         getImageUrl
//                       }
//                     />
//                   )}

//                 </SectionCard>

//               </>
//             )}

//           </main>

//         </div>

//       </div>

//     </div>
//   );
// }

// export default EditProduct;

// /* =========================================================
//    VARIANT EDITOR
// ========================================================= */

// function VariantEditor({
//   variantForm,

//   updateVariantField,
//   updateVariantNested,
//   updateVariantDeep,

//   updateAttribute,
//   addAttribute,
//   removeAttribute,

//   addSpecificationGroup,
//   updateSpecificationGroup,
//   removeSpecificationGroup,

//   addSpecificationField,
//   updateSpecificationField,
//   removeSpecificationField,

//   addImage,
//   updateImage,
//   removeImage,
//   setPrimaryImage,

//   savingVariant,
//   handleSaveVariant,

//   getImageUrl,
// }) {
//   return (
//     <div className="space-y-6">

//       {/* ================================================= */}
//       {/* BASIC */}
//       {/* ================================================= */}

//       <div className="border border-gray-200 rounded-xl p-5">

//         <h3 className="font-bold text-lg mb-5">
//           Variant Information
//         </h3>

//         <div className="grid md:grid-cols-2 gap-5">

//           <InputField
//             label="Variant Name"
//             value={
//               variantForm.variantName
//             }
//             onChange={(value) =>
//               updateVariantField(
//                 "variantName",
//                 value
//               )
//             }
//           />

//           <InputField
//             label="SKU"
//             value={
//               variantForm.sku
//             }
//             onChange={(value) =>
//               updateVariantField(
//                 "sku",
//                 value.toUpperCase()
//               )
//             }
//           />

//           <InputField
//             label="Barcode"
//             value={
//               variantForm.barcode
//             }
//             onChange={(value) =>
//               updateVariantField(
//                 "barcode",
//                 value
//               )
//             }
//           />

//           <SelectField
//             label="Status"
//             value={
//               variantForm.status
//             }
//             onChange={(value) =>
//               updateVariantField(
//                 "status",
//                 value
//               )
//             }
//             options={[
//               [
//                 "active",
//                 "Active",
//               ],
//               [
//                 "inactive",
//                 "Inactive",
//               ],
//               [
//                 "out_of_stock",
//                 "Out Of Stock",
//               ],
//               [
//                 "blocked",
//                 "Blocked",
//               ],
//             ]}
//           />

//         </div>

//         <div className="mt-5 flex items-center justify-between border border-gray-200 rounded-xl p-4">

//           <div>

//             <p className="font-medium text-sm">
//               Default Variant
//             </p>

//             <p className="text-xs text-gray-500 mt-1">
//               Use this variant as the default product variant
//             </p>

//           </div>

//           <Toggle
//             checked={
//               variantForm.isDefault
//             }
//             onChange={(value) =>
//               updateVariantField(
//                 "isDefault",
//                 value
//               )
//             }
//           />

//         </div>

//       </div>

//       {/* ================================================= */}
//       {/* ATTRIBUTES */}
//       {/* ================================================= */}

//       <div className="border border-gray-200 rounded-xl p-5">

//         <div className="flex items-center justify-between mb-5">

//           <div>
//             <h3 className="font-bold text-lg">
//               Attributes
//             </h3>

//             <p className="text-xs text-gray-500 mt-1">
//               Example: Color, Size, RAM, Storage
//             </p>
//           </div>

//           <AddButton
//             onClick={
//               addAttribute
//             }
//             label="Add Attribute"
//           />

//         </div>

//         <div className="space-y-3">

//           {variantForm.attributes
//             .length === 0 && (
//             <EmptyText text="No attributes added." />
//           )}

//           {variantForm.attributes.map(
//             (attribute, index) => (
//               <div
//                 key={index}
//                 className="grid grid-cols-[1fr_1fr_auto] gap-3"
//               >

//                 <input
//                   value={
//                     attribute.name
//                   }
//                   onChange={(e) =>
//                     updateAttribute(
//                       index,
//                       "name",
//                       e.target.value
//                     )
//                   }
//                   placeholder="Name"
//                   className="input"
//                 />

//                 <input
//                   value={
//                     attribute.value
//                   }
//                   onChange={(e) =>
//                     updateAttribute(
//                       index,
//                       "value",
//                       e.target.value
//                     )
//                   }
//                   placeholder="Value"
//                   className="input"
//                 />

//                 <button
//                   onClick={() =>
//                     removeAttribute(
//                       index
//                     )
//                   }
//                   className="w-11 h-11 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
//                 >
//                   <Trash2 className="w-4 h-4" />
//                 </button>

//               </div>
//             )
//           )}

//         </div>

//       </div>

//       {/* ================================================= */}
//       {/* PRICING */}
//       {/* ================================================= */}

//       <div className="border border-gray-200 rounded-xl p-5">

//         <h3 className="font-bold text-lg mb-5">
//           Pricing
//         </h3>

//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

//           <InputField
//             label="MRP"
//             type="number"
//             value={
//               variantForm.pricing.mrp
//             }
//             onChange={(value) =>
//               updateVariantNested(
//                 "pricing",
//                 "mrp",
//                 Number(value)
//               )
//             }
//           />

//           <InputField
//             label="Selling Price"
//             type="number"
//             value={
//               variantForm.pricing
//                 .sellingPrice
//             }
//             onChange={(value) =>
//               updateVariantNested(
//                 "pricing",
//                 "sellingPrice",
//                 Number(value)
//               )
//             }
//           />

//           <InputField
//             label="Cost Price"
//             type="number"
//             value={
//               variantForm.pricing
//                 .costPrice
//             }
//             onChange={(value) =>
//               updateVariantNested(
//                 "pricing",
//                 "costPrice",
//                 Number(value)
//               )
//             }
//           />

//           <InputField
//             label="Tax"
//             type="number"
//             value={
//               variantForm.pricing.tax
//             }
//             onChange={(value) =>
//               updateVariantNested(
//                 "pricing",
//                 "tax",
//                 Number(value)
//               )
//             }
//           />

//           <InputField
//             label="Discount %"
//             type="number"
//             value={
//               variantForm.pricing
//                 .discount
//             }
//             onChange={(value) =>
//               updateVariantNested(
//                 "pricing",
//                 "discount",
//                 Number(value)
//               )
//             }
//           />

//         </div>

//       </div>

//       {/* ================================================= */}
//       {/* INVENTORY */}
//       {/* ================================================= */}

//       <div className="border border-gray-200 rounded-xl p-5">

//         <h3 className="font-bold text-lg mb-5">
//           Inventory
//         </h3>

//         <div className="grid md:grid-cols-3 gap-5">

//           <InputField
//             label="Stock"
//             type="number"
//             value={
//               variantForm.inventory.stock
//             }
//             onChange={(value) =>
//               updateVariantNested(
//                 "inventory",
//                 "stock",
//                 Number(value)
//               )
//             }
//           />

//           <InputField
//             label="Reserved"
//             type="number"
//             value={
//               variantForm.inventory.reserved
//             }
//             onChange={(value) =>
//               updateVariantNested(
//                 "inventory",
//                 "reserved",
//                 Number(value)
//               )
//             }
//           />

//           <InputField
//             label="Low Stock Alert"
//             type="number"
//             value={
//               variantForm.inventory
//                 .lowStockAlert
//             }
//             onChange={(value) =>
//               updateVariantNested(
//                 "inventory",
//                 "lowStockAlert",
//                 Number(value)
//               )
//             }
//           />

//         </div>

//       </div>

//       {/* ================================================= */}
//       {/* SHIPPING */}
//       {/* ================================================= */}

//       <div className="border border-gray-200 rounded-xl p-5">

//         <div className="flex items-center gap-2 mb-5">

//           <Truck className="w-5 h-5" />

//           <h3 className="font-bold text-lg">
//             Shipping
//           </h3>

//         </div>

//         <div className="grid md:grid-cols-2 gap-5">

//           <InputField
//             label="Weight (kg)"
//             type="number"
//             value={
//               variantForm.shipping
//                 .weight
//             }
//             onChange={(value) =>
//               updateVariantNested(
//                 "shipping",
//                 "weight",
//                 Number(value)
//               )
//             }
//           />

//           <SelectField
//             label="Package Type"
//             value={
//               variantForm.shipping
//                 .packageType
//             }
//             onChange={(value) =>
//               updateVariantNested(
//                 "shipping",
//                 "packageType",
//                 value
//               )
//             }
//             options={[
//               [
//                 "box",
//                 "Box",
//               ],
//               [
//                 "packet",
//                 "Packet",
//               ],
//               [
//                 "tube",
//                 "Tube",
//               ],
//               [
//                 "envelope",
//                 "Envelope",
//               ],
//             ]}
//           />

//         </div>

//         <div className="grid md:grid-cols-3 gap-5 mt-5">

//           <InputField
//             label="Length (cm)"
//             type="number"
//             value={
//               variantForm.shipping
//                 .dimensions
//                 .length
//             }
//             onChange={(value) =>
//               updateVariantDeep(
//                 "shipping",
//                 "dimensions",
//                 "length",
//                 Number(value)
//               )
//             }
//           />

//           <InputField
//             label="Breadth (cm)"
//             type="number"
//             value={
//               variantForm.shipping
//                 .dimensions
//                 .breadth
//             }
//             onChange={(value) =>
//               updateVariantDeep(
//                 "shipping",
//                 "dimensions",
//                 "breadth",
//                 Number(value)
//               )
//             }
//           />

//           <InputField
//             label="Height (cm)"
//             type="number"
//             value={
//               variantForm.shipping
//                 .dimensions
//                 .height
//             }
//             onChange={(value) =>
//               updateVariantDeep(
//                 "shipping",
//                 "dimensions",
//                 "height",
//                 Number(value)
//               )
//             }
//           />

//         </div>

//       </div>

//       {/* ================================================= */}
//       {/* IMAGES */}
//       {/* ================================================= */}

//       <div className="border border-gray-200 rounded-xl p-5">

//         <div className="flex items-center justify-between mb-5">

//           <div className="flex items-center gap-2">

//             <ImageIcon className="w-5 h-5" />

//             <div>
//               <h3 className="font-bold text-lg">
//                 Images
//               </h3>

//               <p className="text-xs text-gray-500">
//                 Manage variant images
//               </p>
//             </div>

//           </div>

//           <AddButton
//             onClick={addImage}
//             label="Add Image"
//           />

//         </div>

//         <div className="space-y-5">

//           {variantForm.images.length ===
//             0 && (
//             <EmptyText text="No images added." />
//           )}

//           {variantForm.images.map(
//             (image, index) => (
//               <div
//                 key={index}
//                 className="border border-gray-200 rounded-xl p-4"
//               >

//                 <div className="flex flex-col md:flex-row gap-4">

//                   {/* PREVIEW */}

//                   <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-100 shrink-0">

//                     {image.url ? (
//                       <img
//                         src={getImageUrl(
//                           image.url
//                         )}
//                         alt={
//                           image.alt ||
//                           "Product"
//                         }
//                         className="w-full h-full object-cover"
//                       />
//                     ) : (
//                       <div className="w-full h-full flex items-center justify-center">
//                         <ImageIcon className="w-8 h-8 text-gray-300" />
//                       </div>
//                     )}

//                   </div>

//                   {/* INPUTS */}

//                   <div className="flex-1 space-y-3">

//                     <input
//                       value={
//                         image.url
//                       }
//                       onChange={(e) =>
//                         updateImage(
//                           index,
//                           "url",
//                           e.target.value
//                         )
//                       }
//                       placeholder="Image URL"
//                       className="input"
//                     />

//                     <input
//                       value={
//                         image.alt
//                       }
//                       onChange={(e) =>
//                         updateImage(
//                           index,
//                           "alt",
//                           e.target.value
//                         )
//                       }
//                       placeholder="Alt text"
//                       className="input"
//                     />

//                     <div className="flex flex-wrap items-center gap-4">

//                       <label className="flex items-center gap-2 text-sm">

//                         <input
//                           type="radio"
//                           name="primaryImage"
//                           checked={
//                             image.isPrimary
//                           }
//                           onChange={() =>
//                             setPrimaryImage(
//                               index
//                             )
//                           }
//                         />

//                         Primary Image

//                       </label>

//                       <span className="text-xs text-gray-500">
//                         Order:{" "}
//                         {image.sortOrder}
//                       </span>

//                     </div>

//                   </div>

//                   <button
//                     onClick={() =>
//                       removeImage(
//                         index
//                       )
//                     }
//                     className="w-10 h-10 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center shrink-0"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>

//                 </div>

//               </div>
//             )
//           )}

//         </div>

//       </div>

//       {/* ================================================= */}
//       {/* SPECIFICATIONS */}
//       {/* ================================================= */}

//       <div className="border border-gray-200 rounded-xl p-5">

//         <div className="flex items-center justify-between mb-5">

//           <div>
//             <h3 className="font-bold text-lg">
//               Specifications
//             </h3>

//             <p className="text-xs text-gray-500 mt-1">
//               Manage specification groups and fields
//             </p>
//           </div>

//           <AddButton
//             onClick={
//               addSpecificationGroup
//             }
//             label="Add Group"
//           />

//         </div>

//         <div className="space-y-5">

//           {variantForm.specifications
//             .length === 0 && (
//             <EmptyText text="No specifications added." />
//           )}

//           {variantForm.specifications.map(
//             (
//               group,
//               groupIndex
//             ) => (
//               <div
//                 key={groupIndex}
//                 className="border border-gray-200 rounded-xl overflow-hidden"
//               >

//                 <div className="bg-gray-50 p-4 flex items-center gap-3">

//                   <input
//                     value={
//                       group.group
//                     }
//                     onChange={(e) =>
//                       updateSpecificationGroup(
//                         groupIndex,
//                         e.target.value
//                       )
//                     }
//                     placeholder="Group name e.g. General"
//                     className="flex-1 input bg-white"
//                   />

//                   <button
//                     onClick={() =>
//                       removeSpecificationGroup(
//                         groupIndex
//                       )
//                     }
//                     className="w-10 h-10 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>

//                 </div>

//                 <div className="p-4 space-y-3">

//                   {group.fields?.map(
//                     (
//                       field,
//                       fieldIndex
//                     ) => (
//                       <div
//                         key={fieldIndex}
//                         className="grid grid-cols-[1fr_1fr_auto] gap-3"
//                       >

//                         <input
//                           value={
//                             field.key
//                           }
//                           onChange={(
//                             e
//                           ) =>
//                             updateSpecificationField(
//                               groupIndex,
//                               fieldIndex,
//                               "key",
//                               e.target.value
//                             )
//                           }
//                           placeholder="Key"
//                           className="input"
//                         />

//                         <input
//                           value={
//                             field.value
//                           }
//                           onChange={(
//                             e
//                           ) =>
//                             updateSpecificationField(
//                               groupIndex,
//                               fieldIndex,
//                               "value",
//                               e.target.value
//                             )
//                           }
//                           placeholder="Value"
//                           className="input"
//                         />

//                         <button
//                           onClick={() =>
//                             removeSpecificationField(
//                               groupIndex,
//                               fieldIndex
//                             )
//                           }
//                           className="w-11 h-11 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>

//                       </div>
//                     )
//                   )}

//                   <button
//                     onClick={() =>
//                       addSpecificationField(
//                         groupIndex
//                       )
//                     }
//                     className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
//                   >
//                     <Plus className="w-4 h-4" />
//                     Add Field
//                   </button>

//                 </div>

//               </div>
//             )
//           )}

//         </div>

//       </div>

//       {/* ================================================= */}
//       {/* SAVE VARIANT */}
//       {/* ================================================= */}

//       <div className="flex justify-end">

//         <button
//           onClick={
//             handleSaveVariant
//           }
//           disabled={savingVariant}
//           className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
//         >

//           {savingVariant ? (
//             <RefreshCw className="w-4 h-4 animate-spin" />
//           ) : (
//             <Save className="w-4 h-4" />
//           )}

//           {savingVariant
//             ? "Saving Variant..."
//             : "Save Variant"}

//         </button>

//       </div>

//     </div>
//   );
// }

// /* =========================================================
//    SIDEBAR BUTTON
// ========================================================= */

// function SidebarButton({
//   icon: Icon,
//   label,
//   active,
//   onClick,
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition ${
//         active
//           ? "bg-black text-white"
//           : "text-gray-600 hover:bg-gray-100"
//       }`}
//     >
//       <Icon className="w-4 h-4" />
//       {label}
//     </button>
//   );
// }

// /* =========================================================
//    SECTION CARD
// ========================================================= */

// function SectionCard({
//   title,
//   icon: Icon,
//   children,
//   action,
// }) {
//   return (
//     <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

//       <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">

//         <div className="flex items-center gap-3">

//           {Icon && (
//             <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
//               <Icon className="w-4 h-4 text-gray-700" />
//             </div>
//           )}

//           <h2 className="font-bold text-gray-900">
//             {title}
//           </h2>

//         </div>

//         {action}

//       </div>

//       <div className="p-6">
//         {children}
//       </div>

//     </section>
//   );
// }

// /* =========================================================
//    INPUT
// ========================================================= */

// function InputField({
//   label,
//   value,
//   onChange,
//   type = "text",
//   required = false,
// }) {
//   return (
//     <div>

//       <label className="label">
//         {label}

//         {required && (
//           <span className="text-red-500 ml-1">
//             *
//           </span>
//         )}
//       </label>

//       <input
//         type={type}
//         value={value ?? ""}
//         onChange={(e) =>
//           onChange(e.target.value)
//         }
//         className="input"
//       />

//     </div>
//   );
// }

// /* =========================================================
//    TEXT AREA
// ========================================================= */

// function TextAreaField({
//   label,
//   value,
//   onChange,
//   rows = 4,
// }) {
//   return (
//     <div>

//       <label className="label">
//         {label}
//       </label>

//       <textarea
//         rows={rows}
//         value={value ?? ""}
//         onChange={(e) =>
//           onChange(e.target.value)
//         }
//         className="input resize-y"
//       />

//     </div>
//   );
// }

// /* =========================================================
//    SELECT
// ========================================================= */

// function SelectField({
//   label,
//   value,
//   onChange,
//   options,
// }) {
//   return (
//     <div>

//       <label className="label">
//         {label}
//       </label>

//       <select
//         value={value ?? ""}
//         onChange={(e) =>
//           onChange(e.target.value)
//         }
//         className="input"
//       >

//         {options.map(
//           ([optionValue, optionLabel]) => (
//             <option
//               key={optionValue}
//               value={optionValue}
//             >
//               {optionLabel}
//             </option>
//           )
//         )}

//       </select>

//     </div>
//   );
// }

// /* =========================================================
//    TOGGLE
// ========================================================= */

// function Toggle({
//   checked,
//   onChange,
// }) {
//   return (
//     <button
//       type="button"
//       onClick={() =>
//         onChange(!checked)
//       }
//       className={`relative w-11 h-6 rounded-full transition ${
//         checked
//           ? "bg-black"
//           : "bg-gray-300"
//       }`}
//     >

//       <span
//         className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
//           checked
//             ? "left-6"
//             : "left-1"
//         }`}
//       />

//     </button>
//   );
// }

// /* =========================================================
//    ADD BUTTON
// ========================================================= */

// function AddButton({
//   onClick,
//   label,
// }) {
//   return (
//     <button
//       onClick={onClick}
//       className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50"
//     >
//       <Plus className="w-4 h-4" />
//       {label}
//     </button>
//   );
// }

// /* =========================================================
//    EMPTY
// ========================================================= */

// function EmptyText({ text }) {
//   return (
//     <div className="py-6 text-center text-sm text-gray-400">
//       {text}
//     </div>
//   );
// }

// /* =========================================================
//    STATUS
// ========================================================= */

// function StatusBadge({
//   status,
// }) {
//   const styles = {
//     active:
//       "bg-green-50 text-green-600 border-green-200",

//     inactive:
//       "bg-gray-100 text-gray-600 border-gray-200",

//     blocked:
//       "bg-red-50 text-red-600 border-red-200",

//     draft:
//       "bg-yellow-50 text-yellow-600 border-yellow-200",

//     deleted:
//       "bg-red-50 text-red-600 border-red-200",

//     out_of_stock:
//       "bg-orange-50 text-orange-600 border-orange-200",
//   };

//   return (
//     <span
//       className={`text-xs px-2 py-1 rounded-full border ${
//         styles[status] ||
//         "bg-gray-100 text-gray-600 border-gray-200"
//       }`}
//     >
//       {status || "unknown"}
//     </span>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Plus,
  Trash2,
  Image as ImageIcon,
  Package,
  Layers,
  Tag,
  Truck,
  ShieldCheck,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

import {
  getMyProducts,
  updateProduct,
  updateProductVariant,
} from "../services/productEditApi";

import {
  getCategories,
  getSubCategories,
  getLevel2Categories,
} from "../services/categoryApi";

function EditProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();

  // =========================================================
  // PRODUCT
  // =========================================================

  const [product, setProduct] = useState(null);

  const [productForm, setProductForm] = useState(null);

  // =========================================================
  // VARIANT
  // =========================================================

  const [selectedVariantId, setSelectedVariantId] = useState("");
  const [variantForm, setVariantForm] = useState(null);

  // =========================================================
  // UI STATES
  // =========================================================

  const [loading, setLoading] = useState(true);

  const [savingProduct, setSavingProduct] = useState(false);
  const [savingVariant, setSavingVariant] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [activeSection, setActiveSection] = useState("basic");

  // =========================================================
  // CATEGORY STATES
  // =========================================================

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [level2Categories, setLevel2Categories] = useState([]);

  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subCategoriesLoading, setSubCategoriesLoading] = useState(false);
  const [level2Loading, setLevel2Loading] = useState(false);

  // =========================================================
  // CATEGORY HELPERS
  // =========================================================

  const normalizeList = (data) => {
    if (Array.isArray(data)) return data;

    return (
      data?.categories ||
      data?.subCategories ||
      data?.subcategories ||
      data?.level2Categories ||
      data?.level2 ||
      data?.items ||
      []
    );
  };

  const getCategoryName = (item) =>
    item?.name ||
    item?.title ||
    item?.categoryName ||
    item?.subCategoryName ||
    item?.label ||
    "Unnamed";

  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const data = await getCategories();
      setCategories(normalizeList(data));
    } catch (err) {
      console.error("FETCH CATEGORIES ERROR:", err);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchSubCategories = async (categoryId) => {
    if (!categoryId) {
      setSubCategories([]);
      return;
    }

    try {
      setSubCategoriesLoading(true);
      const data = await getSubCategories(categoryId);
      setSubCategories(normalizeList(data));
    } catch (err) {
      console.error("FETCH SUB CATEGORIES ERROR:", err);
      setSubCategories([]);
    } finally {
      setSubCategoriesLoading(false);
    }
  };

  const fetchLevel2Categories = async (subCategoryId) => {
    if (!subCategoryId) {
      setLevel2Categories([]);
      return;
    }

    try {
      setLevel2Loading(true);
      const data = await getLevel2Categories(subCategoryId);
      setLevel2Categories(normalizeList(data));
    } catch (err) {
      console.error("FETCH LEVEL 2 CATEGORIES ERROR:", err);
      setLevel2Categories([]);
    } finally {
      setLevel2Loading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setProductForm((prev) => ({
      ...prev,
      category: categoryId,
      subCategory: "",
      subCategoryLevel2: "",
    }));

    setSubCategories([]);
    setLevel2Categories([]);
  };

  const handleSubCategoryChange = (subCategoryId) => {
    setProductForm((prev) => ({
      ...prev,
      subCategory: subCategoryId,
      subCategoryLevel2: "",
    }));

    setLevel2Categories([]);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (productForm?.category) {
      fetchSubCategories(productForm.category);
    } else {
      setSubCategories([]);
    }
  }, [productForm?.category]);

  useEffect(() => {
    if (productForm?.subCategory) {
      fetchLevel2Categories(productForm.subCategory);
    } else {
      setLevel2Categories([]);
    }
  }, [productForm?.subCategory]);

  // =========================================================
  // IMAGE URL FIX
  // =========================================================

  const getImageUrl = (url) => {
    if (!url) return "";

    const markdownMatch = url.match(/^\[(.*?)\]\((.*?)\)$/);

    if (markdownMatch) {
      return markdownMatch[2];
    }

    return url;
  };

  // =========================================================
  // FETCH PRODUCT
  // =========================================================

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProducts();

      if (!data?.success) {
        throw new Error(data?.message || "Failed to load products");
      }

      const foundProduct = data.products?.find(
        (item) => item._id === productId
      );

      if (!foundProduct) {
        throw new Error("Product not found");
      }

      setProduct(foundProduct);

      // Product form
      setProductForm(createProductForm(foundProduct));

      // Default variant
      const defaultVariant =
        foundProduct.variants?.find(
          (variant) => variant._id === foundProduct.defaultVariant
        ) || foundProduct.variants?.[0];

      if (defaultVariant) {
        setSelectedVariantId(defaultVariant._id);
        setVariantForm(createVariantForm(defaultVariant));
      }
    } catch (err) {
      console.error("EDIT PRODUCT LOAD ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load product"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  // =========================================================
  // PRODUCT FORM FACTORY
  // =========================================================

  const createProductForm = (data) => ({
    title: data.title || "",
    slug: data.slug || "",
    shortDescription: data.shortDescription || "",
    description: data.description || "",

    category: data.category?._id || data.category || "",
    subCategory: data.subCategory?._id || data.subCategory || "",
    subCategoryLevel2:
      data.subCategoryLevel2?._id ||
      data.subCategoryLevel2 ||
      "",

    brand: data.brand || "",

    highlights: data.highlights || [],
    tags: data.tags || [],

    manufacturer: data.manufacturer || "",
    countryOfOrigin: data.countryOfOrigin || "",

    services: {
      returnPolicy: {
        returnable:
          data.services?.returnPolicy?.returnable ?? true,

        returnDays:
          data.services?.returnPolicy?.returnDays ?? 7,

        returnType:
          data.services?.returnPolicy?.returnType ||
          "replacement",

        conditions:
          data.services?.returnPolicy?.conditions || [],
      },

      cashOnDelivery: {
        available:
          data.services?.cashOnDelivery?.available ?? true,
      },

      warranty: {
        available:
          data.services?.warranty?.available ?? false,

        duration:
          data.services?.warranty?.duration || "",

        type:
          data.services?.warranty?.type || "none",
      },

      support: {
        available:
          data.services?.support?.available ?? true,

        contactType:
          data.services?.support?.contactType || "seller",
      },
    },

    seo: {
      metaTitle: data.seo?.metaTitle || "",

      metaDescription:
        data.seo?.metaDescription || "",

      keywords: data.seo?.keywords || [],
    },

    status: data.status || "draft",

    isPublished: data.isPublished ?? false,
  });

  // =========================================================
  // VARIANT FORM FACTORY
  // =========================================================

  const createVariantForm = (data) => ({
    sku: data.sku || "",
    barcode: data.barcode || "",
    variantName: data.variantName || "",

    attributes:
      data.attributes?.map((item) => ({
        name: item.name || "",
        value: item.value || "",
      })) || [],

    specifications:
      data.specifications?.map((group) => ({
        group: group.group || "",

        fields:
          group.fields?.map((field) => ({
            key: field.key || "",
            value: field.value || "",
          })) || [],
      })) || [],

    images:
      data.images?.map((image) => ({
        url: getImageUrl(image.url),
        public_id: image.public_id || "",
        alt: image.alt || "",
        isPrimary: image.isPrimary || false,
        sortOrder: image.sortOrder ?? 0,
      })) || [],

    pricing: {
      mrp: data.pricing?.mrp ?? 0,
      sellingPrice: data.pricing?.sellingPrice ?? 0,
      costPrice: data.pricing?.costPrice ?? 0,
      tax: data.pricing?.tax ?? 0,
      discount: data.pricing?.discount ?? 0,
    },

    inventory: {
      stock: data.inventory?.stock ?? 0,
      reserved: data.inventory?.reserved ?? 0,
      lowStockAlert: data.inventory?.lowStockAlert ?? 5,
    },

    shipping: {
      weight: data.shipping?.weight ?? 0,

      dimensions: {
        length:
          data.shipping?.dimensions?.length ?? 0,

        breadth:
          data.shipping?.dimensions?.breadth ?? 0,

        height:
          data.shipping?.dimensions?.height ?? 0,
      },

      packageType:
        data.shipping?.packageType || "box",

      volumetricWeight:
        data.shipping?.volumetricWeight ?? 0,
    },

    isDefault: data.isDefault ?? false,

    status: data.status || "active",
  });

  // =========================================================
  // PRODUCT INPUT UPDATE
  // =========================================================

  const updateProductField = (field, value) => {
    setProductForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================================================
  // PRODUCT NESTED UPDATE
  // =========================================================

  const updateProductNested = (
    section,
    field,
    value
  ) => {
    setProductForm((prev) => ({
      ...prev,

      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // =========================================================
  // VARIANT INPUT UPDATE
  // =========================================================

  const updateVariantField = (field, value) => {
    setVariantForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // =========================================================
  // VARIANT NESTED UPDATE
  // =========================================================

  const updateVariantNested = (
    section,
    field,
    value
  ) => {
    setVariantForm((prev) => ({
      ...prev,

      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  // =========================================================
  // VARIANT DEEP UPDATE
  // =========================================================

  const updateVariantDeep = (
    section,
    parentField,
    field,
    value
  ) => {
    setVariantForm((prev) => ({
      ...prev,

      [section]: {
        ...prev[section],

        [parentField]: {
          ...prev[section][parentField],
          [field]: value,
        },
      },
    }));
  };

  // =========================================================
  // SELECT VARIANT
  // =========================================================

  const handleVariantChange = (variantId) => {
    setSelectedVariantId(variantId);

    const selected = product?.variants?.find(
      (variant) => variant._id === variantId
    );

    if (selected) {
      setVariantForm(createVariantForm(selected));
    }
  };

  // =========================================================
  // SAVE PRODUCT
  // =========================================================

  const handleSaveProduct = async () => {
    try {
      setSavingProduct(true);
      setError("");
      setSuccess("");

      const payload = {
        title: productForm.title,
        slug: productForm.slug,
        shortDescription:
          productForm.shortDescription,

        description: productForm.description,

        category: productForm.category,
        subCategory: productForm.subCategory || null,

        subCategoryLevel2:
          productForm.subCategoryLevel2 || null,

        brand: productForm.brand,

        highlights: productForm.highlights,
        tags: productForm.tags,

        manufacturer:
          productForm.manufacturer,

        countryOfOrigin:
          productForm.countryOfOrigin,

        services: productForm.services,

        seo: productForm.seo,

        status: productForm.status,

        isPublished:
          productForm.isPublished,
      };

      const data = await updateProduct(
        productId,
        payload
      );

      if (!data?.success) {
        throw new Error(
          data?.message || "Failed to update product"
        );
      }

      setSuccess("Product updated successfully.");

      setProduct((prev) => ({
        ...prev,
        ...data.product,
      }));

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("UPDATE PRODUCT ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update product"
      );
    } finally {
      setSavingProduct(false);
    }
  };

  // =========================================================
  // SAVE VARIANT
  // =========================================================

  const handleSaveVariant = async () => {
    if (!selectedVariantId || !variantForm) {
      return;
    }

    try {
      setSavingVariant(true);
      setError("");
      setSuccess("");

      const payload = {
        sku: variantForm.sku,
        barcode: variantForm.barcode,
        variantName: variantForm.variantName,

        attributes: variantForm.attributes,

        specifications:
          variantForm.specifications,

        images: variantForm.images,

        pricing: variantForm.pricing,

        inventory: variantForm.inventory,

        shipping: variantForm.shipping,

        isDefault: variantForm.isDefault,

        status: variantForm.status,
      };

      const data = await updateProductVariant(
        productId,
        selectedVariantId,
        payload
      );

      if (!data?.success) {
        throw new Error(
          data?.message ||
            "Failed to update variant"
        );
      }

      setSuccess("Variant updated successfully.");

      // Update local product state
      setProduct((prev) => ({
        ...prev,

        variants: prev.variants?.map(
          (variant) =>
            variant._id === selectedVariantId
              ? {
                  ...variant,
                  ...data.variant,
                }
              : variant
        ),
      }));

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("UPDATE VARIANT ERROR:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to update variant"
      );
    } finally {
      setSavingVariant(false);
    }
  };

  // =========================================================
  // HIGHLIGHTS
  // =========================================================

  const addHighlight = () => {
    setProductForm((prev) => ({
      ...prev,
      highlights: [
        ...prev.highlights,
        "",
      ],
    }));
  };

  const updateHighlight = (index, value) => {
    setProductForm((prev) => ({
      ...prev,

      highlights: prev.highlights.map(
        (item, i) =>
          i === index ? value : item
      ),
    }));
  };

  const removeHighlight = (index) => {
    setProductForm((prev) => ({
      ...prev,

      highlights: prev.highlights.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // =========================================================
  // TAGS
  // =========================================================

  const addTag = () => {
    setProductForm((prev) => ({
      ...prev,

      tags: [
        ...prev.tags,
        "",
      ],
    }));
  };

  const updateTag = (index, value) => {
    setProductForm((prev) => ({
      ...prev,

      tags: prev.tags.map(
        (item, i) =>
          i === index ? value : item
      ),
    }));
  };

  const removeTag = (index) => {
    setProductForm((prev) => ({
      ...prev,

      tags: prev.tags.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // =========================================================
  // ATTRIBUTES
  // =========================================================

  const addAttribute = () => {
    setVariantForm((prev) => ({
      ...prev,

      attributes: [
        ...prev.attributes,
        {
          name: "",
          value: "",
        },
      ],
    }));
  };

  const updateAttribute = (
    index,
    field,
    value
  ) => {
    setVariantForm((prev) => ({
      ...prev,

      attributes: prev.attributes.map(
        (attribute, i) =>
          i === index
            ? {
                ...attribute,
                [field]: value,
              }
            : attribute
      ),
    }));
  };

  const removeAttribute = (index) => {
    setVariantForm((prev) => ({
      ...prev,

      attributes:
        prev.attributes.filter(
          (_, i) => i !== index
        ),
    }));
  };

  // =========================================================
  // SPECIFICATIONS
  // =========================================================

  const addSpecificationGroup = () => {
    setVariantForm((prev) => ({
      ...prev,

      specifications: [
        ...prev.specifications,

        {
          group: "",
          fields: [],
        },
      ],
    }));
  };

  const updateSpecificationGroup = (
    groupIndex,
    value
  ) => {
    setVariantForm((prev) => ({
      ...prev,

      specifications:
        prev.specifications.map(
          (group, i) =>
            i === groupIndex
              ? {
                  ...group,
                  group: value,
                }
              : group
        ),
    }));
  };

  const removeSpecificationGroup = (
    groupIndex
  ) => {
    setVariantForm((prev) => ({
      ...prev,

      specifications:
        prev.specifications.filter(
          (_, i) => i !== groupIndex
        ),
    }));
  };

  const addSpecificationField = (
    groupIndex
  ) => {
    setVariantForm((prev) => ({
      ...prev,

      specifications:
        prev.specifications.map(
          (group, i) =>
            i === groupIndex
              ? {
                  ...group,

                  fields: [
                    ...group.fields,

                    {
                      key: "",
                      value: "",
                    },
                  ],
                }
              : group
        ),
    }));
  };

  const updateSpecificationField = (
    groupIndex,
    fieldIndex,
    field,
    value
  ) => {
    setVariantForm((prev) => ({
      ...prev,

      specifications:
        prev.specifications.map(
          (group, i) => {
            if (i !== groupIndex) {
              return group;
            }

            return {
              ...group,

              fields:
                group.fields.map(
                  (item, j) =>
                    j === fieldIndex
                      ? {
                          ...item,
                          [field]: value,
                        }
                      : item
                ),
            };
          }
        ),
    }));
  };

  const removeSpecificationField = (
    groupIndex,
    fieldIndex
  ) => {
    setVariantForm((prev) => ({
      ...prev,

      specifications:
        prev.specifications.map(
          (group, i) =>
            i === groupIndex
              ? {
                  ...group,

                  fields:
                    group.fields.filter(
                      (_, j) =>
                        j !== fieldIndex
                    ),
                }
              : group
        ),
    }));
  };

  // =========================================================
  // IMAGES
  // =========================================================

  const addImage = () => {
    setVariantForm((prev) => ({
      ...prev,

      images: [
        ...prev.images,

        {
          url: "",
          public_id: "",
          alt: "",
          isPrimary:
            prev.images.length === 0,
          sortOrder:
            prev.images.length,
        },
      ],
    }));
  };

  const updateImage = (
    index,
    field,
    value
  ) => {
    setVariantForm((prev) => ({
      ...prev,

      images: prev.images.map(
        (image, i) =>
          i === index
            ? {
                ...image,
                [field]: value,
              }
            : image
      ),
    }));
  };

  const setPrimaryImage = (index) => {
    setVariantForm((prev) => ({
      ...prev,

      images: prev.images.map(
        (image, i) => ({
          ...image,
          isPrimary: i === index,
        })
      ),
    }));
  };

  const removeImage = (index) => {
    setVariantForm((prev) => ({
      ...prev,

      images: prev.images
        .filter((_, i) => i !== index)
        .map((image, i) => ({
          ...image,
          sortOrder: i,
        })),
    }));
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <RefreshCw className="w-5 h-5 animate-spin" />

          <span>
            Loading product...
          </span>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR WITHOUT PRODUCT
  // =========================================================

  if (!product || !productForm) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">

        <button
          onClick={() =>
            navigate(-1)
          }
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="max-w-xl mx-auto mt-20 bg-white border border-red-200 rounded-2xl p-8 text-center">

          <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />

          <h2 className="text-xl font-bold text-gray-800">
            Product Not Found
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            {error ||
              "Unable to load this product."}
          </p>

          <button
            onClick={() =>
              navigate(-1)
            }
            className="mt-6 px-5 py-2.5 bg-black text-white rounded-lg"
          >
            Go Back
          </button>

        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="sticky top-0 z-40 bg-white border-b">

        <div className="px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                navigate(-1)
              }
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div>

              <h1 className="text-xl font-bold text-gray-900">
                Edit Product
              </h1>

              <p className="text-sm text-gray-500 mt-0.5">
                {product.title}
              </p>

            </div>

          </div>

          <div className="flex items-center gap-3">

            <StatusBadge
              status={productForm.status}
            />

            <button
              onClick={() =>
                navigate(-1)
              }
              className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50"
            >
              Cancel
            </button>

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* NOTIFICATIONS */}
      {/* ================================================= */}

      <div className="max-w-7xl mx-auto px-6 pt-5">

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-start gap-3">

            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />

            <div className="text-sm">
              {error}
            </div>

            <button
              onClick={() =>
                setError("")
              }
              className="ml-auto"
            >
              <X className="w-4 h-4" />
            </button>

          </div>
        )}

        {success && (
          <div className="mb-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-600 flex items-center gap-3">

            <CheckCircle className="w-5 h-5" />

            <span className="text-sm">
              {success}
            </span>

          </div>
        )}

      </div>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="max-w-7xl mx-auto px-6 py-6">

        <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] gap-6">

          {/* ================================================= */}
          {/* SIDEBAR */}
          {/* ================================================= */}

          <aside className="lg:sticky lg:top-24 h-fit">

            <div className="bg-white border border-gray-200 rounded-xl p-2">

              <SidebarButton
                icon={Package}
                label="Basic Information"
                active={
                  activeSection ===
                  "basic"
                }
                onClick={() =>
                  setActiveSection("basic")
                }
              />

              <SidebarButton
                icon={Tag}
                label="Details"
                active={
                  activeSection ===
                  "details"
                }
                onClick={() =>
                  setActiveSection("details")
                }
              />

              <SidebarButton
                icon={ShieldCheck}
                label="Services"
                active={
                  activeSection ===
                  "services"
                }
                onClick={() =>
                  setActiveSection("services")
                }
              />

              <SidebarButton
                icon={Search}
                label="SEO"
                active={
                  activeSection ===
                  "seo"
                }
                onClick={() =>
                  setActiveSection("seo")
                }
              />

              <SidebarButton
                icon={Layers}
                label="Variants"
                active={
                  activeSection ===
                  "variants"
                }
                onClick={() =>
                  setActiveSection("variants")
                }
              />

            </div>

          </aside>

          {/* ================================================= */}
          {/* MAIN */}
          {/* ================================================= */}

          <main className="space-y-6">

            {/* ================================================= */}
            {/* BASIC INFORMATION */}
            {/* ================================================= */}

            {(activeSection ===
              "basic" ||
              activeSection ===
                "details") && (
              <SectionCard
                title="Basic Information"
                icon={Package}
              >

                <div className="grid md:grid-cols-2 gap-5">

                  <InputField
                    label="Product Title"
                    value={
                      productForm.title
                    }
                    onChange={(value) =>
                      updateProductField(
                        "title",
                        value
                      )
                    }
                    required
                  />

                  <InputField
                    label="Brand"
                    value={
                      productForm.brand
                    }
                    onChange={(value) =>
                      updateProductField(
                        "brand",
                        value
                      )
                    }
                    required
                  />

                  <InputField
                    label="Slug"
                    value={
                      productForm.slug
                    }
                    onChange={(value) =>
                      updateProductField(
                        "slug",
                        value
                      )
                    }
                    required
                  />

                  <InputField
                    label="Manufacturer"
                    value={
                      productForm.manufacturer
                    }
                    onChange={(value) =>
                      updateProductField(
                        "manufacturer",
                        value
                      )
                    }
                  />

                  <div className="md:col-span-2">
                    <CategoryHierarchy
                      category={productForm.category}
                      subCategory={productForm.subCategory}
                      subCategoryLevel2={productForm.subCategoryLevel2}
                      categories={categories}
                      subCategories={subCategories}
                      level2Categories={level2Categories}
                      categoriesLoading={categoriesLoading}
                      subCategoriesLoading={subCategoriesLoading}
                      level2Loading={level2Loading}
                      onCategoryChange={handleCategoryChange}
                      onSubCategoryChange={handleSubCategoryChange}
                      onLevel2Change={(value) =>
                        updateProductField(
                          "subCategoryLevel2",
                          value
                        )
                      }
                      getName={getCategoryName}
                    />
                  </div>

                  <InputField
                    label="Country Of Origin"
                    value={
                      productForm.countryOfOrigin
                    }
                    onChange={(value) =>
                      updateProductField(
                        "countryOfOrigin",
                        value
                      )
                    }
                  />

                </div>

                <div className="mt-5">

                  <TextAreaField
                    label="Short Description"
                    value={
                      productForm.shortDescription
                    }
                    onChange={(value) =>
                      updateProductField(
                        "shortDescription",
                        value
                      )
                    }
                    rows={3}
                  />

                </div>

                <div className="mt-5">

                  <TextAreaField
                    label="Description"
                    value={
                      productForm.description
                    }
                    onChange={(value) =>
                      updateProductField(
                        "description",
                        value
                      )
                    }
                    rows={8}
                  />

                </div>

              </SectionCard>
            )}

            {/* ================================================= */}
            {/* HIGHLIGHTS & TAGS */}
            {/* ================================================= */}

            {(activeSection ===
              "details" ||
              activeSection ===
                "basic") && (
              <>

                <SectionCard
                  title="Highlights"
                  icon={Tag}
                  action={
                    <AddButton
                      onClick={
                        addHighlight
                      }
                      label="Add Highlight"
                    />
                  }
                >

                  <div className="space-y-3">

                    {productForm.highlights
                      .length === 0 && (
                      <EmptyText text="No highlights added." />
                    )}

                    {productForm.highlights.map(
                      (
                        highlight,
                        index
                      ) => (
                        <div
                          key={index}
                          className="flex gap-2"
                        >

                          <input
                            value={
                              highlight
                            }
                            onChange={(e) =>
                              updateHighlight(
                                index,
                                e.target.value
                              )
                            }
                            placeholder="Enter product highlight"
                            className="flex-1 input"
                          />

                          <button
                            onClick={() =>
                              removeHighlight(
                                index
                              )
                            }
                            className="w-11 h-11 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      )
                    )}

                  </div>

                </SectionCard>

                <SectionCard
                  title="Tags"
                  icon={Tag}
                  action={
                    <AddButton
                      onClick={addTag}
                      label="Add Tag"
                    />
                  }
                >

                  <div className="space-y-3">

                    {productForm.tags
                      .length === 0 && (
                      <EmptyText text="No tags added." />
                    )}

                    {productForm.tags.map(
                      (tag, index) => (
                        <div
                          key={index}
                          className="flex gap-2"
                        >

                          <input
                            value={tag}
                            onChange={(e) =>
                              updateTag(
                                index,
                                e.target.value
                              )
                            }
                            placeholder="Enter tag"
                            className="flex-1 input"
                          />

                          <button
                            onClick={() =>
                              removeTag(
                                index
                              )
                            }
                            className="w-11 h-11 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                        </div>
                      )
                    )}

                  </div>

                </SectionCard>

              </>
            )}

            {/* ================================================= */}
            {/* SERVICES */}
            {/* ================================================= */}

            {activeSection ===
              "services" && (
              <SectionCard
                title="Services"
                icon={ShieldCheck}
              >

                {/* RETURN */}

                <div className="border border-gray-200 rounded-xl p-5">

                  <div className="flex items-center justify-between">

                    <div>
                      <h3 className="font-semibold">
                        Return Policy
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Configure product return policy
                      </p>
                    </div>

                    <Toggle
                      checked={
                        productForm.services
                          .returnPolicy
                          .returnable
                      }
                      onChange={(value) =>
                        updateProductNested(
                          "services",
                          "returnPolicy",
                          {
                            ...productForm
                              .services
                              .returnPolicy,
                            returnable:
                              value,
                          }
                        )
                      }
                    />

                  </div>

                  {productForm.services
                    .returnPolicy
                    .returnable && (
                    <div className="grid md:grid-cols-2 gap-5 mt-5">

                      <InputField
                        label="Return Days"
                        type="number"
                        value={
                          productForm
                            .services
                            .returnPolicy
                            .returnDays
                        }
                        onChange={(value) =>
                          updateProductNested(
                            "services",
                            "returnPolicy",
                            {
                              ...productForm
                                .services
                                .returnPolicy,

                              returnDays:
                                Number(
                                  value
                                ),
                            }
                          )
                        }
                      />

                      <SelectField
                        label="Return Type"
                        value={
                          productForm
                            .services
                            .returnPolicy
                            .returnType
                        }
                        onChange={(value) =>
                          updateProductNested(
                            "services",
                            "returnPolicy",
                            {
                              ...productForm
                                .services
                                .returnPolicy,

                              returnType:
                                value,
                            }
                          )
                        }
                        options={[
                          [
                            "replacement",
                            "Replacement",
                          ],
                          [
                            "refund",
                            "Refund",
                          ],
                          [
                            "exchange",
                            "Exchange",
                          ],
                          [
                            "service-center",
                            "Service Center",
                          ],
                          [
                            "no-return",
                            "No Return",
                          ],
                        ]}
                      />

                    </div>
                  )}

                </div>

                {/* COD */}

                <div className="border border-gray-200 rounded-xl p-5 mt-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <h3 className="font-semibold">
                        Cash On Delivery
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Allow customers to pay on delivery
                      </p>
                    </div>

                    <Toggle
                      checked={
                        productForm.services
                          .cashOnDelivery
                          .available
                      }
                      onChange={(value) =>
                        updateProductNested(
                          "services",
                          "cashOnDelivery",
                          {
                            available:
                              value,
                          }
                        )
                      }
                    />

                  </div>

                </div>

                {/* WARRANTY */}

                <div className="border border-gray-200 rounded-xl p-5 mt-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <h3 className="font-semibold">
                        Warranty
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Product warranty information
                      </p>
                    </div>

                    <Toggle
                      checked={
                        productForm.services
                          .warranty
                          .available
                      }
                      onChange={(value) =>
                        updateProductNested(
                          "services",
                          "warranty",
                          {
                            ...productForm
                              .services
                              .warranty,

                            available:
                              value,
                          }
                        )
                      }
                    />

                  </div>

                  {productForm.services
                    .warranty
                    .available && (
                    <div className="grid md:grid-cols-2 gap-5 mt-5">

                      <InputField
                        label="Duration"
                        value={
                          productForm
                            .services
                            .warranty
                            .duration
                        }
                        onChange={(value) =>
                          updateProductNested(
                            "services",
                            "warranty",
                            {
                              ...productForm
                                .services
                                .warranty,

                              duration:
                                value,
                            }
                          )
                        }
                      />

                      <SelectField
                        label="Warranty Type"
                        value={
                          productForm
                            .services
                            .warranty
                            .type
                        }
                        onChange={(value) =>
                          updateProductNested(
                            "services",
                            "warranty",
                            {
                              ...productForm
                                .services
                                .warranty,

                              type: value,
                            }
                          )
                        }
                        options={[
                          [
                            "brand",
                            "Brand",
                          ],
                          [
                            "seller",
                            "Seller",
                          ],
                          [
                            "manufacturer",
                            "Manufacturer",
                          ],
                          [
                            "none",
                            "None",
                          ],
                        ]}
                      />

                    </div>
                  )}

                </div>

                {/* SUPPORT */}

                <div className="border border-gray-200 rounded-xl p-5 mt-4">

                  <div className="flex items-center justify-between">

                    <div>
                      <h3 className="font-semibold">
                        Support
                      </h3>
                    </div>

                    <Toggle
                      checked={
                        productForm.services
                          .support
                          .available
                      }
                      onChange={(value) =>
                        updateProductNested(
                          "services",
                          "support",
                          {
                            ...productForm
                              .services
                              .support,

                            available:
                              value,
                          }
                        )
                      }
                    />

                  </div>

                  <div className="mt-5">

                    <SelectField
                      label="Contact Type"
                      value={
                        productForm.services
                          .support
                          .contactType
                      }
                      onChange={(value) =>
                        updateProductNested(
                          "services",
                          "support",
                          {
                            ...productForm
                              .services
                              .support,

                            contactType:
                              value,
                          }
                        )
                      }
                      options={[
                        [
                          "seller",
                          "Seller",
                        ],
                        [
                          "brand",
                          "Brand",
                        ],
                        [
                          "marketplace",
                          "Marketplace",
                        ],
                      ]}
                    />

                  </div>

                </div>

              </SectionCard>
            )}

            {/* ================================================= */}
            {/* SEO */}
            {/* ================================================= */}

            {activeSection ===
              "seo" && (
              <SectionCard
                title="SEO"
                icon={Search}
              >

                <div className="space-y-5">

                  <InputField
                    label="Meta Title"
                    value={
                      productForm.seo
                        .metaTitle
                    }
                    onChange={(value) =>
                      updateProductNested(
                        "seo",
                        "metaTitle",
                        value
                      )
                    }
                  />

                  <TextAreaField
                    label="Meta Description"
                    value={
                      productForm.seo
                        .metaDescription
                    }
                    onChange={(value) =>
                      updateProductNested(
                        "seo",
                        "metaDescription",
                        value
                      )
                    }
                    rows={4}
                  />

                  <div>

                    <label className="label">
                      Keywords
                    </label>

                    <div className="space-y-3">

                      {productForm.seo
                        .keywords
                        .map(
                          (
                            keyword,
                            index
                          ) => (
                            <div
                              key={index}
                              className="flex gap-2"
                            >

                              <input
                                value={
                                  keyword
                                }
                                onChange={(
                                  e
                                ) =>
                                  setProductForm(
                                    (
                                      prev
                                    ) => ({
                                      ...prev,

                                      seo: {
                                        ...prev.seo,

                                        keywords:
                                          prev.seo.keywords.map(
                                            (
                                              item,
                                              i
                                            ) =>
                                              i ===
                                              index
                                                ? e
                                                    .target
                                                    .value
                                                : item
                                          ),
                                      },
                                    })
                                  )
                                }
                                className="flex-1 input"
                                placeholder="SEO keyword"
                              />

                              <button
                                onClick={() =>
                                  setProductForm(
                                    (
                                      prev
                                    ) => ({
                                      ...prev,

                                      seo: {
                                        ...prev.seo,

                                        keywords:
                                          prev.seo.keywords.filter(
                                            (
                                              _,
                                              i
                                            ) =>
                                              i !==
                                              index
                                          ),
                                      },
                                    })
                                  )
                                }
                                className="w-11 h-11 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>

                            </div>
                          )
                        )}

                    </div>

                    <button
                      onClick={() =>
                        setProductForm(
                          (prev) => ({
                            ...prev,

                            seo: {
                              ...prev.seo,

                              keywords: [
                                ...prev
                                  .seo
                                  .keywords,
                                "",
                              ],
                            },
                          })
                        )
                      }
                      className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
                    >
                      + Add Keyword
                    </button>

                  </div>

                </div>

              </SectionCard>
            )}

            {/* ================================================= */}
            {/* PRODUCT STATUS */}
            {/* ================================================= */}

            {(activeSection ===
              "basic" ||
              activeSection ===
                "details") && (
              <SectionCard
                title="Product Status"
                icon={CheckCircle}
              >

                <div className="grid md:grid-cols-2 gap-5">

                  <SelectField
                    label="Status"
                    value={
                      productForm.status
                    }
                    onChange={(value) =>
                      updateProductField(
                        "status",
                        value
                      )
                    }
                    options={[
                      [
                        "draft",
                        "Draft",
                      ],
                      [
                        "active",
                        "Active",
                      ],
                      [
                        "inactive",
                        "Inactive",
                      ],
                      [
                        "blocked",
                        "Blocked",
                      ],
                    ]}
                  />

                  <div className="flex items-center justify-between border border-gray-200 rounded-xl px-4">

                    <div>
                      <p className="font-medium text-sm">
                        Published
                      </p>

                      <p className="text-xs text-gray-500">
                        Make this product visible
                      </p>
                    </div>

                    <Toggle
                      checked={
                        productForm.isPublished
                      }
                      onChange={(value) =>
                        updateProductField(
                          "isPublished",
                          value
                        )
                      }
                    />

                  </div>

                </div>

                <div className="mt-6 flex justify-end">

                  <button
                    onClick={
                      handleSaveProduct
                    }
                    disabled={
                      savingProduct
                    }
                    className="px-5 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                  >

                    {savingProduct ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}

                    {savingProduct
                      ? "Saving..."
                      : "Save Product"}

                  </button>

                </div>

              </SectionCard>
            )}

            {/* ================================================= */}
            {/* VARIANTS */}
            {/* ================================================= */}

            {activeSection ===
              "variants" && (
              <>

                <SectionCard
                  title="Product Variants"
                  icon={Layers}
                >

                  <div className="mb-6">

                    <label className="label">
                      Select Variant
                    </label>

                    <select
                      value={
                        selectedVariantId
                      }
                      onChange={(e) =>
                        handleVariantChange(
                          e.target.value
                        )
                      }
                      className="input"
                    >

                      {product.variants?.map(
                        (variant) => (
                          <option
                            key={
                              variant._id
                            }
                            value={
                              variant._id
                            }
                          >
                            {variant.variantName ||
                              "Unnamed Variant"}{" "}
                            — SKU:{" "}
                            {variant.sku}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  {variantForm && (
                    <VariantEditor
                      variantForm={
                        variantForm
                      }
                      updateVariantField={
                        updateVariantField
                      }
                      updateVariantNested={
                        updateVariantNested
                      }
                      updateVariantDeep={
                        updateVariantDeep
                      }
                      updateAttribute={
                        updateAttribute
                      }
                      addAttribute={
                        addAttribute
                      }
                      removeAttribute={
                        removeAttribute
                      }
                      addSpecificationGroup={
                        addSpecificationGroup
                      }
                      updateSpecificationGroup={
                        updateSpecificationGroup
                      }
                      removeSpecificationGroup={
                        removeSpecificationGroup
                      }
                      addSpecificationField={
                        addSpecificationField
                      }
                      updateSpecificationField={
                        updateSpecificationField
                      }
                      removeSpecificationField={
                        removeSpecificationField
                      }
                      addImage={addImage}
                      updateImage={
                        updateImage
                      }
                      removeImage={
                        removeImage
                      }
                      setPrimaryImage={
                        setPrimaryImage
                      }
                      savingVariant={
                        savingVariant
                      }
                      handleSaveVariant={
                        handleSaveVariant
                      }
                      getImageUrl={
                        getImageUrl
                      }
                    />
                  )}

                </SectionCard>

              </>
            )}

          </main>

        </div>

      </div>

    </div>
  );
}

export default EditProduct;

/* =========================================================
   VARIANT EDITOR
========================================================= */

function VariantEditor({
  variantForm,

  updateVariantField,
  updateVariantNested,
  updateVariantDeep,

  updateAttribute,
  addAttribute,
  removeAttribute,

  addSpecificationGroup,
  updateSpecificationGroup,
  removeSpecificationGroup,

  addSpecificationField,
  updateSpecificationField,
  removeSpecificationField,

  addImage,
  updateImage,
  removeImage,
  setPrimaryImage,

  savingVariant,
  handleSaveVariant,

  getImageUrl,
}) {
  return (
    <div className="space-y-6">

      {/* ================================================= */}
      {/* BASIC */}
      {/* ================================================= */}

      <div className="border border-gray-200 rounded-xl p-5">

        <h3 className="font-bold text-lg mb-5">
          Variant Information
        </h3>

        <div className="grid md:grid-cols-2 gap-5">

          <InputField
            label="Variant Name"
            value={
              variantForm.variantName
            }
            onChange={(value) =>
              updateVariantField(
                "variantName",
                value
              )
            }
          />

          <InputField
            label="SKU"
            value={
              variantForm.sku
            }
            onChange={(value) =>
              updateVariantField(
                "sku",
                value.toUpperCase()
              )
            }
          />

          <InputField
            label="Barcode"
            value={
              variantForm.barcode
            }
            onChange={(value) =>
              updateVariantField(
                "barcode",
                value
              )
            }
          />

          <SelectField
            label="Status"
            value={
              variantForm.status
            }
            onChange={(value) =>
              updateVariantField(
                "status",
                value
              )
            }
            options={[
              [
                "active",
                "Active",
              ],
              [
                "inactive",
                "Inactive",
              ],
              [
                "out_of_stock",
                "Out Of Stock",
              ],
              [
                "blocked",
                "Blocked",
              ],
            ]}
          />

        </div>

        <div className="mt-5 flex items-center justify-between border border-gray-200 rounded-xl p-4">

          <div>

            <p className="font-medium text-sm">
              Default Variant
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Use this variant as the default product variant
            </p>

          </div>

          <Toggle
            checked={
              variantForm.isDefault
            }
            onChange={(value) =>
              updateVariantField(
                "isDefault",
                value
              )
            }
          />

        </div>

      </div>

      {/* ================================================= */}
      {/* ATTRIBUTES */}
      {/* ================================================= */}

      <div className="border border-gray-200 rounded-xl p-5">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h3 className="font-bold text-lg">
              Attributes
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Example: Color, Size, RAM, Storage
            </p>
          </div>

          <AddButton
            onClick={
              addAttribute
            }
            label="Add Attribute"
          />

        </div>

        <div className="space-y-3">

          {variantForm.attributes
            .length === 0 && (
            <EmptyText text="No attributes added." />
          )}

          {variantForm.attributes.map(
            (attribute, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_auto] gap-3"
              >

                <input
                  value={
                    attribute.name
                  }
                  onChange={(e) =>
                    updateAttribute(
                      index,
                      "name",
                      e.target.value
                    )
                  }
                  placeholder="Name"
                  className="input"
                />

                <input
                  value={
                    attribute.value
                  }
                  onChange={(e) =>
                    updateAttribute(
                      index,
                      "value",
                      e.target.value
                    )
                  }
                  placeholder="Value"
                  className="input"
                />

                <button
                  onClick={() =>
                    removeAttribute(
                      index
                    )
                  }
                  className="w-11 h-11 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

              </div>
            )
          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* PRICING */}
      {/* ================================================= */}

      <div className="border border-gray-200 rounded-xl p-5">

        <h3 className="font-bold text-lg mb-5">
          Pricing
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

          <InputField
            label="MRP"
            type="number"
            value={
              variantForm.pricing.mrp
            }
            onChange={(value) =>
              updateVariantNested(
                "pricing",
                "mrp",
                Number(value)
              )
            }
          />

          <InputField
            label="Selling Price"
            type="number"
            value={
              variantForm.pricing
                .sellingPrice
            }
            onChange={(value) =>
              updateVariantNested(
                "pricing",
                "sellingPrice",
                Number(value)
              )
            }
          />

          <InputField
            label="Cost Price"
            type="number"
            value={
              variantForm.pricing
                .costPrice
            }
            onChange={(value) =>
              updateVariantNested(
                "pricing",
                "costPrice",
                Number(value)
              )
            }
          />

          <InputField
            label="Tax"
            type="number"
            value={
              variantForm.pricing.tax
            }
            onChange={(value) =>
              updateVariantNested(
                "pricing",
                "tax",
                Number(value)
              )
            }
          />

          <InputField
            label="Discount %"
            type="number"
            value={
              variantForm.pricing
                .discount
            }
            onChange={(value) =>
              updateVariantNested(
                "pricing",
                "discount",
                Number(value)
              )
            }
          />

        </div>

      </div>

      {/* ================================================= */}
      {/* INVENTORY */}
      {/* ================================================= */}

      <div className="border border-gray-200 rounded-xl p-5">

        <h3 className="font-bold text-lg mb-5">
          Inventory
        </h3>

        <div className="grid md:grid-cols-3 gap-5">

          <InputField
            label="Stock"
            type="number"
            value={
              variantForm.inventory.stock
            }
            onChange={(value) =>
              updateVariantNested(
                "inventory",
                "stock",
                Number(value)
              )
            }
          />

          <InputField
            label="Reserved"
            type="number"
            value={
              variantForm.inventory.reserved
            }
            onChange={(value) =>
              updateVariantNested(
                "inventory",
                "reserved",
                Number(value)
              )
            }
          />

          <InputField
            label="Low Stock Alert"
            type="number"
            value={
              variantForm.inventory
                .lowStockAlert
            }
            onChange={(value) =>
              updateVariantNested(
                "inventory",
                "lowStockAlert",
                Number(value)
              )
            }
          />

        </div>

      </div>

      {/* ================================================= */}
      {/* SHIPPING */}
      {/* ================================================= */}

      <div className="border border-gray-200 rounded-xl p-5">

        <div className="flex items-center gap-2 mb-5">

          <Truck className="w-5 h-5" />

          <h3 className="font-bold text-lg">
            Shipping
          </h3>

        </div>

        <div className="grid md:grid-cols-2 gap-5">

          <InputField
            label="Weight (kg)"
            type="number"
            value={
              variantForm.shipping
                .weight
            }
            onChange={(value) =>
              updateVariantNested(
                "shipping",
                "weight",
                Number(value)
              )
            }
          />

          <SelectField
            label="Package Type"
            value={
              variantForm.shipping
                .packageType
            }
            onChange={(value) =>
              updateVariantNested(
                "shipping",
                "packageType",
                value
              )
            }
            options={[
              [
                "box",
                "Box",
              ],
              [
                "packet",
                "Packet",
              ],
              [
                "tube",
                "Tube",
              ],
              [
                "envelope",
                "Envelope",
              ],
            ]}
          />

        </div>

        <div className="grid md:grid-cols-3 gap-5 mt-5">

          <InputField
            label="Length (cm)"
            type="number"
            value={
              variantForm.shipping
                .dimensions
                .length
            }
            onChange={(value) =>
              updateVariantDeep(
                "shipping",
                "dimensions",
                "length",
                Number(value)
              )
            }
          />

          <InputField
            label="Breadth (cm)"
            type="number"
            value={
              variantForm.shipping
                .dimensions
                .breadth
            }
            onChange={(value) =>
              updateVariantDeep(
                "shipping",
                "dimensions",
                "breadth",
                Number(value)
              )
            }
          />

          <InputField
            label="Height (cm)"
            type="number"
            value={
              variantForm.shipping
                .dimensions
                .height
            }
            onChange={(value) =>
              updateVariantDeep(
                "shipping",
                "dimensions",
                "height",
                Number(value)
              )
            }
          />

        </div>

      </div>

      {/* ================================================= */}
      {/* IMAGES */}
      {/* ================================================= */}

      <div className="border border-gray-200 rounded-xl p-5">

        <div className="flex items-center justify-between mb-5">

          <div className="flex items-center gap-2">

            <ImageIcon className="w-5 h-5" />

            <div>
              <h3 className="font-bold text-lg">
                Images
              </h3>

              <p className="text-xs text-gray-500">
                Manage variant images
              </p>
            </div>

          </div>

          <AddButton
            onClick={addImage}
            label="Add Image"
          />

        </div>

        <div className="space-y-5">

          {variantForm.images.length ===
            0 && (
            <EmptyText text="No images added." />
          )}

          {variantForm.images.map(
            (image, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-4"
              >

                <div className="flex flex-col md:flex-row gap-4">

                  {/* PREVIEW */}

                  <div className="w-28 h-28 rounded-lg overflow-hidden bg-gray-100 shrink-0">

                    {image.url ? (
                      <img
                        src={getImageUrl(
                          image.url
                        )}
                        alt={
                          image.alt ||
                          "Product"
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      </div>
                    )}

                  </div>

                  {/* INPUTS */}

                  <div className="flex-1 space-y-3">

                    <input
                      value={
                        image.url
                      }
                      onChange={(e) =>
                        updateImage(
                          index,
                          "url",
                          e.target.value
                        )
                      }
                      placeholder="Image URL"
                      className="input"
                    />

                    <input
                      value={
                        image.alt
                      }
                      onChange={(e) =>
                        updateImage(
                          index,
                          "alt",
                          e.target.value
                        )
                      }
                      placeholder="Alt text"
                      className="input"
                    />

                    <div className="flex flex-wrap items-center gap-4">

                      <label className="flex items-center gap-2 text-sm">

                        <input
                          type="radio"
                          name="primaryImage"
                          checked={
                            image.isPrimary
                          }
                          onChange={() =>
                            setPrimaryImage(
                              index
                            )
                          }
                        />

                        Primary Image

                      </label>

                      <span className="text-xs text-gray-500">
                        Order:{" "}
                        {image.sortOrder}
                      </span>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      removeImage(
                        index
                      )
                    }
                    className="w-10 h-10 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            )
          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* SPECIFICATIONS */}
      {/* ================================================= */}

      <div className="border border-gray-200 rounded-xl p-5">

        <div className="flex items-center justify-between mb-5">

          <div>
            <h3 className="font-bold text-lg">
              Specifications
            </h3>

            <p className="text-xs text-gray-500 mt-1">
              Manage specification groups and fields
            </p>
          </div>

          <AddButton
            onClick={
              addSpecificationGroup
            }
            label="Add Group"
          />

        </div>

        <div className="space-y-5">

          {variantForm.specifications
            .length === 0 && (
            <EmptyText text="No specifications added." />
          )}

          {variantForm.specifications.map(
            (
              group,
              groupIndex
            ) => (
              <div
                key={groupIndex}
                className="border border-gray-200 rounded-xl overflow-hidden"
              >

                <div className="bg-gray-50 p-4 flex items-center gap-3">

                  <input
                    value={
                      group.group
                    }
                    onChange={(e) =>
                      updateSpecificationGroup(
                        groupIndex,
                        e.target.value
                      )
                    }
                    placeholder="Group name e.g. General"
                    className="flex-1 input bg-white"
                  />

                  <button
                    onClick={() =>
                      removeSpecificationGroup(
                        groupIndex
                      )
                    }
                    className="w-10 h-10 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

                <div className="p-4 space-y-3">

                  {group.fields?.map(
                    (
                      field,
                      fieldIndex
                    ) => (
                      <div
                        key={fieldIndex}
                        className="grid grid-cols-[1fr_1fr_auto] gap-3"
                      >

                        <input
                          value={
                            field.key
                          }
                          onChange={(
                            e
                          ) =>
                            updateSpecificationField(
                              groupIndex,
                              fieldIndex,
                              "key",
                              e.target.value
                            )
                          }
                          placeholder="Key"
                          className="input"
                        />

                        <input
                          value={
                            field.value
                          }
                          onChange={(
                            e
                          ) =>
                            updateSpecificationField(
                              groupIndex,
                              fieldIndex,
                              "value",
                              e.target.value
                            )
                          }
                          placeholder="Value"
                          className="input"
                        />

                        <button
                          onClick={() =>
                            removeSpecificationField(
                              groupIndex,
                              fieldIndex
                            )
                          }
                          className="w-11 h-11 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    )
                  )}

                  <button
                    onClick={() =>
                      addSpecificationField(
                        groupIndex
                      )
                    }
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Add Field
                  </button>

                </div>

              </div>
            )
          )}

        </div>

      </div>

      {/* ================================================= */}
      {/* SAVE VARIANT */}
      {/* ================================================= */}

      <div className="flex justify-end">

        <button
          onClick={
            handleSaveVariant
          }
          disabled={savingVariant}
          className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
        >

          {savingVariant ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}

          {savingVariant
            ? "Saving Variant..."
            : "Save Variant"}

        </button>

      </div>

    </div>
  );
}

/* =========================================================
   CATEGORY HIERARCHY
========================================================= */

function CategoryHierarchy({
  category,
  subCategory,
  subCategoryLevel2,
  categories,
  subCategories,
  level2Categories,
  categoriesLoading,
  subCategoriesLoading,
  level2Loading,
  onCategoryChange,
  onSubCategoryChange,
  onLevel2Change,
  getName,
}) {
  const selectedCategory = categories.find((item) => item._id === category);
  const selectedSubCategory = subCategories.find((item) => item._id === subCategory);
  const selectedLevel2 = level2Categories.find((item) => item._id === subCategoryLevel2);

  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-gray-50 via-white to-gray-50 p-5">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-black text-white shadow-sm">
          <Layers className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-semibold text-gray-900">
            Product Category
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Choose the category hierarchy for this product
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CategorySelect
          label="Category"
          value={category}
          disabled={categoriesLoading}
          placeholder={categoriesLoading ? "Loading categories..." : "Select Category"}
          options={categories}
          onChange={onCategoryChange}
          getName={getName}
        />

        <CategorySelect
          label="Sub Category"
          value={subCategory}
          disabled={!category || subCategoriesLoading}
          placeholder={!category ? "Select category first" : subCategoriesLoading ? "Loading subcategories..." : "Select Sub Category"}
          options={subCategories}
          onChange={onSubCategoryChange}
          getName={getName}
        />

        <CategorySelect
          label="Level 2 Category"
          value={subCategoryLevel2}
          disabled={!subCategory || level2Loading}
          placeholder={!subCategory ? "Select sub category first" : level2Loading ? "Loading level 2..." : "Select Level 2 Category"}
          options={level2Categories}
          onChange={onLevel2Change}
          getName={getName}
        />
      </div>

      {(category || subCategory || subCategoryLevel2) && (
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-4 text-xs">
          <span className="font-medium text-gray-400">Selected:</span>

          {category && (
            <span className="rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-700">
              {getName(selectedCategory) || "Category selected"}
            </span>
          )}

          {subCategory && (
            <>
              <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-gray-300" />
              <span className="rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-700">
                {getName(selectedSubCategory) || "Sub category selected"}
              </span>
            </>
          )}

          {subCategoryLevel2 && (
            <>
              <ChevronDown className="h-3.5 w-3.5 -rotate-90 text-gray-300" />
              <span className="rounded-full bg-black px-3 py-1.5 font-medium text-white">
                {getName(selectedLevel2) || "Level 2 selected"}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function CategorySelect({
  label,
  value,
  disabled,
  placeholder,
  options,
  onChange,
  getName,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <div className="relative">
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="h-12 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 pr-10 text-sm font-medium text-gray-800 outline-none transition-all hover:border-gray-300 focus:border-black focus:ring-4 focus:ring-black/5 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
        >
          <option value="">{placeholder}</option>

          {options.map((item) => (
            <option key={item._id} value={item._id}>
              {getName(item)}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
}

/* =========================================================
   SIDEBAR BUTTON
========================================================= */

function SidebarButton({
  icon: Icon,
  label,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition ${
        active
          ? "bg-black text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

/* =========================================================
   SECTION CARD
========================================================= */

function SectionCard({
  title,
  icon: Icon,
  children,
  action,
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">

        <div className="flex items-center gap-3">

          {Icon && (
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <Icon className="w-4 h-4 text-gray-700" />
            </div>
          )}

          <h2 className="font-bold text-gray-900">
            {title}
          </h2>

        </div>

        {action}

      </div>

      <div className="p-6">
        {children}
      </div>

    </section>
  );
}

/* =========================================================
   INPUT
========================================================= */

function InputField({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div>

      <label className="label">
        {label}

        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-black focus:ring-4 focus:ring-black/5"
      />

    </div>
  );
}

/* =========================================================
   TEXT AREA
========================================================= */

function TextAreaField({
  label,
  value,
  onChange,
  rows = 4,
}) {
  return (
    <div>

      <label className="label">
        {label}
      </label>

      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-black focus:ring-4 focus:ring-black/5 resize-y"
      />

    </div>
  );
}

/* =========================================================
   SELECT
========================================================= */

function SelectField({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>

      <label className="label">
        {label}
      </label>

      <select
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="w-full h-11 rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 outline-none transition-all hover:border-gray-300 focus:border-black focus:ring-4 focus:ring-black/5"
      >

        {options.map(
          ([optionValue, optionLabel]) => (
            <option
              key={optionValue}
              value={optionValue}
            >
              {optionLabel}
            </option>
          )
        )}

      </select>

    </div>
  );
}

/* =========================================================
   TOGGLE
========================================================= */

function Toggle({
  checked,
  onChange,
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onChange(!checked)
      }
      className={`relative w-11 h-6 rounded-full transition ${
        checked
          ? "bg-black"
          : "bg-gray-300"
      }`}
    >

      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
          checked
            ? "left-6"
            : "left-1"
        }`}
      />

    </button>
  );
}

/* =========================================================
   ADD BUTTON
========================================================= */

function AddButton({
  onClick,
  label,
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm font-medium hover:bg-gray-50"
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
}

/* =========================================================
   EMPTY
========================================================= */

function EmptyText({ text }) {
  return (
    <div className="py-6 text-center text-sm text-gray-400">
      {text}
    </div>
  );
}

/* =========================================================
   STATUS
========================================================= */

function StatusBadge({
  status,
}) {
  const styles = {
    active:
      "bg-green-50 text-green-600 border-green-200",

    inactive:
      "bg-gray-100 text-gray-600 border-gray-200",

    blocked:
      "bg-red-50 text-red-600 border-red-200",

    draft:
      "bg-yellow-50 text-yellow-600 border-yellow-200",

    deleted:
      "bg-red-50 text-red-600 border-red-200",

    out_of_stock:
      "bg-orange-50 text-orange-600 border-orange-200",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full border ${
        styles[status] ||
        "bg-gray-100 text-gray-600 border-gray-200"
      }`}
    >
      {status || "unknown"}
    </span>
  );
}