"use client"
import { api } from '@/convex/_generated/api';
import { useConvexMutation, useConvexQuery } from '@/hooks/use-convex-query';
import { useAuth } from '@clerk/nextjs';
import React, { useMemo, useState} from 'react'
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import z from 'zod';
import { City, State } from 'country-state-city';
import { useRouter } from 'next/navigation';
import UpgradeModal from '@/components/UpgradeModal';
import UnsplashImagePicker from '@/components/ui/unplash-image-picker';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Clock, MapPin, Users, Ticket, Sparkles, Image as ImageIcon, Loader2, ArrowRight, Palette, Plus, Crown, Check, ChevronDown, Search } from 'lucide-react';
import { CATEGORIES } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AiEventCreator } from './_components/ai-event-creator';




const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
const eventSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters long"),
    description: z.string().min(20, "Description must be at least 20 characters long"),
    category: z.string().min(1, "Please select a category"),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    startTime: z.string().regex(timeRegex, "Start time must be HH:MM"),
    endTime: z.string().regex(timeRegex, "End time must be HH:MM"),
    locationType: z.enum(["physical", "online"]).default("physical"),
    venue: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    city: z.string().min(1, "City is required"),
    state: z.string().optional().or(z.literal("")),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    ticketType: z.enum(["free", "paid"]).default("free"),
    ticketPrice: z.number().optional().default(0),
    coverImage: z.string().optional(),
    themeColor: z.string().default("#000000"),
})

const CreateEvent = () => {
    const router = useRouter();
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [stateSearch, setStateSearch] = useState("");
    const [citySearch, setCitySearch] = useState("");
    const [stateOpen, setStateOpen] = useState(false);
    const [cityOpen, setCityOpen] = useState(false);
    const stateSearchInputRef = React.useRef(null);
    const citySearchInputRef = React.useRef(null);

    const { has, isLoaded } = useAuth();
    const hasPro = has?.({ plan: "pro" })

    const { data: currentUser } = useConvexQuery(api.users.getCurrentUser)
    const { mutate: createEvent, isLoading } = useConvexMutation(api.events.createEvent)


    
    const {
        register,
        watch,
        control,
        handleSubmit,
        setValue,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(eventSchema),
        defaultValues: {
            locationType: "physical",
            ticketType: "free",
            capacity: 50,
            themeColor: "#000000",
            category: "",
            state: "",
            city: "",
            startTime: "10:00",
            endTime: "12:00",
            ticketPrice: 0
        }
    });

    React.useEffect(() => {
        if (isLoaded && !hasPro) {
            setValue("themeColor", "#000000");
        }
    }, [isLoaded, hasPro, setValue]);

    const watchAll = watch();
    const { themeColor, ticketType, state: selectedState, coverImage, title, description, category, startDate, endDate, city, ticketPrice } = watchAll;

    const indianStates = State.getStatesOfCountry("IN");
    const filteredStates = useMemo(() => {
        if (!stateSearch) return indianStates;
        return indianStates.filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase()));
    }, [indianStates, stateSearch]);

    const cities = useMemo(() => {
        if (!selectedState) return [];
        const stateObj = indianStates.find((s) => s.name === selectedState)
        if (!stateObj) return [];
        return City.getCitiesOfState("IN", stateObj.isoCode)
    }, [selectedState, indianStates]);

    const filteredCities = useMemo(() => {
        if (!citySearch) return cities;
        return cities.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase()));
    }, [cities, citySearch]);

    const colorPresets = [
        "#000000", "#1e3a8a", "#4c1d95", "#065f46", "#b91c1c", "#d97706", "#be185d"
    ];

    const onSubmit = async (data) => {
        try {
            // Sanitize numbers to prevent NaN errors in Convex
            const capacity = isNaN(Number(data.capacity)) ? 1 : Number(data.capacity);
            const ticketPrice = isNaN(Number(data.ticketPrice)) ? 0 : Number(data.ticketPrice);

            const formattedData = {
                title: data.title || "",
                description: data.description || "",
                category: data.category || "",
                tags: [], 
                startDate: data.startDate?.getTime() || Date.now(),
                endDate: data.endDate?.getTime() || (data.startDate?.getTime() || Date.now()) + 86400000,
                startTime: data.startTime || "10:00",
                endTime: data.endTime || "12:00",
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                locationType: data.locationType || "physical",
                venue: data.venue || "",
                address: data.address || "",
                city: data.city || "",
                state: data.state || "",
                country: "India",
                capacity: capacity,
                ticketType: data.ticketType || "free",
                ticketPrice: ticketPrice,
                coverImage: data.coverImage || "",
                themeColor: data.themeColor || "#000000",
                hasPro: !!hasPro
            };

            const { eventId, slug } = await createEvent(formattedData);
            toast.success("Event created successfully!");
            router.push(`/events/${slug}`);

        } catch (error) {
            const errorMessage = error.message || "";
            if (errorMessage.includes("limit reached") || errorMessage.includes("Upgrade to Pro")) {
                setShowUpgradeModal(true);
            } else {
                // Extract clean message from ConvexError
                const cleanMessage = errorMessage.replace("ConvexError: ", "") || "Failed to create event";
                toast.error(cleanMessage);
            }
        }
    };

    const handleAIGenerated = (generatedData) => {
        console.log("AI DATA:", generatedData)
        const fields = {
            title: generatedData.title,
            description: generatedData.description,
            category: generatedData.category,
            capacity: generatedData.suggestedCapacity,
            ticketType: generatedData.suggestedTicketType
        };

        Object.entries(fields).forEach(([key, value]) => {
            if (value !== undefined) {
                setValue(key, value, {
                    shouldValidate: true,
                    shouldDirty: true,
                    shouldTouch: true
                });
            }
        });

        toast.success("Event details filled! Customize as needed");
    };





    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20 px-4 md:px-6 relative overflow-hidden">
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div
                    className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 transition-all duration-1000"
                    style={{ backgroundColor: themeColor }}
                />
                <div
                    className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 transition-all duration-1000"
                    style={{ backgroundColor: themeColor }}
                />
            </div>

            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16 border-b border-white/5 pb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                            <Plus className="w-3 h-3" /> New Event
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
                            Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-500">Event</span>
                        </h1>
                        <p className="text-zinc-500 font-medium max-w-md text-sm md:text-base leading-relaxed">
                            Bring your vision to life. Fill in the details below to launch your professional event page.
                        </p>
                    </div>

                    {!hasPro && (
                        <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 backdrop-blur-xl">
                            <div className="text-center sm:text-left">
                                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Event Limit</p>
                                <div className="flex items-center gap-2 justify-center sm:justify-start">
                                    <span className="text-2xl font-black text-white">{currentUser?.freeEventCreated || 0}/1</span>
                                    <span className="text-zinc-500 text-xs font-medium italic">Available</span>
                                </div>
                            </div>
                            <Button
                                onClick={() => setShowUpgradeModal(true)}
                                className="w-full sm:w-auto bg-white text-black hover:bg-zinc-200 rounded-lg font-bold text-sm h-10 px-4  active:scale-95 transition-all"
                            >
                                <Sparkles className="w-4 h-4 mr-2" /> Upgrade to Pro
                            </Button>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* LEFT COLUMN: PREVIEW & THEME */}
                    <div className="lg:col-span-5 space-y-12">
                        <div className="sticky top-32 space-y-12">
                            {/* LIVE PREVIEW CARD */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between px-1">
                                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Live Preview</Label>
                                    <div className="flex gap-1.5">
                                        <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                        <div className="w-2 h-2 rounded-full bg-zinc-800" />
                                    </div>
                                </div>
                                <div
                                    className="relative bg-zinc-950 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 group"
                                    style={{ boxShadow: `0 0 60px ${themeColor}10` }}
                                >
                                    {/* Cover Image Preview */}
                                    <div className="aspect-video bg-zinc-900 relative overflow-hidden">
                                        {coverImage ? (
                                            <Image
                                                src={coverImage}
                                                alt="Preview"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                                            />
                                        ) : (
                                            <div
                                                className="absolute inset-0 flex items-center justify-center transition-colors duration-500"
                                                style={{ backgroundColor: `${themeColor}10` }}
                                            >
                                                <div className="flex flex-col items-center gap-3 opacity-20">
                                                    <ImageIcon className="w-10 h-10" />
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Add Cover Image</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

                                        <button
                                            type="button"
                                            onClick={() => setShowImagePicker(true)}
                                            className="absolute bottom-6 right-6 bg-white/10 backdrop-blur-xl border border-white/10 text-white text-[11px] font-bold px-6 py-2.5 rounded-full hover:bg-white/15  transition-all flex items-center gap-2 shadow-2xl active:scale-95"
                                        >
                                            <ImageIcon className="w-3.5 h-3.5" /> {coverImage ? "Update Cover" : "Select Image"}
                                        </button>
                                    </div>

                                    {/* Content Preview */}
                                    <div className="p-8 md:p-10 space-y-8">
                                        <div className="flex items-center gap-3">
                                            <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-bold text-zinc-400">
                                                {category ? CATEGORIES.find(c => c.id === category)?.icon + " " + CATEGORIES.find(c => c.id === category)?.label : "Category"}
                                            </div>
                                            <div
                                                className="px-3 py-1 rounded-full text-[10px] font-black text-white transition-all duration-500 shadow-lg"
                                                style={{ backgroundColor: themeColor }}
                                            >
                                                {ticketType === 'free' ? 'FREE' : 'PAID'}
                                            </div>
                                        </div>

                                        <h2 className="text-3xl font-black text-white leading-tight line-clamp-2 tracking-tight">
                                            {title || "Your Event Title"}
                                        </h2>

                                        <div className="grid grid-cols-2 gap-6 pt-2">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Date & Time</p>
                                                <p className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                                                    <CalendarIcon className="w-3.5 h-3.5" style={{ color: themeColor }} />
                                                    {startDate ? format(startDate, "MMM dd") : "TBD"}
                                                </p>
                                            </div>
                                            <div className="space-y-1 text-right md:text-left">
                                                <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Location</p>
                                                <p className="text-xs font-bold text-zinc-300 flex items-center gap-2 justify-end md:justify-start">
                                                    <MapPin className="w-3.5 h-3.5" style={{ color: themeColor }} />
                                                    {city || "Remote"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-white/5">
                                            <p className="text-zinc-500 font-medium leading-relaxed line-clamp-3 text-sm italic">
                                                {description || "A brief overview of your event will appear here once you add a description..."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Theme Accent Glow */}
                                    <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full blur-[80px] pointer-events-none opacity-20 transition-all duration-1000" style={{ backgroundColor: themeColor }} />
                                </div>
                            </div>

                            {/* THEME PICKER */}
                            <div className="bg-zinc-900/30 border border-white/5 rounded-[2rem] p-8 backdrop-blur-xl">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                            <Palette className="w-4 h-4 text-zinc-400" />
                                        </div>
                                        <h3 className="text-sm font-bold text-white uppercase tracking-widest">Theme</h3>
                                    </div>
                                    {!hasPro && (
                                        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-purple-500/10 text-[9px] font-black text-purple-400 uppercase tracking-tighter">
                                            <Crown className="w-2.5 h-2.5" /> PRO
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div className="flex flex-wrap gap-4">
                                        {colorPresets.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => {
                                                    if (hasPro || color === "#000000") {
                                                        setValue("themeColor", color);
                                                    } else {
                                                        setShowUpgradeModal(true);
                                                    }
                                                }}
                                                className={cn(
                                                    "w-10 h-10 rounded-xl transition-all active:scale-90 relative group/color",
                                                    themeColor === color ? "scale-110 shadow-[0_0_20px_rgba(255,255,255,0.1)] ring-2 ring-white ring-offset-4 ring-offset-zinc-950" : "hover:scale-105",
                                                    !hasPro && color !== "#000000" && "opacity-80 grayscale-[0.8]"
                                                )}
                                                style={{ backgroundColor: color }}
                                            >
                                                {!hasPro && color !== "#000000" && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Crown className="w-3.5 h-3.5 text-white/20" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                        {!hasPro && (
                                            <button
                                                type="button"
                                                onClick={() => setShowUpgradeModal(true)}
                                                className="w-10 h-10 rounded-xl border border-white/5 flex items-center justify-center bg-zinc-900/50 group/more transition-all hover:bg-zinc-800"
                                            >
                                                <Plus className="w-4 h-4 text-zinc-700 group-hover/more:text-white transition-colors" />
                                            </button>
                                        )}
                                    </div>
                                    {!hasPro && (
                                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest text-center">
                                            Upgrade to unlock custom branding
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: FORM FIELDS */}
                    <div className="lg:col-span-7 space-y-16">
                        {/* SECTION 1: BASIC INFO */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-4 pb-6">
                                <div className="w-10 h-10 flex items-center justify-center  ">
                                    <Sparkles className="w-5 h-5 text-zinc-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">Essential Info</h2>
                                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">The foundation of your event</p>
                                </div>
                            </div>

                            <div className="space-y-10">
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">Event Title</Label>
                                    <Input
                                        {...register("title")}
                                        placeholder="Enter a catchy title..."
                                        className="h-16 text-white text-xl font-bold rounded-2xl bg-zinc-900/50 border-white/5 focus:border-white/20 transition-all shadow-none px-6"
                                    />
                                    {errors.title && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{errors.title.message}</p>}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between ml-1">
                                        <Label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Description</Label>
                                        <AiEventCreator onEventGenerated={handleAIGenerated} />
                                    </div>
                                    <Textarea
                                        {...register("description")}
                                        placeholder="What is this event about? Describe the schedule, speakers, and highlights..."
                                        className="min-h-[200px] text-white font-medium rounded-2xl bg-zinc-900/50 border-white/5 focus:border-white/20 transition-all shadow-none p-6 leading-relaxed resize-none"
                                    />
                                    {errors.description && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{errors.description.message}</p>}
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">Category</Label>
                                    <Controller
                                        name="category"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="h-16 bg-zinc-900/50 border-white/5 text-white px-6 rounded-2xl focus:ring-0 shadow-none hover:bg-zinc-800/50 transition-all">
                                                    <SelectValue placeholder="Select an event category" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-950 border-white/10 text-white rounded-2xl p-2 max-h-80 shadow-2xl">
                                                    <SelectGroup>
                                                        {CATEGORIES.map((cat) => (
                                                            <SelectItem key={cat.id} value={cat.id} className="rounded-xl focus:bg-white/5 focus:text-white py-4 transition-all cursor-pointer">
                                                                <span className="mr-4 text-lg">{cat.icon}</span> <span className="font-bold">{cat.label}</span>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    {errors.category && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{errors.category.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SECTION 2: DATE & LOCATION */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                                    <MapPin className="w-5 h-5 text-zinc-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">Time & Place</h2>
                                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Where and when it happens</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">Start Date</Label>
                                    <Controller
                                        name="startDate"
                                        control={control}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" type="button" className={cn("h-16 w-full bg-zinc-900/50 rounded-2xl justify-start px-6 font-bold hover:bg-zinc-800/50 ", !field.value && "text-zinc-600")}>
                                                        <CalendarIcon className="mr-4 h-5 w-5 text-zinc-700" />
                                                        {field.value ? format(field.value, "PPP") : "Select a start date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-zinc-950 border-white/10 rounded-2xl shadow-2xl" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date < new Date()}
                                                        initialFocus
                                                        className="bg-transparent text-white p-4"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    {errors.startDate && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{errors.startDate.message}</p>}
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">End Date</Label>
                                    <Controller
                                        name="endDate"
                                        control={control}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" type="button" className={cn("h-16 w-full bg-zinc-900/50 rounded-2xl justify-start px-6 font-bold hover:bg-zinc-800/50 ", !field.value && "text-zinc-600")}>
                                                        <CalendarIcon className="mr-4 h-5 w-5 text-zinc-700" />
                                                        {field.value ? format(field.value, "PPP") : "Select an end date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-zinc-950 border-white/10 rounded-2xl shadow-2xl" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date < (startDate || new Date())}
                                                        initialFocus
                                                        className="bg-transparent text-white p-4"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    {errors.endDate && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{errors.endDate.message}</p>}
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">Start Time</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
                                        <Input
                                            {...register("startTime")}
                                            type="time"
                                            className="h-16 pl-14 bg-zinc-900/50 border-white/5 text-white font-bold rounded-2xl focus:border-white/20 transition-all shadow-none"
                                        />
                                    </div>
                                    {errors.startTime && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{errors.startTime.message}</p>}
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">End Time</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
                                        <Input
                                            {...register("endTime")}
                                            type="time"
                                            className="h-16 pl-14 bg-zinc-900/50 border-white/5 text-white font-bold rounded-2xl focus:border-white/20 transition-all shadow-none"
                                        />
                                    </div>
                                    {errors.endTime && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{errors.endTime.message}</p>}
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">State</Label>
                                    <Controller
                                        name="state"
                                        control={control}
                                        render={({ field }) => (
                                            <Popover 
                                                open={stateOpen} 
                                                onOpenChange={(open) => {
                                                    setStateOpen(open);
                                                    if (!open) setStateSearch("");
                                                }}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button 
                                                        variant="outline" 
                                                        type="button"
                                                        className="h-16 w-full bg-zinc-900/50 border-white/5 text-white px-6 rounded-2xl focus:ring-0 shadow-none hover:bg-zinc-800/50 transition-all justify-between"
                                                    >
                                                        <span className="truncate">{field.value || "Select State"}</span>
                                                        <ChevronDown className="w-4 h-4 opacity-50 shrink-0 ml-2" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent 
                                                    className="bg-zinc-950 border-white/10 text-white rounded-2xl p-0 max-h-80 shadow-2xl overflow-hidden w-[var(--radix-popover-trigger-width)]"
                                                    align="start"
                                                    onOpenAutoFocus={(e) => {
                                                        e.preventDefault();
                                                        stateSearchInputRef.current?.focus();
                                                    }}
                                                >
                                                    <div className="p-3 border-b border-white/5 bg-zinc-950">
                                                        <div className="relative flex items-center px-3 h-10 rounded-xl bg-zinc-900/50 border border-white/5">
                                                            <Search className="w-4 h-4 text-zinc-600 mr-2 shrink-0" />
                                                            <input
                                                                ref={stateSearchInputRef}
                                                                className="w-full bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-zinc-700 outline-none"
                                                                placeholder="Search state..."
                                                                value={stateSearch}
                                                                onChange={(e) => setStateSearch(e.target.value)}
                                                                onKeyDown={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-white/10">
                                                        {filteredStates.map((st) => (
                                                            <div
                                                                key={st.isoCode}
                                                                onClick={() => {
                                                                    field.onChange(st.name);
                                                                    setValue("city", ""); // Reset city when state changes
                                                                    setStateOpen(false);
                                                                }}
                                                                className={cn(
                                                                    "px-4 py-3 text-sm font-bold cursor-pointer hover:bg-white/5 transition-all flex items-center justify-between mx-2 rounded-xl",
                                                                    field.value === st.name ? "text-white bg-white/5" : "text-zinc-400"
                                                                )}
                                                            >
                                                                {st.name}
                                                                {field.value === st.name && <Check className="w-4 h-4 text-[#16d59e]" />}
                                                            </div>
                                                        ))}
                                                        {filteredStates.length === 0 && (
                                                            <div className="px-4 py-8 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] text-center">
                                                                No states found
                                                            </div>
                                                        )}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">City</Label>
                                    <Controller
                                        name="city"
                                        control={control}
                                        render={({ field }) => (
                                            <Popover 
                                                open={cityOpen} 
                                                onOpenChange={(open) => {
                                                    if (!selectedState) return;
                                                    setCityOpen(open);
                                                    if (!open) setCitySearch("");
                                                }}
                                            >
                                                <PopoverTrigger asChild>
                                                    <Button 
                                                        variant="outline" 
                                                        type="button"
                                                        disabled={!selectedState}
                                                        className="h-16 w-full bg-zinc-900/50 border-white/5 text-white px-6 rounded-2xl focus:ring-0 shadow-none hover:bg-zinc-800/50 transition-all justify-between disabled:opacity-20"
                                                    >
                                                        <span className="truncate">{field.value || "Select City"}</span>
                                                        <ChevronDown className="w-4 h-4 opacity-50 shrink-0 ml-2" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent 
                                                    className="bg-zinc-950 border-white/10 text-white rounded-2xl p-0 max-h-80 shadow-2xl overflow-hidden w-[var(--radix-popover-trigger-width)]"
                                                    align="start"
                                                    onOpenAutoFocus={(e) => {
                                                        e.preventDefault();
                                                        citySearchInputRef.current?.focus();
                                                    }}
                                                >
                                                    <div className="p-3 border-b border-white/5 bg-zinc-950">
                                                        <div className="relative flex items-center px-3 h-10 rounded-xl bg-zinc-900/50 border border-white/5">
                                                            <Search className="w-4 h-4 text-zinc-600 mr-2 shrink-0" />
                                                            <input
                                                                ref={citySearchInputRef}
                                                                className="w-full bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-zinc-700 outline-none"
                                                                placeholder="Search city..."
                                                                value={citySearch}
                                                                onChange={(e) => setCitySearch(e.target.value)}
                                                                onKeyDown={(e) => e.stopPropagation()}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="max-h-60 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-white/10">
                                                        {filteredCities.map((ct) => (
                                                            <div
                                                                key={ct.name}
                                                                onClick={() => {
                                                                    field.onChange(ct.name);
                                                                    setCityOpen(false);
                                                                }}
                                                                className={cn(
                                                                    "px-4 py-3 text-sm font-bold cursor-pointer hover:bg-white/5 transition-all flex items-center justify-between mx-2 rounded-xl",
                                                                    field.value === ct.name ? "text-white bg-white/5" : "text-zinc-400"
                                                                )}
                                                            >
                                                                {ct.name}
                                                                {field.value === ct.name && <Check className="w-4 h-4 text-[#16d59e]" />}
                                                            </div>
                                                        ))}
                                                        {filteredCities.length === 0 && (
                                                            <div className="px-4 py-8 text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] text-center">
                                                                No cities found
                                                            </div>
                                                        )}
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: TICKETS & CAPACITY */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5">
                                    <Ticket className="w-5 h-5 text-zinc-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white tracking-tight">Access & Capacity</h2>
                                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Tickets and attendee limits</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">Ticket Type</Label>
                                    <Controller
                                        name="ticketType"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="flex bg-zinc-900/50 border border-white/5 p-1 rounded-xl">
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange("free")}
                                                    className={cn(
                                                        "flex-1 py-1 rounded-lg text-[10px] font-black tracking-[0.2em] ",
                                                        field.value === "free" ? "bg-white text-black  scale-80" : "text-zinc-500 hover:text-zinc-300"
                                                    )}
                                                >
                                                    FREE
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange("paid")}
                                                    className={cn(
                                                        "flex-1 py-4 rounded-xl text-[10px] font-black tracking-[0.2em] ",
                                                        field.value === "paid" ? "bg-white text-black shadow-xl scale-80" : "text-zinc-500 hover:text-zinc-300"
                                                    )}
                                                >
                                                    PAID
                                                </button>
                                            </div>
                                        )}
                                    />
                                </div>

                                {ticketType === "paid" && (
                                    <div className="space-y-4">
                                        <Label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">Ticket Price</Label>
                                        <div className="relative group">
                                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-400 font-black text-lg">₹</span>
                                            <Input
                                                {...register("ticketPrice", { valueAsNumber: true })}
                                                type="number"
                                                placeholder="0"
                                                className="h-16 pl-12 bg-zinc-900/50 border-white/5 text-white font-bold text-xl rounded-2xl focus:border-white/20 transition-all shadow-none"
                                            />
                                        </div>
                                        {errors.ticketPrice && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{errors.ticketPrice.message}</p>}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <Label className="text-[11px] font-black text-zinc-500 uppercase tracking-widest ml-1">Total Capacity</Label>
                                    <div className="relative">
                                        <Users className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
                                        <Input
                                            {...register("capacity", { valueAsNumber: true })}
                                            type="number"
                                            className="h-16 pl-14 bg-zinc-900/50 border-white/5 text-white font-bold text-xl rounded-2xl focus:border-white/20 transition-all shadow-none"
                                        />
                                    </div>
                                    {errors.capacity && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{errors.capacity.message}</p>}
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="pt-12 space-y-8">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-10 bg-white text-black hover:bg-zinc-200 rounded-xl font-bold text-xl tracking-tight transition-all active:scale-[0.98]  flex items-center justify-center gap-4 group"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-8 h-8 animate-spin" />
                                        Launching...
                                    </>
                                ) : (
                                    <>
                                        Launch Your Event
                                        <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                                            <ArrowRight className="w-6 h-6" />
                                        </div>
                                    </>
                                )}
                            </Button>
                            <div className="flex items-center justify-center gap-3 text-zinc-600 font-bold text-[9px] uppercase tracking-[0.4em]">
                                <span>Secured by AIvento</span>
                                <div className="w-1 h-1 rounded-full bg-zinc-800" />
                                <span>Instant Deployment</span>
                            </div>
                        </div>
                    </div>
                </form>
            </div>


            {/* MODALS */}
            <UnsplashImagePicker
                isOpen={showImagePicker}
                onClose={() => setShowImagePicker(false)}
                onSelect={(url) => {
                    setValue("coverImage", url);
                    setShowImagePicker(false);
                }}
            />
            <UpgradeModal
                isOpen={showUpgradeModal}
                onClose={() => setShowUpgradeModal(false)}
                trigger="header"
            />
        </div>
    );
};

export default CreateEvent;
