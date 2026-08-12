import Chart from "react-apexcharts";

export default function OrderStatus() {
  const series = [10, 20, 20, 50];

  const options = {
    chart: {
      type: "donut",
    },

    labels: [
      "Pending",
      "Packed",
      "Shipped",
      "Delivered",
    ],

    colors: [
      "#f59e0b",
      "#1d4ed8",
      "#3b82f6",
      "#10b981",
    ],

    legend: {
      position: "right",
      fontSize: "14px",
    },

    dataLabels: {
      enabled: true,
    },

    stroke: {
      colors: ["#fff"],
    },

    plotOptions: {
      pie: {
        donut: {
          size: "35%",
        },
      },
    },

    responsive: [
      {
        breakpoint: 768,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      <h2 className="text-2xl font-bold mb-6">
        Order Status
      </h2>

      <Chart
        options={options}
        series={series}
        type="donut"
        height={320}
      />

    </div>
  );
}