'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing";
import { getVideoDuration } from "@/lib/video";

export default function UploadForm() {
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Video</h1>
      <div className="space-y-6 bg-white rounded-lg p-6 shadow-sm">
        <div>
          <label className="block mb-2 font-medium">Upload Video</label>
          <UploadDropzone
            endpoint="videoUploader"
            config={{ mode: "auto" }}
            content={{
              label: "Drop your video here or click to browse",
              allowedContent: "Videos up to 15 seconds, max 64MB",
            }}
            onBeforeUploadBegin={async (files) => {
              try {
                const duration = await getVideoDuration(files[0]);
                if (duration > 15) {
                  // setError("Video must be 15 seconds or less");
                  alert("Video duration too long, should be 15 seconds or less.")
                  throw new Error("Video too long");
                }
                setError(null);
                return files;
              } catch (error: unknown) {
                if (error instanceof Error && error.message !== "Video too long") {
                  setError("Error checking video duration");
                }
                throw error;
              }
            }}
            onClientUploadComplete={(res) => {
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
              setError(`Upload failed: ${error.message}`);
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