// Use proxy in dev to avoid CORS (OPTIONS preflight failing)
const API_BASE = import.meta.env.DEV ? "/api/v1" : "https://13.200.85.27/api/v1";
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzcxNzUwMzY0LCJpYXQiOjE3NzE3NDMxNjQsImp0aSI6IjI2ZTIyNjMyZjBiZTRhZTRiM2M0ZWFmOGUwM2E5Y2VhIiwidXNlcl9pZCI6NzMzMH0.fwGg8VTfBc7sEU0Xa3-JK9zEdXy9VSt1Vg0RDw7cmK4";
const USER_EMAIL = "opt.act360@gmail.com";

/** Headers matching the exact curl payload for asc-wallet API */
const headers: Record<string, string> = {
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
  "Authorization": `Bearer ${AUTH_TOKEN}`,
  "Connection": "keep-alive",
  "Content-Type": "application/json",
  "Origin": "https://dashboard.asc360.in",
  "Referer": "https://dashboard.asc360.in/",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "cross-site",
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
  "sec-ch-ua": '"Not:A-Brand";v="99", "Google Chrome";v="145", "Chromium";v="145"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
};

async function apiFetch(path: string) {
  const res = await fetch(`${API_BASE}${path}`, { headers });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

async function apiPut(path: string, body: unknown) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function fetchPayments(page = 1) {
  return apiFetch(`/issuance/user-specific-payments/?page=${page}`);
}

export async function fetchAssignPlans() {
  return apiFetch("/issuance/assign-plan/");
}

/** Normalize assign-plan API response: { customize_covers: [...] } or [{ customize_covers: [...] }] */
export function normalizeAssignPlans(data: unknown): { id: number; title: string; price: number; currency: string; cover_scope: string }[] {
  if (!data) return [];
  const raw = data as Record<string, unknown> | unknown[];
  const items: { id: number; title: string; price: number; currency: string; cover_scope: string }[] = [];
  const extract = (obj: Record<string, unknown>) => {
    const arr = obj.customize_covers;
    if (!Array.isArray(arr)) return;
    for (const c of arr) {
      const o = c as Record<string, unknown>;
      items.push({
        id: Number(o.id),
        title: String(o.title ?? o.name ?? ""),
        price: Number(o.price ?? 0),
        currency: String(o.currency ?? "INR"),
        cover_scope: String(o.cover_scope ?? o.scope ?? ""),
      });
    }
  };
  if (Array.isArray(raw)) {
    for (const x of raw) {
      if (x && typeof x === "object") extract(x as Record<string, unknown>);
    }
  } else if (raw && typeof raw === "object") {
    extract(raw);
  }
  return items;
}

export async function fetchTripStatus(coverType: "International" | "Domestic") {
  return apiFetch(`/dashboard/trip-status/?cover_type=${coverType}`);
}

export async function fetchWallet() {
  return apiFetch(`/asc-wallet/user-wallet/?email=${USER_EMAIL}`);
}

export async function fetchWalletTransactions(page = 1) {
  return apiFetch(`/asc-wallet/user-wallet/transactions/?page=${page}`);
}

export async function fetchUserCoverPlanAccess(policyType: "bulk" | "single") {
  return apiFetch(`/issuance/user-cover-plan-access/?policy_type=${policyType}`);
}

export async function fetchCoverPricing(coverId: number) {
  return apiFetch(`/cover-api/customize-covers/${coverId}/pricing/issuance/`);
}

export async function fetchQuoteLinks(page = 1) {
  return apiFetch(`/generate-quote/quotes/create/?page=${page}`);
}

export async function fetchOperatorDetails() {
  return apiFetch("/operator/operator/");
}

export async function updateOperatorDetails(data: Record<string, unknown>) {
  return apiPut("/operator/operator/", data);
}

export { USER_EMAIL };
