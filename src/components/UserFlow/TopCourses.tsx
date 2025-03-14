"use client";

import { Clock, MapPin } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Spinner } from "../ui/spinner";

interface Trainer {
  _id: string;
  fname: string;
  lname: string;
  imageUrl: string;
}

interface Listing {
  _id: string;
  category: string;
  subCategory: string;
  title: string;
  imageUrl: string;
  priceMode: string;
  price: string;
  mode: string;
  location: string;
  quantity: string;
  classSize: string;
  startDate: string;
  endDate: string;
  days: string;
  gender: string;
  startTime: string;
  endTime: string;
  minAge: string;
  maxAge: string;
  description: string;
  trainerId: Trainer;
  listingId: string;
  isFavorite: boolean;
  avgRating: number;
}

export default function TopCourses() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [getImageUrl, setImageUrl] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [trainerImageUrls, setTrainerImageUrls] = useState<{ [key: string]: string }>({});

  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/listing/listing/`
        );
        setListings(data);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const fetchImages = async () => {
      setIsImageLoading(true);
      const newImageUrls: { [key: string]: string } = {};
      const newTrainerImageUrls: { [key: string]: string } = {};

      await Promise.all(
        listings.map(async (listing) => {
          try {
            // Fetch listing image
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_BASE_URL}/upload?imageUrl=${listing.imageUrl}`
            );
            if (!response.ok) throw new Error("Failed to fetch signed URL");

            const data = await response.json();
            newImageUrls[listing._id] = data.signedUrl;
          } catch (error) {
            console.error("Error fetching image for:", listing._id, error);
          }

          // Fetch trainer image
          if (listing.trainerId?.imageUrl) {
            try {
              const response2 = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/upload?imageUrl=${listing.trainerId.imageUrl}`
              );
              if (!response2.ok) throw new Error("Failed to fetch signed URL");

              const data2 = await response2.json();
              newTrainerImageUrls[listing.trainerId._id] = data2.signedUrl;
            } catch (error) {
              console.error("Error fetching trainer image:", listing.trainerId._id, error);
            }
          }
        })
      );

      setImageUrl(newImageUrls);
      setIsImageLoading(false);
      setTrainerImageUrls(newTrainerImageUrls);
    };

    if (listings.length > 0) {
      fetchImages();
    }
  }, [listings]);

  const getRandomListings = (listings: Listing[], count: number) => {
    const shuffled = [...listings].sort((a, b) => b.avgRating - a.avgRating) // Sort by avgRating (highest first)
      .slice(0, count);
    return shuffled.slice(0, count);
  };

  const randomListings = getRandomListings(listings, 6);

  const ListingCard = ({ listing }: { listing: Listing }) => (
    <div
      onClick={() => router.push(`/${listing.category}/${listing.subCategory}/${listing._id}`)}
      className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 hover:-translate-y-2"
    >
      <div className="aspect-video relative rounded-t-xl overflow-hidden">
        <Image
          src={getImageUrl[listing._id] || "/img/tempListingImg.jpg"}
          alt={listing.title}
          width={300}
          height={200}
          className="rounded-lg object-cover w-full"
        />
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-base sm:text-lg mb-1 sm:mb-2">
          {listing.title}
        </h3>
        <p className="text-blue-500 font-bold text-sm sm:text-base mb-2 sm:mb-3">
          $ {listing.price}
        </p>
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{listing.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{listing.startTime} - {listing.endTime}</span>
          </div>
          <div className="flex items-center gap-1">
            ratings:
            <span>{listing.avgRating}</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-1 sm:gap-2">
            <Image
              src={trainerImageUrls[listing.trainerId._id] || "/img/default-user.jpg"}
              alt="Trainer"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="font-medium">
              {listing.trainerId?.fname} {listing.trainerId?.lname}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-white/40 container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center mb-5">
        Top <span className="text-blue-600">Courses</span>
      </h2>
      <p className="text-center text-gray-500 mt-2 mb-12">
        Explore our top-rated courses designed to enhance your skills and knowledge across various domains. <br />
        Learn from industry experts and stay ahead in your career.
      </p>

      {isLoading || isImageLoading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {randomListings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      )}

      <div className="flex justify-center mt-8">
        <Button
          onClick={() => router.push(`/all/courses`)}
          variant="outline"
          className="px-8 bg-blue-600 hover:bg-blue-600 text-black"
        >
          Load more listing
        </Button>
      </div>
    </section>
  );
}