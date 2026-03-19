"use client"
import { api } from '@/convex/_generated/api';
import { useConvexMutation, useConvexQuery } from '@/hooks/use-convex-query';
import { City, State } from 'country-state-city';
import { debounce } from 'lodash';
import { ArrowRight, Calendar, Loader2, MapPin, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/Button';
import { getCategoryIcon } from '@/lib/data';
import { format } from 'date-fns';

const SearchLocationBar = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearchResult, setShowSearchResult] = useState(false)
    const searchRef = useRef(null);

    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("")

    const { data: currentUser, isLoading } = useConvexQuery(
        api.users.getCurrentUser
    )

    const { mutate: updateLocation } = useConvexMutation(
        api.users.completeOnBoarding
    )

    const { data: searchResults, isLoading: searchLoading } = useConvexQuery(
        api.search.searchEvents,
        searchQuery.trim().length >= 2 ? { query: searchQuery, limit: 5 } : "skip"
    )

    const indianStates = State.getStatesOfCountry("IN")

    useEffect(() => {
        if (currentUser?.location) {
            setSelectedState(currentUser.location.state || "")
            setSelectedCity(currentUser.location.city || "")
        }

    }, [currentUser, isLoading]);

    const cities = useMemo(() => {
        if (!selectedState) return [];
        const state = indianStates.find((s) =>
            s.name === selectedState
        )
        if (!state) return [];
        return City.getCitiesOfState("IN", state)
    }, [selectedState, indianStates])


    const debouncedSetQuery = useRef(
        debounce((value) => setSearchQuery(value), 300)
    ).current;

    const handleSearchInput = (e) => {
        const value = e.target.value;
        debouncedSetQuery(value);
        setShowSearchResult(value.length >= 2)
    }

    const handleEventClick = (slug) => {
        setShowSearchResult(false);
        setSearchQuery("");
        router.push(`/events/${slug}`);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResult(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    })


    return (
        <div className='flex items-center w-full max-w-2xl mx-4 gap-2'>
            <div className='relative flex-1 group' ref={searchRef}>
                <div className='relative flex items-center'>
                    <Search className="absolute left-3 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                    <Input
                        type="text"
                        placeholder="Search events, categories..."
                        className="pl-10 pr-4 h-10 bg-white/5 border-white/5 text-sm text-white placeholder:text-zinc-500 w-full rounded-xl transition-all 
                        focus:outline-none 
                        focus:ring-0 focus-visible:ring-0       focus-visible:ring-offset-0 
                         "
                        onFocus={() => { if (searchQuery.length >= 2) setShowSearchResult(true) }}
                        onChange={handleSearchInput}
                    />
                </div>

                {showSearchResult && (
                    <div className='absolute top-full mt-3 w-full min-w-[450px] bg-zinc-950/95 border border-white/5 rounded-2xl shadow-2xl z-50 max-h-[480px] overflow-hidden backdrop-blur-3xl shadow-purple-500/10'>
                        {searchLoading ? (
                            <div className='p-8 flex flex-col items-center justify-center gap-3'>
                                <Loader2 className='w-6 h-6 animate-spin text-white' />
                                <p className='text-xs text-zinc-500 font-medium tracking-wide'>Searching events...</p>
                            </div>
                        ) : searchResults && searchResults.length > 0 ? (
                            <div className='py-4'>
                                <div className='px-5 pb-3 flex items-center justify-between border-b border-white/5 mb-2'>
                                    <p className='text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]'>Suggested Events</p>
                                    <p className='text-[10px] font-bold text-white bg-purple-500/10 px-2 py-0.5 rounded-full'>{searchResults.length} results</p>
                                </div>
                                <div className='space-y-1 px-2 pb-2'>
                                    {searchResults.map((event) => (
                                        <button
                                            key={event._id}
                                            className="w-full group/item px-3 py-3 text-left hover:bg-white/[0.05] rounded-xl transition-all duration-300 flex items-center gap-4 border border-transparent hover:border-white/5"
                                            onClick={() => handleEventClick(event.slug)}
                                        >
                                            <div className='w-11 h-11 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-2xl shrink-0 group-hover/item:scale-110 group-hover/item:border-purple-500/30 transition-all duration-300 shadow-inner'>
                                                {getCategoryIcon(event.category)}
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-semibold text-sm text-zinc-100 group-hover/item:text-white transition-colors mb-1 truncate'>
                                                    {event.title}
                                                </p>
                                                <div className='flex items-center gap-4 text-[10px] font-semibold text-zinc-500'>
                                                    <span className='flex items-center gap-1.5 group-hover/item:text-zinc-400 transition-colors'>
                                                        <Calendar className="w-3.5 h-3.5 text-purple-500/70" />
                                                        {format(event.startDate, "MMM dd, yyyy")}
                                                    </span>
                                                    <span className='flex items-center gap-1.5 group-hover/item:text-zinc-500 transition-colors'>
                                                        <MapPin className='w-3.5 h-3.5 text-purple-500/70' />
                                                        {event.city}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='opacity-0 group-hover/item:opacity-100 transition-all duration-300 pr-2 transform translate-x-2 group-hover/item:translate-x-0'>
                                                <ArrowRight className="w-4 h-4 text-purple-500" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className='p-10 text-center space-y-3'>
                                <div className='w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4'>
                                    <Search className='w-8 h-8 text-zinc-600' />
                                </div>
                                <p className='text-base font-bold text-white'>No events found</p>
                                <p className='text-xs text-zinc-500 leading-relaxed max-w-[200px] mx-auto'>Try searching with a different keyword or category</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className='flex items-center gap-2.5 bg-white/8 border border-white/5 rounded-lg ml-5 px-2 h-8'>
                <MapPin className='w-4 h-4 text-zinc-500' />
                <span className='text-[11px] font-semibold text-zinc-400 uppercase tracking-wider'>
                    {selectedCity || "Select City"}
                </span>
            </div>
        </div>
    )
}

export default SearchLocationBar;
