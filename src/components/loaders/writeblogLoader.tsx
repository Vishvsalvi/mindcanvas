import React from 'react'
import { Skeleton } from '../ui/skeleton'

export default function WriteblogLoader() {
  return (
    <div className="space-y-2 mt-24 grid grid-cols-1">
      <div className="lg:mx-[15.2rem] mt-10">

        <Skeleton className="h-4 w-[250px] m-5" />
        <Skeleton className="h-6 w-[300px] m-5" />
        <Skeleton className="h-4 w-[450px] m-5" />
        <Skeleton className="h-4 w-[250px] m-5" />

      </div>

    </div>
  )
}
