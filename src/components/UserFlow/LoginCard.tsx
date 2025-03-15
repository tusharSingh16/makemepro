"use client";
import { useState } from "react";
import { Button } from "@/components/Shared/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/Shared/ui/card";
import { Input } from "@/components/Shared/ui/input";
import { Label } from "@/components/Shared/ui/label";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import GoogleAuth from "./GoogleAuth";
import Popup from "../trainer-dashboard/PopUp";
import Image from "next/image";
import { Spinner } from "../ui/spinner";
import OtpVerification from "./OtpVerification";

function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [needVerification, setNeedVerification] = useState(false);
  const router = useRouter();

  const fetchUserRole = async (userID: any) => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/user/getUserById/${userID}`
    );
    localStorage.setItem("role", response.data.user.role);
  };

  async function submitForm(endpoint: any) {
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${endpoint}`,
        {
          email,
          password,
        }
      );

      fetchUserRole(res.data._id);
      window.localStorage.setItem("userId", res.data._id);
      window.localStorage.setItem("token", res.data.token);
      window.localStorage.setItem("role", res.data.role);
      router.push("/");
    } catch (err: any) {
      setIsLoading(false);
      if (
        (err.response && err.response.status === 401)
        
      ) {
        setIsPopUpOpen(true);
        setPopupMessage("Invalid Credentials");
      }
      else if(err.response.status === 400){
        // setIsPopUpOpen(true);
        setNeedVerification(true);
        setPopupMessage("Please verify your email first");
      }
      else {
        setPopupMessage("Something went wrong!!");
      }
    }
  }

  return (
    <main className="h-screen flex items-center justify-center p-5 sm:p-10 w-full overflow-hidden">
      <div className="flex w-full gap-1 max-w-4xl">
        {/* Image Section */}
        <div className="w-1/3 hidden lg:block">
          <Image
            src="/bg/pic4.jpg"
            alt="Login Image"
            width={600}
            height={600}
            className="w-full h-full rounded-l-lg shadow-2xl object-cover "
          />
          {/* Welcome Back */}
        </div>

        {/* Form Section */}
        <div>
        
  {needVerification ? (
    <OtpVerification email={email}/>
  ) : (
    <Card className="w-full rounded-l-none sm:w-[480px] h-[600px] mx-auto pt-10 shadow-2xl">
      <CardHeader className="text-center">
        <h2 className="text-2xl text-gray-600 font-bold">Login</h2>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-lg">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-lg">
              Password
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              > 
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </CardContent>

      <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-3">
        <Button
          className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-800"
          onClick={() => submitForm("/user/signin")}
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <Spinner className="mr-2" />
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </Button>

        <Button
          className="w-full sm:w-auto bg-blue-600 text-white hover:bg-blue-800"
          onClick={() => submitForm("/organizations/login")}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login as Organization"}
        </Button>
      </div>

      <CardFooter className="text-center mt-4">
        <div className="flex flex-col justify-center w-full sm:w-[350px] mx-auto">
          <div className="text-sm">
            Don't have an account?{" "}
            <Link href="/userflow/signup">
              <span className="text-blue-600 cursor-pointer hover:underline">
                Sign up!
              </span>
            </Link>
          </div>
        </div>
        <div className="text-sm mt-2 sm:mt-0">
          <Link href="/login">
            <span className="text-blue-600 cursor-pointer hover:underline">
              Forgot Password?
            </span>
          </Link>
        </div>
      </CardFooter>

      <div className="flex justify-center">
        <GoogleAuth />
      </div>
    </Card>
  )}
</div>

      </div>
    </main>
  );
}

export default LoginCard;
