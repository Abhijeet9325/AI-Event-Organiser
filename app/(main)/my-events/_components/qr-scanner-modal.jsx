"use client";

import { useState, useEffect } from "react";
import { QrCode, Loader2, X, Keyboard } from "lucide-react";
import { useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function QRScannerModal({ isOpen, onClose }) {
  const [scannerReady, setScannerReady] = useState(false);
  const [error, setError] = useState(null);
  const [manualId, setManualId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: checkInAttendee } = useConvexMutation(
    api.registrations.checkInAttendee
  );

  const handleCheckIn = async (qrCode) => {
    setIsSubmitting(true);
    try {
      const result = await checkInAttendee({ qrCode: qrCode.trim() });

      if (result.success) {
        toast.success("✅ Check-in successful!");
        setManualId("");
        onClose();
      } else {
        toast.error(result.message || "Check-in failed");
      }
    } catch (error) {
      toast.error(error.message || "Invalid QR code");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    if (!manualId.trim()) {
      toast.error("Please enter a ticket ID");
      return;
    }
    handleCheckIn(manualId);
  };

  // Initialize QR Scanner
  useEffect(() => {
    let html5QrCode = null;
    let mounted = true;

    const initScanner = async () => {
      if (!isOpen) return;

      // Wait a bit for the dialog animation to complete and the element to be in the DOM
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!mounted) return;

      try {
        console.log("Initializing QR scanner...");

        // Dynamically import the library
        const { Html5Qrcode } = await import("html5-qrcode");

        if (!mounted) return;

        const qrReaderElement = document.getElementById("qr-reader");
        if (!qrReaderElement) {
          console.error("QR reader element not found");
          return;
        }

        html5QrCode = new Html5Qrcode("qr-reader");

        const qrCodeSuccessCallback = (decodedText) => {
          console.log("QR Code detected:", decodedText);
          html5QrCode.stop().then(() => {
            handleCheckIn(decodedText);
          }).catch(err => {
            console.error("Failed to stop scanner:", err);
            handleCheckIn(decodedText);
          });
        };

        const config = {
          fps: 10,
          qrbox: { width: 200, height: 200 },
          aspectRatio: 1.0,
        };

        // Start the camera immediately
        await html5QrCode.start(
          { facingMode: "environment" },
          config,
          qrCodeSuccessCallback
        );

        if (mounted) {
          setScannerReady(true);
          setError(null);
          console.log("Scanner started successfully");
        }
      } catch (error) {
        console.error("Failed to initialize scanner:", error);
        if (mounted) {
          setError(`Failed to start camera: ${error.message || error}`);
          // Don't toast here as it might be annoying, just show in UI
        }
      }
    };

    initScanner();

    return () => {
      mounted = false;
      if (html5QrCode && html5QrCode.isScanning) {
        console.log("Stopping scanner...");
        html5QrCode.stop().catch(console.error);
      }
      setScannerReady(false);
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] bg-[#1A1A1A] border-white/10 text-white p-5 gap-4">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-lg text-white">
            <QrCode className="w-5 h-5 text-purple-500" />
            Check-In Attendee
          </DialogTitle>
          <DialogDescription className="text-xs text-gray-400">
            Scan QR code or enter ticket ID manually
          </DialogDescription>
        </DialogHeader>

        <div className="relative overflow-hidden rounded-xl bg-black/50 border border-white/5 mx-auto w-full max-w-[280px]">
          <div
            id="qr-reader"
            className="w-full"
            style={{ minHeight: "280px" }}
          ></div>
          
          {!scannerReady && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
              <Loader2 className="w-8 h-8 animate-spin text-purple-500 mb-2" />
              <span className="text-sm text-gray-300">
                Starting camera...
              </span>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-500/10 backdrop-blur-sm p-6 text-center z-10">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-3">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-red-500 font-medium mb-2">Camera Error</p>
              <p className="text-xs text-red-400/80 mb-4">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.reload()}
                className="border-red-500/20 text-red-500 hover:bg-red-500/10"
              >
                Retry
              </Button>
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 text-center mt-2">
          {scannerReady
            ? "Position the QR code within the frame"
            : "Please allow camera access when prompted"}
        </p>

        <div className="py-2 flex items-center gap-4">
          <Separator className="flex-1 bg-white/5" />
          <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">OR</span>
          <Separator className="flex-1 bg-white/5" />
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-2">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-gray-500 uppercase tracking-widest ml-1">
              Ticket ID
            </label>
            <div className="relative">
              <Keyboard className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
              <Input
                placeholder="EVT-123456789-ABCDEFG"
                value={manualId}
                onChange={(e) => setManualId(e.target.value.toUpperCase())}
                className="bg-white/5 border-white/10 pl-9 h-9 text-xs focus:ring-purple-500/20"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 h-9 rounded-lg font-bold text-xs"
            disabled={isSubmitting || !manualId.trim()}
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              "Check-In Manually"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}