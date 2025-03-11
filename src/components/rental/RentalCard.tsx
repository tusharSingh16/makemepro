"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setForm } from "@/lib/store/formSlice";
import { MapPin, Users } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

interface ListingCardProps {
  rentalId: string;
  name: string;
  email: string;
  address: string;
  availability: string;
  pricing: string;
  ratings: number;
  amenities: string;
  timeSlots: string;
  images: string[];
  reviews: string[];
  categoryName: string;
  subCategoryName: string;
}

const RentalCard: React.FC<ListingCardProps> = ({
  rentalId,
  name,
  email,
  address,
  availability,
  pricing,
  ratings,
  amenities,
  timeSlots,
  images,
  reviews,
  categoryName,
  subCategoryName,
}) => {

  console.log('xxx');
  console.log(rentalId);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const [getImageUrl, setImageUrl] = useState<string>("/img/tempListingImg.jpg");

  // const sendData = () => {
  //   dispatch(
  //     setForm({
  //       rentalId,
  //       name,
  //       email,
  //       address,
  //       availability,
  //       pricing,
  //       ratings,
  //       amenities,
  //       timeSlots,
  //       images,
  //       reviews,
  //       categoryName,
  //       subCategoryName,
  //     })
  //   );
  // };

  useEffect(() => {
    const fetchImageUrl = async () => {
      if (images.length > 0) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/upload?imageUrl=${images[0]}`
          );
          if (response.ok) {
            const data = await response.json();
            setImageUrl(data.signedUrl);
          }
        } catch (error) {
          console.error("Failed to fetch image URL:", error);
        }
      }
    };

    fetchImageUrl();
  }, [images]);

  return (
    <div className="flex flex-col items-center bg-background">
      <div className="w-full h-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          <Card className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 hover:-translate-y-2">
            <div className="relative">
              <img
                src={getImageUrl}
                alt={name}
                className="w-full h-[250px] object-cover rounded-t-lg"
              />
            </div>

            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-4 text-gray-500">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-6 h-6 opacity-30" />
                    <span className="text-sm sm:text-base">{address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-6 h-6 opacity-30" />
                    <span className="text-sm sm:text-base">{amenities}</span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{name}</h3>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-lg sm:text-xl font-semibold text-[#3D7A81]">
                  {pricing}
                </span>
                <Button
                  variant="outline"
                  className="border-[#1D2735] text-[#1D2735] text-sm sm:text-base"
                  onClick={() => {
                    // sendData();
                    router.push(`/rentals/${rentalId}`);
                  }}
                >
                  Rent Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RentalCard;
