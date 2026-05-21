"use client"
import EventCard from '@/components/ui/event-card'
import { api } from '@/convex/_generated/api'
import { useConvexMutation, useConvexQuery } from '@/hooks/use-convex-query'
import { Loader2, Ticket, Calendar, MapPin, X, Copy } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import QRCode from 'react-qr-code'
import { format } from 'date-fns'


const MyTicketsPage = () => {
    const [selectedTicket, setSelectedTicket] = useState(null)
    const router = useRouter();

    const { data: registrations, isLoading } = useConvexQuery(
        api.registrations.getMyRegistration
    )
    const { mutate: cancelRegistration, isLoading: isCancelling } = useConvexMutation(
        api.registrations.cancelRegistration
    )

    if (isLoading) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        )
    }

    const now = Date.now();
    const upcomingTickets = registrations?.filter(
        (reg) => reg.event && reg.event.endDate >= now && reg.status === "confirmed"
    )
    const pastTickets = registrations?.filter(
        (reg) => reg.event && (reg.event.endDate < now || reg.status === "cancelled")
    )

    const handleCancelRegistration = async (registrationId) => {
        if (!window.confirm("Are you sure you want to cancel this registration?"))
            return;

        try {
            await cancelRegistration({ registrationId });
            toast.success("Registration cancelled successfully")
        } catch (error) {
            toast.error(error.message || "Failed to cancel registration")
        }
    }

    const handleCopyTicketId = () => {
        navigator.clipboard.writeText(selectedTicket.qrCode);
        toast.success("Ticket ID copied to clipboard!");
    }

    return (
        <div className='min-h-screen pt-24 pb-20 px-4 bg-[#0A0A0A] text-white'>
            <div className='max-w-7xl mx-auto'>
                <div className='mb-16 relative'>
                    <div className='absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent rounded-3xl blur-3xl -z-10' />
                    <h1 className='text-5xl md:text-6xl font-bold mb-4 tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>My Tickets</h1>
                    <p className='text-gray-400 text-lg max-w-2xl'>View and manage your event registrations. Check out tickets you've purchased and explore upcoming events.</p>
                </div>

                {/* Upcoming Tickets */}
                {upcomingTickets?.length > 0 ? (
                    <div className='mb-20'>
                        <h2 className='text-3xl font-bold mb-10 flex items-center gap-4'>
                            <div className='w-1.5 h-10 bg-gradient-to-b from-purple-500 to-purple-700 rounded-full' />
                            <span>Upcoming Events</span>
                            <span className='ml-auto text-lg font-semibold text-purple-400 bg-purple-400/10 px-4 py-2 rounded-full'>{upcomingTickets?.length} tickets</span>
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                            {upcomingTickets.map((reg) => (
                                <EventCard
                                    key={reg._id}
                                    event={reg.event}
                                    onClick={() => setSelectedTicket(reg)}
                                    onDelete={() => handleCancelRegistration(reg._id)}
                                    action={"tickets"}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className='bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-3xl p-16 text-center mb-16 backdrop-blur-sm'>
                        <div className='w-28 h-28 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-8'>
                            <Ticket className='w-14 h-14 text-purple-400' />
                        </div>
                        <h3 className='text-3xl font-bold mb-3'>No Upcoming Events</h3>
                        <p className='text-gray-400 mb-10 max-w-lg mx-auto text-lg'>You haven&apos;t registered for any upcoming events yet. Explore our collection and find something amazing!</p>
                        <Button
                            className='bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl h-12 px-10 text-lg'
                            onClick={() => router.push('/explore')}
                        >
                            Explore Events
                        </Button>
                    </div>
                )}

                {/* Past Tickets */}
                {pastTickets?.length > 0 && (
                    <div>
                        <h2 className='text-3xl font-bold mb-10 flex items-center gap-4'>
                            <div className='w-1.5 h-10 bg-gradient-to-b from-gray-600 to-gray-700 rounded-full' />
                            <span className='text-gray-300'>Past & Cancelled</span>
                            <span className='ml-auto text-lg font-semibold text-gray-400 bg-gray-600/10 px-4 py-2 rounded-full'>{pastTickets?.length} events</span>
                        </h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 opacity-70 grayscale transition-all duration-300'>
                            {pastTickets.map((reg) => (
                                <EventCard
                                    key={reg._id}
                                    event={reg.event}
                                    onClick={() => router.push(`/events/${reg.event.slug}`)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!upcomingTickets?.length && !pastTickets?.length && (
                    <Card className="p-16 text-center bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 backdrop-blur-sm">
                        <div className="max-w-2xl mx-auto space-y-6">
                            <div className="w-32 h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto">
                                <Ticket className="w-16 h-16 text-purple-400 animate-pulse" />
                            </div>
                            <h2 className="text-4xl font-bold">No tickets yet</h2>
                            <p className="text-gray-400 text-lg">
                                Start your event journey! Register for exciting events and collect your digital tickets here.
                            </p>
                            <Button asChild className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl h-12 px-8 text-lg">
                                <Link href="/explore">
                                    <Calendar className="w-5 h-5" /> Browse Events
                                </Link>
                            </Button>
                        </div>
                    </Card>
                )}
            </div>

            {/* QR Code Modal */}
            {selectedTicket && (
                <Dialog
                    open={!!selectedTicket}
                    onOpenChange={() => setSelectedTicket(null)}
                >
                    <DialogContent className='max-w-xs bg-[#1a1a1a] border-white/10 p-6'>
                        <DialogHeader>
                            <DialogTitle className='text-xl font-bold'>Your Ticket</DialogTitle>
                        </DialogHeader>
                        <div className='space-y-4'>
                            <div className='text-center space-y-1'>
                                <p className='font-bold text-sm text-white'>{selectedTicket.attendeeName}</p>
                                <p className='text-xs text-gray-300'>{selectedTicket.event.title}</p>
                            </div>
                            <div className='flex justify-center p-4 bg-white rounded-xl shadow-lg'>
                                <QRCode value={selectedTicket.qrCode} size={160} level='H' />
                            </div>
                            <div className='bg-white/5 rounded-lg p-3  w-full text-center'>
                                <div className='flex items-center justify-center gap-1 mb-2'>
                                    <p className='text-[10px] text-gray-400 uppercase tracking-widest'>Ticket ID</p>
                                    <button
                                        onClick={handleCopyTicketId}
                                        className='hover:bg-white/10 p-1 rounded transition-colors'
                                        title='Copy ticket ID'
                                    >
                                        <Copy className='w-3 h-3 text-gray-400' />
                                    </button>
                                </div>
                                <p className='font-mono text-xs text-purple-400 break-words'>{selectedTicket.qrCode}</p>
                            </div>
                            <div className='rounded-lg p-3 space-y-2 bg-white/5 border border-white/10'>
                                <div className='flex items-center gap-2'>
                                    <Calendar className='w-4 h-4 text-purple-400' />
                                    <span className='text-xs text-gray-200'>
                                        {format(selectedTicket.event.startDate, "PPP")} 
                                        {selectedTicket.event.endDate && format(selectedTicket.event.startDate, "yyyy-MM-dd") !== format(selectedTicket.event.endDate, "yyyy-MM-dd") && (
                                            <> — {format(selectedTicket.event.endDate, "PPP")}</>
                                        )}
                                        {selectedTicket.event.startTime && ` | ${selectedTicket.event.startTime}`}
                                    </span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <MapPin className='w-4 h-4 text-purple-400' />
                                    <span className='text-xs text-gray-200'>
                                        {`${selectedTicket.event.city}, ${selectedTicket.event.state || selectedTicket.event.country}`}
                                    </span>
                                </div>
                            </div>
                            <p className='text-center text-gray-400 text-xs '>Show this QR code at the event entrance  for check-in</p>
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    )
}

export default MyTicketsPage;
