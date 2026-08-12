import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

import {
  MoreVertical,
  Eye,
  Printer,
  Truck,
  Download,
  Package,
  CheckCircle,
  MapPinned,
  Bike,
  Home,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

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
  handleDelivered
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const item = order.items?.[0];

  const customerName = order.shippingAddress?.fullName;

  const productName = item?.snapshot?.title;

  const image = item?.snapshot?.image;

  const sku = item?.sku;

  const quantity = item?.quantity;

  const amount = order.pricing?.totalAmount;

  const paymentStatus = order.payment?.status;

  const shipmentStatus = order.status;

  const shipment = order.shipment;
  console.log(order)

  return (
    <tr className="hover:bg-slate-50 transition">
      <td className="p-4">
        <input type="checkbox" checked={selected} onChange={onSelect} />
      </td>

      <td className="font-semibold">{order.orderNumber}</td>

      <td>{customerName}</td>

      <td>
        <div className="flex gap-3">
          <img
            src={image}
            alt=""
            className="w-14 h-14 rounded-lg border object-cover"
          />

          <div>
            <p className="font-medium">{productName}</p>

            <p className="text-xs text-gray-500">SKU : {sku}</p>
          </div>
        </div>
      </td>

      <td>{quantity}</td>

      <td className="font-semibold">₹{amount}</td>

      <td>
        <span
          className={`px-3 py-1 rounded-full text-xs
          ${
            paymentStatus === "SUCCESS"
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {paymentStatus}
        </span>
      </td>

      <td>
        <StatusBadge status={shipmentStatus} />
      </td>

      <td>
        <div className="flex items-center gap-2 relative">
          {/* View */}
          <button
            onClick={() => onView(order)}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="View Order"
          >
            <Eye size={18} />
          </button>

          {/* Shipment */}
          {!shipment ? (
            <button
              onClick={() => openShipmentModal(order)}
              className="p-2 rounded-lg hover:bg-blue-100"
              title="Generate Shipment"
            >
              <Truck size={18} />
            </button>
          ) : shipment.status === "LABEL_GENERATED" ||
            shipment.status === "READY_TO_SHIP" ? (
            <button
              onClick={() => handleSchedulePickup(shipment._id)}
              className="p-2 rounded-lg hover:bg-green-100"
              title="Schedule Pickup"
            >
              <Truck size={18} />
            </button>
          ) : (
            <button
              disabled
              className="p-2 rounded-lg bg-gray-100 cursor-not-allowed"
              title={shipment.status}
            >
              <CheckCircle size={18} className="text-green-600" />
            </button>
          )}

          <Menu as="div" className="relative">
            <MenuButton className="p-2 rounded-lg hover:bg-gray-100">
              <MoreVertical size={18} />
            </MenuButton>

            <MenuItems
              anchor="bottom end"
              className="w-60 rounded-xl border bg-white shadow-xl p-2 z-50"
            >
              {/* Download Label */}

              {shipment && (
                <MenuItem>
                  <button
                    onClick={() => handleDownloadLabel(shipment._id)}
                    className="flex items-center gap-3 w-full rounded-lg px-3 py-2 hover:bg-slate-100"
                  >
                    <Printer size={17} />
                    Download Label
                  </button>
                </MenuItem>
              )}

              {/* Ready */}

              {shipment?.status === "LABEL_GENERATED" && (
                <MenuItem>
                  <button
                    onClick={() => handleReadyToShip(shipment._id)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100"
                  >
                    <Package size={17} />
                    Ready To Ship
                  </button>
                </MenuItem>
              )}

              {/* Pickup */}

              {shipment?.status === "READY_TO_SHIP" && (
                <MenuItem>
                  <button
                    onClick={() => handleSchedulePickup(shipment._id)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100"
                  >
                    <Truck size={17} />
                    Schedule Pickup
                  </button>
                </MenuItem>
              )}

              {/* Picked */}

              {shipment?.status === "PICKUP_SCHEDULED" && (
                <MenuItem>
                  <button
                    onClick={() => handlePickedUp(shipment._id)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100"
                  >
                    <CheckCircle size={17} />
                    Picked Up
                  </button>
                </MenuItem>
              )}

              {/* Transit */}

              {shipment?.status === "PICKED_UP" && (
                <MenuItem>
                  <button
                    onClick={() => handleInTransit(shipment._id)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100"
                  >
                    <MapPinned size={17} />
                    In Transit
                  </button>
                </MenuItem>
              )}

              {/* OFD */}

              {shipment?.status === "IN_TRANSIT" && (
                <MenuItem>
                  <button
                    onClick={() => handleOutForDelivery(shipment._id)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100"
                  >
                    <Bike size={17} />
                    Out For Delivery
                  </button>
                </MenuItem>
              )}

              {/* Delivered */}

              {shipment?.status === "OUT_FOR_DELIVERY" && (
                <MenuItem>
                  <button
                    onClick={() => handleDelivered(shipment._id)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 hover:bg-slate-100"
                  >
                    <Home size={17} />
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
