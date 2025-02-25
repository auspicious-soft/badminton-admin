"use client"
import { useState, useRef } from "react";
import OtpImage from "@/assets/images/LoginImage.png";
import Logo from "@/assets/images/appLogo.png";
import Image from "next/image";

export default function OtpPage() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (index, e) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Entered OTP:", otp.join(""));
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="flex w-full h-full bg-white shadow-lg">
        {/* Left Side - Illustration */}
        <div className="m-[20px] hidden w-full rounded-[20px] md:flex md:w-[50%] bg-[#e9f5fe] items-center justify-center">
          <Image src={OtpImage} alt="Illustration" className="w-[80%]" />
        </div>

        {/* Right Side - OTP Form */}
        <div className="w-full md:w-[60%] p-8 flex flex-col justify-center">
          <div className="text-center mb-6 space-y-[50px]">
            <Image src={Logo} alt="Play Adel Pickle" className="mx-auto w-24" />
            <h2 className="text-center text-[#10375c] text-3xl font-semibold">Enter OTP</h2>
          </div>

          <form className="w-full space-y-[20px] max-w-[26rem] mx-auto" onSubmit={handleSubmit}>
            <div className="flex justify-center space-x-[22px]">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  // ref={(el) => (inputRefs.current[index] = el)}
                  ref={(el) => {
                    if (el) {
                      inputRefs.current[index] = el;
                    }
                  }}
                  className="w-[51px] h-[50px] bg-[#f4f5f7] rounded-[49px] border text-center text-[#5e5e5e] text-xl font-bold font-['SF Pro Display'] focus:border-[#176dbf] focus:ring-blue-400"
                />
              ))}
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