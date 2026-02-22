import { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUserCoverPlanAccess, fetchCoverPricing } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FileSpreadsheet, X, Download, FileText } from "lucide-react";

/** Normalize user-cover-plan-access API response into dropdown options.
 * Supports: { covers: [{ customize_covers: [{ id, title, price, ... }] }] }
 */
function normalizeCoverPlans(data: unknown): { id: number; label: string }[] {
  const raw = data as Record<string, unknown> | null;
  if (!raw) return [];

  const covers = raw.covers;
  if (Array.isArray(covers)) {
    const items: { id: number; label: string }[] = [];
    for (const group of covers) {
      const g = group as Record<string, unknown>;
      const customizeCovers = g.customize_covers;
      if (Array.isArray(customizeCovers)) {
        for (const c of customizeCovers) {
          const o = c as Record<string, unknown>;
          const id = Number(o.id);
          const title = String(o.title ?? o.name ?? "").trim() || "—";
          const price = o.price;
          const label = price != null && price !== "" ? `${title} - ${price} INR` : title;
          if (id && !Number.isNaN(id)) items.push({ id, label });
        }
      }
    }
    return items;
  }

  const arr: unknown[] =
    (raw as { results?: unknown[] })?.results ??
    (raw as { data?: unknown[] })?.data ??
    (raw as { customize_covers?: unknown[] })?.customize_covers ??
    [];
  return arr
    .map((item: unknown) => {
      const o = item as Record<string, unknown>;
      const nested = o.customize_cover ?? o.cover ?? o.plan;
      const nestedObj = nested && typeof nested === "object" ? (nested as Record<string, unknown>) : null;
      const id = Number(
        o.customize_cover_id ?? o.cover_id ?? o.id ?? nestedObj?.id ?? nestedObj?.customize_cover_id
      );
      const name =
        String(
          o.name ??
            o.plan_name ??
            o.cover_name ??
            o.title ??
            o.plan_title ??
            nestedObj?.name ??
            nestedObj?.plan_name ??
            nestedObj?.title ??
            ""
        ).trim() || "—";
      const price = o.base_price ?? o.price ?? o.cover_price ?? nestedObj?.base_price ?? nestedObj?.price;
      const label = price != null && price !== "" ? `${name} - ${price} INR` : name;
      return { id, label };
    })
    .filter((x) => x.id && !Number.isNaN(x.id));
}

type PricingOption = { code: string; price: number };
type DurationRow = { days: number; optionsByType: Record<string, PricingOption> };

/**
 * Parse pricing API response: flat array of { id, duration, price, type }.
 * Returns rows by duration, with options keyed by type (Option1, Option2, ...).
 * Code format: "ASC" + id (e.g. ASC374).
 */
function parsePricingData(data: unknown): {
  rows: DurationRow[];
  optionTypes: string[];
} {
  const arr = Array.isArray(data) ? data : (data as { results?: unknown[] })?.results ?? [];
  const byDuration = new Map<number, Record<string, PricingOption>>();
  const typeSet = new Set<string>();

  for (const item of arr) {
    const raw = item as Record<string, unknown>;
    const duration = Number(raw.duration ?? raw.duration_days ?? raw.days ?? 0);
    const id = raw.id;
    const price = Number(raw.price ?? raw.amount ?? 0);
    const type = String(raw.type ?? "Option1").trim() || "Option1";

    if (!duration) continue;

    typeSet.add(type);
    const code = id != null ? `ASC${id}` : "";
    const opt: PricingOption = { code, price };

    if (!byDuration.has(duration)) byDuration.set(duration, {});
    byDuration.get(duration)![type] = opt;
  }

  const optionTypes = Array.from(typeSet).sort();
  const sortedDurations = Array.from(byDuration.keys()).sort((a, b) => a - b);
  const rows: DurationRow[] = sortedDurations.map((days) => ({
    days,
    optionsByType: byDuration.get(days) ?? {},
  }));

  return { rows, optionTypes };
}

export default function BulkIssuancePage() {
  const [selectedCoverId, setSelectedCoverId] = useState<string>("");
  const [selectedCoverLabel, setSelectedCoverLabel] = useState<string>("");
  const [emailPref, setEmailPref] = useState<"customer" | "operator">("customer");
  const [selectedPricing, setSelectedPricing] = useState<Record<number, string>>({});
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const { data: coversData, isLoading: coversLoading, error: coversError } = useQuery({
    queryKey: ["user-cover-plan-access", "bulk"],
    queryFn: () => fetchUserCoverPlanAccess("bulk"),
    refetchOnMount: "always",
  });

  const coverOptions = normalizeCoverPlans(coversData);

  const { data: pricingData, isLoading: pricingLoading } = useQuery({
    queryKey: ["cover-pricing", selectedCoverId],
    queryFn: () => fetchCoverPricing(Number(selectedCoverId)),
    enabled: !!selectedCoverId,
  });

  const { rows: pricingRows, optionTypes } = parsePricingData(pricingData);
  const optionTypesList = optionTypes.length > 0 ? optionTypes : ["Option1"];

  const handleCoverSelect = (value: string) => {
    const opt = coverOptions.find((o) => String(o.id) === value);
    setSelectedCoverId(value);
    setSelectedCoverLabel(opt?.label ?? "");
    setSelectedPricing({});
  };

  const handleClearCover = () => {
    setSelectedCoverId("");
    setSelectedCoverLabel("");
    setSelectedPricing({});
  };

  const handlePricingSelect = (days: number, optionType: string) => {
    setSelectedPricing((prev) => ({ ...prev, [days]: optionType }));
  };

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".csv")) setCsvFile(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith(".csv")) setCsvFile(file);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDownloadSample = () => {
    const csv = "name,email,phone,dob\nSample,test@example.com,9999999999,1990-01-01";
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bulk-issuance-sample.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Choose Cover */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Choose Cover</h2>
        {coversError && (
          <p className="text-sm text-destructive">Failed to load covers. Check console for details.</p>
        )}
        <div className="flex gap-2 items-center">
          <Select
            value={selectedCoverId || undefined}
            onValueChange={handleCoverSelect}
            disabled={coversLoading}
          >
            <SelectTrigger className="flex-1 max-w-md">
              <SelectValue placeholder={coversLoading ? "Loading…" : "Select Cover Plan"} />
            </SelectTrigger>
            <SelectContent position="popper" className="z-[100]">
              {coverOptions.length === 0 ? (
                <SelectItem value="__empty__" disabled>
                  {coversError ? "Failed to load covers" : "No covers available"}
                </SelectItem>
              ) : (
                coverOptions.map((opt) => (
                  <SelectItem key={opt.id} value={String(opt.id)}>
                    {opt.label}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          {selectedCoverId && (
            <Button variant="ghost" size="icon" onClick={handleClearCover} aria-label="Clear">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Cover prices */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Cover prices</h2>
        {selectedCoverId && (
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            {pricingLoading ? (
              <div className="p-8 text-center text-muted-foreground">Loading pricing…</div>
            ) : pricingRows.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No pricing data</div>
            ) : (
              <>
                {selectedCoverLabel && (
                  <div className="bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium">
                    {selectedCoverLabel}
                  </div>
                )}
                <table className="w-full text-sm">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="text-left py-3 px-4 font-semibold">Duration</th>
                    {optionTypesList.map((type) => (
                      <th key={type} className="text-left py-3 px-4 font-semibold">
                        {type}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pricingRows.map((row) => (
                    <tr key={row.days} className="border-t border-border">
                      <td className="py-3 px-4 font-medium">{row.days} days</td>
                      {optionTypesList.map((optionType) => {
                        const opt = row.optionsByType[optionType];
                        const isSelected = selectedPricing[row.days] === optionType;
                        return (
                          <td key={optionType} className="py-3 px-4">
                            {opt ? (
                              <label className="flex flex-col gap-1 cursor-pointer">
                                <span className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`pricing-${row.days}`}
                                    checked={isSelected}
                                    onChange={() => handlePricingSelect(row.days, optionType)}
                                    className="rounded-full"
                                  />
                                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                                  {opt.code}
                                </span>
                                <span className="text-muted-foreground pl-6">INR {opt.price}</span>
                              </label>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
              </>
            )}
          </div>
        )}
      </div>

      {/* Email Preferences */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Email Preferences</h2>
        <RadioGroup
          value={emailPref}
          onValueChange={(v) => setEmailPref(v as "customer" | "operator")}
          className="flex gap-6"
        >
          <div className="flex items-center gap-2">
            <RadioGroupItem value="customer" id="customer" />
            <Label htmlFor="customer" className="cursor-pointer">Customer</Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="operator" id="operator" />
            <Label htmlFor="operator" className="cursor-pointer">Operator</Label>
          </div>
        </RadioGroup>
      </div>

      {/* Upload CSV */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upload CSV File</h2>
          <Button variant="outline" size="sm" onClick={handleDownloadSample}>
            <Download className="h-4 w-4 mr-2" />
            CSV Sample File
          </Button>
        </div>
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
            transition-colors
            ${dragOver ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"}
          `}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <FileSpreadsheet className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Drag and drop or Click here to upload
            </p>
            {csvFile && (
              <p className="text-sm font-medium mt-2 text-foreground">{csvFile.name}</p>
            )}
          </label>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button className="bg-primary text-primary-foreground px-12">
          Submit
        </Button>
      </div>
    </div>
  );
}
