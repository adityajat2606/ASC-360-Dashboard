import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SingleIssuancePage() {
  return (
    <div className="bg-card rounded-lg border border-border p-6 max-w-5xl">
      <h2 className="text-xl font-bold text-foreground mb-6">Get Quote</h2>

      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="text-sm font-semibold text-foreground mb-1 block">Nationality</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Select user nationality" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="indian">Indian</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-1 block">From</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Select travelling from" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="india">India</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-1 block">To</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Select travelling to" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="india">India</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">
        <div>
          <label className="text-sm font-semibold text-foreground mb-1 block">Travel Dates</label>
          <Input type="text" placeholder="February 21, 2026 – February 21, 2026" />
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-1 block">Adventure</label>
          <Select>
            <SelectTrigger><SelectValue placeholder="Select an adventure" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="hiking">Hiking</SelectItem>
              <SelectItem value="rafting">Rafting</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-semibold text-foreground mb-1 block">No. of pax</label>
          <Input type="number" defaultValue={1} />
        </div>
      </div>

      <div className="mt-6">
        <label className="text-sm font-semibold text-foreground mb-1 block">Age of person 1</label>
        <Input placeholder="Enter age of person 1" className="max-w-sm" />
      </div>

      <div className="flex justify-center mt-8">
        <Button className="bg-primary text-primary-foreground px-8">Get Quote</Button>
      </div>
    </div>
  );
}
