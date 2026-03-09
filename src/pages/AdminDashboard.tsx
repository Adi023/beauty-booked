import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "@/stores/adminStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, LogOut, Check, X, CheckCircle2, Clock, Ban } from "lucide-react";
import { toast } from "sonner";
import type { Service, Stylist, ServiceCategory } from "@/types/salon";
import logoMs from "@/assets/logo-ms.png";
import { Link } from "react-router-dom";

const CATEGORIES: ServiceCategory[] = [
  "hair",
  "nails",
  "skin",
  "makeup",
  "package",
];

function ServiceForm({
  service,
  onSave,
  onClose,
}: {
  service?: Service;
  onSave: (s: Service) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Service, "id">>({
    name: service?.name || "",
    description: service?.description || "",
    duration: service?.duration || 30,
    price: service?.price || 0,
    category: service?.category || "hair",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: service?.id || crypto.randomUUID(), ...form });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Service Name</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Duration (min)</Label>
          <Input
            type="number"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: +e.target.value })}
            min={5}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Price (₹)</Label>
          <Input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: +e.target.value })}
            min={0}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={form.category}
          onValueChange={(v) =>
            setForm({ ...form, category: v as ServiceCategory })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c} className="capitalize">
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{service ? "Update" : "Add"} Service</Button>
      </div>
    </form>
  );
}

function StylistForm({
  stylist,
  onSave,
  onClose,
}: {
  stylist?: Stylist;
  onSave: (s: Stylist) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: stylist?.name || "",
    title: stylist?.title || "",
    avatar: stylist?.avatar || "",
    rating: stylist?.rating || 5.0,
    reviewCount: stylist?.reviewCount || 0,
    specialties: stylist?.specialties || (["hair"] as ServiceCategory[]),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: stylist?.id || crypto.randomUUID(), ...form });
    onClose();
  };

  const toggleSpecialty = (cat: ServiceCategory) => {
    setForm((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(cat)
        ? prev.specialties.filter((s) => s !== cat)
        : [...prev.specialties, cat],
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Name</Label>
        <Input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div className="space-y-2">
        <Label>Title / Role</Label>
        <Input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Rating</Label>
          <Input
            type="number"
            step="0.1"
            value={form.rating}
            onChange={(e) => setForm({ ...form, rating: +e.target.value })}
            min={0}
            max={5}
          />
        </div>
        <div className="space-y-2">
          <Label>Reviews</Label>
          <Input
            type="number"
            value={form.reviewCount}
            onChange={(e) => setForm({ ...form, reviewCount: +e.target.value })}
            min={0}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Specialties</Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Button
              key={c}
              type="button"
              size="sm"
              variant={form.specialties.includes(c) ? "default" : "outline"}
              className="capitalize rounded-full text-xs"
              onClick={() => toggleSpecialty(c)}
            >
              {c}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{stylist ? "Update" : "Add"} Expert</Button>
      </div>
    </form>
  );
}

export default function AdminDashboard() {
  const {
    isAuthenticated,
    services,
    stylists,
    bookings,
    addService,
    updateService,
    deleteService,
    addStylist,
    updateStylist,
    deleteStylist,
    confirmBooking,
    cancelBooking: adminCancelBooking,
    completeBooking,
    logout,
  } = useAdminStore();
  const navigate = useNavigate();
  const [editService, setEditService] = useState<Service | undefined>();
  const [editStylist, setEditStylist] = useState<Stylist | undefined>();
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [stylistDialogOpen, setStylistDialogOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  const handleSaveService = (s: Service) => {
    if (editService) {
      updateService(s.id, s);
      toast.success("Service updated");
    } else {
      addService(s);
      toast.success("Service added");
    }
    setEditService(undefined);
  };

  const handleSaveStylist = (s: Stylist) => {
    if (editStylist) {
      updateStylist(s.id, s);
      toast.success("Expert updated");
    } else {
      addStylist(s);
      toast.success("Expert added");
    }
    setEditStylist(undefined);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img
              src={logoMs}
              alt="MS Salon"
              className="w-8 h-8 rounded-lg object-cover"
            />
            <div>
              <h1 className="font-serif text-lg font-semibold leading-tight">
                Admin Panel
              </h1>
              <p className="text-xs text-muted-foreground">
                MS Salon & Academy
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-sm text-destructive"
              onClick={() => {
                logout();
                navigate("/admin/login");
              }}
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <Tabs defaultValue="bookings">
          <TabsList className="mb-6">
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="services">Services & Rates</TabsTrigger>
            <TabsTrigger value="experts">Experts</TabsTrigger>
          </TabsList>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <div className="mb-4">
              <h2 className="font-serif text-xl font-semibold">
                Bookings ({bookings.length})
              </h2>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Customer</th>
                      <th className="text-left p-3 font-medium hidden sm:table-cell">Service</th>
                      <th className="text-left p-3 font-medium hidden md:table-cell">Expert</th>
                      <th className="text-left p-3 font-medium">Date & Time</th>
                      <th className="text-right p-3 font-medium">Price</th>
                      <th className="text-center p-3 font-medium">Status</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr
                        key={b.id}
                        className="border-t border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3">
                          <div className="font-medium">{b.customerName}</div>
                          <div className="text-xs text-muted-foreground">{b.customerPhone}</div>
                        </td>
                        <td className="p-3 hidden sm:table-cell">
                          <div>{b.serviceName}</div>
                          <div className="text-xs text-muted-foreground">{b.duration}min</div>
                        </td>
                        <td className="p-3 hidden md:table-cell">{b.stylistName}</td>
                        <td className="p-3">
                          <div>{b.date}</div>
                          <div className="text-xs text-muted-foreground">{b.time}</div>
                        </td>
                        <td className="p-3 text-right font-semibold text-primary">₹{b.price}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${
                              b.status === "confirmed"
                                ? "bg-green-500/10 text-green-600"
                                : b.status === "pending"
                                ? "bg-yellow-500/10 text-yellow-600"
                                : b.status === "completed"
                                ? "bg-blue-500/10 text-blue-600"
                                : "bg-destructive/10 text-destructive"
                            }`}
                          >
                            {b.status === "confirmed" && <CheckCircle2 className="w-3 h-3" />}
                            {b.status === "pending" && <Clock className="w-3 h-3" />}
                            {b.status === "completed" && <Check className="w-3 h-3" />}
                            {b.status === "cancelled" && <Ban className="w-3 h-3" />}
                            <span className="capitalize">{b.status}</span>
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {b.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-600"
                                  title="Confirm"
                                  onClick={() => {
                                    confirmBooking(b.id);
                                    toast.success("Booking confirmed");
                                  }}
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  title="Cancel"
                                  onClick={() => {
                                    adminCancelBooking(b.id);
                                    toast.success("Booking cancelled");
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                            {b.status === "confirmed" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-blue-600"
                                  title="Mark Completed"
                                  onClick={() => {
                                    completeBooking(b.id);
                                    toast.success("Booking marked as completed");
                                  }}
                                >
                                  <CheckCircle2 className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  title="Cancel"
                                  onClick={() => {
                                    adminCancelBooking(b.id);
                                    toast.success("Booking cancelled");
                                  }}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-semibold">
                Services ({services.length})
              </h2>
              <Dialog
                open={serviceDialogOpen}
                onOpenChange={(o) => {
                  setServiceDialogOpen(o);
                  if (!o) setEditService(undefined);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="gap-1 rounded-lg"
                    onClick={() => setEditService(undefined)}
                  >
                    <Plus className="w-4 h-4" /> Add Service
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editService ? "Edit" : "Add"} Service
                    </DialogTitle>
                  </DialogHeader>
                  <ServiceForm
                    service={editService}
                    onSave={handleSaveService}
                    onClose={() => setServiceDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Service</th>
                      <th className="text-left p-3 font-medium hidden sm:table-cell">
                        Category
                      </th>
                      <th className="text-right p-3 font-medium">Duration</th>
                      <th className="text-right p-3 font-medium">Price</th>
                      <th className="text-right p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s) => (
                      <tr
                        key={s.id}
                        className="border-t border-border hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-3">
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {s.description}
                          </div>
                        </td>
                        <td className="p-3 capitalize hidden sm:table-cell">
                          {s.category}
                        </td>
                        <td className="p-3 text-right">{s.duration}m</td>
                        <td className="p-3 text-right font-semibold text-primary">
                          ₹{s.price}
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => {
                                setEditService(s);
                                setServiceDialogOpen(true);
                              }}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => {
                                deleteService(s.id);
                                toast.success("Service deleted");
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Experts Tab */}
          <TabsContent value="experts">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-semibold">
                Experts ({stylists.length})
              </h2>
              <Dialog
                open={stylistDialogOpen}
                onOpenChange={(o) => {
                  setStylistDialogOpen(o);
                  if (!o) setEditStylist(undefined);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="gap-1 rounded-lg"
                    onClick={() => setEditStylist(undefined)}
                  >
                    <Plus className="w-4 h-4" /> Add Expert
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      {editStylist ? "Edit" : "Add"} Expert
                    </DialogTitle>
                  </DialogHeader>
                  <StylistForm
                    stylist={editStylist}
                    onSave={handleSaveStylist}
                    onClose={() => setStylistDialogOpen(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stylists.map((s) => (
                <div
                  key={s.id}
                  className="bg-card border border-border rounded-xl p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-serif font-semibold text-lg">
                        {s.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{s.title}</p>
                      <div className="flex gap-1.5 mt-2">
                        {s.specialties.map((sp) => (
                          <span
                            key={sp}
                            className="text-xs px-2 py-0.5 bg-accent text-accent-foreground rounded-full capitalize"
                          >
                            {sp}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        ⭐ {s.rating} · {s.reviewCount} reviews
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setEditStylist(s);
                          setStylistDialogOpen(true);
                        }}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => {
                          deleteStylist(s.id);
                          toast.success("Expert removed");
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
