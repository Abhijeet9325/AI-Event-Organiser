"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Ticket, CheckCircle } from "lucide-react";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Utility function to darken a color
function darkenColor(color, amount) {
  const colorWithoutHash = color.replace("#", "");
  const num = parseInt(colorWithoutHash, 16);
  const r = Math.max(0, (num >> 16) - amount * 255);
  const g = Math.max(0, ((num >> 8) & 0x00ff) - amount * 255);
  const b = Math.max(0, (num & 0x0000ff) - amount * 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

export default function RegisterModal({ event, isOpen, onClose }) {
  const router = useRouter();
  const { user } = useUser();
  const [name, setName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(
    user?.primaryEmailAddress?.emailAddress || ""
  );
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: registerForEvent, isLoading } = useConvexMutation(
    api.registrations.registerForEvent
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await registerForEvent({
        eventId: event?._id,
        attendeeName: name,
        attendeeEmail: email,
      });

      setIsSuccess(true);
      toast.success("Registration successful! 🎉");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  const handleViewTicket = () => {
    router.push("/my-tickets");
    onClose();
  };

  // Success state
  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent 
          className="sm:max-w-md border-none text-white rounded-3xl p-8 overflow-hidden shadow-2xl"
          style={{
            backgroundColor: event?.themeColor ? darkenColor(event.themeColor, 0.1) : "#0A0A0A"
          }}
        >
          <div className="relative text-center space-y-6">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold mb-2 tracking-tight">You&apos;re All Set!</h2>
              <p className="text-white/60 text-sm max-w-[280px] mx-auto leading-relaxed">
                Your registration is confirmed. Your ticket is ready in your dashboard.
              </p>
            </div>

            <div className="w-full space-y-3 pt-4">
              <Button 
                className="w-full h-14 rounded-2xl bg-white text-black hover:bg-zinc-100 font-bold gap-2 transition-all active:scale-[0.98] shadow-xl" 
                onClick={handleViewTicket}
              >
                <Ticket className="w-5 h-5" />
                View My Ticket
              </Button>
              <Button 
                variant="ghost" 
                className="w-full h-12 rounded-2xl text-white/50 hover:text-white hover:bg-white/5 font-medium" 
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Registration form
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-lg border-none text-white rounded-3xl p-8 overflow-hidden shadow-2xl"
        style={{
          backgroundColor: event?.themeColor ? darkenColor(event.themeColor, 0.1) : "#0A0A0A"
        }}
      >
        <div className="space-y-8">
          <DialogHeader className="text-left">
            <DialogTitle className="text-3xl font-bold tracking-tight text-white">
              Register for Event
            </DialogTitle>
            <DialogDescription className="text-white/50 font-medium">
              Join this experience by filling in your details below.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-0 focus:border-white/20 text-white placeholder:text-white/30 px-5 transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-white/50 uppercase tracking-widest ml-1">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="h-14 bg-white/5 border-white/10 rounded-2xl focus:ring-0 focus:border-white/20 text-white placeholder:text-white/30 px-5 transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
              <CheckCircle className="w-4 h-4 text-white/30 shrink-0" />
              <p className="text-[10px] text-white/40 font-medium leading-relaxed">
                By registering, you agree to receive event updates and reminders via email. Your data is secure.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold transition-all"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-[2] h-14 rounded-2xl bg-white text-black hover:bg-zinc-100 font-bold transition-all active:scale-[0.98] gap-2 shadow-xl" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Confirm
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}