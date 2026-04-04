"use client"
import { api } from '@/convex/_generated/api'
import { useConvexMutation, useConvexQuery } from '@/hooks/use-convex-query'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'
import { Loader2, Eye } from 'lucide-react'
import EventCard from '@/components/ui/event-card'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

const MyEventsPage = () => {
    const router = useRouter();
    const { data: events, isLoading } = useConvexQuery(api.users.getMyEvents)
    const { mutate: deleteEvent } = useConvexMutation(api.users.deleteEvent)

    const handleDelete = async (eventId) => {
        if (!window.confirm("Are you sure you want to delete this event?"))
            return;

        try {
            await deleteEvent({ eventId });
            toast.success("Event deleted successfully")
        } catch (error) {
            toast.error(error.message || "Failed to delete event")
        }
    }

    const handleEventClick = (eventId) => {
        router.push(`/my-events/${eventId}`)
    }

    if (isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        )
    }

    return (
        <div className='min-h-screen pt-24 pb-20 px-4 bg-[#0A0A0A] text-white'>
            <div className='max-w-7xl mx-auto'>
                <div className='mb-16 relative'>
                    <div className='absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent rounded-3xl blur-3xl -z-10' />
                    <h1 className='text-5xl md:text-6xl font-bold mb-4 tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>My Events</h1>
                    <p className='text-gray-400 text-lg max-w-2xl'>Manage your created events. View, edit, or delete your events anytime.</p>
                </div>

                {events && events.length > 0 ? (
                    <div>
                        <h2 className='text-3xl font-bold mb-10 flex items-center gap-4'>
                            <div className='w-1.5 h-10 bg-gradient-to-b from-purple-500 to-purple-700 rounded-full' />
                            <span>Your Events</span>
                            <span className='ml-auto text-lg font-semibold text-purple-400  px-4 py-2'>{events?.length} events</span>
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                            {events.map((event) => (
                                <EventCard
                                    key={event._id}
                                    event={event}
                                    onClick={() => handleEventClick(event._id)}
                                    onDelete={() => handleDelete(event._id)}
                                    action="event"
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <Card className="p-16 text-center bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm">
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                                <Eye className="w-16 h-16 text-purple-400 animate-pulse" />
                            </div>
                            <h2 className="text-4xl font-bold">No events yet</h2>
                            <p className="text-gray-400 text-lg">
                                Create your first event and start managing it here. Build amazing experiences for your audience!
                            </p>
                            <Button asChild className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl h-12 px-8 text-lg">
                                <Link href="/create-events">
                                    Create Event
                                </Link>
                            </Button>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default MyEventsPage
