import React, { useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import SetAlertIcon from "/public/icons/bell1.png";
import DeleteAlertIcon from "/public/icons/bell2.png";
import Image from "next/image";
import axios from "axios";

interface FilterSidebarProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  onFilter:React.Dispatch<React.SetStateAction<string[]>>
  selectedCategory:string | null;
  setSelectedCategory:React.Dispatch<React.SetStateAction<string | null>>;
  selectedSubCategory:string | null;
  setSelectedSubCategory:React.Dispatch<React.SetStateAction<string | null>>;
  RateRange:number[];
  setRateRange:React.Dispatch<React.SetStateAction<[number, number]>>;
  ageLimit:number[];
  setAgeLimit:React.Dispatch<React.SetStateAction<[number, number]>>;
  selectedGender:string | null;
  setSelectedGender:React.Dispatch<React.SetStateAction<string | null>>;
  get:boolean;
  set:React.Dispatch<React.SetStateAction<boolean>>;
}
interface Category {
  _id: string;
  category: string;
  subCategory: string[];

}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  selectedCategories,
  setSelectedCategories,
  onFilter,
  // isFilterOpen,
  // setFilterOpen,
  selectedCategory,
  setSelectedCategory,
  selectedSubCategory,
  setSelectedSubCategory,
  RateRange,
  setRateRange,
  ageLimit,
  setAgeLimit,
  selectedGender,
  setSelectedGender,
  get,
  set
}) => {
  const [getCategories ,setCategories] = useState<Category[]>([]);
  const [getSubCategory, setSubCategory] = useState([]);
  useEffect(()=>{
    axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/category`).then((res)=>{
      setCategories( res.data);
    })
},[])
useEffect(() => {
  axios
    .get(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/category/${selectedCategory}`)
    .then((res) => {
      setSubCategory(res.data);

    });
}, [selectedCategory]);

  // const toggleFilter = () => setFilterOpen(!isFilterOpen);

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setRateRange([10,9980]);
    setAgeLimit([2,90]);
    setSelectedGender(null);
  };

  const [isAlertSet, setIsAlertSet] = useState<boolean>(false);
  useEffect(() => {
    
  }, []);

  const handleToggle = (): void => {
    console.log(!isAlertSet);
    
    if (!isAlertSet) {
      const fetchUserName = async () => {
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/search-alert`, {
        category: selectedCategory || "", 
        // subCategory: selectedSubCategory, 
        minPrice: RateRange[0].toString(), 
        maxPrice: RateRange[1].toString(),
        minAge: ageLimit[0].toString(),
        maxAge: ageLimit[1].toString(),
        gender: selectedGender || "", 
          },{
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
          });
          // setUserName(response.data.user);
        } catch (error) {
          console.log('Error fetching user name:', error);
        }
      };
  
      fetchUserName();
    }
    setIsAlertSet(!isAlertSet);
  };
  return (
    <div
      className={`bg-white shadow-lg transform  transition-transform duration-300`}
    >
      <div className="p-4 flex flex-col h-full">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>

        {/* Category Filter */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Category</h3>
          <div className="flex flex-col gap-2">
            {getCategories.map((Category) => (
              <label key={Category.category} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="Category"
                  value={Category.category}
                  checked={selectedCategory === Category.category}
                  onChange={() => setSelectedCategory(Category.category)}
                  className="accent-yellow-500"
                />
                {Category.category}
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="font-medium mb-2">Sub-Category</h3>
          <div className="flex flex-col gap-2 ">
            {getSubCategory.map((SubCategory) => (
              <label key={SubCategory} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="SubCategory"
                  value={SubCategory}
                  checked={selectedSubCategory === SubCategory}
                  onChange={() => setSelectedSubCategory(SubCategory)}
                  className="accent-yellow-500"
                />
                {SubCategory}
              </label>
            ))}
          </div>
        </div>

        {/* Rate Range Slider */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Rate</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">${RateRange[0]}</span>
            <Slider
              range
              min={10}
              max={10000}
              value={RateRange}
              onChange={(value) => setRateRange(value as [number, number])}
              className="w-full"
            />
            <span className="text-sm font-medium">${RateRange[1]}</span>
          </div>
        </div>

        {/* Age limit */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Age Limit</h3>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">{ageLimit[0]}Y</span>
            <Slider
              range
              min={2}
              max={90}
              value={ageLimit}
              onChange={(value) => setAgeLimit(value as [number, number])}
              className="w-full"
            />
            <span className="text-sm font-medium">{ageLimit[1]}Y</span>
          </div>
        </div>

        {/* Gender Filter */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Gender</h3>
          <div className="flex flex-col gap-2">
            {["Boys Only", "Boys & Girls"].map((gender) => (
              <label key={gender} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="warranty"
                  value={gender}
                  checked={selectedGender === gender}
                  onChange={() => setSelectedGender(gender)}
                  className="accent-yellow-500"
                />
                {gender}
              </label>
            ))}
          </div>
        </div>

        <div className=" flex mb-6 cursor-pointer" onClick={handleToggle}>
          <Image
            src={isAlertSet ? DeleteAlertIcon : SetAlertIcon}
            alt={isAlertSet ? "Delete Search Alert" : "Set Search Alert"}
            height={20}
            width={20}
          />
          <span className="px-4">
            {isAlertSet ? "Delete Search Alert" : "Set Search Alert"}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto">
          <button
            onClick={resetFilters}
            className="bg-gray-200 text-gray-800 w-full py-2 rounded-lg mb-2"
          >
            Reset Filters
          </button>
          <button
            onClick={() => set(!get)}
            className="bg-yellow-500 text-white w-full py-2 rounded-lg"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
