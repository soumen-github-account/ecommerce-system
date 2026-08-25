
// import { useState } from "react";
// import {
//   Search,
//   Filter,
//   RotateCcw,
//   CalendarDays,
//   ChevronDown,
// } from "lucide-react";

// export default function OrderFilters({ fetchOrders }) {
//   const [search, setSearch] = useState("");
//   const [status, setStatus] = useState("");
//   const [courier, setCourier] = useState("");
//   const [paymentStatus, setPaymentStatus] = useState("");
//   const [date, setDate] = useState("");

//   const handleApply = () => {
//     if (!fetchOrders) return;

//     fetchOrders({
//       search,
//       status,
//       courier,
//       paymentStatus,
//       date,
//     });
//   };

//   const handleReset = () => {
//     setSearch("");
//     setStatus("");
//     setCourier("");
//     setPaymentStatus("");
//     setDate("");

//     if (fetchOrders) {
//       fetchOrders({});
//     }
//   };

//   return (
//     <div className="bg-white border border-[#e3e7ee] rounded-xl mt-5 p-3">

//       <div className="flex flex-col xl:flex-row items-stretch gap-3">

//         {/* SEARCH */}
//         <div className="relative flex-1 min-w-[250px]">

//           <Search
//             size={17}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]"
//           />

//           <input
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search Order ID, Customer, Product..."
//             className="w-full h-[38px] rounded-lg border border-[#dfe4ec] pl-10 pr-4 text-[11px] text-[#344054] outline-none focus:border-[#1769e0] focus:ring-2 focus:ring-blue-50 placeholder:text-[#7c8799]"
//           />

//         </div>

//         {/* STATUS */}
//         <div className="relative min-w-[150px]">
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="appearance-none w-full h-[38px] border border-[#dfe4ec] rounded-lg px-3 pr-9 text-[11px] text-[#17233d] bg-white outline-none focus:border-[#1769e0]"
//           >
//             <option value="">Order Status</option>
//             <option value="PENDING">Pending</option>
//             <option value="CONFIRMED">Confirmed</option>
//             <option value="PACKED">Packed</option>
//             <option value="READY_TO_SHIP">Ready to Ship</option>
//             <option value="SHIPPED">Shipped</option>
//             <option value="DELIVERED">Delivered</option>
//             <option value="CANCELLED">Cancelled</option>
//           </select>

//           <ChevronDown
//             size={14}
//             className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]"
//           />
//         </div>

//         {/* COURIER */}
//         <div className="relative min-w-[165px]">
//           <select
//             value={courier}
//             onChange={(e) => setCourier(e.target.value)}
//             className="appearance-none w-full h-[38px] border border-[#dfe4ec] rounded-lg px-3 pr-9 text-[11px] text-[#17233d] bg-white outline-none focus:border-[#1769e0]"
//           >
//             <option value="">Courier Partner</option>
//             <option value="Delhivery">Delhivery</option>
//             <option value="Ekart Logistics">Ekart Logistics</option>
//             <option value="Xpressbees">Xpressbees</option>
//             <option value="Blue Dart">Blue Dart</option>
//           </select>

//           <ChevronDown
//             size={14}
//             className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]"
//           />
//         </div>

//         {/* PAYMENT */}
//         <div className="relative min-w-[165px]">
//           <select
//             value={paymentStatus}
//             onChange={(e) => setPaymentStatus(e.target.value)}
//             className="appearance-none w-full h-[38px] border border-[#dfe4ec] rounded-lg px-3 pr-9 text-[11px] text-[#17233d] bg-white outline-none focus:border-[#1769e0]"
//           >
//             <option value="">Payment Status</option>
//             <option value="SUCCESS">Paid</option>
//             <option value="PENDING">Pending</option>
//             <option value="FAILED">Failed</option>
//             <option value="REFUNDED">Refunded</option>
//           </select>

//           <ChevronDown
//             size={14}
//             className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]"
//           />
//         </div>

//         {/* DATE */}
//         <div className="relative min-w-[180px]">

//           <CalendarDays
//             size={15}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none"
//           />

//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="w-full h-[38px] border border-[#dfe4ec] rounded-lg px-3 pr-10 text-[11px] text-[#17233d] outline-none focus:border-[#1769e0]"
//           />

//         </div>

//         {/* FILTER */}
//         <button
//           type="button"
//           onClick={handleApply}
//           className="h-[38px] px-4 rounded-lg border border-[#dfe4ec] bg-white hover:bg-gray-50 text-[11px] font-medium text-[#344054] flex items-center justify-center gap-2"
//         >
//           <Filter size={14} />
//           Filters
//         </button>

//         {/* RESET */}
//         <button
//           type="button"
//           onClick={handleReset}
//           className="h-[38px] px-4 rounded-lg border border-[#dfe4ec] bg-white hover:bg-gray-50 text-[11px] font-medium text-[#344054]"
//         >
//           Reset
//         </button>

//       </div>
//     </div>
//   );
// }
import { useState } from "react";

import {
  Search,
  Filter,
  RotateCcw,
  CalendarDays,
  ChevronDown,
} from "lucide-react";

export default function OrderFilters({
  applyFilters,
  resetFilters,
}) {

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [courier, setCourier] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [date, setDate] = useState("");

  //--------------------------------------------------
  // APPLY
  //--------------------------------------------------

  const handleApply = () => {

    const filters = {
      search: search.trim(),
      status,
      courier,
      paymentStatus,
      date,
    };

    console.log(
      "[ORDER FILTER UI] APPLY:",
      filters
    );

    if (applyFilters) {
      applyFilters(filters);
    }
  };

  //--------------------------------------------------
  // RESET
  //--------------------------------------------------

  const handleReset = () => {

    setSearch("");
    setStatus("");
    setCourier("");
    setPaymentStatus("");
    setDate("");

    if (resetFilters) {
      resetFilters();
    }
  };

  return (
    <div className="bg-white border border-[#e3e7ee] rounded-xl mt-5 p-3">

      <div className="flex flex-col xl:flex-row items-stretch gap-3">

        {/* SEARCH */}

        <div className="relative flex-1 min-w-[250px]">

          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#667085]"
          />

          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search Order ID, Customer, Product..."
            className="w-full h-[38px] rounded-lg border border-[#dfe4ec] pl-10 pr-4 text-[11px] text-[#344054] outline-none focus:border-[#1769e0] focus:ring-2 focus:ring-blue-50 placeholder:text-[#7c8799]"
          />

        </div>

        {/* STATUS */}

        <div className="relative min-w-[150px]">

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="appearance-none w-full h-[38px] border border-[#dfe4ec] rounded-lg px-3 pr-9 text-[11px] text-[#17233d] bg-white outline-none focus:border-[#1769e0]"
          >

            <option value="">
              Order Status
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="CONFIRMED">
              Confirmed
            </option>

            <option value="PACKED">
              Packed
            </option>

            <option value="READY_TO_SHIP">
              Ready to Ship
            </option>

            <option value="SHIPPED">
              Shipped
            </option>

            <option value="DELIVERED">
              Delivered
            </option>

            <option value="CANCELLED">
              Cancelled
            </option>

          </select>

          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]"
          />

        </div>

        {/* COURIER */}

        <div className="relative min-w-[165px]">

          <select
            value={courier}
            onChange={(e) =>
              setCourier(e.target.value)
            }
            className="appearance-none w-full h-[38px] border border-[#dfe4ec] rounded-lg px-3 pr-9 text-[11px] text-[#17233d] bg-white outline-none focus:border-[#1769e0]"
          >

            <option value="">
              Courier Partner
            </option>

            <option value="Delhivery">
              Delhivery
            </option>

            <option value="Ekart Logistics">
              Ekart Logistics
            </option>

            <option value="Xpressbees">
              Xpressbees
            </option>

            <option value="Blue Dart">
              Blue Dart
            </option>

          </select>

          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]"
          />

        </div>

        {/* PAYMENT */}

        <div className="relative min-w-[165px]">

          <select
            value={paymentStatus}
            onChange={(e) =>
              setPaymentStatus(e.target.value)
            }
            className="appearance-none w-full h-[38px] border border-[#dfe4ec] rounded-lg px-3 pr-9 text-[11px] text-[#17233d] bg-white outline-none focus:border-[#1769e0]"
          >

            <option value="">
              Payment Status
            </option>

            <option value="SUCCESS">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>

          </select>

          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#667085]"
          />

        </div>

        {/* DATE */}

        <div className="relative min-w-[180px]">

          <CalendarDays
            size={15}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#667085] pointer-events-none"
          />

          <input
            type="date"
            value={date}
            onChange={(e) =>
              setDate(e.target.value)
            }
            className="w-full h-[38px] border border-[#dfe4ec] rounded-lg px-3 pr-10 text-[11px] text-[#17233d] outline-none focus:border-[#1769e0]"
          />

        </div>

        {/* APPLY */}

        <button
          type="button"
          onClick={handleApply}
          className="h-[38px] px-4 rounded-lg border border-[#dfe4ec] bg-white hover:bg-gray-50 text-[11px] font-medium text-[#344054] flex items-center justify-center gap-2"
        >

          <Filter size={14} />

          Filters

        </button>

        {/* RESET */}

        <button
          type="button"
          onClick={handleReset}
          className="h-[38px] px-4 rounded-lg border border-[#dfe4ec] bg-white hover:bg-gray-50 text-[11px] font-medium text-[#344054] flex items-center justify-center gap-2"
        >

          <RotateCcw size={14} />

          Reset

        </button>

      </div>

    </div>
  );
}