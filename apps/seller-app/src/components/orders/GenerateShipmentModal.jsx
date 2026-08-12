import { useState } from "react";
import { X, Truck } from "lucide-react";

const couriers = [
  "Delhivery",
  "XpressBees",
  "Blue Dart",
  "Ekart",
  "DTDC",
  "Ecom Express",
];

export default function GenerateShipmentModal({
  open,
  order,
  onClose,
  onGenerate,
}) {
  const [courier, setCourier] = useState("Delhivery");
  const [loading, setLoading] = useState(false);

  if (!open || !order) return null;

  const handleGenerate = async () => {
    try {
      setLoading(true);

      await onGenerate(order._id, courier);

      onClose();
    } finally {
      setLoading(false);
    }
  };

  const item = order.items?.[0];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-50" onClick={onClose} />

      <div className="fixed z-50 left-1/2 top-1/2 w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-2xl font-bold">Generate Shipment</h2>

            <p className="text-sm text-gray-500 mt-1">
              Create shipment for this order.
            </p>
          </div>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <p className="text-sm text-gray-500">Order Number</p>

            <h3 className="font-semibold">{order.orderNumber}</h3>
          </div>

          <div className="flex gap-4">
            <img
              src={item?.snapshot?.image}
              className="h-20 w-20 rounded-xl border object-cover"
            />

            <div>
              <h4 className="font-semibold">{item?.snapshot?.title}</h4>

              <p className="text-sm text-gray-500">Qty : {item?.quantity}</p>
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium">Select Courier</label>

            <select
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              className="w-full rounded-xl border p-3"
            >
              {couriers.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="rounded-xl bg-slate-100 p-4 text-sm space-y-2">
            <div className="flex justify-between">
              <span>Customer</span>

              <span>{order.shippingAddress.fullName}</span>
            </div>

            <div className="flex justify-between">
              <span>Payment</span>

              <span>{order.payment.status}</span>
            </div>

            <div className="flex justify-between">
              <span>Amount</span>

              <span>₹{order.pricing.totalAmount}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t p-6">
          <button onClick={onClose} className="rounded-xl border px-5 py-3">
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleGenerate}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Shipment"}
          </button>
        </div>
      </div>
    </>
  );
}
