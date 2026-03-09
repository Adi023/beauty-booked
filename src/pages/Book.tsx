import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  fetchServices,
  fetchStylists,
  fetchTimeSlots,
  createBooking,
} from "@/services/api";
import { useUserStore } from "@/stores/userStore";
import { useBookingStore } from "@/stores/bookingStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Star,
  CalendarDays,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { format, addDays, isSameDay } from "date-fns";

const STEPS = ["Service", "Stylist", "Date & Time", "Confirm"];

export default function Book() {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("service");
  const navigate = useNavigate();

  const { isAuthenticated, user, addBooking } = useUserStore();

  const [step, setStep] = useState(preselected ? 1 : 0);
  const [serviceId, setServiceId] = useState(preselected || "");
  const [stylistId, setStylistId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Pre-fill logged-in user details
  useEffect(() => {
    if (isAuthenticated && user) {
      setName(user.name);
      setPhone(user.phone);
      setEmail(user.email);
    }
  }, [isAuthenticated, user]);

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: fetchServices,
  });
  const { data: stylists = [] } = useQuery({
    queryKey: ["stylists"],
    queryFn: () => fetchStylists(),
  });
  const { data: slots = [] } = useQuery({
    queryKey: ["slots", selectedDate.toISOString(), stylistId],
    queryFn: () => fetchTimeSlots(selectedDate.toISOString(), stylistId),
    enabled: !!stylistId,
  });

  const selectedService = useMemo(
    () => services.find((s) => s.id === serviceId),
    [services, serviceId],
  );
  const selectedStylist = useMemo(
    () => stylists.find((s) => s.id === stylistId),
    [stylists, stylistId],
  );

  const bookMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      // Add booking to user store if logged in
      if (isAuthenticated && selectedService && selectedStylist) {
        addBooking({
          id: crypto.randomUUID(),
          serviceName: selectedService.name,
          stylistName: selectedStylist.name,
          date: format(selectedDate, "yyyy-MM-dd"),
          time: selectedTime,
          price: selectedService.price,
          duration: selectedService.duration,
          status: "confirmed",
        });
      }

      toast.success("Appointment booked!", {
        description: isAuthenticated
          ? "View it in your dashboard."
          : "You will receive a confirmation shortly.",
      });
      setStep(4);
    },
  });

  const dates = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i));

  const canNext =
    (step === 0 && serviceId) ||
    (step === 1 && stylistId) ||
    (step === 2 && selectedTime) ||
    (step === 3 && name && phone);

  const handleNext = () => {
    if (step === 3) {
      bookMutation.mutate({
        serviceId,
        stylistId,
        date: selectedDate.toISOString(),
        time: selectedTime,
        customerName: name,
        customerPhone: phone,
      });
    } else {
      setStep((s) => s + 1);
    }
  };

  const handleReset = () => {
    setStep(0);
    setServiceId("");
    setStylistId("");
    setSelectedTime("");
    if (!isAuthenticated) {
      setName("");
      setPhone("");
      setEmail("");
    }
  };

  return (
    <main className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-2">
            Book an Appointment
          </h1>
          <p className="text-muted-foreground mb-8">
            Just a few steps and you're all set.
          </p>
        </motion.div>

        {/* Step indicator */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2 shrink-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                    i < step
                      ? "bg-primary text-primary-foreground"
                      : i === step
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:inline ${i === step ? "text-foreground" : "text-muted-foreground"}`}
                >
                  {s}
                </span>
                {i < STEPS.length - 1 && <div className="w-6 h-px bg-border" />}
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 0: Select Service */}
          {step === 0 && (
            <motion.div
              key="service"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-3"
            >
              {services.map((s) => (
                <Card
                  key={s.id}
                  className={`cursor-pointer transition-all ${serviceId === s.id ? "ring-2 ring-primary border-primary" : "hover:border-primary/30"}`}
                  onClick={() => setServiceId(s.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif font-semibold">{s.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {s.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <div className="font-semibold text-primary">
                        ₹{s.price}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                        <Clock className="w-3 h-3" /> {s.duration}m
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {/* Step 1: Select Stylist */}
          {step === 1 && (
            <motion.div
              key="stylist"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid gap-3"
            >
              {stylists.map((s) => (
                <Card
                  key={s.id}
                  className={`cursor-pointer transition-all ${stylistId === s.id ? "ring-2 ring-primary border-primary" : "hover:border-primary/30"}`}
                  onClick={() => setStylistId(s.id)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-sm font-bold text-muted-foreground shrink-0">
                      {s.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-semibold">{s.name}</h3>
                      <p className="text-sm text-muted-foreground">{s.title}</p>
                    </div>
                    <div className="flex items-center gap-1 text-sm shrink-0">
                      <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                      <span className="font-medium">{s.rating}</span>
                      <span className="text-muted-foreground">
                        ({s.reviewCount})
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <motion.div
              key="datetime"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="mb-6">
                <h3 className="font-serif font-semibold mb-3 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-primary" /> Select Date
                </h3>
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                  {dates.map((d) => (
                    <button
                      key={d.toISOString()}
                      onClick={() => {
                        setSelectedDate(d);
                        setSelectedTime("");
                      }}
                      className={`shrink-0 w-16 py-3 rounded-xl text-center transition-all ${
                        isSameDay(d, selectedDate)
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-card border border-border hover:border-primary/30"
                      }`}
                    >
                      <div className="text-[10px] uppercase font-medium opacity-70">
                        {format(d, "EEE")}
                      </div>
                      <div className="text-lg font-bold">{format(d, "d")}</div>
                      <div className="text-[10px] opacity-70">
                        {format(d, "MMM")}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-serif font-semibold mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Select Time
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                        selectedTime === slot.time
                          ? "bg-primary text-primary-foreground shadow-md"
                          : slot.available
                            ? "bg-card border border-border hover:border-primary/30"
                            : "bg-muted text-muted-foreground/40 cursor-not-allowed line-through"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm */}
          {step === 3 && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="mb-6">
                <CardContent className="p-5">
                  <h3 className="font-serif font-semibold mb-3">
                    Booking Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service</span>
                      <span className="font-medium">
                        {selectedService?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Stylist</span>
                      <span className="font-medium">
                        {selectedStylist?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">
                        {format(selectedDate, "EEEE, MMM d")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium">{selectedTime}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="font-semibold">Total</span>
                      <span className="font-semibold text-primary">
                        ₹{selectedService?.price}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-xl"
                  disabled={isAuthenticated}
                />
                <Input
                  placeholder="Phone number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-xl"
                  disabled={isAuthenticated}
                />
                <Input
                  placeholder="Email address (optional)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl"
                  disabled={isAuthenticated}
                />
                {isAuthenticated && (
                  <p className="text-xs text-muted-foreground">
                    Booking as <span className="font-medium">{user?.name}</span> — details from your profile.
                  </p>
                )}
                {!isAuthenticated && (
                  <p className="text-xs text-muted-foreground">
                    <button onClick={() => navigate("/login")} className="text-primary font-medium hover:underline">
                      Log in
                    </button>{" "}
                    to save bookings to your dashboard.
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-serif text-2xl font-bold mb-2">
                You're All Set!
              </h2>
              <p className="text-muted-foreground mb-6">
                Your appointment with {selectedStylist?.name} on{" "}
                {format(selectedDate, "EEEE, MMM d")} at {selectedTime} is
                confirmed.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {isAuthenticated && (
                  <Button
                    variant="outline"
                    className="rounded-full px-8 font-sans"
                    onClick={() => navigate("/dashboard")}
                  >
                    View Dashboard
                  </Button>
                )}
                <Button
                  className="rounded-full px-8 font-sans"
                  onClick={handleReset}
                >
                  Book Another
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        {step < 4 && (
          <div className="flex justify-between mt-8">
            <Button
              variant="ghost"
              className="rounded-full font-sans gap-1"
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button
              className="rounded-full px-6 font-sans gap-1"
              onClick={handleNext}
              disabled={!canNext || bookMutation.isPending}
            >
              {step === 3
                ? bookMutation.isPending
                  ? "Booking…"
                  : "Confirm Booking"
                : "Next"}
              {step < 3 && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
