import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, MapPin, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatPostOfficeAddress,
  isValidIndianPincode,
  lookupPincode,
  type PostOffice,
} from "@/lib/pincode-lookup";
import { cn } from "@/lib/utils";

type PincodeAddressFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  manualHint?: string;
};

export function PincodeAddressField({
  id,
  label,
  placeholder = "e.g. Chandigarh",
  value,
  onChange,
  manualHint = "You can edit this anytime — manual entry always works.",
}: PincodeAddressFieldProps) {
  const [pin, setPin] = useState("");
  const [offices, setOffices] = useState<PostOffice[]>([]);
  const [selectedOfficeIndex, setSelectedOfficeIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [lastAutoFill, setLastAutoFill] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const applyOffice = useCallback(
    (office: PostOffice) => {
      const formatted = formatPostOfficeAddress(office);
      setLastAutoFill(formatted);
      onChange(formatted);
    },
    [onChange],
  );

  const runLookup = useCallback(
    async (pincode: string, silent = false) => {
      if (!isValidIndianPincode(pincode)) {
        setLookupError("Enter a valid 6-digit PIN code.");
        return;
      }

      setLoading(true);
      setLookupError(null);
      try {
        const results = await lookupPincode(pincode);
        setOffices(results);
        setSelectedOfficeIndex(0);
        applyOffice(results[0]);
        if (!silent) {
          toast.success(
            results.length > 1
              ? `${results.length} areas found — pick one or edit the address below.`
              : "Address filled from PIN code. You can still edit below.",
          );
        }
      } catch (err) {
        setOffices([]);
        setSelectedOfficeIndex(0);
        const message = err instanceof Error ? err.message : "PIN lookup failed.";
        setLookupError(message);
        if (!silent) toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    [applyOffice],
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (pin.length !== 6) {
      setLookupError(null);
      if (pin.length === 0) setOffices([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      void runLookup(pin, true);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [pin, runLookup]);

  const handleOfficeChange = (index: number) => {
    setSelectedOfficeIndex(index);
    const office = offices[index];
    if (office) applyOffice(office);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-dashed border-primary/35 bg-primary/[0.04] p-3 sm:p-4 space-y-3">
        <p className="text-xs font-semibold text-primary flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
          Quick fill with PIN code
          <span className="font-normal text-muted-foreground">(optional)</span>
        </p>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            placeholder="6-digit PIN"
            value={pin}
            aria-label={`${label} PIN code`}
            className="sm:max-w-[10rem] tabular-nums tracking-widest"
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 gap-1.5"
            disabled={!isValidIndianPincode(pin) || loading}
            onClick={() => void runLookup(pin)}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Search className="h-4 w-4" aria-hidden />
            )}
            {loading ? "Looking up…" : "Look up PIN"}
          </Button>
        </div>

        {lookupError ? <p className="text-xs text-destructive">{lookupError}</p> : null}

        {offices.length > 1 ? (
          <div className="space-y-1.5">
            <Label htmlFor={`${id}-area`} className="text-xs text-muted-foreground">
              Select area in this PIN ({offices.length} found)
            </Label>
            <select
              id={`${id}-area`}
              className={cn(
                "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              )}
              value={selectedOfficeIndex}
              onChange={(e) => handleOfficeChange(Number(e.target.value))}
            >
              {offices.map((office, index) => (
                <option key={`${office.Name}-${index}`} value={index}>
                  {office.Name}, {office.District}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {lastAutoFill && value === lastAutoFill ? (
          <p className="text-xs text-muted-foreground">
            ✓ Address auto-filled from PIN — edit the field below if you need a different pickup point.
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor={id}>{label}</Label>
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            if (e.target.value !== lastAutoFill) setLastAutoFill(null);
            onChange(e.target.value);
          }}
        />
        <p className="text-xs text-muted-foreground">{manualHint}</p>
      </div>
    </div>
  );
}
