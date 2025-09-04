"use client";
import Login from "@/assets/images/LoginImage.png";
import Logo from "@/assets/images/appLogo.svg";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { loginAction } from "@/actions";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {  Eye, EyeOff } from "@/utils/svgicons";

export default function LoginPage() {
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [isPending, startTransition] = React.useTransition();
 const router = useRouter();
 const { data: session } = useSession();
const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (session) {
      if ((session as any)?.user?.role === "employee") {

        router.push("/authority/matches");
      } else {
           router.push("/authority/dashboard");
      }
              // router.push("/authority/dashboard");

    }
  }, [session, router]);
 const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
  event.preventDefault();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  if (!emailRegex.test(email) && !phoneRegex.test(email)) {
   toast.error("Please enter a valid email or phone number.");
   return;
  }

  if (!password) {
   toast.error("Password is required.");
   return;
  }

  startTransition(async () => {
    try {
      const response = await loginAction({ email, password });
  
      if (response?.success) {
        toast.success("Logged in successfully");
          if (response?.data?.user?.role === "employee") {
          router.push("/authority/matches");
          setTimeout(function() {
    window.location.reload();
}, 500);
        } 
        else {
          window.location.href = "/authority/dashboard";
          
        }
      }
      else if (response?.message === "Invalid password") {
        toast.error(response?.message)
      }
      else {
        console.error("Login failed: ", response);
        toast.error("An error occurred during login.");
      }
    } 
    catch (error) {
      console.error("Login action error:", error);
      toast.error("Something went wrong! Please try again.");
    }
  });
 };

 return (
  <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
   <div className="flex w-full h-full bg-white shadow-lg">
    <div className="m-[20px] hidden w-full rounded-[20px] md:flex md:w-[50%] bg-[#e9f5fe] items-center justify-center">
     <Image src={Login} alt="Illustration" className=" w-[80%]" />
    </div>
    <div className="w-full md:w-[60%] p-8 flex flex-col justify-center">
     <div className="text-center mb-6 space-y-[20px]">
      <Image src={Logo} alt="Play Adel Pickle" className="mx-auto " />
      <h2 className="text-center text-[#1b2229] text-3xl font-semibold">Welcome Back</h2>
     </div>
     <form onSubmit={handleSubmit} className="w-full space-y-[20px] max-w-sm mx-auto">
      <div className="space-y-[10px]">
       <label className="text-[#1b2229] text-base font-medium">Email Address</label>
       <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className="text-[#919191] text-base font-medium w-full h-[50px] px-5 py-4 bg-[#f4f5f7] rounded-[49px] border focus:border-[#176dbf] focus:ring-blue-400" 
        placeholder="Enter your email" 
       />
      </div>
      {/* <div className="space-y-[10px]">
       <label className="text-[#1b2229] text-base font-medium">Your Password</label>
       <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="text-[#919191] text-base font-medium w-full h-[50px] px-5 py-4 bg-[#f4f5f7] rounded-[49px] border focus:border-[#176dbf] focus:ring-blue-400" 
        placeholder="Enter your password" 
       />
      </div> */}
      <div className="space-y-[10px] relative">
  <label className="text-[#1b2229] text-base font-medium">Your Password</label>
  <input 
    type={showPassword ? "text" : "password"}
    value={password}
    onChange={(e) => setPassword(e.target.value)} 
    className="text-[#919191] text-base font-medium w-full h-[50px] px-5 py-4 bg-[#f4f5f7] rounded-[49px] border focus:border-[#176dbf] focus:ring-blue-400 pr-12"
    placeholder="Enter your password" 
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute top-[44px] right-4 text-[#176dbf] hover:text-[#104c8c]"
    tabIndex={-1}
  >
                {showPassword ? <EyeOff /> : <Eye />}
  </button>
</div>
      <div className="flex justify-end items-right mb-4">
       <Link href="/forgot-password" className="items-right text-right text-[#176dbf] text-base font-medium hover:underline">
        Forgot Password?
       </Link>
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
        {isPending ? 'Logging in...' : 'Log In'}
      </button>
     </form>
    </div>
   </div>
  </div>
 );
}