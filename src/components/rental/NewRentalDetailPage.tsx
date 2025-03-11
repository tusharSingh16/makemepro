import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";
import RentalSideLayout from "./RentalSideLayout";
import { CircleCheck } from "lucide-react";

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface Availability {
  days: string[];
}

interface Pricing {
  dailyRate: number;
  hourlyRate: number;
}

interface Rentals {
  _id: string;
  name: string;
  email: string;
  address: Address;
  availability: Availability;
  pricing: Pricing;
  ratings: number;
  amenities: string[];
  timeSlots: string[];
  images: string[];
  reviews: string[];
  sportsAvailable: string[];
}

interface RentalProps {
  rentalId: string;
}

const NewRentalDetailPage: React.FC<RentalProps> = ({ rentalId }) => {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>("/img/football-ground-setup-1000x1000.webp");
  const [listing, setListing] = useState<Rentals | null>(null);

  useEffect(() => {
    const fetchListingData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/rentals/${rentalId}`
        );
        setListing(response.data);
      } catch (error) {
        console.error("Error fetching listing data:", error);
      }
    };

    if (rentalId) {
      fetchListingData();
    }
  }, [rentalId]);

  const formattedDays = listing?.availability?.days.join(", ") || "N/A";

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex w-full">
        <div className="w-[800px] h-[700px] relative overflow-hidden rounded-lg">
          <Image src={listing?.images?.[0] || imageUrl} alt="img" layout="fill" objectFit="cover" />
        </div>
          <div>
            <RentalSideLayout  address ={listing?.address}/>
          </div>
      </div>

      {/* Sports Available Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-2">
          {listing?.name}
        </h2>
        {/* <h2 className="text-xl font-semibold mb-2">
          Sports Available{' '}
          <span className="text-gray-500 text-sm">
            (Click on sports to view price chart)
          </span>
        </h2> */}
        <div className="flex space-x-4">
          {listing?.sportsAvailable?.map((sport, index) => (
            <div key={index} className="flex flex-col items-center p-4 border rounded-lg shadow-sm">
              {sport === 'Football' && <i className="fas fa-futbol text-3xl mb-2"></i>}
              {sport === 'Ultimate Frisbee' && <i className="fas fa-compact-disc text-3xl mb-2"></i>}
              {sport === 'Rugby' && <i className="fas fa-football-ball text-3xl mb-2"></i>}
              <span>{sport}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Amenities Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {listing?.amenities?.map((amenity, index) => (
            <div key={index} className="flex items-center space-x-2">
              <CircleCheck color="#2563eb" />
              <span>{amenity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* About Venue Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">About Venue</h2>
        <p className="mb-2">
          <strong>Football:</strong>
        </p>
        <ul className="list-disc list-inside">
          <li>
            It is recommended but not compulsory to wear football studs
            while playing at the facility.
          </li>
          <li>Metal studs are not allowed.</li>
        </ul>
      </div>

      {/* Related Section */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">
          Related To Depot18 - Sports Jayamahal Palace Road
        </h2>
        <p>
          Sports Clubs in Jayamahal Palace Road, Football Grounds in
          Jayamahal Palace Road, Ultimate-frisbee Clubs in Jayamahal Palace
          Road, Rugby Fields in Jayamahal Palace Road, Football Grounds in
          Bengaluru, Ultimate-frisbee Clubs in Bengaluru, Rugby Fields in
          Bengaluru, Sports Clubs in Bengaluru
        </p>
      </div>
    </div>
  );
};

export default NewRentalDetailPage;
