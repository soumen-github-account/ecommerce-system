export default function EarningsSnapshot() {

  return (

    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

      <h2 className="text-xl font-bold mb-6">
        Earnings Snapshot
      </h2>

      <div className="space-y-5">

        <div className="flex justify-between">

          <span className="text-gray-500">
            Today
          </span>

          <span className="font-bold">
            ₹12,540
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-500">
            This Week
          </span>

          <span className="font-bold">
            ₹78,320
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-500">
            This Month
          </span>

          <span className="font-bold">
            ₹3,42,500
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-500">
            Withdrawn
          </span>

          <span className="font-bold text-red-500">
            ₹2,00,000
          </span>

        </div>

        <div className="flex justify-between">

          <span className="text-gray-500">
            Available Balance
          </span>

          <span className="font-bold text-green-600 text-lg">
            ₹1,42,500
          </span>

        </div>

      </div>

    </div>

  );

}