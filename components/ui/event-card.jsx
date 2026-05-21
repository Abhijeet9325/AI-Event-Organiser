import React from 'react'
import { Card, CardContent } from './card'
import { getCategoryIcon, getCategoryLabel } from '@/lib/data'
import Image from 'next/image'
import { format } from 'date-fns'
import { MapPin, Users, Calendar, QrCode, X, Eye, Trash2 } from 'lucide-react'

import { useAuth } from '@clerk/nextjs'
import { Button } from './button'

const EventCard = ({ event,
    onClick,
    action = null, // "event" | "null" | "ticket"
    onDelete,
    variant = "grid",
    className = "",
}) => {
    const { has } = useAuth();
    const hasPro = has?.({ plan: "pro" })

    if (variant === "list") {
        return (
            <Card
                className={`py-0 group cursor-pointer hover:shadow-lg transition-all hover:border-white/20 bg-[#1A1A1A] border-white/5 rounded-2xl overflow-hidden ${className}`}
                onClick={onClick}
            >
                <CardContent className="p-4 flex gap-5">
                    <div className='w-20 h-20 rounded-xl shrink-0 overflow-hidden relative bg-zinc-800 shadow-2xl'>
                        {event.coverImage ? (
                            <Image
                                src={event.coverImage}
                                alt={event.title}
                                fill
                                className='object-cover group-hover:scale-110 transition-transform duration-500'
                            />
                        ) : (
                            <div className='absolute inset-0 flex items-center justify-center text-2xl' style={{ backgroundColor: event.themeColor || (hasPro ? "#4c1d95" : "#1e3a8a") }}>
                                {getCategoryIcon(event.category)}
                            </div>
                        )}
                    </div>
                    <div className='flex-1 min-w-0 flex flex-col justify-center gap-1'>
                        <h3 className={`font-bold text-sm text-white transition-colors line-clamp-2 leading-snug ${hasPro ? "group-hover:text-purple-400" : "group-hover:text-blue-400"}`}>
                            {event.title}
                        </h3>
                        <p className='text-[11px] text-gray-400 font-medium'>
                            {format(event.startDate, "EEE, dd MMM")}
                            {event.endDate && format(event.startDate, "yyyy-MM-dd") !== format(event.endDate, "yyyy-MM-dd") && (
                                <> — {format(event.endDate, "dd MMM")}</>
                            )}
                            {event.startTime && ` | ${event.startTime}`}
                        </p>
                        <div className='flex items-center gap-1.5 text-[11px] text-gray-500'>
                            <MapPin className='w-3 h-3 text-gray-600' />
                            <span className='line-clamp-1'>
                                {event.locationType === "online" ? "Online Event" : event.city}
                            </span>
                        </div>
                        <div className='flex items-center gap-1.5 text-[11px] text-gray-500'>
                            <Users className='w-3 h-3 text-gray-600' />
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
                    <div className='absolute inset-0 flex items-center justify-center text-4xl' style={{ backgroundColor: event.themeColor || (hasPro ? "#4c1d95" : "#1e3a8a") }}>
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
            <CardContent className="p-3 flex flex-col gap-2">
                {/* Category Badge */}
                <div className='flex'>
                    <div className='flex items-center gap-1.5 bg-white/5 px-2 py-0.5 rounded-full border border-white/5'>
                        <span className='text-xs'>{getCategoryIcon(event.category)}</span>
                        <span className='text-[9px] font-medium text-gray-300'>{getCategoryLabel(event.category)}</span>
                    </div>
                </div>

                <h3 className={`font-bold text-sm text-white transition-colors line-clamp-2 leading-tight ${hasPro ? "group-hover:text-purple-400" : "group-hover:text-blue-400"}`}>
                    {event.title}
                </h3>

                <div className='flex flex-col gap-1 mt-0.5'>
                    <div className='flex items-center gap-1.5 text-[11px] text-gray-400'>
                        <Calendar className='w-3 h-3 text-gray-500' />
                        <span className='font-medium line-clamp-1'>
                            {format(event.startDate, "MMM dd")}
                            {event.endDate && format(event.startDate, "yyyy-MM-dd") !== format(event.endDate, "yyyy-MM-dd") && (
                                <> — {format(event.endDate, "MMM dd")}</>
                            )}
                            {event.startTime && ` | ${event.startTime}`}
                        </span>
                    </div>
                    <div className='flex items-center gap-1.5 text-[11px] text-gray-400'>
                        <MapPin className='w-3 h-3 text-gray-500' />
                        <span className='line-clamp-1'>
                            {event.city}, {event.state || event.country}
                        </span>
                    </div>
                    <div className='flex items-center gap-1.5 text-[11px] text-gray-400'>
                        <Users className='w-3 h-3 text-gray-500' />
                        <span className='line-clamp-1'>
                            {event.registrationCount || 0} / {event.capacity} registered
                        </span>
                    </div>
                </div>
                {action && (
                    <div className="flex gap-2 pt-2 px-1">
                        {/* Primary button */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-white/5 border-white/10  text-white font-light rounded-lg h-8 transition-all active:scale-[0.98] gap-2"
                            onClick={(e) => {
                                e.stopPropagation();
                                onClick?.(e);
                            }}
                        >
                            {action === "event" || action === "tickets" ? (
                                <>
                                    {action === "event" ? <Eye className="w-4 h-4 opacity-70" /> : <QrCode className="w-4 h-4 opacity-70" />}
                                    {action === "event" ? "View" : "Show Ticket"}
                                </>
                            ) : null}
                        </Button>

                        {/* Secondary button - delete / cancel */}
                        {onDelete && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="w-11 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:border-red-500/50 font-light rounded-lg h-8 transition-all active:scale-[0.98] flex items-center justify-center shrink-0"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete(event._id);
                                }}
                            >
                                {action === "event" ? (
                                    <Trash2 className="w-4 h-4" />
                                ) : (
                                    <X className="w-4 h-4" />
                                )}
                            </Button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default EventCard;
