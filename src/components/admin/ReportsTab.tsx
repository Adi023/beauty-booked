import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookingStore } from "@/stores/bookingStore";
import { useAdminStore } from "@/stores/adminStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, IndianRupee, Receipt, Users, Calendar } from "lucide-react";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth } from "date-fns";

const GST_RATE = 0.18;
const COMMISSION_RATE = 0.15; // 15% default commission

function downloadCSV(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ───── Daily Sales ───── */
function DailySalesReport() {
  const bookings = useBookingStore((s) => s.bookings);
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );

  const dailyData = useMemo(() => {
    const completed = bookings.filter(
      (b) => b.status === "completed" && b.date === selectedDate
    );
    const totalRevenue = completed.reduce((sum, b) => sum + b.price, 0);
    return { completed, totalRevenue, count: completed.length };
  }, [bookings, selectedDate]);

  const uniqueDates = useMemo(() => {
    const dates = [...new Set(bookings.map((b) => b.date))].sort().reverse();
    return dates;
  }, [bookings]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {uniqueDates.map((d) => (
                <SelectItem key={d} value={d}>
                  {format(parseISO(d), "dd MMM yyyy")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            downloadCSV(
              `daily-sales-${selectedDate}.csv`,
              ["Customer", "Service", "Stylist", "Time", "Amount"],
              dailyData.completed.map((b) => [
                b.customerName,
                b.serviceName,
                b.stylistName,
                b.time,
                String(b.price),
              ])
            )
          }
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Completed Services</p>
            <p className="text-3xl font-bold font-serif">{dailyData.count}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Sales</p>
            <p className="text-3xl font-bold font-serif text-primary">
              ₹{dailyData.totalRevenue.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Customer</th>
              <th className="text-left p-3 font-medium">Service</th>
              <th className="text-left p-3 font-medium hidden sm:table-cell">Stylist</th>
              <th className="text-left p-3 font-medium">Time</th>
              <th className="text-right p-3 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {dailyData.completed.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No completed services on this date.
                </td>
              </tr>
            ) : (
              dailyData.completed.map((b) => (
                <tr key={b.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{b.customerName}</td>
                  <td className="p-3">{b.serviceName}</td>
                  <td className="p-3 hidden sm:table-cell">{b.stylistName}</td>
                  <td className="p-3">{b.time}</td>
                  <td className="p-3 text-right font-semibold text-primary">
                    ₹{b.price.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {dailyData.completed.length > 0 && (
            <tfoot className="bg-muted/30">
              <tr className="border-t border-border font-semibold">
                <td colSpan={4} className="p-3 text-right">Total</td>
                <td className="p-3 text-right text-primary">
                  ₹{dailyData.totalRevenue.toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

/* ───── Monthly Revenue ───── */
function MonthlyRevenueReport() {
  const bookings = useBookingStore((s) => s.bookings);

  const months = useMemo(() => {
    const monthSet = new Set<string>();
    bookings.forEach((b) => monthSet.add(b.date.slice(0, 7)));
    return [...monthSet].sort().reverse();
  }, [bookings]);

  const [selectedMonth, setSelectedMonth] = useState(months[0] || format(new Date(), "yyyy-MM"));

  const monthlyData = useMemo(() => {
    const filtered = bookings.filter(
      (b) => b.status === "completed" && b.date.startsWith(selectedMonth)
    );
    const totalRevenue = filtered.reduce((sum, b) => sum + b.price, 0);

    // Group by date
    const byDate: Record<string, { count: number; revenue: number }> = {};
    filtered.forEach((b) => {
      if (!byDate[b.date]) byDate[b.date] = { count: 0, revenue: 0 };
      byDate[b.date].count += 1;
      byDate[b.date].revenue += b.price;
    });
    const dailyBreakdown = Object.entries(byDate)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return { filtered, totalRevenue, count: filtered.length, dailyBreakdown };
  }, [bookings, selectedMonth]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {format(parseISO(`${m}-01`), "MMMM yyyy")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            downloadCSV(
              `monthly-revenue-${selectedMonth}.csv`,
              ["Date", "Services", "Revenue"],
              monthlyData.dailyBreakdown.map((d) => [
                d.date,
                String(d.count),
                String(d.revenue),
              ])
            )
          }
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-bold font-serif text-primary">
              ₹{monthlyData.totalRevenue.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Services Done</p>
            <p className="text-2xl font-bold font-serif">{monthlyData.count}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Avg Daily</p>
            <p className="text-2xl font-bold font-serif">
              ₹{monthlyData.dailyBreakdown.length ? Math.round(monthlyData.totalRevenue / monthlyData.dailyBreakdown.length).toLocaleString("en-IN") : 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Date</th>
              <th className="text-right p-3 font-medium">Services</th>
              <th className="text-right p-3 font-medium">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.dailyBreakdown.length === 0 ? (
              <tr>
                <td colSpan={3} className="p-6 text-center text-muted-foreground">
                  No completed services this month.
                </td>
              </tr>
            ) : (
              monthlyData.dailyBreakdown.map((d) => (
                <tr key={d.date} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{format(parseISO(d.date), "dd MMM yyyy")}</td>
                  <td className="p-3 text-right">{d.count}</td>
                  <td className="p-3 text-right font-semibold text-primary">
                    ₹{d.revenue.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {monthlyData.dailyBreakdown.length > 0 && (
            <tfoot className="bg-muted/30">
              <tr className="border-t border-border font-semibold">
                <td className="p-3">Total</td>
                <td className="p-3 text-right">{monthlyData.count}</td>
                <td className="p-3 text-right text-primary">
                  ₹{monthlyData.totalRevenue.toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

/* ───── GST Report ───── */
function GSTReport() {
  const bookings = useBookingStore((s) => s.bookings);

  const months = useMemo(() => {
    const monthSet = new Set<string>();
    bookings.forEach((b) => monthSet.add(b.date.slice(0, 7)));
    return [...monthSet].sort().reverse();
  }, [bookings]);

  const [selectedMonth, setSelectedMonth] = useState(months[0] || format(new Date(), "yyyy-MM"));

  const gstData = useMemo(() => {
    const completed = bookings.filter(
      (b) => b.status === "completed" && b.date.startsWith(selectedMonth)
    );
    const totalWithGST = completed.reduce((sum, b) => sum + b.price, 0);
    const baseAmount = Math.round(totalWithGST / (1 + GST_RATE));
    const cgst = Math.round((baseAmount * GST_RATE) / 2);
    const sgst = cgst;
    const totalGST = cgst + sgst;

    // Per-service breakdown
    const serviceMap: Record<string, { count: number; total: number }> = {};
    completed.forEach((b) => {
      if (!serviceMap[b.serviceName]) serviceMap[b.serviceName] = { count: 0, total: 0 };
      serviceMap[b.serviceName].count += 1;
      serviceMap[b.serviceName].total += b.price;
    });
    const serviceBreakdown = Object.entries(serviceMap)
      .map(([name, data]) => {
        const base = Math.round(data.total / (1 + GST_RATE));
        const gst = data.total - base;
        return { name, ...data, base, gst };
      })
      .sort((a, b) => b.total - a.total);

    return { totalWithGST, baseAmount, cgst, sgst, totalGST, serviceBreakdown, count: completed.length };
  }, [bookings, selectedMonth]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {format(parseISO(`${m}-01`), "MMMM yyyy")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            downloadCSV(
              `gst-report-${selectedMonth}.csv`,
              ["Service", "Count", "Gross Amount", "Base Amount", "GST (18%)"],
              gstData.serviceBreakdown.map((s) => [
                s.name,
                String(s.count),
                String(s.total),
                String(s.base),
                String(s.gst),
              ])
            )
          }
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Gross Revenue</p>
            <p className="text-xl font-bold font-serif">₹{gstData.totalWithGST.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">Base Amount</p>
            <p className="text-xl font-bold font-serif">₹{gstData.baseAmount.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">CGST (9%)</p>
            <p className="text-xl font-bold font-serif text-primary">₹{gstData.cgst.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">SGST (9%)</p>
            <p className="text-xl font-bold font-serif text-primary">₹{gstData.sgst.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">Service</th>
              <th className="text-right p-3 font-medium">Count</th>
              <th className="text-right p-3 font-medium">Gross</th>
              <th className="text-right p-3 font-medium">Base</th>
              <th className="text-right p-3 font-medium">GST (18%)</th>
            </tr>
          </thead>
          <tbody>
            {gstData.serviceBreakdown.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No completed services this month.
                </td>
              </tr>
            ) : (
              gstData.serviceBreakdown.map((s) => (
                <tr key={s.name} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3 text-right">{s.count}</td>
                  <td className="p-3 text-right">₹{s.total.toLocaleString("en-IN")}</td>
                  <td className="p-3 text-right">₹{s.base.toLocaleString("en-IN")}</td>
                  <td className="p-3 text-right font-semibold text-primary">₹{s.gst.toLocaleString("en-IN")}</td>
                </tr>
              ))
            )}
          </tbody>
          {gstData.serviceBreakdown.length > 0 && (
            <tfoot className="bg-muted/30">
              <tr className="border-t border-border font-semibold">
                <td className="p-3">Total</td>
                <td className="p-3 text-right">{gstData.count}</td>
                <td className="p-3 text-right">₹{gstData.totalWithGST.toLocaleString("en-IN")}</td>
                <td className="p-3 text-right">₹{gstData.baseAmount.toLocaleString("en-IN")}</td>
                <td className="p-3 text-right text-primary">₹{gstData.totalGST.toLocaleString("en-IN")}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

/* ───── Staff Commission ───── */
function StaffCommissionReport() {
  const bookings = useBookingStore((s) => s.bookings);
  const stylists = useAdminStore((s) => s.stylists);

  const months = useMemo(() => {
    const monthSet = new Set<string>();
    bookings.forEach((b) => monthSet.add(b.date.slice(0, 7)));
    return [...monthSet].sort().reverse();
  }, [bookings]);

  const [selectedMonth, setSelectedMonth] = useState(months[0] || format(new Date(), "yyyy-MM"));

  const commissionData = useMemo(() => {
    const completed = bookings.filter(
      (b) => b.status === "completed" && b.date.startsWith(selectedMonth)
    );

    const staffMap: Record<string, { services: number; revenue: number; commission: number }> = {};
    completed.forEach((b) => {
      if (!staffMap[b.stylistName]) staffMap[b.stylistName] = { services: 0, revenue: 0, commission: 0 };
      staffMap[b.stylistName].services += 1;
      staffMap[b.stylistName].revenue += b.price;
      staffMap[b.stylistName].commission += Math.round(b.price * COMMISSION_RATE);
    });

    const staffList = Object.entries(staffMap)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.revenue - a.revenue);

    const totalCommission = staffList.reduce((sum, s) => sum + s.commission, 0);
    const totalRevenue = staffList.reduce((sum, s) => sum + s.revenue, 0);

    return { staffList, totalCommission, totalRevenue };
  }, [bookings, selectedMonth]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {months.map((m) => (
              <SelectItem key={m} value={m}>
                {format(parseISO(`${m}-01`), "MMMM yyyy")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            downloadCSV(
              `staff-commission-${selectedMonth}.csv`,
              ["Staff", "Services", "Revenue", "Commission (15%)"],
              commissionData.staffList.map((s) => [
                s.name,
                String(s.services),
                String(s.revenue),
                String(s.commission),
              ])
            )
          }
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </Button>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-3 font-medium">#</th>
              <th className="text-left p-3 font-medium">Staff Member</th>
              <th className="text-right p-3 font-medium">Services</th>
              <th className="text-right p-3 font-medium">Revenue</th>
              <th className="text-right p-3 font-medium">Commission (15%)</th>
            </tr>
          </thead>
          <tbody>
            {commissionData.staffList.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No completed services this month.
                </td>
              </tr>
            ) : (
              commissionData.staffList.map((s, i) => (
                <tr key={s.name} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="p-3 text-muted-foreground">{i + 1}</td>
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3 text-right">{s.services}</td>
                  <td className="p-3 text-right">₹{s.revenue.toLocaleString("en-IN")}</td>
                  <td className="p-3 text-right font-semibold text-primary">
                    ₹{s.commission.toLocaleString("en-IN")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {commissionData.staffList.length > 0 && (
            <tfoot className="bg-muted/30">
              <tr className="border-t border-border font-semibold">
                <td colSpan={3} className="p-3 text-right">Total</td>
                <td className="p-3 text-right">₹{commissionData.totalRevenue.toLocaleString("en-IN")}</td>
                <td className="p-3 text-right text-primary">
                  ₹{commissionData.totalCommission.toLocaleString("en-IN")}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

/* ───── Main Reports Tab ───── */
export default function ReportsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-xl font-semibold">Reports & Accounting</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Generate and export financial reports for your salon.
        </p>
      </div>

      <Tabs defaultValue="daily-sales">
        <TabsList className="flex-wrap">
          <TabsTrigger value="daily-sales" className="gap-1.5">
            <Calendar className="w-3.5 h-3.5" /> Daily Sales
          </TabsTrigger>
          <TabsTrigger value="monthly-revenue" className="gap-1.5">
            <IndianRupee className="w-3.5 h-3.5" /> Monthly Revenue
          </TabsTrigger>
          <TabsTrigger value="gst" className="gap-1.5">
            <Receipt className="w-3.5 h-3.5" /> GST Report
          </TabsTrigger>
          <TabsTrigger value="commission" className="gap-1.5">
            <Users className="w-3.5 h-3.5" /> Staff Commission
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily-sales" className="mt-6">
          <DailySalesReport />
        </TabsContent>
        <TabsContent value="monthly-revenue" className="mt-6">
          <MonthlyRevenueReport />
        </TabsContent>
        <TabsContent value="gst" className="mt-6">
          <GSTReport />
        </TabsContent>
        <TabsContent value="commission" className="mt-6">
          <StaffCommissionReport />
        </TabsContent>
      </Tabs>
    </div>
  );
}
