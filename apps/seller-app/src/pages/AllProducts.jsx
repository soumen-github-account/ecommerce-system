// import React, { useEffect, useMemo, useState } from "react";

// import {
//   Plus,
//   Search,
//   ChevronDown,
//   SlidersHorizontal,
//   RotateCcw,
//   Package,
//   CheckCircle2,
//   TriangleAlert,
//   FileText,
//   Eye,
//   Pencil,
//   MoreVertical,
//   ChevronLeft,
//   ChevronRight,
//   Trash2,
//   Power,
//   Ban,
//   Loader2,
//   X,
// } from "lucide-react";

// import {
//   getSellerProducts,
//   deleteSellerProduct,
//   updateVariantStatus,
//   getMyProductById,
// } from "../services/productEditApi";
// import ProductPreview from "../components/AllProductComponent/ProductPreview";

// // =====================================================
// // FILTER BUTTON
// // =====================================================

// const FilterButton = ({ children }) => {
//   return (
//     <button
//       className="
//                 h-[38px]
//                 min-w-[140px]
//                 px-4
//                 rounded-md
//                 border
//                 border-[#e2e5eb]
//                 bg-white
//                 flex
//                 items-center
//                 justify-between
//                 gap-4
//                 text-[13px]
//                 text-[#202737]
//                 hover:bg-gray-50
//                 transition
//             "
//     >
//       <span>{children}</span>

//       <ChevronDown size={15} className="text-[#647084]" />
//     </button>
//   );
// };

// // =====================================================
// // STATUS BADGE
// // =====================================================

// const StatusBadge = ({ status }) => {
//   const styles = {
//     active: "bg-[#dcf7eb] text-[#079455]",

//     inactive: "bg-[#eef0f3] text-[#667085]",

//     out_of_stock: "bg-[#ffe1e1] text-[#f04444]",

//     blocked: "bg-[#ffe4e4] text-[#b42318]",
//   };

//   const labels = {
//     active: "Active",

//     inactive: "Inactive",

//     out_of_stock: "Out of Stock",

//     blocked: "Blocked",
//   };

//   return (
//     <span
//       className={`
//                 inline-flex
//                 items-center
//                 px-2.5
//                 py-1
//                 rounded-md
//                 text-[12px]
//                 font-medium
//                 whitespace-nowrap
//                 ${styles[status] || "bg-gray-100 text-gray-600"}
//             `}
//     >
//       {labels[status] || status}
//     </span>
//   );
// };

// // =====================================================
// // ALL PRODUCTS
// // =====================================================

// const AllProducts = () => {
//   const [products, setProducts] = useState([]);

//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);

//   const [openMenu, setOpenMenu] = useState(null);

//   const [statusLoading, setStatusLoading] = useState(null);

//   const [deleteLoading, setDeleteLoading] = useState(null);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showProductDialog, setShowProductDialog] = useState(false);
//   const [loadingProduct, setLoadingProduct] = useState(false);

//   // =================================================
//   // FETCH PRODUCTS
//   // =================================================

//   const fetchProducts = async () => {
//     try {
//       setLoading(true);

//       const data = await getSellerProducts();

//       if (data.success) {
//         setProducts(data.products || []);
//       }
//     } catch (error) {
//       console.error("Failed to fetch products:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleViewProduct = async (variantId) => {
//     try {
//       setLoadingProduct(true);
//       setShowProductDialog(true);

//       const response = await getMyProductById(variantId);

//       if (response.success) {
//         setSelectedProduct(response.product);
//       }
//     } catch (error) {
//       console.error("Failed to fetch product:", error);
//       setSelectedProduct(null);
//     } finally {
//       setLoadingProduct(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // =================================================
//   // SEARCH
//   // =================================================

//   const filteredProducts = useMemo(() => {
//     const value = search.toLowerCase().trim();

//     if (!value) return products;

//     return products.filter((product) => {
//       return (
//         product.title?.toLowerCase().includes(value) ||
//         product.sku?.toLowerCase().includes(value) ||
//         product.category?.name?.toLowerCase().includes(value)
//       );
//     });
//   }, [products, search]);

//   // =================================================
//   // STATS
//   // =================================================

//   const stats = useMemo(() => {
//     return [
//       {
//         title: "Total Products",

//         value: products.length,

//         icon: Package,

//         iconStyle: "bg-[#eef2ff] text-[#315bea]",
//       },

//       {
//         title: "Active Products",

//         value: products.filter((p) => p.status === "active").length,

//         icon: CheckCircle2,

//         iconStyle: "bg-[#ecfdf5] text-[#10b981]",
//       },

//       {
//         title: "Out of Stock",

//         value: products.filter((p) => p.status === "out_of_stock").length,

//         icon: TriangleAlert,

//         iconStyle: "bg-[#fff7e8] text-[#f59e0b]",
//       },

//       {
//         title: "Blocked Products",

//         value: products.filter((p) => p.status === "blocked").length,

//         icon: FileText,

//         iconStyle: "bg-[#faf0ff] text-[#a855f7]",
//       },
//     ];
//   }, [products]);

//   // =================================================
//   // CHANGE STATUS
//   // =================================================

//   const handleStatusChange = async (product, status) => {
//     try {
//       setStatusLoading(product.variantId);

//       setOpenMenu(null);

//       const data = await updateVariantStatus(product.variantId, status);

//       if (data.success) {
//         setProducts((prev) =>
//           prev.map((item) =>
//             item.variantId === product.variantId
//               ? {
//                   ...item,
//                   status,
//                 }
//               : item,
//           ),
//         );
//       }
//     } catch (error) {
//       console.error("Status update failed:", error);
//     } finally {
//       setStatusLoading(null);
//     }
//   };

//   // =================================================
//   // DELETE PRODUCT
//   // =================================================

//   const handleDelete = async (product) => {
//     const confirmed = window.confirm(
//       `Are you sure you want to delete "${product.title}"?`,
//     );

//     if (!confirmed) return;

//     try {
//       setDeleteLoading(product.productId);

//       setOpenMenu(null);

//       const data = await deleteSellerProduct(product.productId);

//       if (data.success) {
//         setProducts((prev) =>
//           prev.filter((item) => item.productId !== product.productId),
//         );
//       }
//     } catch (error) {
//       console.error("Delete product failed:", error);
//     } finally {
//       setDeleteLoading(null);
//     }
//   };

//   // =================================================
//   // RESET
//   // =================================================

//   const handleReset = () => {
//     setSearch("");

//     setCurrentPage(1);
//   };

//   // =================================================
//   // RENDER
//   // =================================================

//   return (
//     <div
//       className="
//                 min-h-screen
//                 bg-white
//                 text-[#171c2b]
//             "
//     >
//       <div className="w-full px-6 py-6">
//         {/* =====================================
//                     HEADER
//                 ===================================== */}

//         <div
//           className="
//                         flex
//                         items-start
//                         justify-between
//                         mb-8
//                     "
//         >
//           <div>
//             <h1
//               className="
//                                 text-[22px]
//                                 font-semibold
//                                 tracking-[-0.3px]
//                             "
//             >
//               Products
//             </h1>

//             <p
//               className="
//                                 mt-1
//                                 text-[13px]
//                                 text-[#667085]
//                             "
//             >
//               Manage your all products here. You can add, edit and manage
//               products.
//             </p>
//           </div>

//           <button
//             className="
//                             h-[36px]
//                             px-4
//                             rounded-md
//                             bg-[#315bea]
//                             hover:bg-[#244bd0]
//                             text-white
//                             text-[13px]
//                             font-medium
//                             flex
//                             items-center
//                             gap-2
//                             shadow-sm
//                             transition
//                         "
//           >
//             <Plus size={17} strokeWidth={2.2} />
//             Add Product
//           </button>
//         </div>

//         {/* =====================================
//                     STATS
//                 ===================================== */}

//         <div
//           className="
//                         grid
//                         grid-cols-1
//                         sm:grid-cols-2
//                         xl:grid-cols-4
//                         gap-5
//                         mb-7
//                     "
//         >
//           {stats.map((item) => {
//             const Icon = item.icon;

//             return (
//               <div
//                 key={item.title}
//                 className="
//                                     h-[106px]
//                                     border
//                                     border-[#e3e6eb]
//                                     rounded-md
//                                     px-5
//                                     py-4
//                                     bg-white
//                                 "
//               >
//                 <div
//                   className="
//                                         flex
//                                         items-start
//                                         justify-between
//                                     "
//                 >
//                   <div>
//                     <p
//                       className="
//                                                 text-[12px]
//                                                 text-[#596273]
//                                             "
//                     >
//                       {item.title}
//                     </p>

//                     <h2
//                       className="
//                                                 mt-2
//                                                 text-[23px]
//                                                 leading-none
//                                                 font-semibold
//                                                 text-[#161c2b]
//                                             "
//                     >
//                       {item.value}
//                     </h2>
//                   </div>

//                   <div
//                     className={`
//                                             w-[44px]
//                                             h-[44px]
//                                             rounded-xl
//                                             flex
//                                             items-center
//                                             justify-center
//                                             ${item.iconStyle}
//                                         `}
//                   >
//                     <Icon size={20} strokeWidth={1.8} />
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* =====================================
//                     FILTER
//                 ===================================== */}

//         <div
//           className="
//                         border
//                         border-[#e3e6eb]
//                         rounded-md
//                         px-4
//                         py-3
//                         mb-0
//                     "
//         >
//           <div
//             className="
//                             flex
//                             flex-wrap
//                             xl:flex-nowrap
//                             items-center
//                             gap-3
//                         "
//           >
//             <div
//               className="
//                                 relative
//                                 w-full
//                                 xl:w-[325px]
//                             "
//             >
//               <Search
//                 size={17}
//                 className="
//                                     absolute
//                                     left-3
//                                     top-1/2
//                                     -translate-y-1/2
//                                     text-[#87909f]
//                                 "
//               />

//               <input
//                 type="text"
//                 placeholder="
//                                     Search products by name, SKU, category...
//                                 "
//                 value={search}
//                 onChange={(e) => {
//                   setSearch(e.target.value);

//                   setCurrentPage(1);
//                 }}
//                 className="
//                                     w-full
//                                     h-[38px]
//                                     pl-10
//                                     pr-3
//                                     rounded-md
//                                     bg-[#f7f8fa]
//                                     border
//                                     border-transparent
//                                     focus:border-[#315bea]
//                                     focus:bg-white
//                                     outline-none
//                                     text-[12px]
//                                     text-[#252b38]
//                                     placeholder:text-[#8992a3]
//                                 "
//               />
//             </div>

//             <FilterButton>Category</FilterButton>

//             <FilterButton>Status</FilterButton>

//             <FilterButton>Stock</FilterButton>

//             <div
//               className="
//                                 flex
//                                 items-center
//                                 gap-3
//                                 xl:ml-auto
//                             "
//             >
//               <button
//                 className="
//                                     h-[38px]
//                                     px-4
//                                     rounded-md
//                                     bg-[#f8f9fb]
//                                     hover:bg-gray-100
//                                     flex
//                                     items-center
//                                     gap-2
//                                     text-[13px]
//                                     font-medium
//                                     transition
//                                 "
//               >
//                 <SlidersHorizontal size={15} />
//                 Filters
//               </button>

//               <button
//                 onClick={handleReset}
//                 className="
//                                     h-[38px]
//                                     px-4
//                                     rounded-md
//                                     border
//                                     border-[#e2e5eb]
//                                     hover:bg-gray-50
//                                     flex
//                                     items-center
//                                     gap-2
//                                     text-[13px]
//                                     font-medium
//                                     transition
//                                 "
//               >
//                 <RotateCcw size={14} />
//                 Reset
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* =====================================
//                     TABLE
//                 ===================================== */}

//         <div
//           className="
//                         border-x
//                         border-b
//                         border-[#e3e6eb]
//                         rounded-b-md
//                         overflow-x-auto
//                     "
//         >
//           <table
//             className="
//                             w-full
//                             min-w-[1050px]
//                             border-collapse
//                         "
//           >
//             <thead>
//               <tr
//                 className="
//                                     h-[57px]
//                                     border-b
//                                     border-[#e6e8ec]
//                                     text-left
//                                 "
//               >
//                 <th className="w-[48px] px-4">
//                   <input
//                     type="checkbox"
//                     className="
//                                             w-[14px]
//                                             h-[14px]
//                                             accent-[#315bea]
//                                         "
//                   />
//                 </th>

//                 <th
//                   className="
//                                     px-3
//                                     text-[12px]
//                                     font-semibold
//                                     text-[#4d5668]
//                                 "
//                 >
//                   Product
//                 </th>

//                 <th
//                   className="
//                                     px-3
//                                     text-[12px]
//                                     font-semibold
//                                     text-[#4d5668]
//                                 "
//                 >
//                   SKU
//                 </th>

//                 <th
//                   className="
//                                     px-3
//                                     text-[12px]
//                                     font-semibold
//                                     text-[#4d5668]
//                                 "
//                 >
//                   Category
//                 </th>

//                 <th
//                   className="
//                                     px-3
//                                     text-[12px]
//                                     font-semibold
//                                     text-[#4d5668]
//                                 "
//                 >
//                   Price
//                 </th>

//                 <th
//                   className="
//                                     px-3
//                                     text-[12px]
//                                     font-semibold
//                                     text-[#4d5668]
//                                 "
//                 >
//                   Stock
//                 </th>

//                 <th
//                   className="
//                                     px-3
//                                     text-[12px]
//                                     font-semibold
//                                     text-[#4d5668]
//                                 "
//                 >
//                   Status
//                 </th>

//                 <th
//                   className="
//                                     px-3
//                                     text-[12px]
//                                     font-semibold
//                                     text-[#4d5668]
//                                 "
//                 >
//                   Added On
//                 </th>

//                 <th
//                   className="
//                                     px-3
//                                     text-[12px]
//                                     font-semibold
//                                     text-[#4d5668]
//                                 "
//                 >
//                   Actions
//                 </th>
//               </tr>
//             </thead>

//             <tbody>
//               {/* LOADING */}

//               {loading && (
//                 <tr>
//                   <td
//                     colSpan="9"
//                     className="
//                                             h-[180px]
//                                             text-center
//                                         "
//                   >
//                     <Loader2
//                       size={22}
//                       className="
//                                                 mx-auto
//                                                 animate-spin
//                                                 text-[#315bea]
//                                             "
//                     />
//                   </td>
//                 </tr>
//               )}

//               {/* PRODUCTS */}

//               {!loading &&
//                 filteredProducts.map((product) => (
//                   <tr
//                     key={product.variantId}
//                     className="
//                                                 h-[71px]
//                                                 border-b
//                                                 border-[#e7e9ed]
//                                                 last:border-b-0
//                                                 hover:bg-[#fafbfc]
//                                                 transition
//                                             "
//                   >
//                     <td className="px-4">
//                       <input
//                         type="checkbox"
//                         className="
//                                                         w-[14px]
//                                                         h-[14px]
//                                                         accent-[#315bea]
//                                                     "
//                       />
//                     </td>

//                     {/* PRODUCT */}

//                     <td className="px-3">
//                       <div
//                         className="
//                                                         flex
//                                                         items-center
//                                                         gap-4
//                                                     "
//                       >
//                         <div
//                           className="
//                                                             w-[48px]
//                                                             h-[48px]
//                                                             rounded-md
//                                                             border
//                                                             border-[#e3e6eb]
//                                                             bg-white
//                                                             overflow-hidden
//                                                             flex
//                                                             items-center
//                                                             justify-center
//                                                             flex-shrink-0
//                                                         "
//                         >
//                           <img
//                             src={product.image}
//                             alt={product.title}
//                             className="
//                                                                 w-full
//                                                                 h-full
//                                                                 object-contain
//                                                             "
//                           />
//                         </div>

//                         <div>
//                           <p
//                             className="
//                                                                 text-[13px]
//                                                                 font-semibold
//                                                                 text-[#151b29]
//                                                             "
//                           >
//                             {product.title}
//                           </p>

//                           <p
//                             className="
//                                                                 mt-1
//                                                                 text-[12px]
//                                                                 text-[#657083]
//                                                             "
//                           >
//                             {product.variantName}
//                           </p>
//                         </div>
//                       </div>
//                     </td>

//                     {/* SKU */}

//                     <td
//                       className="
//                                                     px-3
//                                                     text-[12px]
//                                                     text-[#3f4859]
//                                                 "
//                     >
//                       {product.sku}
//                     </td>

//                     {/* CATEGORY */}

//                     <td
//                       className="
//                                                     px-3
//                                                     text-[12px]
//                                                     text-[#3f4859]
//                                                 "
//                     >
//                       {product.category?.name || "-"}
//                     </td>

//                     {/* PRICE */}

//                     <td
//                       className="
//                                                     px-3
//                                                     text-[12px]
//                                                     text-[#252c3b]
//                                                     font-medium
//                                                 "
//                     >
//                       ₹{product.pricing?.sellingPrice}
//                     </td>

//                     {/* STOCK */}

//                     <td className="px-3">
//                       <span
//                         className={`
//                                                         text-[12px]
//                                                         font-medium
//                                                         ${
//                                                           product.inventory
//                                                             ?.stock === 0
//                                                             ? "text-[#f04444]"
//                                                             : product.inventory
//                                                                   ?.stock <= 15
//                                                               ? "text-[#f59e0b]"
//                                                               : "text-[#079455]"
//                                                         }
//                                                     `}
//                       >
//                         {product.inventory?.stock ?? 0}
//                       </span>
//                     </td>

//                     {/* STATUS */}

//                     <td className="px-3">
//                       <StatusBadge status={product.status} />
//                     </td>

//                     {/* DATE */}

//                     <td
//                       className="
//                                                     px-3
//                                                     text-[12px]
//                                                     text-[#3f4859]
//                                                     whitespace-nowrap
//                                                 "
//                     >
//                       {product.createdAt
//                         ? new Date(product.createdAt).toLocaleDateString(
//                             "en-IN",
//                             {
//                               day: "2-digit",
//                               month: "short",
//                               year: "numeric",
//                             },
//                           )
//                         : "-"}
//                     </td>

//                     {/* ACTIONS */}

//                     <td className="px-3">
//                       <div
//                         className="
//                                                         flex
//                                                         items-center
//                                                         gap-2
//                                                         relative
//                                                     "
//                       >
//                         {/* VIEW */}

//                         <button
//                           title="View"
//                           onClick={() => handleViewProduct(product.variantId)}
//                           className="
//                                                             w-[32px]
//                                                             h-[32px]
//                                                             border
//                                                             border-[#e1e5eb]
//                                                             rounded-md
//                                                             flex
//                                                             items-center
//                                                             justify-center
//                                                             text-[#667085]
//                                                             hover:bg-gray-50
//                                                             hover:text-[#315bea]
//                                                             transition
//                                                         "
//                         >
//                           <Eye size={16} />
//                         </button>

//                         {/* EDIT */}

//                         <button
//                           title="Edit"
//                           className="
//                                                             w-[32px]
//                                                             h-[32px]
//                                                             border
//                                                             border-[#e1e5eb]
//                                                             rounded-md
//                                                             flex
//                                                             items-center
//                                                             justify-center
//                                                             text-[#667085]
//                                                             hover:bg-gray-50
//                                                             hover:text-[#315bea]
//                                                             transition
//                                                         "
//                         >
//                           <Pencil size={15} />
//                         </button>

//                         {/* MORE */}

//                         <div
//                           className="
//                                                             relative
//                                                         "
//                         >
//                           <button
//                             title="More"
//                             onClick={() =>
//                               setOpenMenu(
//                                 openMenu === product.variantId
//                                   ? null
//                                   : product.variantId,
//                               )
//                             }
//                             className="
//                                                                 w-[32px]
//                                                                 h-[32px]
//                                                                 border
//                                                                 border-[#e1e5eb]
//                                                                 rounded-md
//                                                                 flex
//                                                                 items-center
//                                                                 justify-center
//                                                                 text-[#667085]
//                                                                 hover:bg-gray-50
//                                                                 hover:text-[#315bea]
//                                                                 transition
//                                                             "
//                           >
//                             {statusLoading === product.variantId ||
//                             deleteLoading === product.productId ? (
//                               <Loader2
//                                 size={15}
//                                 className="
//                                                                         animate-spin
//                                                                     "
//                               />
//                             ) : (
//                               <MoreVertical size={16} />
//                             )}
//                           </button>

//                           {/* DROPDOWN */}

//                           {openMenu === product.variantId && (
//                             <div
//                               className="
//                                                                     absolute
//                                                                     right-0
//                                                                     top-[38px]
//                                                                     z-50
//                                                                     w-[190px]
//                                                                     bg-white
//                                                                     border
//                                                                     border-[#e3e6eb]
//                                                                     rounded-md
//                                                                     shadow-lg
//                                                                     py-1
//                                                                 "
//                             >
//                               {/* DELETE */}

//                               <button
//                                 onClick={() => handleDelete(product)}
//                                 disabled={deleteLoading === product.productId}
//                                 className="
//                                                                         w-full
//                                                                         px-3
//                                                                         py-2.5
//                                                                         flex
//                                                                         items-center
//                                                                         gap-3
//                                                                         text-left
//                                                                         text-[12px]
//                                                                         text-[#f04444]
//                                                                         hover:bg-[#fff5f5]
//                                                                     "
//                               >
//                                 <Trash2 size={15} />
//                                 Delete
//                               </button>

//                               {/* DIVIDER */}

//                               <div
//                                 className="
//                                                                         border-t
//                                                                         border-[#eef0f3]
//                                                                         my-1
//                                                                     "
//                               />

//                               {/* STATUS TITLE */}

//                               <div
//                                 className="
//                                                                         px-3
//                                                                         py-1.5
//                                                                         text-[11px]
//                                                                         font-semibold
//                                                                         text-[#98a2b3]
//                                                                     "
//                               >
//                                 Change Status
//                               </div>

//                               {/* ACTIVE */}

//                               <button
//                                 onClick={() =>
//                                   handleStatusChange(product, "active")
//                                 }
//                                 className="
//                                                                         w-full
//                                                                         px-3
//                                                                         py-2
//                                                                         flex
//                                                                         items-center
//                                                                         gap-3
//                                                                         text-left
//                                                                         text-[12px]
//                                                                         text-[#079455]
//                                                                         hover:bg-[#f0fdf7]
//                                                                     "
//                               >
//                                 <Power size={14} />
//                                 Active
//                               </button>

//                               {/* INACTIVE */}

//                               <button
//                                 onClick={() =>
//                                   handleStatusChange(product, "inactive")
//                                 }
//                                 className="
//                                                                         w-full
//                                                                         px-3
//                                                                         py-2
//                                                                         flex
//                                                                         items-center
//                                                                         gap-3
//                                                                         text-left
//                                                                         text-[12px]
//                                                                         text-[#667085]
//                                                                         hover:bg-gray-50
//                                                                     "
//                               >
//                                 <Power size={14} />
//                                 Inactive
//                               </button>

//                               {/* OUT OF STOCK */}

//                               <button
//                                 onClick={() =>
//                                   handleStatusChange(product, "out_of_stock")
//                                 }
//                                 className="
//                                                                         w-full
//                                                                         px-3
//                                                                         py-2
//                                                                         flex
//                                                                         items-center
//                                                                         gap-3
//                                                                         text-left
//                                                                         text-[12px]
//                                                                         text-[#f59e0b]
//                                                                         hover:bg-[#fffbeb]
//                                                                     "
//                               >
//                                 <TriangleAlert size={14} />
//                                 Out of Stock
//                               </button>

//                               {/* BLOCKED */}

//                               <button
//                                 onClick={() =>
//                                   handleStatusChange(product, "blocked")
//                                 }
//                                 className="
//                                                                         w-full
//                                                                         px-3
//                                                                         py-2
//                                                                         flex
//                                                                         items-center
//                                                                         gap-3
//                                                                         text-left
//                                                                         text-[12px]
//                                                                         text-[#b42318]
//                                                                         hover:bg-[#fff5f5]
//                                                                     "
//                               >
//                                 <Ban size={14} />
//                                 Blocked
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}

//               {/* EMPTY */}

//               {!loading && filteredProducts.length === 0 && (
//                 <tr>
//                   <td
//                     colSpan="9"
//                     className="
//                                                 h-[180px]
//                                                 text-center
//                                                 text-[13px]
//                                                 text-[#667085]
//                                             "
//                   >
//                     No products found.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           {/* =================================
//                         PAGINATION
//                     ================================= */}

//           <div
//             className="
//                             h-[72px]
//                             px-4
//                             flex
//                             items-center
//                             justify-between
//                         "
//           >
//             <p
//               className="
//                                 text-[12px]
//                                 text-[#475467]
//                             "
//             >
//               Showing {filteredProducts.length} products
//             </p>

//             <div
//               className="
//                                 flex
//                                 items-center
//                                 gap-2
//                             "
//             >
//               <button
//                 disabled={currentPage === 1}
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 className="
//                                     w-[36px]
//                                     h-[36px]
//                                     border
//                                     border-[#e2e5eb]
//                                     rounded-md
//                                     flex
//                                     items-center
//                                     justify-center
//                                     text-[#98a2b3]
//                                     disabled:opacity-50
//                                     hover:bg-gray-50
//                                 "
//               >
//                 <ChevronLeft size={16} />
//               </button>

//               <button
//                 className="
//                                     w-[36px]
//                                     h-[36px]
//                                     rounded-md
//                                     text-[12px]
//                                     font-medium
//                                     bg-[#eef3ff]
//                                     text-[#315bea]
//                                     border
//                                     border-[#dbe4ff]
//                                 "
//               >
//                 1
//               </button>

//               <button
//                 onClick={() => setCurrentPage((prev) => prev + 1)}
//                 className="
//                                     w-[36px]
//                                     h-[36px]
//                                     border
//                                     border-[#e2e5eb]
//                                     rounded-md
//                                     flex
//                                     items-center
//                                     justify-center
//                                     text-[#475467]
//                                     hover:bg-gray-50
//                                 "
//               >
//                 <ChevronRight size={16} />
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {showProductDialog && (
//         <div
//           className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4"
//           onClick={() => {
//             setShowProductDialog(false);
//             setSelectedProduct(null);
//           }}
//         >
//           <div
//             className="w-full max-w-5xl max-h-[90vh] overflow-hidden bg-white rounded-xl shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* ================= HEADER ================= */}
//             <div className="h-[64px] px-6 border-b border-[#e5e7eb] flex items-center justify-between">
//               <div>
//                 <h2 className="text-[16px] font-semibold text-[#171c2b]">
//                   Product Details
//                 </h2>

//                 {selectedProduct && (
//                   <p className="text-[11px] text-[#667085] mt-1">
//                     SKU:{" "}
//                     {selectedProduct.variants?.[0]?.sku || "N/A"}
//                   </p>
//                 )}
//               </div>

//               <button
//                 onClick={() => {
//                   setShowProductDialog(false);
//                   setSelectedProduct(null);
//                 }}
//                 className="w-[34px] h-[34px] rounded-md flex items-center justify-center text-[#667085] hover:bg-gray-100 transition"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             {/* ================= BODY ================= */}
//             <div className="max-h-[calc(90vh-64px)] overflow-y-auto">
//               {loadingProduct ? (
//                 <div className="h-[400px] flex flex-col items-center justify-center">
//                   <Loader2
//                     size={28}
//                     className="animate-spin text-[#315bea]"
//                   />

//                   <p className="mt-3 text-[13px] text-[#667085]">
//                     Loading product details...
//                   </p>
//                 </div>
//               ) : selectedProduct ? (
//                 <ProductPreview product={selectedProduct} />
//               ) : (
//                 <div className="h-[300px] flex items-center justify-center">
//                   <p className="text-[13px] text-[#667085]">
//                     Failed to load product.
//                   </p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllProducts;

import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Edit3,
  Trash2,
  Package,
  Image as ImageIcon,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import { getMyProducts } from "../services/productEditApi";
import { useNavigate } from "react-router-dom";

function AllProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  // product accordion
  const [expandedProduct, setExpandedProduct] = useState(null);

  // selected product for view dialog
  const [selectedProduct, setSelectedProduct] = useState(null);

  // selected variant inside dialog
  const [selectedVariant, setSelectedVariant] = useState(null);

  // --------------------------------------------------
  // FETCH PRODUCTS
  // --------------------------------------------------

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProducts();

      if (data?.success) {
        setProducts(data.products || []);
      } else {
        setProducts([]);
        setError(data?.message || "Failed to load products");
      }
    } catch (err) {
      console.error("GET PRODUCTS ERROR:", err);

      setError(
        err.response?.data?.message || err.message || "Failed to load products",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase().trim();

    if (!query) return true;

    return (
      product.title?.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.slug?.toLowerCase().includes(query) ||
      product.variants?.some((variant) =>
        variant.sku?.toLowerCase().includes(query),
      )
    );
  });

  // --------------------------------------------------
  // PRODUCT ACCORDION
  // --------------------------------------------------

  const toggleProduct = (productId) => {
    setExpandedProduct((prev) => (prev === productId ? null : productId));
  };

  // --------------------------------------------------
  // OPEN VIEW DIALOG
  // --------------------------------------------------

  const openProductDialog = (product) => {
    setSelectedProduct(product);

    const defaultVariant =
      product.variants?.find(
        (variant) => variant._id === product.defaultVariant,
      ) || product.variants?.[0];

    setSelectedVariant(defaultVariant || null);
  };

  // --------------------------------------------------
  // CLOSE DIALOG
  // --------------------------------------------------

  const closeProductDialog = () => {
    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  // --------------------------------------------------
  // IMAGE URL FIX
  // --------------------------------------------------

  const getImageUrl = (url) => {
    if (!url) return "";

    // If backend accidentally sends markdown URL
    const markdownMatch = url.match(/^\[(.*?)\]\((.*?)\)$/);

    if (markdownMatch) {
      return markdownMatch[2];
    }

    return url;
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Loading products...
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage your products and variants
          </p>
        </div>

        <button
          onClick={fetchProducts}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* ========================================= */}
      {/* SEARCH */}
      {/* ========================================= */}

      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

        <input
          type="text"
          placeholder="Search product, brand or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/10"
        />
      </div>

      {/* ========================================= */}
      {/* ERROR */}
      {/* ========================================= */}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
          {error}
        </div>
      )}

      {/* ========================================= */}
      {/* EMPTY */}
      {/* ========================================= */}

      {!error && filteredProducts.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />

          <h3 className="text-lg font-semibold text-gray-700">
            No products found
          </h3>

          <p className="text-sm text-gray-400 mt-1">Try another search</p>
        </div>
      )}

      {/* ========================================= */}
      {/* PRODUCTS */}
      {/* ========================================= */}

      <div className="space-y-4">
        {filteredProducts.map((product) => {
          const isExpanded = expandedProduct === product._id;

          const primaryImage =
            product.variants?.[0]?.images?.find((img) => img.isPrimary)?.url ||
            product.variants?.[0]?.images?.[0]?.url;

          return (
            <div
              key={product._id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden"
            >
              {/* ================================= */}
              {/* PRODUCT HEADER */}
              {/* ================================= */}

              <div className="p-4 flex flex-col lg:flex-row lg:items-center gap-4">
                {/* IMAGE */}

                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                  {primaryImage ? (
                    <img
                      src={getImageUrl(primaryImage)}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-7 h-7 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* INFO */}

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-semibold text-gray-900 truncate">
                      {product.title}
                    </h2>

                    <StatusBadge status={product.status} />
                  </div>

                  <p className="text-sm text-gray-500">
                    Brand:{" "}
                    <span className="font-medium text-gray-700">
                      {product.brand}
                    </span>
                  </p>

                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                    <span>{product.category?.name}</span>

                    <span>{product.variantCount || 0} Variants</span>

                    <span>
                      {product.isPublished ? "Published" : "Unpublished"}
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}

                <div className="flex items-center gap-2">
                  {/* VIEW */}

                  <button
                    onClick={() => openProductDialog(product)}
                    title="View Product"
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* EDIT */}

                  <button
                    title="Edit Product"
                    onClick={() =>
                      navigate(`/seller/products/edit/${product._id}`)
                    }
                    className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* DELETE */}

                  <button
                    title="Delete Product"
                    className="w-10 h-10 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* ACCORDION */}

                  <button
                    onClick={() => toggleProduct(product._id)}
                    title="Show Variants"
                    className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* ================================= */}
              {/* VARIANTS DROPDOWN */}
              {/* ================================= */}

              {isExpanded && (
                <div className="border-t border-gray-200 bg-gray-50 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Product Variants
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        {product.variants?.length || 0} variants
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {product.variants?.map((variant) => {
                      const image =
                        variant.images?.find((img) => img.isPrimary)?.url ||
                        variant.images?.[0]?.url;

                      return (
                        <VariantRow
                          key={variant._id}
                          variant={variant}
                          image={image}
                          getImageUrl={getImageUrl}
                          onView={() => {
                            setSelectedProduct(product);
                            setSelectedVariant(variant);
                          }}
                          onEdit={() =>
                            navigate(
                              `/seller/products/${product._id}/variants/${variant._id}/edit`,
                            )
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ========================================= */}
      {/* PRODUCT DIALOG */}
      {/* ========================================= */}

      {selectedProduct && (
        <ProductDialog
          product={selectedProduct}
          selectedVariant={selectedVariant}
          setSelectedVariant={setSelectedVariant}
          onClose={closeProductDialog}
          getImageUrl={getImageUrl}
        />
      )}
    </div>
  );
}

export default AllProducts;

function StatusBadge({ status }) {
  const styles = {
    active: "bg-green-50 text-green-600 border-green-200",

    inactive: "bg-gray-100 text-gray-600 border-gray-200",

    blocked: "bg-red-50 text-red-600 border-red-200",

    draft: "bg-yellow-50 text-yellow-600 border-yellow-200",

    deleted: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <span
      className={`text-xs px-2 py-1 rounded-full border ${
        styles[status] || "bg-gray-100 text-gray-600 border-gray-200"
      }`}
    >
      {status || "unknown"}
    </span>
  );
}

function VariantRow({ variant, image, getImageUrl, onView, onEdit }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* IMAGE */}

        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden shrink-0">
          {image ? (
            <img
              src={getImageUrl(image)}
              alt={variant.variantName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-gray-300" />
            </div>
          )}
        </div>

        {/* VARIANT INFO */}

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-medium text-gray-900">{variant.variantName}</h4>

            <StatusBadge status={variant.status} />

            {variant.isDefault && (
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                Default
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-xs text-gray-500">
            <span>
              SKU: <strong className="text-gray-700">{variant.sku}</strong>
            </span>

            <span>
              Price:{" "}
              <strong className="text-gray-700">
                ₹{variant.pricing?.sellingPrice}
              </strong>
            </span>

            <span>
              Stock:{" "}
              <strong
                className={
                  variant.inventory?.stock <= variant.inventory?.lowStockAlert
                    ? "text-orange-600"
                    : "text-green-600"
                }
              >
                {variant.inventory?.stock}
              </strong>
            </span>
          </div>
        </div>

        {/* ACTION */}

        <div className="flex items-center gap-2">
          <button
            onClick={onView}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
          >
            <Eye className="w-4 h-4" />
            View
          </button>

          <button
            onClick={onEdit}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-black text-white hover:bg-gray-800 text-sm"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductDialog({
  product,
  selectedVariant,
  setSelectedVariant,
  onClose,
  getImageUrl,
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white w-full max-w-6xl max-h-[92vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* ======================================= */}
        {/* HEADER */}
        {/* ======================================= */}

        <div className="px-6 py-4 border-b flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Product Details</h2>

            <p className="text-xs text-gray-500 mt-1">{product.title}</p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ======================================= */}
        {/* BODY */}
        {/* ======================================= */}

        <div className="overflow-y-auto p-6">
          {/* ===================================== */}
          {/* PRODUCT BASIC INFO */}
          {/* ===================================== */}

          <section className="mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* PRODUCT IMAGE */}

              <div className="w-full lg:w-64 h-64 bg-gray-100 rounded-xl overflow-hidden">
                {product.variants?.[0]?.images?.[0]?.url ? (
                  <img
                    src={getImageUrl(product.variants[0].images[0].url)}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-10 h-10 text-gray-300" />
                  </div>
                )}
              </div>

              {/* PRODUCT DETAILS */}

              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <StatusBadge status={product.status} />

                  {product.isPublished && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-200">
                      Published
                    </span>
                  )}
                </div>

                <h1 className="text-2xl font-bold text-gray-900">
                  {product.title}
                </h1>

                <p className="text-sm text-gray-500 mt-2">
                  {product.shortDescription}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <InfoBox label="Brand" value={product.brand} />

                  <InfoBox label="Category" value={product.category?.name} />

                  <InfoBox
                    label="Sub Category"
                    value={product.subCategory?.name}
                  />

                  <InfoBox label="Variants" value={product.variantCount} />
                </div>
              </div>
            </div>
          </section>

          {/* ===================================== */}
          {/* VARIANT SELECTOR */}
          {/* ===================================== */}

          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">Variants</h3>

                <p className="text-sm text-gray-500">
                  Select a variant to view its details
                </p>
              </div>

              <span className="text-sm text-gray-500">
                {product.variants?.length || 0} total
              </span>
            </div>

            {/* VARIANT DROPDOWN */}

            <select
              value={selectedVariant?._id || ""}
              onChange={(e) => {
                const variant = product.variants.find(
                  (v) => v._id === e.target.value,
                );

                setSelectedVariant(variant || null);
              }}
              className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-black/10 mb-6"
            >
              {product.variants?.map((variant) => (
                <option key={variant._id} value={variant._id}>
                  {variant.variantName} — ₹{variant.pricing?.sellingPrice}
                </option>
              ))}
            </select>

            {/* ================================= */}
            {/* SELECTED VARIANT */}
            {/* ================================= */}

            {selectedVariant && (
              <VariantDetails
                variant={selectedVariant}
                getImageUrl={getImageUrl}
              />
            )}
          </section>

          {/* ===================================== */}
          {/* PRODUCT DESCRIPTION */}
          {/* ===================================== */}

          <section className="mt-8">
            <h3 className="text-lg font-bold mb-3">Description</h3>

            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-6">
              {product.description || "No description available"}
            </div>
          </section>

          {/* ===================================== */}
          {/* HIGHLIGHTS */}
          {/* ===================================== */}

          <section className="mt-8">
            <h3 className="text-lg font-bold mb-3">Highlights</h3>

            <div className="grid md:grid-cols-2 gap-2">
              {product.highlights?.map((highlight, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg text-sm">
                  • {highlight}
                </div>
              ))}
            </div>
          </section>

          {/* ===================================== */}
          {/* SERVICES */}
          {/* ===================================== */}

          <section className="mt-8">
            <h3 className="text-lg font-bold mb-3">Services</h3>

            <div className="grid md:grid-cols-3 gap-4">
              <InfoBox
                label="Return"
                value={
                  product.services?.returnPolicy?.returnable
                    ? `${product.services.returnPolicy.returnDays} Days`
                    : "Not Available"
                }
              />

              <InfoBox
                label="Cash On Delivery"
                value={
                  product.services?.cashOnDelivery?.available
                    ? "Available"
                    : "Not Available"
                }
              />

              <InfoBox
                label="Warranty"
                value={
                  product.services?.warranty?.available
                    ? `${product.services.warranty.duration} Year`
                    : "Not Available"
                }
              />
            </div>
          </section>
        </div>

        {/* ======================================= */}
        {/* FOOTER */}
        {/* ======================================= */}

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-100"
          >
            Close
          </button>

          <button className="px-5 py-2.5 rounded-lg bg-black text-white hover:bg-gray-800 flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
}

function VariantDetails({ variant, getImageUrl }) {
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      {/* ========================================= */}
      {/* VARIANT HEADER */}
      {/* ========================================= */}

      <div className="p-5 bg-gray-50 border-b">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <div className="flex flex-wrap gap-2 items-center">
              <h4 className="text-lg font-bold">{variant.variantName}</h4>

              <StatusBadge status={variant.status} />

              {variant.isDefault && (
                <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                  Default
                </span>
              )}
            </div>

            <p className="text-sm text-gray-500 mt-1">SKU: {variant.sku}</p>
          </div>

          <div className="text-xl font-bold">
            ₹{variant.pricing?.sellingPrice}
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* VARIANT BODY */}
      {/* ========================================= */}

      <div className="p-5">
        {/* IMAGES */}

        <div className="mb-7">
          <h5 className="font-semibold mb-3">Images</h5>

          <div className="flex gap-3 overflow-x-auto">
            {variant.images?.map((image, index) => (
              <div
                key={index}
                className="w-28 h-28 shrink-0 rounded-lg border overflow-hidden bg-gray-100"
              >
                <img
                  src={getImageUrl(image.url)}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ATTRIBUTES */}

        <div className="mb-7">
          <h5 className="font-semibold mb-3">Attributes</h5>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {variant.attributes?.map((attribute, index) => (
              <InfoBox
                key={index}
                label={attribute.name}
                value={attribute.value}
              />
            ))}
          </div>
        </div>

        {/* PRICING */}

        <div className="mb-7">
          <h5 className="font-semibold mb-3">Pricing</h5>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <InfoBox label="MRP" value={`₹${variant.pricing?.mrp}`} />

            <InfoBox
              label="Selling Price"
              value={`₹${variant.pricing?.sellingPrice}`}
            />

            <InfoBox
              label="Cost Price"
              value={`₹${variant.pricing?.costPrice}`}
            />

            <InfoBox label="Discount" value={`${variant.pricing?.discount}%`} />
          </div>
        </div>

        {/* INVENTORY */}

        <div className="mb-7">
          <h5 className="font-semibold mb-3">Inventory</h5>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <InfoBox label="Stock" value={variant.inventory?.stock} />

            <InfoBox label="Reserved" value={variant.inventory?.reserved} />

            <InfoBox
              label="Low Stock Alert"
              value={variant.inventory?.lowStockAlert}
            />
          </div>
        </div>

        {/* SHIPPING */}

        <div>
          <h5 className="font-semibold mb-3">Shipping</h5>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <InfoBox label="Weight" value={`${variant.shipping?.weight} kg`} />

            <InfoBox
              label="Length"
              value={`${variant.shipping?.dimensions?.length} cm`}
            />

            <InfoBox
              label="Breadth"
              value={`${variant.shipping?.dimensions?.breadth} cm`}
            />

            <InfoBox
              label="Height"
              value={`${variant.shipping?.dimensions?.height} cm`}
            />
          </div>
        </div>

        {/* SPECIFICATIONS */}

        {variant.specifications?.length > 0 && (
          <div className="mt-7">
            <h5 className="font-semibold mb-3">Specifications</h5>

            <div className="space-y-4">
              {variant.specifications.map((group, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="px-4 py-3 bg-gray-50 font-medium">
                    {group.group}
                  </div>

                  <div className="divide-y">
                    {group.fields?.map((field, fieldIndex) => (
                      <div
                        key={fieldIndex}
                        className="flex justify-between gap-4 px-4 py-3 text-sm"
                      >
                        <span className="text-gray-500">{field.key}</span>

                        <span className="font-medium text-right">
                          {field.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-400 mb-1">{label}</p>

      <p className="text-sm font-medium text-gray-800 break-words">
        {value ?? "-"}
      </p>
    </div>
  );
}
