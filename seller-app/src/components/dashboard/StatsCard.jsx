import { ArrowUpRight } from "lucide-react";

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconBg = "bg-blue-100",
  iconColor = "text-blue-600",
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-3">
            {value}
          </h2>

          <div className="flex items-center gap-1 mt-4 text-green-600 text-sm font-medium">

            <ArrowUpRight size={16} />

            {change}

          </div>

        </div>

        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBg}`}
        >
          <Icon
            size={26}
            className={iconColor}
          />
        </div>

      </div>

    </div>
  );
}