"use client"
import { RootState } from "@/lib/store/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const LearnSection: React.FC = () => {
  const [showMore, setShowMore] = useState(false);
  const form = useSelector((state: RootState) => state.form);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Overview </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ul className="space-y-2">
          <li>✔️ Batch Size : {form.classSize} </li>
          <li>✔️ Start Date : {form.startDate} </li>
          <li>✔️ End Date : {form.endDate} </li>
          <li>✔️ Gender : {form.gender}</li>
        </ul>
        <ul className={`space-y-2 ${showMore ? "block" : "hidden md:block"}`}>
          <li>✔️ Start Time : {form.startTime}</li>
          <li>✔️ End Time : {form.endTime}</li>
          <li> Min Age : {form.minAge}</li>
          <li>✔️ Max Age : {form.maxAge}</li>
          <li>✔️ Course Duration : {form.days} Days</li>
        </ul>
      </div>
      {/* <button
        onClick={toggleShowMore}
        className="mt-4 text-purple-600 font-semibold focus:outline-none"
      >
        {showMore ? "Show less" : "Show more"} ⯆
      </button> */}
    </div>
  );
};

export default LearnSection;
