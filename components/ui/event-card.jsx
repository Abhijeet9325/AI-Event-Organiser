import React from 'react'
import { Card, CardContent } from './card'
import { getCategoryIcon, getCategoryLabel } from '@/lib/data'
import Image from 'next/image'
import { format } from 'date-fns'
import { MapPin, Users, Calendar } from 'lucide-react'

const EventCard = ({ event, onClick, showActions = false, onDelete, variant = "grid", className = "" }) => {
    if (variant === "list") {
        return (
            <Card
                className={`py-0 group cursor-pointer hover:shadow-lg transition-all hover:border-white/20 bg-[#1A1A1A] border-white/5 rounded-xl overflow-hidden ${className}`}
                onClick={onClick}
            >
                <CardContent className="p-3 flex gap-3">
                    <div className='w-16 h-16 rounded-lg shrink-0 overflow-hidden relative bg-zinc-800'>
                        {event.coverImage ? (
                            <Image
                                src={event.coverImage}
                                alt={event.title}
                                fill
                                className='object-cover'
                            />
                        ) : (
                            <div className='absolute inset-0 flex items-center justify-center text-xl' style={{ backgroundColor: event.themeColor }}>
                                {getCategoryIcon(event.category)}
                            </div>
                        )}
                    </div>
                    <div className='flex-1 min-w-0 flex flex-col justify-center py-0.5'>
                        <h3 className='font-bold text-xs text-white mb-0.5 group-hover:text-gray-300 transition-colors line-clamp-1'>
                            {event.title}
                        </h3>
                        <p className='text-[10px] text-gray-400 mb-0.5'>
                            {format(event.startDate, "EEE, dd MMM, HH:mm")}
                        </p>
                        <div className='flex items-center gap-1 text-[10px] text-gray-500 mb-0.5'>
                            <MapPin className='w-2.5 h-2.5' />
                            <span className='line-clamp-1'>
                                {event.locationType === "online" ? "Online Event" : event.city}
                            </span>
                        </div>
                        <div className='flex items-center gap-1 text-[10px] text-gray-500'>
                            <Users className='w-2.5 h-2.5' />
                            <span>
                                {event.registrationCount || 0} attending
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Default grid variant
    return (
        <Card
            className={`group cursor-pointer overflow-hidden bg-[#1A1A1A] border-white/5 hover:border-white/10 transition-all rounded-2xl ${className}`}
            onClick={onClick}
        >
            <div className='aspect-video relative overflow-hidden'>
                {event.coverImage ? (
                    <Image
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                ) : (
                    <div className='absolute inset-0 flex items-center justify-center text-4xl' style={{ backgroundColor: event.themeColor }}>
                        {getCategoryIcon(event.category)}
                    </div>
                )}
                {/* Paid/Free Badge */}
                <div className='absolute top-3 right-3'>
                    <div className='bg-black/60 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-bold text-white border border-white/10'>
                        {event.ticketType === "free" ? "Free" : "Paid"}
                    </div>
                </div>
            </div>
            <CardContent className="p-5 flex flex-col gap-3">
                {/* Category Badge */}
                <div className='flex'>
                    <div className='flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5'>
                        <span className='text-xs'>{getCategoryIcon(event.category)}</span>
                        <span className='text-[10px] font-medium text-gray-300'>{getCategoryLabel(event.category)}</span>
                    </div>
                </div>

                <h3 className='font-bold text-lg text-white group-hover:text-purple-400 transition-colors line-clamp-2 leading-tight'>
                    {event.title}
                </h3>

                <div className='flex flex-col gap-2 mt-1'>
                    <div className='flex items-center gap-2 text-xs text-gray-400'>
                        <Calendar className='w-3.5 h-3.5 text-gray-500' />
                        <span className='font-medium'>
                            {format(event.startDate, "MMMM do, yyyy")}
                        </span>
                    </div>
                    <div className='flex items-center gap-2 text-xs text-gray-400'>
                        <MapPin className='w-3.5 h-3.5 text-gray-500' />
                        <span className='line-clamp-1'>
                            {event.city}, {event.state || event.country}
                        </span>
                    </div>
                    <div className='flex items-center gap-2 text-xs text-gray-400'>
                        <Users className='w-3.5 h-3.5 text-gray-500' />
                        <span>
                            {event.registrationCount || 0} / {event.capacity} registered
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default EventCard;
