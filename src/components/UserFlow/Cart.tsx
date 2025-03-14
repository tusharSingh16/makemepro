"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

type CartItem = {
  memberId: string;
  listingId: string;
};

type ListingDetails = {
  listingId: string;
  trainerId: string;
  category: string;
  title: string;
  priceMode: string;
  price: string;
  mode: string;
  location: string;
  quantity: string;
  classSize: string;
  startDate: string;
  endDate: string;
  days: string[];
  gender: string;
  startTime: string;
  endTime: string;
  minAge: string;
  maxAge: string;
  preRequisites: string;
  description: string;
  isApproved: boolean;
};

type MemberDetails = {
  memberId: string;
  name: string;
  age: number;
  relationship: string;
  gender: string;
};

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [listingDetails, setListingDetails] = useState<Record<string, ListingDetails>>({});
  const [memberDetails, setMemberDetails] = useState<Record<string, MemberDetails>>({});
  const [cartCount, setCartCount] = useState<number>(0);

  // Fetch cart data from localStorage and update cart count
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setCartItems(parsedCart);
      setCartCount(parsedCart.length);
    }
  }, []); // Empty dependency array ensures this only runs on mount

  // Fetch listing and member details when cartItems change
  useEffect(() => {
    if (cartItems.length > 0) {
      const fetchDetails = async () => {
        const uniqueListingIds = Array.from(new Set(cartItems.map((item) => item.listingId)));
        const uniqueMemberIds = Array.from(new Set(cartItems.map((item) => item.memberId)));

        const listingData = await Promise.all(
          uniqueListingIds.map((id) => fetchListingDetails(id))
        );
        const memberData = await Promise.all(
          uniqueMemberIds.map((id) => fetchMemberDetails(id))
        );

        setListingDetails(
          Object.fromEntries(listingData.map((detail) => [detail.listingId, detail]))
        );
        setMemberDetails(
          Object.fromEntries(memberData.map((member) => [member.memberId, member]))
        );
      };

      fetchDetails();
    }
  }, [cartItems]);

  // Function to fetch listing details by listingId using Axios
  const fetchListingDetails = async (listingId: string): Promise<ListingDetails> => {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/listing/listing/${listingId}`);
    return { listingId, ...response.data.listing };
  };

  // Function to fetch member details by memberId using Axios
  const fetchMemberDetails = async (memberId: string): Promise<MemberDetails> => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/members/${memberId}`,
      {
        headers: {
          Authorization: "Bearer " + window.localStorage.getItem("token"),
        },
      }
    );
    return { memberId, ...response.data.member };
  };

  // Function to handle item deletion
  const handleDeleteItem = (itemToDelete: CartItem) => {
    // Remove item from cartItems array
    const updatedCart = cartItems.filter(
      (item) => !(item.memberId === itemToDelete.memberId && item.listingId === itemToDelete.listingId)
    );

    // Update cart in localStorage and component state
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    setCartCount(updatedCart.length);

    // Trigger a custom event to notify other components (like UserDashboard) of the update
    window.dispatchEvent(new Event("cart-updated"));
  };

  return (
    <div className="cart-page p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart ({cartCount} items)</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cartItems.map((item, index) => {
          const listing = listingDetails[item.listingId];
          const member = memberDetails[item.memberId];

          return (
            <div key={index} className="border rounded-lg shadow-md p-4">
              {listing ? (
                <>
                  <h2 className="text-lg font-semibold">{listing.title}</h2>
                  <p className="text-gray-600">Category: {listing.category}</p>
                  <p className="text-gray-600">Price: {listing.price}</p>
                  <p className="text-gray-600">Location: {listing.location}</p>
                  <p className="text-gray-600">Class Size: {listing.classSize}</p>
                  <p className="text-gray-600">Days: {listing.days.join(", ")}</p>
                  <p className="text-gray-600">Gender: {listing.gender}</p>
                  <p className="text-gray-600">Description: {listing.description}</p>
                </>
              ) : (
                <p>Loading product details...</p>
              )}
              {member ? (
                <>
                  <p className="text-gray-600">For: {member.name}</p>
                  <p className="text-gray-600">Age: {member.age}</p>
                  <p className="text-gray-600">Relationship: {member.relationship}</p>
                  <p className="text-gray-600">Gender: {member.gender}</p>
                </>
              ) : (
                <p>Loading member details...</p>
              )}

              {/* Delete button */}
              <button
                onClick={() => handleDeleteItem(item)}
                className="mt-2 text-red-600 hover:text-red-800"
              >
                Delete Item
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CartPage;
