import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './dialog';
import { Input } from './input';
import { Button } from './button';
import { Loader2, Search, Image as ImageIcon, Sparkles, X } from 'lucide-react';
import Image from 'next/image';
import { Badge } from './badge';

const POPULAR_CATEGORIES = [
    { label: "Conference", query: "business conference" },
    { label: "Tech", query: "technology coding" },
    { label: "Party", query: "night club party" },
    { label: "Music", query: "live concert music" },
    { label: "Workshop", query: "creative workshop" },
    { label: "Meetup", query: "people networking" },
];

const UnsplashImagePicker = ({ isOpen, onClose, onSelect }) => {
    const [query, setQuery] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeCategory, setActiveCategory] = useState("");

    const searchImages = async (searchQuery) => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        try {
            const response = await fetch(
                `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=15&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
            );
            const data = await response.json();
            setImages(data.results || [])
        } catch (error) {
            console.error("Error fetching images from Unsplash:", error)
        }
        finally {
            setLoading(false)
        }
    }

    const handleSearch = (e) => {
        e.preventDefault();
        setActiveCategory("");
        searchImages(query)
    }

    const handleCategoryClick = (category) => {
        setQuery(category.label);
        setActiveCategory(category.label);
        searchImages(category.query);
    }

    // Load some initial images if nothing is searched
    useEffect(() => {
        if (isOpen && images.length === 0) {
            searchImages("event background");
        }
    }, [isOpen, images.length]);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-2xl bg-[#0A0A0A] border-white/5 p-0 overflow-hidden rounded-[2.5rem] shadow-2xl">
                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-purple-500/10 blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex flex-col h-[650px] max-h-[90vh]">
                    {/* Header */}
                    <div className="p-8 pb-4">
                        <DialogHeader className="mb-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/10 shadow-inner">
                                        <Sparkles className='w-6 h-6 text-purple-400' />
                                    </div>
                                    <div>
                                        <DialogTitle className="text-3xl font-extrabold text-white tracking-tight">
                                            Select Cover
                                        </DialogTitle>
                                        <p className="text-zinc-500 text-sm font-medium mt-0.5">
                                            Find the perfect visual for your event.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </DialogHeader>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="relative flex gap-3 mb-6">
                            <div className="relative flex-1 group">

                                {/* Search Icon */}
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />

                                {/* Input */}
                                <Input
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search for anything (e.g. 'sunset', 'concert')..."
                                    className="pl-12 h-14 bg-white/5 border-white/10 text-white text-base placeholder:text-zinc-600 rounded-2xl focus:border-purple-500/50 transition-all shadow-none backdrop-blur-md"
                                />
                            </div>

                            {/* Button */}
                            <Button
                                type="submit"
                                disabled={loading || !query.trim()}
                                className="bg-white text-black hover:bg-zinc-200 h-14 px-8 rounded-2xl font-bold transition-all active:scale-[0.97] shadow-xl shadow-white/5 flex items-center justify-center"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
                            </Button>
                        </form>

                        {/* Popular Categories */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {POPULAR_CATEGORIES.map((cat) => (
                                <button
                                    key={cat.label}
                                    onClick={() => handleCategoryClick(cat)}
                                    className={`
                                        px-4 py-1.5 rounded-full text-xs font-bold transition-all border
                                        ${activeCategory === cat.label
                                            ? "bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/20"
                                            : "bg-white/5 border-white/5 text-zinc-400 hover:border-white/20 hover:text-white"
                                        }
                                    `}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Image Grid Container */}
                    <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar">
                        {loading ? (
                            <div className='flex flex-col items-center justify-center h-[350px] gap-6'>
                                <div className="relative">
                                    <Loader2 className='w-14 h-14 animate-spin text-purple-500/50' />
                                    <ImageIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-purple-500" />
                                </div>
                                <div className="text-center">
                                    <p className="text-white font-bold text-lg mb-1">Curating photos...</p>
                                    <p className="text-zinc-500 text-sm">Browsing millions of high-quality shots</p>
                                </div>
                            </div>
                        ) : images.length > 0 ? (
                            <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                                {images.map((image) => (
                                    <button
                                        key={image.id}
                                        onClick={() => onSelect(image.urls.regular)}
                                        className='group relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/5 hover:border-purple-500/50 transition-all duration-500 active:scale-[0.96] shadow-2xl bg-zinc-900'
                                    >
                                        <Image
                                            src={image.urls.small}
                                            alt={image.description || "Unsplash photo"}
                                            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-700'
                                            width={400}
                                            height={250}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
                                            <div className="w-full flex items-center justify-between translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                                <span className="text-white text-[10px] font-black uppercase tracking-widest bg-purple-600 px-3 py-1.5 rounded-lg shadow-lg">
                                                    Use Photo
                                                </span>
                                                <div className="text-white/60 text-[10px] font-medium">
                                                    by {image.user.name}
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center h-[350px] text-center px-12'>
                                <div className="w-20 h-20 rounded-3xl bg-white/[0.02] border border-white/5 flex items-center justify-center mb-6 rotate-12">
                                    <Search className="w-10 h-10 text-zinc-700" />
                                </div>
                                <h4 className="text-white text-xl font-extrabold mb-2 tracking-tight">Nothing found</h4>
                                <p className="text-zinc-500 text-sm max-w-[240px] leading-relaxed">
                                    We couldn't find any photos for "{query}". Try another search term or a category.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between backdrop-blur-3xl">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">Powered by</span>
                            <a href="https://unsplash.com"
                                target='_blank'
                                rel='noopener noreferrer'
                                className='flex items-center gap-1.5 group'
                            >
                                <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center overflow-hidden">
                                    <div className="w-3 h-3 bg-black" />
                                </div>
                                <span className="text-[11px] font-bold text-zinc-400 group-hover:text-white transition-colors">Unsplash</span>
                            </a>
                        </div>
                        <p className="text-[10px] font-medium text-zinc-500">
                            {images.length} beautiful photos available
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default UnsplashImagePicker;
