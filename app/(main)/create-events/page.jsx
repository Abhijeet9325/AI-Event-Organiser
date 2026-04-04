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
import { CalendarIcon, Clock, MapPin, Users, Ticket, Sparkles, Image as ImageIcon, Loader2, ArrowRight, Palette, Plus, Crown } from 'lucide-react';
import { CATEGORIES } from '@/lib/data';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AiEventCreator } from './_components/ai-event-creator';

export const dynamic = 'force-dynamic';
export const revalidate = 0;


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
    themeColor: z.string().default("#4c1d95"),
})

const CreateEvent = () => {
    const router = useRouter();
    const [showImagePicker, setShowImagePicker] = useState(false);
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

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
            themeColor: "#1e3a8a",
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
            setValue("themeColor", "#1e3a8a");
        }
    }, [isLoaded, hasPro, setValue]);

    const watchAll = watch();
    const { themeColor, ticketType, state: selectedState, coverImage, title, description, category, startDate, endDate, city, ticketPrice } = watchAll;

    const indianStates = State.getStatesOfCountry("IN");
    const cities = useMemo(() => {
        if (!selectedState) return [];
        const st = indianStates.find((s) => s.name === selectedState)
        if (!st) return [];
        return City.getCitiesOfState("IN", st.isoCode)
    }, [selectedState, indianStates])

    const colorPresets = [
        "#4c1d95", "#1e3a8a", "#065f46", "#b91c1c", "#d97706", "#be185d", "#111827"
    ];

    const onSubmit = async (data) => {
        try {
            const formattedData = {
                ...data,
                startDate: data.startDate.getTime(),
                endDate: data.endDate.getTime(),
                tags: [], // Could add a tags input later
                timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                country: "India", // Default or from country selector
                hasPro: !!hasPro
            };
            const { eventId, slug } = await createEvent(formattedData);
            toast.success("Event created successfully!");
            router.push(`/event/${slug}`);

        } catch (error) {
            if (error.message?.includes("Upgrade to Pro")) {
                setShowUpgradeModal(true);
            } else {
                toast.error(error.message || "Failed to create event");
            }
        }
    };

const handleAIGenerated = (generatedData) => {
    console.log("AI DATA:", generatedData) // 👈 must
    setValue("title", generatedData.title)
    setValue("description", generatedData.description)
    setValue("category", generatedData.category)
    setValue("capacity", generatedData.suggestedCapacity)
    setValue("ticketType", generatedData.suggestedTicketType)
    toast.success("Event details filled! Customize as needed")
}



    return (
        <div style={{ backgroundColor: themeColor }} className="min-h-screen text-white pt-24 pb-20 px-6 relative overflow-hidden">
            {/* Theme Background Accents */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div
                    className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-10 transition-colors duration-700"
                    style={{ backgroundColor: themeColor }}
                />
                <div
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-5 transition-colors duration-700"
                    style={{ backgroundColor: themeColor }}
                />
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-10">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 mb-1">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center border transition-colors duration-300"
                                style={{
                                    backgroundColor: `${themeColor}20`,
                                    borderColor: `${themeColor}40`
                                }}
                            >
                                <Plus className="w-5 h-5" style={{ color: themeColor }} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Create Event</h1>
                        </div>
                        <p className="text-zinc-500 font-medium max-w-lg">
                            Design a professional landing page for your next event in minutes.
                        </p>
                    </div>

                    {!hasPro && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex items-center gap-6 backdrop-blur-xl">
                            <div>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Free Tier Usage</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-black text-white">{currentUser?.freeEventsCreated || 0}/1</span>
                                    <span className="text-zinc-500 text-xs font-medium">events created</span>
                                </div>
                            </div>
                            <Button
                                onClick={() => setShowUpgradeModal(true)}
                                className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold text-xs h-10 px-4"
                            >
                                <Sparkles className="w-3 h-3 mr-2" /> Upgrade
                            </Button>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* LEFT COLUMN: PREVIEW & THEME */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="sticky top-32 space-y-8">
                            {/* LIVE PREVIEW CARD */}
                            <div className="space-y-4">
                                <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">Live Preview</Label>
                                <div
                                    className="relative bg-zinc-900 border border-white/5 rounded-lg overflow-hidden shadow-2xl transition-all duration-500 group"
                                    style={{ borderColor: `${themeColor}20` }}
                                >
                                    {/* Cover Image Preview */}
                                    <div className="aspect-video bg-zinc-800 relative overflow-hidden">
                                        {coverImage ? (
                                            <Image
                                                src={coverImage}
                                                alt="Preview"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                        ) : (
                                            <div
                                                className="absolute inset-0 flex items-center justify-center transition-colors duration-500"
                                                style={{ backgroundColor: `${themeColor}40` }}
                                            >
                                                <div className="flex flex-col items-center gap-2 opacity-40">
                                                    <ImageIcon className="w-8 h-8" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest">No Cover Selected</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-60" />

                                        <button
                                            type="button"
                                            onClick={() => setShowImagePicker(true)}
                                            className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-bold px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all flex items-center gap-2"
                                        >
                                            <ImageIcon className="w-3 h-3" /> {coverImage ? "Change Cover" : "Add Cover"}
                                        </button>
                                    </div>

                                    {/* Content Preview */}
                                    <div className="p-8 space-y-6">
                                        <div className="flex items-center gap-2">
                                            <Badge className=" bg-white/5 text-zinc-400 border-none px-3 py-1 text-[10px] font-bold rounded-full">
                                                {category ? CATEGORIES.find(c => c.id === category)?.icon + " " + CATEGORIES.find(c => c.id === category)?.label : "Category"}
                                            </Badge>
                                            <Badge
                                                className="border-none px-3 py-1 text-[10px] font-bold rounded-full text-white transition-colors duration-500"
                                                style={{ backgroundColor: themeColor }}
                                            >
                                                {ticketType === 'free' ? 'FREE' : 'PAID'}
                                            </Badge>
                                        </div>

                                        <h2 className="text-2xl font-black text-white leading-tight line-clamp-2">
                                            {title || "Your Event Title Here"}
                                        </h2>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 text-zinc-400 text-xs font-bold">
                                                <CalendarIcon className="w-4 h-4" style={{ color: themeColor }} />
                                                {startDate ? format(startDate, "MMM dd, yyyy") : "Select Start Date"}
                                                {endDate && ` - ${format(endDate, "MMM dd, yyyy")}`}
                                            </div>
                                            <div className="flex items-center gap-3 text-zinc-400 text-xs font-bold">
                                                <MapPin className="w-4 h-4" style={{ color: themeColor }} />
                                                {city || "Location"}
                                            </div>
                                            {ticketType === 'paid' && ticketPrice > 0 && (
                                                <div className="flex items-center gap-3 text-zinc-400 text-xs font-bold">
                                                    <Ticket className="w-4 h-4" style={{ color: themeColor }} />
                                                    ₹{ticketPrice}
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-4 border-t border-white/5">
                                            <p className="text-zinc-500 font-medium leading-relaxed line-clamp-3 italic">
                                                {description || "Add a description to tell people what your event is all about..."}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Theme Accent Glow */}
                                    <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-lg blur-[80px] pointer-events-none opacity-20 transition-colors duration-700" style={{ backgroundColor: themeColor }} />
                                </div>
                            </div>

                            {/* THEME PICKER */}
                            <div className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-xl">
                                <div className="flex items-center gap-2 mb-6">
                                    <Palette className="w-4 h-4" style={{ color: themeColor }} />
                                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Theme & Identity</h3>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Brand Color</Label>
                                    <div className="flex flex-wrap gap-3">
                                        {colorPresets.map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => {
                                                    if (hasPro || color === "#1e3a8a") {
                                                        setValue("themeColor", color);
                                                    } else {
                                                        setShowUpgradeModal(true);
                                                    }
                                                }}
                                                className={cn(
                                                    "w-10 h-10 rounded-xl border-2 transition-all active:scale-90 relative",
                                                    themeColor === color ? "scale-110 shadow-lg" : "border-transparent",
                                                    !hasPro && color !== "#1e3a8a" && "opacity-60 grayscale-[0.5]"
                                                )}
                                                style={{
                                                    backgroundColor: color,
                                                    borderColor: themeColor === color ? 'white' : 'transparent',
                                                    boxShadow: themeColor === color ? `0 0 20px ${color}40` : 'none'
                                                }}
                                            >
                                                {!hasPro && color !== "#1e3a8a" && (
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <Crown className="w-4 h-4 text-white/40" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                        {!hasPro && (
                                            <button
                                                type="button"
                                                onClick={() => setShowUpgradeModal(true)}
                                                className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center bg-zinc-900 group overflow-hidden relative"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <Plus className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                                            </button>
                                        )}
                                    </div>
                                    {!hasPro && <p className="text-[10px] font-bold text-purple-400/80 uppercase tracking-widest mt-2">Pro: Unlock custom colors</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: FORM FIELDS */}
                    <div className="lg:col-span-7 space-y-12">
                        {/* SECTION 1: BASIC INFO */}
                        <div className="space-y-8 rounded-[2.5rem] p-8 md:p-12 ">
                            <div className="flex items-center gap-3 mb-2">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-300"
                                    style={{
                                        backgroundColor: `${themeColor}10`,
                                        borderColor: `${themeColor}20`
                                    }}
                                >
                                    <ImageIcon className="w-4 h-4" style={{ color: themeColor }} />
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-tight">Basic Details</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-xs font-semibold text-zinc-400 ml-1">Event Title</Label>
                                    <Input
                                        {...register("title")}
                                        placeholder="e.g. Master React 19 Workshop"
                                        className="h-14 text-white text-lg font-semibold rounded-2xl bg-white/5 border-white/10 transition-all shadow-none"
                                        style={{
                                            borderColor: `${themeColor}20`,
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = themeColor}
                                        onBlur={(e) => e.target.style.borderColor = `${themeColor}20`}
                                    />
                                    {errors.title && <p className="text-red-500 text-[10px] font-semibold uppercase tracking-widest ml-1">{errors.title.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between ml-1">
                                        <Label className="text-xs font-bold text-zinc-400">Description</Label>

                                        <AiEventCreator onEventGenerated={handleAIGenerated} />

                                    </div>
                                    <Textarea
                                        {...register("description")}
                                        placeholder="Tell people what makes your event special..."
                                        className="min-h-[160px] text-white font-medium rounded-2xl bg-white/5 border-white/10 transition-all shadow-none py-4 leading-relaxed"
                                        style={{
                                            borderColor: `${themeColor}20`,
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = themeColor}
                                        onBlur={(e) => e.target.style.borderColor = `${themeColor}20`}
                                    />
                                    {errors.description && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{errors.description.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-zinc-400 ml-1">Category</Label>
                                    <Controller
                                        name="category"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white px-4 rounded-lg focus:ring-0 shadow-none hover:bg-white/10 transition-all">
                                                    <SelectValue placeholder="What kind of event is it?" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-950 border-white/10 text-white rounded-lg p-2 max-h-80">
                                                    <SelectGroup>
                                                        {CATEGORIES.map((cat) => (
                                                            <SelectItem key={cat.id} value={cat.id} className="rounded-xl focus:bg-white/10 focus:text-white py-3">
                                                                <span className="mr-3">{cat.icon}</span> {cat.label}
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
                        <div className="space-y-8 rounded-lg p-8 md:p-12 ">
                            <div className="flex items-center gap-3 mb-2">
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-300"
                                    style={{
                                        backgroundColor: `${themeColor}10`,
                                        borderColor: `${themeColor}20`
                                    }}
                                >
                                    <CalendarIcon className="w-4 h-4" style={{ color: themeColor }} />
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-tight">Time & Location</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-zinc-400 ml-1">Start Date</Label>
                                    <Controller
                                        name="startDate"
                                        control={control}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant="outline" className={cn("h-14 w-full bg-white/5 border-white/10 text-white rounded-lg justify-start font-bold hover:bg-white/10 hover:text-white transition-all", !field.value && "text-zinc-600")}>
                                                        <CalendarIcon className="mr-3 h-5 w-5 text-zinc-700" />
                                                        {field.value ? format(field.value, "PPP") : "Pick a date"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-zinc-950 border-white/10 rounded-lg shadow-2xl" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date < new Date()}
                                                        initialFocus
                                                        className="bg-transparent text-white"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    {errors.startDate && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{errors.startDate.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-zinc-400 ml-1">Start Time</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
                                        <Input
                                            {...register("startTime")}
                                            type="time"
                                            className="h-14 pl-12 bg-white/5 border-white/10 text-white font-bold rounded-lg focus:border-purple-500/50 transition-all shadow-none"
                                        />
                                    </div>
                                    {errors.startTime && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{errors.startTime.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-zinc-400 ml-1">End Date</Label>
                                    <Controller
                                        name="endDate"
                                        control={control}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        disabled={!startDate}
                                                        className={cn(
                                                            "h-14 w-full bg-white/5 border-white/10 text-white rounded-lg justify-start font-bold hover:bg-white/10 hover:text-white transition-all",
                                                            !field.value && "text-zinc-600",
                                                            !startDate && "opacity-30 cursor-not-allowed"
                                                        )}
                                                    >
                                                        <CalendarIcon className="mr-3 h-5 w-5 text-zinc-700" />
                                                        {field.value ? format(field.value, "PPP") : startDate ? "Pick an end date" : "Select start date first"}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0 bg-zinc-950 border-white/10 rounded-lg shadow-2xl" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date < (startDate || new Date())}
                                                        initialFocus
                                                        className="bg-transparent text-white"
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    {errors.endDate && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{errors.endDate.message}</p>}
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-zinc-400 ml-1">End Time</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
                                        <Input
                                            {...register("endTime")}
                                            type="time"
                                            className="h-14 pl-12 bg-white/5 border-white/10 text-white font-bold rounded-lg focus:border-purple-500/50 transition-all shadow-none"
                                        />
                                    </div>
                                    {errors.endTime && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{errors.endTime.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-zinc-400 ml-1">State</Label>
                                    <Controller
                                        name="state"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white px-4 rounded-lg focus:ring-0 shadow-none hover:bg-white/10 transition-all">
                                                    <SelectValue placeholder="Select State" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-950 border-white/10 text-white px-4 rounded-lg p-2 max-h-60">
                                                    <SelectGroup>
                                                        {indianStates.map((st) => (
                                                            <SelectItem key={st.isoCode} value={st.name} className="rounded-xl focus:bg-white/10 focus:text-white py-3">
                                                                {st.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-zinc-400 ml-1">City</Label>
                                    <Controller
                                        name="city"
                                        control={control}
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value} disabled={!selectedState}>
                                                <SelectTrigger className="h-14 bg-white/5 border-white/10 text-white rounded-2xl focus:ring-0 shadow-none hover:bg-white/10 transition-all disabled:opacity-30">
                                                    <SelectValue placeholder="Select City" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-950 border-white/10 text-white rounded-2xl p-2 max-h-60">
                                                    <SelectGroup>
                                                        {cities.map((ct) => (
                                                            <SelectItem key={ct.name} value={ct.name} className="rounded-xl focus:bg-white/10 focus:text-white py-3">
                                                                {ct.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* SECTION 3: TICKETS & CAPACITY */}
                        <div className="space-y-8 rounded-lg p-8 md:p-12 ">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-300"
                                        style={{
                                            backgroundColor: `${themeColor}10`,
                                            borderColor: `${themeColor}20`
                                        }}
                                    >
                                        <Ticket className="w-4 h-4" style={{ color: themeColor }} />
                                    </div>
                                    <h2 className="text-xl font-bold text-white tracking-tight">Tickets & Access</h2>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-zinc-400 ml-1">Ticket Type</Label>
                                    <Controller
                                        name="ticketType"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-lg">
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange("free")}
                                                    className={cn(
                                                        "flex-1 py-3 rounded-xl text-xs font-black tracking-widest transition-all shadow-lg",
                                                        field.value === "free" ? "text-white" : "text-zinc-500 hover:text-white"
                                                    )}
                                                    style={{
                                                        backgroundColor: field.value === "free" ? themeColor : "transparent",
                                                    }}
                                                >
                                                    FREE
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => field.onChange("paid")}
                                                    className={cn(
                                                        "flex-1 py-3 rounded-xl text-xs font-black tracking-widest transition-all shadow-lg",
                                                        field.value === "paid" ? "text-white" : "text-zinc-500 hover:text-white"
                                                    )}
                                                    style={{
                                                        backgroundColor: field.value === "paid" ? themeColor : "transparent",
                                                    }}
                                                >
                                                    PAID
                                                </button>
                                            </div>
                                        )}
                                    />
                                </div>

                                {ticketType === "paid" && (
                                    <div className="space-y-3">
                                        <Label className="text-xs font-bold text-zinc-400 ml-1">Ticket Price</Label>
                                        <div className="relative group">
                                            <span
                                                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold transition-colors"
                                                style={{ color: themeColor }}
                                            >
                                                ₹
                                            </span>
                                            <Input
                                                {...register("ticketPrice", { valueAsNumber: true })}
                                                type="number"
                                                placeholder="0.00"
                                                className="h-14 pl-10 bg-white/5 border-white/10 text-white font-bold rounded-2xl transition-all shadow-none"
                                                style={{
                                                    borderColor: `${themeColor}20`,
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = themeColor}
                                                onBlur={(e) => e.target.style.borderColor = `${themeColor}20`}
                                            />
                                        </div>
                                        {errors.ticketPrice && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest ml-1">{errors.ticketPrice.message}</p>}
                                    </div>
                                )}

                                <div className="space-y-3">
                                    <Label className="text-xs font-bold text-zinc-400 ml-1">Capacity</Label>
                                    <div className="relative">
                                        <Users
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors"
                                            style={{ color: themeColor }}
                                        />
                                        <Input
                                            {...register("capacity", { valueAsNumber: true })}
                                            type="number"
                                            className="h-14 pl-12 bg-white/5 border-white/10 text-white font-bold rounded-2xl transition-all shadow-none"
                                            style={{
                                                borderColor: `${themeColor}20`,
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = themeColor}
                                            onBlur={(e) => e.target.style.borderColor = `${themeColor}20`}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="pt-10">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-[60vh] h-8 bg-white text-black hover:bg-zinc-200 rounded-lg font-semibold text-lg tracking-tight transition-all active:scale-[0.98]  flex items-center justify-center gap-4"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Launch Event
                                        <ArrowRight className="w-6 h-6" />
                                    </>
                                )}
                            </Button>
                            <p className="text-center text-zinc-600 text-[10px] font-bold uppercase tracking-[0.2em] mt-6">
                                By launching, you agree to our terms of service
                            </p>
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
