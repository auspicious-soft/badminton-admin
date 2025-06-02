"use client";
import ChangePasswordImage from "@/assets/images/LoginImage.png";
import Logo from "@/assets/images/appLogo.png";
import Image from "next/image";
import React, { Suspense, useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { loginAction } from "@/actions";
import InputField from "../components/InputField";
import LoginImage from "../components/LoginImage";
import { resetUserPassword } from "@/services/admin-services";
import {  Eye, EyeOff } from "@/utils/svgicons";

export default function ChangePasswordPage() {
 const [formData, setFormData] = useState({
  newPassword: "",
  confirmPassword: "",
 });

 const handleChange = (e) => {
  setFormData({ ...formData, [e.target.name]: e.target.value });
 };

 const router = useRouter();
 const searchParams = useSearchParams();
 const [isPending, startTransition] = useTransition();
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
 useEffect(() => {
  const otp = searchParams.get("otp");
  if (!otp) {
   router.push("/forgot-password");
   toast.error("Please complete the forgot password process first");
  }
 }, [router, searchParams]);

 const handleSubmit = async (event: React.FormEvent) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const newPassword = (form.elements.namedItem("newPassword") as HTMLInputElement).value;
  const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;
  const otp = searchParams.get("otp");

  // Password length validation
  if (newPassword.length < 6) {
   toast.error("Password must be at least 6 characters long");
   return;
  }

  if (newPassword === confirmPassword) {
   startTransition(async () => {
    try {
     const response = await resetUserPassword({ password: newPassword as string, otp: otp as string });
     if (response.status === 200) {
      toast.success("Password Updated successfully");
      router.push("/");
     } else {
      toast.error("Something went wrong");
     }
    } catch (error: any) {
     if (error.status === 404) {
      toast.error("Invalid OTP");
     } else {
      toast.error("new-password-otp-verified");
     }
    }
   });
  } else {
   toast.warning("Password must match");
  }
 };

 return (
  <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
   <div className="flex w-full h-full bg-white shadow-lg">
    {/* Left Side - Illustration */}
    <div className="m-[20px] hidden w-full rounded-[20px] md:flex md:w-[50%] bg-[#e9f5fe] items-center justify-center">
     <Image src={ChangePasswordImage} alt="Illustration" className="w-[80%]" />
    </div>

    {/* Right Side - Change Password Form */}
    <div className="w-full md:w-[60%] p-8 flex flex-col justify-center">
     <div className="text-center mb-6 space-y-[50px]">
      <Image src={Logo} alt="Play Adel Pickle" className="mx-auto w-24" />
      <h2 className="text-center text-[#10375c] text-3xl font-semibold">Change Password</h2>
     </div>

     <form className="w-full space-y-[20px] max-w-sm mx-auto" onSubmit={handleSubmit}>

<div className="space-y-[10px] relative">
  <label className="text-[#1b2229] text-base font-medium">New Password</label>
  <input 
    type={showNewPassword ? "text" : "password"} 
    name="newPassword" 
    value={formData.newPassword} 
    onChange={handleChange} 
    className="text-[#919191] text-base font-medium w-full h-[50px] px-5 py-4 pr-12 bg-[#f4f5f7] rounded-[49px] border focus:border-[#176dbf] focus:ring-blue-400" 
    placeholder="********" 
  />
  <button
    type="button"
    onClick={() => setShowNewPassword(!showNewPassword)}
    className="absolute top-[44px] right-4 text-[#176dbf] hover:text-[#104c8c]"
    tabIndex={-1}
  >
    {showNewPassword ? <EyeOff  /> : <Eye  />}
  </button>
</div>
<div className="space-y-[10px] relative">
  <label className="text-[#1b2229] text-base font-medium">Confirm Password</label>
  <input 
    type={showConfirmPassword ? "text" : "password"} 
    name="confirmPassword" 
    value={formData.confirmPassword} 
    onChange={handleChange} 
    className="text-[#919191] text-base font-medium w-full h-[50px] px-5 py-4 pr-12 bg-[#f4f5f7] rounded-[49px] border focus:border-[#176dbf] focus:ring-blue-400" 
    placeholder="********" 
  />
  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute top-[44px] right-4 text-[#176dbf] hover:text-[#104c8c]"
    tabIndex={-1}
  >
    {showConfirmPassword ? <EyeOff  /> : <Eye  />}
  </button>
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
        {isPending ? 'Changing Password...' : 'Change Password'}
      </button>
     </form>
    </div>
   </div>
  </div>
 );
}