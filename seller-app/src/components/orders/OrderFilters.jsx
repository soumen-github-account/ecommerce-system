import {
    Search,
    Filter
} from "lucide-react";

export default function OrderFilters() {

    return (

        <div className="bg-white rounded-2xl border mt-8 p-5">

            <div className="flex flex-col xl:flex-row gap-4">

                <div className="relative flex-1">

                    <Search
                        className="absolute left-4 top-3.5 text-gray-400"
                        size={20}
                    />

                    <input
                        placeholder="Search Order ID, Customer..."
                        className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
                    />

                </div>

                <select className="border rounded-xl px-5">
                    <option>Status</option>
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Packed</option>
                    <option>Delivered</option>
                </select>

                <select className="border rounded-xl px-5">
                    <option>Courier</option>
                    <option>Delhivery</option>
                    <option>Ekart</option>
                    <option>Xpressbees</option>
                </select>

                <input
                    type="date"
                    className="border rounded-xl px-4"
                />

                <select className="border rounded-xl px-5">
                    <option>Bulk Action</option>
                    <option>Generate Labels</option>
                    <option>Download Labels</option>
                    <option>Download Invoice</option>
                    <option>Packing Slip</option>
                    <option>Mark Ready</option>
                </select>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl flex items-center gap-2">

                    <Filter size={18} />

                    Apply

                </button>

            </div>

        </div>

    );
}