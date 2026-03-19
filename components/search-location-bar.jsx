"use client"
import { api } from '@/convex/_generated/api';
import { useConvexQuery } from '@/hooks/use-convex-query';
import { City, State } from 'country-state-city';
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
        debouncedSetQuery(value);
        setShowSearchResult(value.length >= 2)
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

    const handleLocationSelect = async (city, state) => {
        try {
            if (currentUser?.interests && currentUser?.location) {
                await updateLocation({
                    location: { city, state, country: "India" },
                    interests: currentUser.interests
                })
            }
            const slug = createLocationSlug(city, state);
            router.push(`/explore/${slug}`)
        } catch (error) {
            console.log("Failed to update location", error)
        }
    }

    return (
        <div className='flex items-center w-full max-w-3xl mx-4' ref={searchRef}>
            <div className='relative flex flex-1 items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-white/20 transition-all duration-300'>
                {/* Search Part */}
                <div className='relative flex-1 flex items-center pl-3 min-w-[200px]'>
                    <Search className="w-4 h-4 text-zinc-500" />
                    <Input
                        type="text"
                        placeholder="Search events..."
                        className="bg-transparent border-none focus-visible:ring-0 text-sm text-white placeholder:text-zinc-600 w-full h-9 pr-4 shadow-none"
                        onFocus={() => { if (searchQuery.length >= 2) setShowSearchResult(true) }}
                        onChange={handleSearchInput}
                    />
                </div>

                {/* Divider */}
                <div className='h-5 w-px bg-white/10'></div>

                {/* State Select */}
                <Select
                    value={selectedState}
                    onValueChange={(value) => {
                        setSelectedState(value);
                        setSelectedCity("");
                        if (value && selectedState) {
                            handleLocationSelect(value, selectedState)
                        }
                    }}
                >
                    <SelectTrigger className="w-[130px] bg-transparent border-none focus:ring-0 text-zinc-400 text-[13px] h-9 hover:text-white transition-colors shadow-none rounded-none">
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

                {/* Divider */}
                <div className='h-5 w-px bg-white/10'></div>

                {/* City Select */}
                <Select
                    value={selectedCity}
                    onValueChange={(value) => {
                        setSelectedCity(value);
                        handleLocationChange(selectedState, value);
                    }}
                    disabled={!selectedState}
                >
                    <SelectTrigger className="w-[130px] bg-transparent border-none focus:ring-0 text-zinc-400 text-[13px] h-9 hover:text-white transition-colors disabled:opacity-30 shadow-none rounded-none">
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

                {/* Search Results Dropdown */}
                {showSearchResult && (
                    <div className='absolute top-full left-0 mt-3 w-full min-w-[450px] bg-zinc-950/98 border border-white/10 rounded-2xl shadow-2xl z-50 max-h-[480px] overflow-hidden backdrop-blur-3xl'>
                        {searchLoading ? (
                            <div className='p-8 flex flex-col items-center justify-center gap-3'>
                                <Loader2 className='w-6 h-6 animate-spin text-white' />
                                <p className='text-xs text-zinc-500 font-medium tracking-wide'>Searching events...</p>
                            </div>
                        ) : searchResults && searchResults.length > 0 ? (
                            <div className='py-4'>
                                <div className='px-5 pb-3 flex items-center justify-between border-b border-white/5 mb-2'>
                                    <p className='text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]'>Suggested Events</p>
                                    <p className='text-[10px] font-bold text-white bg-white/5 px-2 py-0.5 rounded-full'>{searchResults.length} results</p>
                                </div>
                                <div className='space-y-1 px-2 pb-2'>
                                    {searchResults.map((event) => (
                                        <button
                                            key={event._id}
                                            className="w-full group/item px-3 py-3 text-left hover:bg-white/[0.05] rounded-xl transition-all duration-300 flex items-center gap-4 border border-transparent hover:border-white/5"
                                            onClick={() => handleEventClick(event.slug)}
                                        >
                                            <div className='w-11 h-11 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-2xl shrink-0 group-hover/item:scale-110 group-hover/item:border-white/20 transition-all duration-300 shadow-inner'>
                                                {getCategoryIcon(event.category)}
                                            </div>
                                            <div className='flex-1 min-w-0'>
                                                <p className='font-bold text-sm text-zinc-100 group-hover/item:text-white transition-colors mb-1 truncate'>
                                                    {event.title}
                                                </p>
                                                <div className='flex items-center gap-4 text-[10px] font-bold text-zinc-500'>
                                                    <span className='flex items-center gap-1.5 group-hover/item:text-zinc-400 transition-colors'>
                                                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                                        {format(event.startDate, "MMM dd, yyyy")}
                                                    </span>
                                                    <span className='flex items-center gap-1.5 group-hover/item:text-zinc-400 transition-colors'>
                                                        <MapPin className='w-3.5 h-3.5 text-zinc-500' />
                                                        {event.city}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='opacity-0 group-hover/item:opacity-100 transition-all duration-300 pr-2 transform translate-x-2 group-hover/item:translate-x-0'>
                                                <ArrowRight className="w-4 h-4 text-white" />
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
        </div>
    )
}

export default SearchLocationBar;
