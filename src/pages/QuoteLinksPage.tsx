import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchQuoteLinks } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";

export default function QuoteLinksPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["quote-links", page],
    queryFn: () => fetchQuoteLinks(page),
  });

  const list = Array.isArray(data) ? data : data?.results ?? [];
  const count = data?.count ?? 0;
  const links = data?.links ?? {};
  const hasNext = !!links.next;
  const hasPrev = !!links.previous;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">Quote Links</h2>

      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Search" className="pl-9 bg-card" />
      </div>

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-3 font-semibold whitespace-nowrap">Adventure</th>
              <th className="text-left py-3 px-3 font-semibold whitespace-nowrap">Cover Price</th>
              <th className="text-left py-3 px-3 font-semibold whitespace-nowrap">Name</th>
              <th className="text-left py-3 px-3 font-semibold whitespace-nowrap">Email</th>
              <th className="text-left py-3 px-3 font-semibold whitespace-nowrap">Nationality</th>
              <th className="text-left py-3 px-3 font-semibold whitespace-nowrap">Start Date</th>
              <th className="text-left py-3 px-3 font-semibold whitespace-nowrap">End Date</th>
              <th className="text-left py-3 px-3 font-semibold whitespace-nowrap">Total Pax</th>
              <th className="text-left py-3 px-3 font-semibold whitespace-nowrap">Travel From</th>
              <th className="text-left py-3 px-3 font-semibold whitespace-nowrap">Travel To</th>
              <th className="text-left py-3 px-3 font-semibold whitespace-nowrap">Link Status</th>
              <th className="text-left py-3 px-3 font-semibold whitespace-nowrap">Trip Status</th>
              <th className="text-left py-3 px-3 font-semibold whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={13} className="py-8 text-center text-muted-foreground">Loading…</td>
              </tr>
            ) : (
              list.map((row: Record<string, unknown>) => (
                <tr key={String(row.id)} className="border-b border-border last:border-0 hover:bg-muted/50">
                  <td className="py-3 px-3 max-w-[200px]">{String(row.adventure ?? "—")}</td>
                  <td className="py-3 px-3">{String(row.price ?? "—")}</td>
                  <td className="py-3 px-3">{String(row.name ?? "—")}</td>
                  <td className="py-3 px-3">{String(row.email ?? "—")}</td>
                  <td className="py-3 px-3">{String(row.nationality ?? "—")}</td>
                  <td className="py-3 px-3">{String(row.start_date ?? "—")}</td>
                  <td className="py-3 px-3">{String(row.end_date ?? "—")}</td>
                  <td className="py-3 px-3">{row.num_people ?? "—"}</td>
                  <td className="py-3 px-3">{String(row.travelling_from ?? "—")}</td>
                  <td className="py-3 px-3">{String(row.travelling_to ?? "—")}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-1 rounded text-xs ${row.link_status ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {row.link_status ? "Active" : "Expired"}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary">
                      {String(row.trip_status ?? "pending")}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    {row.unique_link ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs gap-1"
                        asChild
                      >
                        <a href={String(row.unique_link)} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" /> Link
                        </a>
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!isLoading && (hasPrev || hasNext || count > 0) && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              {count > 0 ? `${count} link${count !== 1 ? "s" : ""} total` : "No quote links"}
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
