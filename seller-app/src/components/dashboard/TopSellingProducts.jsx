const products = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    sold: 120,
    amount: "₹1,79,88,000",
    image: "https://picsum.photos/60?11",
  },
  {
    id: 2,
    name: "Samsung Galaxy S25",
    sold: 98,
    amount: "₹98,00,000",
    image: "https://picsum.photos/60?12",
  },
  {
    id: 3,
    name: "OnePlus 13",
    sold: 82,
    amount: "₹57,39,000",
    image: "https://picsum.photos/60?13",
  },
  {
    id: 4,
    name: "iQOO 13",
    sold: 65,
    amount: "₹35,75,000",
    image: "https://picsum.photos/60?14",
  },
];

export default function TopSellingProducts() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-bold">
          Top Selling Products
        </h2>

        <button className="text-blue-600 text-sm">
          View All
        </button>

      </div>

      <div className="space-y-5">

        {products.map((item) => (

          <div
            key={item.id}
            className="flex items-center justify-between"
          >

            <div className="flex items-center gap-4">

              <img
                src={item.image}
                alt=""
                className="w-14 h-14 rounded-xl object-cover"
              />

              <div>

                <h3 className="font-semibold">
                  {item.name}
                </h3>

                <p className="text-gray-500 text-sm">
                  Sold : {item.sold}
                </p>

              </div>

            </div>

            <h3 className="font-bold">
              {item.amount}
            </h3>

          </div>

        ))}

      </div>

    </div>
  );
}