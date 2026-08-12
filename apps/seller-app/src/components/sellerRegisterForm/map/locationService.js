export const searchLocation = async (query) => {
  if (!query || query.trim().length < 3) return [];

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
        query
      )}&countrycodes=in&addressdetails=1&limit=5`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};