"use client";
import React, { useState, useTransition } from "react";
import ForgotPasswordImage from "@/assets/images/LoginImage.png";
import Logo from "@/assets/images/appLogo.png";
import Image from "next/image";
import Link from "next/link";
import { forgotPasswordService } from "@/services/admin-services";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value); // ✅ Updating `email` instead of `username`
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        const response = await forgotPasswordService({ username: email });
        if (response?.status === 200) {
          toast.success("OTP sent successfully");
          router.push("/otp");
        } else {
          toast.error("Something went wrong");
        }
      } catch (err: any) {
        if (err.status == 404) toast.error("Username not found");
        else toast.error("Something went wrong");
      }
    });
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="flex w-full h-full bg-white shadow-lg">
        {/* Left Side - Illustration */}
        <div className="m-[20px] hidden w-full rounded-[20px] md:flex md:w-[50%] bg-[#e9f5fe] items-center justify-center">
          <Image src={ForgotPasswordImage} alt="Illustration" className="w-[80%]" />
        </div>

        {/* Right Side - Forgot Password Form */}
        <div className="w-full md:w-[60%] p-8 flex flex-col justify-center">
          <div className="text-center mb-6 space-y-[50px]">
            <Image src={Logo} alt="Play Adel Pickle" className="mx-auto w-24" />
            <h2 className="text-center text-[#10375c] text-3xl font-semibold">Forgot Password</h2>
          </div>

          <form className="w-full space-y-[20px] max-w-sm mx-auto" onSubmit={handleSubmit}>
            <div className="space-y-[10px]">
              <label className="text-[#1b2229] text-base font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={handleChange}
                className="text-[#919191] text-base font-medium w-full h-[50px] px-5 py-4 bg-[#f4f5f7] rounded-[49px] border focus:border-[#176dbf] focus:ring-blue-400"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              className="text-white text-base font-medium h-[50px] w-full bg-[#176dbf] rounded-[49px] hover:bg-blue-600 transition flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isPending}
            >
              {isPending ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isPending ? 'Submitting...' : 'Submit'}
            </button>

            <div className="text-center mt-4">
              <span className="text-[#1b2229] text-base font-medium">Remember Password? </span>
              <Link href="/" className="text-[#176dbf] text-base font-medium hover:underline">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

