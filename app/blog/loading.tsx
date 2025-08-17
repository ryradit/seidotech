export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden shadow">
            <div className="h-48 bg-gray-200 animate-pulse" />
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
