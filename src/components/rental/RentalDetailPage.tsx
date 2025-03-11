"use client"

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setForm } from "@/lib/store/formSlice";
import NewRentalDetailPage from "./NewRentalDetailPage";
import Reviews from "../listing-detail/Reviews";
import RentalSideLayout from "./RentalSideLayout";



interface TrainerData {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  experience: string;
  qualifications: string;
  phone: string;
  avgRating: number;
  [key: string]: any;
}

interface ListingDetailPageProps {
  rentalId: string;
}

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
}

const ListingDetail: React.FC<ListingDetailPageProps> = ({ rentalId }) => {
  const [data, setData] = useState<TrainerData | null>(null);
  const [getListing, setListing] = useState<Rentals>({} as Rentals);
  const form = useSelector((state: RootState) => state.form);
  const dispatch = useDispatch();
  // Fetch listing details
  useEffect(() => {
    const fetchListingData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/listing/listing/${rentalId}`
        );
        const listing = response.data.listing;
        setListing(listing);
        dispatch(setForm(listing))
      } catch (error) {
        console.log("Error fetching listing data:", error);
      }
    };

    fetchListingData();
  }, [rentalId, dispatch]);

  // Fetch trainer details if trainerId is available
  useEffect(() => {
    if (form.trainerId) {
      const fetchTrainerData = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/trainers/${form.trainerId}`
          );
          setData(response.data.trainer);
        } catch (error) {
          console.log("Error fetching trainer data:", error);
        }
      };

      fetchTrainerData();
    }
  }, [form.trainerId]);

  return (
    <div className="w-full">
      <div>
        <NewRentalDetailPage rentalId ={rentalId}/>
      </div>
    </div>
  );
};

export default ListingDetail;
