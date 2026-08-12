import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SellerLogin = () => {
    const navigate = useNavigate()
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

    const handleChange = (e) => {
        setForm((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
        }));
    };

   const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:5000/api/v1/sellers/seller/login",
                {
                    email: form.email,
                    password: form.password,
                },
                {
                    withCredentials: true,
                }
            );

            toast.success(res.data.message);
            navigate("/seller/dashboard");
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message || "Something went wrong"
            );
        }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-md p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Seller Login
          </h1>

          <p className="text-gray-500 mt-2">
            Login to access your seller dashboard.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Login
          </button>
        </form>

        <div className="mt-8 border-t pt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have a seller account?
          </p>

          <button
            type="button"
            className="mt-3 text-blue-600 font-semibold hover:underline"
          >
            Register as Seller
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;