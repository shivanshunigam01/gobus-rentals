import { randomUUID } from "node:crypto";

/** @type {any[]} */
const companies = [
  {
    id: "b2b-pending-1",
    companyName: "Pending Logistics Pvt Ltd",
    email: "pending.corp@demo.local",
    phone: "9800000001",
    gstin: "29AABCT1332L000",
    status: "pending",
    creditLimit: 0,
    walletBalance: 0,
    defaultDiscountPercent: 5,
  },
  {
    id: "b2b-active-1",
    companyName: "Active Corp Travels",
    email: "active.corp@demo.local",
    phone: "9800000002",
    gstin: "27AABCT1332L001",
    status: "active",
    creditLimit: 500000,
    walletBalance: 25000,
    defaultDiscountPercent: 8,
  },
];

/** @type {any[]} */
const contracts = [
  {
    id: "ctr-1",
    companyId: "b2b-active-1",
    title: "FY Corporate Fleet",
    discountPercent: 8,
    paymentTermsDays: 30,
    status: "active",
    pricingRules: [{ vehicleTypeSlug: "tempo-traveller", ratePerKm: 28, ratePerDay: 4500 }],
  },
];

/** @type {any[]} */
const offers = [
  {
    id: "offer-1",
    title: "Welcome B2B Offer",
    slug: "welcome-b2b",
    type: "banner",
    code: "",
    discountType: "",
    discountValue: 0,
    description: "Corporate travel savings",
    href: "/b2b/register",
    status: "active",
    target: "b2b",
    priority: 10,
    banner: { url: "", alt: "B2B" },
    startsAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 90 * 86400000).toISOString(),
  },
  {
    id: "offer-2",
    title: "CORP10 Coupon",
    slug: "corp10-coupon",
    type: "coupon",
    code: "CORP10",
    discountType: "percent",
    discountValue: 10,
    description: "10% off",
    href: "/book",
    status: "active",
    target: "all",
    priority: 20,
    banner: { url: "", alt: "" },
    startsAt: new Date(Date.now() - 86400000).toISOString(),
    expiresAt: new Date(Date.now() + 180 * 86400000).toISOString(),
  },
];

/** @type {any[]} */
const payouts = [];
/** @type {Map<string, any>} */
const b2bUsers = new Map([
  [
    "pending.corp@demo.local",
    {
      id: "u-b2b-pending",
      email: "pending.corp@demo.local",
      password: "B2Bdemo@123",
      name: "Pending Admin",
      role: "b2b",
      companyId: "b2b-pending-1",
    },
  ],
  [
    "active.corp@demo.local",
    {
      id: "u-b2b-active",
      email: "active.corp@demo.local",
      password: "B2Bdemo@123",
      name: "Active Admin",
      role: "b2b",
      companyId: "b2b-active-1",
    },
  ],
]);

function tokenFor(user) {
  return `mock.${Buffer.from(JSON.stringify({ sub: user.id, role: user.role, companyId: user.companyId })).toString("base64")}`;
}

/**
 * @returns {boolean|null} true if handled
 */
export function handleB2bApi(method, path, url, body, json, usersMap) {
  if (method === "POST" && path === "/api/auth/b2b/register") {
    const email = String(body.email || "").toLowerCase();
    if (b2bUsers.has(email) || (usersMap && [...usersMap.values()].some((u) => u.email === email))) {
      json(409, { error: "Email already registered" });
      return true;
    }
    const company = {
      id: randomUUID(),
      companyName: body.companyName,
      email: body.companyEmail || email,
      phone: body.companyPhone || body.phone,
      gstin: (body.gstin || "").toUpperCase(),
      status: "pending",
      creditLimit: 0,
      walletBalance: 0,
      defaultDiscountPercent: 5,
    };
    companies.push(company);
    const user = {
      id: randomUUID(),
      email,
      password: body.password,
      name: body.contactName || body.name,
      phone: body.phone,
      role: "b2b",
      companyId: company.id,
    };
    b2bUsers.set(email, user);
    if (usersMap) usersMap.set(user.id, user);
    json(201, {
      token: tokenFor(user),
      user: { id: user.id, email, name: user.name, role: "b2b", companyId: company.id },
      company: { id: company.id, companyName: company.companyName, status: company.status },
    });
    return true;
  }

  if (method === "GET" && path === "/api/public/offers") {
    const now = Date.now();
    json(200, {
      offers: offers
        .filter((o) => o.status === "active")
        .filter((o) => !o.startsAt || new Date(o.startsAt).getTime() <= now)
        .filter((o) => !o.expiresAt || new Date(o.expiresAt).getTime() >= now)
        .sort((a, b) => a.priority - b.priority),
    });
    return true;
  }

  if (method === "POST" && path === "/api/public/offers/validate-coupon") {
    const code = String(body.code || "").toUpperCase();
    const offer = offers.find((o) => o.type === "coupon" && o.code === code && o.status === "active");
    if (!offer) {
      json(404, { error: "Invalid coupon" });
      return true;
    }
    const amount = Number(body.amount || 0);
    const discountAmount =
      offer.discountType === "percent" ? Math.round((amount * offer.discountValue) / 100) : Math.min(amount, offer.discountValue);
    json(200, { ok: true, code, discountType: offer.discountType, discountValue: offer.discountValue, discountAmount, title: offer.title });
    return true;
  }

  if (path.startsWith("/api/b2b/")) {
    const auth = /* loose */ true;
    if (!auth) {
      json(401, { error: "Auth required" });
      return true;
    }
    const company = companies.find((c) => c.status === "active") || companies[0];
    if (method === "GET" && path === "/api/b2b/dashboard") {
      json(200, {
        company,
        stats: {
          totalBookings: 0,
          activeBookings: 0,
          completedTrips: 0,
          totalSpendDisplay: "₹0",
          openInvoices: 0,
          employees: 1,
        },
      });
      return true;
    }
    if (method === "GET" && (path === "/api/b2b/bookings" || path === "/api/b2b/trips")) {
      json(200, { bookings: [] });
      return true;
    }
    if (method === "GET" && path === "/api/b2b/employees") {
      json(200, { employees: [{ id: "e1", name: "Admin", email: company.email, department: "Admin", status: "active" }] });
      return true;
    }
    if (method === "POST" && path === "/api/b2b/employees") {
      json(201, { ok: true, employeeId: randomUUID() });
      return true;
    }
    if (method === "GET" && path === "/api/b2b/favourites") {
      json(200, { favourites: [] });
      return true;
    }
    if (method === "POST" && path === "/api/b2b/favourites") {
      json(201, { ok: true, id: randomUUID() });
      return true;
    }
    if (method === "GET" && (path === "/api/b2b/wallet" || path === "/api/b2b/payments")) {
      json(200, { walletBalance: company.walletBalance, creditLimit: company.creditLimit, history: [] });
      return true;
    }
    if (method === "GET" && path === "/api/b2b/contracts") {
      json(200, { contracts: contracts.filter((c) => c.companyId === company.id) });
      return true;
    }
    if (method === "GET" && path === "/api/b2b/invoices") {
      json(200, { invoices: [] });
      return true;
    }
    if (method === "GET" && path === "/api/b2b/company") {
      json(200, { company });
      return true;
    }
  }

  if (method === "GET" && path === "/api/admin/b2b/companies") {
    let rows = [...companies];
    const q = url.searchParams.get("q");
    const status = url.searchParams.get("status");
    if (status) rows = rows.filter((c) => c.status === status);
    if (q) rows = rows.filter((c) => JSON.stringify(c).toLowerCase().includes(q.toLowerCase()));
    json(200, { companies: rows });
    return true;
  }

  if (method === "GET" && path.startsWith("/api/admin/b2b/companies/") && !path.includes("/contracts")) {
    const id = path.split("/").pop();
    const company = companies.find((c) => c.id === id);
    if (!company) {
      json(404, { error: "Not found" });
      return true;
    }
    json(200, { company, contracts: contracts.filter((c) => c.companyId === id), employees: [], bookings: [], invoices: [] });
    return true;
  }

  if (method === "PATCH" && path.startsWith("/api/admin/b2b/companies/")) {
    const id = path.split("/").pop();
    const company = companies.find((c) => c.id === id);
    if (!company) {
      json(404, { error: "Not found" });
      return true;
    }
    Object.assign(company, body);
    json(200, { ok: true, status: company.status });
    return true;
  }

  if (method === "POST" && /\/api\/admin\/b2b\/companies\/[^/]+\/contracts$/.test(path)) {
    const companyId = path.split("/")[5];
    const doc = { id: randomUUID(), companyId, ...body };
    contracts.push(doc);
    json(201, { ok: true, id: doc.id });
    return true;
  }

  if (method === "GET" && path === "/api/admin/offers") {
    json(200, { offers });
    return true;
  }
  if (method === "POST" && path === "/api/admin/offers") {
    const o = {
      id: randomUUID(),
      title: body.title,
      slug: body.slug || String(body.title || "").toLowerCase().replace(/\s+/g, "-"),
      type: body.type || "banner",
      code: (body.code || "").toUpperCase(),
      discountType: body.discountType || "",
      discountValue: Number(body.discountValue || 0),
      description: body.description || "",
      href: body.href || "/book",
      status: body.status || "draft",
      target: body.target || "all",
      priority: Number(body.priority || 100),
      banner: { url: body.bannerUrl || "", alt: body.title },
      startsAt: body.startsAt || null,
      expiresAt: body.expiresAt || null,
    };
    offers.push(o);
    json(201, { ok: true, id: o.id });
    return true;
  }
  if (method === "DELETE" && path.startsWith("/api/admin/offers/")) {
    const id = path.split("/").pop();
    const i = offers.findIndex((o) => o.id === id);
    if (i >= 0) offers.splice(i, 1);
    json(200, { ok: true });
    return true;
  }

  if (method === "GET" && path === "/api/admin/payouts") {
    json(200, { payouts });
    return true;
  }
  if (method === "GET" && path === "/api/admin/payouts/export") {
    return "csv";
  }
  if (method === "POST" && path.startsWith("/api/admin/payouts/") && path.endsWith("/process")) {
    const id = path.split("/")[4];
    const p = payouts.find((x) => x.id === id);
    if (!p) {
      json(404, { error: "Not found" });
      return true;
    }
    const action = body.action || body.status;
    if (action === "reject" || action === "rejected") p.status = "rejected";
    else if (action === "partial") p.status = "partial";
    else if (action === "paid") p.status = "paid";
    else p.status = "approved";
    if (body.amountApproved != null) p.amountApproved = Number(body.amountApproved);
    if (body.transactionId) p.transactionId = body.transactionId;
    p.remarks = body.remarks || "";
    p.amountApprovedDisplay = `₹${Number(p.amountApproved || 0).toLocaleString("en-IN")}`;
    json(200, { ok: true, status: p.status });
    return true;
  }

  if (method === "GET" && path === "/api/vendor/payouts") {
    json(200, { payouts: payouts.filter((p) => true) });
    return true;
  }
  if (method === "POST" && path === "/api/vendor/payouts") {
    const p = {
      id: randomUUID(),
      vendor: "Vendor",
      amountRequested: Number(body.amountRequested || 5000),
      amountApproved: 0,
      amountRequestedDisplay: "₹5,000",
      amountApprovedDisplay: "₹0",
      status: "pending",
      transactionId: "",
      remarks: "",
      bankSnapshot: {},
    };
    payouts.push(p);
    json(201, { ok: true, id: p.id });
    return true;
  }

  if (method === "GET" && path.startsWith("/api/admin/bookings/") && path !== "/api/admin/bookings") {
    const id = path.split("/").pop();
    json(200, {
      booking: { id, rawStatus: "confirmed", displayStatus: "Confirmed", paymentStatus: "Partial", driver: {} },
      lead: { pickup: "Delhi", drop: "Jaipur", journeyDate: "2026-08-10", journeyTime: "09:00" },
      customer: { name: "Demo", email: "demo@local", phone: "9999999999" },
      vendor: { companyName: "Demo Vendor" },
      company: null,
      bus: null,
      payments: [],
      events: [{ id: "ev1", type: "status", message: "Booking created", createdAt: new Date().toISOString() }],
      payouts: [],
      invoice: null,
    });
    return true;
  }

  return null;
}

export function getB2bLoginUser(email, password) {
  const u = b2bUsers.get(String(email || "").toLowerCase());
  if (u && u.password === password) return u;
  return null;
}

export function mockTokenForB2b(user) {
  return tokenFor(user);
}
