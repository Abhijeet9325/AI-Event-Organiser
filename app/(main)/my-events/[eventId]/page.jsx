"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Clock,
  Trash2,
  QrCode,
  Loader2,
  CheckCircle,
  Download,
  Search,
  Eye,
  FileText,
} from "lucide-react";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import QRScannerModal from "../_components/qr-scanner-modal";
import { AttendeeCard } from "../_components/attendee-card";

export default function EventDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId;

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Fetch event dashboard data
  const { data: dashboardData, isLoading } = useConvexQuery(
    api.dashboard.getEventDashboard,
    { eventId }
  );

  // Fetch registrations
  const { data: registrations, isLoading: loadingRegistrations } =
    useConvexQuery(api.registrations.getEventRegistrations, { eventId });

  // Delete event mutation
  const { mutate: deleteEvent, isLoading: isDeleting } = useConvexMutation(
    api.dashboard.deleteEvent
  );

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event? This action cannot be undone and will permanently delete the event and all associated registrations."
    );

    if (!confirmed) return;

    try {
      await deleteEvent({ eventId });
      toast.success("Event deleted successfully");
      router.push("/my-events");
    } catch (error) {
      toast.error(error.message || "Failed to delete event");
    }
  };

  const handleExportCSV = () => {
    if (!registrations || registrations.length === 0) {
      toast.error("No registrations to export");
      return;
    }

    const csvContent = [
      [
        "Name",
        "Email",
        "Registered At",
        "Checked In",
        "Checked In At",
        "QR Code",
      ],
      ...registrations.map((reg) => [
        reg.attendeeName,
        reg.attendeeEmail,
        new Date(reg.registeredAt).toLocaleString(),
        reg.checkedIn ? "Yes" : "No",
        reg.checkedInAt ? new Date(reg.checkedInAt).toLocaleString() : "-",
        reg.qrCode,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${dashboardData?.event.title || "event"}_registrations.csv`;
    a.click();
    toast.success("CSV exported successfully");
  };

  const handleExportPDF = () => {
    if (!registrations || registrations.length === 0) {
      toast.error("No registrations to export");
      return;
    }

    // Create a simple HTML table for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${dashboardData?.event.title || "Event"} - Attendee Report</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fff; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #3b82f6; padding-bottom: 15px; }
          .header h1 { color: #1e293b; font-size: 28px; margin-bottom: 8px; }
          .header p { color: #64748b; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          thead { background: #1e293b; color: white; }
          th { 
            padding: 12px; 
            text-align: left; 
            font-weight: 600;
            font-size: 13px;
            letter-spacing: 0.5px;
          }
          td { 
            padding: 10px 12px; 
            border-bottom: 1px solid #e2e8f0;
            font-size: 12px;
          }
          tbody tr:nth-child(even) { background: #f8fafc; }
          tbody tr:hover { background: #f1f5f9; }
          .checked-in { color: #10b981; font-weight: 600; }
          .pending { color: #f59e0b; font-weight: 600; }
          .footer { 
            margin-top: 30px; 
            padding-top: 15px; 
            border-top: 1px solid #e2e8f0;
            color: #64748b;
            font-size: 11px;
            text-align: center;
          }
          @media print {
            body { padding: 0; }
            .stat-box { page-break-inside: avoid; }
            table { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${dashboardData?.event.title || "Event"}</h1>
          <p>Generated on ${new Date().toLocaleString()}</p>
        </div>

        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Registered</th>
              <th>Checked In</th>
              <th>QR Code</th>
            </tr>
          </thead>
          <tbody>
            ${registrations
              .map(
                (reg) => `
              <tr>
                <td><strong>${reg.attendeeName}</strong></td>
                <td>${reg.attendeeEmail}</td>
                <td><span class="${reg.checkedIn ? "checked-in" : "pending"}">${
                  reg.checkedIn ? "✓ Checked In" : "⏳ Pending"
                }</span></td>
                <td>${new Date(reg.registeredAt).toLocaleDateString()}</td>
                <td>${
                  reg.checkedInAt
                    ? new Date(reg.checkedInAt).toLocaleString()
                    : "-"
                }</td>
                <td><code style="background: #f1f5f9; padding: 2px 4px; border-radius: 4px; font-size: 11px;">${reg.qrCode}</code></td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <div class="footer">
          <p>Event ID: ${eventId} | Total Attendees: ${registrations.length}</p>
          <p>This report is confidential and for authorized personnel only.</p>
        </div>
      </body>
      </html>
    `;

    // Create new window and print to PDF
    const printWindow = window.open("", "_blank");
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Auto print after content loads
    setTimeout(() => {
      printWindow.print();
      toast.success("PDF ready for download!");
    }, 250);
  };

  if (isLoading || loadingRegistrations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  if (!dashboardData) {
    notFound();
  }

  const { event, stats } = dashboardData;

  // Filter registrations based on active tab and search
  const filteredRegistrations = registrations?.filter((reg) => {
    const matchesSearch =
      reg.attendeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.attendeeEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reg.qrCode.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "all") return matchesSearch && reg.status === "confirmed";
    if (activeTab === "checked-in")
      return matchesSearch && reg.checkedIn && reg.status === "confirmed";
    if (activeTab === "pending")
      return matchesSearch && !reg.checkedIn && reg.status === "confirmed";

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-950 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <button
          onClick={() => router.push("/my-events")}
          className="flex items-center gap-2 mb-8 text-slate-300 font-medium text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Events
        </button>

        {/* Hero Section with Cover Image */}
        {event.coverImage && (
          <div className="relative h-[400px] rounded-3xl overflow-hidden mb-12 shadow-lg">
            <Image
              src={event.coverImage}
              alt={event.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30"></div>
          </div>
        )}

        {/* Event Title & Info Section */}
        <div className="mb-12">
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold bg-slate-700 text-slate-100">
              {getCategoryIcon(event.category)} {getCategoryLabel(event.category)}
            </Badge>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              stats.isEventPast 
                ? 'bg-slate-600 text-slate-200' 
                : stats.isEventToday 
                ? 'bg-red-900 text-red-100' 
                : 'bg-blue-900 text-blue-100'
            }`}>
              {stats.isEventPast ? 'Event Ended' : stats.isEventToday ? 'Today' : 'Upcoming'}
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-6">{event.title}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-300 mb-8">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 mt-0.5 text-blue-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Date & Time</p>
                <p className="text-base font-medium mt-1 text-slate-100">{format(event.startDate, "PPpp")}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 mt-0.5 text-emerald-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Location</p>
                <p className="text-base font-medium mt-1 text-slate-100">
                  {event.locationType === "online"
                    ? "Online Event"
                    : `${event.city}, ${event.state || event.country}`}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 mt-0.5 text-amber-400 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Time Remaining</p>
                <p className="text-base font-medium mt-1 text-slate-100">
                  {stats.isEventPast
                    ? "Event has ended"
                    : stats.hoursUntilEvent > 24
                      ? `${Math.floor(stats.hoursUntilEvent / 24)} days left`
                      : `${stats.hoursUntilEvent} hours left`}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => router.push(`/events/${event.slug}`)}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-white text-slate-900 font-medium rounded-xl"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Public Page
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 sm:flex-none px-6 py-2.5 bg-red-900 text-red-100 font-medium rounded-xl border border-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? "Deleting..." : "Delete Event"}
            </Button>
          </div>
        </div>

        {/* Quick Check-In Button */}
        {stats.isEventToday && !stats.isEventPast && (
          <div className="mb-12 bg-white rounded-xl">
            <button
              onClick={() => setShowQRScanner(true)}
              className="w-full flex items-center justify-center gap-3 text-black font-semibold text-sm py-3"
            >
              <QrCode className="w-6 h-6" />
              Scan QR Code to Check-In Attendees
            </button>
          </div>
        )}

        {/* Stats Grid - Premium Design */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {/* Capacity Stat */}
          <div className="bg-gray-950 rounded-2xl p-6 border border-slate-700 shadow-sm">
            <div className="mb-4 w-12 h-12 bg-purple-900 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Total Registrations</p>
            <p className="text-3xl font-bold text-white">{stats.totalRegistrations}</p>
            <p className="text-xs text-slate-400 mt-2">Capacity: {stats.capacity}</p>
          </div>

          {/* Checked In Stat */}
          <div className="bg-gray-950 rounded-2xl p-6 border border-slate-700 shadow-sm">
            <div className="mb-4 w-12 h-12 bg-green-900 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Checked In</p>
            <p className="text-3xl font-bold text-white">{stats.checkedInCount}</p>
            <p className="text-xs text-slate-400 mt-2">
              {stats.totalRegistrations > 0 
                ? Math.round((stats.checkedInCount / stats.totalRegistrations) * 100) 
                : 0}% of total
            </p>
          </div>

          {/* Revenue or Check-in Rate */}
          {event.ticketType === "paid" ? (
            <div className="bg-gray-950 rounded-2xl p-6 border border-slate-700 shadow-sm">
              <div className="mb-4 w-12 h-12 bg-blue-900 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Total Revenue</p>
              <p className="text-3xl font-bold text-white">₹{stats.totalRevenue}</p>
              <p className="text-xs text-slate-400 mt-2">From {stats.totalRegistrations} attendees</p>
            </div>
          ) : (
            <div className="bg-gray-950 rounded-2xl p-6 border border-slate-700 shadow-sm">
              <div className="mb-4 w-12 h-12 bg-orange-900 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-400" />
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Check-in Rate</p>
              <p className="text-3xl font-bold text-white">{stats.checkInRate}%</p>
              <p className="text-xs text-slate-400 mt-2">Attendance rate</p>
            </div>
          )}

          {/* Pending Stat */}
          <div className="bg-gray-950 rounded-2xl p-6 border border-slate-700 shadow-sm">
            <div className="mb-4 w-12 h-12 bg-amber-900 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Pending Check-in</p>
            <p className="text-3xl font-bold text-white">{stats.pendingCount}</p>
            <p className="text-xs text-slate-400 mt-2">Not checked in yet</p>
          </div>
        </div>

        {/* Attendee Management Section */}
        <div className="bg-gray-950 rounded-xl border border-gray-900  overflow-hidden">
          <div className="border-b border-slate-800 px-6 sm:px-8 py-6">
            <h2 className="text-2xl font-bold text-white">Attendee Management</h2>
          </div>

          <div className="px-6 sm:px-8 py-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <Input
                  placeholder="Search by name, email, or QR code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-slate-700 border-slate-600 rounded-xl text-white placeholder-slate-400"
                />
              </div>
              <Button
                onClick={handleExportPDF}
                className="px-6 py-2.5 bg-white text-black font-medium rounded-lg mt-1 border-0"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 bg-gray-950 rounded-lg p-1">
                <TabsTrigger value="all" className="rounded-md text-slate-300 data-[state=active]:bg-slate-600 data-[state=active]:text-white">
                  All ({stats.totalRegistrations})
                </TabsTrigger>
                <TabsTrigger value="checked-in" className="rounded-md text-slate-300 data-[state=active]:bg-slate-600 data-[state=active]:text-white">
                  Checked In ({stats.checkedInCount})
                </TabsTrigger>
                <TabsTrigger value="pending" className="rounded-md text-slate-300 data-[state=active]:bg-slate-600 data-[state=active]:text-white">
                  Pending ({stats.pendingCount})
                </TabsTrigger>
              </TabsList>

              {/* Attendee List */}
              <TabsContent value={activeTab} className="space-y-3 mt-0">
                {filteredRegistrations && filteredRegistrations.length > 0 ? (
                  <div className="space-y-3">
                    {filteredRegistrations.map((registration) => (
                      <AttendeeCard
                        key={registration._id}
                        registration={registration}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">No attendees found</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScannerModal
          isOpen={showQRScanner}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
}