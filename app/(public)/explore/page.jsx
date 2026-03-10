"use client"
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

const explorePage = () => {
  const data = useQuery(api.events.getFeaturedEvents);
  
  console.log(data);

  if (data === undefined) {
    return <div className="text-white">Loading events...</div>;
  }
  return (
    <div className='text-white'>
      explorePage
    </div>
  )
}

export default explorePage
