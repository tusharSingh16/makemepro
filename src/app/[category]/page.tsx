"use client"

import SubCategory from "@/components/listing/SubCategory";
import { useParams } from "next/navigation";


export default function Home() {
  const { category } = useParams<{ category: string }>();
  return (
    <div>
     
      
       <SubCategory categoryName = {category} />
    
    </div>
  );
}