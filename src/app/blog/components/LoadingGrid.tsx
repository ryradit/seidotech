import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function LoadingGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="h-48 bg-gray-200 animate-pulse" />
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
          </CardHeader>
          <CardContent>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-full mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
