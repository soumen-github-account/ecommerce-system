// import {
//   ShoppingBag,
//   Clock3,
//   CheckCircle2,
//   Package,
//   Truck,
//   Bike,
//   RotateCcw,
//   XCircle,
// } from "lucide-react";

// const cardConfig = [
//   {
//     key: "total",
//     title: "Total Orders",
//     icon: ShoppingBag,
//     iconBg: "bg-[#eaf1ff]",
//     iconColor: "text-[#1769e0]",
//   },
//   {
//     key: "pending",
//     title: "Pending",
//     icon: Clock3,
//     iconBg: "bg-[#fff5df]",
//     iconColor: "text-[#f59e0b]",
//   },
//   {
//     key: "confirmed",
//     title: "Confirmed",
//     icon: CheckCircle2,
//     iconBg: "bg-[#eaf8ef]",
//     iconColor: "text-[#16a66a]",
//   },
//   {
//     key: "packed",
//     title: "Packed",
//     icon: Package,
//     iconBg: "bg-[#f4eaff]",
//     iconColor: "text-[#7c3aed]",
//   },
//   {
//     key: "readyToShip",
//     title: "Ready to Ship",
//     icon: Truck,
//     iconBg: "bg-[#eaf1ff]",
//     iconColor: "text-[#1769e0]",
//   },
//   {
//     key: "shipped",
//     title: "Shipped",
//     icon: Bike,
//     iconBg: "bg-[#e9f9f4]",
//     iconColor: "text-[#10a981]",
//   },
//   {
//     key: "returns",
//     title: "Returns",
//     icon: RotateCcw,
//     iconBg: "bg-[#fff0f0]",
//     iconColor: "text-[#ef4444]",
//   },
//   {
//     key: "cancelled",
//     title: "Cancelled",
//     icon: XCircle,
//     iconBg: "bg-[#fff0f0]",
//     iconColor: "text-[#ef4444]",
//   },
// ];

// export default function OrderStats({ stats = {} }) {

//   const values = {
//     total: stats.total ?? 0,
//     pending: stats.pending ?? 0,
//     confirmed: stats.confirmed ?? 0,
//     packed: stats.packed ?? 0,
//     readyToShip: stats.readyToShip ?? 0,
//     shipped: stats.shipped ?? 0,
//     returns: stats.returns ?? 0,
//     cancelled: stats.cancelled ?? 0,
//   };

//   const changes = stats.changes || {};

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 mt-8">

//       {cardConfig.map((card) => {

//         const Icon = card.icon;

//         const change =
//           Number(changes[card.key] ?? 0);

//         const isPositive = change >= 0;

//         return (
//           <div
//             key={card.key}
//             className="min-h-[114px] bg-white border border-[#e4e8ef] rounded-xl px-4 py-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.02)]"
//           >

//             <div className="flex items-start justify-between gap-2">

//               <div className="min-w-0">

//                 <p className="text-[11px] text-[#596780] whitespace-nowrap">
//                   {card.title}
//                 </p>

//                 <h2 className="text-[24px] leading-7 font-semibold text-[#17233d] mt-2">
//                   {values[card.key]}
//                 </h2>

//               </div>

//               <div
//                 className={`
//                   w-[44px]
//                   h-[44px]
//                   rounded-full
//                   flex
//                   items-center
//                   justify-center
//                   shrink-0
//                   ${card.iconBg}
//                   ${card.iconColor}
//                 `}
//               >
//                 <Icon
//                   size={21}
//                   strokeWidth={1.8}
//                 />
//               </div>

//             </div>

//             <div className="mt-3 text-[9px] whitespace-nowrap">

//               <span
//                 className={
//                   isPositive
//                     ? "text-[#12a66a] font-medium"
//                     : "text-[#ef4444] font-medium"
//                 }
//               >
//                 {isPositive ? "↑" : "↓"} {Math.abs(change)}%
//               </span>

//               <span className="text-[#667085] ml-1">
//                 vs last 7 days
//               </span>

//             </div>

//           </div>
//         );
//       })}

//     </div>
//   );
// }

import {
  ShoppingBag,
  Clock3,
  CheckCircle2,
  Package,
  Truck,
  Bike,
  RotateCcw,
  XCircle,
} from "lucide-react";

const cardConfig = [
  {
    key: "total",
    title: "Total Orders",
    icon: ShoppingBag,
    iconBg: "bg-[#eaf1ff]",
    iconColor: "text-[#1769e0]",
  },
  {
    key: "pending",
    title: "Pending",
    icon: Clock3,
    iconBg: "bg-[#fff5df]",
    iconColor: "text-[#f59e0b]",
  },
  {
    key: "confirmed",
    title: "Confirmed",
    icon: CheckCircle2,
    iconBg: "bg-[#eaf8ef]",
    iconColor: "text-[#16a66a]",
  },
  {
    key: "packed",
    title: "Packed",
    icon: Package,
    iconBg: "bg-[#f4eaff]",
    iconColor: "text-[#7c3aed]",
  },
  {
    key: "readyToShip",
    title: "Ready to Ship",
    icon: Truck,
    iconBg: "bg-[#eaf1ff]",
    iconColor: "text-[#1769e0]",
  },
  {
    key: "shipped",
    title: "Shipped",
    icon: Bike,
    iconBg: "bg-[#e9f9f4]",
    iconColor: "text-[#10a981]",
  },
  {
    key: "returns",
    title: "Returns",
    icon: RotateCcw,
    iconBg: "bg-[#fff0f0]",
    iconColor: "text-[#ef4444]",
  },
  {
    key: "cancelled",
    title: "Cancelled",
    icon: XCircle,
    iconBg: "bg-[#fff0f0]",
    iconColor: "text-[#ef4444]",
  },
];

export default function OrderStats({ stats = {} }) {

  const values = {
    total: stats?.total ?? 0,
    pending: stats?.pending ?? 0,
    confirmed: stats?.confirmed ?? 0,
    packed: stats?.packed ?? 0,
    readyToShip: stats?.readyToShip ?? 0,
    shipped: stats?.shipped ?? 0,
    returns: stats?.returns ?? 0,
    cancelled: stats?.cancelled ?? 0,
  };

  const changes = stats?.changes || {};

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 mt-8">

      {cardConfig.map((card) => {

        const Icon = card.icon;

        const change = Number(
          changes?.[card.key] ?? 0
        );

        const isPositive = change >= 0;

        return (
          <div
            key={card.key}
            className="min-h-[114px] bg-white border border-[#e4e8ef] rounded-xl px-4 py-3.5 shadow-[0_1px_2px_rgba(16,24,40,0.02)]"
          >

            <div className="flex items-start justify-between gap-2">

              <div className="min-w-0">

                <p className="text-[11px] text-[#596780] whitespace-nowrap">
                  {card.title}
                </p>

                <h2 className="text-[24px] leading-7 font-semibold text-[#17233d] mt-2">
                  {values[card.key]}
                </h2>

              </div>

              <div
                className={`
                  w-[44px]
                  h-[44px]
                  rounded-full
                  flex
                  items-center
                  justify-center
                  shrink-0
                  ${card.iconBg}
                  ${card.iconColor}
                `}
              >
                <Icon
                  size={21}
                  strokeWidth={1.8}
                />
              </div>

            </div>

            <div className="mt-3 text-[9px] whitespace-nowrap">

              <span
                className={
                  isPositive
                    ? "text-[#12a66a] font-medium"
                    : "text-[#ef4444] font-medium"
                }
              >
                {isPositive ? "↑" : "↓"}{" "}
                {Math.abs(change)}%
              </span>

              <span className="text-[#667085] ml-1">
                vs last 7 days
              </span>

            </div>

          </div>
        );
      })}

    </div>
  );
}