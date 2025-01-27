'use client';

import { useState } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import { FaUser } from 'react-icons/fa';

export function ProfileMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex flex-col items-center text-gray-500"
        title="Profile"
        type='button'
      >
        <FaUser className="text-2xl" />
        <span className="text-xs mt-1">Profile</span>
      </button>

      {showMenu && (
        <div className="absolute bottom-full right-0 mb-2 w-48 bg-black border border-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2">
            <button
              onClick={() => {
                openUserProfile();
                setShowMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-800 rounded-md"
              type='button'
              title='Manage account'
            >
              Manage account
            </button>
            
            <button
              onClick={() => signOut()}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-800 rounded-md"
              type='button'
              title='Sign out'
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}