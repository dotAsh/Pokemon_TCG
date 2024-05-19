import { useContext } from 'react';
import useCounter from '@/hooks/react-query-hooks';
import Image from 'next/image';
import Link from "next/link";

const Header = () => {
  console.log("header component");
  
  const count = useCounter((state) => state.count);
  const user = useCounter((state) => state.user);
  const logout = useCounter((state) => state.logout);

  return (
    <header className="w-full mt-5 text-gray-500 dark:text-gray-400 bg-white border-t border-gray-100 shadow-sm body-font dark:bg-gray-900">
      <div className="container flex flex-col items-start justify-between p-6 mx-auto md:flex-row">
        <Link className="flex items-center mb-4 font-medium text-gray-900 title-font md:mb-0" href="/">
          <Image src="/pokemon.svg" width={50} height={17.25} alt="Pokemon Logo" />
        </Link>
        <nav className="flex flex-wrap items-center justify-center pl-6 ml-6 text-base border-l border-gray-200 md:mr-auto">
          <Link className="mr-5 font-medium hover:text-gray-500" href="/">Home</Link>
          <a href="#_" className="mr-5 font-medium hover:text-gray-500">About</a>
          <a href="#_" className="font-medium hover:text-gray-500">Contact</a>
        </nav>
        <div className="items-center h-full flex">
          <Link className="mr-5 font-medium hover:text-gray-500" href="/cart">
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
            </svg>
            <p>Cart ({count})</p>
          </Link>
          {user?.isLoggedIn ? (
            <>
              <span className="mr-5 font-medium text-gray-800 dark:text-white">{user.username}</span>
              <button
                className="mr-5 font-medium text-gray-800 dark:text-white"
                onClick={logout}
              >
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
              </svg>
              </button>
            </>
          ) : (
            <Link className="mr-5 font-medium hover:text-gray-500" href="/login">
              <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
