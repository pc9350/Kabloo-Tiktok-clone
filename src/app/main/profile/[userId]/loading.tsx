export default function Loading() {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-8 mb-8">
            <div className="w-24 h-24 rounded-full bg-gray-700 animate-pulse" />
            <div className="flex-1">
              <div className="h-8 w-48 bg-gray-700 rounded animate-pulse mb-4" />
              <div className="flex gap-6 mb-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-6 w-24 bg-gray-700 rounded animate-pulse" />
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-[9/16] bg-gray-700 rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }