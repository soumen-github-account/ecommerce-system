import React from "react";
import Chart from "react-apexcharts";

const SalesOverview = () => {
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },

    stroke: {
      curve: "smooth",
      width: 4,
    },

    colors: ["#3b82f6"],

    dataLabels: {
      enabled: false,
    },

    grid: {
      borderColor: "#E5E7EB",
      strokeDashArray: 5,
    },

    xaxis: {
      categories: [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
      ],
    },

    yaxis: {
      labels: {
        formatter: (value) => "₹" + value.toLocaleString(),
      },
    },

    fill: {
      type: "gradient",

      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
      },
    },

    tooltip: {
      y: {
        formatter: (value) => "₹" + value.toLocaleString(),
      },
    },
  };

  const series = [
    {
      name: "Sales",

      data: [
        30000,
        50000,
        100000,
        80000,
        150000,
        110000,
        180000,
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-bold">
            Sales Overview
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Revenue Performance
          </p>

        </div>

        <div className="flex gap-2">

          <button className="px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-medium">
            Last 7 Days
          </button>

          <button className="px-4 py-2 rounded-lg border">
            Last 30 Days
          </button>

        </div>

      </div>

      <Chart
        options={options}
        series={series}
        type="area"
        height={350}
      />

    </div>
  );
};

export default SalesOverview;