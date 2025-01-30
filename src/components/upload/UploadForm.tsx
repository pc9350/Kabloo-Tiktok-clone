"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/lib/uploadthing";
import { getVideoDuration, compressVideo } from "@/lib/video";

export default function UploadForm() {
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const router = useRouter();

  const handleUpload = async (res: any) => {
    if (!caption.trim()) {
      setError("Caption is required");
      return;
    }

    try {
      const response = await fetch("/api/videos/[videoId]", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: res[0].url,
          caption: caption.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to upload video");
      }

      router.push("/main/feed");
      router.refresh();
    } catch (error) {
      setError("Failed to upload video");
      console.error("Error:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <h1 className="text-2xl font-bold mb-6 text-center">Upload Video</h1>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {isCompressing && (
        <div className="mb-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 rounded">
          Compressing video... Please wait.
        </div>
      )}
      <div>
        <label className="block mb-2 font-medium">Caption</label>
        <input
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          placeholder="Write something about your video..."
          required
          minLength={1}
          maxLength={100}
        />
      </div>

      <div className="space-y-6 bg-white rounded-lg p-6 shadow-sm">
        <div>
          <label className="block mb-2 font-medium">Upload Video</label>
          <UploadDropzone
            endpoint="videoUploader"
            config={{ mode: "auto" }}
            content={{
              label: "Drop your video here or click to browse",
              allowedContent: "Videos up to 30 seconds, max 64MB",
            }}
            onBeforeUploadBegin={async (files) => {
              if (!caption.trim()) {
                setError("Please add a caption before uploading");
                throw new Error("Caption required");
              }
              try {
                const file = files[0];

                const duration = await getVideoDuration(files[0]);
                if (duration > 30) {
                  alert(
                    "Video duration too long, should be 30 seconds or less."
                  );
                  throw new Error("Video too long");
                }

                // Compress video if it's larger than 5MB
                if (file.size > 5 * 1024 * 1024) {
                  setIsCompressing(true);
                  setError(null);
                  const compressedFile = await compressVideo(file);
                  setIsCompressing(false);
                  return [compressedFile];
                }

                setError(null);
                return files;
              } catch (error: unknown) {
                if (
                  error instanceof Error &&
                  error.message !== "Video too long"
                ) {
                  setError("Error checking video duration");
                }
                throw error;
              }
            }}
            onClientUploadComplete={handleUpload}
            onUploadError={(error: Error) => {
              setError(`Upload failed: ${error.message}`);
            }}
          />
        </div>
      </div>
    </div>
  );
}
