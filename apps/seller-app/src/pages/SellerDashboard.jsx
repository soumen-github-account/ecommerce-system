import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  CalendarDays,
  ShoppingBag,
  IndianRupee,
  TrendingUp,
  Package,
  RotateCcw,
  XCircle,
  ChevronUp,
  ChevronDown,
  Plus,
  ClipboardCheck,
  Tag,
  BarChart3,
  Megaphone,
  Volume2,
  Gift,
  RefreshCw,
  AlertTriangle,
  Loader2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { getSellerDashboard } from "../services/dashboardApi";


/* =========================================================
   CONSTANTS
========================================================= */

const STATUS_COLORS = {
  Pending: "#f59e0b",
  Confirmed: "#22a06b",
  Packed: "#8b5cf6",
  "Ready to Ship": "#2563eb",
  Shipped: "#38bdb8",
  Delivered: "#27ae75",
  Cancelled: "#ef4444",
  Returned: "#f97316",
};

const RANGE_OPTIONS = [
  {
    value: "7d",
    label: "This Week",
  },
  {
    value: "30d",
    label: "Last 30 Days",
  },
  {
    value: "90d",
    label: "Last 90 Days",
  },
  {
    value: "1y",
    label: "This Year",
  },
];


/* =========================================================
   HELPERS
========================================================= */

const formatCurrency = (value = 0) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const formatNumber = (value = 0) => {
  return Number(value || 0).toLocaleString("en-IN");
};

const formatRelativeTime = (date) => {
  if (!date) return "";

  const now = new Date();
  const created = new Date(date);

  if (Number.isNaN(created.getTime())) return "";

  const diff = Math.floor((now - created) / 1000);

  if (diff < 60) {
    return `${Math.max(diff, 1)} sec ago`;
  }

  const minutes = Math.floor(diff / 60);

  if (minutes < 60) {
    return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} day${days !== 1 ? "s" : ""} ago`;
};


const normalizeStatus = (status = "") => {
  const map = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PACKED: "Packed",
    READY_TO_SHIP: "Ready to Ship",
    SHIPPED: "Shipped",
    DELIVERED: "Delivered",
    CANCELLED: "Cancelled",
    RETURNED: "Returned",

    Pending: "Pending",
    Confirmed: "Confirmed",
    Packed: "Packed",
    "Ready to Ship": "Ready to Ship",
    Shipped: "Shipped",
    Delivered: "Delivered",
    Cancelled: "Cancelled",
    Returned: "Returned",
  };

  return map[status] || status;
};


/* =========================================================
   LOADING SKELETON
========================================================= */

function Skeleton({ className = "" }) {
  return (
    <div
      className={`animate-pulse bg-slate-100 rounded-lg ${className}`}
    />
  );
}


function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#fbfcff] px-6 py-6">

      <div className="mb-6">
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-80 mt-3" />
      </div>

      <div className="grid grid-cols-6 gap-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-[185px]" />
        ))}
      </div>

      <div className="grid grid-cols-[1.75fr_1fr_1fr] gap-4 mt-5">
        <Skeleton className="h-[420px]" />
        <Skeleton className="h-[420px]" />
        <Skeleton className="h-[420px]" />
      </div>

    </div>
  );
}


/* =========================================================
   ERROR
========================================================= */

function DashboardError({ message, onRetry }) {
  return (
    <div className="min-h-screen bg-[#fbfcff] flex items-center justify-center px-6">

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-8 text-center max-w-md">

        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <AlertTriangle size={23} />
        </div>

        <h2 className="font-semibold text-slate-900 mt-4">
          Unable to load dashboard
        </h2>

        <p className="text-sm text-slate-500 mt-2">
          {message || "Something went wrong while loading dashboard data."}
        </p>

        <button
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition"
        >
          <RefreshCw size={15} />
          Try Again
        </button>

      </div>

    </div>
  );
}


/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ stat }) {
  const Icon = stat.icon;

  const isPositive = Number(stat.change) >= 0;

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm hover:shadow-md transition">

      <div className="flex items-center gap-4">

        <div
          className={`w-12 h-12 rounded-full ${stat.iconBg} flex items-center justify-center shrink-0`}
        >
          <Icon
            size={24}
            className={stat.iconColor}
            strokeWidth={1.8}
          />
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
          isPositive ? "text-emerald-600" : "text-red-500"
        }`}
      >

        {isPositive ? (
          <ChevronUp size={13} />
        ) : (
          <ChevronDown size={13} />
        )}

        <span className="font-medium">
          {Math.abs(Number(stat.change || 0)).toFixed(1)}%
        </span>

        <span className="text-slate-500 ml-1">
          vs previous period
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const normalized = normalizeStatus(status);

  const styles = {
    Delivered: "bg-emerald-50 text-emerald-600",
    Packed: "bg-purple-50 text-purple-600",
    "Ready to Ship": "bg-orange-50 text-orange-600",
    Shipped: "bg-blue-50 text-blue-600",
    Confirmed: "bg-yellow-50 text-yellow-600",
    Pending: "bg-amber-50 text-amber-600",
    Cancelled: "bg-red-50 text-red-600",
    Returned: "bg-orange-50 text-orange-600",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${
        styles[normalized] || "bg-slate-100 text-slate-600"
      }`}
    >
      {normalized}
    </span>
  );
}


/* =========================================================
   SALES TOOLTIP
========================================================= */

function SalesTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-4 py-3">

      <p className="text-[10px] text-slate-500">
        {label}
      </p>

      <div className="flex items-center gap-2 mt-1">

        <span className="w-2 h-2 rounded-full bg-blue-600" />

        <span className="text-[11px] text-slate-500">
          Revenue:
        </span>

        <span className="text-[11px] font-semibold">
          {formatCurrency(payload[0].value)}
        </span>

      </div>

    </div>
  );
}


/* =========================================================
   SALES CHART
========================================================= */

function SalesChart({ data = [] }) {
  return (
    <div className="mt-5 h-[270px]">

      {data.length === 0 ? (

        <div className="h-full flex items-center justify-center text-sm text-slate-400">
          No sales data available
        </div>

      ) : (

        <ResponsiveContainer width="100%" height="100%">

          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: -15,
              bottom: 5,
            }}
          >

            <CartesianGrid
              stroke="#f1f5f9"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tick={{
                fontSize: 10,
                fill: "#64748b",
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fontSize: 10,
                fill: "#94a3b8",
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                value >= 1000
                  ? `₹${Math.round(value / 1000)}K`
                  : `₹${value}`
              }
            />

            <Tooltip
              content={<SalesTooltip />}
            />

            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{
                r: 3,
                fill: "#fff",
                stroke: "#2563eb",
                strokeWidth: 2,
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      )}

    </div>
  );
}


/* =========================================================
   ORDER STATUS CHART
========================================================= */

function OrderStatusChart({ data = [] }) {

  const chartData = data.map((item) => ({
    name: normalizeStatus(
      item.name || item.status || item._id || "Unknown"
    ),
    value: Number(item.value || item.count || 0),
  }));

  const total = chartData.reduce(
    (sum, item) => sum + item.value,
    0
  );


  return (
    <div className="flex items-center gap-6 h-[340px]">

      <div className="relative shrink-0 w-[175px] h-[175px]">

        {total === 0 ? (

          <div className="w-full h-full rounded-full border-[25px] border-slate-100" />

        ) : (

          <ResponsiveContainer width="100%" height="100%">

            <PieChart>

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={86}
                paddingAngle={1}
                stroke="none"
              >

                {chartData.map((entry, index) => (
                  <Cell
                    key={`${entry.name}-${index}`}
                    fill={
                      STATUS_COLORS[entry.name] ||
                      "#94a3b8"
                    }
                  />
                ))}

              </Pie>

            </PieChart>

          </ResponsiveContainer>

        )}


        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">

          <span className="text-[23px] font-semibold text-slate-900">
            {formatNumber(total)}
          </span>

          <span className="text-[10px] text-slate-500">
            Total Orders
          </span>

        </div>

      </div>


      <div className="space-y-3 flex-1 min-w-0">

        {chartData.length === 0 ? (

          <p className="text-sm text-slate-400">
            No order data
          </p>

        ) : (

          chartData.map((item) => {

            const percent =
              total > 0
                ? ((item.value / total) * 100).toFixed(1)
                : "0.0";

            return (
              <div
                key={item.name}
                className="flex items-center justify-between text-[11px] gap-2"
              >

                <div className="flex items-center gap-2 min-w-0">

                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        STATUS_COLORS[item.name] ||
                        "#94a3b8",
                    }}
                  />

                  <span className="text-slate-600 truncate">
                    {item.name}
                  </span>

                </div>


                <div className="flex gap-2 shrink-0">

                  <span className="font-medium text-slate-700">
                    {formatNumber(item.value)}
                  </span>

                  <span className="text-slate-400">
                    ({percent}%)
                  </span>

                </div>

              </div>
            );

          })

        )}

      </div>

    </div>
  );
}


/* =========================================================
   QUICK ACTIONS
========================================================= */

function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Add Product",
      icon: Plus,
      bg: "bg-purple-50",
      color: "text-purple-600",
      path: "/seller/products/add",
    },
    {
      title: "Manage Orders",
      icon: ClipboardCheck,
      bg: "bg-green-50",
      color: "text-green-600",
      path: "/seller/orders",
    },
    {
      title: "Stock Update",
      icon: Package,
      bg: "bg-orange-50",
      color: "text-orange-600",
      path: "/seller/inventory",
    },
    {
      title: "Price Update",
      icon: Tag,
      bg: "bg-pink-50",
      color: "text-pink-500",
      path: "/seller/products",
    },
    {
      title: "Promotions",
      icon: Megaphone,
      bg: "bg-blue-50",
      color: "text-blue-600",
      path: "/seller/promotions",
    },
    {
      title: "Reports",
      icon: BarChart3,
      bg: "bg-blue-50",
      color: "text-blue-600",
      path: "/seller/reports",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">

      {actions.map((action) => {

        const Icon = action.icon;

        return (
          <button
            key={action.title}
            onClick={() => navigate(action.path)}
            className="border border-slate-200 rounded-lg p-3 h-[82px] hover:shadow-sm hover:border-slate-300 transition"
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
  );
}


/* =========================================================
   RECENT ORDERS
========================================================= */

function RecentOrders({ orders = [] }) {

  const navigate = useNavigate();

  return (
    <section className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">

      <div className="flex items-center justify-between mb-3">

        <h2 className="font-semibold text-[14px]">
          Recent Orders
        </h2>

        <button
          onClick={() => navigate("/seller/orders")}
          className="text-[11px] text-blue-600 font-medium"
        >
          View All
        </button>

      </div>


      {orders.length === 0 ? (

        <div className="h-[350px] flex items-center justify-center text-sm text-slate-400">
          No recent orders
        </div>

      ) : (

        <div>

          {orders.map((order, index) => (

            <div
              key={order.orderId || `${order.orderNumber}-${index}`}
              className={`flex items-center gap-3 py-3 ${
                index !== orders.length - 1
                  ? "border-b border-slate-100"
                  : ""
              }`}
            >

              <img
                src={order.image || "/placeholder-product.png"}
                alt={order.title || "Product"}
                className="w-10 h-10 rounded-lg object-cover border border-slate-100"
              />


              <div className="flex-1 min-w-0">

                <p className="text-[10px] font-medium truncate">
                  {order.title || order.orderNumber}
                </p>

                <p className="text-[10px] text-slate-500 mt-1 truncate">
                  {order.variantName || order.sku || "Product"}
                </p>

              </div>


              <div className="text-right">

                <p className="text-[10px] font-medium">
                  {formatCurrency(order.amount)}
                </p>

                <div className="mt-1">
                  <StatusBadge status={order.status} />
                </div>

                <p className="text-[9px] text-slate-400 mt-1">
                  {formatRelativeTime(order.createdAt)}
                </p>

              </div>

            </div>

          ))}

        </div>

      )}

    </section>
  );
}


/* =========================================================
   TOP PRODUCTS
========================================================= */

function TopProducts({ products = [] }) {

  const navigate = useNavigate();

  return (
    <section className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">

      <div className="flex items-center justify-between mb-3">

        <h2 className="font-semibold text-[14px]">
          Top Selling Products
        </h2>

        <button
          onClick={() => navigate("/seller/products")}
          className="text-[11px] text-blue-600 font-medium"
        >
          View All
        </button>

      </div>


      {products.length === 0 ? (

        <div className="h-[350px] flex items-center justify-center text-sm text-slate-400">
          No product sales data
        </div>

      ) : (

        products.map((product, index) => (

          <div
            key={product.productId || product.id || index}
            className={`flex items-center gap-3 py-2.5 ${
              index !== products.length - 1
                ? "border-b border-slate-100"
                : ""
            }`}
          >

            <span className="text-[11px] font-medium w-3">
              {index + 1}
            </span>


            <img
              src={product.image || "/placeholder-product.png"}
              alt={product.title || product.name || "Product"}
              className="w-10 h-10 rounded-lg object-cover border border-slate-100"
            />


            <div className="flex-1 min-w-0">

              <p className="text-[10px] font-medium truncate">
                {product.title || product.name}
              </p>

              <p className="text-[10px] text-blue-600 mt-1">
                {formatCurrency(
                  product.revenue ||
                  product.amount ||
                  product.price
                )}
              </p>

            </div>


            <div className="text-right">

              <p className="text-[9px] text-slate-400">
                Sold
              </p>

              <p className="text-[11px] font-medium">
                {formatNumber(
                  product.unitsSold ||
                  product.sold ||
                  product.quantity
                )}
              </p>

            </div>

          </div>

        ))

      )}

    </section>
  );
}


/* =========================================================
   LOW STOCK
========================================================= */

function LowStock({ products = [] }) {

  const navigate = useNavigate();

  return (
    <section className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">

      <div className="flex items-center justify-between mb-3">

        <h2 className="font-semibold text-[14px]">
          Low Stock Alerts
        </h2>

        <button
          onClick={() => navigate("/seller/inventory")}
          className="text-[11px] text-blue-600 font-medium"
        >
          View All
        </button>

      </div>


      {products.length === 0 ? (

        <div className="h-[350px] flex items-center justify-center text-sm text-emerald-500">
          All products have sufficient stock
        </div>

      ) : (

        products.map((product, index) => (

          <div
            key={product.variantId || product.id || index}
            className={`flex items-center gap-3 py-2.5 ${
              index !== products.length - 1
                ? "border-b border-slate-100"
                : ""
            }`}
          >

            <img
              src={product.image || "/placeholder-product.png"}
              alt={product.name || "Product"}
              className="w-10 h-10 rounded-lg object-cover border border-slate-100"
            />


            <div className="flex-1 min-w-0">

              <p className="text-[10px] font-medium truncate">
                {product.name || product.title}
              </p>

              <p className="text-[9px] text-slate-500 mt-1">
                {product.variant || product.variantName || "Default variant"}
              </p>

            </div>


            <p className="text-[10px] text-red-500 font-medium whitespace-nowrap">
              Stock: {formatNumber(product.stock)}
            </p>

          </div>

        ))

      )}

    </section>
  );
}


/* =========================================================
   MAIN DASHBOARD
========================================================= */

export default function SellerDashboard() {

  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [range, setRange] = useState("7d");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");


  /* =======================================================
     FETCH DASHBOARD
  ======================================================= */

  const fetchDashboard = async (isRefresh = false) => {

    try {

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await getSellerDashboard({
        range,
      });


      console.log("SELLER DASHBOARD RESPONSE:", response);


      if (!response?.success) {
        throw new Error(
          response?.message ||
          "Failed to load seller dashboard"
        );
      }


      setDashboard(response.data);

    } catch (error) {

      console.error("Dashboard error:", error);

      setError(
        error?.response?.data?.message ||
        error?.message ||
        "Unable to load dashboard"
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }

  };


  useEffect(() => {
    fetchDashboard();
  }, [range]);


  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(() => {

    if (!dashboard) return [];

    // IMPORTANT:
    // Backend sends `metrics`
    const metrics = dashboard.metrics || {};

    // Backend sends `trends`
    const trends = dashboard.trends || {};


    return [

      {
        title: "Total Orders",
        value: formatNumber(metrics.totalOrders),
        change: trends.orders || 0,
        icon: ShoppingBag,
        iconBg: "bg-blue-50",
        iconColor: "text-blue-600",
      },

      {
        title: "Total Revenue",
        value: formatCurrency(metrics.totalRevenue),
        change: trends.revenue || 0,
        icon: IndianRupee,
        iconBg: "bg-green-50",
        iconColor: "text-green-600",
      },

      {
        title: "Total Profit",
        value: formatCurrency(metrics.totalProfit),
        change: trends.profit || 0,
        icon: TrendingUp,
        iconBg: "bg-purple-50",
        iconColor: "text-purple-600",
      },

      {
        title: "Units Sold",
        value: formatNumber(metrics.unitsSold),
        change: trends.unitsSold || 0,
        icon: Package,
        iconBg: "bg-orange-50",
        iconColor: "text-orange-600",
      },

      {
        title: "Returns",
        value: formatNumber(metrics.returns),
        change: trends.returns || 0,
        icon: RotateCcw,
        iconBg: "bg-red-50",
        iconColor: "text-red-500",
      },

      {
        title: "Cancelled",
        value: formatNumber(metrics.cancelled),
        change: trends.cancelled || 0,
        icon: XCircle,
        iconBg: "bg-gray-100",
        iconColor: "text-gray-500",
      },

    ];

  }, [dashboard]);


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return <DashboardSkeleton />;
  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (error && !dashboard) {

    return (
      <DashboardError
        message={error}
        onRetry={() => fetchDashboard()}
      />
    );

  }


  if (!dashboard) {
    return null;
  }


  /* =======================================================
     BACKEND DATA
  ======================================================= */

  const metrics = dashboard.metrics || {};
  const trends = dashboard.trends || {};

  const selectedRange =
    RANGE_OPTIONS.find((item) => item.value === range) ||
    RANGE_OPTIONS[0];


  // Chart data backend se available nahi hai abhi
  const salesChartData =
    dashboard.salesOverview?.chart ||
    dashboard.salesChart ||
    [];


  return (

    <div className="min-h-screen bg-[#fbfcff] text-slate-900">

      <main className="px-6 py-6">


        {/* HEADER */}

        <div className="flex items-center justify-between mb-6">

          <div>

            <h1 className="text-[23px] font-semibold text-slate-900">
              Seller Dashboard 👋
            </h1>

            <p className="text-[13px] text-slate-500 mt-1">
              Here's what's happening with your business today.
            </p>

          </div>


          <div className="flex items-center gap-3">


            {/* REFRESH */}

            <button
              onClick={() => fetchDashboard(true)}
              disabled={refreshing}
              className="w-10 h-10 border border-slate-200 bg-white rounded-lg flex items-center justify-center shadow-sm hover:bg-slate-50 transition disabled:opacity-50"
            >

              {refreshing ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <RefreshCw size={16} />
              )}

            </button>


            {/* RANGE */}

            <div className="relative">

              <select
                value={range}
                onChange={(event) =>
                  setRange(event.target.value)
                }
                className="appearance-none border border-slate-200 bg-white rounded-lg pl-4 pr-10 py-2.5 text-[12px] font-medium shadow-sm outline-none cursor-pointer"
              >

                {RANGE_OPTIONS.map((option) => (

                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>

                ))}

              </select>


              <CalendarDays
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500"
              />

            </div>

          </div>

        </div>


        {/* ERROR */}

        {error && dashboard && (

          <div className="mb-4 bg-red-50 border border-red-100 text-red-600 rounded-lg px-4 py-3 text-sm flex items-center justify-between">

            <span>{error}</span>

            <button
              onClick={() => fetchDashboard(true)}
              className="font-medium underline"
            >
              Retry
            </button>

          </div>

        )}


        {/* STATS */}

        <div className="grid grid-cols-6 gap-4">

          {stats.map((stat) => (

            <StatCard
              key={stat.title}
              stat={stat}
            />

          ))}

        </div>


        {/* MIDDLE */}

        <div className="grid grid-cols-[1.75fr_1fr_1fr] gap-4 mt-5">


          {/* SALES */}

          <section className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">

            <div className="flex items-center justify-between">

              <h2 className="font-semibold text-[14px]">
                Sales Overview
              </h2>

              <span className="border border-slate-200 rounded-lg px-3 py-2 text-[11px]">
                {selectedRange.label}
              </span>

            </div>


            <div className="mt-4">

              <p className="text-[11px] text-slate-500">
                Total Revenue
              </p>


              <p className="text-[19px] font-semibold mt-1">
                {formatCurrency(metrics.totalRevenue)}
              </p>


              <p
                className={`text-[11px] mt-1 ${
                  Number(trends.revenue || 0) >= 0
                    ? "text-emerald-600"
                    : "text-red-500"
                }`}
              >

                {Number(trends.revenue || 0) >= 0 ? (

                  <ArrowUpRight
                    size={13}
                    className="inline"
                  />

                ) : (
                  <ArrowDownRight
                    size={13}
                    className="inline"
                  />
                )}
                {" "}
                {Math.abs(
                  Number(trends.revenue || 0)
                ).toFixed(1)}
                %
                <span className="text-slate-400 ml-1">
                  vs previous period
                </span>
              </p>
            </div>
            <SalesChart
              data={salesChartData}
            />
          </section>

          {/* ORDER STATUS */}
          <section className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-[14px]">
              Order Status
            </h2>
            <OrderStatusChart
              data={dashboard.orderStatus || []}
            />
          </section>

          {/* QUICK ACTIONS */}
          <section className="bg-white border border-slate-200/80 rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-[14px] mb-4">
              Quick Actions
            </h2>
            <QuickActions />
          </section>
        </div>


        {/* BOTTOM */}

        <div className="grid grid-cols-3 gap-4 mt-4">


          <RecentOrders
            orders={dashboard.recentOrders || []}
          />


          {/* IMPORTANT FIX */}
          <TopProducts
            products={dashboard.topSellingProducts || []}
          />


          <LowStock
            products={dashboard.lowStockProducts || []}
          />

        </div>


        {/* PROMOTION */}

        <div className="mt-4">

          <section className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-5">

            <div className="flex items-center gap-4">

              <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center">

                <Gift
                  size={28}
                  className="text-blue-600"
                />

              </div>


              <div className="flex-1">

                <h3 className="font-semibold text-[14px]">
                  Boost your sales! 🚀
                </h3>

                <p className="text-[11px] text-slate-500 mt-1">
                  Create offers and reach more customers.
                </p>

              </div>


              <button
                onClick={() =>
                  navigate("/seller/promotions")
                }
                className="bg-blue-600 text-white text-[11px] font-medium px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Promotion
              </button>

            </div>

          </section>

        </div>


      </main>

    </div>

  );
}