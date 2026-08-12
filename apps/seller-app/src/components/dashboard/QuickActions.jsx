import {
  Plus,
  Boxes,
  ClipboardList,
  RefreshCw,
  BadgePercent,
  Wallet,
} from "lucide-react";

const actions = [
  {
    title: "Add Product",
    icon: Plus,
  },
  {
    title: "Manage Inventory",
    icon: Boxes,
  },
  {
    title: "View Orders",
    icon: ClipboardList,
  },
  {
    title: "Update Stock",
    icon: RefreshCw,
  },
  {
    title: "Create Discount",
    icon: BadgePercent,
  },
  {
    title: "Withdrawal",
    icon: Wallet,
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      <h2 className="text-2xl font-bold mb-6">
        Quick Actions
      </h2>

      <div className="grid grid-cols-3 gap-4">

        {actions.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className="group border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
            >
              <Icon
                size={30}
                className="group-hover:text-blue-600"
              />

              <p className="text-sm font-medium text-center leading-5">
                {item.title}
              </p>
            </button>
          );
        })}

      </div>

    </div>
  );
}