// import React from 'react';
// import Headers from './components/headers/headers';
// import { auth } from '@/auth';
// import { redirect } from "next/navigation";
// import Link from "next/link";


// export default async function AdminLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   const session = await auth(); 

//   if (!session) {
//     redirect("/");
//   }

//   const userRole = (session as any)?.user?.role;
//   const restrictedRoles = ['user']; 
  
//   //Check if user has restricted role
//   if (restrictedRoles.includes(userRole)) {
//       return (
//           <div>
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
//         <div className="flex flex-col items-center justify-center bg-gray-800/80 backdrop-blur-md rounded-xl shadow-2xl max-w-md w-full p-8 text-center text-white border border-gray-700">
//           <h1 className="text-3xl font-bold mb-4 text-red-400 animate-fade-in">
//             Access Denied
//           </h1>
//           <p className="text-lg mb-6 opacity-90">
//             You don&apos;t have permission to view this page.
//           </p>
//           <Link
//             href="/"
//             className="inline-block px-6 py-3 bg-gradient-to-r from-[#0000FF]	 to-[#0096FF] text-white font-semibold rounded-lg  transition-all duration-300 transform hover:scale-105"
//           >
//             Go to Login
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
//   }
//   return (
//     <div className="min-h-screen">
//       <Headers/>
//       <main className="mt-4 px-4 md:px-8 max-w-full">
//         {children}
//       </main>
//     </div>
//   );
// }



import React from 'react';
import Headers from './components/headers/headers';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

// import dynamic from 'next/dynamic';
// const EmployeeClientWrapper = dynamic(() => import('./components/EmployeeWrapper'), { ssr: false });
import EmployeeClientWrapper from './components/EmployeeWrapper';
export default async function AdminLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { searchParams?: { tab?: string } };
}>) {
  const session = await auth();

  if (!session) {
    redirect('/');
  }

  const userRole = (session as any)?.user?.role;
  const restrictedRoles = ['user'];
  const tabParam = params?.searchParams?.tab || null;

  // Check if user has restricted role
  if (restrictedRoles.includes(userRole)) {
    return (
      <div>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
          <div className="flex flex-col items-center justify-center bg-gray-800/80 backdrop-blur-md rounded-xl shadow-2xl max-w-md w-full p-8 text-center text-white border border-gray-700">
            <h1 className="text-3xl font-bold mb-4 text-red-400 animate-fade-in">
              Access Denied
            </h1>
            <p className="text-lg mb-6 opacity-90">
              You don&apos;t have permission to view this page.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-[#0000FF] to-[#0096FF] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render EmployeeClientWrapper for 'employee' role, otherwise render children directly
  return (
    <div className="min-h-screen">
      <Headers />
      <main className="mt-4 px-4 md:px-8 max-w-full">
        {/* {userRole === 'employee' ? ( */}
          {/* // <EmployeeClientWrapper tabParam={tabParam} session={session}> */}
            {/* // {children} */}
          {/* // </EmployeeClientWrapper> */}
        {/* // ) : (    */}
          {children}
        {/* // )} */}
      </main>
    </div>
  );
}