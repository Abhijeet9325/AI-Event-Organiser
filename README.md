# 🚀 AIvento - AI Event Organizer

AIvento is a modern **AI-powered event management platform** that enables users to **discover, create, and manage events effortlessly** with a premium SaaS experience.

Built using **Next.js, Convex, Clerk, and Framer Motion**, this project demonstrates a **full product lifecycle from idea to production-ready SaaS application**.

---

## 🌐 Live Demo

👉 https://ai-event-organizer-eight.vercel.app/

---

# 🧠 Development Journey (From Scratch → SaaS)

## 🟢 Phase 0: Project Initialization 

* Created project using Next.js
* Built initial layout:

  * Header
  * Glow background effect
* Defined idea: **AI Event Organizer System**

---

## 🟡 Phase 1: Authentication & Database 

* Integrated **Clerk authentication**
* Stored users in **Convex database**
* Designed database schema:

  * Users
  * Events
  * Registrations
* Added indexing & search support

---

## 🔵 Phase 2: Event Discovery System 

* Built explore page with:

  * Dynamic routing using `[slug]`

* Implemented queries:

  * Featured events
  * Popular events
  * Location-based filtering
  * Category filtering

* Added:

  * Featured events carousel
  * Sample dataset for testing
  * Global styling improvements

---

## 🟣 Phase 3: UI Components & Cards 

* Designed reusable **Event Card component**
* Added:

  * Image overlays
  * Event details
  * Clean responsive layout

---

## 🟠 Phase 4: Homepage & Discovery Enhancements

* Added:

  * “Browse by Category” section
  * “Events Near You” section
* Improved UI with better spacing & responsiveness

---

## 🟤 Phase 5: Onboarding & Personalization 

* Multi-step onboarding modal
* Dynamic:

  * State & city selection
* User preference setup
* Toast + redirect flow

---

## 🔍 Phase 6: Search & Filtering 

* Implemented search bar with:

  * Debounce optimization
* Location-based routing
* Fixed:

  * Search suggestions
  * Routing issues

---

## 💳 Phase 7: SaaS Subscription Model 

* Integrated **Clerk billing (test mode)**
* Implemented:

  * Pricing modal
  * Subscription handling

### 💡 Logic:

* First event → FREE
* Additional events → PRO required

---

## 🧾 Phase 8: Event Creation System 

* Built full event creation flow:

  * React Hook Form + Zod validation
  * Schema sync with Convex
* Features:

  * Location (State + City)
  * Date & time selection
  * Ticket system (Free / Paid)
* Added Pro restrictions

---

## 🎟️ Phase 9: Event Experience 

* Event detail page
* Registration modal
* “My Tickets” page:

  * Upcoming events
  * Past events
  * QR code modal
  * Cancel registration

---

## 📊 Phase 10: Dashboard System 

* Built event dashboard:

  * Attendee management
  * QR check-in system
  * Registration tracking
  * Revenue analytics

* Export features:

  * CSV export
  * PDF reports

---

## ⚙️ Phase 11: Production Fixes & Deployment 

* Fixed:

  * Vercel build issues
  * Dependency conflicts
  * Path alias issues
* Updated:

  * Convex client setup
  * Middleware (Clerk redirect fix)
* Optimized dynamic pages

---

## 🎨 Phase 12: UI/UX & Motion 

* Redesigned landing page (Linear-inspired)
* Added **Framer Motion animations**:

  * Scroll-based animations
  * Fade & stagger effects
* Improved:

  * Typography
  * Color system
  * Hover interactions

---

## 📱 Phase 13: Mobile & UI Refinement 

* Improved mobile responsiveness
* Refined:

  * Create Event page UI
  * Spacing & alignment
  * Button interactions

---

# ✨ Key Features

* 🤖 AI Event Creation
* 🔍 Smart Event Discovery & Filtering
* 🎨 Modern SaaS Landing Page
* 📊 Event Dashboard & Analytics
* 🎟️ Attendee Management
* 📤 CSV & PDF Export
* 📱 Fully Responsive UI
* 💳 Subscription System (Free → Pro)
* 🔐 Authentication with Clerk

---

# 🛠️ Tech Stack

| Category       | Tech                  |
| -------------- | --------------------- |
| Frontend       | Next.js (App Router)  |
| Styling        | Tailwind CSS          |
| Animations     | Framer Motion         |
| Backend        | Convex                |
| Auth & Billing | Clerk                 |
| Forms          | React Hook Form + Zod |
| UI Components  | shadcn/ui             |
| Icons          | Lucide                |

---

# 🎥 UI Highlights

* ✨ Smooth scroll animations
* 🎯 Subtle hover effects
* 🌌 Dark + glow-based design
* 💎 Clean SaaS UI (Linear-inspired)

---

# 📂 Project Structure

```bash id="finalstruct"
/app
  /create-events
  /event
  /dashboard
/components
/convex
/lib
/hooks
```

---

# ⚡ Getting Started

```bash id="finalsetup"
git clone https://github.com/Abhijeet9325/AI-Event-Organiser.git
cd AI-Event-Organiser
npm install
npm run dev
```

---

# 🚀 What Makes This Project Stand Out

* 🧠 Built step-by-step from scratch (clear evolution)
* 💳 Real SaaS monetization model
* 📊 Complete product lifecycle
* 🎨 Premium UI + motion system
* 🔧 Production-ready fixes & deployment handling

---

# 🔮 Future Improvements

* 🔔 Notifications system
* 📅 Calendar integrations
* 📈 Advanced analytics
* 🤖 Smarter AI suggestions

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub!

---

## 👨‍💻 Author

**Abhijeet**
Full Stack Developer | Building AI-powered SaaS apps 🚀
