"use client"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { api } from '@/convex/_generated/api'
import { useConvexQuery } from '@/hooks/use-convex-query'
import Autoplay from 'embla-carousel-autoplay'
import { useRouter } from 'next/navigation'
import React, { useRef } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ArrowRight, Calendar, Loader2, MapPin, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { createLocationSlug } from '@/lib/location-utils'
import EventCard from '@/components/ui/event-card'
import { CATEGORIES } from '@/lib/data'
import { Card, CardContent } from '@/components/ui/card'



const explorePage = () => {
  // fetch current user for location
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const router = useRouter();

  const { data: featuredEvents, isLoading: loadingFeatured } = useConvexQuery(api.explore.getFeaturedEvents, { limit: 3 });

  const { data: localEvents, isLoading: loadingLocal } = useConvexQuery(api.explore.getEventByLocation, {
    city: currentUser?.location?.city || "Pune",
    state: currentUser?.location?.state || "Maharashtra",
    limit: 4,
  });

  const { data: popularEvents, isLoading: loadingPopular } = useConvexQuery(
    api.explore.getPopularEvents, {
    limit: 4
  }
  );

  const { data: categoryCounts } = useConvexQuery(api.explore.getCategoryCounts);

  const categoryWithCounts = CATEGORIES.map((cat) => {
    return {
      ...cat,
      count: categoryCounts?.[cat.id] || 0,
    };
  })
  const plugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  const handleEventClick = (slug) => {
    router.push(`/events/${slug}`);
  };
  const handleCategoryClick = (categoryId) => {
    router.push(`/events/${categoryId}`);
  };

  const handleViewLocalEvents = () => {
    const city = currentUser?.location?.city || "Pune";
    const state = currentUser?.location?.state || "Maharashtra";

    router.push(`/explore/location/${city.toLowerCase()}-${state.toLowerCase()}`);
    const slug = createLocationSlug(city, state);
  }
  // Loading state
  const isLoading = loadingFeatured || loadingLocal || loadingPopular;

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <Loader2 className='animate-spin w-8 h-8 text-purple-800' />
      </div>
    )
  }

  return (
    <div className='bg-gray-950 min-h-screen'>
      <div className='text-white text-center mb-12'>
        <h1 className='text-5xl mb-4 font-bold mx-auto'>Discover Events</h1>
        <p className='text-lg text-gray-400 text-muted-foreground max-w-3xl mx-auto'>
          Explore featured events, find what&apos;s happening locally, or browse events across India
        </p>
      </div>

      {/* featured carousel */}
      {featuredEvents && featuredEvents.length > 0 && (
        <div className='mb-16 relative group'>
          <Carousel
            className="w-full max-w-5xl mx-auto px-4 md:px-0"
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {featuredEvents.map((event) => (
                <CarouselItem key={event._id} className="basis-full">
                  <div
                    className='relative h-[350px] md:h-[400px] rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500'
                    onClick={() => handleEventClick(event.slug)}
                  >
                    {event.coverImage ? (
                      <Image
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        className="object-cover"
                        priority
                      />
                    ) : (
                      <div className='absolute inset-0' style={{ backgroundColor: event.themeColor }} />
                    )}
                    {/* Subtle Overlay */}
                    <div className='absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300'></div>

                    {/* Content Overlay */}
                    <div className='absolute inset-0 flex flex-col justify-end p-6 md:p-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent'>
                      <div className='max-w-4xl'>
                        <Badge className='bg-black/60 backdrop-blur-md px-3 py-1 mb-4 rounded-md text-[10px] uppercase tracking-wider font-semibold text-white border border-white/10'>
                          {event.city}, {event.state || event.country}
                        </Badge>

                        <h2 className='text-3xl md:text-5xl font-bold mb-4 text-white leading-tight tracking-tight'>
                          {event.title}
                        </h2>

                        <p className='text-base md:text-lg text-white/80 mb-8 max-w-3xl line-clamp-2 leading-relaxed'>
                          {event.description}
                        </p>

                        <div className='flex flex-wrap items-center gap-6 text-white/90'>
                          <div className='flex items-center gap-2'>
                            <Calendar className="w-4 h-4 text-white/70" />
                            <span className='text-sm font-medium'>
                              {format(event.startDate, "MMMM do, yyyy")}
                            </span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <MapPin className="w-4 h-4 text-white/70" />
                            <span className='text-sm font-medium'>{event.city}</span>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Users className='w-4 h-4 text-white/70' />
                            <span className='text-sm font-medium'>
                              {event.registrationCount || 0} registered
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1" />
            <CarouselNext className="right-1" />
          </Carousel>
        </div>
      )}

      {/*Local events*/}

      {localEvents && localEvents.length > 0 && (
        <div className='mb-16'>
          <div className='flex items-end justify-between mb-8'>
            <div>
              <h2 className='text-3xl font-bold text-white mb-2'>Events Near You</h2>
              <p className='text-gray-400'>
                Happening in {currentUser?.location?.city || "Pune"}
              </p>
            </div>
            <Button
              variant='outline'
              className="gap-2 bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-lg px-4 py-1.5 text-xs font-semibold h-auto"
              onClick={handleViewLocalEvents}
            >
              View All <ArrowRight className='w-3 h-3' />
            </Button>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {localEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                variant="grid"
                onClick={() => handleEventClick(event.slug)}
              />
            ))}
          </div>
        </div>
      )}
      {/* Browse by Category*/}
      <div className='mb-16'>
        <h2 className='text-3xl font-bold mb-6 text-white'>Browse By Category</h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
          {categoryWithCounts.map((category) => (
            <Card 
              key={category.id}
              className="py-2 group cursor-pointer bg-[#1A1A1A] border-white/5 hover:border-white/10 hover:bg-white/5 transition-all rounded-xl"
              onClick={() => handleCategoryClick(category.id)}
            >
              <CardContent className="px-4 py-3 flex items-center gap-4">
                <div className='text-3xl group-hover:scale-110 transition-transform'>{category.icon}</div>
                <div className='min-w-0 flex-1'>
                  <h3 className='font-bold text-sm text-white group-hover:text-purple-400 transition-colors truncate'>
                    {category.label}
                  </h3>
                  <p className='text-xs text-gray-500'>
                    {category.count} {category.count === 1 ? "Event" : "Events"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/*Popular events Across Country*/}
      

    </div>
  );
};

export default explorePage
