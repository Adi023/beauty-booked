import { useState } from "react";
import { format, addDays } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { SharedBooking } from "@/stores/bookingStore";

const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00",
];

interface RescheduleDialogProps {
  booking: SharedBooking | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (bookingId: string, newDate: string, newTime: string) => void;
}

export default function RescheduleDialog({
  booking,
  open,
  onOpenChange,
  onConfirm,
}: RescheduleDialogProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");

  const handleConfirm = () => {
    if (!booking || !date || !time) return;
    onConfirm(booking.id, format(date, "yyyy-MM-dd"), time);
    setDate(undefined);
    setTime("");
  };

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif">Reschedule Booking</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="rounded-lg bg-muted/50 p-3">
            <p className="font-medium text-sm">{booking.serviceName}</p>
            <p className="text-xs text-muted-foreground">with {booking.stylistName}</p>
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">New Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(d) => d < addDays(new Date(), 1)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Slots */}
          <div>
            <label className="text-sm font-medium mb-1.5 block">
              <Clock className="w-3.5 h-3.5 inline mr-1" />
              New Time
            </label>
            <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
              {TIME_SLOTS.map((slot) => (
                <Button
                  key={slot}
                  variant={time === slot ? "default" : "outline"}
                  size="sm"
                  className="rounded-lg text-xs font-sans"
                  onClick={() => setTime(slot)}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 rounded-full font-sans"
              disabled={!date || !time}
              onClick={handleConfirm}
            >
              Confirm Reschedule
            </Button>
            <Button
              variant="ghost"
              className="rounded-full font-sans"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
