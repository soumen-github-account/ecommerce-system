
import OrderSidebar from "../components/orders/OrderSidebar";
import OrderStats from "../components/orders/OrderStats";
import OrderFilters from "../components/orders/OrderFilters";
import OrdersTable from "../components/orders/OrdersTable";
import useSellerOrders from "../hooks/useSellerOrders";

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
    handleDelivered
  } = useSellerOrders();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex">
        <OrderSidebar />

        <main className="flex-1 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Orders Management</h1>

              <p className="text-gray-500 mt-1">
                Manage your seller orders efficiently.
              </p>
            </div>

            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-medium">
              Export Orders
            </button>
          </div>

          <OrderStats />

          <OrderFilters />

          <OrdersTable
            orders={state.orders}
            loading={state.loading}
            error={state.error}
            pagination={state.pagination}
            refreshOrders={fetchOrders}
            openShipmentModal={openShipmentModal}
            handleGenerateShipment={handleGenerateShipment}
            state={state}
            handleDownloadLabel={handleDownloadLabel}

            handleReadyToShip={handleReadyToShip}
            handleSchedulePickup={handleSchedulePickup}
            handlePickedUp={handlePickedUp}
            handleInTransit={handleInTransit}
            handleOutForDelivery={handleOutForDelivery}
            handleDelivered={handleDelivered}

          />
        </main>
      </div>
    </div>
  );
}
