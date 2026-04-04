import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { PricingTable } from "@clerk/nextjs";
import { Button } from "./ui/button";

const UpgradeModal = ({ isOpen, onClose, trigger = "limit" }) => {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                showCloseButton={false}
                className="sm:max-w-xl max-h-[90vh] overflow-y-auto bg-[#0A0A0A] border-white/5 p-0 rounded-[2rem] shadow-2xl"
            >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-purple-500/5 blur-[120px] pointer-events-none" />
                <div className="relative z-10 p-4 md:p-6">
                    <DialogHeader className="mb-10 text-center md:text-left">
                        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-2xl flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-3xl md:text-4xl font-extrabold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-500">
                                    Unlock Pro Features
                                </DialogTitle>
                                <DialogDescription className="text-zinc-400 text-sm md:text-base mt-1 font-medium">
                                    {trigger === "header" &&
                                        "Take your events to the next level with Pro access."}
                                    {trigger === "limit" &&
                                        "You've reached your free limit. Scale up with Pro!"}
                                    {trigger === "color" &&
                                        "Personalize your brand with custom Pro themes."}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                        <div className="space-y-4 py-4">
                            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                Why go Pro?
                            </h4>
                            {[
                                "Unlimited Event Creations",
                                "Custom Branding & Themes",
                                "Advanced Analytics & Insights",
                                "Priority Customer Support",
                                "AI-Powered Event Descriptions",
                            ].map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3 text-zinc-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
                                    <span className="text-sm font-medium">{benefit}</span>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white/[0.02] border border-white/5 rounded-3xl overflow-hidden p-2 max-w-md mx-auto">
                            <PricingTable
                                checkoutProps={{
                                    appearance: {
                                        elements: {
                                            drawerRoot: { zIndex: 2000 },
                                            card: {
                                                backgroundColor: "transparent",
                                                border: "none",
                                                boxShadow: "none",
                                            },
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-8 border-t border-white/5">
                        <p className="text-zinc-500 text-xs font-medium italic">
                            Cancel anytime. Secure checkout by Clerk.
                        </p>
                        <div className="flex gap-3 items-center justify-center w-full sm:w-auto">
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                className="flex-1 sm:flex-none text-zinc-400 cursor-pointer px-8 rounded-2xl font-semibold h-12"
                            >
                                Not Now
                            </Button>
                            <Button className="flex-1 sm:flex-none bg-white text-black hover:bg-zinc-100 px-4 rounded-lg font-semibold h-8 transition-all active:scale-[0.98] shadow-xl shadow-white/5">
                                Upgrade Now
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default UpgradeModal;
