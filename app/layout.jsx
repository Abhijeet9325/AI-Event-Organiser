import Header from "@/components/ui/Header";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from '@clerk/themes'
import SparkDrop from "@/components/SparkDrop";
import { Inter } from "next/font/google";

export const metadata = {
  title: "AI Event Organizer",
  description: "Smart AI Event Planner",
};
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>

      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <ClerkProvider
          appearance={{
            theme: shadesOfPurple,
            elements: {
              card: "shadow-none max-w-[380px] w-full mx-auto",
              rootBox: "transition-transform",
              formButtonPrimary: "bg-purple-600 hover:bg-purple-700 transition-all text-sm h-8",
              headerTitle: "text-lg",
              headerSubtitle: "text-xs mb-2",
              socialButtonsBlockButton: "h-8 text-xs",
              formFieldInput: "h-8 text-sm",
              footerActionText: "text-xs",
              footerActionLink: "text-xs",
              formFieldLabel: "text-xs mb-1",
              main: "gap-4",
            },
            variables: {
              fontSize: '0.85rem',
            }
          }}>
          <ConvexClientProvider>
            <body className={`relative bg-zinc-950  text-white overflow-x-hidden min-h-screen ${inter.className}`}>
              {/* Background Image with Overlay */}
              <div className="fixed inset-0 pointer-events-none -z-10">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://images.unsplash.com/photo-1635094483454-0722881acccd?q=80&w=2000&auto=format&fit=crop')",
                    opacity: 0.16,
                  }}

                />
                {/* Spark Animation */}
                <SparkDrop />
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-zinc-950/80 to-zinc-950" />
              </div>


              {/* Main Content */}

              <Header />
              <main className="relative min-h-screen z-10">
                {children}

              </main>

            </body>
          </ConvexClientProvider>
        </ClerkProvider>
      </ThemeProvider>
    </html>
  );
}