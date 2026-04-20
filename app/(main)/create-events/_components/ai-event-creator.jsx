"use client"
import { useState } from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button";

export function AiEventCreator({ onEventGenerated }) {
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [prompt, setPrompt] = useState("")

  const generateEvent = async () => {
    if (!prompt.trim()) {
      toast.error("Please describe your event")
      return;
    }
    setLoading(true)
    try {
      const responce = await fetch("/api/generate-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      })

      const data = await responce.json()
      onEventGenerated(data)
      toast.success("Event details generated! review and customize below")
      setIsOpen(false)
      setPrompt("")

    } catch (error) {
      toast.error("Failed to generate event. Please try again.")
      console.error(error)
    }
    finally {
      setLoading(false)
    }
  }
 

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button 
          type="button"
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-all"
        >
          <Sparkles className="w-3 h-3" />
          AI Creator
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md bg-[#0A0A0A] border-white/5 p-6 rounded-[1.5rem] shadow-2xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <DialogTitle className="text-xl font-bold text-white">
              AI Event Creator
            </DialogTitle>
          </div>
          <DialogDescription className="text-zinc-500 text-sm">
            Describe your event idea and let AI create the details for you
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <Textarea
            value={prompt}
            id="prompt"
            placeholder="Example: A tech meetup about React 19 for developers in Bangalore. It should cover new features like Actions and use hook improvements..."
            rows={6}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] bg-zinc-900/50 border-white/10 text-white rounded-xl focus:border-purple-500/50 transition-all resize-none py-4"
          />
        </div>

        <DialogFooter className="flex flex-row gap-3 sm:justify-end">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="flex-1 sm:flex-none bg-zinc-900 border-white/5 text-white hover:bg-zinc-800 rounded-xl h-12 font-bold"
            >
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            onClick={generateEvent}
            disabled={loading || !prompt.trim()}
            className="flex-1 sm:flex-none bg-white text-black hover:bg-zinc-200 rounded-xl h-12 font-bold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />

              </>
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}