import { createContext, useContext, useEffect, useState } from "react";
import { getSellers, logoutSeller } from "../services/sellerApi";



const SellerContext = createContext()

export const SellerProvider = ({children}) => {
    const backendUrl = "";
    const [seller, setSeller] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSeller = async () => {
            setLoading(true)
            try {
                const data = await getSellers();
                setSeller(data);
                console.log(data)
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSeller();
    }, []);

    const handleLogout = async () => {
        try {
        const res = await logoutSeller();

        setSeller(null);

        toast.success(res.message);

        navigate("/login-seller-account", {
            replace: true,
        });
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Logout failed"
            );
        }
    };

    const value = {
        seller, loading, handleLogout
    }

    return (
        <SellerContext.Provider value={value}>
            {children}
        </SellerContext.Provider>
    )
}

export const useSeller = () => useContext(SellerContext);