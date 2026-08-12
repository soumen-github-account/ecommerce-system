import { useEffect, useState } from "react";
import Input from "../../common/Input";
import Select from "../../common/Select";
import SearchField from "../map/SearchField";
import StoreMap from "../map/StoreMap";
import CurrentLocationButton from "../map/CurrentLocationButton";


export default function Step3Store({ next, prev, update, data }) {
  const [address, setAddress] = useState(
    data.fullAddress || ""
  );
  const handleSubmit = (e) => {
    e.preventDefault();
    next();
  };
  const [position, setPosition] = useState(
  data.latitude && data.longitude
    ? [data.latitude, data.longitude]
    : [22.5726, 88.3639]
  );

  // const handleLocationSelect = (location) => {
  //   setPosition([
  //     location.latitude,
  //     location.longitude,
  //   ]);

  //   update("store", {
  //     fullAddress: location.fullAddress,
  //     placeId: location.placeId,

  //     latitude: location.latitude,
  //     longitude: location.longitude,

  //     city: location.city,
  //     state: location.state,
  //     country: location.country,
  //     pincode: location.pincode,
  //   });

  // };

  const handleLocationSelect = (location) => {

    setPosition([
      location.latitude,
      location.longitude,
    ]);

    setAddress(location.fullAddress);

    update("store", {

      fullAddress: location.fullAddress,

      placeId: location.placeId,

      latitude: location.latitude,

      longitude: location.longitude,

      city: location.city,

      state: location.state,

      country: location.country,

      pincode: location.pincode,

    });

  };
  useEffect(() => {
    setAddress(data.fullAddress || "");
  }, [data.fullAddress]);

  return (
    <div className="max-w-2xl bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-sm text-gray-500 uppercase tracking-wide">Step 3: Store Setup</h3>
      <h2 className="text-2xl font-bold mb-6">Set Up Your Store</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2">
            <Input
              label="Store Name *" 
              value={data.storeName || ""} 
              onChange={(e) => update('store', { storeName: e.target.value })} 
               
            />
          </div>
          
          <Select
            label="Store Category *" 
            options={["Electronics", "Fashion", "Home & Kitchen", "Beauty", "Books", "Sports"]}
            value={data.category || ""}
            onChange={(e) => update('store', { category: e.target.value })}
            
          />

          <Input 
            label="Store URL/Slug (Optional)" 
            value={data.storeUrl || ""} 
            onChange={(e) => update('store', { storeUrl: e.target.value })} 
          />
        </div>

        <div className="pt-4 border-t">
          <label className="block text-sm font-medium text-gray-700 mb-2">Store Description</label>
          <textarea 
            className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
            rows="4"
            value={data.description || ""}
            onChange={(e) => update('store', { description: e.target.value })}
            placeholder="Tell us about your store..."
          />
        </div>
        <div className="pt-4 border-t space-y-5">
          <SearchField
            value={address}
            onSelectLocation={handleLocationSelect}
          />
          <CurrentLocationButton
            setPosition={setPosition}
            onLocationChange={handleLocationSelect}
          />

          <StoreMap
            position={position}
            onLocationChange={handleLocationSelect}
          />

          <div className="grid grid-cols-2 gap-4">

            <Input
              label="City"
              value={data.city || ""}
              readOnly
            />

            <Input
              label="State"
              value={data.state || ""}
              readOnly
            />

            <Input
              label="Country"
              value={data.country || ""}
              readOnly
            />

            <Input
              label="Pincode"
              value={data.pincode || ""}
              readOnly
            />

            <div className="col-span-2">
              <Input
                label="Full Address"
                value={data.fullAddress || ""}
                readOnly
              />
            </div>

          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button type="button" onClick={prev} className="px-6 py-2 border rounded text-gray-700 hover:bg-gray-50">
            Back
          </button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Next
          </button>
        </div>
      </form>
    </div>
  );
}