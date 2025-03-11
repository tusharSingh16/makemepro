"use client";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import Overview from "@/components/listing-detail/Overview";
import { useEffect } from "react";
import { useState } from "react";
import { FormProvider } from "react-hook-form";
import { Interface } from "readline";
import router from "next/router";
import Image from "next/image";
interface Listing {
  category: string;
  title: string;
  priceMode: string;
  price: string;
  mode: string;
  imageUrl: string;
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
  trainerId: string;
  listingId: string;
  isFavorite: boolean;
}
interface ListingId {
  listingData: Listing;
  listingId: string;
}
const MainDetailPage: React.FC<ListingId> = ({ listingId, listingData }) => {
  const tabs = ["Overview", "Instructors", "Curriculum", "Reviews", "FAQs"];
  const form = useSelector((state: RootState) => state.form);
  const [isSelected, setIsSelected] = useState<boolean>(form.isFavorite);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      console.log("imageUrl", listingData.imageUrl)
      const userId = window.localStorage.getItem("userId");
      if (!userId) {
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/favorites/${userId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            },
          }
        );

        if (response.ok) {
          const { favorites } = await response.json();
          setFavorites(favorites);
          setIsSelected(favorites.includes(listingData.listingId)); // Check if this listing is a favorite
        } else {
          console.error("Error fetching user favorites");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [listingData.listingId]);

  // Handle favorite button click
  const handleOnClick = async (event: React.MouseEvent<HTMLImageElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const newIsSelected = !isSelected;
    setIsSelected(newIsSelected);

    const userId = window.localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to use this feature");
      router.push("/userflow/login");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/favorites`,
        {
          method: newIsSelected ? "POST" : "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ userId, listingId }),
        }
      );

      if (response.ok) {
        if (newIsSelected) {
          setFavorites((prevFavorites) => [
            ...prevFavorites,
            listingData.listingId,
          ]);
          console.log("Favorite added successfully");
        } else {
          setFavorites((prevFavorites) =>
            prevFavorites.filter((id) => id !== listingData.listingId)
          );
          console.log("Favorite removed successfully");
        }
      } else {
        const errorData = await response.json();
        console.error(
          newIsSelected ? "Error adding favorite:" : "Error removing favorite:",
          errorData.message
        );
        setIsSelected(!newIsSelected); // Revert state if API call fails
      }
    } catch (error) {
      console.error("Error processing favorite:", error);
      setIsSelected(!newIsSelected); // Revert state if API call fails
    }
  };

  return (
    <>
      <div>
        <div className="flex">
          {/* Left Section: Image or Icon */}
          <div className="bg-white rounded-md p-4 mb-4">
            <div className="relative h-64 w-full">
              <Image
                className="h-[20rem] w-[55rem]"
                src="/img/math.svg"
                height={150}
                width={150}
                alt="Calculator and Tools"
              />
            </div>
          </div>

          {/* Middle Section: Course Info */}
          <div className="flex-grow">
            <span className="bg-[#17A8FC] text-white p-1.5 rounded-3xl">
              {listingData.category}
            </span>
            <h2 className="text-2xl font-bold mt-2">{listingData.title}</h2>
            {/* <p className="text-gray-600 mt-2">{listingData.description}</p> */}
            {/* <p className="text-gray-600 mt-2 block sm:hidden">
              {listingData.description.split(" ").slice(0, 20).join(" ")}...
            </p> */}
            <p className="text-gray-600 mt-2 hidden sm:block">
              {listingData.description}
            </p>
            <div className="mt-4 flex space-x-6 text-sm text-gray-600">
              <span>50+ People Enrolled</span>
              <span>5 Projects</span>
              <span>37+ Reviews</span>
            </div>
            <div className="my-8 inline-flex w-full sm:w-auto">
              <button className="bg-[#17A8FC] text-white py-3 px-8 rounded mb-8 hover:bg-[#1782fc] shadow-xl ">
                Learn {listingData.category}
              </button>
              <div className=" mt-3 m-3">
                <Image
                  src={`${
                    isSelected ? `/icons/filled_fav.png` : `/icons/fav.png`
                  }`}
                  width={25}
                  height={25}
                  alt="fav"
                  className="cursor-pointer"
                  onClick={handleOnClick}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default MainDetailPage;
