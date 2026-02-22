import { useQuery } from "@tanstack/react-query";
import { fetchAssignPlans, normalizeAssignPlans } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function AssignCoversPage() {
  const { data } = useQuery({ queryKey: ["plans"], queryFn: fetchAssignPlans });
  const list = normalizeAssignPlans(data);

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
              <th className="py-3 px-4 w-10"><Checkbox /></th>
              <th className="text-left py-3 px-4 font-semibold">Name</th>
              <th className="text-left py-3 px-4 font-semibold">Scope</th>
              <th className="text-left py-3 px-4 font-semibold">Currency</th>
              <th className="text-right py-3 px-4 font-semibold">Price</th>
            </tr>
          </thead>
          <tbody>
            {list.map((plan) => (
              <tr key={plan.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                <td className="py-3 px-4"><Checkbox /></td>
                <td className="py-3 px-4">{plan.title || "—"}</td>
                <td className="py-3 px-4">{plan.cover_scope || "—"}</td>
                <td className="py-3 px-4">{plan.currency}</td>
                <td className="py-3 px-4 text-right">{plan.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
