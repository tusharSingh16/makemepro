
'use client'

import ListingCard from "@/components/listing/ListingCard";
import RentalPage from "@/components/rental/RentalPage";
import { useParams } from "next/navigation";


export default function Home() {
  const { category, courses } = useParams<{category:string ,courses: string }>();
  
  return (
    <div>
       <RentalPage categoryName = {category} subCategoryName={courses}/>
    </div>
  );
}

