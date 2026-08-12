import { Navigate } from "react-router-dom";
import { useSeller } from "../contexts/SellerContext";

export default function ProtectedSellerRoute({ children }) {
  const { seller, loading } = useSeller();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!seller) {
    return <Navigate to="/login-seller-account" replace />;
  }

  return children;
}