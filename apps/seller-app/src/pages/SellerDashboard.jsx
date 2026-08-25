
import React from "react";
import {
  Menu,
  Search,
  Megaphone,
  Bell,
  CircleHelp,
  ChevronDown,
  CalendarDays,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Package,
  RotateCcw,
  XCircle,
  ChevronUp,
  ChevronDown as ChevronDownIcon,
  Plus,
  ClipboardCheck,
  Tag,
  BarChart3,
  Volume2,
  Gift,
  Clock,
  AlertTriangle,
} from "lucide-react";

/* =========================================================
   DUMMY DATA
   Later you can replace these with API response
========================================================= */

const stats = [
  {
    title: "Total Orders",
    value: "124",
    change: "12.5%",
    text: "vs last 7 days",
    type: "up",
    icon: ShoppingBag,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    title: "Total Revenue",
    value: "₹1,24,560",
    change: "18.3%",
    text: "vs last 7 days",
    type: "up",
    icon: IndianRupee,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    title: "Total Profit",
    value: "₹28,450",
    change: "15.7%",
    text: "vs last 7 days",
    type: "up",
    icon: TrendingUp,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    title: "Units Sold",
    value: "230",
    change: "10.2%",
    text: "vs last 7 days",
    type: "up",
    icon: Package,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    title: "Returns",
    value: "6",
    change: "7.1%",
    text: "vs last 7 days",
    type: "down",
    icon: RotateCcw,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    title: "Cancelled",
    value: "4",
    change: "5.3%",
    text: "vs last 7 days",
    type: "down",
    icon: XCircle,
    iconBg: "bg-gray-100",
    iconColor: "text-gray-500",
  },
];

const recentOrders = [
  {
    id: "OD123456789012",
    customer: "Rahul Kumar",
    amount: "₹313.00",
    status: "Delivered",
    time: "10 mins ago",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80",
  },
  {
    id: "OD123456789013",
    customer: "Priya Patel",
    amount: "₹1,699.00",
    status: "Packed",
    time: "35 mins ago",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80",
  },
  {
    id: "OD123456789014",
    customer: "Amit Singh",
    amount: "₹2,299.00",
    status: "Ready to Ship",
    time: "1 hour ago",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80",
  },
  {
    id: "OD123456789015",
    customer: "Sneha Nair",
    amount: "₹1,299.00",
    status: "Shipped",
    time: "2 hours ago",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&q=80",
  },
  {
    id: "OD123456789016",
    customer: "Manish Gupta",
    amount: "₹1,899.00",
    status: "Confirmed",
    time: "3 hours ago",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&q=80",
  },
];

const topProducts = [
  {
    rank: 1,
    name: "Technosport Men Solid Round Neck T-Shirt",
    price: "₹313.00",
    sold: 56,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&q=80",
  },
  {
    rank: 2,
    name: "Campus Men Running Shoes",
    price: "₹1,699.00",
    sold: 42,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80",
  },
  {
    rank: 3,
    name: "boAt Wave Call Smart Watch",
    price: "₹2,299.00",
    sold: 31,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80",
  },
  {
    rank: 4,
    name: "Wildcraft Voyager Backpack",
    price: "₹1,299.00",
    sold: 28,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&q=80",
  },
  {
    rank: 5,
    name: "Flying Machine Men Jeans",
    price: "₹1,899.00",
    sold: 26,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=100&q=80",
  },
];

const lowStockProducts = [
  {
    name: "Puma Men's Sneakers",
    variant: "Size: 8",
    stock: 3,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80",
  },
  {
    name: "boAt Rockerz 450",
    variant: "Black",
    stock: 4,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&q=80",
  },
  {
    name: "HP Pavilion Laptop",
    variant: "15.6 inch",
    stock: 2,
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&q=80",
  },
  {
    name: "Nike Air Max 270",
    variant: "Size: 9",
    stock: 5,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&q=80",
  },
  {
    name: "Fastrack Analog Watch",
    variant: "Black",
    stock: 4,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&q=80",
  },
];

const orderStatuses = [
  { name: "Pending", value: 15, color: "#f59e0b", percent: "12.1%" },
  { name: "Confirmed", value: 28, color: "#22a06b", percent: "22.6%" },
  { name: "Packed", value: 18, color: "#8b5cf6", percent: "14.5%" },
  { name: "Ready to Ship", value: 11, color: "#2563eb", percent: "8.9%" },
  { name: "Shipped", value: 26, color: "#38bdb8", percent: "21.0%" },
  { name: "Delivered", value: 22, color: "#27ae75", percent: "17.7%" },
  { name: "Cancelled", value: 4, color: "#ef4444", percent: "3.2%" },
];

const announcements = [
  {
    title: "Flipkart Big Saving Days",
    description: "Huge traffic expected from 20th May.",
    time: "2h ago",
    icon: Gift,
  },
  {
    title: "New Fee Structure",
    description: "Updated commission structure from 1st June.",
    time: "1d ago",
    icon: Tag,
  },
  {
    title: "Seller Webinar",
    description: "Join our webinar on 22nd May at 4 PM.",
    time: "2d ago",
    icon: Volume2,
  },
];

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function StatCard({ stat }) {
  const Icon = stat.icon;

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-full ${stat.iconBg} flex items-center justify-center shrink-0`}
        >
          <Icon size={24} className={stat.iconColor} strokeWidth={1.8} />
        </div>

        <div className="min-w-0">
          <p className="text-[13px] text-slate-500 font-medium">
            {stat.title}
          </p>

          <h2 className="text-[21px] font-semibold text-slate-900 mt-1 whitespace-nowrap">
            {stat.value}
          </h2>
        </div>
      </div>

      <div
        className={`flex items-center gap-1 mt-4 text-[11px] ${
          stat.type === "up" ? "text-emerald-600" : "text-red-500"
        }`}
      >
        {stat.type === "up" ? (
          <ChevronUp size={13} />
        ) : (
          <ChevronDownIcon size={13} />
        )}

        <span className="font-medium">{stat.change}</span>

        <span className="text-slate-500 ml-1">{stat.text}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Delivered: "bg-emerald-50 text-emerald-600",
    Packed: "bg-purple-50 text-purple-600",
    "Ready to Ship": "bg-orange-50 text-orange-600",
    Shipped: "bg-blue-50 text-blue-600",
    Confirmed: "bg-yellow-50 text-yellow-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${
        styles[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   SALES CHART
========================================================= */

function SalesChart() {
  const points = [20, 24, 30, 24, 28, 22, 24, 34, 24, 17, 19, 25, 28];

  const width = 720;
  const height = 250;

  const chartPoints = points
    .map((value, index) => {
      const x = 30 + (index * (width - 60)) / (points.length - 1);
      const y = height - 25 - value * 5.4;

      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="mt-5">
      <div className="flex justify-between text-[11px] text-slate-400 mb-3">
        <span>₹40K</span>
        <span>₹30K</span>
        <span>₹20K</span>
        <span>₹10K</span>
      </div>

      <div className="relative h-[245px]">
        {/* horizontal lines */}
        <div className="absolute inset-0 flex flex-col justify-between pb-7">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="border-t border-slate-100 w-full"
            />
          ))}
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0 w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <polyline
            points={chartPoints}
            fill="none"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((value, index) => {
            const x = 30 + (index * (width - 60)) / (points.length - 1);
            const y = height - 25 - value * 5.4;

            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="3"
                fill="white"
                stroke="#2563eb"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        {/* tooltip */}
        <div className="absolute left-[58%] top-[12%] bg-white border border-slate-100 rounded-lg shadow-lg px-4 py-3">
          <p className="text-[10px] text-slate-500">15 May 2024</p>

          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-[11px] text-slate-500">
              Revenue:
            </span>
            <span className="text-[11px] font-semibold">
              ₹24,560
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 text-[11px] text-slate-500 mt-1">
        {[
          "12 May",
          "13 May",
          "14 May",
          "15 May",
          "16 May",
          "17 May",
          "18 May",
        ].map((day) => (
          <span key={day} className="text-center">
            {day}
          </span>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   ORDER STATUS DONUT
========================================================= */

function OrderStatusChart() {
  const total = 124;

  let current = 0;

  const gradient = orderStatuses
    .map((item) => {
      const start = current;
      current += (item.value / total) * 360;

      return `${item.color} ${start}deg ${current}deg`;
    })
    .join(", ");

  return (
    <div className="flex items-center gap-7 h-full">
      <div className="relative shrink-0">
        <div
          className="w-[170px] h-[170px] rounded-full flex items-center justify-center"
          style={{
            background: `conic-gradient(${gradient})`,
          }}
        >
          <div className="w-[108px] h-[108px] bg-white rounded-full flex flex-col items-center justify-center">
            <span className="text-[23px] font-semibold text-slate-900">
              124
            </span>
            <span className="text-[10px] text-slate-500">
              Total Orders
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3 flex-1">
        {orderStatuses.map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-[11px]"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.color }}
              />

              <span className="text-slate-600">
                {item.name}
              </span>
            </div>

            <div className="flex gap-2">
              <span className="font-medium text-slate-700">
                {item.value}
              </span>

              <span className="text-slate-400">
                ({item.percent})
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function SellerDashboard() {
  return (
    <div className="min-h-screen bg-[#fbfcff] text-slate-900">

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="px-6 py-6">

        {/* Heading */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[23px] font-semibold text-slate-900">
              Welcome back, Soumen! 👋
            </h1>

            <p className="text-[13px] text-slate-500 mt-1">
              Here's what's happening with your business today.
            </p>
          </div>

          <button className="border border-slate-200 bg-white rounded-lg px-4 py-2.5 flex items-center gap-3 text-[12px] font-medium shadow-sm">
            12 May – 18 May 2024
            <CalendarDays size={16} />
          </button>
        </div>

        {/* ===================================================
            STAT CARDS
        =================================================== */}

        <div className="grid grid-cols-6 gap-4">
          {stats.map((stat) => (
            <StatCard key={stat.title} stat={stat} />
          ))}
        </div>

        {/* ===================================================
            MIDDLE SECTION
        =================================================== */}

        <div className="grid grid-cols-[1.75fr_1fr_1fr] gap-4 mt-5">

          {/* SALES OVERVIEW */}
          <section className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">

            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-[14px]">
                Sales Overview
              </h2>

              <button className="border border-slate-200 rounded-lg px-3 py-2 text-[11px] flex items-center gap-5">
                This Week
                <ChevronDown size={14} />
              </button>
            </div>

            <div className="mt-4">
              <p className="text-[11px] text-slate-500">
                Total Revenue
              </p>

              <p className="text-[19px] font-semibold mt-1">
                ₹1,24,560
              </p>

              <p className="text-[11px] text-emerald-600 mt-1">
                ↑ 18.5%{" "}
                <span className="text-slate-400">
                  vs last week
                </span>
              </p>
            </div>

            <SalesChart />
          </section>

          {/* ORDER STATUS */}
          <section className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">

            <h2 className="font-semibold text-[14px]">
              Order Status
            </h2>

            <OrderStatusChart />
          </section>

          {/* QUICK ACTIONS */}
          <section className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">

            <h2 className="font-semibold text-[14px] mb-4">
              Quick Actions
            </h2>

            <div className="grid grid-cols-3 gap-3">

              {[
                {
                  title: "Add Product",
                  icon: Plus,
                  bg: "bg-purple-50",
                  color: "text-purple-600",
                },
                {
                  title: "Manage Orders",
                  icon: ClipboardCheck,
                  bg: "bg-green-50",
                  color: "text-green-600",
                },
                {
                  title: "Stock Update",
                  icon: Package,
                  bg: "bg-orange-50",
                  color: "text-orange-600",
                },
                {
                  title: "Price Update",
                  icon: Tag,
                  bg: "bg-pink-50",
                  color: "text-pink-500",
                },
                {
                  title: "Promotions",
                  icon: Megaphone,
                  bg: "bg-blue-50",
                  color: "text-blue-600",
                },
                {
                  title: "Reports",
                  icon: BarChart3,
                  bg: "bg-blue-50",
                  color: "text-blue-600",
                },
              ].map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.title}
                    className="border border-slate-200 rounded-lg p-3 h-[82px] hover:shadow-sm transition"
                  >
                    <div
                      className={`w-9 h-9 rounded-full ${action.bg} ${action.color} flex items-center justify-center mx-auto`}
                    >
                      <Icon size={18} />
                    </div>

                    <p className="text-[10px] font-medium text-slate-700 mt-2">
                      {action.title}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* ===================================================
            BOTTOM CONTENT
        =================================================== */}

        <div className="grid grid-cols-[1.1fr_1.1fr_1fr_1fr] gap-4 mt-4">

          {/* =================================================
              RECENT ORDERS
          ================================================= */}

          <section className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">

            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[14px]">
                Recent Orders
              </h2>

              <button className="text-[11px] text-blue-600 font-medium">
                View All
              </button>
            </div>

            <div>
              {recentOrders.map((order, index) => (
                <div
                  key={order.id}
                  className={`flex items-center gap-3 py-3 ${
                    index !== recentOrders.length - 1
                      ? "border-b border-slate-100"
                      : ""
                  }`}
                >
                  <img
                    src={order.image}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-medium truncate">
                      {order.id}
                    </p>

                    <p className="text-[10px] text-slate-500 mt-1">
                      {order.customer}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-medium">
                      {order.amount}
                    </p>

                    <div className="mt-1">
                      <StatusBadge status={order.status} />
                    </div>

                    <p className="text-[9px] text-slate-400 mt-1">
                      {order.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* =================================================
              TOP SELLING PRODUCTS
          ================================================= */}

          <section className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">

            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[14px]">
                Top Selling Products
              </h2>

              <button className="text-[11px] text-blue-600 font-medium">
                View All
              </button>
            </div>

            {topProducts.map((product, index) => (
              <div
                key={product.rank}
                className={`flex items-center gap-3 py-2.5 ${
                  index !== topProducts.length - 1
                    ? "border-b border-slate-100"
                    : ""
                }`}
              >
                <span className="text-[11px] font-medium w-3">
                  {product.rank}
                </span>

                <img
                  src={product.image}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium truncate">
                    {product.name}
                  </p>

                  <p className="text-[10px] text-blue-600 mt-1">
                    {product.price}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[9px] text-slate-400">
                    Sold
                  </p>

                  <p className="text-[11px] font-medium">
                    {product.sold}
                  </p>
                </div>
              </div>
            ))}
          </section>

          {/* =================================================
              LOW STOCK
          ================================================= */}

          <section className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">

            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-[14px]">
                Low Stock Alerts
              </h2>

              <button className="text-[11px] text-blue-600 font-medium">
                View All
              </button>
            </div>

            {lowStockProducts.map((product, index) => (
              <div
                key={product.name}
                className={`flex items-center gap-3 py-2.5 ${
                  index !== lowStockProducts.length - 1
                    ? "border-b border-slate-100"
                    : ""
                }`}
              >
                <img
                  src={product.image}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover border border-slate-100"
                />

                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-medium truncate">
                    {product.name}
                  </p>

                  <p className="text-[9px] text-slate-500 mt-1">
                    {product.variant}
                  </p>
                </div>

                <p className="text-[10px] text-red-500 font-medium whitespace-nowrap">
                  Stock: {product.stock}
                </p>
              </div>
            ))}
          </section>

          {/* =================================================
              RIGHT COLUMN
          ================================================= */}

          <div className="space-y-4">

            {/* PROMOTION */}
            <section className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-4 min-h-[150px]">

              <div className="flex gap-3">

                <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                  <Gift
                    size={28}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-[13px]">
                    Boost your sales! 🚀
                  </h3>

                  <p className="text-[10px] text-slate-500 mt-1 leading-4">
                    Create offers and reach more customers.
                  </p>

                  <button className="bg-blue-600 text-white text-[10px] font-medium px-4 py-2 rounded-lg mt-3 hover:bg-blue-700">
                    Create Promotion
                  </button>
                </div>
              </div>
            </section>

            {/* ANNOUNCEMENTS */}
            <section className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">

              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-[14px]">
                  Announcements
                </h2>

                <button className="text-[11px] text-blue-600">
                  View All
                </button>
              </div>

              {announcements.map((item, index) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className={`py-3 ${
                      index !== announcements.length - 1
                        ? "border-b border-slate-100"
                        : ""
                    }`}
                  >
                    <div className="flex gap-3">

                      <div className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                        <Icon
                          size={13}
                          className="text-purple-600"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between gap-2">
                          <p className="text-[10px] font-medium">
                            {item.title}
                          </p>

                          <span className="text-[9px] text-slate-400 whitespace-nowrap">
                            {item.time}
                          </span>
                        </div>

                        <p className="text-[9px] text-slate-500 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}