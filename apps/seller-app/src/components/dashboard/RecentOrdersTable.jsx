const orders = [
  {
    id: "#0012067",
    image: "https://picsum.photos/60?1",
    product: "Apple iPhone 15 Pro Max",
    customer: "Rahul Sharma",
    price: "₹1,49,900",
    status: "Pending",
  },
  {
    id: "#0012068",
    image: "https://picsum.photos/60?2",
    product: "Samsung Galaxy S25 Ultra",
    customer: "Amit Das",
    price: "₹1,29,999",
    status: "Shipped",
  },
  {
    id: "#0012069",
    image: "https://picsum.photos/60?3",
    product: "OnePlus 13",
    customer: "Soumen Das",
    price: "₹69,999",
    status: "Delivered",
  },
  {
    id: "#0012070",
    image: "https://picsum.photos/60?4",
    product: "iQOO 13",
    customer: "Arjun Roy",
    price: "₹54,999",
    status: "Packed",
  },
];

const badge = {
  Pending: "bg-yellow-100 text-yellow-700",
  Packed: "bg-blue-100 text-blue-700",
  Shipped: "bg-indigo-100 text-indigo-700",
  Delivered: "bg-green-100 text-green-700",
};

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Recent Orders
        </h2>

        <button className="text-blue-600 font-medium hover:underline">
          View All
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b">

              <th className="text-left py-4">Order ID</th>

              <th className="text-left">Product</th>

              <th className="text-left">Customer</th>

              <th className="text-left">Price</th>

              <th className="text-left">Status</th>

              <th className="text-left">Action</th>

            </tr>

          </thead>

          <tbody>

            {orders.map((order) => (

              <tr
                key={order.id}
                className="border-b hover:bg-gray-50 transition"
              >

                <td className="py-4 font-medium">
                  {order.id}
                </td>

                <td>

                  <div className="flex items-center gap-3">

                    <img
                      src={order.image}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover"
                    />

                    <p className="font-medium">
                      {order.product}
                    </p>

                  </div>

                </td>

                <td>{order.customer}</td>

                <td>{order.price}</td>

                <td>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${badge[order.status]}`}
                  >
                    {order.status}
                  </span>

                </td>

                <td>

                  <button className="text-blue-600 hover:underline">
                    View / Update
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <div className="flex justify-between items-center mt-6">

        <p className="text-gray-500 text-sm">
          Showing 1–4 of 24 Orders
        </p>

        <div className="flex gap-2">

          <button className="border rounded-lg px-4 py-2 hover:bg-gray-100">
            Previous
          </button>

          <button className="border rounded-lg px-4 py-2 bg-blue-600 text-white">
            1
          </button>

          <button className="border rounded-lg px-4 py-2 hover:bg-gray-100">
            2
          </button>

          <button className="border rounded-lg px-4 py-2 hover:bg-gray-100">
            Next
          </button>

        </div>

      </div>

    </div>
  );
}