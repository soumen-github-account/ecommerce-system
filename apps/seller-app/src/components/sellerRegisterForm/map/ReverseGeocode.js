export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    return {
      placeId: data.place_id,
      fullAddress: data.display_name,

      latitude: Number(latitude),
      longitude: Number(longitude),

      city:
        data.address.city ||
        data.address.town ||
        data.address.village ||
        "",

      state: data.address.state || "",

      country: data.address.country || "",

      pincode: data.address.postcode || "",
    };
  } catch (error) {
    console.error(error);

    return null;
  }
};