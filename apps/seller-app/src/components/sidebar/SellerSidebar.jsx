import {
  LayoutDashboard,
  Package,
  CirclePlus,
  ShoppingBag,
  Boxes,
  RotateCcw,
  BarChart3,
  Wallet,
  Megaphone,
  Settings,
  CircleHelp,
  LogOut 
} from "lucide-react";
import logoImg from "../../assets/Logo.png"
import SidebarItem from "./SidebarItem";
import { logoutSeller } from "../../services/sellerApi";
import { useSeller } from "../../contexts/SellerContext";

export default function SellerSidebar() {
  const { handleLogout } = useSeller()

  return (
    <aside className="w-72 h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col border-r border-slate-800">

      {/* Logo */}

      <div className="h-20 flex items-center px-7 border-b border-slate-800">

        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center text-lg font-bold shadow-lg">
          <img src={logoImg} className="rounded-full" alt="" />
        </div>

        <div className="ml-3">
          <h2 className="text-[15px] font-bold tracking-wide">
            Seller Hub
          </h2>

          <p className="text-sm text-slate-300">
            CityBasket
          </p>
        </div>

      </div>

      {/* Menu */}

      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 py-6 space-y-2">

        <SidebarItem
          to="/seller/dashboard"
          icon={LayoutDashboard}
          title="Dashboard"
        />

        <SidebarItem
          to="/seller/products"
          icon={Package}
          title="Products"
        />

        <SidebarItem
          to="/seller/add-product"
          icon={CirclePlus}
          title="Add Product"
        />

        <SidebarItem
          to="/seller/orders"
          icon={ShoppingBag}
          title="Orders"
        />

        {/* <SidebarItem
          to="/seller/inventory"
          icon={Boxes}
          title="Inventory / Stock"
        /> */}

        <SidebarItem
          to="/seller/returns"
          icon={RotateCcw}
          title="Returns"
        />

        {/* <SidebarItem
          to="/seller/analytics"
          icon={BarChart3}
          title="Analytics / Reports"
        /> */}

        <SidebarItem
          to="/seller/payments"
          icon={Wallet}
          title="Payments / Earnings"
        />

        <SidebarItem
          to="/seller/promotions"
          icon={Megaphone}
          title="Promotions"
        />

      </div>

      {/* Bottom */}

      <div className="border-t border-slate-800 p-4 space-y-2">

        <SidebarItem
          to="/seller/settings"
          icon={Settings}
          title="Settings"
        />

        <SidebarItem
          to="/seller/help"
          icon={CircleHelp}
          title="Help & Support"
        />
        
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 transition-all duration-300 text-red-500 cursor-pointer bg-neutral-900"
        >
          <LogOut
            size={19}
            className="transition-transform duration-300 group-hover:scale-110"
          />

          <span className="text-[15px] font-medium">
            Log Out
          </span>
        </button>

      </div>

    </aside>
  );
}
