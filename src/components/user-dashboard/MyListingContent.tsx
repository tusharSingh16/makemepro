"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

type Listings = {
  _id: string;
  title: string;
  price: string;
  isApproved: boolean;
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
