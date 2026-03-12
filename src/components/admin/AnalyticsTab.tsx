import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useBookingStore, type SharedBooking } from "@/stores/bookingStore";
import { useAdminStore } from "@/stores/adminStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  CalendarCheck,
  IndianRupee,
  TrendingUp,
  Clock,
  Crown,
  Users,
} from "lucide-react";

const CHART_COLORS = [
  "hsl(0, 80%, 45%)",
  "hsl(42, 90%, 55%)",
  "hsl(0, 60%, 75%)",
  "hsl(0, 3%, 46%)",
  "hsl(0, 70%, 65%)",
  "hsl(200, 60%, 50%)",
];

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <Card>
      <CardContent className="p-5 flex items-start gap-4">
        <div className="rounded-xl bg-primary/10 p-3">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold font-serif leading-tight">{value}</p>
          {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsTab() {
  const bookings = useBookingStore((s) => s.bookings);
  const stylists = useAdminStore((s) => s.stylists);

  const analytics = useMemo(() => {
    const completed = bookings.filter((b) => b.status === "completed");
    const active = bookings.filter((b) => b.status !== "cancelled");

    // Total revenue from completed bookings
    const totalRevenue = completed.reduce((sum, b) => sum + b.price, 0);

    // Daily revenue (group by date)
    const revenueByDate: Record<string, number> = {};
    completed.forEach((b) => {
      revenueByDate[b.date] = (revenueByDate[b.date] || 0) + b.price;
    });
    const dailyRevenue = Object.entries(revenueByDate)
      .map(([date, revenue]) => ({
        date: new Date(date).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
        revenue,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Most popular service
    const serviceCounts: Record<string, number> = {};
    active.forEach((b) => {
      serviceCounts[b.serviceName] = (serviceCounts[b.serviceName] || 0) + 1;
    });
    const popularServices = Object.entries(serviceCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    const topService = popularServices[0];

    // Peak hours
    const hourCounts: Record<string, number> = {};
    active.forEach((b) => {
      const hour = b.time.split(":")[0];
      const label = `${hour}:00`;
      hourCounts[label] = (hourCounts[label] || 0) + 1;
    });
    const peakHours = Object.entries(hourCounts)
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour.localeCompare(b.hour));
    const peakHour = peakHours.sort((a, b) => b.count - a.count)[0];

    // Staff performance
    const staffStats: Record<string, { bookings: number; revenue: number; completed: number }> = {};
    active.forEach((b) => {
      if (!staffStats[b.stylistName]) {
        staffStats[b.stylistName] = { bookings: 0, revenue: 0, completed: 0 };
      }
      staffStats[b.stylistName].bookings += 1;
      if (b.status === "completed") {
        staffStats[b.stylistName].revenue += b.price;
        staffStats[b.stylistName].completed += 1;
      }
    });
    const staffPerformance = Object.entries(staffStats)
      .map(([name, stats]) => ({ name, ...stats }))
      .sort((a, b) => b.revenue - a.revenue);

    // Avg revenue per day
    const avgDailyRevenue = dailyRevenue.length
      ? Math.round(totalRevenue / dailyRevenue.length)
      : 0;

    return {
      totalBookings: bookings.length,
      activeBookings: active.length,
      totalRevenue,
      avgDailyRevenue,
      dailyRevenue,
      popularServices,
      topService,
      peakHours: peakHours.sort((a, b) => a.hour.localeCompare(b.hour)),
      peakHour,
      staffPerformance,
    };
  }, [bookings]);

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          icon={CalendarCheck}
          label="Total Bookings"
          value={String(analytics.totalBookings)}
          sub={`${analytics.activeBookings} active`}
        />
        <KpiCard
          icon={IndianRupee}
          label="Total Revenue"
          value={`₹${analytics.totalRevenue.toLocaleString("en-IN")}`}
          sub={`~₹${analytics.avgDailyRevenue.toLocaleString("en-IN")} avg/day`}
        />
        <KpiCard
          icon={Crown}
          label="Most Popular Service"
          value={analytics.topService?.name || "—"}
          sub={analytics.topService ? `${analytics.topService.count} bookings` : undefined}
        />
        <KpiCard
          icon={Clock}
          label="Peak Hour"
          value={analytics.peakHour?.hour || "—"}
          sub={analytics.peakHour ? `${analytics.peakHour.count} bookings` : undefined}
        />
        <KpiCard
          icon={Users}
          label="Active Staff"
          value={String(analytics.staffPerformance.length)}
          sub={`of ${stylists.length} total`}
        />
        <KpiCard
          icon={TrendingUp}
          label="Avg Booking Value"
          value={
            analytics.activeBookings
              ? `₹${Math.round(analytics.totalRevenue / (analytics.staffPerformance.reduce((s, p) => s + p.completed, 0) || 1)).toLocaleString("en-IN")}`
              : "—"
          }
          sub="per completed booking"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Revenue Chart */}
        <Card>
          <CardContent className="p-5">
            <h3 className="font-serif text-lg font-semibold mb-4">Daily Revenue</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.dailyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip
                    formatter={(value: number) => [`₹${value.toLocaleString("en-IN")}`, "Revenue"]}
                    contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(var(--border))" }}
                  />
                  <Bar dataKey="revenue" fill="hsl(0, 80%, 45%)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Popular Services Pie */}
        <Card>
          <CardContent className="p-5">
            <h3 className="font-serif text-lg font-semibold mb-4">Popular Services</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.popularServices.slice(0, 6)}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label={({ name, percent }) =>
                      `${name.length > 12 ? name.slice(0, 12) + "…" : name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {analytics.popularServices.slice(0, 6).map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Peak Hours Chart */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-serif text-lg font-semibold mb-4">Peak Hours</h3>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.peakHours}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <Tooltip
                  formatter={(value: number) => [`${value} bookings`, "Count"]}
                  contentStyle={{ borderRadius: "0.75rem", border: "1px solid hsl(var(--border))" }}
                />
                <Bar dataKey="count" fill="hsl(42, 90%, 55%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Staff Performance Table */}
      <Card>
        <CardContent className="p-5">
          <h3 className="font-serif text-lg font-semibold mb-4">Staff Performance</h3>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">#</th>
                  <th className="text-left p-3 font-medium">Staff Member</th>
                  <th className="text-right p-3 font-medium">Bookings</th>
                  <th className="text-right p-3 font-medium">Completed</th>
                  <th className="text-right p-3 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.staffPerformance.map((staff, i) => (
                  <tr
                    key={staff.name}
                    className="border-t border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-3 text-muted-foreground">{i + 1}</td>
                    <td className="p-3 font-medium flex items-center gap-2">
                      {i === 0 && <Crown className="w-4 h-4 text-gold" />}
                      {staff.name}
                    </td>
                    <td className="p-3 text-right">{staff.bookings}</td>
                    <td className="p-3 text-right">{staff.completed}</td>
                    <td className="p-3 text-right font-semibold text-primary">
                      ₹{staff.revenue.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
