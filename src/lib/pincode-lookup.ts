export type PostOffice = {
  Name: string;
  District: string;
  State: string;
  Pincode: string;
  Block?: string;
  Region?: string;
};

type PincodeApiResponse = {
  Status: string;
  Message: string;
  PostOffice?: PostOffice[] | null;
};

const PINCODE_API = "https://api.postalpincode.in/pincode";

export function isValidIndianPincode(pin: string): boolean {
  return /^\d{6}$/.test(pin);
}

export function formatPostOfficeAddress(office: PostOffice): string {
  const locality = office.Name?.trim();
  const district = office.District?.trim();
  const state = office.State?.trim();
  const pin = office.Pincode?.trim();

  const parts = [locality, district, state].filter(Boolean);
  const base = parts.join(", ");
  return pin ? `${base} — ${pin}` : base;
}

export async function lookupPincode(pin: string): Promise<PostOffice[]> {
  if (!isValidIndianPincode(pin)) {
    throw new Error("Enter a valid 6-digit PIN code.");
  }

  const res = await fetch(`${PINCODE_API}/${pin}`);
  if (!res.ok) {
    throw new Error("Could not look up PIN code. Try again or enter the address manually.");
  }

  const data = (await res.json()) as PincodeApiResponse[];
  const first = data[0];
  if (!first || first.Status !== "Success" || !first.PostOffice?.length) {
    throw new Error("PIN code not found. Please enter your address manually.");
  }

  return first.PostOffice;
}
