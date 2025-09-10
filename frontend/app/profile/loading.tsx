import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-10 w-1/4" />
        <Skeleton className="h-5 w-1/3" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information Card Skeleton */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Information Card Skeleton */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm lg:col-span-2">
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-10 w-full" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-24 w-full" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-24 w-full" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-16 w-full" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t">
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>

        {/* Account Settings Card Skeleton */}
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm lg:col-span-3">
          <div className="p-6 space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-8 w-1/4" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/5" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-10 w-40" />
            </div>
            
            <Skeleton className="h-1 w-full my-6" />
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-5 w-1/5" />
                <Skeleton className="h-4 w-1/3" />
              </div>
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}