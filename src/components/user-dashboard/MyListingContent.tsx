"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type Listings = {
  _id: string;
  title: string;
  price: string;
  isApproved: boolean;
  isSponsored: boolean;
  sponsoredAmount: number;
};

const MyListingContent: React.FC = () => {
  const id =
    typeof window !== "undefined"
      ? window.localStorage.getItem("userId")
      : null;

  const [listings, setListings] = useState<Listings[]>([]);
  const [enrollments, setEnrollments] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isTrainer, setIsTrainer] = useState<boolean>(true);
  const [activeListingId, setActiveListingId] = useState<string | null>(null);
  const [sponsorshipAmount, setSponsorshipAmount] = useState<number | "">("");

  useEffect(() => {
    if (!id) return;

    const fetchListings = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/listing/getListingsByTrainerId/` +
          id
        );

        if (!response.data.listings || response.data.listings.length === 0) {
          setIsTrainer(false);
        } else {
          setListings(response.data.listings);
          setIsTrainer(true);
        }
      } catch (err: any) {
        setIsTrainer(false);
        setError(err.response?.data.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [id]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      const enrollmentCounts: { [key: string]: number } = {};
      await Promise.all(
        listings.map(async (listing) => {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_BASE_URL}/user/enrolled/${listing._id}`
            );
            enrollmentCounts[listing._id] = response.data.memberCount;
          } catch (error) {
            console.log("Error fetching enrollments for listing:", listing._id);
          }
        })
      );
      setEnrollments(enrollmentCounts);
    };

    if (listings.length > 0) {
      fetchEnrollments();
    }
  }, [listings]);

  if (loading) return <p>Loading...</p>;

  if (!isTrainer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Join as a Trainer</h1>
          <p className="mb-4">
            You are not registered as a trainer. Join now to create your own
            listings!
          </p>
          <Link href="/dashboard/teacher/join_as_teacher">
            <button className="bg-blue-300 hover:bg-blue-400 text-black px-4 py-2 rounded">
              Become a Trainer
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSponsorshipSubmit = async () => {
    if (!sponsorshipAmount || sponsorshipAmount <= 0) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/sponsor/updateSponsored/${activeListingId}`,
        {
          isSponsored: true,
          sponsoredAmount: sponsorshipAmount,
        }
      );

      if (response.data.success) {
        alert("Listing sponsored successfully!");
        setListings((prevListings) =>
          prevListings.map((listing) =>
            listing._id === activeListingId
              ? { ...listing, isSponsored: true, sponsoredAmount: sponsorshipAmount }
              : listing
          )
        );
      }
    } catch (error) {
      alert("Error sponsoring listing. Please try again.");
    } finally {
      setActiveListingId(null);
      setSponsorshipAmount("");
    }
  };

  return (
    <div className="flex-1 p-10">
      <div className="bg-white p-8 rounded-lg shadow-md space-y-6 w-full">
        <div className="container mx-auto p-6">
          <h1 className="text-3xl font-bold mb-6">My Listings</h1>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Status</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Enrollments</th>
                <th className="py-2 px-4">Actions</th>
                <th className="py-2 px-4">Sponsor Your Course</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing._id}>
                  <td className="py-2 px-4">{listing.title}</td>
                  <td className="py-2 px-4">
                    <span
                      className={
                        listing.isApproved
                          ? "text-green-600"
                          : "text-yellow-400"
                      }
                    >
                      {listing.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="py-2 px-4">${listing.price}</td>
                  <td className="py-2 px-4">{enrollments[listing._id] ?? 0}</td>
                  <td className="py-2 px-4 flex justify-between">
                    <Link
                      className="text-blue-600"
                      href={`/dashboard/teacher/preview?listingId=${listing._id}`}
                    >
                      View Listing
                    </Link>
                  </td>
                  <td className="py-2 px-4">
                    {listing.isSponsored ? (
                      <>
                        {activeListingId === listing._id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="1"
                              placeholder="Enter Amount"
                              className="border px-2 py-1 rounded"
                              value={sponsorshipAmount}
                              onChange={(e) => setSponsorshipAmount(Number(e.target.value))}
                            />
                            <button
                              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                              onClick={() => handleSponsorshipSubmit()}
                            >
                              Update
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600 font-bold">
                              Sponsored: <span className="text-blue-400">${listing.sponsoredAmount}</span>
                            </span>
                            <button
                              className="bg-yellow-500 text-white px-4 py-1 rounded hover:bg-yellow-600"
                              onClick={() => {
                                setActiveListingId(listing._id);
                                setSponsorshipAmount(listing.sponsoredAmount || 0);
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {activeListingId === listing._id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="1"
                              placeholder="Enter Amount"
                              className="border px-2 py-1 rounded"
                              value={sponsorshipAmount}
                              onChange={(e) => setSponsorshipAmount(Number(e.target.value))}
                            />
                            <button
                              className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                              onClick={() => handleSponsorshipSubmit()}
                            >
                              Submit
                            </button>
                          </div>
                        ) : (
                          <button
                            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                            onClick={() => setActiveListingId(listing._id)}
                          >
                            Yes
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyListingContent;
