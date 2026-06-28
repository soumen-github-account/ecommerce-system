import { Outlet } from "react-router-dom";
import SellerSidebar from "../components/sidebar/SellerSidebar";
import SellerNavbar from "../components/navbar/SellerNavbar";

export default function SellerLayout() {
  return (
    <div className="h-screen flex bg-gray-100">

      {/* Sidebar */}
      <SellerSidebar />

      {/* Right Section */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* Navbar */}
        <SellerNavbar />

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}