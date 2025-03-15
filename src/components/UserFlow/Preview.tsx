"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Pill from "@/components/listing/Pill";
import { Button } from "../trainer-dashboard/ui/button";
import { headers } from "next/headers";
import Popup from "../trainer-dashboard/PopUp";
import MemberEnrollmentTable from "@/components/listing-detail/MemberEnrollmentTable";

const PreviewPage = () => {
  const searchParams = useSearchParams();
  const listingId = searchParams.get("listingId");
  const router = useRouter();

  const [listing, setListing] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [popUpMessage, setPopUpMessage] = useState("");

  useEffect(() => {
    if (!listingId) return;

    const fetchListing = async (id: string) => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/listing/listing/${id}`
        );
        const fetchedListing = response.data.listing;
        setListing(fetchedListing);
      } catch (error) {
        console.log("Error fetching listing:", error);
        setError("Error fetching listing");
      }
    };

    fetchListing(listingId);
  }, [listingId]);

  const handlePost = () => {
    if (!listingId) return;
    console.log(listingId);
  };

  const handleClick = () => {
    router.push(`/userflow/addListing?listingId=${listingId}`);
  };

  const handleDelete = async (listingId: string) => {
    if (typeof window === "undefined") return; // Ensure we are in the browser

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Token not found");
        return;
      }

      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/listing/deleteListingById/${listingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPopUpMessage("Listing Deleted Successfully");
      setShowPopup(true);
    } catch (error) {
      console.log("Error deleting listing:", error);
    }
  };

  if (!listingId) {
    return <div>No data provided</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!listing) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="w-full flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Listing</h1>
        <Pill
          text={`${!listing.isApproved ? `Pending for approval` : `Approved`}`}
          color={`${!listing.isApproved ? `bg-yellow-400` : `bg-green-400`}`}
        />
      </div>
      <div className="bg-white shadow-lg rounded-lg p-8 space-y-8">
        <div className="border-b pb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {listing.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-32">
                  Category:
                </span>
                <span className="text-gray-800">{listing.category}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-32">
                  Sub Category:
                </span>
                <span className="text-gray-800">{listing.subCategory}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-32">Price:</span>
                <span className="text-gray-800">
                  ${listing.price} {listing.priceMode}
                </span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-32">Mode:</span>
                <span className="text-gray-800">{listing.mode}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-32">
                  {listing.mode === "Offline" ? "Location" : "Zoom Link"}:
                </span>
                <span className="text-gray-800">{listing.location}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-32">
                  Quantity:
                </span>
                <span className="text-gray-800">{listing.quantity}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-32">
                  Start Date:
                </span>
                <span className="text-gray-800">{listing.startDate}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-32">
                  End Date:
                </span>
                <span className="text-gray-800">{listing.endDate}</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-600 w-32">Days:</span>
                <div className="flex flex-wrap gap-2">
                  {listing.days.map((day: string) => (
                    <span
                      key={day}
                      className="px-2 py-1 bg-gray-100 rounded-md text-sm"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-32">Gender:</span>
                <span className="text-gray-800">{listing.gender}</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium text-gray-600 w-32">
                  Class Size:
                </span>
                <span className="text-gray-800">{listing.classSize}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-medium text-gray-600 w-32">
                Start Time:
              </span>
              <span className="text-gray-800">{listing.startTime}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600 w-32">End Time:</span>
              <span className="text-gray-800">{listing.endTime}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-medium text-gray-600 w-32">Min Age:</span>
              <span className="text-gray-800">{listing.minAge}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600 w-32">Max Age:</span>
              <span className="text-gray-800">{listing.maxAge}</span>
            </div>
          </div>
          <div className="space-y-2">
            <span className="font-medium text-gray-600">Pre-Requisites:</span>
            <ul className="list-disc pl-8 space-y-1">
              {listing.preRequisites.map((prerequisite: string) => (
                <li key={prerequisite} className="text-gray-800">
                  {prerequisite}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4 border-b pb-6">
          <h3 className="font-medium text-gray-600">Description:</h3>
          <p className="whitespace-pre-line text-gray-800 leading-relaxed">
            {listing.description}
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium text-gray-600">Enrollments:</h3>
          <div className="w-full">
            <MemberEnrollmentTable listingId={listingId} />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6">
        <Button
          onClick={handleClick}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Edit Listing
        </Button>
        <Button
          onClick={() => handleDelete(listingId)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Delete Listing
        </Button>
      </div>

      <Popup
        message={popUpMessage}
        isOpen={showPopup}
        onClose={() => setShowPopup(false)}
        redirectTo="/"
      />
    </div>
  );
};

export default PreviewPage;
