"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/Shared/ui/button";
import { Input } from "@/components/Shared/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/UserFlow/NavBar";
import Footer from "@/components/UserFlow/Footer";

interface OtpVerificationProps {
  email: string;
}

function VerifyOtpOnLogin({ email }: OtpVerificationProps) {
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
    <div className="flex flex-col">
      <Navbar />
      <main className="flex flex-col items-center justify-center bg-gray-100 h-[calc(100vh-18rem)]">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Verify Your Email</h2>
          <p className="text-gray-600 text-center mb-6">Enter the OTP sent to <span className="font-medium">{email}</span></p>
          <div className="flex flex-col items-center gap-4">
            <Input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center text-lg tracking-widest w-full"
              autoFocus
            />
            {errors.otp && <p className="text-red-500 text-sm">{errors.otp}</p>}
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={verifyOtp}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
            <div className="flex flex-col items-center gap-2">
              <label className="text-gray-600 text-sm">Didn't receive the OTP?</label>
              <Button
                className={`w-full ${canResendOtp ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gray-400'} text-white`}
                onClick={resendOtp}
                disabled={!canResendOtp || isLoading}
              >
                {canResendOtp ? "Resend" : `Wait ${countdown}s to Resend`}
              </Button>
            </div>
          </div>
          {errors.submit && <p className="text-red-500 text-sm text-center mt-4">{errors.submit}</p>}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default VerifyOtpOnLogin;