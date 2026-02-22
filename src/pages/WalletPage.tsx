import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWallet, fetchWalletTransactions, USER_EMAIL } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react";
import WalletCard from "@/components/WalletCard";

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export default function WalletPage() {
  const [page, setPage] = useState(1);

  const { data: walletData } = useQuery({ queryKey: ["wallet"], queryFn: fetchWallet });
  const { data: txData, isLoading } = useQuery({
    queryKey: ["wallet-transactions", page],
    queryFn: () => fetchWalletTransactions(page),
  });

  const walletBalance = walletData?.balance ?? walletData?.available_balance ?? 0;
  const transactions = txData?.results ?? [];
  const count = txData?.count ?? 0;
  const links = txData?.links ?? {};
  const hasNext = !!links.next;
  const hasPrev = !!links.previous;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-muted-foreground">Domestic</p>
          <p className="flex items-center gap-2 text-sm"><Phone className="w-4 h-4" /> 7982859396</p>
          <p className="flex items-center gap-2 text-sm"><Mail className="w-4 h-4" /> {USER_EMAIL}</p>
          <p className="text-sm text-muted-foreground">Operator Code: <span className="text-foreground font-medium">ASC360-OPP-0004</span></p>
        </div>
        <WalletCard balance={walletBalance} />
      </div>

      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search" className="pl-9 bg-card" />
      </div>

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold">Amount</th>
              <th className="text-left py-3 px-4 font-semibold">Transaction number</th>
              <th className="text-left py-3 px-4 font-semibold">Transaction type</th>
              <th className="text-left py-3 px-4 font-semibold">Status</th>
              <th className="text-left py-3 px-4 font-semibold">Created by</th>
              <th className="text-left py-3 px-4 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">Loading…</td>
              </tr>
            ) : (
              transactions.map((t: Record<string, unknown>, i: number) => (
                <tr key={t.transaction_number ?? i} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-4">{t.amount != null ? t.amount : "—"}</td>
                  <td className="py-3 px-4">{String(t.transaction_number ?? t.transaction_id ?? "—")}</td>
                  <td className="py-3 px-4">{String(t.transaction_type ?? "DEDUCT")}</td>
                  <td className="py-3 px-4">{String(t.status ?? "—")}</td>
                  <td className="py-3 px-4">{String(t.created_by ?? "—")}</td>
                  <td className="py-3 px-4">{t.created_at ? formatDate(String(t.created_at)) : "—"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!isLoading && (hasPrev || hasNext || count > 0) && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {count > 0 ? `${count} transaction${count !== 1 ? "s" : ""} total` : "No transactions"}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!hasPrev}
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={!hasNext}
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
