"use client";
import { useState } from "react";
import { usePathname } from 'next/navigation';
import logo from '@/assets/images/logo.png';
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { AuthorsIcon, BookEventsIcon, BookHubIcon, BookLifeIcon, CategoryIcon, CollectionIcon, DashboardIcon, DiscountIcon, NewBookIcon, NotificationsIcon, PromotionsIcon, PublishersIcon, SideBarIcon, StoriesIcon, SummaryIcon, UsersIcon } from "@/utils/svgicons";
import Image from "next/image";
// import { signOut } from "next-auth/react";

const SideNav = () => {
  // const router = useRouter();

  // const handleLogout = () => {
  //   localStorage.removeItem('authToken');
  //   router.push('https://blacktherapy.vercel.app/');
  // };

  const [isCollapsed, setIsCollapsed] = useState(false);


  const pathname = usePathname();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const isActive = (path: string) => pathname === path ? 'active' : '';
  // const handleLogout = async () => {
  //    await signOut({ redirect: false })
  //   router.push('/login');
  // }
  return (
    <div className="relative h-full">
      <button onClick={toggleSidebar} className="hide-content absolute top-[30px] -right-2.5 z-10 ">
        <SideBarIcon/>
      </button>
    <div className={`sideNav ${isCollapsed ? 'collapsed' : ''} h-[100%] overflo-custom relative`}>
      <div className="">
          {!isCollapsed && (
        <div className="mb-[71px] ">
              <Link href="/authority/dashboard">
                <Image src={logo} alt="logo" width={185} height={35} className="mx-auto" />
              </Link>
            </div> 
          )}
           {!isCollapsed && (
          <div className="mb-[60px] ">
           <Link href="/authority/add-new" className="flex gap-2.5 p-[7px] items-center bg-white text-darkBlack w-full rounded-[24px] text-sm ">
            <NewBookIcon/>Add a new book </Link> 
          </div>
           )}
        <ul className="navList">
          <li className={isActive('/authority/dashboard')}>
            <Link href="/authority/dashboard">
              <DashboardIcon />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>
          <li className={`${isActive('/authority/book-hub')} ${pathname.startsWith('/authority/book-hub') ? 'active' : ''}`}>
            <Link href="/authority/book-hub">
              <BookHubIcon />
              {!isCollapsed && <span>Book Hub</span>}
            </Link>
          </li>
          <li className={`${isActive('/authority/categories')} ${pathname.startsWith('/authority/categories') ? 'active' : ''}`}>
            <Link href="/authority/categories">
              <CategoryIcon />
               {!isCollapsed && <span>Categories</span>}               
            </Link>
          </li>
          <li className={`${isActive('/authority/collection')} ${pathname.startsWith('/authority/collection') ? 'active' : ''}`}>
            <Link href="/authority/collection">
              <CollectionIcon />
              {!isCollapsed &&  <span>Collection</span>}
            </Link>
          </li>
          <li className={`${isActive('/authority/summary')} ${pathname.startsWith('/authority/summary') ? 'active' : ''}`}>
            <Link href="/authority/summary">
              <SummaryIcon />
              {!isCollapsed &&  <span>Summary</span>}
            </Link>
          </li>
          <li className={isActive('/authority/discounts')}>
            <Link href="/authority/discounts">
              <DiscountIcon />
              {!isCollapsed &&  <span>Discounts</span>}
            </Link>
          </li>
          <li className={`${isActive('/authority/book-life')} ${pathname.startsWith('/authority/book-life') ? 'active' : ''}`}>
            <Link href="/authority/book-life">
              <BookLifeIcon />
              {!isCollapsed &&  <span>Book Life</span>}
            </Link>
          </li>
          <li className={`${isActive('/authority/book-events')} ${pathname.startsWith('/authority/book-events') ? 'active' : ''}`}>
            <Link href="/authority/book-events">
              <BookEventsIcon />
              {!isCollapsed &&  <span>Book Events</span>}
            </Link>
          </li>
          <li className={`${isActive('/authority/authors')} ${pathname.startsWith('/authority/authors') ? 'active' : ''}`}>
            <Link href="/authority/authors">
              <AuthorsIcon />
              {!isCollapsed &&  <span>Authors</span>}
            </Link>
          </li>
          <li className={`${isActive('/authority/publishers')} ${pathname.startsWith('/authority/publishers') ? 'active' : ''}`}>
            <Link href="/authority/publishers">
              <PublishersIcon />
              {!isCollapsed &&  <span>Publishers</span>}
            </Link>
          </li>
          <li className={isActive('/authority/stories')}>
            <Link href="/authority/stories">
              <StoriesIcon />
              {!isCollapsed &&  <span>Stories</span>}
            </Link>
          </li>
          <li className={isActive('/authority/promotions')}>
            <Link href="/authority/promotions">
              <PromotionsIcon />
              {!isCollapsed &&  <span>Promotions</span>}
            </Link>
          </li>
          <li className={`${isActive('/authority/users')} ${pathname.startsWith('/authority/users') ? 'active' : ''}`}>
            <Link href="/authority/users">
              <UsersIcon />
              {!isCollapsed &&  <span>Users</span>}
            </Link>
          </li>
          <li className={isActive('/authority/notifications')}>
            <Link href="/authority/notifications">
              <NotificationsIcon />
              {!isCollapsed &&  <span>Notifications</span>}
            </Link>
          </li>
        </ul>
      </div>
    </div>
    </div>
  );
};

export default SideNav;
