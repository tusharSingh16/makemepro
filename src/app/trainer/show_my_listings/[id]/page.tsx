"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import Navbar from "@/components/UserFlow/NavBar";
import Footer from "@/components/UserFlow/Footer";
import Link from "next/link";

type Listings = {
  _id: string;
  title: string;
  price: string;
  isApproved: boolean;
};

const MyListings: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [listings, setListings] = useState<Listings[]>([]);
  const [enrollments, setEnrollments] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchListings = async (id: string) => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/listing/getListingsByTrainerId/` + id
        );
        setListings(response.data.listings);
      } catch (err: any) {
        setError(err.response?.data.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchListings(id);
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

  return (
    <>
      <Navbar />
      <div className="container h-screen mx-auto p-6">
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
                  <span className={listing.isApproved ? "text-green-600" : "text-yellow-400"}>
                    {listing.isApproved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="py-2 px-4">${listing.price}</td>
                <td className="py-2 px-4">{enrollments[listing._id] ?? 0}</td>
                <td className="py-2 px-4 flex justify-between">
                  <Link className="text-blue-600" href={`/dashboard/teacher/preview?listingId=${listing._id}`}>
                    View Listing
                  </Link>
                  {/* <Link className="text-blue-600" href={`/`}> View Enrollments</Link> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default MyListings;
