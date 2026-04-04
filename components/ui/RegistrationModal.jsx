"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

export default function RegistrationModal({ isOpen, setIsOpen, onConfirm, isLoading }) {
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="bg-zinc-950 border-white/10 text-white rounded-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <CheckCircle className="text-green-500" />
                        Confirm Registration
                    </DialogTitle>
                    <DialogDescription className="pt-4 text-zinc-400">
                        You are about to register for this event. A confirmation ticket will be sent to your email.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="outline" className="rounded-lg">Cancel</Button>
                    </DialogClose>
                    <Button onClick={onConfirm} disabled={isLoading} className="bg-white text-black hover:bg-zinc-200 rounded-lg font-bold flex items-center gap-2">
                        {isLoading ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Confirming...</>
                        ) : (
                            "Confirm & Register"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}