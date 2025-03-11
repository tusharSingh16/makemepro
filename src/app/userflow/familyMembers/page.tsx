"use client"

import Navbar from "@/components/UserFlow/NavBar";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";

export interface familyMember {
  _id: string;
  name: string;
  age: number;
  dob: Date;
  relationship: 'brother' | 'child' | 'father' | 'mother';
  gender: 'male' | 'female' | 'other';
  address: string;
  city: string;
  postalCode: string;
  agreeToTerms: boolean;
  doctorName: string;
  doctorNumber: string;
}
export interface currentmember {
  _id: string;
  name: string;
  age: number;
  dob: Date;
  relationship: 'brother' | 'child' | 'father' | 'mother';
  gender: 'male' | 'female' | 'other';
  address: string;
  city: string;
  postalCode: string;
  agreeToTerms: boolean;
  doctorName: string;
  doctorNumber: string;
}

export default function FamilyMembers() {
  const [familyMembers, setFamilyMembers] = useState<familyMember[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState<familyMember | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [updatedInfo, setUpdatedInfo] = useState({
    name: "",
    age: "",
    dob: "",
    relationship: "",
    gender: "",
    address: "",
    city: "",
    postalCode: "",
    doctorName: "",
    doctorNumber: "",
    bloodGroup: "",
    agreeToTerms: false,
  });

  useEffect(() => {
    const fetchFamilyMembers = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve,1200)); // to test loader 
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/allmembers`,
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
          }
        );
        setFamilyMembers(res.data.familyMembers);
      } catch (error) {
        console.error("Error fetching family members:", error);
      } finally {
        setIsLoading(false); // Stop loading once data is fetched
      }
    };
    fetchFamilyMembers();
  }, []);

  const handleEditMember = (member: any) => {
    setCurrentMember(member);
    setUpdatedInfo({
      name: member.name,
      age: member.age,
      dob: member.dob,
      relationship: member.relationship,
      gender: member.gender,
      address: member.address,
      city: member.city,
      postalCode: member.postalCode,
      doctorName: member.doctorName,
      doctorNumber: member.doctorNumber,
      bloodGroup: member.bloodGroup,
      agreeToTerms: member.agreeToTerms,
    });
    setIsEditing(true);
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if(age <= 0){
      return 0;
    }
    return age;
  };

  const handleSaveChanges = async () => {
    if (!currentMember) {
      console.error("Current member is not selected");
      return;
    }
  
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/user/members/${currentMember._id}`,
        updatedInfo,
        {
          headers: {
            Authorization: `Bearer ${window.localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        // Update the local state to reflect changes
        setFamilyMembers((prevMembers: any) =>
          prevMembers.map((member: any) =>
            member._id === currentMember._id
              ? response.data.updatedMember
              : member
          )
        );
        setIsEditing(false);
        setCurrentMember(null);
      }
    } catch (error) {
      console.error("Error updating member:", error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-wrap space-y-2 justify-center">
        {isLoading ? ( // Display loading icon while data is being fetched
          <div className="flex items-center justify-center h-screen">
            <div className="loader"></div> {/* Add your spinner here */}
          </div>
        ) : familyMembers.length === 0 ? (
          <div className="bg-white p-6 mx-6 my-6 flex flex-col justify-center items-center gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                No members available!{" "}
              </h2>
            </div>
            <div>
              <Link
                href="/userflow/registerMember"
                className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium border border-gray-200 bg-blue-300"
              >
                Register New Member
              </Link>
            </div>
          </div>
        ) : (
          familyMembers.map((member: any, index: any) => (
            <div
              key={member._id}
              className="bg-white shadow-lg rounded-lg p-6 w-1/4 mx-6 my-6 border border-gray-200"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {index + 1}. {member.name}
              </h2>
              <p className="text-gray-700">
                <strong>Age:</strong> {member.age}
              </p>
              <p className="text-gray-700">
                <strong>Date of Birth:</strong> {member.dob.split("T")[0]}
              </p>
              <p className="text-gray-700">
                <strong>Relationship:</strong> {member.relationship}
              </p>
              <p className="text-gray-700">
                <strong>Gender:</strong> {member.gender}
              </p>
              <p className="text-gray-700">
                <strong>Address:</strong> {member.address}
              </p>
              <p className="text-gray-700">
                <strong>City:</strong> {member.city}
              </p>
              <p className="text-gray-700">
                <strong>Postal Code:</strong> {member.postalCode}
              </p>
              {member.doctorName && (
                <p className="text-gray-700">
                  <strong>Doctor's Name:</strong> {member.doctorName}
                </p>
              )}
              {member.doctorNumber && (
                <p className="text-gray-700">
                  <strong>Doctor's Number:</strong> {member.doctorNumber}
                </p>
              )}
              {member.bloodGroup && (
                <p className="text-gray-700">
                  <strong>Blood Group:</strong> {member.bloodGroup}
                </p>
              )}
              <p className="text-gray-700">
                <strong>Agreed to Terms:</strong>{" "}
                {member.agreeToTerms ? "Yes" : "No"}
              </p>

              {/* Buttons */}
              <div className="flex justify-end mt-4">
                <button
                  className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 transition"
                  onClick={() => handleEditMember(member)}
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

{/* Edit Member Modal */}
{isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-1/3">
            <h2 className="text-xl font-semibold mb-4">Edit Family Member</h2>
            <input
              type="text"
              placeholder="Name"
              value={updatedInfo.name}
              onChange={(e) =>
                setUpdatedInfo({ ...updatedInfo, name: e.target.value })
              }
              className="border border-gray-300 rounded p-2 mb-2 w-full"
            />
            <input
              type="date"
              placeholder="Date of Birth"
              value={updatedInfo.dob.split("T")[0]}
              onChange={(e) => {
                const dob = e.target.value;
                setUpdatedInfo({
                  ...updatedInfo,
                  dob,
                  age: calculateAge(dob).toString(), // Auto-calculate age
                });
              }}
              className="border border-gray-300 rounded p-2 mb-2 w-full"
            />
              <input
              type="number"
              placeholder="Age"
              value={updatedInfo.age}
              onChange={(e) =>
                setUpdatedInfo({ ...updatedInfo, age: e.target.value })
              }
              className="border border-gray-300 rounded p-2 mb-2 w-full"
              disabled
            />
            
            <input
              type="text"
              placeholder="Relationship"
              value={updatedInfo.relationship}
              onChange={(e) =>
                setUpdatedInfo({ ...updatedInfo, relationship: e.target.value })
              }
              className="border border-gray-300 rounded p-2 mb-2 w-full"
            />
            <select
              value={updatedInfo.gender}
              onChange={(e) =>
                setUpdatedInfo({ ...updatedInfo, gender: e.target.value })
              }
              className="border border-gray-300 rounded p-2 mb-2 w-full"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              placeholder="Address"
              value={updatedInfo.address}
              onChange={(e) =>
                setUpdatedInfo({ ...updatedInfo, address: e.target.value })
              }
              className="border border-gray-300 rounded p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="City"
              value={updatedInfo.city}
              onChange={(e) =>
                setUpdatedInfo({ ...updatedInfo, city: e.target.value })
              }
              className="border border-gray-300 rounded p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Postal Code"
              value={updatedInfo.postalCode}
              onChange={(e) =>
                setUpdatedInfo({ ...updatedInfo, postalCode: e.target.value })
              }
              className="border border-gray-300 rounded p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Doctor's Name"
              value={updatedInfo.doctorName}
              onChange={(e) =>
                setUpdatedInfo({ ...updatedInfo, doctorName: e.target.value })
              }
              className="border border-gray-300 rounded p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Doctor's Number"
              value={updatedInfo.doctorNumber}
              onChange={(e) =>
                setUpdatedInfo({ ...updatedInfo, doctorNumber: e.target.value })
              }
              className="border border-gray-300 rounded p-2 mb-2 w-full"
            />
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                checked={updatedInfo.agreeToTerms}
                onChange={(e) =>
                  setUpdatedInfo({
                    ...updatedInfo,
                    agreeToTerms: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <label>Agree to Terms and Conditions</label>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition ml-2"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

       <style jsx>{`
              .loader {
        position: relative;
        width: 100px;
        height: 100px;
      }

      .loader:before , .loader:after{
        content: '';
        border-radius: 50%;
        position: absolute;
        inset: 0;
        box-shadow: 0 0 10px 2px rgba(0, 0, 0, 0.3) inset;
      }
      .loader:after {
        box-shadow: 0 2px 0 #FF3D00 inset;
        animation: rotate 2s linear infinite;
      }

      @keyframes rotate {
        0% {  transform: rotate(0)}
        100% { transform: rotate(360deg)}
      }
      `}</style>

    </>
  );
}
