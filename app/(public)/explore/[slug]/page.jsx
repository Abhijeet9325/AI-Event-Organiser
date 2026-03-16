"use client"
import { api } from '@/convex/_generated/api';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { CATEGORIES } from '@/lib/data';
import { parseLocationSlug } from '@/lib/location-utils';
import { Loader2 } from 'lucide-react';
import { notFound, useParams, useRouter } from 'next/navigation';
import React from 'react'
import EventCard from '@/components/ui/event-card';

const dynamicExplorePage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug

  // check if its valid category
  const categoryInfo = CATEGORIES.find((cat) => cat.id === slug);
  const isCategory = !!categoryInfo;

  // if not a category , validate locations
  const { city, state, isValid } = !isCategory
    ? parseLocationSlug(slug) : { city: null, state: null, isValid: false }

  // if it's not a valid category and not valid location, show 404
  if (!isCategory && !isValid) {
    notFound();
  }

  const { data: events, isLoading } = useConvexQuery(
    isCategory ?
      api.explore.getEventsByCategory
      : api.explore.getEventByLocation,
    isCategory ?
      { category: slug, limit: 50 } :
      city && state
        ? { city, state, limit: 50 }
        : "skip"
  );

  const handleEventClick = (eventSlug) => {
    router.push(`/events/${eventSlug}`)
  }

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='animate-spin w-8 h-8 text-purple-800' />
      </div>
    )
  }

  if (isCategory) {
    return (
      <div className='min-h-screen'>
        <div className='pb-12'>
          <div className='flex items-center gap-6 mb-6'>
            <div className='text-7xl'>{categoryInfo.icon}</div>
            <div>
              <h1 className='text-5xl font-bold text-white'>{categoryInfo.label}</h1>
              <p className='text-xl mt-2 text-muted-foreground'>{categoryInfo.description}</p>
            </div>
          </div>
          
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12'>
            {events && events.length > 0 ? (
              events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  variant="grid"
                  onClick={() => handleEventClick(event.slug)}
                />
              ))
            ) : (
              <div className='col-span-full py-20 text-center'>
                <div className='text-6xl mb-4'>📅</div>
                <h3 className='text-2xl font-bold text-white'>No events found</h3>
                <p className='text-gray-400 mt-2'>Be the first to create an event in this category!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen'>
      <div className='pb-12'>
        <div className='mb-8'>
          <h1 className='text-5xl font-bold text-white capitalize'>Events in {city}</h1>
          <p className='text-xl mt-2 text-muted-foreground'>{state}India</p>
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
          {events && events.length > 0 ? (
            events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                variant="grid"
                onClick={() => handleEventClick(event.slug)}
              />
            ))
          ) : (
            <div className='col-span-full py-20 text-center'>
              <div className='text-6xl mb-4'>📍</div>
              <h3 className='text-2xl font-bold text-white'>No events found in {city}</h3>
              <p className='text-gray-400 mt-2'>Be the first to create an event in this location!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default dynamicExplorePage;
