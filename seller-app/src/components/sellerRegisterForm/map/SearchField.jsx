import { useEffect, useState } from "react";
import { searchLocation } from "./locationService";

export default function SearchField({ value, onSelectLocation }) {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);

      const data = await searchLocation(query);

      setResults(data);

      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item) => {
    setQuery(item.display_name);
    setResults([]);

    onSelectLocation({
      placeId: item.place_id,
      fullAddress: item.display_name,

      latitude: Number(item.lat),
      longitude: Number(item.lon),

      city:
        item.address.city ||
        item.address.town ||
        item.address.village ||
        "",

      state: item.address.state || "",

      country: item.address.country || "",

      pincode: item.address.postcode || "",
    });
  };
  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2">
        Store Address *
      </label>

      <input
        type="text"
        placeholder="Search your store address..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border rounded-md px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
      />

      {loading && (
        <div className="absolute bg-white w-full border mt-1 p-3 text-sm text-gray-500 rounded-md shadow">
          Searching...
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-md shadow-lg max-h-72 overflow-y-auto">
          {results.map((item) => (
            <button
              key={item.place_id}
              type="button"
              onClick={() => handleSelect(item)}
              className="block w-full text-left px-4 py-3 hover:bg-gray-100 border-b last:border-b-0"
            >
              {item.display_name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}