import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState("humanshi@auspicioussoft.com");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isPending, startTransition] = React.useTransition();
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!password) {
      toast.error("Password is required.");
      return;
    }

    try {
      startTransition(async () => {
        // Implement your login logic here
        toast.success("Logged in successfully");
      });
    } catch (error) {
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <div className="w-1/2 p-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-8">
          {/* <div className="text-blue-600 font-bold text-3xl mb-4">
            <svg width="150" height="50" viewBox="0 0 150 50" className="mb-4">
              <text x="0" y="35" fill="#0066FF" fontSize="24" fontWeight="bold">PLAY DEL</text>
              <text x="100" y="35" fill="#0066FF" fontSize="24" fontWeight="bold">PICKLE</text>
            </svg>
          </div> */}
          <h2 className="text-[#FF5722] text-2xl font-semibold">Welcome Back</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FE] border-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email Address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#F8F9FE] border-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Password"
            />
          </div>
          <div className="flex items-center justify-end">
            {/* <div className="flex items-center">
              <input
                type="checkbox"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded border-gray-300"
              />
              <label className="ml-2 text-sm text-gray-600">Keep me logged in</label>
            </div> */}
            <a href="/forgot-password" className="text-blue-600 text-sm hover:text-blue-800">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-[#FF5722] text-white py-3 px-4 rounded-xl hover:bg-[#FF5722]/90 focus:outline-none focus:ring-2 focus:ring-[#FF5722] focus:ring-offset-2 transition-colors"
            disabled={isPending}
          >
            {isPending ? "Logging In..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;


