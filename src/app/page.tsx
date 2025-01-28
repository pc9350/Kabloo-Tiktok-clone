import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

const questions = [
  {
    id: 1,
    question: "What type of content do you enjoy most?",
    options: ["Comedy", "Education", "Lifestyle", "Gaming", "Music"]
  },
  {
    id: 2,
    question: "How much time do you typically spend watching short videos?",
    options: ["< 30 mins", "30-60 mins", "1-2 hours", "> 2 hours"]
  },
  {
    id: 3,
    question: "What's your primary purpose for using this app?",
    options: ["Entertainment", "Learning", "Creating Content", "Social Connection"]
  }
];

export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    redirect('/main/feed');
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-6xl font-bold">
              Welcome to <span className="text-blue-500">Kabloo</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Share your moments, connect with creators, and discover amazing content.
            </p>
          </div>

          {/* Auth Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <SignInButton mode="modal">
              <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-full font-semibold transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="px-8 py-3 bg-white hover:bg-gray-100 text-black rounded-full font-semibold transition-colors">
                Create Account
              </button>
            </SignUpButton>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6 rounded-lg bg-gray-900">
              <h3 className="text-xl font-semibold mb-4">Share Videos</h3>
              <p className="text-gray-400">Upload and share your favorite moments with the world</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-900">
              <h3 className="text-xl font-semibold mb-4">Connect</h3>
              <p className="text-gray-400">Follow creators and build your community</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-gray-900">
              <h3 className="text-xl font-semibold mb-4">Discover</h3>
              <p className="text-gray-400">Find trending videos and popular creators</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
