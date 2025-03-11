"use client";
import ListingDetail from "@/components/listing-detail/ListingDetail";
import { useParams } from "next/navigation";

export default function Home() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <ListingDetail id={id} />
    </div>
  );
}
