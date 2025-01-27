'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
import { UploadDropzone } from "@/lib/uploadthing";

export default function UploadForm() {
  const [caption, setCaption] = useState("");
  const router = useRouter();
  // const { user } = useUser();

  // if (!user) return null;

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Video</h1>
      <div className="space-y-6 bg-white rounded-lg p-6 shadow-sm">
        <div>
          <label className="block mb-2 font-medium">Upload Video</label>
          <UploadDropzone
            endpoint="videoUploader"
            onClientUploadComplete={(res: any) => {
              if (res && res[0]) {
                fetch('/api/videos', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    url: res[0].url,
                    caption,
                  }),
                }).then((response) => {
                  if (response.ok) {
                    router.push('/main/feed');
                    router.refresh();
                  }
                });
              }
            }}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>

        <div>
          <label className="block mb-2 font-medium">Caption</label>
          <input 
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Write something about your video..."
          />
        </div>
      </div>
    </div>
  );
}