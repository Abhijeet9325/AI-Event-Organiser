import Header from "@/components/ui/Header";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from '@clerk/themes'

export const metadata = {
  title: "AI Event Organizer",
  description: "Smart AI Event Planner",
};

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
  card: "shadow-none w-full max-w-md mx-auto rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-3 ",

 rootBox: "flex justify-center items-start  px-4",

  main: "gap-4",

  headerTitle: "text-lg font-semibold text-white",
  headerSubtitle: "text-sm text-gray-400 mb-3",

  socialButtonsBlockButton:
    "h-9 text-sm bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition",

  formFieldLabel: "text-sm mb-1 text-gray-300",

  formFieldInput:
    "h-7 text-sm bg-white/10 border border-white/10 rounded-lg focus:ring-2 focus:ring-cyan-400 text-white",

  formButtonPrimary:
    "bg-yellow-400 hover:bg-yellow-300 text-black font-medium h-7 rounded-lg transition",

  footerActionText: "text-sm text-gray-400",
  footerActionLink: "text-sm text-yellow-400 hover:text-yellow-300",
},

variables: {
  fontSize: "0.8rem",
}
          }}>
          <ConvexClientProvider>
            <body className="relative bg-zinc-950 text-white overflow-x-hidden min-h-screen">
              {/* Background Image with Overlay */}
              <div className="fixed inset-0 pointer-events-none -z-10">
                <div
                  className="absolute -z-10 inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://plus.unsplash.com/premium_photo-1764691261153-773d28bb3cc6?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE3fHx8ZW58MHx8fHx8')",
                    opacity: 0.32,
                     
                  }}
                />
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