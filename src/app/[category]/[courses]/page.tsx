'use client'
import ListingsPage from "@/components/listing/ListingsPage";
import { useParams } from "next/navigation";


export default function Home() {
  const { category, courses } = useParams<{category:string ,courses: string }>();
  
  return (
    <div>
     
      
       <ListingsPage categoryName = {category} subCategoryName={courses}/>
    
    </div>
  );
}