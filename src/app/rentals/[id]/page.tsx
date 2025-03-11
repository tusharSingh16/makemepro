"use client";

import NewRentalDetailPage from "@/components/rental/NewRentalDetailPage";
import RentalDetailPage from "@/components/rental/RentalDetailPage";
import { useParams } from "next/navigation";

export default function Home() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <RentalDetailPage rentalId={id} />
    </div>
  );
}
