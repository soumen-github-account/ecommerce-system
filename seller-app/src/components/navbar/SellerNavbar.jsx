import {
  Bell,
  Search,
  ChevronDown,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useSeller } from "../../contexts/SellerContext";

export default function SellerNavbar() {
  const { seller, loading } = useSeller();

  return (
    <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">

      {/* Left */}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500">
          Welcome back,
          <span className="font-semibold ml-1">
            {seller?.fullName}
          </span>
        </p>
      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        {/* Search */}

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="w-80 h-11 rounded-xl border border-gray-300 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Notification */}

        <button className="relative w-11 h-11 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-100">

          <Bell size={19} />

          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></span>

        </button>

        {/* Profile */}

        <button className="flex items-center gap-3">

          <img
            src="https://ui-avatars.com/api/?background=2563eb&color=fff&name=Seller"
            className="w-11 h-11 rounded-full"
          />

          <div className="text-left">

            <h3 className="font-semibold text-sm">
              {seller?.fullName}
            </h3>

            <p className="text-xs text-gray-500">
              Seller
            </p>

          </div>

          <ChevronDown size={18} />

        </button>

      </div>

    </header>
  );
}