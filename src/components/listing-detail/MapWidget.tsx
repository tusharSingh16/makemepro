// components/MapWidget.tsx
import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { RootState } from '@/lib/store/store';
import { useSelector } from 'react-redux';


const containerStyle = {
  width: '100%',
  height: '400px',
};

const MapWidget: React.FC = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_MAPS_API_KEY as string,
  });

  // const placeName = useSelector((state: RootState) => state.place.placeName); // Access place name from Redux store
  const form = useSelector((state: RootState) => state.form);
const placeName=form.location
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const getCoordinates = async () => {
      if (!placeName) return;

      try {
        // Fetch coordinates using the Google Geocoding API
        const geocodeResponse = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            placeName
          )}&key=${process.env.NEXT_PUBLIC_MAPS_API_KEY}`
        );
        const geocodeData = await geocodeResponse.json();
        if (geocodeData.results.length > 0) {
          const { lat, lng } = geocodeData.results[0].geometry.location;
          setLocation({ lat, lng });
        } else {
          console.log('No results found for the location.');
        }
      } catch (error) {
        console.log('Error fetching location coordinates:', error);
      }
    };

    getCoordinates();
  }, [placeName]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="w-full h-96">
      {location ? (
        <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={10}>
          <Marker position={location} />
        </GoogleMap>
      ) : (
        <div>Loading location...</div>
      )}
    </div>
  );
};

export default MapWidget;
