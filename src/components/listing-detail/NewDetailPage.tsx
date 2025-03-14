import { useEffect, useState } from "react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import router from "next/router";
import { useRouter } from "next/navigation";
import Listing from "../show_all_listings/Listing";
import CustomCalendar from "./Calendar";
import Calendar from "./Calendar";
import {
  FaCalendarAlt,
  FaCalendarDay,
  FaChild,
  FaClock,
  FaDollarSign,
  FaGlobe,
  FaMapMarkerAlt,
  FaLayerGroup,
  FaListUl,
} from "react-icons/fa";
import { FaChildren, FaLocationPin } from "react-icons/fa6";
import { Spinner } from "../ui/spinner";
import { Button } from "../ui/button";

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
  preRequisites: string[];
  level: string;
  days: [string];
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
  instructorData: TrainerData;
}
interface TrainerData {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  experience: string;
  qualifications: string;
  avgRating: number;
  imageUrl: string;
}

interface InstructorsPageProps {
  trainer: TrainerData; // Expecting a trainer prop
}
const NewDetailPage: React.FC<ListingId> = ({
  listingId,
  listingData,
  instructorData,
}) => {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const form = useSelector((state: RootState) => state.form);
  const [isSelected, setIsSelected] = useState<boolean>(form.isFavorite);
  const [getTrainerImageUrl, setTrainerImageUrl] = useState<string | null>(
    null
  );
  const [getImageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // to check login
  useEffect(()=>  {
    const token = window.localStorage.getItem("token");
    if(token) {
      setIsLoggedIn(true);
    }
    else{
      setIsLoggedIn(false);
    }
  },[])

  useEffect(() => {
    const fetchFavorites = async () => {
      console.log("imageUrl", listingData.imageUrl);
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

    const fetchListingImage = async () => {
      try {
        const response2 = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/upload?imageUrl=${listingData.imageUrl}`
        );
        if (!response2.ok) throw new Error("Failed to fetch signed URL");

        const data = await response2.json();
        setImageUrl(data.signedUrl);
        console.log(getImageUrl);
      } catch (error) {}
    };

    const fetchTrainerImage = async () => {
      try {
        console.log(instructorData);
        const response2 = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/upload?imageUrl=${instructorData.imageUrl}`
        );
        if (!response2.ok) throw new Error("Failed to fetch signed URL");

        const data = await response2.json();
        setTrainerImageUrl(data.signedUrl);
      } catch (error) {}
    };

    console.log("Image url : ", getImageUrl);

    fetchFavorites();
    fetchListingImage();
    fetchTrainerImage();
  }, [listingData.listingId, listingData.imageUrl, instructorData.imageUrl]);

  useEffect(() => {
    console.log('preRequisites:', listingData.preRequisites);
    console.log('preRequisites type:', typeof listingData.preRequisites);
    console.log('is Array:', Array.isArray(listingData.preRequisites));
  }, [listingData.preRequisites]);

  function formatDays(days: string[]) {
    return days?.map((day) => day.replace(/([A-Z][a-z]+)/g, " $1")).join(", ");
  }

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

  const handleViewProfile = (id: string) => {
    router.push(`/dashboard/teacher/${id}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="">
        <div className="w-[800px] h-[400px] relative overflow-hidden rounded-lg">
          {getImageUrl ? (
            <Image
              src={getImageUrl}
              alt="img"
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Spinner size="lg" />
            </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-4">
          <h1 className="mt-10 text-3xl font-bold">{listingData.title}</h1>
          <div className="bg-white shadow-md rounded-lg p-4 w-full text-gray-700 font-medium">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center font-bold">
                <FaCalendarAlt className="mr-2" />
                <span>
                  {listingData.startDate} - {listingData.endDate}
                </span>
              </div>
              <div className="flex items-center font-bold">
                <FaClock className="mr-2" />
                <span>
                  {listingData.startTime} - {listingData.endTime}
                </span>
              </div>
              <div className="flex items-center font-bold">
                <FaCalendarDay className="mr-2" />
                <span>{formatDays(listingData.days)}</span>
              </div>
              <div className="flex items-center font-bold">
                <span>Class Type: {listingData.classSize}</span>
              </div>
              <div className="flex items-center font-bold">
                <FaChild className="mr-2" />
                <span>
                  Age: {listingData.minAge} - {listingData.maxAge}
                </span>
              </div>
              <div className="flex items-center font-bold">
                <FaChildren className="mr-2" />
                <span>{listingData.gender}</span>
              </div>
              <div className="flex items-center font-bold">
                <FaLocationPin className="mr-2" />
                <span>Mode: {listingData.mode}</span>
              </div>
              <div className="flex items-center font-bold">
                <FaLayerGroup className="mr-2" />
                <span>Level: {listingData.level}</span>
              </div>
              {listingData.mode.toLowerCase() === "offline" && (
                <div className="flex items-center font-bold">
                  <FaGlobe className="mr-2" />
                  <span>{listingData.location}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="text-xl my-5 flex items-center font-bold">
              About This Course
            </p>
            <p className="text-gray-700">{listingData.description}</p>
          </div>
        </div>
      </div>

      {/* Prerequisites Card */}
      <div className="border p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <FaListUl className="mr-2" />
          Pre-Requisites
        </h2>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(listingData.preRequisites) && listingData.preRequisites.length > 0 ? (
            listingData.preRequisites.map((preRequisite, index) => (
              <span
                key={index}
                className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium"
              >
                {preRequisite}
              </span>
            ))
          ) : (
            <span className="text-gray-500">No pre-requisites required</span>
          )}
        </div>
      </div>

      {/* Schedule */}

      {/* <div>
      <Calendar year={2025} startDate={listingData.startDate} endDate={listingData.endDate} days={listingData.days} />

      </div> */}

      {/* Instructor */}
      <div className="border p-4 rounded-lg shadow-md flex flex-col">
        <h2 className="mb-3 text-3xl font-bold">About Instructor</h2>
        <div className="p-4 rounded-lg flex items-center gap-10">
          <div className="">
            {getTrainerImageUrl ? (
              <Image
                src={getTrainerImageUrl}
                alt="Instructor"
                width={200}
                height={200}
                className="rounded-lg object-fill"
              />
            ) : (
              <div className="w-[200px] h-[200px] flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            )}
          </div>
          <div>
            {!isLoggedIn ? (
              <div>
                <h3>
                  {instructorData.fname} {instructorData.lname}
                </h3>
                <div>Rating: {instructorData.avgRating}⭐</div>
              </div>
            ) : (
              <div>
                <h3>
                  {instructorData.fname} {instructorData.lname}
                </h3>
                <div>Rating: {instructorData.avgRating}⭐</div>
                <div>Experience: {instructorData.experience}</div>
                <div>Qualifications: {instructorData.qualifications}</div>
                <div>Email: {instructorData.email}</div>
              </div>
            )}
          </div>
          <Button
            onClick={() => {
              if (!isLoggedIn) {
                router.push("/userflow/login"); // Navigate to the login page
              } else {
                handleViewProfile(instructorData._id);
              }
            }}
          >
            {!isLoggedIn ? "Login to view full profile" : "View Profile"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewDetailPage;
