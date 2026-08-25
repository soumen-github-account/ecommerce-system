import React, { useState } from "react";
import {
  Download,
  Plus,
  ChevronDown,
  Search,
  Info,
  Database,
  Package,
  TriangleAlert,
  PackageX,
  Clock3,
  Pencil,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Upload,
  RefreshCcw,
  FileText,
  Boxes,
  ClipboardList,
  Lightbulb,
  Eye,
} from "lucide-react";

const inventoryData = [
  {
    id: 1,
    name: "iPhone 14 Pro Max (256GB)",
    type: "Smartphones",
    sku: "IPH14PM256DP",
    fsn: "FSN: MBG7H4YZK3",
    warehouse: "Chennai",
    location: "Primary",
    stock: 45,
    reserved: 10,
    incoming: 20,
    incomingDate: "15 May",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=80&h=80&fit=crop",
  },
  {
    id: 2,
    name: "Nike Air Max 270",
    type: "Footwear",
    sku: "NKAM270BK10",
    fsn: "FSN: FOTG5H8J2K1L",
    warehouse: "Bangalore",
    location: "Primary",
    stock: 5,
    reserved: 3,
    incoming: 10,
    incomingDate: "20 May",
    status: "Low Stock",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop",
  },
  {
    id: 3,
    name: "boAt Rockerz 450",
    type: "Electronics",
    sku: "BOAT450BK",
    fsn: "FSN: ELEH2J6K5L8M",
    warehouse: "Mumbai",
    location: "Primary",
    stock: 0,
    reserved: 2,
    incoming: 0,
    incomingDate: "",
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=80&h=80&fit=crop",
  },
  {
    id: 4,
    name: "HP Pavilion Laptop",
    type: "Laptops",
    sku: "HPPAV15I512GB",
    fsn: "FSN: LPTG1H5J7K9N",
    warehouse: "Delhi",
    location: "Secondary",
    stock: 12,
    reserved: 4,
    incoming: 5,
    incomingDate: "18 May",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=80&h=80&fit=crop",
  },
  {
    id: 5,
    name: "Puma Men's Sneakers",
    type: "Footwear",
    sku: "PUMA1234WH",
    fsn: "FSN: FOTG9H1J3K5P",
    warehouse: "Hyderabad",
    location: "Primary",
    stock: 3,
    reserved: 1,
    incoming: 8,
    incomingDate: "25 May",
    status: "Stock Out Soon",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop",
  },
];

const stockAlerts = [
  {
    name: "Noise ColorFit Pro 4",
    sku: "NOISECFP4BK",
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=60&h=60&fit=crop",
  },
  {
    name: "boAt Rockerz 450",
    sku: "BOAT450BK",
    status: "Low Stock (5)",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60&h=60&fit=crop",
  },
  {
    name: "ASUS VivoBook 15",
    sku: "ASUSVIVO15",
    status: "Stock Out Soon",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=60&h=60&fit=crop",
  },
  {
    name: "Puma Men's Sneakers",
    sku: "PUMA1234WH",
    status: "Out of Stock",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=60&h=60&fit=crop",
  },
  {
    name: "Samsung Galaxy M14",
    sku: "SAMM14BL",
    status: "Low Stock (3)",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=60&h=60&fit=crop",
  },
];

const stats = [
  {
    title: "Total Inventory Value",
    value: "₹18,74,532",
    change: "12.5%",
    description: "vs last 7 days",
    icon: Database,
    iconBg: "bg-[#eaf8f0]",
    iconColor: "text-[#35a96c]",
    changeColor: "text-[#12a968]",
    arrow: "↑",
  },
  {
    title: "Total Units in Stock",
    value: "12,542",
    change: "8.7%",
    description: "vs last 7 days",
    icon: Package,
    iconBg: "bg-[#f6ecff]",
    iconColor: "text-[#a45ce6]",
    changeColor: "text-[#12a968]",
    arrow: "↑",
  },
  {
    title: "Low Stock Items",
    value: "34",
    change: "6",
    description: "vs yesterday",
    icon: TriangleAlert,
    iconBg: "bg-[#fff6df]",
    iconColor: "text-[#f3a51b]",
    changeColor: "text-[#ef4444]",
    arrow: "↑",
  },
  {
    title: "Out of Stock Items",
    value: "12",
    change: "2",
    description: "vs yesterday",
    icon: PackageX,
    iconBg: "bg-[#fff0f0]",
    iconColor: "text-[#ef4444]",
    changeColor: "text-[#ef4444]",
    arrow: "↓",
  },
  {
    title: "Stock Out Soon",
    value: "56",
    change: "8",
    description: "vs yesterday",
    icon: Clock3,
    iconBg: "bg-[#fff5e7]",
    iconColor: "text-[#f59e0b]",
    changeColor: "text-[#f59e0b]",
    arrow: "↑",
  },
];

const statusClass = {
  Active: "bg-[#dcf7e8] text-[#079455]",
  "Low Stock": "bg-[#fff0d9] text-[#e98b00]",
  "Out of Stock": "bg-[#ffe1e1] text-[#f04444]",
  "Stock Out Soon": "bg-[#fff0d9] text-[#e98b00]",
};

const alertClass = {
  "Out of Stock": "bg-[#ffe1e1] text-[#f04444]",
  "Low Stock (5)": "bg-[#fff0d9] text-[#e98b00]",
  "Low Stock (3)": "bg-[#fff0d9] text-[#e98b00]",
  "Stock Out Soon": "bg-[#fff0d9] text-[#e98b00]",
};

const SelectBox = ({ children, width = "162px" }) => {
  return (
    <button
      style={{ width }}
      className="h-[32px] px-3 border border-[#e1e6ed] bg-white rounded-md flex items-center justify-between text-[11px] text-[#344054] hover:bg-gray-50"
    >
      <span>{children}</span>
      <ChevronDown size={13} className="text-[#667085]" />
    </button>
  );
};

const TrendChart = () => {
  return (
    <div className="relative h-[180px] w-full mt-3">

      {/* horizontal grid */}
      <div className="absolute left-[42px] right-0 top-[8px] border-t border-[#edf0f4]" />
      <div className="absolute left-[42px] right-0 top-[48px] border-t border-[#edf0f4]" />
      <div className="absolute left-[42px] right-0 top-[88px] border-t border-[#edf0f4]" />
      <div className="absolute left-[42px] right-0 top-[128px] border-t border-[#edf0f4]" />
      <div className="absolute left-[42px] right-0 top-[168px] border-t border-[#edf0f4]" />

      {/* y-axis */}
      <div className="absolute left-0 top-0 h-full text-[9px] text-[#667085]">
        <span className="absolute top-[2px]">20K</span>
        <span className="absolute top-[42px]">15K</span>
        <span className="absolute top-[82px]">10K</span>
        <span className="absolute top-[122px]">5K</span>
        <span className="absolute top-[162px]">0</span>
      </div>

      <svg
        viewBox="0 0 650 180"
        className="absolute left-[42px] right-0 top-0 w-[calc(100%-42px)] h-[180px]"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563eb" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="
            M 0 78
            L 38 80
            L 76 62
            L 114 69
            L 152 74
            L 190 83
            L 228 58
            L 266 68
            L 304 75
            L 342 77
            L 380 64
            L 418 68
            L 456 82
            L 494 68
            L 532 61
            L 570 57
            L 610 55
            L 650 48
          "
          fill="none"
          stroke="#2563eb"
          strokeWidth="2.2"
        />

        <path
          d="
            M 0 78
            L 38 80
            L 76 62
            L 114 69
            L 152 74
            L 190 83
            L 228 58
            L 266 68
            L 304 75
            L 342 77
            L 380 64
            L 418 68
            L 456 82
            L 494 68
            L 532 61
            L 570 57
            L 610 55
            L 650 48
            L 650 180
            L 0 180
            Z
          "
          fill="url(#chartFill)"
        />

        <circle cx="418" cy="68" r="4" fill="#2563eb" />
        <circle cx="418" cy="68" r="8" fill="#2563eb" opacity="0.12" />
      </svg>

      {/* tooltip */}
      <div className="absolute left-[58%] top-[12px] bg-white rounded-lg border border-[#e5e7eb] shadow-[0_3px_15px_rgba(0,0,0,0.08)] px-3 py-2 z-10">
        <p className="text-[10px] font-semibold text-[#344054]">
          10 May 2024
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span className="w-[6px] h-[6px] rounded-full bg-[#2563eb]" />
          <span className="text-[9px] text-[#667085]">Units in Stock</span>
          <span className="text-[10px] font-semibold">12,450</span>
        </div>
      </div>

      {/* x axis */}
      <div className="absolute left-[42px] right-0 bottom-[-5px] flex justify-between text-[9px] text-[#667085]">
        <span>06 May</span>
        <span>07 May</span>
        <span>08 May</span>
        <span>09 May</span>
        <span>10 May</span>
        <span>11 May</span>
        <span>12 May</span>
      </div>
    </div>
  );
};

const InventoryBreakdown = () => {
  return (
    <div className="flex items-center justify-center gap-7 h-[190px]">

      <div
        className="relative w-[150px] h-[150px] rounded-full"
        style={{
          background:
            "conic-gradient(#4caf73 0deg 251deg, #f6a623 251deg 304deg, #ef4c4c 304deg 340deg, #3675e8 340deg 360deg)",
        }}
      >
        <div className="absolute inset-[27px] rounded-full bg-white flex flex-col items-center justify-center">
          <span className="text-[18px] font-semibold text-[#111827]">
            12,542
          </span>
          <span className="text-[9px] text-[#667085]">Total Units</span>
        </div>
      </div>

      <div className="space-y-4 text-[10px]">
        <div className="flex items-center gap-3">
          <span className="w-[7px] h-[7px] rounded-full bg-[#4caf73]" />
          <span className="w-[70px] text-[#667085]">Active</span>
          <b>8,735 (69.6%)</b>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-[7px] h-[7px] rounded-full bg-[#f6a623]" />
          <span className="w-[70px] text-[#667085]">Low Stock</span>
          <b>1,845 (14.7%)</b>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-[7px] h-[7px] rounded-full bg-[#ef4c4c]" />
          <span className="w-[70px] text-[#667085]">Out of Stock</span>
          <b>1,245 (9.9%)</b>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-[7px] h-[7px] rounded-full bg-[#3675e8]" />
          <span className="w-[70px] text-[#667085]">Stock Out Soon</span>
          <b>717 (5.8%)</b>
        </div>
      </div>
    </div>
  );
};

const StockAlerts = () => {
  return (
    <div className="border border-[#e3e7ed] rounded-md bg-white overflow-hidden">

      <div className="h-[48px] px-4 flex items-center justify-between border-b border-[#edf0f3]">
        <h3 className="text-[11px] font-semibold">Stock Alerts</h3>

        <button className="text-[10px] text-[#315bea] font-medium">
          View All
        </button>
      </div>

      <div className="px-3">
        {stockAlerts.map((item, index) => (
          <div
            key={item.name}
            className={`h-[56px] flex items-center gap-2 ${
              index !== stockAlerts.length - 1
                ? "border-b border-[#f0f2f5]"
                : ""
            }`}
          >
            <div className="w-[32px] h-[32px] rounded-md border border-[#e2e6eb] overflow-hidden flex-shrink-0">
              <img
                src={item.image}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-semibold truncate">
                {item.name}
              </p>
              <p className="text-[9px] text-[#667085] mt-[2px]">
                SKU: {item.sku}
              </p>
            </div>

            <span
              className={`text-[8px] px-2 py-1 rounded-md whitespace-nowrap font-medium ${alertClass[item.status]}`}
            >
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const InventoryHealth = () => {
  return (
    <div className="border border-[#e3e7ed] rounded-md bg-white p-3">

      <h3 className="text-[11px] font-semibold mb-2">
        Inventory Health Score
      </h3>

      <div className="flex items-center gap-4">

        <div className="relative w-[88px] h-[88px] flex-shrink-0">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="44"
              cy="44"
              r="39"
              fill="none"
              stroke="#e7f4eb"
              strokeWidth="6"
            />

            <circle
              cx="44"
              cy="44"
              r="39"
              fill="none"
              stroke="#4caf73"
              strokeWidth="6"
              strokeDasharray="245"
              strokeDashoffset="44"
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[22px] font-semibold">82</span>
            <span className="text-[9px] text-[#4caf73] font-medium">
              Good
            </span>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold">Great Job! 🎉</p>

          <p className="text-[9px] text-[#667085] leading-4 mt-1">
            Your inventory health is good
            <br />
            Keep it up and maintain
            <br />
            high availability.
          </p>

          <button className="mt-2 border border-[#315bea] text-[#315bea] rounded-md px-2 py-1 text-[9px]">
            View Recommendations
          </button>
        </div>
      </div>
    </div>
  );
};

const QuickActions = () => {
  const actions = [
    {
      icon: Boxes,
      title: "Add New Stock",
      subtitle: "Add inventory to your warehouse",
    },
    {
      icon: RefreshCcw,
      title: "Stock Adjustments",
      subtitle: "Adjust stock manually",
    },
    {
      icon: ClipboardList,
      title: "Bulk Upload",
      subtitle: "Upload inventory in bulk",
    },
    {
      icon: FileText,
      title: "Stock Report",
      subtitle: "Download detailed stock report",
    },
  ];

  return (
    <div className="border border-[#e3e7ed] rounded-md bg-white p-3">

      <h3 className="text-[11px] font-semibold mb-2">Quick Actions</h3>

      <div>
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <button
              key={action.title}
              className="w-full flex items-center gap-3 py-2 text-left hover:bg-gray-50 rounded-md"
            >
              <div className="w-[26px] h-[26px] rounded-md bg-[#eef3ff] text-[#315bea] flex items-center justify-center">
                <Icon size={13} />
              </div>

              <div>
                <p className="text-[10px] font-medium">{action.title}</p>
                <p className="text-[9px] text-[#667085] mt-[2px]">
                  {action.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const InventoryTable = ({ data }) => {
  return (
    <div className="border border-[#e3e7ed] rounded-md overflow-hidden bg-white">

      <div className="h-[42px] px-3 flex items-center">
        <h3 className="text-[11px] font-semibold">
          Inventory List{" "}
          <span className="font-normal text-[#667085]">(1,245 Items)</span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px] border-collapse">

          <thead>
            <tr className="h-[31px] bg-[#fafbfc] border-y border-[#edf0f3]">
              <th className="w-[38px] px-2">
                <input
                  type="checkbox"
                  className="w-[13px] h-[13px] accent-[#315bea]"
                />
              </th>

              <th className="text-left text-[9px] font-semibold px-2">
                Product Details
              </th>

              <th className="text-left text-[9px] font-semibold px-2">
                SKU / FSN
              </th>

              <th className="text-left text-[9px] font-semibold px-2">
                Warehouse
              </th>

              <th className="text-left text-[9px] font-semibold px-2">
                Available Stock
              </th>

              <th className="text-left text-[9px] font-semibold px-2">
                Reserved
              </th>

              <th className="text-left text-[9px] font-semibold px-2">
                Incoming
              </th>

              <th className="text-left text-[9px] font-semibold px-2">
                Status
              </th>

              <th className="text-left text-[9px] font-semibold px-2">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="h-[58px] border-b border-[#edf0f3] hover:bg-[#fafcff]"
              >
                <td className="px-2">
                  <input
                    type="checkbox"
                    className="w-[13px] h-[13px] accent-[#315bea]"
                  />
                </td>

                <td className="px-2">
                  <div className="flex items-center gap-2">

                    <div className="w-[34px] h-[34px] rounded-md border border-[#e2e6eb] overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div>
                      <p className="text-[9px] font-semibold text-[#1d2939]">
                        {item.name}
                      </p>

                      <p className="text-[8px] text-[#667085] mt-1">
                        {item.type}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-2">
                  <p className="text-[9px] font-medium">{item.sku}</p>
                  <p className="text-[8px] text-[#667085] mt-1">
                    {item.fsn}
                  </p>
                </td>

                <td className="px-2">
                  <p className="text-[9px] font-medium">
                    {item.warehouse}
                  </p>
                  <p className="text-[8px] text-[#667085] mt-1">
                    {item.location}
                  </p>
                </td>

                <td className="px-2">
                  <span
                    className={`text-[9px] font-semibold ${
                      item.stock === 0
                        ? "text-[#ef4444]"
                        : item.stock <= 5
                        ? "text-[#ef8c00]"
                        : "text-[#079455]"
                    }`}
                  >
                    {item.stock}
                  </span>
                </td>

                <td className="px-2 text-[9px] font-medium">
                  {item.reserved}
                </td>

                <td className="px-2">
                  <p className="text-[9px] font-medium">
                    {item.incoming}
                  </p>

                  {item.incomingDate && (
                    <p className="text-[8px] text-[#667085] mt-1">
                      {item.incomingDate}
                    </p>
                  )}
                </td>

                <td className="px-2">
                  <span
                    className={`inline-flex px-2 py-1 rounded-md text-[8px] font-medium whitespace-nowrap ${statusClass[item.status]}`}
                  >
                    {item.status}
                  </span>
                </td>

                <td className="px-2">
                  <div className="flex items-center gap-1">

                    <button className="w-[27px] h-[27px] border border-[#e1e5eb] rounded-md flex items-center justify-center text-[#667085] hover:text-[#315bea]">
                      <Pencil size={12} />
                    </button>

                    <button className="w-[27px] h-[27px] border border-[#e1e5eb] rounded-md flex items-center justify-center text-[#667085] hover:text-[#315bea]">
                      <MoreVertical size={13} />
                    </button>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="h-[48px] px-3 flex items-center justify-between">

        <p className="text-[9px] text-[#475467]">
          Showing 1 to 5 of 1,245 items
        </p>

        <div className="flex items-center gap-1">

          <button className="w-[28px] h-[28px] border border-[#e1e5eb] rounded-md flex items-center justify-center text-[#98a2b3]">
            <ChevronLeft size={13} />
          </button>

          <button className="w-[28px] h-[28px] rounded-md border border-[#b9ccff] bg-[#eef3ff] text-[#315bea] text-[9px]">
            1
          </button>

          <button className="w-[28px] h-[28px] text-[9px]">
            2
          </button>

          <button className="w-[28px] h-[28px] text-[9px]">
            3
          </button>

          <span className="text-[9px] px-1">...</span>

          <button className="w-[28px] h-[28px] text-[9px]">
            249
          </button>

          <button className="w-[28px] h-[28px] border border-[#e1e5eb] rounded-md flex items-center justify-center text-[#475467]">
            <ChevronRight size={13} />
          </button>

          <button className="ml-3 h-[28px] px-2 border border-[#e1e5eb] rounded-md flex items-center gap-2 text-[9px]">
            5 per page
            <ChevronDown size={11} />
          </button>

        </div>
      </div>
    </div>
  );
};

const Inventory = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All Inventory");

  const tabs = [
    "All Inventory",
    "Active Listings",
    "Low Stock",
    "Out of Stock",
    "Stock Out Soon",
  ];

  const filteredData = inventoryData.filter((item) => {
    const query = search.toLowerCase();

    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      item.sku.toLowerCase().includes(query) ||
      item.fsn.toLowerCase().includes(query);

    let matchesTab = true;

    if (activeTab === "Active Listings") {
      matchesTab = item.status === "Active";
    }

    if (activeTab === "Low Stock") {
      matchesTab = item.status === "Low Stock";
    }

    if (activeTab === "Out of Stock") {
      matchesTab = item.status === "Out of Stock";
    }

    if (activeTab === "Stock Out Soon") {
      matchesTab = item.status === "Stock Out Soon";
    }

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#fbfcfe] text-[#101828]">

      <div className="px-[18px] py-[25px]">

        {/* ================= HEADER ================= */}
        <div className="flex items-start justify-between mb-5">

          <div>
            <h1 className="text-[18px] font-semibold">
              Inventory / Stock Management
            </h1>

            <p className="text-[10px] text-[#667085] mt-1">
              Track, manage and optimize your inventory across all your
              listings
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button className="h-[35px] px-3 border border-[#e1e5eb] rounded-md bg-white flex items-center gap-2 text-[10px] font-medium hover:bg-gray-50">
              <Download size={13} />
              Export Report
            </button>

            <div className="flex h-[35px]">

              <button className="px-4 bg-[#315bea] text-white rounded-l-md text-[10px] font-medium flex items-center gap-2 hover:bg-[#244bd0]">
                <Plus size={14} />
                Add Stock
              </button>

              <button className="w-[35px] bg-[#315bea] text-white border-l border-white/20 rounded-r-md flex items-center justify-center hover:bg-[#244bd0]">
                <ChevronDown size={13} />
              </button>

            </div>

          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">

          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="h-[100px] bg-white border border-[#e3e7ed] rounded-md px-4 py-3"
              >
                <div className="flex justify-between">

                  <div>
                    <p className="text-[10px] text-[#475467]">
                      {item.title}
                    </p>

                    <p className="text-[19px] font-semibold mt-2">
                      {item.value}
                    </p>
                  </div>

                  <div
                    className={`w-[39px] h-[39px] rounded-full flex items-center justify-center ${item.iconBg} ${item.iconColor}`}
                  >
                    <Icon size={19} strokeWidth={1.8} />
                  </div>

                </div>

                <p className="text-[9px] mt-3">
                  <span className={`${item.changeColor} font-medium`}>
                    {item.arrow} {item.change}
                  </span>{" "}
                  <span className="text-[#667085]">
                    {item.description}
                  </span>
                </p>
              </div>
            );
          })}

        </div>

        {/* ================= TABS ================= */}
        <div className="h-[39px] bg-white border-b border-[#e4e7ec] flex items-end mb-2">

          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-full px-4 text-[10px] font-medium relative ${
                activeTab === tab
                  ? "text-[#315bea]"
                  : "text-[#344054]"
              }`}
            >
              {tab}

              {activeTab === tab && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#315bea]" />
              )}
            </button>
          ))}

        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_310px] gap-3">

          {/* LEFT */}
          <div className="min-w-0">

            {/* FILTER */}
            <div className="h-[56px] bg-white border border-[#e3e7ed] rounded-md p-3 flex items-center gap-3">

              <div className="relative flex-1 max-w-[300px]">

                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by product name, SKU, FSN"
                  className="w-full h-[32px] pl-9 pr-3 border border-[#e1e5eb] rounded-md outline-none text-[10px] placeholder:text-[#98a2b3] focus:border-[#315bea]"
                />

              </div>

              <SelectBox>All Categories</SelectBox>
              <SelectBox>All Warehouses</SelectBox>
              <SelectBox>All Status</SelectBox>

            </div>

            {/* CHARTS */}
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-3 mt-3">

              <div className="h-[237px] border border-[#e3e7ed] bg-white rounded-md p-4">

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-1">
                    <h3 className="text-[11px] font-semibold">
                      Inventory Trend
                    </h3>
                    <Info size={11} className="text-[#98a2b3]" />
                  </div>

                  <SelectBox width="94px">Last 7 Days</SelectBox>

                </div>

                <TrendChart />

              </div>

              <div className="h-[237px] border border-[#e3e7ed] bg-white rounded-md p-4">

                <h3 className="text-[11px] font-semibold">
                  Inventory Breakdown
                </h3>

                <InventoryBreakdown />

              </div>

            </div>

            {/* TABLE */}
            <div className="mt-3">

              <InventoryTable data={filteredData} />

            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-3">

            <StockAlerts />

            <InventoryHealth />

            <QuickActions />

          </div>

        </div>

      </div>
    </div>
  );
};

export default Inventory;