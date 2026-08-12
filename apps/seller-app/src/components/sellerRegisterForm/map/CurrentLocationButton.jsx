import { reverseGeocode } from "./ReverseGeocode";

export default function CurrentLocationButton({
  onLocationChange,
  setPosition,
}) {

  const handleCurrentLocation = () => {

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setPosition([
          latitude,
          longitude,
        ]);

        const location = await reverseGeocode(
          latitude,
          longitude
        );

        if (location) {
          onLocationChange(location);
        }

      },

      (error) => {

        console.log(error);

        alert("Unable to get your location.");

      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }

    );

  };

  return (
    <button
      type="button"
      onClick={handleCurrentLocation}
      className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
    >
      📍 Use Current Location
    </button>
  );
}