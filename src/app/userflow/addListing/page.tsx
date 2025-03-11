import Navbar from "@/components/UserFlow/NavBar";
import { AddListing } from "@/components/UserFlow/AddListing";
import React from "react";
import { Suspense } from "react";

const listingPage = () => {
  return (
    <>
      <Navbar />
      <Suspense>
        <AddListing />
      </Suspense>
    </>
  );
};

export default listingPage;
