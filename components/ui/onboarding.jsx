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
import { Button } from "./Button"
import { Label } from "./label";
import { Field, FieldGroup } from "./field";
import { Progress } from "./progress";
import { ArrowLeft, Heart, MapPin } from "lucide-react";
import { CATEGORIES } from "@/lib/data";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { City, State } from "country-state-city";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./select";


export function OnboardingModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedInterest, setSelectedInterest] = useState([]);
  const [location, setLocation] = useState({
    state: "",
    city: "",
    country: "India"
  });

  const { mutate: completeOnBoarding, isLoading } = useConvexMutation(
    api.users.completeOnBoarding
  );

  const indianStates = State.getStatesOfCountry("IN")
  const cities = useMemo(() => {
    if (!location.state) return [];
    const selectedState = indianStates.find((s) =>
      s.name === location.state
    )
    if (!selectedState) return [];
    return City.getCitiesOfState("IN", selectedState.isoCode)
  }, [location.state, indianStates])

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
                    <Select
                      value={location.state}
                      onValueChange={(value) =>
                        setLocation({ ...location, state: value, city: "" })
                      }
                    >
                      <SelectTrigger className="h-10 bg-white/5 border-white/10 text-white w-full rounded-lg hover:bg-white/10 transition-colors">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>

                      <SelectContent position="popper" className="bg-[#1A1A1A] border-white/10 text-white max-h-60 w-[var(--radix-select-trigger-width)]">
                        <SelectGroup>
                          {indianStates.map((state) => (
                            <SelectItem key={state.isoCode} value={state.name} className="focus:bg-purple-500/20 focus:text-white">
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>

                  {/* CITY */}
                  <Field className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-300">City</Label>
                    <Select
                      value={location.city}
                      onValueChange={(value) =>
                        setLocation({ ...location, city: value })
                      }
                      disabled={!location.state}
                    >
                      <SelectTrigger className="h-10 bg-white/5 border-white/10 text-white w-full rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50">
                        <SelectValue
                          placeholder={
                            location.state ? "Select city" : "Select state first"
                          }
                        />
                      </SelectTrigger>

                      <SelectContent position="popper" className="bg-[#1A1A1A] border-white/10 text-white max-h-60 w-[var(--radix-select-trigger-width)]">
                        <SelectGroup>
                          {cities.length > 0 ? (
                            cities.map((city) => (
                              <SelectItem key={city.name} value={city.name} className="focus:bg-purple-500/20 focus:text-white">
                                {city.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-city" disabled className="text-gray-500 italic">
                              No cities available
                            </SelectItem>
                          )}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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