import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Modal from 'react-modal';

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Add {
  address: Address | undefined;
}

const RentalSideLayout: React.FC<Add> = ({ address }) => {
  const [location, setLocation] = useState({
    lat: 0,
    lng: 0,
    address: '',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCorporateModalOpen, setIsCorporateModalOpen] = useState(false);

  const handleBookNow = () => {
    setIsModalOpen(true);
  };

  const handleShare = () => {
    // Simple share functionality via URL
    const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Location URL copied to clipboard!');
    });
  };

  const handleBulkCorporate = () => {
    setIsCorporateModalOpen(true);
  };

  const handleLocationChange = (newLocation: { lat: number; lng: number; address: string }) => {
    setLocation(newLocation);
    console.log(newLocation);
    
  };

  useEffect(() => {
    if (address) {
      const fetchLocation = async () => {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${address.street + ', ' + address.city + ', ' + address.state}&format=json&limit=1`);
          const data = await response.json();
          if (data.length > 0) {
            const newLocation = {
              lat: parseFloat(data[0].lat),
              lng: parseFloat(data[0].lon),
              address: data[0].display_name,
            };
            handleLocationChange(newLocation);
          }
        } catch (error) {
          console.error('Error fetching location:', error);
        }
      };
      fetchLocation();
    }
  }, [address]);

  const containerStyle = {
    width: '500px',
    height: '400px',
  };

  return (
    <div className="bg-gray-100 p-4 w-[580px] ">
      <div className="max-w-2xl  mx-auto bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center p-4">
          <button className="bg-blue-500 text-white font-bold py-2 px-4 rounded" onClick={handleBookNow}>
            Book Now
          </button>
          <div className="flex space-x-2">
            <button className="flex items-center border border-gray-300 text-gray-700 font-bold py-2 px-4 rounded" onClick={handleShare}>
              Share
            </button>
            <button className="border border-blue-500 text-blue-500 font-bold py-2 px-4 rounded" onClick={handleBulkCorporate}>
              Bulk / Corporate
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <h2 className="font-bold text-lg">Timing</h2>
            <p>5:00 AM - 12:00 AM</p>
          </div>
          <div>
            <h2 className="font-bold text-lg">Location</h2>
            <p>{`${address?.street},${address?.city},${address?.state},${address?.country}`}</p>
            <LoadScript googleMapsApiKey={`${process.env.GOOGLE_CLIENT_ID}`} >
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: location.lat, lng: location.lng }}
                zoom={15}
              >
                <Marker position={{ lat: location.lat, lng: location.lng }} />
              </GoogleMap>
            </LoadScript>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalSideLayout;
