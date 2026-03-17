"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react";
import { Button } from "./Button"
import { Input } from "./input";
import { Label } from "./label";
import { Field, FieldGroup } from "./field";
import { Progress } from "./progress";
import { Heart, MapPin } from "lucide-react";
import { CATEGORIES } from "@/lib/data";

export function OnboardingModal({ isOpen, onClose, onComplete }) {
  const [step, setStep] = useState(1);
  const [selectedInterest, setSelectedInterest] = useState([]);
  const [location, setLocation] = useState({
    state: "",
    city: "",
    country: "India"
  });

  const progress = (step / 2) * 100;

  const toggleInterest = (categoryId) => {
    setSelectedInterest((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleNext = () => {
    if (selectedInterest.length < 3) return;
    setStep(2);
  };

  const handleSave = () => {
    if (!location.city || !location.state) return;
    onComplete?.({ interests: selectedInterest, location });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-[#121212] border-white/5 p-0 overflow-hidden rounded-2xl">
        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 w-full z-10">
          <Progress 
            value={progress} 
            className="h-[3px] bg-white/5" 
            indicatorClassName="bg-purple-500 transition-all duration-500"
          />
        </div>

        <div className="p-8 pt-10">
          <DialogHeader className="mb-8 space-y-3">
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-white">
              {step === 1 ? (
                <>
                  <Heart className="w-6 h-6 text-purple-500 fill-purple-500" />
                  What interests you?
                </>
              ) : (
                <>
                  <MapPin className="w-6 h-6 text-purple-500 fill-purple-500" />
                  Where are you located?
                </>
              )}
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-sm font-medium">
              {step === 1 ? (
                "Select at least 3 categories to personalize your experience"
              ) : (
                "We'll show you events happening near you"
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {step === 1 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {CATEGORIES.map((category) => {
                  const isSelected = selectedInterest.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      onClick={() => toggleInterest(category.id)}
                      className={`
                        flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-300
                        ${isSelected 
                          ? "bg-purple-500/10 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)]" 
                          : "bg-white/[0.02] border-white/5 hover:border-purple-500/30 hover:bg-white/[0.04]"
                        }
                      `}
                    >
                      <div className={`text-3xl transition-transform duration-300 ${isSelected ? "scale-110" : ""}`}>
                        {category.icon}
                      </div>
                      <div className={`text-sm font-bold transition-colors ${isSelected ? "text-white" : "text-gray-400"}`}>
                        {category.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6 py-4">
                <FieldGroup className="space-y-6">
                  <Field className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-semibold text-gray-300">City</Label>
                    <Input 
                      id="city" 
                      placeholder="e.g. Pune" 
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-purple-500/50 text-white"
                      value={location.city}
                      onChange={(e) => setLocation({ ...location, city: e.target.value })}
                    />
                  </Field>
                  <Field className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-semibold text-gray-300">State</Label>
                    <Input 
                      id="state" 
                      placeholder="e.g. Maharashtra" 
                      className="bg-white/5 border-white/10 h-12 rounded-xl focus:border-purple-500/50 text-white"
                      value={location.state}
                      onChange={(e) => setLocation({ ...location, state: e.target.value })}
                    />
                  </Field>
                </FieldGroup>
              </div>
            )}
          </div>

          <DialogFooter className="mt-10 flex gap-3 items-center justify-end">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-white/5 px-6 rounded-xl h-11"
            >
              Cancel
            </Button>
            {step === 1 ? (
              <Button 
                className={`
                  bg-white text-black font-bold px-8 rounded-xl h-11 hover:bg-gray-200 transition-all active:scale-95
                  ${selectedInterest.length < 3 ? "opacity-50 cursor-not-allowed" : ""}
                `}
                onClick={handleNext}
                disabled={selectedInterest.length < 3}
              >
                Next
              </Button>
            ) : (
              <Button 
                className="bg-white text-black font-bold px-8 rounded-xl h-11 hover:bg-gray-200 transition-all active:scale-95"
                onClick={handleSave}
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
}

export default OnboardingModal;