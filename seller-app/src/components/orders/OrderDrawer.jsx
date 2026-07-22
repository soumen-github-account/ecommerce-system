import { X, Truck, Printer, FileText, PackageCheck } from "lucide-react";

export default function OrderDrawer({ open, onClose, order }) {
  if (!open || !order) return null;

  const item = order.items?.[0];

  const customerName = order.shippingAddress?.fullName;

  const image = item?.snapshot?.image;

  const productName = item?.snapshot?.title;

  const sku = item?.sku;

  const quantity = item?.quantity;

  const paymentStatus = order.payment?.status;

  const paymentMethod = order.payment?.method;

  const shipmentStatus = order.status;

  const address = order.shippingAddress;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <aside className="fixed right-0 top-0 h-screen w-[430px] bg-white shadow-2xl z-50 overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold">Order Details</h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="font-semibold mb-2">Customer</h3>

            <p>{customerName}</p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Address</h3>

            <p className="text-gray-600">
              {address.addressLine1}
              <br />
              {address.addressLine2}
              {address.landmark && (
                <>
                  <br />
                  {address.landmark}
                </>
              )}
              <br />
              {address.city}, {address.state}
              <br />
              {address.country} - {address.pincode}
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Product</h3>

            <div className="flex gap-4">
              <img src={image} className="w-20 h-20 rounded-lg border" />

              <div>
                <h4 className="font-semibold">{productName}</h4>

                <p className="text-sm text-gray-500">SKU : {sku}</p>

                <p className="mt-2">Qty : {quantity}</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Payment</h3>

            <p>
              {paymentMethod}

              {" • "}

              {paymentStatus}
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-2">Shipment Status</h3>

            <p>{shipmentStatus}</p>
          </section>

          <section>
            <h3 className="font-semibold mb-3">Timeline</h3>

            <div className="space-y-3 text-sm">
              <div>✔ Order Confirmed</div>

              <div>✔ Payment Received</div>

              <div>⏳ Packed</div>

              <div>Waiting Pickup</div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <button className="bg-blue-600 text-white py-3 rounded-xl flex items-center justify-center gap-2">
              <Truck size={18} />
              Generate Shipment
            </button>

            <button className="bg-green-600 text-white py-3 rounded-xl flex items-center justify-center gap-2">
              <Printer size={18} />
              Label
            </button>

            <button className="bg-purple-600 text-white py-3 rounded-xl flex items-center justify-center gap-2">
              <FileText size={18} />
              Invoice
            </button>

            <button className="bg-orange-500 text-white py-3 rounded-xl flex items-center justify-center gap-2">
              <PackageCheck size={18} />
              Mark Packed
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
