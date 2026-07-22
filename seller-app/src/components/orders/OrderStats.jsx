import {
    ShoppingCart,
    Package,
    Truck,
    IndianRupee,
    RotateCcw,
    XCircle
} from "lucide-react";

const cards = [
    {
        title: "Today's Orders",
        value: "52",
        color: "bg-blue-600",
        icon: ShoppingCart
    },
    {
        title: "Today's Revenue",
        value: "₹41,280",
        color: "bg-green-600",
        icon: IndianRupee
    },
    {
        title: "Pending",
        value: "15",
        color: "bg-yellow-500",
        icon: Package
    },
    {
        title: "Ready To Ship",
        value: "11",
        color: "bg-purple-600",
        icon: Truck
    },
    {
        title: "Cancelled",
        value: "3",
        color: "bg-red-500",
        icon: XCircle
    },
    {
        title: "Returns",
        value: "4",
        color: "bg-orange-500",
        icon: RotateCcw
    }
];

export default function OrderStats() {

    return (

        <div className="grid xl:grid-cols-6 lg:grid-cols-3 md:grid-cols-2 gap-5 mt-8">

            {cards.map((card, index) => {

                const Icon = card.icon;

                return (

                    <div
                        key={index}
                        className={`${card.color} rounded-2xl text-white p-5 shadow-lg`}
                    >

                        <div className="flex justify-between">

                            <div>

                                <p className="text-sm opacity-80">
                                    {card.title}
                                </p>

                                <h2 className="text-3xl font-bold mt-2">
                                    {card.value}
                                </h2>

                            </div>

                            <Icon size={34} />

                        </div>

                    </div>

                );
            })}

        </div>

    );
}