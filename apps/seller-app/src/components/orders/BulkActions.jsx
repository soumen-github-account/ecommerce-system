import {
  Truck,
  FileText,
  Printer,
  PackageCheck,
  Download,
} from "lucide-react";

const actions = [
  {
    title: "Generate Labels",
    icon: Truck,
    color: "bg-blue-600",
  },
  {
    title: "Invoices",
    icon: FileText,
    color: "bg-green-600",
  },
  {
    title: "Packing Slips",
    icon: Printer,
    color: "bg-purple-600",
  },
  {
    title: "Ready To Ship",
    icon: PackageCheck,
    color: "bg-orange-500",
  },
  {
    title: "Download",
    icon: Download,
    color: "bg-slate-700",
  },
];

export default function BulkActions({ selected }) {
  if (selected === 0) return null;

  return (
    <div className="bg-white border rounded-2xl p-4 mt-6 shadow-sm flex flex-wrap items-center justify-between gap-4">

      <div className="font-semibold">
        {selected} Orders Selected
      </div>

      <div className="flex flex-wrap gap-3">

        {actions.map((item) => {

          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className={`${item.color} text-white px-4 py-2 rounded-xl flex items-center gap-2`}
            >
              <Icon size={18} />

              {item.title}
            </button>
          );

        })}

      </div>

    </div>
  );
}