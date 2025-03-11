import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Listing {
  _id: string;
  category: string;
  subCategory: string[];
}

const Categories = () => {
  const [getCategories, setCategories] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BASE_URL}/admin/category`)
      .then((res) => {
        const categoriesData = Array.isArray(res.data) ? res.data : [];
        setCategories(categoriesData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setLoading(false);
      });
  }, []);

  return (
    <section className="bg-white/30 container mx-auto py-12">
      <h2 className="text-4xl font-bold text-center mb-5">
        Browse <span className="text-blue-600">Categories</span>
      </h2>

      {/* Smooth scrolling container */}
      <div className="overflow-hidden max-w-6xl mx-auto relative">
        <motion.div
          ref={containerRef}
          className="flex space-x-6"
          animate={{
            x: [0, -getCategories.length * 270, 0],
          }}
          transition={{
            ease: "linear",
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            width: `${getCategories.length * 270}px`,
          }}
          whileHover={{ animationPlayState: "paused" }}
        >
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg overflow-hidden shadow-md min-w-[250px] flex-shrink-0"
                  style={{ width: "250px" }}
                >
                  <Skeleton height={200} />
                  <div className="p-4">
                    <Skeleton width="80%" />
                    <Skeleton width="60%" />
                  </div>
                </div>
              ))
            : getCategories.map((category, i) => (
                <div
                  onClick={() => router.push(`/${category.category}`)}
                  key={i}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-transform duration-300 transform hover:scale-105 hover:-translate-y-2 min-w-[250px]"
                  style={{ flexShrink: 0, width: "250px" }}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={`/img/new/${category.category}.jpg`}
                      alt={category.category}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">
                      {category.category}
                    </h3>
                  </div>
                </div>
              ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Categories;
