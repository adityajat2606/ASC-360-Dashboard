import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchPayments } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

export default function PaymentsPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["payments", page],
    queryFn: () => fetchPayments(page),
  });

  const list = Array.isArray(data) ? data : data?.results ?? [];
  const count = data?.count ?? 0;
  const links = data?.links ?? {};
  const hasNext = !!links.next;
  const hasPrev = !!links.previous;

  return (
    <div className="space-y-4">
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search" className="pl-9 bg-card" />
      </div>

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 font-semibold">Transaction ID</th>
              <th className="text-left py-3 px-4 font-semibold">Gateway</th>
              <th className="text-left py-3 px-4 font-semibold">Method</th>
              <th className="text-left py-3 px-4 font-semibold">Currency</th>
              <th className="text-right py-3 px-4 font-semibold">Total Amount</th>
              <th className="text-center py-3 px-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground">Loading…</td>
              </tr>
            ) : (
              list.map((p: Record<string, unknown>, i: number) => (
                <tr key={p.transaction_id ?? i} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-4">{String(p.transaction_id ?? p.transaction_number ?? "—")}</td>
                  <td className="py-3 px-4">{String(p.gateway ?? "ASC360 WALLET")}</td>
                  <td className="py-3 px-4">{String(p.method ?? "WALLET")}</td>
                  <td className="py-3 px-4">{String(p.currency ?? "INR")}</td>
                  <td className="py-3 px-4 text-right">{p.total_amount ?? p.amount ?? "—"}</td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success">
                      {String(p.status ?? "Success")}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!isLoading && (hasPrev || hasNext || count > 0) && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {count > 0 ? `${count} payment${count !== 1 ? "s" : ""} total` : "No payments"}
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
