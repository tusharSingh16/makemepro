// services/locationService.ts

export const fetchLocationCoordinates = async () => {
  try {
    // Fetch the place name as a string from your API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/listing/listing/66daf615d126a0a164db5965`);

    const ress = await response.json(); // Assuming API returns the place name as plain text
    const placeName =ress.listing.location
    // Use fetch to make a request to the Google Maps Geocoding API
    const geocodeResponse = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        placeName
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    const geocodeData = await geocodeResponse.json();
    if (geocodeData.results.length > 0) {
      const { lat, lng } = geocodeData.results[0].geometry.location;
      return { lat, lng };
    } else {
      console.error('No results found for the location.');
      return null;
    }
  } catch (error) {
    console.error('Error fetching location coordinates:', error);
    return null;
  }
};

