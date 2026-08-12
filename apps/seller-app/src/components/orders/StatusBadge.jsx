const styles = {
  Pending: "bg-yellow-100 text-yellow-700",
  "Label Generated": "bg-blue-100 text-blue-700",
  "Ready To Ship": "bg-green-100 text-green-700",
  Packed: "bg-purple-100 text-purple-700",
  "In Transit": "bg-cyan-100 text-cyan-700",
  Delivered: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        styles[status] || "bg-gray-100"
      }`}
    >
      {status}
    </span>
  );
}