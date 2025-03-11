"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const [loggedIn, setLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if token exists in localStorage (or sessionStorage)
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, []);

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="relative flex flex-col items-center justify-evenly mx-auto w-full">
        <div className="bg-white/0 backdrop-blur-sm p-8 rounded-lg relative max-w-3xl w-full">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Get your skills <br />
            upgraded with us
          </h1>
          <p className="hidden md:block text-gray-600 mb-6">
            Transform your productivity and deliver high-quality <br />
            solutions customers want, and respond to <br />
            threats and opportunities.
          </p>
          {!loggedIn && (
            <Button
              className="bg-blue-500 rounded-full py-6 hover:bg-blue-600"
              onClick={() => {
                router.push("/userflow/signup");
              }}
            >
              Register now
            </Button>
          )}
          <div className="flex items-center gap-2 mt-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white bg-yellow-200"
                />
              ))}
            </div>
            <span className="font-semibold">47k+</span>
          </div>
        </div>
        <Image
          src="/img/new/div.svg"
          alt="Decorative elements"
          width={400}
          height={300}
          className="hidden lg:block absolute top-0 right-56 -z-2"
        />
      </div>
    </section>
  );
}
