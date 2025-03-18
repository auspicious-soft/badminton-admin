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
      <div className="space-y-[10px]">
       <label className="text-[#1b2229] text-base font-medium">New Password</label>
       <input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} className="text-[#919191] text-base font-medium w-full h-[50px] px-5 py-4 bg-[#f4f5f7] rounded-[49px] border focus:border-[#176dbf] focus:ring-blue-400" placeholder="********" />
      </div>

      <div className="space-y-[10px]">
       <label className="text-[#1b2229] text-base font-medium">Confirm Password</label>
       <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="text-[#919191] text-base font-medium w-full h-[50px] px-5 py-4 bg-[#f4f5f7] rounded-[49px] border focus:border-[#176dbf] focus:ring-blue-400" placeholder="********" />
      </div>

      <button type="submit" className="text-white text-base font-medium h-[50px] w-full bg-[#176dbf] rounded-[49px] hover:bg-blue-600 transition">
       Change Password
      </button>
     </form>
    </div>
   </div>
  </div>
 );
}

// "use client";

// import React, { Suspense, useEffect, useState, useTransition } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useSession } from "next-auth/react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { toast } from "sonner";
// import { loginAction } from "@/actions";
// import Logo from "@/assets/images/logo.png";
// import InputField from "../components/InputField";
// import LoginImage from "../components/LoginImage";
// import { resetUserPassword } from "@/services/admin-services";

// export default function Page() {
//     const router = useRouter();
//     const searchParams = useSearchParams();
//     const [isPending, startTransition] = useTransition();

//     useEffect(() => {
//       const otp = searchParams.get('otp');
//       if (!otp) {
//         router.push('/forgot-password');
//         toast.error('Please complete the forgot password process first');
//       }
//     }, [router, searchParams]);

//     const handleSubmit = async (event: React.FormEvent) => {
//       event.preventDefault();
//       const form = event.target as HTMLFormElement;
//       const newPassword = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
//       const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement).value;
//       const otp = searchParams.get('otp');

//       if (newPassword === confirmPassword) {
//         startTransition(async () => {
//           try {
//             const response = await resetUserPassword({ password: newPassword as string, otp: otp as string });
//             if (response.status === 200) {
//               toast.success("Password Updated successfully");
//               router.push('/');
//             } else {
//               toast.error("Something went wrong");
//             }
//           } catch (error: any) {
//             if (error.status === 404) {
//               toast.error("Invalid OTP");
//             } else {
//               toast.error("new-password-otp-verified");
//             }
//           }
//         });
//       } else {
//         toast.warning("Password must match");
//       }
//     };

//   return (
//      <Suspense fallback={<div>Loading...</div>}>
//     <div className="bg-[#ebdfd7] rounded-[30px]  pt-5 md:pt-0">
//       <div className="grid md:grid-cols-2 gap-8 md:gap-3 lg:gap-0 items-center md:min-h-screen ">
//         <div className="bg-white h-full rounded-[15px] md:rounded-[30px] m-5 md:m-0  ">
//           <div className="flex flex-col justify-center h-full max-w-[465px] p-5 mx-auto ">
//             <div className="mb-5 md:mb-10 text-center">
//               <Image
//                 src={Logo}
//                 alt="animate"
//                 className="mx-auto max-w-[184px]"
//               />
//             </div>
//             <h2 className="text-orange text-center font-aeonikBold text-2xl md:text-[30px] mb-5 md:mb-9 ">
//             Change Password
//             </h2>
//             <div className="login rounded-[20px] bg-white">
//               <div className="">
//                 <form onSubmit={handleSubmit}>
//                   <InputField
//                     type="password"
//                     label="Enter New Password"
//                     name="newPassword"
//                     id="newPassword"
//                     placeholder="******"
//                   />
//                   <InputField
//                     type="password"
//                     label="Confirm Password"
//                     name="confirmPassword"
//                     id="confirmPassword"
//                     placeholder="Your Password"
//                   />
//                    {/* <button type="submit" className="login-button  w-full">
//                    Change Password
//                   </button> */}
//                   <button type="submit" disabled={isPending} className="login-button  w-full">
//                   {!isPending ? "Change Password" : "Changing"}
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//         <LoginImage />
//       </div>
//     </div>
//     </Suspense>
//   );
// };
