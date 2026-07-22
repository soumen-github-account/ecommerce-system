import React from 'react'
import AddProductPage from './pages/AddProductPage'
import { Toaster } from "sonner";
import { Route, Routes } from 'react-router-dom';
import CategoryAdmin from './pages/CategoryAdmin';
import MainPage from './pages/MainPage';
import SellerRegistration from './pages/SellerRegistration';
import SellerLogin from './pages/SellerLogin';
import SellerDashboard from './pages/SellerDashboard';
import SellerLayout from './layouts/SellerLayout';
import GuestSellerRoute from './pages/GuestSellerRoute';
import ProtectedSellerRoute from './pages/ProtectedSellerRoute';
import OrdersDashboard from './pages/OrdersDashboard';
import { OrderProvider } from './contexts/OrderContext';

const App = () => {
  return (
    <div>
      <Toaster richColors position="top-right" />

      <Routes>
        <Route path='/' element={<GuestSellerRoute><MainPage /></GuestSellerRoute>}/>
        <Route path='/register-seller-account' element={<GuestSellerRoute><SellerRegistration /></GuestSellerRoute>} />
        <Route path='/login-seller-account' element={<GuestSellerRoute><SellerLogin /></GuestSellerRoute>} />
        
        {/* Seller Panel */}
        <Route path="/seller" element={<ProtectedSellerRoute><SellerLayout /></ProtectedSellerRoute>}>

          <Route
            path="dashboard"
            element={<SellerDashboard />}
          />

          <Route
            path="products"
            element={<div>Products</div>}
          />

          <Route
            path="add-product"
            element={<AddProductPage />}
          />

          <Route
            path="orders"
            element={<OrderProvider><OrdersDashboard /></OrderProvider>}
          />

          <Route
            path="inventory"
            element={<div>Inventory</div>}
          />

          <Route
            path="analytics"
            element={<div>Analytics</div>}
          />

          <Route
            path="payments"
            element={<div>Payments</div>}
          />

          <Route
            path="settings"
            element={<div>Settings</div>}
          />

        </Route>
        <Route path='/c' element={<CategoryAdmin />} />
      </Routes>
    </div>
  )
}

export default App
