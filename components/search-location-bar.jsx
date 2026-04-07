"use client"
import { api } from '@/convex/_generated/api';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { City, State } from 'country-state-city';
import { useConvexMutation } from '@/hooks/use-convex-query';
import { debounce } from 'lodash';
import { ArrowRight, Calendar, Loader2, MapPin, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Input } from './ui/input';
import { getCategoryIcon } from '@/lib/data';
import { format } from 'date-fns';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { createLocationSlug } from '@/lib/location-utils';

const SearchLocationBar = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("")
    const [showSearchResult, setShowSearchResult] = useState(false)
    const searchRef = useRef(null);

    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("")

    const { mutate: updateLocation } = useConvexMutation(
        api.users.completeOnBoarding
    );

    const { data: currentUser, isLoading } = useConvexQuery(
        api.users.getCurrentUser
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
        const stateObj = indianStates.find((s) => s.name === selectedState)
        if (!stateObj) return [];
        return City.getCitiesOfState("IN", stateObj.isoCode)
    }, [selectedState, indianStates])

    const debouncedSetQuery = useRef(
        debounce((value) => setSearchQuery(value), 300)
    ).current;

    const handleSearchInput = (e) => {
        const value = e.target.value;
        setShowSearchResult(value.length >= 2)
        debouncedSetQuery(value);
    }

    const handleEventClick = (slug) => {
        setShowSearchResult(false);
        setSearchQuery("");
        router.push(`/events/${slug}`);
    };

    const handleLocationChange = (state, city) => {
        if (state && city) {
            const slug = createLocationSlug(city, state);
            router.push(`/explore/${slug}`);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResult(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [])

    const handleLocationSelect = async (stateName) => {
        setSelectedState(stateName);
        setSelectedCity("");
    }

    return (
        <div className='flex items-center w-full max-w-3xl mx-0.5 md:mx-4' ref={searchRef}>
            <div className='relative flex flex-1 items-center border border-white/10 rounded-xl focus-within:border-white/20 transition-all duration-300 bg-zinc-900/50 md:bg-transparent'>
                {/* Search Part */}
                <div className='relative flex-1 flex items-center pl-1.5 md:pl-3 min-w-0'>
                    <Search className="w-3 h-3 md:w-4 md:h-4 text-zinc-500 shrink-0" />
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none focus-visible:ring-0 text-[10px] md:text-sm text-white placeholder:text-zinc-600 w-full h-8 md:h-9 pr-1 md:pr-4 shadow-none"
                        onFocus={() => { if (searchQuery.length >= 2) setShowSearchResult(true) }}
                        onChange={handleSearchInput}
                    />
                </div>

                {/* Divider */}
                <div className='h-4 md:h-5 w-px'></div>

                {/* State Select */}
                <div>
                    <Select
                        value={selectedState}
                        onValueChange={handleLocationSelect}
                    >
                        <SelectTrigger className="w-[55px] md:w-[130px] bg-transparent border-none focus:ring-0 text-zinc-400 text-[10px] md:text-[13px] h-8 md:h-9 hover:text-white transition-colors shadow-none rounded-none px-1 md:px-3">
                            <SelectValue placeholder="State" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-white/10 text-white max-h-60">
                            <SelectGroup>
                                {indianStates.map((state) => (
                                    <SelectItem key={state.isoCode} value={state.name} className="focus:bg-white/10 focus:text-white text-xs">
                                        {state.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Divider */}
                <div className='h-4 md:h-5 w-px'></div>

                {/* City Select */}
                <div>
                    <Select
                        value={selectedCity}
                        onValueChange={(value) => {
                            setSelectedCity(value);
                            handleLocationChange(selectedState, value);
                        }}
                        disabled={!selectedState}
                    >
                        <SelectTrigger className="w-[55px] md:w-[130px] bg-transparent border-none focus:ring-0 text-zinc-400 text-[10px] md:text-[13px] h-8 md:h-9 hover:text-white transition-colors disabled:opacity-30 shadow-none rounded-none px-1 md:px-3">
                            <SelectValue placeholder="City" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-white/10 text-white max-h-60">
                            <SelectGroup>
                                {cities.map((city) => (
                                    <SelectItem key={city.name} value={city.name} className="focus:bg-white/10 focus:text-white text-xs">
                                        {city.name}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                {/* Search Results Dropdown */}
                {showSearchResult && (
                    <div className='absolute top-full left-0 mt-3 w-full md:min-w-[450px] bg-zinc-950/98 border border-white/10 rounded-2xl shadow-2xl z-50 max-h-[480px] overflow-hidden backdrop-blur-3xl'>
                        {searchLoading ? (
                            <div className='p-12 flex flex-col items-center justify-center gap-4'>
                                <Loader2 className='w-6 h-6 animate-spin text-[#16d59e]' />
                                <p className='text-xs text-zinc-500 font-bold uppercase tracking-widest'>Searching events...</p>
                            </div>
                        ) : searchResults && searchResults.length > 0 ? (
                            <div className='py-4'>
                                <div className='px-5 pb-3 flex items-center justify-between border-b border-white/5 mb-2'>
                                    <span className='text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]'>Top Results</span>
                                    <span className='text-[10px] font-bold text-[#16d59e] bg-[#16d59e]/10 px-2 py-0.5 rounded-full'>{searchResults.length} found</span>
                                </div>
                                <div className='px-2'>
                                    {searchResults.map((event) => (
                                        <div
                                            key={event._id}
                                            onClick={() => handleEventClick(event.slug)}
                                            className='group flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-white/5'
                                        >
                                            <div className='w-12 h-12 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform'>
                                                {getCategoryIcon(event.category)}
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <h4 className='text-sm font-bold text-white truncate group-hover:text-[#16d59e] transition-colors'>{event.title}</h4>
                                                <div className='flex items-center gap-3 mt-1'>
                                                    <div className='flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold'>
                                                        <Calendar className='w-3 h-3 text-[#16d59e]' />
                                                        {format(new Date(event.startDate), "MMM dd, yyyy")}
                                                    </div>
                                                    <div className='flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold'>
                                                        <MapPin className='w-3 h-3 text-[#16d59e]' />
                                                        {event.city}
                                                    </div>
                                                </div>
                                            </div>
                                            <ArrowRight className='w-4 h-4 text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100' />
                                        </div>
                                    ))}
                                </div>
                                <div className='mt-2 p-3 bg-zinc-900/50 border-t border-white/5 flex justify-center'>
                                    <button className='text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors'>View all results</button>
                                </div>
                            </div>
                        ) : (
                            <div className='p-12 flex flex-col items-center justify-center gap-3'>
                                <div className='w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center border border-white/5'>
                                    <Search className='w-5 h-5 text-zinc-700' />
                                </div>
                                <p className='text-xs text-zinc-500 font-bold uppercase tracking-widest'>No events found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchLocationBar
