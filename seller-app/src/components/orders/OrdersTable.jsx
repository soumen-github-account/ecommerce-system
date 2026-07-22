import { useState } from "react";

import OrderRow from "./OrderRow";
import OrderDrawer from "./OrderDrawer";
import BulkActions from "./BulkActions";
import GenerateShipmentModal from "./GenerateShipmentModal";

export default function OrdersTable({
  orders,
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
  handleDelivered
}) {
  const [selected, setSelected] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  const openDrawer = (order) => {
    setCurrentOrder(order);
    setDrawerOpen(true);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-10 mt-8 text-center">
        Loading Orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-10 mt-8 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white mt-8 rounded-2xl border shadow-sm overflow-hidden">
      {/* Bulk Actions */}
      <BulkActions selected={selected.length} />

      {/* Table */}
      <div className="overflow-x-auto max-h-[650px]">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 sticky top-0 z-20">
            <tr className="text-left">
              <th className="p-4">
                <input type="checkbox" />
              </th>

              <th className="p-4">Order ID</th>

              <th className="p-4">Customer</th>

              <th className="p-4">Product</th>

              <th className="p-4">Qty</th>

              <th className="p-4">Amount</th>

              <th className="p-4">Payment</th>

              <th className="p-4">Shipment</th>

              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-16 text-gray-500">
                  No Orders Found
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
                        : [...prev, order._id],
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

      {/* Pagination */}
      <div className="border-t p-4 flex justify-between items-center">
        <p className="text-sm text-gray-500">
          Showing {orders.length} of {pagination.total} Orders
        </p>

        <div className="flex gap-2">
          <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
            Previous
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            1
          </button>

          <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
            2
          </button>

          <button className="border px-4 py-2 rounded-lg hover:bg-gray-100">
            Next
          </button>
        </div>
      </div>

      {/* Order Details Drawer */}
      <OrderDrawer
        open={drawerOpen}
        order={currentOrder}
        onClose={() => setDrawerOpen(false)}
      />

      <GenerateShipmentModal
        open={state.shipmentModalOpen}
        order={state.shipmentOrder}
        onClose={closeShipmentModal}
        onGenerate={handleGenerateShipment}
      />
    </div>
  );
}
