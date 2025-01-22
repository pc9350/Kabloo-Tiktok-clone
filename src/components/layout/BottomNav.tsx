'use client';

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-black border-t border-gray-800">
      <div className="flex justify-around items-center h-full">
        <button className="text-white">Home</button>
        <button className="text-white">Search</button>
        <button className="text-white p-3 rounded-full bg-primary">+</button>
        <button className="text-white">Inbox</button>
        <button className="text-white">Profile</button>
      </div>
    </nav>
  );
}