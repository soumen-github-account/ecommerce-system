// import { useState } from "react";

// import OrderRow from "./OrderRow";
// import OrderDrawer from "./OrderDrawer";
// import BulkActions from "./BulkActions";
// import GenerateShipmentModal from "./GenerateShipmentModal";

// export default function OrdersTable({
//   orders,
//   loading,
//   error,
//   pagination,
//   refreshOrders,
//   openShipmentModal,
//   closeShipmentModal,
//   handleGenerateShipment,
//   handleDownloadLabel,
//   state,

//   handleReadyToShip,
//   handleSchedulePickup,
//   handlePickedUp,
//   handleInTransit,
//   handleOutForDelivery,
//   handleDelivered
// }) {
//   const [selected, setSelected] = useState([]);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [currentOrder, setCurrentOrder] = useState(null);

//   const openDrawer = (order) => {
//     setCurrentOrder(order);
//     setDrawerOpen(true);
//   };

//   if (loading) {
//     return (
//       <div className="bg-white rounded-2xl p-10 mt-8 text-center">
//         Loading Orders...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-white rounded-2xl p-10 mt-8 text-center text-red-600">
//         {error}
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white mt-8 rounded-2xl border shadow-sm overflow-hidden">
//       {/* Bulk Actions */}
//       <BulkActions selected={selected.length} />

//       {/* Table */}
//       <div className="overflow-x-auto max-h-[650px]">
//         <table className="w-full text-sm">
//           <thead className="bg-slate-100 sticky top-0 z-20">
//             <tr className="text-left">
//               <th className="p-4">
//                 <input type="checkbox" />
//               </th>

//               <th className="p-4">Order ID</th>

//               <th className="p-4">Customer</th>

//               <th className="p-4">Product</th>

//               <th className="p-4">Qty</th>

//               <th className="p-4">Amount</th>

//               <th className="p-4">Payment</th>

//               <th className="p-4">Shipment</th>

//               <th className="p-4 text-center">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {orders.length === 0 ? (
//               <tr>
//                 <td colSpan={9} className="text-center py-16 text-gray-500">
//                   No Orders Found
//                 </td>
//               </tr>
//             ) : (
//               orders.map((order) => (
//                 <OrderRow
//                   key={order._id}
//                   order={order}
//                   selected={selected.includes(order._id)}
//                   onSelect={() => {
//                     setSelected((prev) =>
//                       prev.includes(order._id)
//                         ? prev.filter((id) => id !== order._id)
//                         : [...prev, order._id],
//                     );
//                   }}
//                   onView={openDrawer}
//                   openShipmentModal={openShipmentModal}
//                   handleDownloadLabel={handleDownloadLabel}

//                   handleReadyToShip={handleReadyToShip}
//                   handleSchedulePickup={handleSchedulePickup}
//                   handlePickedUp={handlePickedUp}
//                   handleInTransit={handleInTransit}
//                   handleOutForDelivery={handleOutForDelivery}
//                   handleDelivered={handleDelivered}
//                 />
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       <div className="border-t p-4 flex justify-between items-center">
//         <p className="text-sm text-gray-500">
//           Showing {orders.length} of {pagination.total} Orders
//         </p>

//         <div className="flex gap-2">
//           <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
//             Previous
//           </button>

//           <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
//             1
//           </button>

//           <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
//             2
//           </button>

//           <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
//             Next
//           </button>
//         </div>
//       </div>

//       {/* Order Details Drawer */}
//       <OrderDrawer
//         open={drawerOpen}
//         order={currentOrder}
//         onClose={() => setDrawerOpen(false)}
//       />

//       <GenerateShipmentModal
//         open={state.shipmentModalOpen}
//         order={state.shipmentOrder}
//         onClose={closeShipmentModal}
//         onGenerate={handleGenerateShipment}
//       />
//     </div>
//   );
// }


import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";

import OrderRow from "./OrderRow";
import OrderDrawer from "./OrderDrawer";
import BulkActions from "./BulkActions";
import GenerateShipmentModal from "./GenerateShipmentModal";

export default function OrdersTable({
  orders = [],
  loading,
  error,
  pagination,
  refreshOrders,

  openShipmentModal,
  closeShipmentModal,
  handleGenerateShipment,
  handleDownloadLabel,

  state,

  handleReadyToShip,
  handleSchedulePickup,
  handlePickedUp,
  handleInTransit,
  handleOutForDelivery,
  handleDelivered,
}) {
  const [selected, setSelected] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const openDrawer = (order) => {
    setCurrentOrder(order);
    setDrawerOpen(true);
  };

  const toggleSelectAll = () => {
    if (selected.length === orders.length) {
      setSelected([]);
    } else {
      setSelected(orders.map((order) => order._id));
    }
  };

  const handlePageChange = (page) => {
    if (!pagination) return;

    if (refreshOrders) {
      refreshOrders({
        page,
      });
    }
  };

  if (loading) {
    return (
      <div className="mt-5 bg-white border border-[#e3e7ee] rounded-xl p-16 text-center">
        <div className="w-7 h-7 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

        <p className="text-[12px] text-[#667085] mt-3">
          Loading orders...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-5 bg-white border border-[#e3e7ee] rounded-xl p-12 text-center">

        <p className="text-[13px] font-medium text-red-600">
          {error}
        </p>

        <button
          onClick={refreshOrders}
          className="mt-4 px-4 py-2 rounded-lg bg-blue-600 text-white text-[11px]"
        >
          Try Again
        </button>

      </div>
    );
  }

  const totalOrders =
    pagination?.total ??
    pagination?.totalOrders ??
    orders.length;

  const currentPage =
    pagination?.page ??
    pagination?.currentPage ??
    1;

  const totalPages =
    pagination?.totalPages ??
    Math.ceil(totalOrders / (pagination?.limit || 10));

  return (
    <div className="mt-5 bg-white border border-[#e3e7ee] rounded-xl overflow-hidden">

      {/* ================= BULK ACTION ================= */}
      {selected.length > 0 && (
        <BulkActions selected={selected.length} />
      )}

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">

        <table className="w-full min-w-[1250px] border-collapse">

          <thead>
            <tr className="h-[45px] bg-[#fbfcfe] border-b border-[#e6e9ef]">

              <th className="w-[42px] px-3">
                <input
                  type="checkbox"
                  checked={
                    orders.length > 0 &&
                    selected.length === orders.length
                  }
                  onChange={toggleSelectAll}
                  className="w-[14px] h-[14px] accent-[#1769e0]"
                />
              </th>

              <th className="text-left px-3 text-[10px] font-semibold text-[#344054]">
                Order Details
              </th>

              <th className="text-left px-3 text-[10px] font-semibold text-[#344054]">
                Customer
              </th>

              <th className="text-left px-3 text-[10px] font-semibold text-[#344054]">
                Product Details
              </th>

              <th className="text-left px-3 text-[10px] font-semibold text-[#344054]">
                Amount
              </th>

              <th className="text-left px-3 text-[10px] font-semibold text-[#344054]">
                Payment
              </th>

              <th className="text-left px-3 text-[10px] font-semibold text-[#344054]">
                Shipment
              </th>

              <th className="text-left px-3 text-[10px] font-semibold text-[#344054]">
                Status
              </th>

              <th className="text-left px-3 text-[10px] font-semibold text-[#344054]">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>

            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="h-[260px] text-center"
                >
                  <div className="flex flex-col items-center justify-center">

                    <div className="w-12 h-12 rounded-full bg-[#f2f4f7] flex items-center justify-center text-[#98a2b3]">
                      <MoreVertical size={20} />
                    </div>

                    <p className="mt-3 text-[13px] font-medium text-[#344054]">
                      No Orders Found
                    </p>

                    <p className="mt-1 text-[11px] text-[#667085]">
                      Orders will appear here when customers place them.
                    </p>

                  </div>
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <OrderRow
                  key={order._id}
                  order={order}
                  selected={selected.includes(order._id)}

                  onSelect={() => {
                    setSelected((prev) =>
                      prev.includes(order._id)
                        ? prev.filter((id) => id !== order._id)
                        : [...prev, order._id]
                    );
                  }}

                  onView={openDrawer}

                  openShipmentModal={openShipmentModal}
                  handleDownloadLabel={handleDownloadLabel}

                  handleReadyToShip={handleReadyToShip}
                  handleSchedulePickup={handleSchedulePickup}
                  handlePickedUp={handlePickedUp}
                  handleInTransit={handleInTransit}
                  handleOutForDelivery={handleOutForDelivery}
                  handleDelivered={handleDelivered}
                />
              ))
            )}

          </tbody>

        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="h-[58px] border-t border-[#e6e9ef] px-4 flex items-center justify-between">

        <p className="text-[10px] text-[#667085]">
          Showing{" "}
          <span className="font-medium text-[#344054]">
            {orders.length}
          </span>{" "}
          of{" "}
          <span className="font-medium text-[#344054]">
            {totalOrders}
          </span>{" "}
          orders
        </p>

        <div className="flex items-center gap-1.5">

          <button
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="w-[34px] h-[34px] rounded-lg border border-[#dfe4ec] flex items-center justify-center text-[#667085] disabled:opacity-40 hover:bg-gray-50"
          >
            <ChevronLeft size={15} />
          </button>

          {[1, 2, 3].map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`w-[34px] h-[34px] rounded-lg text-[10px] font-medium ${
                currentPage === page
                  ? "bg-[#edf3ff] border border-[#cddcff] text-[#1769e0]"
                  : "border border-transparent text-[#344054] hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          {totalPages > 4 && (
            <>
              <span className="px-1 text-[11px] text-[#667085]">
                ...
              </span>

              <button
                onClick={() => handlePageChange(totalPages)}
                className="w-[34px] h-[34px] rounded-lg text-[10px] text-[#344054] hover:bg-gray-50"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="w-[34px] h-[34px] rounded-lg border border-[#dfe4ec] flex items-center justify-center text-[#667085] disabled:opacity-40 hover:bg-gray-50"
          >
            <ChevronRight size={15} />
          </button>

          <select className="ml-5 h-[34px] px-3 border border-[#dfe4ec] rounded-lg text-[10px] bg-white outline-none">
            <option>10 / page</option>
            <option>20 / page</option>
            <option>50 / page</option>
          </select>

        </div>
      </div>

      {/* ================= DRAWER ================= */}
      <OrderDrawer
        open={drawerOpen}
        order={currentOrder}
        onClose={() => {
          setDrawerOpen(false);
          setCurrentOrder(null);
        }}
      />

      {/* ================= SHIPMENT MODAL ================= */}
      <GenerateShipmentModal
        open={state?.shipmentModalOpen}
        order={state?.shipmentOrder}
        onClose={closeShipmentModal}
        onGenerate={handleGenerateShipment}
      />

    </div>
  );
}