// export { auth as middleware } from "@/auth"


// middleware.ts (in project root, e.g., src/middleware.ts or just middleware.ts)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth"; // Your Auth.js auth function

// Define restricted routes for employees (customize this array)
const restrictedRoutesForEmployee = [
  "/authority/dashboard",
  "/authority/users",
  "/authority/venues",
  "/authority/pricing",
  "/authority/employees",
  "/authority/miscellaneous",
];

export async function middleware(request: NextRequest) {
  // Call the original auth() first for basic authentication
  const session = await auth();

  // If no session, auth() will handle redirect to sign-in (no further action needed)
  if (!session) {
    return NextResponse.next(); // Let auth() redirect
  }

  const userRole = (session as any)?.user?.role; // Adjust path if your session.user.role is nested differently
  const pathname = request.nextUrl.pathname;

  // Role-based restriction: Block employees from restricted routes
  if (userRole === "employee" && restrictedRoutesForEmployee.some((route) => pathname.startsWith(route))) {
    // Redirect to a safe employee page or access-denied route
    const redirectUrl = new URL("/authority/matches", request.url); // Or "/admin/access-denied"
    return NextResponse.redirect(redirectUrl);
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Matcher: Apply to all /admin routes (adjust as needed to avoid public paths)
export const config = {
  matcher: ["/authority/:path*"], // Protects /authority and subpaths; exclude static files if needed
};