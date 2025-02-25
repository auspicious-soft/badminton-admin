"use client"
import { useState } from "react";
import ForgotPasswordImage from "@/assets/images/LoginImage.png";
import Logo from "@/assets/images/appLogo.png";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(" Email:", email);
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
              className="text-white text-base font-medium h-[50px] w-full bg-[#176dbf] rounded-[49px] hover:bg-blue-600 transition"
            >
              Log In
            </button>

            <div className="text-center mt-4">
              <span className="text-[#1b2229] text-base font-medium">Remember Password? </span>
              <a href="#" className="text-[#176dbf] text-base font-medium hover:underline">Login</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
