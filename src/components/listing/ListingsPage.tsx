"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import axios from "axios"
import SearchSection from "../UserFlow/SearchSection"
import ListingCard from "./ListingCard"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { Card, CardContent } from "../ui/card"

interface Listing {
  _id: string
  category: string
  title: string
  imageUrl: string
  priceMode: string
  price: string
  mode: string
  location: string
  quantity: string
  classSize: string
  startDate: string
  endDate: string
  days: string
  gender: string
  startTime: string
  endTime: string
  minAge: string
  maxAge: string
  description: string
  trainerId: string
  listingId: string
  isFavorite: boolean
  avgRating: number
  isSponsored: boolean
  sponsoredAmount: number
  createdAt: string
}

// Skeleton card component to reuse
const ListingCardSkeleton = () => (
  <div className="flex flex-col items-center bg-background">
    <div className="w-full h-auto px-4 py-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
        <Card className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="relative">
            <div className="w-full h-[250px]">
              <Skeleton height={250} />
            </div>
          </div>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Skeleton width={100} />
                <Skeleton width={80} />
              </div>
              <Skeleton height={24} width="80%" />
              <Skeleton height={16} width="60%" />
              <div className="flex justify-between items-center">
                <Skeleton width={80} height={30} />
                <Skeleton width={100} height={40} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
)

const ListingsPage: React.FC<{
  categoryName: string
  subCategoryName: string
}> = ({ categoryName, subCategoryName }) => {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Get search term from URL params
  const initialKeywords = searchParams.get("keywords") || ""

  const [keywords, setKeywords] = useState<string>(initialKeywords)
  const [searchwords, setSearchwords] = useState<string>(initialKeywords)
  const [listings, setListings] = useState<Listing[]>([])
  const [filteredListings, setFilteredListings] = useState<Listing[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [RateRange, setRateRange] = useState<[number, number]>([10, 9980])
  const [ageLimit, setAgeLimit] = useState<[number, number]>([2, 90])
  const [selectedGender, setSelectedGender] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const handleSearch = useCallback(() => {
    const filtered = listings.filter(
      (listing) =>
        searchwords === "" ||
        listing.title.toLowerCase().includes(searchwords.toLowerCase())
    );
    setFilteredListings(filtered);
  }, [listings, searchwords]);

  const resetFilters = () => {
    setKeywords("")
    setSearchwords("")
    setSelectedCategory(null)
    setSelectedSubCategory(null)
    setRateRange([10, 9980])
    setAgeLimit([2, 90])
    setSelectedGender(null)

    router.replace("/all/courses")
    router.refresh() // Refresh data in Next.js (App Router)
  }

  useEffect(() => {
    setIsLoading(true);
    const fetchCourses = async () => {
      const query = new URLSearchParams({
        title: keywords || "",
        category: selectedCategory || "",
        selectedSubCategory: selectedSubCategory || "",
        minPrice: RateRange[0].toString(),
        maxPrice: RateRange[1].toString(),
        minAge: ageLimit[0].toString(),
        maxAge: ageLimit[1].toString(),
        gender: selectedGender || "",
      }).toString();

      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/listing/listing/?${query}`);

        // Sort listings before setting state
        const sortedListings = data.sort((a: Listing, b: Listing) => {
          if (b.isSponsored !== a.isSponsored) return b.isSponsored ? 1 : -1; // Sponsored first
          if (b.sponsoredAmount !== a.sponsoredAmount) return b.sponsoredAmount - a.sponsoredAmount; // Higher amount first
          if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating; // Higher rating first
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newer first
        });

        setListings(data);
        setFilteredListings(data); // Ensure data is initially set
        handleSearch(); // Apply search filter immediately after fetching data
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [keywords, selectedCategory, selectedSubCategory, RateRange, ageLimit, selectedGender, handleSearch]);

  // Ensure filtering also works on searchwords update
  useEffect(() => {
    handleSearch();
  }, [searchwords, listings, handleSearch]);

  // Generate skeleton cards array
  const skeletonCards = Array(8).fill(0).map((_, index) => (
    <ListingCardSkeleton key={`skeleton-${index}`} />
  ));

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white shadow">
          <div className="container mx-auto" onClick={resetFilters}>
            <SearchSection keywords={searchwords} setKeywords={setSearchwords} onSearch={handleSearch} />
          </div>
        </header>

        <div className="container mx-auto flex flex-1 px-4">
          <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {isLoading ? (
              // Show skeleton cards while loading
              skeletonCards
            ) : filteredListings.length > 0 ? (
              // Show actual listings when data is available
              filteredListings.map((listing, idx) => (
                <ListingCard
                  subCategoryName={subCategoryName}
                  categoryName={categoryName}
                  key={idx}
                  listingId={listing._id}
                  category={listing.category}
                  title={listing.title}
                  imageUrl={listing.imageUrl}
                  priceMode={listing.priceMode}
                  price={listing.price}
                  mode={listing.mode}
                  location={listing.location}
                  avgRating={listing.avgRating}
                  trainerId={listing.trainerId}
                  quantity={listing.quantity}
                  classSize={listing.classSize}
                  startDate={listing.startDate}
                  endDate={listing.endDate}
                  days={listing.days}
                  gender={listing.gender}
                  startTime={listing.startTime}
                  endTime={listing.endTime}
                  minAge={listing.minAge}
                  maxAge={listing.maxAge}
                  description={listing.description}
                  isFavorite={listing.isFavorite}
                  isSponsored={listing.isSponsored}
                  sponsoredAmount={listing.sponsoredAmount}
                />
              ))
            ) : (
              // Show skeleton cards when no data is available
              skeletonCards
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export default ListingsPage