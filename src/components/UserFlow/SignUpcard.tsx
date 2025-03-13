"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/Shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/Shared/ui/card";
import { Input } from "@/components/Shared/ui/input";
import { Label } from "@/components/Shared/ui/label";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { z } from "zod";
import GoogleAuth from "./GoogleAuth";
import Image from "next/image";

// Validation Schema
const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[\W_]/, "Must contain a special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords must match",
});

function SignUpCard() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Signup | Step 2: OTP Verification
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(true);
  const [countdown, setCountdown] = useState(30);

  // Start countdown when entering OTP page
  useEffect(() => {
    if (step === 2) {
      setCountdown(30);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResendOtp(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [step]);

  // Validate User Input
  const validateInputs = () => {
    try {
      signUpSchema.parse({ email, firstName, lastName, password, confirmPassword });
      setErrors({});
      return true;
    } catch (e) {
      if (e instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        e.errors.forEach((error) => {
          if (error.path[0]) {
            fieldErrors[error.path[0] as string] = error.message;
          }
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleSignup = useCallback(async () => {
    if (!validateInputs()) return;
    setIsLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/signup`, { email, firstName, lastName, password });
      setStep(2);
    } catch (error: any) {
      if (typeof error.response?.data?.message === "string" && error.response.data.message.includes("email already exists")) {
        setErrors((prevErrors) => ({ ...prevErrors, email: "Email already exists" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, submit: error.response?.data?.message || "Signup failed" }));
      }
    }
    setIsLoading(false);
  }, [email, firstName, lastName, password]);
  

  // Step 2: Verify OTP & Complete Registration
  const verifyOtp = async () => {
    if (!otp) {
      setErrors({ otp: "Please enter the OTP" });
      return;
    }
    if (otpAttempts >= 3) {
      setErrors({ otp: "Maximum OTP attempts reached. Please sign up again." });
      router.push("/");
      return;
    }
  
    setIsLoading(true);
    
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/verify-email`, { email, otp });
  
      // If OTP is correct, store token and redirect
      window.localStorage.setItem("token", res.data.token);
      router.push("/");
    } catch (error: any) {
      // If the backend deleted the user (e.g., due to max attempts), handle it
      if (error.response?.status === 410) {  // Assuming 410 Gone for deleted users
        setErrors({ otp: "Too many failed attempts. Please sign up again." });
        router.push("/userflow/signup");
      } else {
        setErrors({ otp: error.response?.data?.message || "Invalid OTP" });
        setOtpAttempts((prev)=> prev+1);
      }
    }
  
    setIsLoading(false);
  };

  const resendOtp = async () => {
    if (!canResendOtp) return;
    setCanResendOtp(false);
    setIsLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/resend-otp`, { email });
      setErrors({});
      setCountdown(30); // Reset countdown
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || "Failed to resend OTP" });
    }
    setIsLoading(false);
  };

  return (
    <main className="h-screen flex items-center justify-center p-4 md:p-10 w-full">
      <div className="flex w-full max-w-4xl">
        <div className="w-1/2 hidden mr-1 lg:block">
          <Image src="/bg/pic1.jpg" alt="Signup Image" width={600} height={600} className="w-full h-full object-cover shadow-2xl rounded-l-lg" />
        </div>

        <Card className="w-full lg:w-1/2 rounded-l-none max-w-[600px] h-auto p-6 shadow-2xl">
          <CardHeader>
            <h2 className="text-2xl font-bold text-gray-600 text-center">
              {step === 1 ? "Create your" : "Verify"} <span className="text-blue-600">{step === 1 ? "account" : "OTP"}</span>
            </h2>
          </CardHeader>

          <CardContent>
            {step === 1 ? (
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}

                <Label>First Name</Label>
                <Input type="text" placeholder="Enter first name" onChange={(e) => setFirstName(e.target.value)} />
                {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}

                <Label>Last Name</Label>
                <Input type="text" placeholder="Enter last name" onChange={(e) => setLastName(e.target.value)} />
                {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}

                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters long and contain:
                  <ul className="list-disc list-inside ml-1">
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                    <li>One special character</li>
                  </ul>
                </p>
                {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

                <Label>Confirm Password</Label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>
            ) : (
              <div className="space-y-2">
                <Label>OTP</Label>
                <Input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} />
                {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
                <Button
                  className="mt-2 w-full max-w-[500px] bg-gray-600 text-white hover:bg-gray-900"
                  onClick={resendOtp}
                  disabled={!canResendOtp || isLoading}
                >
                  {canResendOtp ? "Resend OTP" : `Wait ${countdown}s to Resend`}
                </Button>
              </div>
            )}
          </CardContent>

          <div className="flex justify-center">
            <Button
              className="mt-4 mx-8 w-full max-w-[400px] bg-blue-600 text-white hover:bg-blue-900"
              onClick={step === 1 ? handleSignup : verifyOtp}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : step === 1 ? "Get OTP" : "Verify OTP"}
            </Button>
          </div>

          <CardFooter className="text-center mt-4">
            <div className="text-sm">
              Already have an account?{" "}
              <Link href="/userflow/login">
                <span className="text-blue-600 cursor-pointer hover:underline">Login here!</span>
              </Link>
            </div>
          </CardFooter>
          <GoogleAuth />
        </Card>
      </div>
    </main>
  );
}

export default SignUpCard;

