"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useMemo, useState } from "react";
import { Button } from "./button"
import { Label } from "./label";
import { Field, FieldGroup } from "./field";
import { Progress } from "./progress";
import { ArrowLeft, Check, ChevronDown, Heart, MapPin, Search } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { City, State } from "country-state-city";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";


export function OnboardingModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedInterest, setSelectedInterest] = useState([]);
  const [location, setLocation] = useState({
    state: "",
    city: "",
    country: "India"
  });
  const [stateSearch, setStateSearch] = useState("");
  const [citySearch, setCitySearch] = useState("");
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);
  const stateSearchInputRef = useMemo(() => ({ current: null }), []);
  const citySearchInputRef = useMemo(() => ({ current: null }), []);

  const { mutate: completeOnBoarding, isLoading } = useConvexMutation(
    api.users.completeOnBoarding
  );

  const indianStates = State.getStatesOfCountry("IN")
  const filteredStates = useMemo(() => {
    if (!stateSearch) return indianStates;
    return indianStates.filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase()));
  }, [indianStates, stateSearch]);

  const cities = useMemo(() => {
    if (!location.state) return [];
    const selectedState = indianStates.find((s) =>
      s.name === location.state
    )
    if (!selectedState) return [];
    return City.getCitiesOfState("IN", selectedState.isoCode)
  }, [location.state, indianStates])

  const filteredCities = useMemo(() => {
    if (!citySearch) return cities;
    return cities.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase()));
  }, [cities, citySearch]);

  const progress = (step / 2) * 100;

  const toggleInterest = (categoryId) => {
    setSelectedInterest((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleComplete = async () => {
try {
  await completeOnBoarding({
    location : {
      city : location.city,
      state : location.state,
      country : location.country,
    },
    interests : selectedInterest,
  });
  toast.success("Welcome to AIvento!🎉");
   // 👉 redirect bhi yahi karo
    setTimeout(() => {
      onComplete?.(); // parent handle karega redirect
    }, 500);
    
} catch (error) {
  toast.error("Failed to complete onboarding");
  console.error(error);
}
  }

  const handleNext = () => {
    // Step 1 validation
    if (step === 1 && selectedInterest.length < 3) {
      toast.error("Please select at least 3 interests");
      return;
    }

    // Step 2 validation
    if (step === 2 && (!location.state || !location.city)) {
      toast.error("Please select both city and state");
      return;
    }

    // Step change logic
    if (step === 1) {
      setStep(2); // 👉 move to next step
    } else {
      handleComplete(); // 👉 final submit
    }
  };

  // const handleSave = () => {
  //   if (!location.city || !location.state) return;
  //   onComplete?.({ interests: selectedInterest, location });
  // };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#121212] border-white/5 p-0 overflow-hidden rounded-xl">
        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 w-full z-50">
          <Progress
            value={progress}
            className="h-[3px] mt-2 bg-white/10 rounded-lg"
            indicatorClassName="bg-gray-300 transition-all duration-500"
          />
        </div>

        <div className="p-6 pt-10">
          <DialogHeader className="mb-6 space-y-2">
            <div className="top-3 left-0">
            {step > 1 && (
              <Button  onClick={() => setStep(step - 1)} className={"gap-2"}>
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            )}
            </div>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
              {step === 1 ? (
                <>
                  <Heart className="w-5 h-5 text-purple-500 " />
                  What interests you?
                </>
              ) : (
                <>
                  <MapPin className="w-5 h-5 text-purple-500 fill-purple-500" />
                  Where are you located?
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-xs font-medium">
              {step === 1 ? (
                "Select at least 3 categories to personalize your experience"
              ) : (
                "We'll show you events happening near you"
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
            {step === 1 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {CATEGORIES.map((category) => {
                  const isSelected = selectedInterest.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() => toggleInterest(category.id)}
                      className={`
                        flex flex-col items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-300
                        ${isSelected
                          ? "bg-purple-500/10 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                          : "bg-white/[0.02] border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04]"
                        }
                      `}
                    >
                      <div className={`text-2xl transition-transform duration-300 ${isSelected ? "scale-110" : ""}`}>
                        {category.icon}
                      </div>
                      <div className={`text-xs font-bold transition-colors ${isSelected ? "text-white" : "text-gray-400"}`}>
                        {category.label}
                      </div>

                    </button>

                  );
                })}
                {/* ✅ Sticky Bottom Section */}
                <div className="col-span-full sticky bottom-2 flex flex-col items-center gap-1">

                  {/* Badge */}
                  <div
                    className={`
                         px-3 py-1 rounded-full text-xs font-semibold transition-all duration-300
                         ${selectedInterest.length >= 3
                        ? "bg-white text-black"
                        : "bg-gray-700 text-gray-300"}
    `}
                  >
                    {selectedInterest.length} selected
                  </div>

                  {/* Message */}
                  {/* {selectedInterest.length >= 3 && (
    <span className="text-green-400 text-xs font-medium animate-fade-in">
      Ready to continue ✓
    </span>
  )} */}

                </div>
              </div>
            ) : (
              <div className="space-y-4 py-2">
                <FieldGroup className="space-y-4">

                  {/* STATE FIRST */}
                  <Field className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-300">State</Label>
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
                          className="h-10 bg-white/5 border-white/10 text-white w-full rounded-lg hover:bg-white/10 transition-colors justify-between"
                        >
                          <span className="truncate">{location.state || "Select state"}</span>
                          <ChevronDown className="w-4 h-4 opacity-50 shrink-0 ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="bg-[#1A1A1A] border-white/10 text-white rounded-lg p-0 max-h-60 shadow-2xl overflow-hidden w-[var(--radix-popover-trigger-width)]"
                        align="start"
                        onOpenAutoFocus={(e) => {
                          e.preventDefault();
                          stateSearchInputRef.current?.focus();
                        }}
                      >
                        <div className="p-2 border-b border-white/5 bg-[#1A1A1A]">
                          <div className="relative flex items-center px-2 h-8 rounded-md bg-white/5 border border-white/5">
                            <Search className="w-3 h-3 text-gray-500 mr-2 shrink-0" />
                            <input
                              ref={stateSearchInputRef}
                              className="w-full bg-transparent border-none focus:ring-0 text-[11px] text-white placeholder:text-gray-600 outline-none"
                              placeholder="Search state..."
                              value={stateSearch}
                              onChange={(e) => setStateSearch(e.target.value)}
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-white/10">
                          {filteredStates.map((state) => (
                            <div
                              key={state.isoCode}
                              onClick={() => {
                                setLocation({ ...location, state: state.name, city: "" });
                                setStateOpen(false);
                              }}
                              className={cn(
                                "px-3 py-1.5 text-xs cursor-pointer hover:bg-white/5 transition-all flex items-center justify-between mx-1 rounded-md",
                                location.state === state.name ? "text-white bg-white/5" : "text-gray-400"
                              )}
                            >
                              {state.name}
                              {location.state === state.name && <Check className="w-3 h-3 text-purple-500" />}
                            </div>
                          ))}
                          {filteredStates.length === 0 && (
                            <div className="px-4 py-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest text-center">
                              No states found
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </Field>

                  {/* CITY */}
                  <Field className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-300">City</Label>
                    <Popover 
                      open={cityOpen} 
                      onOpenChange={(open) => {
                        if (!location.state) return;
                        setCityOpen(open);
                        if (!open) setCitySearch("");
                      }}
                    >
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          disabled={!location.state}
                          className="h-10 bg-white/5 border-white/10 text-white w-full rounded-lg hover:bg-white/10 transition-colors justify-between disabled:opacity-50"
                        >
                          <span className="truncate">
                            {location.state ? (location.city || "Select city") : "Select state first"}
                          </span>
                          <ChevronDown className="w-4 h-4 opacity-50 shrink-0 ml-2" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="bg-[#1A1A1A] border-white/10 text-white rounded-lg p-0 max-h-60 shadow-2xl overflow-hidden w-[var(--radix-popover-trigger-width)]"
                        align="start"
                        onOpenAutoFocus={(e) => {
                          e.preventDefault();
                          citySearchInputRef.current?.focus();
                        }}
                      >
                        <div className="p-2 border-b border-white/5 bg-[#1A1A1A]">
                          <div className="relative flex items-center px-2 h-8 rounded-md bg-white/5 border border-white/5">
                            <Search className="w-3 h-3 text-gray-500 mr-2 shrink-0" />
                            <input
                              ref={citySearchInputRef}
                              className="w-full bg-transparent border-none focus:ring-0 text-[11px] text-white placeholder:text-gray-600 outline-none"
                              placeholder="Search city..."
                              value={citySearch}
                              onChange={(e) => setCitySearch(e.target.value)}
                              onKeyDown={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="max-h-48 overflow-y-auto py-1 scrollbar-thin scrollbar-thumb-white/10">
                          {filteredCities.map((city) => (
                            <div
                              key={city.name}
                              onClick={() => {
                                setLocation({ ...location, city: city.name });
                                setCityOpen(false);
                              }}
                              className={cn(
                                "px-3 py-1.5 text-xs cursor-pointer hover:bg-white/5 transition-all flex items-center justify-between mx-1 rounded-md",
                                location.city === city.name ? "text-white bg-white/5" : "text-gray-400"
                              )}
                            >
                              {city.name}
                              {location.city === city.name && <Check className="w-3 h-3 text-purple-500" />}
                            </div>
                          ))}
                          {filteredCities.length === 0 && (
                            <div className="px-4 py-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest text-center">
                              No cities found
                            </div>
                          )}
                        </div>
                      </PopoverContent>
                    </Popover>
                  </Field>

                </FieldGroup>
              </div>
            )}
          </div>

          {/* show your location after selected */}
          {location.state && location.city && (
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 mt-4 rounded-lg">
              <div className="flex items-center gap-3">
                <MapPin className="flex items-center gap-3" />
                <div>
                  <p className="font-medium">Your Location</p>
                  <p className="text-sm text-muted-foreground">{location.city},{location.state},{location.country}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-8 flex gap-2 items-center justify-end">
            <Button
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/5 px-4 rounded-lg h-9 text-sm"
            >
              Cancel
            </Button>
            {step === 1 ? (
              <Button
                className={`
                  bg-white text-black font-bold px-6 rounded-lg h-9 text-sm hover:bg-gray-200 transition-all active:scale-95
                  ${selectedInterest.length < 3 ? "opacity-50 cursor-not-allowed" : ""}
                `}
                onClick={handleNext}
                disabled={selectedInterest.length < 3}
              >
                Next
              </Button>
            ) : (
              <Button
                className="bg-white text-black font-bold px-6 rounded-lg h-9 text-sm hover:bg-gray-200 transition-all active:scale-95"
                onClick={handleComplete}
                disabled={!location.city || !location.state}
              >
                Save changes
              </Button>
            )}

          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};


export default OnboardingModal;