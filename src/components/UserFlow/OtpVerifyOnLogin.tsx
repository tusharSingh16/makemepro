"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/Shared/ui/button";
import { Input } from "@/components/Shared/ui/input";
import { Label } from "@/components/Shared/ui/label";
import axios from "axios";
import { useRouter } from "next/navigation";

interface OtpVerificationProps {
  email: string;
}

function OtpVerifyOnLogin({ email }: OtpVerificationProps) {
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const router = useRouter();

  useEffect(() => {
    setCanResendOtp(false);
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
  }, [countdown]);

  const verifyOtp = async () => {
    if (!otp) {
      setErrors({ otp: "Please enter the OTP" });
      return;
    }
    if (otpAttempts >= 3) {
      setErrors({ otp: "Maximum OTP attempts reached. Please sign up again." });
      router.push("/userflow/signup");
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/user/verify-email`, { email, otp });
      window.localStorage.setItem("token", res.data.token);
      router.push("/");
    } catch (error: any) {
      if (error.response?.status === 410) {
        setErrors({ otp: "Too many failed attempts. Please sign up again." });
        router.push("/userflow/signup");
      } else {
        setErrors({ otp: error.response?.data?.message || "Invalid OTP" });
        setOtpAttempts((prev) => prev + 1);
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
      setCountdown(30);
      setOtpAttempts(0);
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || "Failed to resend OTP" });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-center">Verify Your Email</h2>
      <p className="text-gray-600 text-sm text-center">Enter the OTP sent to {email}</p>

      <div className="space-y-2">
        <Label htmlFor="otp">OTP</Label>
        <Input
          id="otp"
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="text-center text-lg tracking-widest"
          autoFocus
        />
        {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
      </div>

      <Button
        className="w-full bg-blue-600 text-white hover:bg-blue-900"
        onClick={verifyOtp}
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>

      <Button
        className="w-full bg-gray-600 text-white hover:bg-gray-900"
        onClick={resendOtp}
        disabled={!canResendOtp || isLoading}
      >
        {canResendOtp ? "Resend OTP" : `Wait ${countdown}s to Resend`}
      </Button>
      {errors.submit && <p className="text-red-500 text-sm text-center">{errors.submit}</p>}
    </div>
  );
}

export default OtpVerifyOnLogin;