import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTripStatus, fetchAssignPlans, fetchPayments, fetchWallet, normalizeAssignPlans } from "@/lib/api";
import { Search, SlidersHorizontal, CheckCircle, Star, Clock, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import WalletCard from "@/components/WalletCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

export default function DashboardPage() {
  const domestic = useQuery({ queryKey: ["trip-domestic"], queryFn: () => fetchTripStatus("Domestic") });
  const international = useQuery({ queryKey: ["trip-intl"], queryFn: () => fetchTripStatus("International") });
  const plans = useQuery({ queryKey: ["plans"], queryFn: fetchAssignPlans });
  const payments = useQuery({ queryKey: ["payments", 1], queryFn: () => fetchPayments(1) });
  const wallet = useQuery({ queryKey: ["wallet"], queryFn: fetchWallet });

  // Normalize trip-status API response: { active, inactive, matured, pending } -> chart keys
  const normalizeTripStatus = (raw: Record<string, unknown> | null | undefined) => {
    if (!raw) return {};
    return {
      Active: Number(raw.active ?? raw.Active ?? 0),
      "Yet to Active": Number(raw.inactive ?? raw["Yet to Active"] ?? 0),
      Matured: Number(raw.matured ?? raw.Matured ?? 0),
      Pending: Number(raw.pending ?? raw.Pending ?? 0),
    };
  };

  const statuses = ["Active", "Yet to Active", "Matured", "Pending"];
  const domData = normalizeTripStatus(domestic.data);
  const intlData = normalizeTripStatus(international.data);

  const chartData = statuses.map((s) => ({
    name: s,
    Domestic: domData[s] ?? 0,
    International: intlData[s] ?? 0,
  }));

  const makeStatusCards = (data: Record<string, number>) => [
    { label: "Active", value: data["Active"] ?? 0, icon: CheckCircle, color: "text-success" },
    { label: "Yet to Active", value: data["Yet to Active"] ?? 0, icon: Star, color: "text-warning" },
    { label: "Matured", value: data["Matured"] ?? 0, icon: Clock, color: "text-primary" },
    { label: "Pending", value: data["Pending"] ?? 0, icon: Loader2, color: "text-destructive" },
  ];
  const domesticStatusCards = makeStatusCards(domData);
  const internationalStatusCards = makeStatusCards(intlData);

  const walletBalance = wallet.data?.balance ?? wallet.data?.available_balance ?? 0;
  const plansList = normalizeAssignPlans(plans.data);
  const paymentsList = Array.isArray(payments.data) ? payments.data : payments.data?.results ?? [];

  return (
    <div className="space-y-6">
      {/* Top row: search + wallet */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input placeholder="Search Covers" className="w-64 bg-card" />
          </div>
          <button className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium">
            Clear Search
          </button>
        </div>
        <WalletCard balance={walletBalance} />
      </div>

      {/* Chart + Status Cards */}
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-8 bg-card rounded-lg border border-border p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <Input placeholder="Search Covers" className="w-48" />
            </div>
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex items-center gap-4 justify-center mb-2">
            <span className="flex items-center gap-1 text-xs">
              <span className="w-3 h-3 rounded-sm bg-primary inline-block" /> Domestic
            </span>
            <span className="flex items-center gap-1 text-xs">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ background: "hsl(200 80% 50%)" }} /> International
            </span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="Domestic" fill="hsl(25 95% 53%)" radius={[4, 4, 0, 0]} barSize={40}>
                {chartData.map((_, i) => (
                  <Cell key={i} />
                ))}
              </Bar>
              <Bar dataKey="International" fill="hsl(200 80% 50%)" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center text-xs text-muted-foreground mt-2">Policy Status</p>
        </div>

        <div className="col-span-4 space-y-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Domestic</p>
            <div className="grid grid-cols-2 gap-4">
              {domesticStatusCards.map((card) => (
                <div key={`dom-${card.label}`} className="bg-card rounded-lg border border-border p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{card.label}</span>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <p className="text-3xl font-bold text-foreground mt-4">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">International</p>
            <div className="grid grid-cols-2 gap-4">
              {internationalStatusCards.map((card) => (
                <div key={`intl-${card.label}`} className="bg-card rounded-lg border border-border p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{card.label}</span>
                    <card.icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <p className="text-3xl font-bold text-foreground mt-4">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Plans + Payment History */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Active Plans</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium">#</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Plan Title</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Scope</th>
              </tr>
            </thead>
            <tbody>
              {plansList.slice(0, 5).map((plan, i) => (
                <tr key={plan.id} className="border-b border-border last:border-0">
                  <td className="py-2">{i + 1}</td>
                  <td className="py-2">{plan.title || "—"}</td>
                  <td className="py-2">{plan.cover_scope || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/assign-covers" className="text-primary text-sm mt-2 hover:underline inline-block">View all</Link>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <h3 className="font-semibold text-foreground mb-4">Payment History</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium">#</th>
                <th className="text-left py-2 text-muted-foreground font-medium">Transaction ID</th>
                <th className="text-right py-2 text-muted-foreground font-medium">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {paymentsList.slice(0, 5).map((p: any, i: number) => (
                <tr key={i} className="border-b border-border last:border-0">
                  <td className="py-2">{i + 1}</td>
                  <td className="py-2">{p.transaction_id || p.transaction_number || "—"}</td>
                  <td className="py-2 text-right">{p.total_amount || p.amount || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/payments" className="text-primary text-sm mt-2 hover:underline inline-block">View all</Link>
        </div>
      </div>
    </div>
  );
}
