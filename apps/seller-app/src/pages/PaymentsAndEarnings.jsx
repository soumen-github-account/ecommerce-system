import React from "react";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Info,
  Landmark,
  MoreHorizontal,
  Search,
  Wallet,
  XCircle,
} from "lucide-react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PaymentsAndEarnings = () => {
  // ---------------------------------------------------------
  // MOCK DATA
  // Later replace these values with backend/API data
  // ---------------------------------------------------------

  const earningsData = [
    { date: "1 Aug", amount: 900 },
    { date: "3 Aug", amount: 1200 },
    { date: "5 Aug", amount: 1800 },
    { date: "6 Aug", amount: 2200 },
    { date: "8 Aug", amount: 1900 },
    { date: "10 Aug", amount: 2500 },
    { date: "12 Aug", amount: 2900 },
    { date: "14 Aug", amount: 2800 },
    { date: "16 Aug", amount: 3500 },
    { date: "18 Aug", amount: 3900 },
    { date: "20 Aug", amount: 3500 },
    { date: "21 Aug", amount: 4000 },
    { date: "23 Aug", amount: 3200 },
    { date: "25 Aug", amount: 3300 },
    { date: "27 Aug", amount: 2900 },
    { date: "29 Aug", amount: 3400 },
    { date: "31 Aug", amount: 4600 },
  ];

  const transactions = [
    {
      id: "#ORD10231",
      date: "08 Aug 2026, 10:30 AM",
      customer: "Rohan Kumar",
      paymentType: "Online",
      saleAmount: 1299,
      earnings: 1169,
      status: "Pending Settlement",
    },
    {
      id: "#ORD10227",
      date: "07 Aug 2026, 06:15 PM",
      customer: "Priya Singh",
      paymentType: "COD",
      saleAmount: 899,
      earnings: 809,
      status: "Settled",
    },
    {
      id: "#ORD10219",
      date: "06 Aug 2026, 11:20 AM",
      customer: "Amit Verma",
      paymentType: "Online",
      saleAmount: 2499,
      earnings: 2249,
      status: "Paid",
    },
    {
      id: "#ORD10205",
      date: "05 Aug 2026, 08:45 AM",
      customer: "Neha Patel",
      paymentType: "COD",
      saleAmount: 699,
      earnings: 629,
      status: "Refunded",
    },
    {
      id: "#ORD10198",
      date: "04 Aug 2026, 02:10 PM",
      customer: "Vikas Sharma",
      paymentType: "Online",
      saleAmount: 1599,
      earnings: 1439,
      status: "Paid",
    },
  ];

  const payouts = [
    {
      id: "PAY-10291",
      date: "05 Aug 2026",
      amount: 8450,
      bank: "HDFC Bank •••• 4521",
      method: "IMPS",
      status: "Successful",
      reference: "IMPS5267123456",
    },
    {
      id: "PAY-10243",
      date: "29 Jul 2026",
      amount: 6280,
      bank: "HDFC Bank •••• 4521",
      method: "IMPS",
      status: "Successful",
      reference: "IMPS5265832147",
    },
    {
      id: "PAY-10198",
      date: "22 Jul 2026",
      amount: 4920,
      bank: "HDFC Bank •••• 4521",
      method: "IMPS",
      status: "Successful",
      reference: "IMPS5264512789",
    },
  ];

  // ---------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------

  const formatCurrency = (value) => {
    return `₹${value.toLocaleString("en-IN")}`;
  };

  const statusStyle = (status) => {
    switch (status) {
      case "Paid":
      case "Successful":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";

      case "Settled":
        return "bg-blue-50 text-blue-600 border-blue-100";

      case "Pending Settlement":
        return "bg-amber-50 text-amber-600 border-amber-100";

      case "Refunded":
        return "bg-red-50 text-red-600 border-red-100";

      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  // ---------------------------------------------------------
  // COMPONENTS
  // ---------------------------------------------------------

  const SummaryCard = ({
    icon: Icon,
    title,
    amount,
    subtitle,
    iconBg,
    iconColor,
    trend,
    trendColor = "text-emerald-600",
  }) => {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className={`rounded-xl p-3 ${iconBg}`}>
            <Icon size={23} className={iconColor} />
          </div>

          <Info size={15} className="text-gray-400" />
        </div>

        <p className="mt-4 text-sm font-medium text-gray-500">{title}</p>

        <h3 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
          {amount}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-xs">
          {trend && (
            <span className={`flex items-center gap-1 font-semibold ${trendColor}`}>
              {trend.startsWith("-") ? (
                <ArrowDown size={13} />
              ) : (
                <ArrowUp size={13} />
              )}
              {trend}
            </span>
          )}

          <span className="text-gray-400">{subtitle}</span>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title, action }) => {
    return (
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          <Info size={15} className="text-gray-400" />
        </div>

        {action}
      </div>
    );
  };

  // ---------------------------------------------------------
  // UI
  // ---------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f7f8fa] p-4 sm:p-6 lg:p-7">
      <div className="mx-auto max-w-[1500px]">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Payments & Earnings
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Track your sales, earnings, settlements and payouts.
            </p>
          </div>

          <button className="flex h-11 items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <CalendarDays size={17} />

            <span>This Month (1 - 31 Aug 2026)</span>

            <ChevronDown size={16} />
          </button>
        </div>

        {/* =====================================================
            SUMMARY CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <SummaryCard
            icon={Wallet}
            title="Total Sales"
            amount="₹45,280"
            subtitle="vs Jul"
            trend="12.5%"
            iconBg="bg-blue-50"
            iconColor="text-blue-600"
          />

          <SummaryCard
            icon={Wallet}
            title="Net Earnings"
            amount="₹38,450"
            subtitle="vs Jul"
            trend="10.2%"
            iconBg="bg-emerald-50"
            iconColor="text-emerald-600"
          />

          <SummaryCard
            icon={Clock3}
            title="Pending Settlement"
            amount="₹6,280"
            subtitle="4 orders"
            trend={null}
            iconBg="bg-amber-50"
            iconColor="text-amber-600"
          />

          <SummaryCard
            icon={Landmark}
            title="Paid Out"
            amount="₹32,170"
            subtitle="This month"
            trend={null}
            iconBg="bg-purple-50"
            iconColor="text-purple-600"
          />

        </div>

        {/* =====================================================
            CHART + AVAILABLE PAYOUT
        ====================================================== */}

        <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)]">

          {/* Earnings Overview */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <SectionHeader
              title="Earnings Overview"
              action={
                <button className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
                  Last 30 Days
                  <ChevronDown size={14} />
                </button>
              }
            />

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={earningsData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <defs>
                    <linearGradient
                      id="earningsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="0%"
                        stopColor="#2563eb"
                        stopOpacity={0.2}
                      />
                      <stop
                        offset="100%"
                        stopColor="#2563eb"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    stroke="#e5e7eb"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#9ca3af",
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#9ca3af",
                      fontSize: 11,
                    }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                  />

                  <Tooltip
                    formatter={(value) => [
                      formatCurrency(value),
                      "Earnings",
                    ]}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fill="url(#earningsGradient)"
                    dot={{
                      r: 3,
                      fill: "#2563eb",
                      strokeWidth: 0,
                    }}
                    activeDot={{
                      r: 5,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Chart Bottom Stats */}

            <div className="mt-4 grid grid-cols-2 divide-x divide-gray-200 rounded-xl border border-gray-200 bg-gray-50 sm:grid-cols-4">

              <div className="p-4">
                <p className="text-xs text-gray-500">Total Sales</p>
                <p className="mt-1 font-semibold text-gray-900">₹45,280</p>
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-500">Net Earnings</p>
                <p className="mt-1 font-semibold text-emerald-600">
                  ₹38,450
                </p>
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-500">Orders</p>
                <p className="mt-1 font-semibold text-gray-900">152</p>
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-500">Avg Order Value</p>
                <p className="mt-1 font-semibold text-gray-900">₹1,299</p>
              </div>

            </div>
          </div>

          {/* Available for payout */}

          <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/60 p-5 shadow-sm">

            <SectionHeader title="Available for Payout" />

            <p className="text-3xl font-bold text-emerald-600">
              ₹12,450
            </p>

            <p className="mt-3 max-w-[220px] text-sm leading-6 text-gray-500">
              Money available to be paid to your bank account
            </p>

            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700">
              <ArrowUp size={17} />
              Withdraw Now
            </button>

            <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Eye size={17} />
              View Payouts
            </button>

            <div className="mt-6 border-t border-emerald-100 pt-5">
              <div className="flex gap-3">
                <div className="rounded-lg bg-white p-2 shadow-sm">
                  <CalendarDays
                    size={18}
                    className="text-emerald-600"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Next automatic payout
                  </p>

                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    12 Sep 2026
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            BREAKDOWN / SETTLEMENT / PAYOUT SUMMARY
        ====================================================== */}

        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">

          {/* Earnings Breakdown */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <SectionHeader title="Earnings Breakdown" />

            <div className="space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-600">Gross Sales</span>
                <span className="font-medium text-gray-900">
                  ₹45,280
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Commission (10%)</span>
                <span className="font-medium text-red-500">
                  - ₹4,528
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping Charges</span>
                <span className="font-medium text-red-500">
                  - ₹800
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">
                  Payment Gateway Charges
                </span>
                <span className="font-medium text-red-500">
                  - ₹320
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Refunds</span>
                <span className="font-medium text-red-500">
                  - ₹900
                </span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">
                    Net Earnings
                  </span>

                  <span className="text-lg font-bold text-emerald-600">
                    ₹38,732
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Settlement Overview */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <SectionHeader title="Settlement Overview" />

            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">

              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">
                    Pending Settlement
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    ₹6,280
                  </p>
                </div>

                <div className="rounded-full bg-white p-2">
                  <Clock3
                    size={18}
                    className="text-amber-500"
                  />
                </div>
              </div>

              <p className="mt-2 text-xs text-gray-500">
                4 orders are waiting for settlement
              </p>
            </div>

            <div className="mt-4 rounded-xl border border-gray-200 p-4">

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-blue-50 p-2">
                  <CalendarDays
                    size={18}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-500">
                    Next Settlement Date
                  </p>

                  <p className="mt-1 font-semibold text-gray-900">
                    12 Sep 2026
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Orders delivered till 5 Sep 2026
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Payout Summary */}

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

            <SectionHeader title="Payout Summary" />

            <div className="flex items-center gap-5">

              {/* Donut */}

              <div className="relative h-36 w-36 shrink-0">
                <div
                  className="h-full w-full rounded-full"
                  style={{
                    background:
                      "conic-gradient(#10b981 0% 56%, #3b82f6 56% 89%, #f59e0b 89% 97%, #8b5cf6 97% 100%)",
                  }}
                />

                <div className="absolute inset-[18px] flex flex-col items-center justify-center rounded-full bg-white">
                  <span className="text-lg font-bold text-gray-900">
                    ₹32,170
                  </span>

                  <span className="text-[10px] text-gray-500">
                    Total Payout
                  </span>

                  <span className="text-[10px] text-gray-500">
                    This Month
                  </span>
                </div>
              </div>

              {/* Legend */}

              <div className="space-y-3 text-xs">

                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                  <div>
                    <p className="text-gray-600">
                      Online Payments
                    </p>
                    <p className="font-medium text-gray-900">
                      ₹18,240 (56%)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                  <div>
                    <p className="text-gray-600">
                      COD Payments
                    </p>
                    <p className="font-medium text-gray-900">
                      ₹10,560 (33%)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-amber-500" />
                  <div>
                    <p className="text-gray-600">
                      Refund Adjustments
                    </p>
                    <p className="font-medium text-gray-900">
                      ₹1,370 (8%)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-purple-500" />
                  <div>
                    <p className="text-gray-600">
                      Other Adjustments
                    </p>
                    <p className="font-medium text-gray-900">
                      ₹0 (0%)
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            RECENT TRANSACTIONS
        ====================================================== */}

        <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="border-b border-gray-200 p-5">

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

              <h2 className="text-base font-semibold text-gray-900">
                Recent Transactions
              </h2>

              <div className="flex flex-wrap gap-2">

                {/* Status */}

                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">
                  All Status
                  <ChevronDown size={13} />
                </button>

                {/* Payment type */}

                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">
                  All Payment Types
                  <ChevronDown size={13} />
                </button>

                {/* Date */}

                <button className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-600 hover:bg-gray-50">
                  <CalendarDays size={14} />
                  1 Aug - 31 Aug 2026
                  <ChevronDown size={13} />
                </button>

                {/* Search */}

                <div className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3">
                  <Search size={14} className="text-gray-400" />

                  <input
                    type="text"
                    placeholder="Search Order ID"
                    className="w-28 bg-transparent text-xs outline-none placeholder:text-gray-400 sm:w-36"
                  />
                </div>

              </div>
            </div>
          </div>

          {/* Table */}

          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px] text-left">

              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">

                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Order ID
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Date
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Customer
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Payment Type
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Sale Amount
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Earnings
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {transactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-gray-100 transition hover:bg-gray-50"
                  >

                    <td className="px-5 py-4">
                      <button className="text-sm font-semibold text-blue-600 hover:underline">
                        {transaction.id}
                      </button>
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-600">
                      {transaction.date}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-700">
                      {transaction.customer}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-md border px-2 py-1 text-[11px] font-medium ${
                          transaction.paymentType === "Online"
                            ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                            : "border-blue-100 bg-blue-50 text-blue-600"
                        }`}
                      >
                        {transaction.paymentType}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-gray-900">
                      {formatCurrency(transaction.saleAmount)}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(transaction.earnings)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-md border px-2 py-1 text-[11px] font-medium ${statusStyle(
                          transaction.status
                        )}`}
                      >
                        {transaction.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                        <Eye size={16} />
                      </button>
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          {/* Pagination */}

          <div className="flex flex-col gap-3 border-t border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs text-gray-500">
              Showing 1 to 5 of 25 transactions
            </p>

            <div className="flex items-center gap-1">

              <button className="rounded-lg border border-gray-200 p-2 text-gray-400 hover:bg-gray-50">
                <ChevronLeft size={15} />
              </button>

              <button className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white">
                1
              </button>

              <button className="rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-gray-100">
                2
              </button>

              <button className="rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-gray-100">
                3
              </button>

              <span className="px-2 text-gray-400">...</span>

              <button className="rounded-lg px-3 py-2 text-xs text-gray-600 hover:bg-gray-100">
                5
              </button>

              <button className="rounded-lg border border-gray-200 p-2 text-gray-600 hover:bg-gray-50">
                <ChevronRight size={15} />
              </button>

            </div>
          </div>
        </div>

        {/* =====================================================
            PAYOUT HISTORY
        ====================================================== */}

        <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          <div className="flex items-center justify-between border-b border-gray-200 p-5">

            <h2 className="text-base font-semibold text-gray-900">
              Payout History
            </h2>

            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
              View All →
            </button>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] text-left">

              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">

                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Payout ID
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Date
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Amount
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Paid To
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Method
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-xs font-semibold text-gray-500">
                    Reference ID
                  </th>

                </tr>
              </thead>

              <tbody>

                {payouts.map((payout) => (
                  <tr
                    key={payout.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >

                    <td className="px-5 py-4">
                      <button className="text-sm font-semibold text-blue-600 hover:underline">
                        {payout.id}
                      </button>
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {payout.date}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">
                      {formatCurrency(payout.amount)}
                    </td>

                    <td className="px-5 py-4 text-sm text-gray-600">
                      {payout.bank}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-md border border-purple-100 bg-purple-50 px-2 py-1 text-[11px] font-medium text-purple-600">
                        {payout.method}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-md border border-emerald-100 bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-600">
                        <CheckCircle2 size={12} />
                        {payout.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-500">
                      {payout.reference}
                    </td>

                  </tr>
                ))}

              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaymentsAndEarnings;