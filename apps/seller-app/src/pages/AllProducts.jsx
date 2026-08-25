import React, { useState } from "react";
import {
  Plus,
  Search,
  ChevronDown,
  SlidersHorizontal,
  RotateCcw,
  Package,
  CheckCircle2,
  TriangleAlert,
  FileText,
  Eye,
  Pencil,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "iPhone 14 Pro Max",
    subtitle: "256GB, Deep Purple",
    sku: "IPH14PM256DP",
    category: "Mobiles",
    price: "₹1,39,900",
    stock: 25,
    status: "Active",
    date: "20 May 2024",
    image:
      "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=100&h=100&fit=crop",
  },
  {
    id: 2,
    name: "Nike Air Max 270",
    subtitle: "Men's Running Shoes",
    sku: "NKAM270BK10",
    category: "Footwear",
    price: "₹8,999",
    stock: 0,
    status: "Out of Stock",
    date: "18 May 2024",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
  },
  {
    id: 3,
    name: "boAt Rockerz 450",
    subtitle: "Wireless Headphones",
    sku: "BOAT450BK",
    category: "Electronics",
    price: "₹1,499",
    stock: 60,
    status: "Active",
    date: "15 May 2024",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
  },
  {
    id: 4,
    name: "Fastrack Analog Watch",
    subtitle: "Men's Watch",
    sku: "FTASW1001",
    category: "Watches",
    price: "₹1,995",
    stock: 15,
    status: "Low Stock",
    date: "12 May 2024",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=100&h=100&fit=crop",
  },
  {
    id: 5,
    name: "Wildcraft Backpack",
    subtitle: "45L, Travel Backpack",
    sku: "WCBP45BK",
    category: "Bags",
    price: "₹2,199",
    stock: 30,
    status: "Active",
    date: "10 May 2024",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop",
  },
  {
    id: 6,
    name: "HP Pavilion Laptop",
    subtitle: "16GB RAM, 512GB SSD",
    sku: "HPPAV16GB512",
    category: "Laptops",
    price: "₹56,990",
    stock: 7,
    status: "Low Stock",
    date: "08 May 2024",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop",
  },
  {
    id: 7,
    name: "U.S. Polo Assn. T-Shirt",
    subtitle: "Men's T-Shirt",
    sku: "USPOTSHBKXL",
    category: "Clothing",
    price: "₹899",
    stock: 100,
    status: "Active",
    date: "05 May 2024",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop",
  },
];

const stats = [
  {
    title: "Total Products",
    value: "245",
    change: "12%",
    text: "this month",
    type: "up",
    icon: Package,
    iconStyle: "bg-[#eef2ff] text-[#315bea]",
  },
  {
    title: "Active Products",
    value: "210",
    change: "8%",
    text: "this month",
    type: "up",
    icon: CheckCircle2,
    iconStyle: "bg-[#ecfdf5] text-[#10b981]",
  },
  {
    title: "Out of Stock",
    value: "12",
    change: "5%",
    text: "this month",
    type: "down",
    icon: TriangleAlert,
    iconStyle: "bg-[#fff7e8] text-[#f59e0b]",
  },
  {
    title: "Draft Products",
    value: "23",
    change: "3%",
    text: "this month",
    type: "up",
    icon: FileText,
    iconStyle: "bg-[#faf0ff] text-[#a855f7]",
  },
];

const FilterButton = ({ children }) => {
  return (
    <button className="h-[38px] min-w-[140px] px-4 rounded-md border border-[#e2e5eb] bg-white flex items-center justify-between gap-4 text-[13px] text-[#202737] hover:bg-gray-50 transition">
      <span>{children}</span>
      <ChevronDown size={15} className="text-[#647084]" />
    </button>
  );
};

const StatusBadge = ({ status }) => {
  const styles = {
    Active: "bg-[#dcf7eb] text-[#079455]",
    "Out of Stock": "bg-[#ffe1e1] text-[#f04444]",
    "Low Stock": "bg-[#fff0dc] text-[#ee8a00]",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-[12px] font-medium whitespace-nowrap ${
        styles[status]
      }`}
    >
      {status}
    </span>
  );
};

const AllProducts = () => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = products.filter((product) => {
    const value = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(value) ||
      product.sku.toLowerCase().includes(value) ||
      product.category.toLowerCase().includes(value)
    );
  });

  return (
    <div className="min-h-screen bg-white text-[#171c2b]">
      <div className="w-full px-6 py-6">

        {/* ================= HEADER ================= */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-[22px] font-semibold tracking-[-0.3px]">
              Products
            </h1>

            <p className="mt-1 text-[13px] text-[#667085]">
              Manage your all products here. You can add, edit and manage
              products.
            </p>
          </div>

          <button className="h-[36px] px-4 rounded-md bg-[#315bea] hover:bg-[#244bd0] text-white text-[13px] font-medium flex items-center gap-2 shadow-sm transition">
            <Plus size={17} strokeWidth={2.2} />
            Add Product
          </button>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-7">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="h-[106px] border border-[#e3e6eb] rounded-md px-5 py-4 bg-white"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[12px] text-[#596273]">
                      {item.title}
                    </p>

                    <h2 className="mt-2 text-[23px] leading-none font-semibold text-[#161c2b]">
                      {item.value}
                    </h2>
                  </div>

                  <div
                    className={`w-[44px] h-[44px] rounded-xl flex items-center justify-center ${item.iconStyle}`}
                  >
                    <Icon size={20} strokeWidth={1.8} />
                  </div>
                </div>

                <div className="flex items-center gap-1 mt-3 text-[12px]">
                  <span
                    className={
                      item.type === "down"
                        ? "text-[#f04444]"
                        : "text-[#08a66a]"
                    }
                  >
                    {item.type === "down" ? "↓" : "↑"} {item.change}
                  </span>

                  <span className="text-[#667085]">{item.text}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= FILTER AREA ================= */}
        <div className="border border-[#e3e6eb] rounded-md px-4 py-3 mb-0">
          <div className="flex flex-wrap xl:flex-nowrap items-center gap-3">

            {/* Search */}
            <div className="relative w-full xl:w-[325px]">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#87909f]"
              />

              <input
                type="text"
                placeholder="Search products by name, SKU, category..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-[38px] pl-10 pr-3 rounded-md bg-[#f7f8fa] border border-transparent focus:border-[#315bea] focus:bg-white outline-none text-[12px] text-[#252b38] placeholder:text-[#8992a3]"
              />
            </div>

            <FilterButton>Category</FilterButton>
            <FilterButton>Status</FilterButton>
            <FilterButton>Stock</FilterButton>

            <div className="flex items-center gap-3 xl:ml-auto">
              <button className="h-[38px] px-4 rounded-md bg-[#f8f9fb] hover:bg-gray-100 flex items-center gap-2 text-[13px] font-medium transition">
                <SlidersHorizontal size={15} />
                Filters
              </button>

              <button className="h-[38px] px-4 rounded-md border border-[#e2e5eb] hover:bg-gray-50 flex items-center gap-2 text-[13px] font-medium transition">
                <RotateCcw size={14} />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="border-x border-b border-[#e3e6eb] rounded-b-md overflow-x-auto">
          <table className="w-full min-w-[1050px] border-collapse">

            {/* Table Header */}
            <thead>
              <tr className="h-[57px] border-b border-[#e6e8ec] text-left">
                <th className="w-[48px] px-4">
                  <input
                    type="checkbox"
                    className="w-[14px] h-[14px] accent-[#315bea]"
                  />
                </th>

                <th className="px-3 text-[12px] font-semibold text-[#4d5668]">
                  Product
                </th>

                <th className="px-3 text-[12px] font-semibold text-[#4d5668]">
                  SKU
                </th>

                <th className="px-3 text-[12px] font-semibold text-[#4d5668]">
                  Category
                </th>

                <th className="px-3 text-[12px] font-semibold text-[#4d5668]">
                  Price
                </th>

                <th className="px-3 text-[12px] font-semibold text-[#4d5668]">
                  Stock
                </th>

                <th className="px-3 text-[12px] font-semibold text-[#4d5668]">
                  Status
                </th>

                <th className="px-3 text-[12px] font-semibold text-[#4d5668]">
                  Added On
                </th>

                <th className="px-3 text-[12px] font-semibold text-[#4d5668]">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="h-[71px] border-b border-[#e7e9ed] last:border-b-0 hover:bg-[#fafbfc] transition"
                >
                  {/* Checkbox */}
                  <td className="px-4">
                    <input
                      type="checkbox"
                      className="w-[14px] h-[14px] accent-[#315bea]"
                    />
                  </td>

                  {/* Product */}
                  <td className="px-3">
                    <div className="flex items-center gap-4">
                      <div className="w-[48px] h-[48px] rounded-md border border-[#e3e6eb] bg-white overflow-hidden flex items-center justify-center flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </div>

                      <div>
                        <p className="text-[13px] font-semibold text-[#151b29]">
                          {product.name}
                        </p>

                        <p className="mt-1 text-[12px] text-[#657083]">
                          {product.subtitle}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* SKU */}
                  <td className="px-3 text-[12px] text-[#3f4859]">
                    {product.sku}
                  </td>

                  {/* Category */}
                  <td className="px-3 text-[12px] text-[#3f4859]">
                    {product.category}
                  </td>

                  {/* Price */}
                  <td className="px-3 text-[12px] text-[#252c3b] font-medium">
                    {product.price}
                  </td>

                  {/* Stock */}
                  <td className="px-3">
                    <span
                      className={`text-[12px] font-medium ${
                        product.stock === 0
                          ? "text-[#f04444]"
                          : product.stock <= 15
                          ? "text-[#f59e0b]"
                          : "text-[#079455]"
                      }`}
                    >
                      {product.stock}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-3">
                    <StatusBadge status={product.status} />
                  </td>

                  {/* Date */}
                  <td className="px-3 text-[12px] text-[#3f4859] whitespace-nowrap">
                    {product.date}
                  </td>

                  {/* Actions */}
                  <td className="px-3">
                    <div className="flex items-center gap-2">

                      <button
                        title="View"
                        className="w-[32px] h-[32px] border border-[#e1e5eb] rounded-md flex items-center justify-center text-[#667085] hover:bg-gray-50 hover:text-[#315bea] transition"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        title="Edit"
                        className="w-[32px] h-[32px] border border-[#e1e5eb] rounded-md flex items-center justify-center text-[#667085] hover:bg-gray-50 hover:text-[#315bea] transition"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        title="More"
                        className="w-[32px] h-[32px] border border-[#e1e5eb] rounded-md flex items-center justify-center text-[#667085] hover:bg-gray-50 hover:text-[#315bea] transition"
                      >
                        <MoreVertical size={16} />
                      </button>

                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan="9"
                    className="h-[180px] text-center text-[13px] text-[#667085]"
                  >
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ================= PAGINATION ================= */}
          <div className="h-[72px] px-4 flex items-center justify-between">

            <p className="text-[12px] text-[#475467]">
              Showing 1 to {filteredProducts.length} of 245 products
            </p>

            <div className="flex items-center gap-2">

              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                className="w-[36px] h-[36px] border border-[#e2e5eb] rounded-md flex items-center justify-center text-[#98a2b3] disabled:opacity-50 hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
              </button>

              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-[36px] h-[36px] rounded-md text-[12px] font-medium ${
                    currentPage === page
                      ? "bg-[#eef3ff] text-[#315bea] border border-[#dbe4ff]"
                      : "text-[#344054] hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ))}

              <span className="px-1 text-[#667085] text-[13px]">...</span>

              <button
                onClick={() => setCurrentPage(25)}
                className={`w-[36px] h-[36px] rounded-md text-[12px] font-medium ${
                  currentPage === 25
                    ? "bg-[#eef3ff] text-[#315bea]"
                    : "text-[#344054] hover:bg-gray-50"
                }`}
              >
                25
              </button>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, 25))
                }
                className="w-[36px] h-[36px] border border-[#e2e5eb] rounded-md flex items-center justify-center text-[#475467] hover:bg-gray-50"
              >
                <ChevronRight size={16} />
              </button>

              <button className="ml-8 h-[36px] min-w-[110px] px-3 border border-[#e2e5eb] rounded-md flex items-center justify-between text-[12px] text-[#344054] hover:bg-gray-50">
                10 / page
                <ChevronDown size={14} />
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AllProducts;