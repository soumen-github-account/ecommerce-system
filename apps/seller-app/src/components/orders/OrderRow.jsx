// import { useState } from "react";
// import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

// import {
//   MoreVertical,
//   Eye,
//   Printer,
//   Truck,
//   Download,
//   Package,
//   CheckCircle,
//   MapPinned,
//   Bike,
//   Home,
// } from "lucide-react";
// import StatusBadge from "./StatusBadge";

// export default function OrderRow({
//   order,
//   selected,
//   onSelect,
//   onView,
//   openShipmentModal,
//   handleDownloadLabel,

//   handleReadyToShip,
//   handleSchedulePickup,
//   handlePickedUp,
//   handleInTransit,
//   handleOutForDelivery,
//   handleDelivered
// }) {
//   const [menuOpen, setMenuOpen] = useState(false);

//   const item = order.items?.[0];

//   const customerName = order.shippingAddress?.fullName;

//   const productName = item?.snapshot?.title;

//   const image = item?.snapshot?.image;

//   const sku = item?.sku;

//   const quantity = item?.quantity;

//   const amount = order.pricing?.totalAmount;

//   const paymentStatus = order.payment?.status;

//   const shipmentStatus = order.status;

//   const shipment = order.shipment;
//   console.log(order)

//   return (
//     <tr className="hover:bg-slate-50 transition">
//       <td className="p-4">
//         <input type="checkbox" checked={selected} onChange={onSelect} />
//       </td>

//       <td className="font-semibold">{order.orderNumber}</td>

//       <td>{customerName}</td>

//       <td>
//         <div className="flex gap-3">
//           <img
//             src={image}
//             alt=""
//             className="w-14 h-14 rounded-lg border object-cover"
//           />

//           <div>
//             <p className="font-medium">{productName}</p>

//             <p className="text-xs text-gray-500">SKU : {sku}</p>
//           </div>
//         </div>
//       </td>

//       <td>{quantity}</td>

//       <td className="font-semibold">₹{amount}</td>

//       <td>
//         <span
//           className={`px-3 py-1 rounded-full text-xs
//           ${
//             paymentStatus === "SUCCESS"
//               ? "bg-green-100 text-green-700"
//               : "bg-orange-100 text-orange-700"
//           }`}
//         >
//           {paymentStatus}
//         </span>
//       </td>

//       <td>
//         <StatusBadge status={shipmentStatus} />
//       </td>

//       <td>
//         <div className="flex items-center gap-2 relative">
//           {/* View */}
//           <button
//             onClick={() => onView(order)}
//             className="p-2 rounded-lg hover:bg-gray-100"
//             title="View Order"
//           >
//             <Eye size={18} />
//           </button>

//           {/* Shipment */}
//           {!shipment ? (
//             <button
//               onClick={() => openShipmentModal(order)}
//               className="p-2 rounded-lg hover:bg-blue-100"
//               title="Generate Shipment"
//             >
//               <Truck size={18} />
//             </button>
//           ) : shipment.status === "LABEL_GENERATED" ||
//             shipment.status === "READY_TO_SHIP" ? (
//             <button
//               onClick={() => handleSchedulePickup(shipment._id)}
//               className="p-2 rounded-lg hover:bg-green-100"
//               title="Schedule Pickup"
//             >
//               <Truck size={18} />
//             </button>
//           ) : (
//             <button
//               disabled
//               className="p-2 rounded-lg bg-gray-100 cursor-not-allowed"
//               title={shipment.status}
//             >
//               <CheckCircle size={18} className="text-green-600" />
//             </button>
//           )}

//           <Menu as="div" className="relative">
//             <MenuButton className="p-2 rounded-lg hover:bg-gray-100">
//               <MoreVertical size={18} />
//             </MenuButton>

//             <MenuItems
//               anchor="bottom end"
//               className="w-60 rounded-xl border bg-white shadow-xl p-2 z-50"
//             >
//               {/* Download Label */}

//               {shipment && (
//                 <MenuItem>
//                   <button
//                     onClick={() => handleDownloadLabel(shipment._id)}
//                     className="flex items-center gap-3 w-full rounded-lg px-3 py-2 hover:bg-slate-100"
//                   >
//                     <Printer size={17} />
//                     Download Label
//                   </button>
//                 </MenuItem>
//               )}

//               {/* Ready */}

//               {shipment?.status === "LABEL_GENERATED" && (
//                 <MenuItem>
//                   <button
//                     onClick={() => handleReadyToShip(shipment._id)}
//                     className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100"
//                   >
//                     <Package size={17} />
//                     Ready To Ship
//                   </button>
//                 </MenuItem>
//               )}

//               {/* Pickup */}

//               {shipment?.status === "READY_TO_SHIP" && (
//                 <MenuItem>
//                   <button
//                     onClick={() => handleSchedulePickup(shipment._id)}
//                     className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100"
//                   >
//                     <Truck size={17} />
//                     Schedule Pickup
//                   </button>
//                 </MenuItem>
//               )}

//               {/* Picked */}

//               {shipment?.status === "PICKUP_SCHEDULED" && (
//                 <MenuItem>
//                   <button
//                     onClick={() => handlePickedUp(shipment._id)}
//                     className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100"
//                   >
//                     <CheckCircle size={17} />
//                     Picked Up
//                   </button>
//                 </MenuItem>
//               )}

//               {/* Transit */}

//               {shipment?.status === "PICKED_UP" && (
//                 <MenuItem>
//                   <button
//                     onClick={() => handleInTransit(shipment._id)}
//                     className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100"
//                   >
//                     <MapPinned size={17} />
//                     In Transit
//                   </button>
//                 </MenuItem>
//               )}

//               {/* OFD */}

//               {shipment?.status === "IN_TRANSIT" && (
//                 <MenuItem>
//                   <button
//                     onClick={() => handleOutForDelivery(shipment._id)}
//                     className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100"
//                   >
//                     <Bike size={17} />
//                     Out For Delivery
//                   </button>
//                 </MenuItem>
//               )}

//               {/* Delivered */}

//               {shipment?.status === "OUT_FOR_DELIVERY" && (
//                 <MenuItem>
//                   <button
//                     onClick={() => handleDelivered(shipment._id)}
//                     className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100"
//                   >
//                     <Home size={17} />
//                     Delivered
//                   </button>
//                 </MenuItem>
//               )}
//             </MenuItems>
//           </Menu>
//         </div>
//       </td>
//     </tr>
//   );
// }


import {
  MoreVertical,
  Eye,
  Printer,
  Truck,
  Package,
  CheckCircle2,
  MapPinned,
  Bike,
  Home,
  ShieldCheck,
} from "lucide-react";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatAmount = (amount) => {
  const value = Number(amount || 0);

  return `₹${value.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const normalizeStatus = (status = "") => {
  return String(status)
    .toUpperCase()
    .replace(/\s+/g, "_");
};

const getStatusStyle = (status) => {
  const normalized = normalizeStatus(status);

  const styles = {
    PENDING: "bg-[#fff4dd] text-[#d97706]",
    CONFIRMED: "bg-[#e9f1ff] text-[#2563eb]",
    PACKED: "bg-[#f2e8ff] text-[#7c3aed]",
    READY_TO_SHIP: "bg-[#fff1d9] text-[#d97706]",
    SHIPPED: "bg-[#dff8fa] text-[#0891a2]",
    IN_TRANSIT: "bg-[#dff8fa] text-[#0891a2]",
    OUT_FOR_DELIVERY: "bg-[#e0f7ed] text-[#059669]",
    DELIVERED: "bg-[#dcf7e8] text-[#079455]",
    RETURN: "bg-[#ffe3e3] text-[#ef4444]",
    RETURNED: "bg-[#ffe3e3] text-[#ef4444]",
    CANCELLED: "bg-[#ffe3e3] text-[#ef4444]",
  };

  return styles[normalized] || "bg-[#f2f4f7] text-[#475467]";
};

const getStatusLabel = (status = "") => {
  const normalized = normalizeStatus(status);

  const labels = {
    PENDING: "Pending",
    CONFIRMED: "Confirmed",
    PACKED: "Packed",
    READY_TO_SHIP: "Ready to Ship",
    SHIPPED: "Shipped",
    IN_TRANSIT: "In Transit",
    OUT_FOR_DELIVERY: "Out for Delivery",
    DELIVERED: "Delivered",
    RETURN: "Return",
    RETURNED: "Return",
    CANCELLED: "Cancelled",
  };

  return labels[normalized] || status || "Unknown";
};

const getPaymentStyle = (status = "") => {
  const normalized = normalizeStatus(status);

  if (normalized === "SUCCESS" || normalized === "PAID") {
    return "bg-[#dcf7e8] text-[#079455]";
  }

  if (normalized === "REFUNDED") {
    return "bg-[#ffe3e3] text-[#ef4444]";
  }

  if (normalized === "FAILED") {
    return "bg-[#ffe3e3] text-[#ef4444]";
  }

  return "bg-[#fff1d9] text-[#d97706]";
};

const getPaymentLabel = (status = "") => {
  const normalized = normalizeStatus(status);

  const labels = {
    SUCCESS: "Paid",
    PAID: "Paid",
    PENDING: "Pending",
    FAILED: "Failed",
    REFUNDED: "Refunded",
  };

  return labels[normalized] || status || "Pending";
};

export default function OrderRow({
  order,
  selected,
  onSelect,
  onView,
  openShipmentModal,
  handleDownloadLabel,

  handleReadyToShip,
  handleSchedulePickup,
  handlePickedUp,
  handleInTransit,
  handleOutForDelivery,
  handleDelivered,
}) {
  const item = order?.items?.[0];

  const customerName =
    order?.shippingAddress?.fullName ||
    order?.customer?.name ||
    "Customer";

  const customerPhone =
    order?.shippingAddress?.phone ||
    order?.customer?.phone ||
    "";

  const productName =
    item?.snapshot?.title ||
    item?.product?.title ||
    item?.title ||
    "Product";

  const image =
    item?.snapshot?.image ||
    item?.snapshot?.images?.[0] ||
    item?.product?.images?.[0] ||
    item?.image ||
    "";

  const sku =
    item?.sku ||
    item?.snapshot?.sku ||
    item?.product?.sku ||
    "—";

  const quantity = item?.quantity || 1;

  const amount =
    order?.pricing?.totalAmount ??
    order?.totalAmount ??
    order?.amount ??
    0;

  const paymentStatus =
    order?.payment?.status ||
    order?.paymentStatus ||
    "PENDING";

  const paymentMethod =
    order?.payment?.method ||
    order?.payment?.gateway ||
    "UPI";

  const shipmentStatus =
    order?.status ||
    order?.shipment?.status ||
    "";

  const shipment = order?.shipment;

  const courierName =
    shipment?.courierName ||
    shipment?.carrier ||
    shipment?.courier ||
    "—";

  const trackingNumber =
    shipment?.trackingNumber ||
    shipment?.awb ||
    shipment?.awbNumber ||
    "";

  const orderDate =
    order?.createdAt ||
    order?.createdOn ||
    order?.date;

  const productAttributes =
    item?.snapshot?.attributes ||
    item?.attributes ||
    {};

  const size =
    productAttributes?.size ||
    item?.size ||
    "";

  const color =
    productAttributes?.color ||
    item?.color ||
    "";

  return (
    <tr className="h-[88px] border-b border-[#edf0f4] hover:bg-[#fbfdff] transition">

      {/* ================= CHECKBOX ================= */}
      <td className="px-3 align-middle">

        <input
          type="checkbox"
          checked={selected}
          onChange={onSelect}
          className="w-[14px] h-[14px] accent-[#1769e0]"
        />

      </td>

      {/* ================= ORDER DETAILS ================= */}
      <td className="px-3 align-middle">

        <div className="flex items-start gap-3">

          <div className="pt-1">
            <ShieldCheck
              size={14}
              className="text-[#0eae6c]"
              strokeWidth={2}
            />
          </div>

          <div>
            <p className="text-[11px] font-semibold text-[#17233d]">
              {order?.orderNumber || order?._id}
            </p>

            <p className="text-[9px] text-[#667085] mt-1">
              {formatDate(orderDate)}
              {formatTime(orderDate) &&
                `, ${formatTime(orderDate)}`}
            </p>
          </div>

        </div>

      </td>

      {/* ================= CUSTOMER ================= */}
      <td className="px-3 align-middle">

        <div className="flex items-center gap-2.5">

          <div className="w-[34px] h-[34px] rounded-full bg-[#eaf0ff] text-[#2563eb] flex items-center justify-center text-[10px] font-semibold shrink-0">
            {customerName
              ?.split(" ")
              ?.slice(0, 2)
              ?.map((word) => word?.[0])
              ?.join("")
              ?.toUpperCase()}
          </div>

          <div className="min-w-0">

            <p className="text-[10px] font-semibold text-[#17233d] truncate max-w-[115px]">
              {customerName}
            </p>

            <p className="text-[9px] text-[#667085] mt-1">
              {customerPhone}
            </p>

          </div>

        </div>

      </td>

      {/* ================= PRODUCT ================= */}
      <td className="px-3 align-middle">

        <div className="flex items-center gap-3">

          <div className="w-[45px] h-[45px] rounded-lg border border-[#e2e6ec] bg-[#f9fafb] overflow-hidden flex items-center justify-center shrink-0">

            {image ? (
              <img
                src={image}
                alt={productName}
                className="w-full h-full object-contain"
              />
            ) : (
              <Package
                size={19}
                className="text-[#98a2b3]"
              />
            )}

          </div>

          <div className="min-w-0">

            <p className="text-[10px] font-medium text-[#17233d] leading-4 max-w-[205px]">
              {productName}
            </p>

            <p className="text-[9px] text-[#7a8699] mt-1">
              SKU: {sku}
            </p>

            <p className="text-[9px] text-[#667085] mt-1">
              {size && `Size: ${size}`}
              {size && color && " • "}
              {color && `Color: ${color}`}
              {(size || color) && " • "}
              Qty: {quantity}
            </p>

          </div>

        </div>

      </td>

      {/* ================= AMOUNT ================= */}
      <td className="px-3 align-middle">

        <p className="text-[11px] font-semibold text-[#17233d]">
          {formatAmount(amount)}
        </p>

        <p className="text-[9px] text-[#667085] mt-1">
          {quantity} {quantity === 1 ? "item" : "items"}
        </p>

      </td>

      {/* ================= PAYMENT ================= */}
      <td className="px-3 align-middle">

        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-medium ${getPaymentStyle(
            paymentStatus
          )}`}
        >
          {getPaymentLabel(paymentStatus)}
        </span>

        <p className="text-[9px] text-[#667085] mt-2">
          {paymentMethod}
        </p>

      </td>

      {/* ================= SHIPMENT ================= */}
      <td className="px-3 align-middle">

        <p className="text-[10px] font-semibold text-[#17233d]">
          {courierName}
        </p>

        <p className="text-[9px] text-[#667085] mt-1">
          {trackingNumber || "Not generated"}
        </p>

        {trackingNumber && (
          <button
            type="button"
            className="text-[9px] text-[#1769e0] mt-1 hover:underline"
          >
            Track Shipment
          </button>
        )}

      </td>

      {/* ================= STATUS ================= */}
      <td className="px-3 align-middle">

        <span
          className={`inline-flex px-2.5 py-1.5 rounded-full text-[9px] font-medium whitespace-nowrap ${getStatusStyle(
            shipmentStatus
          )}`}
        >
          {getStatusLabel(shipmentStatus)}
        </span>

      </td>

      {/* ================= ACTIONS ================= */}
      <td className="px-3 align-middle">

        <div className="flex items-center gap-1.5">

          {/* VIEW */}
          <button
            type="button"
            onClick={() => onView(order)}
            className="w-[34px] h-[34px] border border-[#e0e5ec] rounded-lg flex items-center justify-center text-[#667085] hover:text-[#1769e0] hover:bg-[#f4f7ff] transition"
            title="View Order"
          >
            <Eye size={15} />
          </button>

          {/* SHIPMENT */}
          {!shipment ? (
            <button
              type="button"
              onClick={() => openShipmentModal(order)}
              className="w-[34px] h-[34px] border border-[#e0e5ec] rounded-lg flex items-center justify-center text-[#667085] hover:text-[#1769e0] hover:bg-[#f4f7ff] transition"
              title="Generate Shipment"
            >
              <Truck size={15} />
            </button>
          ) : shipment?.status === "LABEL_GENERATED" ||
            shipment?.status === "READY_TO_SHIP" ? (
            <button
              type="button"
              onClick={() =>
                handleSchedulePickup(shipment?._id)
              }
              className="w-[34px] h-[34px] border border-[#e0e5ec] rounded-lg flex items-center justify-center text-[#667085] hover:text-[#059669] hover:bg-[#ecfdf5] transition"
              title="Schedule Pickup"
            >
              <Truck size={15} />
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-[34px] h-[34px] border border-[#e0e5ec] rounded-lg flex items-center justify-center bg-[#f8fafc] cursor-not-allowed"
              title={shipment?.status}
            >
              <CheckCircle2
                size={15}
                className="text-[#16a66a]"
              />
            </button>
          )}

          {/* MORE MENU */}
          <Menu as="div" className="relative">

            <MenuButton className="w-[34px] h-[34px] border border-[#e0e5ec] rounded-lg flex items-center justify-center text-[#667085] hover:bg-gray-50">
              <MoreVertical size={15} />
            </MenuButton>

            <MenuItems
              anchor="bottom end"
              className="w-56 rounded-xl border border-[#e2e6ed] bg-white shadow-[0_12px_30px_rgba(16,24,40,0.14)] p-1.5 z-50"
            >

              {/* DOWNLOAD LABEL */}
              {shipment && (
                <MenuItem>
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadLabel(shipment?._id)
                    }
                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-[11px] text-[#344054] hover:bg-[#f5f7fa]"
                  >
                    <Printer size={15} />
                    Download Label
                  </button>
                </MenuItem>
              )}

              {/* READY TO SHIP */}
              {shipment?.status === "LABEL_GENERATED" && (
                <MenuItem>
                  <button
                    type="button"
                    onClick={() =>
                      handleReadyToShip(shipment?._id)
                    }
                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-[11px] text-[#344054] hover:bg-[#f5f7fa]"
                  >
                    <Package size={15} />
                    Ready To Ship
                  </button>
                </MenuItem>
              )}

              {/* SCHEDULE PICKUP */}
              {shipment?.status === "READY_TO_SHIP" && (
                <MenuItem>
                  <button
                    type="button"
                    onClick={() =>
                      handleSchedulePickup(shipment?._id)
                    }
                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-[11px] text-[#344054] hover:bg-[#f5f7fa]"
                  >
                    <Truck size={15} />
                    Schedule Pickup
                  </button>
                </MenuItem>
              )}

              {/* PICKED UP */}
              {shipment?.status === "PICKUP_SCHEDULED" && (
                <MenuItem>
                  <button
                    type="button"
                    onClick={() =>
                      handlePickedUp(shipment?._id)
                    }
                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-[11px] text-[#344054] hover:bg-[#f5f7fa]"
                  >
                    <CheckCircle2 size={15} />
                    Picked Up
                  </button>
                </MenuItem>
              )}

              {/* IN TRANSIT */}
              {shipment?.status === "PICKED_UP" && (
                <MenuItem>
                  <button
                    type="button"
                    onClick={() =>
                      handleInTransit(shipment?._id)
                    }
                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-[11px] text-[#344054] hover:bg-[#f5f7fa]"
                  >
                    <MapPinned size={15} />
                    In Transit
                  </button>
                </MenuItem>
              )}

              {/* OUT FOR DELIVERY */}
              {shipment?.status === "IN_TRANSIT" && (
                <MenuItem>
                  <button
                    type="button"
                    onClick={() =>
                      handleOutForDelivery(shipment?._id)
                    }
                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-[11px] text-[#344054] hover:bg-[#f5f7fa]"
                  >
                    <Bike size={15} />
                    Out For Delivery
                  </button>
                </MenuItem>
              )}

              {/* DELIVERED */}
              {shipment?.status === "OUT_FOR_DELIVERY" && (
                <MenuItem>
                  <button
                    type="button"
                    onClick={() =>
                      handleDelivered(shipment?._id)
                    }
                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-[11px] text-[#344054] hover:bg-[#f5f7fa]"
                  >
                    <Home size={15} />
                    Delivered
                  </button>
                </MenuItem>
              )}

            </MenuItems>

          </Menu>

        </div>

      </td>

    </tr>
  );
}
