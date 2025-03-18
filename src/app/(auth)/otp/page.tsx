"use client";
import React, { useState, useRef, useTransition } from "react";
import OtpImage from "@/assets/images/LoginImage.png";
import Logo from "@/assets/images/appLogo.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { sendOtpService } from "@/services/admin-services";

export default function OtpPage() {
 const [otp, setOtp] = useState(["", "", "", "", "", ""]);
 const inputRefs = useRef<HTMLInputElement[]>([]);
 const router = useRouter();
 const [isPending, startTransition] = useTransition();

 // Handle OTP input change
 const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  if (!/^[0-9]?$/.test(value)) return;

  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  if (value && index < 5) {
   inputRefs.current[index + 1]?.focus();
  }
 };

 // Handle backspace navigation
 const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Backspace" && !otp[index] && index > 0) {
   inputRefs.current[index - 1]?.focus();
  }
 };

 // Handle form submission
 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const completeOtp = otp.join("");

  console.log("OTP entered by user:", completeOtp); // Log OTP only on Login button click

  startTransition(async () => {
   try {
    const response = await sendOtpService({ otp: completeOtp });
    if (response.status === 200) {
     toast.success("OTP verified successfully");
     router.push(`/change-password?otp=${completeOtp}`);
    } else {
     toast.error("Something went wrong");
    }
   } catch (err: any) {
    if (err.status === 404 || err.status === 400) {
     alert("Invalid OTP");
    } else {
     toast.error("Something went wrong");
    }
   }
  });
 };

 return (
  <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
   <div className="flex w-full h-full bg-white shadow-lg">
    <div className="m-[20px] hidden w-full rounded-[20px] md:flex md:w-[50%] bg-[#e9f5fe] items-center justify-center">
     <Image src={OtpImage} alt="Illustration" className="w-[80%]" />
    </div>

    <div className="w-full md:w-[60%] p-8 flex flex-col justify-center">
     <div className="text-center mb-6 space-y-[50px]">
      <Image src={Logo} alt="Play Adel Pickle" className="mx-auto w-24" />
      <h2 className="text-center text-[#10375c] text-3xl font-semibold">Enter OTP</h2>
     </div>

     <form className="w-full space-y-[20px] max-w-sm mx-auto" onSubmit={handleSubmit}>
      <div className="flex justify-center space-x-[10px]">
       {otp.map((digit, index) => (
        <input
         key={index}
         type="text"
         maxLength={1}
         value={digit}
         onChange={(e) => handleChange(index, e)}
         onKeyDown={(e) => handleKeyDown(index, e)}
         ref={(el) => {
          if (el) {
           inputRefs.current[index] = el;
          }
         }}
         className="w-[51px] h-[50px] bg-[#f4f5f7] rounded-[49px] border text-center text-[#5e5e5e] text-xl font-bold focus:border-[#176dbf] focus:ring-blue-400"
        />
       ))}
      </div>

      <button type="submit" className="text-white text-base font-medium h-[50px] w-full bg-[#176dbf] rounded-[49px] hover:bg-blue-600 transition">
       Log In
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
