'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HiHome } from 'react-icons/hi';
import { BiUpload } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa';
import { ProfileMenu } from './ProfileMenu';

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full bg-black border-t border-gray-800 py-3">
      <div className="flex justify-around items-center">
        <Link href="/main/feed" 
          className={`flex flex-col items-center ${pathname === '/feed' ? 'text-white' : 'text-gray-500'}`}
        >
          <HiHome className="text-2xl" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        
        <Link href="/main/upload"
          className={`flex flex-col items-center ${pathname === '/upload' ? 'text-white' : 'text-gray-500'}`}
        >
          <BiUpload className="text-2xl" />
          <span className="text-xs mt-1">Upload</span>
        </Link>
        
        <ProfileMenu />
      </div>
    </nav>
  );
}