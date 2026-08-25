
// import OrderStats from "../components/orders/OrderStats";
// import OrderFilters from "../components/orders/OrderFilters";
// import OrdersTable from "../components/orders/OrdersTable";
// import useSellerOrders from "../hooks/useSellerOrders";
// import { Download, ChevronDown } from "lucide-react";

// export default function OrdersDashboard() {
//   const {
//     state,
//     fetchOrders,
//     openShipmentModal,
//     closeShipmentModal,
//     handleGenerateShipment,
//     handleDownloadLabel,
//     handleReadyToShip,
//     handleSchedulePickup,
//     handlePickedUp,
//     handleInTransit,
//     handleOutForDelivery,
//     handleDelivered,
//     applyFilters,
//     resetFilters
//   } = useSellerOrders();

//   return (
//     <div className="min-h-screen bg-[#f8fafc]">
//       <main className="w-full px-6 py-6">

//         {/* ================= HEADER ================= */}
//         <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

//           <div>
//             <h1 className="text-[26px] leading-8 font-semibold tracking-[-0.5px] text-[#10203f]">
//               Orders Management
//             </h1>

//             <p className="mt-1 text-[13px] text-[#667085]">
//               Track, manage and process your orders efficiently
//             </p>
//           </div>

//           <div className="flex items-center gap-3">

//             <button
//               type="button"
//               className="h-[43px] px-5 rounded-lg border border-[#dfe4ec] bg-white text-[13px] font-medium text-[#17233d] hover:bg-gray-50 transition"
//             >
//               Import Orders
//             </button>

//             <button
//               type="button"
//               className="h-[43px] px-4 rounded-lg bg-[#1769e0] hover:bg-[#125bc3] text-white text-[13px] font-medium flex items-center gap-3 transition"
//             >
//               <Download size={16} />

//               <span>Export Orders</span>

//               <ChevronDown size={15} />
//             </button>

//           </div>
//         </div>

//         {/* ================= STATS ================= */}
//         <OrderStats
//           orders={state?.orders || []}
//           stats={state?.stats}
//         />

//         {/* ================= FILTERS ================= */}
//         <OrderFilters
//           applyFilters={applyFilters}
//           resetFilters={resetFilters}
//         />

//         {/* ================= TABLE ================= */}
//         <OrdersTable
//           orders={state?.orders || []}
//           loading={state?.loading}
//           error={state?.error}
//           pagination={state?.pagination}
//           refreshOrders={fetchOrders}

//           openShipmentModal={openShipmentModal}
//           closeShipmentModal={closeShipmentModal}
//           handleGenerateShipment={handleGenerateShipment}
//           handleDownloadLabel={handleDownloadLabel}

//           state={state}

//           handleReadyToShip={handleReadyToShip}
//           handleSchedulePickup={handleSchedulePickup}
//           handlePickedUp={handlePickedUp}
//           handleInTransit={handleInTransit}
//           handleOutForDelivery={handleOutForDelivery}
//           handleDelivered={handleDelivered}
//         />

//       </main>
//     </div>
//   );
// }


import OrderStats from "../components/orders/OrderStats";
import OrderFilters from "../components/orders/OrderFilters";
import OrdersTable from "../components/orders/OrdersTable";
import useSellerOrders from "../hooks/useSellerOrders";
import { Download, ChevronDown } from "lucide-react";

export default function OrdersDashboard() {
  const {
    state,
    fetchOrders,
    openShipmentModal,
    closeShipmentModal,
    handleGenerateShipment,
    handleDownloadLabel,
    handleReadyToShip,
    handleSchedulePickup,
    handlePickedUp,
    handleInTransit,
    handleOutForDelivery,
    handleDelivered,
    applyFilters,
    resetFilters,
  } = useSellerOrders();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <main className="w-full px-6 py-6">

        {/* ================= HEADER ================= */}

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

          <div>
            <h1 className="text-[26px] leading-8 font-semibold tracking-[-0.5px] text-[#10203f]">
              Orders Management
            </h1>

            <p className="mt-1 text-[13px] text-[#667085]">
              Track, manage and process your orders efficiently
            </p>
          </div>

          <div className="flex items-center gap-3">

            <button
              type="button"
              className="h-[43px] px-5 rounded-lg border border-[#dfe4ec] bg-white text-[13px] font-medium text-[#17233d] hover:bg-gray-50 transition"
            >
              Import Orders
            </button>

            <button
              type="button"
              className="h-[43px] px-4 rounded-lg bg-[#1769e0] hover:bg-[#125bc3] text-white text-[13px] font-medium flex items-center gap-3 transition"
            >
              <Download size={16} />

              <span>Export Orders</span>

              <ChevronDown size={15} />
            </button>

          </div>
        </div>

        {/* ================= STATS ================= */}

        <OrderStats
          stats={state?.stats}
        />

        {/* ================= FILTERS ================= */}

        <OrderFilters
          applyFilters={applyFilters}
          resetFilters={resetFilters}
        />

        {/* ================= TABLE ================= */}

        <OrdersTable
          orders={state?.orders || []}
          loading={state?.loading}
          error={state?.error}
          pagination={state?.pagination}
          refreshOrders={fetchOrders}

          openShipmentModal={openShipmentModal}
          closeShipmentModal={closeShipmentModal}
          handleGenerateShipment={handleGenerateShipment}
          handleDownloadLabel={handleDownloadLabel}

          state={state}

          handleReadyToShip={handleReadyToShip}
          handleSchedulePickup={handleSchedulePickup}
          handlePickedUp={handlePickedUp}
          handleInTransit={handleInTransit}
          handleOutForDelivery={handleOutForDelivery}
          handleDelivered={handleDelivered}
        />

      </main>
    </div>
  );
}