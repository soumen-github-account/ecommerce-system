import {
    Package,
    CheckCircle2,
    Clock3,
    Truck,
    XCircle,
    RotateCcw
} from "lucide-react";

const menus = [
    ["All Orders", 124, Package],
    ["Pending", 15, Clock3],
    ["Confirmed", 28, CheckCircle2],
    ["Packed", 18, Package],
    ["Ready To Ship", 11, Truck],
    ["Shipped", 26, Truck],
    ["Delivered", 22, CheckCircle2],
    ["Cancelled", 3, XCircle],
    ["Returns", 4, RotateCcw]
];

export default function OrderSidebar() {
    return (

        <aside className="w-72 bg-white border-r min-h-screen">

            <div className="p-6 border-b">

                <h2 className="text-xl font-bold">
                    Orders
                </h2>

            </div>

            <div className="p-4 space-y-2">

                {menus.map(([title, count, Icon], index) => (

                    <button
                        key={index}
                        className={`w-full flex justify-between items-center p-3 rounded-xl transition
              ${index === 0
                                ? "bg-blue-600 text-white"
                                : "hover:bg-gray-100"
                            }`}
                    >

                        <div className="flex items-center gap-3">

                            <Icon size={18} />

                            <span>{title}</span>

                        </div>

                        <span className="font-semibold">
                            {count}
                        </span>

                    </button>

                ))}

            </div>

        </aside>

    );
}