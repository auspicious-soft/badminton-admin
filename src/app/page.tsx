"use client"
import Login from "@/assets/images/LoginImage.png"
import Logo from "@/assets/images/appLogo.png"
import Image from "next/image";
export default function LoginPage() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="flex w-full h-full bg-white shadow-lg">
        {/* Left Side - Illustration */}
        <div className="m-[20px] hidden w-full rounded-[20px] md:flex md:w-[50%] bg-[#e9f5fe] items-center justify-center">
          <Image src={Login} alt="Illustration" className=" w-[80%]" />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-[60%] p-8 flex flex-col justify-center">
          <div className="text-center mb-6 space-y-[50px]">
            <Image src={Logo} alt="Play Adel Pickle" className="mx-auto w-24" />
            <h2 className="text-center text-[#1b2229] text-3xl font-semibold ">Welcome Back</h2>
          </div>

          <form className="w-full space-y-[20px] max-w-sm mx-auto">
            <div className="space-y-[10px]">
              <label className="text-[#1b2229] text-base font-medium">Email Address</label>
              <input
                type="email"
                className="text-[#919191] text-base font-medium w-full h-[50px] px-5 py-4 bg-[#f4f5f7] rounded-[49px] border  focus:border-[#176dbf] focus:ring-blue-400"
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-[10px]">
              <label className="text-[#1b2229] text-base font-medium">Your Password</label>
              <input
                type="password"
                className="text-[#919191] text-base font-medium w-full h-[50px] px-5 py-4 bg-[#f4f5f7] rounded-[49px] border  focus:border-[#176dbf] focus:ring-blue-400"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex justify-between items-center mb-4 ">
              <label className="flex items-center text-[#1b2229] text-base font-medium">
                <input type="checkbox" className="w-[15px] h-[15px] bg-[#f4f5f7] rounded shadow-[inset_0px_4px_4px_0px_rgba(0,0,0,0.10)] text-[#1b2229] text-base font-medium " />
                 <span className="ml-[10px] text-[#1b2229] text-base font-medium">Keep me logged in</span>
              </label>
              <a href="#" className="text-right text-[#176dbf] text-base font-medium  hover:underline">Forgot Password?</a>
            </div>

            <button
              type="submit"
              className="text-white text-base font-medium h-[50px] w-full bg-[#176dbf] rounded-[49px]  hover:bg-blue-600 transition"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}