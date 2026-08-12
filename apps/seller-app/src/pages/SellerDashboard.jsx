import {
  IndianRupee,
  ShoppingCart,
  Package,
  Users,
} from "lucide-react";
import StatCard from "../components/dashboard/StatsCard";
import SalesOverview from "../components/dashboard/SalesOverview";
import OrderStatus from "../components/dashboard/OrderStatus";
import QuickActions from "../components/dashboard/QuickActions";
import RecentOrders from "../components/dashboard/RecentOrdersTable";
import TopSellingProducts from "../components/dashboard/TopSellingProducts";
import EarningsSnapshot from "../components/dashboard/EarningsSnapshot";

export default function SellerDashboard() {
  return (
    <div>

      {/* Cards */}

      <div className="grid grid-cols-4 gap-6">

        <StatCard
          title="Revenue"
          value="₹8,45,200"
          change="+18.4%"
          icon={IndianRupee}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Orders"
          value="1,254"
          change="+12%"
          icon={ShoppingCart}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          title="Products"
          value="320"
          change="+8%"
          icon={Package}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />

        <StatCard
          title="Customers"
          value="865"
          change="+15%"
          icon={Users}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />

      </div>
      
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-7">
            <SalesOverview />
        </div>
        <div className="col-span-5">
            <OrderStatus />
        </div>
      </div>
        {/* <div className="col-span-3">
          <QuickActions />
        </div> */}
      <div className="grid grid-cols-12 gap-6 mt-6">

        <div className="col-span-8">
            <RecentOrders />
        </div>

        <div className="col-span-4 space-y-6">

            <TopSellingProducts />

            <EarningsSnapshot />

        </div>

    </div>

    </div>
  );
}