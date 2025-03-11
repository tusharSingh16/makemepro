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
    <div className="container mx-auto p-6">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-2xl font-bold ">Your Listing</h1>
        <Pill
          text={`${!listing.isApproved ? `Pending for approval` : `Approved`}`}
          color={`${!listing.isApproved ? `bg-yellow-400` : `bg-green-400`}`}
        />
      </div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2"> {listing.title}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p>
              <span className="font-semibold">Category:</span>{" "}
              {listing.category}
            </p>
            <p>
              <span className="font-semibold">Sub Category:</span>{" "}
              {listing.subCategory}
            </p>
            <p>
              <span className="font-semibold">Price:</span> ${listing.price}{" "}
              {listing.priceMode}
            </p>
            <p>
              <span className="font-semibold">Mode:</span> {listing.mode}
            </p>
            <p>
              <span className="font-semibold">
                {listing.mode === "Offline" ? "Location" : "Zoom Link"}:
              </span>{" "}
              {listing.location}
            </p>
            <p>
              <span className="font-semibold">Quantity:</span>{" "}
              {listing.quantity}
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">Start Date:</span>{" "}
              {listing.startDate}
            </p>
            <p>
              <span className="font-semibold">End Date:</span> {listing.endDate}
            </p>
            <p className="flex gap-2">
              <span className="font-semibold">Days:</span>
              <span className="flex gap-2">
                {listing.days.map((day: string) => (
                  <span className="flex" key={day}>
                    {day}
                  </span>
                ))}
              </span>
            </p>
            <p>
              <span className="font-semibold">Gender:</span> {listing.gender}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p>
              <span className="font-semibold">Start Time:</span>{" "}
              {listing.startTime}
            </p>
            <p>
              <span className="font-semibold">End Time:</span> {listing.endTime}
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">Min Age:</span> {listing.minAge}
            </p>
            <p>
              <span className="font-semibold">Max Age</span> {listing.maxAge}
            </p>
          </div>
          <p>
            <span className="font-semibold">Class Size</span>{" "}
            {listing.classSize}
          </p>
          <p>
            <span className="font-semibold">Pre-Requistes</span>{" "}
            {listing.preRequistes}
          </p>
          <div></div>
        </div>

        <div>
          <p>
            <span className="font-semibold">Description:</span>
          </p>
          <p className="whitespace-pre-line">{listing.description}</p>
        </div>
        <div className="my-4">
          <p>
            <span className="font-semibold ">Enrollments:</span>
          </p>
          <div className="m-4 w-3/4">
            <MemberEnrollmentTable listingId={listingId} />
          </div>
        </div>
      </div>
      <div className="flex justify-between pt-3">
        <Button onClick={handleClick}>Edit Listing</Button>
        <Button onClick={() => handleDelete(listingId)}>Delete Listing</Button>
      </div>
      {/* Popup for messages */}
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
