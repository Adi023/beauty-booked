import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/stores/userStore";
import { useBookingStore, type SharedBooking } from "@/stores/bookingStore";
import { useReviewStore } from "@/stores/reviewStore";
import RescheduleDialog from "@/components/RescheduleDialog";
import ReviewDialog from "@/components/ReviewDialog";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  User,
  Calendar,
  Clock,
  History,
  X,
  Edit3,
  Save,
  LogOut,
  ChevronRight,
  RotateCcw,
  CalendarClock,
  Star,
  MessageSquare,
} from "lucide-react";
import { format, parseISO, isAfter } from "date-fns";

function BookingCard({
  booking,
  onCancel,
  onRebook,
  onReschedule,
  showCancel,
  showRebook,
  showReschedule,
}: {
  booking: SharedBooking;
  onCancel?: () => void;
  onRebook?: () => void;
  onReschedule?: () => void;
  onReview?: () => void;
  showCancel?: boolean;
  showRebook?: boolean;
  showReschedule?: boolean;
  showReview?: boolean;
}) {
  const statusColors: Record<string, string> = {
    confirmed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    completed: "bg-muted text-muted-foreground",
    cancelled: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h4 className="font-serif font-semibold truncate">{booking.serviceName}</h4>
            <p className="text-sm text-muted-foreground mt-0.5">with {booking.stylistName}</p>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {format(parseISO(booking.date), "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {booking.time}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColors[booking.status]}`}>
              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <div className="font-semibold text-primary mt-2">₹{booking.price}</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {showReschedule && booking.status === "confirmed" && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1 font-sans"
              onClick={onReschedule}
            >
              <CalendarClock className="w-3.5 h-3.5" /> Reschedule
            </Button>
          )}
          {showCancel && booking.status === "confirmed" && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-destructive border-destructive/30 hover:bg-destructive/10 gap-1 font-sans"
              onClick={onCancel}
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </Button>
          )}
          {showRebook && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full gap-1 font-sans"
              onClick={onRebook}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Rebook
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user, updateProfile, logout } = useUserStore();
  const { bookings: allBookings, cancelBooking, rescheduleBooking } = useBookingStore();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [rescheduleTarget, setRescheduleTarget] = useState<SharedBooking | null>(null);

  if (!user) {
    navigate("/login");
    return null;
  }

  const today = new Date().toISOString().split("T")[0];
  // Filter bookings for the current user
  const bookings = allBookings.filter((b) => b.customerName === user.name);
  const upcoming = bookings.filter(
    (b) => b.status !== "cancelled" && b.status !== "completed" && isAfter(parseISO(b.date), new Date(today))
  );
  const past = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled" || !isAfter(parseISO(b.date), new Date(today))
  );

  const handleSaveProfile = () => {
    updateProfile({ name: editName, phone: editPhone });
    setEditing(false);
    toast.success("Profile updated!");
  };

  const handleCancel = (id: string) => {
    cancelBooking(id);
    toast.success("Booking cancelled");
  };

  const handleReschedule = (bookingId: string, newDate: string, newTime: string) => {
    rescheduleBooking(bookingId, newDate, newTime);
    setRescheduleOpen(false);
    setRescheduleTarget(null);
    toast.success("Booking rescheduled!");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out");
  };

  return (
    <main className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif text-2xl md:text-3xl font-bold">My Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-1">Welcome, {user.name}</p>
            </div>
            <Button variant="ghost" size="sm" className="rounded-full font-sans gap-1 text-muted-foreground" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>

          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="w-full rounded-xl bg-muted/60 p-1">
              <TabsTrigger value="bookings" className="flex-1 rounded-lg font-sans gap-1.5 text-sm">
                <Calendar className="w-4 h-4" /> Bookings
              </TabsTrigger>
              <TabsTrigger value="history" className="flex-1 rounded-lg font-sans gap-1.5 text-sm">
                <History className="w-4 h-4" /> History
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex-1 rounded-lg font-sans gap-1.5 text-sm">
                <User className="w-4 h-4" /> Profile
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Bookings */}
            <TabsContent value="bookings">
              <div className="space-y-3">
                {upcoming.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Calendar className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                      <p className="text-muted-foreground font-sans">No upcoming bookings</p>
                      <Button
                        className="mt-4 rounded-full font-sans gap-1"
                        onClick={() => navigate("/book")}
                      >
                        Book Now <ChevronRight className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  upcoming.map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      showCancel
                      showReschedule
                      onCancel={() => handleCancel(b.id)}
                      onReschedule={() => {
                        setRescheduleTarget(b);
                        setRescheduleOpen(true);
                      }}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            {/* Past History */}
            <TabsContent value="history">
              <div className="space-y-3">
                {past.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <History className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                      <p className="text-muted-foreground font-sans">No past bookings yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  past.map((b) => (
                    <BookingCard
                      key={b.id}
                      booking={b}
                      showRebook
                      onRebook={() => navigate(`/book?service=${encodeURIComponent(b.serviceName)}`)}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            {/* Profile */}
            <TabsContent value="profile">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary shrink-0">
                      {user.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Member since {format(parseISO(user.joinedDate), "MMMM yyyy")}
                      </p>
                    </div>
                  </div>

                  {editing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Name</label>
                        <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="rounded-xl" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Phone</label>
                        <Input value={editPhone} onChange={(e) => setEditPhone(e.target.value)} className="rounded-xl" />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1.5 block">Email</label>
                        <Input value={user.email} disabled className="rounded-xl opacity-60" />
                        <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                      </div>
                      <div className="flex gap-2">
                        <Button className="rounded-full font-sans gap-1" onClick={handleSaveProfile}>
                          <Save className="w-4 h-4" /> Save
                        </Button>
                        <Button variant="ghost" className="rounded-full font-sans" onClick={() => setEditing(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Email</span>
                        <span className="text-sm font-medium">{user.email}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border">
                        <span className="text-sm text-muted-foreground">Phone</span>
                        <span className="text-sm font-medium">{user.phone}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-sm text-muted-foreground">Total Bookings</span>
                        <span className="text-sm font-medium">{bookings.length}</span>
                      </div>
                      <Button
                        variant="outline"
                        className="rounded-full font-sans gap-1 mt-2"
                        onClick={() => {
                          setEditName(user.name);
                          setEditPhone(user.phone);
                          setEditing(true);
                        }}
                      >
                        <Edit3 className="w-4 h-4" /> Edit Profile
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        <RescheduleDialog
          booking={rescheduleTarget}
          open={rescheduleOpen}
          onOpenChange={setRescheduleOpen}
          onConfirm={handleReschedule}
        />
      </div>
    </main>
  );
}
