"use client"; // Ensures the component is client-side rendered

import Image from "next/image";
import Link from "next/link";
import React from "react";

interface TrainerData {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  experience: string;
  qualifications: string;
  avgRating: number;
}

interface InstructorsPageProps {
  trainer: TrainerData; // Expecting a trainer prop
}
// Dummy data for instructors
const instructors = [
  {
    id: 1,
    name: "Kirill Menko",
    title: "Java Developer",
    avgRating: 4.4,
    description: `
      As children, we absorb information and learn from experiences that mold us into who we are. Many individuals impact a child's life, but the most powerful and influential role lies in a devoted teacher; a teacher provides growth to students as a gardener would to a garden of flowers.

      Each child can bloom into a thriving flower so long as you water their garden with optimism, love, patience, and guidance. Throughout my educational experiences, I was lucky enough to have educators who poured their knowledge and optimism into me, and now I would like to reciprocate that back to students who are in the position I was once in.

      Balancing life and school is hard enough for a student, but a powerful and caring teacher can steer you in the right direction. In this autobiography, you will read about my educational background, experiences that influenced my decision to become a teacher, and what I believe the role of a teacher should be in a student's life.

      As a student, I went to multiple schools, I went to three different elementary schools, two middle schools, and two high schools in Brownsville, and through it all, I had great experiences.
    `,
    stats: {
      students: "2,345 Students",
      reviews: "2,345 Reviews",
      courses: "23 Courses",
      
    },
    imagePath: "/img/instructor.png", // Leave blank for now
  },
  //add more instructors
];

const InstructorCard: React.FC<{
  id: string;
  name: string;
  experience: string;
  description: string;
  email: string;
  avgRating: number
  stats: { students: string; reviews: string; courses: string;  };
  imagePath: string;
}> = ({ id, name, experience, email,avgRating, description, stats, imagePath }) => {
  console.log(id);
  return (
    <div className="flex flex-col md:flex-row bg-white shadow-md rounded-lg p-6 mb-6">
      {/* Profile Picture */}
      <div className="flex-shrink-0 md:w-1/4 flex justify-center md:justify-center mb-4 md:mb-0">
        <Image
          className="h-24 w-24 md:h-36 md:w-36 rounded-full object-cover"
          src={imagePath || "/path/to/default/image.jpg"} // Placeholder for now
          alt={name}
          width={50} height={50}
        />
      </div>

      {/* Instructor Details */}
      <div className="md:ml-6 md:w-3/4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <div className="mr-6">
            <i className="fas fa-user-graduate"></i> {stats.students}
          </div>
          <div className="mr-6">
            <i className="fas fa-comments"></i> {stats.reviews}
          </div>
          <div className="mr-6">
            <i className="fas fa-book"></i> {stats.courses}
          </div>
          <div>
          <i className="fas fa-book"></i> {avgRating}⭐  Rating
          </div>
        </div>
        <p className="text-sm font-semibold text-gray-600 m-2">
          Experience : {experience}
        </p>
        <p className="text-sm font-semibold text-gray-600 m-2">
          Email : {email}
        </p>
        <p className="text-sm font-semibold text-gray-600 m-2">
          Qualifications : {description}
        </p>
        <Link
          className="mt-4 text-blue-600 hover:text-blue-800 text-end w-full focus:outline-none font-medium"
          href={`/dashboard/teacher/${id}`}>
          Show Full Description
        </Link>
      </div>
    </div>
  );
};

const InstructorsPage: React.FC<InstructorsPageProps> = ({ trainer }) => {
  // console.log(trainer._id);
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Instructors</h1>
        {/* {instructors.map((instructor) => {}} */}
        {
          <InstructorCard
            key={trainer._id}
            id={trainer._id}
            name={trainer.fname + " " + trainer.lname}
            experience={trainer.experience}
            description={trainer.qualifications}
            email={trainer.email}
            avgRating={trainer.avgRating}
            stats={instructors[0].stats}
            imagePath={"/img/instructor.png"}
          />
        }
        {/* ))} */}
      </div>
    </div>
  );
};

export default InstructorsPage;
