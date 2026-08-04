import { COMPANY, computeGstBreakdown, formatInr, vendorCommissionAmount, vendorNetAfterCommission } from "./company";

const DB_KEY = "lbr_local_db_v1";

type Role = "customer" | "vendor" | "admin" | "b2b";

type UserRow = {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: Role;
  vendorId?: string;
  companyId?: string;
  blocked?: boolean;
  /** ISO timestamp — used for admin “Joined” column */
  createdAt?: string;
};

type VendorRow = {
  id: string;
  userId: string;
  companyName: string;
  gstNumber?: string;
  panNumber?: string;
  address?: string;
  fleetSize?: number;
  operatingCities?: string;
  bankHolder?: string;
  bankAccount?: string;
  bankIfsc?: string;
  bankName?: string;
  status: "pending" | "active" | "blocked" | "rejected";
  rating: number;
  city?: string;
};

type LeadRow = {
  id: string;
  customerId: string | null;
  guestName?: string;
  guestEmail?: string;
  pickup: string;
  drop: string;
  journeyDate: string;
  journeyTime: string;
  returnDate?: string;
  passengers: number;
  busType: string;
  acPreference: string;
  purpose: string;
  notes?: string;
  guestPhone?: string;
  acceptedQuoteId: string | null;
  rejectedByVendorIds: string[];
  createdAt: string;
};

type QuoteRow = {
  id: string;
  leadId: string;
  vendorId: string;
  amount: number;
  inclusions?: string;
  terms?: string;
  status: "pending" | "accepted" | "declined" | "withdrawn";
  responseMinutes: number;
  createdAt: string;
};

type BookingRow = {
  id: string;
  leadId: string;
  quoteId: string;
  customerId: string;
  vendorId: string;
  subtotal: number;
  gstAmount: number;
  totalWithGst: number;
  paymentType: "advance" | "full";
  advanceRequired: number;
  amountPaid: number;
  rawStatus: "pending_payment" | "confirmed" | "on_trip" | "completed" | "cancelled";
  displayStatus: "Pending payment" | "Confirmed" | "On Trip" | "Completed" | "Cancelled";
  payoutOverride: "none" | "hold";
  payoutStatus: "Pending" | "Paid" | "On hold" | "Refunded";
  commissionDeducted: number;
  payoutAmount: number;
  createdAt: string;
  updatedAt: string;
};

type CmsRow = {
  id: string;
  kind: "blog" | "faq" | "page";
  title?: string;
  body?: string;
  question?: string;
  answer?: string;
  slug?: string;
  status: "Published" | "Draft";
  date: string;
};

type ReviewRow = {
  id: string;
  customerId: string;
  vendorId: string;
  rating: number;
  comment?: string;
  createdAt: string;
};

type NotificationLog = {
  id: string;
  channel: string;
  subject: string;
  body: string;
  audience: string;
  date: string;
};

type CompanySettings = {
  siteName: string;
  legalName: string;
  about: string;
  operatingLocations: string;
  contactPhone: string;
  contactEmail: string;
  gstNumber: string;
  gstEnabled: boolean;
  gstPercentage: number;
  commissionPercent: number;
  quoteWindowHours: number;
  payoutType: string;
  payoutTrigger: string;
};

type LocalDb = {
  users: UserRow[];
  vendors: VendorRow[];
  leads: LeadRow[];
  quotes: QuoteRow[];
  bookings: BookingRow[];
  cms: CmsRow[];
  reviews: ReviewRow[];
  notificationLogs: NotificationLog[];
  settings: CompanySettings;
};

function nowIso() {
  return new Date().toISOString();
}

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function tokenFor(user: UserRow) {
  const payload = btoa(JSON.stringify({ sub: user.id, role: user.role, vendorId: user.vendorId ?? null }));
  return `mock.${payload}`;
}

function parseToken(raw: string | null | undefined): { sub: string; role: Role; vendorId?: string | null } | null {
  if (!raw?.startsWith("mock.")) return null;
  try {
    return JSON.parse(atob(raw.slice(5))) as { sub: string; role: Role; vendorId?: string | null };
  } catch {
    return null;
  }
}

function seedDb(): LocalDb {
  const adminId = uid();
  const vendorUserId = uid();
  const vendorId = uid();
  const customerId = uid();
  return {
    users: [
      {
        id: adminId,
        email: "admin@luxurybus.dev",
        password: "admin123",
        name: "Platform Admin",
        phone: "",
        role: "admin",
        createdAt: new Date().toISOString(),
      },
      {
        id: vendorUserId,
        email: "vendor@luxurybus.dev",
        password: "vendor123",
        name: "Demo Vendor",
        phone: "9000000001",
        role: "vendor",
        vendorId,
        createdAt: new Date().toISOString(),
      },
      {
        id: customerId,
        email: "customer@luxurybus.dev",
        password: "customer123",
        name: "Demo Customer",
        phone: "9000000002",
        role: "customer",
        createdAt: new Date().toISOString(),
      },
    ],
    vendors: [
      {
        id: vendorId,
        userId: vendorUserId,
        companyName: "Northern Travels",
        operatingCities: "Chandigarh, Delhi, Shimla",
        status: "active",
        rating: 4.6,
        city: "Chandigarh",
      },
    ],
    leads: [],
    quotes: [],
    bookings: [],
    cms: [
      { id: uid(), kind: "blog", title: "How to plan a group trip", body: "Sample blog body", slug: "group-trip-guide", status: "Published", date: new Date().toLocaleDateString("en-IN") },
      { id: uid(), kind: "faq", question: "How soon will I receive quotes?", answer: "Usually within a few hours.", status: "Published", date: new Date().toLocaleDateString("en-IN") },
    ],
    reviews: [],
    notificationLogs: [],
    settings: {
      siteName: COMPANY.platformBrand,
      legalName: COMPANY.legalName,
      about: COMPANY.about,
      operatingLocations: COMPANY.operatingLocations,
      contactPhone: COMPANY.contactPhone,
      contactEmail: COMPANY.contactEmail,
      gstNumber: COMPANY.gstNumber,
      gstEnabled: COMPANY.gstEnabled,
      gstPercentage: COMPANY.gstPercentage,
      commissionPercent: COMPANY.commissionPercent,
      quoteWindowHours: 24,
      payoutType: "automatic",
      payoutTrigger: "after_trip_completion",
    },
  };
}

function loadDb(): LocalDb {
  const raw = localStorage.getItem(DB_KEY);
  if (!raw) {
    const seed = seedDb();
    saveDb(seed);
    return seed;
  }
  try {
    const db = JSON.parse(raw) as LocalDb;
    if (!db.users || !db.vendors || !db.settings) throw new Error("bad db");
    return db;
  } catch {
    const seed = seedDb();
    saveDb(seed);
    return seed;
  }
}

function saveDb(db: LocalDb) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

/** Simulates transactional email queue for dev UI (Admin → Notifications history). Real backend sends via SMTP/SendGrid. */
function logTransactionalEmail(db: LocalDb, subject: string, body: string, audience: string) {
  db.notificationLogs.unshift({
    id: uid(),
    channel: "email",
    subject,
    body,
    audience,
    date: new Date().toLocaleString("en-IN"),
  });
}

function bookingPublicRef(bookingId: string) {
  return `LBR-${bookingId.replace(/-/g, "").slice(-8).toUpperCase()}`;
}

function displayStatus(raw: BookingRow["rawStatus"]) {
  const map: Record<BookingRow["rawStatus"], BookingRow["displayStatus"]> = {
    pending_payment: "Pending payment",
    confirmed: "Confirmed",
    on_trip: "On Trip",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return map[raw];
}

function paymentLabel(b: BookingRow) {
  if (b.amountPaid >= b.totalWithGst - 0.01) return "Paid in full";
  if (b.amountPaid > 0) return "Partial";
  return "Unpaid";
}

function applyAutoPayout(db: LocalDb, booking: BookingRow) {
  if (booking.rawStatus !== "completed") return;
  if (booking.payoutOverride === "hold") {
    booking.payoutStatus = "On hold";
    return;
  }
  const commission = vendorCommissionAmount(booking.subtotal, db.settings.commissionPercent);
  booking.commissionDeducted = commission;
  booking.payoutAmount = vendorNetAfterCommission(booking.subtotal, db.settings.commissionPercent);
  booking.payoutStatus = "Paid";
}

function ensureAuth(db: LocalDb, authHeader: string | null | undefined) {
  const parsed = parseToken(authHeader?.replace(/^Bearer\s+/i, ""));
  if (!parsed) throw new LocalApiError(401, "Unauthorized");
  const user = db.users.find((u) => u.id === parsed.sub);
  if (!user) throw new LocalApiError(401, "Unauthorized");
  if (user.blocked) throw new LocalApiError(403, "User is blocked");
  return { user, vendorId: parsed.vendorId ?? user.vendorId ?? null };
}

class LocalApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function parseJsonBody(init: RequestInit): any {
  if (typeof init.body !== "string") return {};
  try {
    return JSON.parse(init.body);
  } catch {
    throw new LocalApiError(400, "Invalid JSON");
  }
}

export async function localApiRequest(path: string, init: RequestInit = {}): Promise<unknown> {
  const method = (init.method || "GET").toUpperCase();
  const db = loadDb();
  const body = parseJsonBody(init);
  const headers = new Headers(init.headers);

  try {
    const { handleLocalContentApi } = await import("./local-content-api");
    const qIndex = path.indexOf("?");
    const pathname = qIndex >= 0 ? path.slice(0, qIndex) : path;
    const search = qIndex >= 0 ? path.slice(qIndex + 1) : "";
    const contentResult = handleLocalContentApi(pathname, method, new URLSearchParams(search));
    if (contentResult !== null) return contentResult;

    if (path === "/api/payments/razorpay/order" || path === "/api/payments/razorpay/verify") {
      throw new LocalApiError(
        503,
        "Online payments are not available in pure in-browser demo mode. Run the mock API with Razorpay env vars and set VITE_API_URL to that server (see .env.example).",
      );
    }

    // Auth
    if (method === "POST" && path === "/api/auth/register") {
      if (!body.email || !body.password || !body.name) throw new LocalApiError(400, "Missing required fields");
      if (db.users.some((u) => u.email.toLowerCase() === String(body.email).toLowerCase())) {
        throw new LocalApiError(409, "Email already exists");
      }
      const user: UserRow = {
        id: uid(),
        email: String(body.email).toLowerCase(),
        password: String(body.password),
        name: String(body.name),
        phone: String(body.phone || ""),
        role: "customer",
        createdAt: nowIso(),
      };
      db.users.push(user);
      saveDb(db);
      return { token: tokenFor(user), user: { id: user.id, email: user.email, name: user.name, role: user.role } };
    }

    if (method === "POST" && path === "/api/auth/vendor/register") {
      if (!body.email || !body.password || !body.name || !body.companyName) throw new LocalApiError(400, "Missing required fields");
      if (db.users.some((u) => u.email.toLowerCase() === String(body.email).toLowerCase())) {
        throw new LocalApiError(409, "Email already exists");
      }
      const vendorId = uid();
      const user: UserRow = {
        id: uid(),
        email: String(body.email).toLowerCase(),
        password: String(body.password),
        name: String(body.name),
        phone: String(body.phone || ""),
        role: "vendor",
        vendorId,
        createdAt: nowIso(),
      };
      const vendor: VendorRow = {
        id: vendorId,
        userId: user.id,
        companyName: String(body.companyName),
        gstNumber: body.gstNumber,
        panNumber: body.panNumber,
        address: body.address,
        fleetSize: body.fleetSize ? Number(body.fleetSize) : 0,
        operatingCities: body.operatingCities,
        bankHolder: body.bankHolder,
        bankAccount: body.bankAccount,
        bankIfsc: body.bankIfsc,
        bankName: body.bankName,
        status: "pending",
        rating: 4.2,
        city: String(body.operatingCities || "").split(",")[0]?.trim() || "—",
      };
      db.users.push(user);
      db.vendors.push(vendor);
      saveDb(db);
      return { token: tokenFor(user), user: { id: user.id, email: user.email, name: user.name, role: user.role, vendorId } };
    }

    if (method === "POST" && path === "/api/auth/login") {
      const email = String(body.email || "").toLowerCase();
      const password = String(body.password || "");
      if (!db.users.some((u) => u.email === "active.corp@demo.local")) {
        const companyId = "b2b-active-1";
        if (!(db as any).companies?.length) {
          (db as any).companies = [
            {
              id: companyId,
              companyName: "Active Corp Travels",
              email: "active.corp@demo.local",
              phone: "9800000002",
              gstin: "27AABCT1332L001",
              status: "active",
              creditLimit: 500000,
              walletBalance: 25000,
            },
          ];
        }
        db.users.push({
          id: uid(),
          email: "active.corp@demo.local",
          password: "B2Bdemo@123",
          name: "Active Admin",
          phone: "9800000002",
          role: "b2b",
          companyId,
          createdAt: new Date().toISOString(),
        });
        saveDb(db);
      }
      const user = db.users.find((u) => u.email === email && u.password === password);
      if (!user) throw new LocalApiError(401, "Invalid email or password");
      saveDb(db);
      return {
        token: tokenFor(user),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          vendorId: user.vendorId,
          companyId: user.companyId,
        },
      };
    }

    if (method === "GET" && path === "/api/auth/me") {
      const { user } = ensureAuth(db, headers.get("Authorization"));
      return { user: { id: user.id, email: user.email, name: user.name, phone: user.phone, role: user.role, vendorId: user.vendorId } };
    }

    // Public lead create
    if (method === "POST" && path === "/api/leads") {
      let customerId: string | null = null;
      try {
        const a = ensureAuth(db, headers.get("Authorization"));
        if (a.user.role === "customer") customerId = a.user.id;
      } catch {
        // guest lead is allowed
      }
      const lead: LeadRow = {
        id: uid(),
        customerId,
        guestName: body.guestName,
        guestEmail: body.guestEmail,
        pickup: body.pickup,
        drop: body.drop,
        journeyDate: body.journeyDate,
        journeyTime: body.journeyTime,
        returnDate: body.returnDate,
        passengers: Number(body.passengers || 0),
        busType: body.busType,
        acPreference: body.acPreference,
        purpose: body.purpose,
        notes: body.notes,
        guestPhone: body.guestPhone,
        acceptedQuoteId: null,
        rejectedByVendorIds: [],
        createdAt: nowIso(),
      };
      db.leads.push(lead);
      saveDb(db);
      const activeCount = db.vendors.filter((v) => v.status === "active").length;
      return { ok: true, leadId: lead.id, notifiedVendors: activeCount };
    }

    // Customer
    if (method === "GET" && path === "/api/customer/dashboard-stats") {
      const { user } = ensureAuth(db, headers.get("Authorization"));
      if (user.role !== "customer") throw new LocalApiError(403, "Forbidden");
      const activeBookings = db.bookings.filter((b) => b.customerId === user.id && !["cancelled", "completed"].includes(b.rawStatus)).length;
      const pendingQuotes = db.quotes.filter((q) => q.status === "pending" && db.leads.find((l) => l.id === q.leadId)?.customerId === user.id).length;
      const reviewsGiven = db.reviews.filter((r) => r.customerId === user.id).length;
      return { activeBookings: String(activeBookings), pendingQuotes: String(pendingQuotes), reviewsGiven: String(reviewsGiven) };
    }

    if (method === "GET" && path === "/api/customer/bookings") {
      const { user } = ensureAuth(db, headers.get("Authorization"));
      if (user.role !== "customer") throw new LocalApiError(403, "Forbidden");
      const bookings = db.bookings.filter((b) => b.customerId === user.id).map((b) => {
        const lead = db.leads.find((l) => l.id === b.leadId)!;
        const vendor = db.vendors.find((v) => v.id === b.vendorId);
        const bal = Math.max(0, b.totalWithGst - b.amountPaid);
        return {
          id: b.id,
          from: lead.pickup,
          to: lead.drop,
          date: new Date(lead.journeyDate).toLocaleDateString("en-IN"),
          bus: lead.busType,
          vendor: vendor?.companyName ?? "Vendor",
          status: b.displayStatus,
          rawStatus: b.rawStatus,
          amount: formatInr(b.totalWithGst),
          subtotal: formatInr(b.subtotal),
          gstAmount: formatInr(b.gstAmount),
          totalWithGst: formatInr(b.totalWithGst),
          paymentType: b.paymentType,
          advanceRequired: formatInr(b.advanceRequired),
          amountPaid: formatInr(b.amountPaid),
          balanceDue: formatInr(bal),
          paymentStatus: paymentLabel(b),
          gstRatePercent: db.settings.gstPercentage,
        };
      });
      return { bookings };
    }

    if (method === "POST" && path.match(/^\/api\/customer\/bookings\/[^/]+\/cancel$/)) {
      const { user } = ensureAuth(db, headers.get("Authorization"));
      const id = path.split("/")[4];
      const b = db.bookings.find((x) => x.id === id && x.customerId === user.id);
      if (!b) throw new LocalApiError(404, "Booking not found");
      b.rawStatus = "cancelled";
      b.displayStatus = "Cancelled";
      b.updatedAt = nowIso();
      saveDb(db);
      return { ok: true };
    }

    if (method === "POST" && path.match(/^\/api\/customer\/bookings\/[^/]+\/pay-(advance|balance|full)$/)) {
      const { user } = ensureAuth(db, headers.get("Authorization"));
      const parts = path.split("/");
      const id = parts[4];
      const action = parts[5];
      const b = db.bookings.find((x) => x.id === id && x.customerId === user.id);
      if (!b) throw new LocalApiError(404, "Booking not found");
      if (action === "pay-advance") b.amountPaid = Math.max(b.amountPaid, b.advanceRequired);
      if (action === "pay-balance") b.amountPaid = b.totalWithGst;
      if (action === "pay-full") b.amountPaid = b.totalWithGst;
      if (b.amountPaid >= b.totalWithGst - 0.01) {
        if (b.rawStatus === "pending_payment") b.rawStatus = "confirmed";
      } else if (b.amountPaid > 0 && b.rawStatus === "pending_payment") {
        b.rawStatus = "confirmed";
      }
      b.displayStatus = displayStatus(b.rawStatus);
      b.updatedAt = nowIso();
      saveDb(db);
      return { ok: true };
    }

    if (method === "GET" && path === "/api/customer/quotes") {
      const { user } = ensureAuth(db, headers.get("Authorization"));
      if (user.role !== "customer") throw new LocalApiError(403, "Forbidden");
      const quotes = db.quotes
        .filter((q) => q.status === "pending")
        .filter((q) => db.leads.find((l) => l.id === q.leadId)?.customerId === user.id)
        .map((q) => {
          const lead = db.leads.find((l) => l.id === q.leadId)!;
          const vendor = db.vendors.find((v) => v.id === q.vendorId);
          const totals = computeGstBreakdown(q.amount, db.settings.gstPercentage, db.settings.gstEnabled);
          return {
            id: q.id,
            vendor: vendor?.companyName ?? "Vendor",
            route: `${lead.pickup} → ${lead.drop}`,
            bus: lead.busType,
            price: formatInr(totals.totalWithGst),
            amount: totals.totalWithGst,
            quoteSubtotal: totals.subtotal,
            gstAmount: totals.gstAmount,
            totalWithGst: totals.totalWithGst,
            rating: vendor?.rating ?? 4.2,
            responseTime: `${q.responseMinutes} min`,
            responseMinutes: q.responseMinutes,
            inclusions: q.inclusions ?? "",
          };
        });
      return { quotes };
    }

    if (method === "POST" && path.match(/^\/api\/customer\/quotes\/[^/]+\/accept$/)) {
      const { user } = ensureAuth(db, headers.get("Authorization"));
      if (user.role !== "customer") throw new LocalApiError(403, "Forbidden");
      const qid = path.split("/")[4];
      const q = db.quotes.find((x) => x.id === qid);
      if (!q) throw new LocalApiError(404, "Quote not found");
      const lead = db.leads.find((l) => l.id === q.leadId);
      if (!lead || lead.customerId !== user.id) throw new LocalApiError(403, "Forbidden");
      if (!body.policyAccepted) throw new LocalApiError(400, "You must accept the refund & cancellation policy.");
      const paymentType: "advance" | "full" = body.paymentType === "full" ? "full" : "advance";
      const totals = computeGstBreakdown(q.amount, db.settings.gstPercentage, db.settings.gstEnabled);
      const advanceRequired = paymentType === "full" ? totals.totalWithGst : Math.round(totals.totalWithGst * COMPANY.advanceFractionDefault * 100) / 100;
      const booking: BookingRow = {
        id: uid(),
        leadId: lead.id,
        quoteId: q.id,
        customerId: user.id,
        vendorId: q.vendorId,
        subtotal: totals.subtotal,
        gstAmount: totals.gstAmount,
        totalWithGst: totals.totalWithGst,
        paymentType,
        advanceRequired,
        amountPaid: 0,
        rawStatus: "pending_payment",
        displayStatus: "Pending payment",
        payoutOverride: "none",
        payoutStatus: "Pending",
        commissionDeducted: 0,
        payoutAmount: 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      };
      db.bookings.push(booking);
      q.status = "accepted";
      lead.acceptedQuoteId = q.id;
      db.quotes.forEach((other) => {
        if (other.leadId === lead.id && other.id !== q.id && other.status === "pending") other.status = "declined";
      });
      const vendorRow = db.vendors.find((v) => v.id === q.vendorId);
      const vendorAccount = vendorRow ? db.users.find((u) => u.id === vendorRow.userId) : null;
      const ref = bookingPublicRef(booking.id);
      logTransactionalEmail(
        db,
        `Your trip is booked — ${ref}`,
        `Send HTML email + booking-summary PDF: reference ${ref}, route ${lead.pickup} → ${lead.drop}, date ${lead.journeyDate}, bus ${lead.busType}, operator ${vendorRow?.companyName ?? "Operator"}, total ${formatInr(booking.totalWithGst)} incl. GST, payment plan (${paymentType}). Payment gateway link placeholder.`,
        `To: ${user.email}`,
      );
      logTransactionalEmail(
        db,
        `Booking accepted — ${ref}`,
        `Send HTML email to operator: customer ${user.name} (${user.email}) accepted your quote for ${lead.pickup} → ${lead.drop} on ${lead.journeyDate}. Booking ref ${ref}. Next steps: confirm vehicle & payment status.`,
        `To: ${vendorAccount?.email ?? vendorRow?.companyName ?? "vendor"}`,
      );
      saveDb(db);
      return { ok: true, bookingId: booking.id, bookingRef: ref };
    }

    if (method === "POST" && path.match(/^\/api\/customer\/quotes\/[^/]+\/decline$/)) {
      const { user } = ensureAuth(db, headers.get("Authorization"));
      const qid = path.split("/")[4];
      const q = db.quotes.find((x) => x.id === qid);
      if (!q) throw new LocalApiError(404, "Quote not found");
      const lead = db.leads.find((l) => l.id === q.leadId);
      if (!lead || lead.customerId !== user.id) throw new LocalApiError(403, "Forbidden");
      q.status = "declined";
      saveDb(db);
      return { ok: true };
    }

    if (method === "GET" && path === "/api/customer/reviews") {
      const { user } = ensureAuth(db, headers.get("Authorization"));
      const reviews = db.reviews.filter((r) => r.customerId === user.id);
      return { reviews };
    }

    if (method === "POST" && path === "/api/customer/reviews") {
      const { user } = ensureAuth(db, headers.get("Authorization"));
      const review: ReviewRow = { id: uid(), customerId: user.id, vendorId: String(body.vendorId || ""), rating: Number(body.rating || 5), comment: body.comment, createdAt: nowIso() };
      db.reviews.push(review);
      const vendorReviews = db.reviews.filter((r) => r.vendorId === review.vendorId);
      const vendor = db.vendors.find((v) => v.id === review.vendorId);
      if (vendor && vendorReviews.length > 0) {
        const avg = vendorReviews.reduce((s, r) => s + r.rating, 0) / vendorReviews.length;
        vendor.rating = Math.round(avg * 10) / 10;
      }
      saveDb(db);
      return { ok: true, id: review.id };
    }

    if (method === "PATCH" && path === "/api/customer/profile") {
      const { user } = ensureAuth(db, headers.get("Authorization"));
      user.name = body.name ?? user.name;
      user.phone = body.phone ?? user.phone;
      saveDb(db);
      return { ok: true };
    }

    // Vendor
    if (method === "GET" && path === "/api/vendor/leads") {
      const { user, vendorId } = ensureAuth(db, headers.get("Authorization"));
      if (user.role !== "vendor" || !vendorId) throw new LocalApiError(403, "Forbidden");
      const vendor = db.vendors.find((v) => v.id === vendorId);
      const leads = db.leads
        .filter((l) => !l.acceptedQuoteId)
        .filter((l) => !l.rejectedByVendorIds.includes(vendorId))
        .map((l) => {
          const mine = db.quotes.find((q) => q.leadId === l.id && q.vendorId === vendorId);
          return {
            id: l.id,
            customer: l.guestName || db.users.find((u) => u.id === l.customerId)?.name || "Guest",
            from: l.pickup,
            to: l.drop,
            date: new Date(l.journeyDate).toLocaleDateString("en-IN"),
            passengers: l.passengers,
            bus: l.busType,
            purpose: l.purpose,
            status: mine ? (mine.status === "accepted" ? "Accepted" : mine.status === "declined" ? "Rejected" : "Quoted") : "New",
          };
        });
      const notice = vendor?.status !== "active" ? "Your account is pending approval. You can browse leads but cannot send quotes." : undefined;
      return { leads, notice };
    }

    if (method === "POST" && path.match(/^\/api\/vendor\/leads\/[^/]+\/reject$/)) {
      const { vendorId } = ensureAuth(db, headers.get("Authorization"));
      if (!vendorId) throw new LocalApiError(403, "Forbidden");
      const id = path.split("/")[4];
      const lead = db.leads.find((l) => l.id === id);
      if (!lead) throw new LocalApiError(404, "Lead not found");
      if (!lead.rejectedByVendorIds.includes(vendorId)) lead.rejectedByVendorIds.push(vendorId);
      saveDb(db);
      return { ok: true };
    }

    if (method === "POST" && path === "/api/vendor/quotes") {
      const { vendorId } = ensureAuth(db, headers.get("Authorization"));
      if (!vendorId) throw new LocalApiError(403, "Forbidden");
      const vendor = db.vendors.find((v) => v.id === vendorId);
      if (!vendor || vendor.status !== "active") throw new LocalApiError(400, "Vendor must be active to send quotes");
      const lead = db.leads.find((l) => l.id === body.leadId);
      if (!lead) throw new LocalApiError(404, "Lead not found");
      const existing = db.quotes.find((q) => q.leadId === lead.id && q.vendorId === vendorId && q.status === "pending");
      if (existing) throw new LocalApiError(409, "Quote already sent for this lead");
      const quote: QuoteRow = {
        id: uid(),
        leadId: lead.id,
        vendorId,
        amount: Number(body.amount || 0),
        inclusions: body.inclusions,
        terms: body.terms,
        status: "pending",
        responseMinutes: Math.max(5, Math.floor(Math.random() * 180)),
        createdAt: nowIso(),
      };
      db.quotes.push(quote);
      const customerAccount = lead.customerId ? db.users.find((u) => u.id === lead.customerId) : null;
      const recipientEmail = lead.guestEmail || customerAccount?.email || "—";
      logTransactionalEmail(
        db,
        `New price proposal for your trip (${lead.pickup} → ${lead.drop})`,
        `Send branded HTML email: ${vendor.companyName} shared a quote of ${formatInr(quote.amount)} (rental subtotal; GST at checkout). Quote ID: ${quote.id}. Include CTA to My Quotes. Attach optional summary PDF in production.`,
        `To: ${recipientEmail}`,
      );
      saveDb(db);
      return { ok: true, quoteId: quote.id };
    }

    if (method === "GET" && path === "/api/vendor/quotes") {
      const { vendorId } = ensureAuth(db, headers.get("Authorization"));
      if (!vendorId) throw new LocalApiError(403, "Forbidden");
      const quotes = db.quotes
        .filter((q) => q.vendorId === vendorId)
        .map((q) => {
          const lead = db.leads.find((l) => l.id === q.leadId)!;
          return {
            id: q.id,
            lead: `${lead.pickup} → ${lead.drop}`,
            amount: formatInr(q.amount),
            status: q.status,
          };
        });
      return { quotes };
    }

    if (method === "GET" && path === "/api/vendor/dashboard-stats") {
      const { vendorId } = ensureAuth(db, headers.get("Authorization"));
      if (!vendorId) throw new LocalApiError(403, "Forbidden");
      const bookings = db.bookings.filter((b) => b.vendorId === vendorId);
      const completed = bookings.filter((b) => b.rawStatus === "completed");
      const totalEarnings = completed.reduce((s, b) => s + b.subtotal, 0);
      const netAfterCommission = completed.reduce((s, b) => s + (b.payoutAmount || 0), 0);
      const recentLeads = db.leads.slice(-8).reverse().map((l) => {
        const q = db.quotes.find((x) => x.leadId === l.id && x.vendorId === vendorId);
        return {
          id: l.id,
          customer: l.guestName || db.users.find((u) => u.id === l.customerId)?.name || "Guest",
          route: `${l.pickup} → ${l.drop}`,
          date: new Date(l.journeyDate).toLocaleDateString("en-IN"),
          bus: l.busType,
          status: q ? (q.status === "accepted" ? "Accepted" : "Quoted") : "New",
        };
      });
      const totalBuses = db.cms.length; // replaced below
      const busesCount = db.vendors.find((v) => v.id === vendorId)?.fleetSize ?? 0;
      return {
        totalBuses: String(busesCount || totalBuses || 0),
        activeLeads: String(recentLeads.filter((l) => l.status === "New").length),
        confirmedBookings: String(bookings.filter((b) => ["confirmed", "on_trip", "completed"].includes(b.rawStatus)).length),
        totalEarnings: formatInr(totalEarnings),
        netAfterCommission: formatInr(netAfterCommission),
        commissionPercent: db.settings.commissionPercent,
        payoutRule: "Automatic payout after trip completion and payment settlement.",
        avgRating: String(db.vendors.find((v) => v.id === vendorId)?.rating ?? 4.2),
        thisMonth: formatInr(totalEarnings),
        recentLeads,
      };
    }

    if (method === "GET" && path === "/api/vendor/profile") {
      const { user, vendorId } = ensureAuth(db, headers.get("Authorization"));
      const vendor = db.vendors.find((v) => v.id === vendorId);
      if (!vendor) throw new LocalApiError(404, "Vendor not found");
      return {
        profile: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          companyName: vendor.companyName,
          gstNumber: vendor.gstNumber || "",
          operatingCities: vendor.operatingCities || "",
          address: vendor.address || "",
          status: vendor.status,
        },
      };
    }

    if (method === "PATCH" && path === "/api/vendor/profile") {
      const { user, vendorId } = ensureAuth(db, headers.get("Authorization"));
      const vendor = db.vendors.find((v) => v.id === vendorId);
      if (!vendor) throw new LocalApiError(404, "Vendor not found");
      user.name = body.name ?? user.name;
      user.phone = body.phone ?? user.phone;
      vendor.companyName = body.companyName ?? vendor.companyName;
      vendor.gstNumber = body.gstNumber ?? vendor.gstNumber;
      vendor.operatingCities = body.operatingCities ?? vendor.operatingCities;
      vendor.address = body.address ?? vendor.address;
      saveDb(db);
      return { ok: true };
    }

    // We store buses as CMS page-like rows with special prefix to avoid another collection
    const busRows = db.cms.filter((c) => c.kind === "page" && c.slug?.startsWith("bus:"));
    if (method === "GET" && path === "/api/vendor/buses") {
      const { vendorId } = ensureAuth(db, headers.get("Authorization"));
      const buses = busRows
        .filter((b) => b.body?.includes(`"vendorId":"${vendorId}"`))
        .map((b) => {
          const parsed = b.body ? JSON.parse(b.body) as any : {};
          return parsed;
        });
      return { buses };
    }

    if (method === "POST" && path === "/api/vendor/buses") {
      const { vendorId } = ensureAuth(db, headers.get("Authorization"));
      const bus = {
        id: uid(),
        vendorId,
        name: body.name,
        seats: Number(body.seats || 0),
        ac: !!body.ac,
        sleeper: !!body.sleeper,
        status: body.status || "active",
      };
      db.cms.push({
        id: uid(),
        kind: "page",
        slug: `bus:${bus.id}`,
        title: bus.name,
        body: JSON.stringify(bus),
        status: "Published",
        date: new Date().toLocaleDateString("en-IN"),
      });
      const v = db.vendors.find((x) => x.id === vendorId);
      if (v) v.fleetSize = (v.fleetSize || 0) + 1;
      saveDb(db);
      return { ok: true, id: bus.id };
    }

    if (method === "PATCH" && path.match(/^\/api\/vendor\/buses\/[^/]+$/)) {
      const id = path.split("/")[4];
      const row = db.cms.find((c) => c.slug === `bus:${id}`);
      if (!row) throw new LocalApiError(404, "Bus not found");
      const bus = row.body ? JSON.parse(row.body) as any : {};
      const merged = { ...bus, ...body, id };
      row.title = merged.name;
      row.body = JSON.stringify(merged);
      saveDb(db);
      return { ok: true };
    }

    if (method === "DELETE" && path.match(/^\/api\/vendor\/buses\/[^/]+$/)) {
      const id = path.split("/")[4];
      const idx = db.cms.findIndex((c) => c.slug === `bus:${id}`);
      if (idx < 0) throw new LocalApiError(404, "Bus not found");
      db.cms.splice(idx, 1);
      saveDb(db);
      return { ok: true };
    }

    if (method === "GET" && path === "/api/vendor/bookings") {
      const { vendorId } = ensureAuth(db, headers.get("Authorization"));
      if (!vendorId) throw new LocalApiError(403, "Forbidden");
      const bookings = db.bookings.filter((b) => b.vendorId === vendorId).map((b) => {
        const lead = db.leads.find((l) => l.id === b.leadId)!;
        return {
          id: b.id,
          customer: lead.guestName || db.users.find((u) => u.id === b.customerId)?.name || "Guest",
          route: `${lead.pickup} → ${lead.drop}`,
          date: new Date(lead.journeyDate).toLocaleDateString("en-IN"),
          bus: lead.busType,
          amount: formatInr(b.totalWithGst),
          status: b.displayStatus,
          rawStatus: b.rawStatus,
          payoutStatus: b.payoutStatus,
          commissionDeducted: formatInr(b.commissionDeducted || 0),
          netPayout: formatInr(b.payoutAmount || 0),
        };
      });
      return { bookings };
    }

    if (method === "PATCH" && path.match(/^\/api\/vendor\/bookings\/[^/]+\/status$/)) {
      const { vendorId } = ensureAuth(db, headers.get("Authorization"));
      const id = path.split("/")[4];
      const b = db.bookings.find((x) => x.id === id && x.vendorId === vendorId);
      if (!b) throw new LocalApiError(404, "Booking not found");
      b.rawStatus = body.status;
      b.displayStatus = displayStatus(b.rawStatus);
      if (b.rawStatus === "completed") applyAutoPayout(db, b);
      b.updatedAt = nowIso();
      saveDb(db);
      return { ok: true };
    }

    if (method === "GET" && path === "/api/vendor/earnings") {
      const { vendorId } = ensureAuth(db, headers.get("Authorization"));
      if (!vendorId) throw new LocalApiError(403, "Forbidden");
      const mine = db.bookings.filter((b) => b.vendorId === vendorId);
      const completed = mine.filter((b) => b.rawStatus === "completed");
      const total = completed.reduce((s, b) => s + b.subtotal, 0);
      const net = completed.reduce((s, b) => s + (b.payoutAmount || 0), 0);
      const tx = completed.map((b) => ({
        id: `TXN-${b.id.slice(-6)}`,
        booking: b.id.slice(-8),
        amount: formatInr(b.subtotal),
        commission: formatInr(b.commissionDeducted || vendorCommissionAmount(b.subtotal, db.settings.commissionPercent)),
        net: formatInr(b.payoutAmount || vendorNetAfterCommission(b.subtotal, db.settings.commissionPercent)),
        date: new Date(b.updatedAt).toLocaleDateString("en-IN"),
        status: b.payoutStatus,
      }));
      return {
        totalEarnings: formatInr(total),
        netPayoutTotal: formatInr(net),
        pendingPayments: mine.filter((b) => b.payoutStatus !== "Paid").length,
        thisMonth: formatInr(total),
        commissionDisplay: `${db.settings.commissionPercent}%`,
        payoutRule: "Automatic payout after trip completion. Admin can hold or release payout.",
        transactions: tx,
      };
    }

    // Admin
    if (method === "GET" && path === "/api/admin/stats") {
      ensureAuth(db, headers.get("Authorization"));
      const totalUsers = db.users.length;
      const activeVendors = db.vendors.filter((v) => v.status === "active").length;
      const totalBookings = db.bookings.length;
      const totalBuses = db.cms.filter((c) => c.slug?.startsWith("bus:")).length;
      const revenue = db.bookings.reduce((s, b) => s + b.totalWithGst, 0);
      const commission = db.bookings.reduce((s, b) => s + vendorCommissionAmount(b.subtotal, db.settings.commissionPercent), 0);
      return {
        totalUsers,
        activeVendors,
        totalBookings,
        totalBuses,
        revenueDisplay: formatInr(revenue),
        commissionDisplay: formatInr(commission),
        commissionPercent: db.settings.commissionPercent,
        gstEnabled: db.settings.gstEnabled,
      };
    }

    if (method === "GET" && path === "/api/admin/bookings") {
      ensureAuth(db, headers.get("Authorization"));
      const bookings = db.bookings.map((b) => {
        const lead = db.leads.find((l) => l.id === b.leadId)!;
        const vendor = db.vendors.find((v) => v.id === b.vendorId);
        const customer = db.users.find((u) => u.id === b.customerId);
        return {
          id: b.id,
          customer: customer?.name || lead.guestName || "Guest",
          vendor: vendor?.companyName ?? "Vendor",
          route: `${lead.pickup} → ${lead.drop}`,
          amount: formatInr(b.totalWithGst),
          subtotal: formatInr(b.subtotal),
          gstAmount: formatInr(b.gstAmount),
          totalWithGst: formatInr(b.totalWithGst),
          paymentType: b.paymentType,
          paymentStatus: paymentLabel(b),
          status: b.rawStatus,
          date: new Date(b.createdAt).toLocaleDateString("en-IN"),
          payoutStatus: b.payoutStatus,
          commissionDeducted: formatInr(b.commissionDeducted || vendorCommissionAmount(b.subtotal, db.settings.commissionPercent)),
          vendorPayout: formatInr(b.payoutAmount || vendorNetAfterCommission(b.subtotal, db.settings.commissionPercent)),
        };
      });
      return { bookings };
    }

    if (method === "PATCH" && path.match(/^\/api\/admin\/bookings\/[^/]+$/)) {
      ensureAuth(db, headers.get("Authorization"));
      const id = path.split("/")[4];
      const b = db.bookings.find((x) => x.id === id);
      if (!b) throw new LocalApiError(404, "Booking not found");
      b.rawStatus = body.status;
      b.displayStatus = displayStatus(b.rawStatus);
      if (b.rawStatus === "completed") applyAutoPayout(db, b);
      b.updatedAt = nowIso();
      saveDb(db);
      return { ok: true };
    }

    if (method === "POST" && path.match(/^\/api\/admin\/bookings\/[^/]+\/payout-override$/)) {
      ensureAuth(db, headers.get("Authorization"));
      const id = path.split("/")[4];
      const b = db.bookings.find((x) => x.id === id);
      if (!b) throw new LocalApiError(404, "Booking not found");
      if (body.action === "hold") {
        b.payoutOverride = "hold";
        b.payoutStatus = "On hold";
      } else {
        b.payoutOverride = "none";
        if (b.rawStatus === "completed") applyAutoPayout(db, b);
      }
      b.updatedAt = nowIso();
      saveDb(db);
      return { ok: true };
    }

    if (method === "GET" && path === "/api/admin/vendors") {
      ensureAuth(db, headers.get("Authorization"));
      const vendors = db.vendors.map((v) => {
        const user = db.users.find((u) => u.id === v.userId);
        return {
          id: v.id,
          name: v.companyName,
          owner: user?.name || "—",
          city: v.city || "—",
          buses: v.fleetSize || 0,
          kyc: v.status === "active" ? "Approved" : v.status === "pending" ? "Pending" : "Rejected",
          status: v.status === "active" ? "Active" : v.status === "blocked" ? "Blocked" : v.status === "rejected" ? "Rejected" : "Pending",
          rawStatus: v.status,
        };
      });
      return { vendors };
    }

    if (method === "PATCH" && path.match(/^\/api\/admin\/vendors\/[^/]+$/)) {
      ensureAuth(db, headers.get("Authorization"));
      const id = path.split("/")[4];
      const v = db.vendors.find((x) => x.id === id);
      if (!v) throw new LocalApiError(404, "Vendor not found");
      v.status = body.status;
      saveDb(db);
      return { ok: true };
    }

    if (method === "GET" && path === "/api/admin/users") {
      ensureAuth(db, headers.get("Authorization"));
      const users = db.users.filter((u) => u.role === "customer").map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        blocked: !!u.blocked,
        joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-IN") : "—",
        status: u.blocked ? "Blocked" : "Active",
        bookings: db.bookings.filter((b) => b.customerId === u.id).length,
      }));
      return { users };
    }

    if (method === "PATCH" && path.match(/^\/api\/admin\/users\/[^/]+$/)) {
      ensureAuth(db, headers.get("Authorization"));
      const id = path.split("/")[4];
      const u = db.users.find((x) => x.id === id);
      if (!u) throw new LocalApiError(404, "User not found");
      u.blocked = !!body.blocked;
      saveDb(db);
      return { ok: true };
    }

    if (method === "GET" && path === "/api/admin/payments") {
      ensureAuth(db, headers.get("Authorization"));
      const payments = db.bookings.map((b) => {
        const vendor = db.vendors.find((v) => v.id === b.vendorId);
        return {
          id: `PAY-${b.id.slice(-8)}`,
          booking: b.id.slice(-8),
          vendor: vendor?.companyName ?? "Vendor",
          amount: formatInr(b.totalWithGst),
          commission: formatInr(vendorCommissionAmount(b.subtotal, db.settings.commissionPercent)),
          payout: formatInr(vendorNetAfterCommission(b.subtotal, db.settings.commissionPercent)),
          status: b.payoutStatus === "Paid" ? "Paid" : b.payoutStatus,
          date: new Date(b.updatedAt).toLocaleDateString("en-IN"),
          bookingId: b.id,
        };
      });
      return { payments };
    }

    if (method === "POST" && path.match(/^\/api\/admin\/payments\/[^/]+\/refund$/)) {
      ensureAuth(db, headers.get("Authorization"));
      const payId = path.split("/")[4];
      const id = db.bookings.find((b) => `PAY-${b.id.slice(-8)}` === payId)?.id;
      if (!id) throw new LocalApiError(404, "Payment not found");
      const b = db.bookings.find((x) => x.id === id)!;
      b.payoutStatus = "Refunded";
      b.rawStatus = "cancelled";
      b.displayStatus = "Cancelled";
      b.updatedAt = nowIso();
      saveDb(db);
      return { ok: true };
    }

    if (method === "GET" && path === "/api/admin/cms") {
      ensureAuth(db, headers.get("Authorization"));
      return { items: db.cms };
    }

    if (method === "POST" && path === "/api/admin/cms") {
      ensureAuth(db, headers.get("Authorization"));
      const item: CmsRow = {
        id: uid(),
        kind: body.kind,
        title: body.title,
        body: body.body,
        question: body.question,
        answer: body.answer,
        slug: body.slug,
        status: "Published",
        date: new Date().toLocaleDateString("en-IN"),
      };
      db.cms.unshift(item);
      saveDb(db);
      return { ok: true, id: item.id };
    }

    if (method === "PATCH" && path.match(/^\/api\/admin\/cms\/[^/]+$/)) {
      ensureAuth(db, headers.get("Authorization"));
      const id = path.split("/")[4];
      const item = db.cms.find((c) => c.id === id);
      if (!item) throw new LocalApiError(404, "Item not found");
      Object.assign(item, {
        title: body.title ?? item.title,
        body: body.body ?? item.body,
        question: body.question ?? item.question,
        answer: body.answer ?? item.answer,
        slug: body.slug ?? item.slug,
        status: body.status ? "Published" : item.status,
      });
      saveDb(db);
      return { ok: true };
    }

    if (method === "DELETE" && path.match(/^\/api\/admin\/cms\/[^/]+$/)) {
      ensureAuth(db, headers.get("Authorization"));
      const id = path.split("/")[4];
      const i = db.cms.findIndex((c) => c.id === id);
      if (i < 0) throw new LocalApiError(404, "Item not found");
      db.cms.splice(i, 1);
      saveDb(db);
      return { ok: true };
    }

    if (method === "GET" && path === "/api/admin/settings") {
      ensureAuth(db, headers.get("Authorization"));
      return db.settings;
    }

    if (method === "PATCH" && path === "/api/admin/settings") {
      ensureAuth(db, headers.get("Authorization"));
      db.settings.legalName = body.name ?? db.settings.legalName;
      db.settings.siteName = body.name ?? db.settings.siteName;
      db.settings.about = body.about ?? db.settings.about;
      db.settings.operatingLocations = body.operatingLocations ?? db.settings.operatingLocations;
      db.settings.contactPhone = body.contactPhone ?? db.settings.contactPhone;
      db.settings.contactEmail = body.contactEmail ?? db.settings.contactEmail;
      db.settings.gstNumber = body.gstNumber ?? db.settings.gstNumber;
      db.settings.gstEnabled = body.gstEnabled ?? db.settings.gstEnabled;
      db.settings.gstPercentage = Number(body.gstPercentage ?? db.settings.gstPercentage);
      db.settings.commissionPercent = Number(body.commissionPercent ?? db.settings.commissionPercent);
      db.settings.quoteWindowHours = Number(body.quoteWindowHours ?? db.settings.quoteWindowHours);
      saveDb(db);
      return { ok: true };
    }

    if (method === "GET" && path === "/api/admin/notification-logs") {
      ensureAuth(db, headers.get("Authorization"));
      return { logs: db.notificationLogs };
    }

    if (method === "POST" && path === "/api/admin/notifications") {
      ensureAuth(db, headers.get("Authorization"));
      const log: NotificationLog = {
        id: uid(),
        channel: body.channel || "email",
        subject: body.subject || "",
        body: body.body || "",
        audience: body.audience || "",
        date: new Date().toLocaleString("en-IN"),
      };
      db.notificationLogs.unshift(log);
      saveDb(db);
      return { ok: true };
    }

    if (method === "GET" && path === "/api/admin/quotes") {
      ensureAuth(db, headers.get("Authorization"));
      const quotes = db.quotes.map((q) => {
        const lead = db.leads.find((l) => l.id === q.leadId);
        const vendor = db.vendors.find((v) => v.id === q.vendorId);
        return {
          id: q.id,
          vendor: vendor?.companyName ?? "Vendor",
          route: lead ? `${lead.pickup} → ${lead.drop}` : "—",
          amount: formatInr(q.amount),
          status: q.status,
        };
      });
      return { quotes };
    }

    /* ---------- B2B + offers + payouts (local parity) ---------- */
    const localOffers = (db as any).offers || [
      {
        id: "offer-local-1",
        title: "Welcome B2B Offer",
        slug: "welcome-b2b",
        type: "banner",
        code: "",
        status: "active",
        target: "all",
        priority: 10,
        href: "/b2b/register",
        description: "Corporate savings",
        banner: { url: "" },
      },
      {
        id: "offer-local-2",
        title: "CORP10",
        slug: "corp10",
        type: "coupon",
        code: "CORP10",
        discountType: "percent",
        discountValue: 10,
        status: "active",
        target: "all",
        priority: 20,
        href: "/book",
        description: "10% off",
        banner: { url: "" },
      },
    ];
    (db as any).offers = localOffers;
    if (!(db as any).companies) {
      (db as any).companies = [
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
    }
    if (!(db as any).payouts) (db as any).payouts = [];

    if (method === "POST" && path === "/api/auth/b2b/register") {
      if (db.users.some((u) => u.email === String(body.email || "").toLowerCase())) {
        throw new LocalApiError(409, "Email already registered");
      }
      const companyId = uid();
      (db as any).companies.push({
        id: companyId,
        companyName: body.companyName,
        email: body.companyEmail || body.email,
        phone: body.phone,
        gstin: body.gstin || "",
        status: "pending",
        creditLimit: 0,
        walletBalance: 0,
      });
      const user: UserRow = {
        id: uid(),
        email: String(body.email).toLowerCase(),
        password: body.password,
        name: body.contactName || body.name,
        phone: body.phone || "",
        role: "b2b",
        companyId,
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
      saveDb(db);
      return {
        token: tokenFor(user),
        user: { id: user.id, email: user.email, name: user.name, role: "b2b", companyId },
        company: { id: companyId, companyName: body.companyName, status: "pending" },
      };
    }

    if (method === "GET" && path === "/api/public/offers") {
      return { offers: localOffers.filter((o: any) => o.status === "active") };
    }
    if (method === "POST" && path === "/api/public/offers/validate-coupon") {
      const offer = localOffers.find((o: any) => o.type === "coupon" && o.code === String(body.code || "").toUpperCase());
      if (!offer) throw new LocalApiError(404, "Invalid coupon");
      const amount = Number(body.amount || 0);
      const discountAmount =
        offer.discountType === "percent"
          ? Math.round((amount * Number(offer.discountValue)) / 100)
          : Math.min(amount, Number(offer.discountValue || 0));
      return { ok: true, code: offer.code, discountAmount, discountType: offer.discountType, discountValue: offer.discountValue };
    }

    if (path.startsWith("/api/b2b/")) {
      ensureAuth(db, headers.get("Authorization"));
      const company = (db as any).companies[0];
      if (path === "/api/b2b/dashboard") {
        return {
          company,
          stats: {
            totalBookings: 0,
            activeBookings: 0,
            completedTrips: 0,
            totalSpendDisplay: "₹0",
            openInvoices: 0,
            employees: 1,
          },
        };
      }
      if (path === "/api/b2b/bookings" || path === "/api/b2b/trips") return { bookings: [] };
      if (path === "/api/b2b/employees") return { employees: [] };
      if (path === "/api/b2b/favourites") return { favourites: [] };
      if (path === "/api/b2b/wallet" || path === "/api/b2b/payments") {
        return { walletBalance: company?.walletBalance || 0, creditLimit: company?.creditLimit || 0, history: [] };
      }
      if (path === "/api/b2b/contracts") return { contracts: [] };
      if (path === "/api/b2b/invoices") return { invoices: [] };
      if (path === "/api/b2b/company") return { company };
      if (method === "POST" && path === "/api/b2b/employees") return { ok: true, employeeId: uid() };
      if (method === "POST" && path === "/api/b2b/favourites") return { ok: true, id: uid() };
    }

    if (method === "GET" && path === "/api/admin/b2b/companies") {
      ensureAuth(db, headers.get("Authorization"));
      return { companies: (db as any).companies };
    }
    if (method === "GET" && path.startsWith("/api/admin/b2b/companies/")) {
      ensureAuth(db, headers.get("Authorization"));
      const id = path.split("/").pop();
      const company = (db as any).companies.find((c: any) => c.id === id);
      if (!company) throw new LocalApiError(404, "Not found");
      return { company, contracts: [], employees: [], bookings: [], invoices: [] };
    }
    if (method === "PATCH" && path.startsWith("/api/admin/b2b/companies/")) {
      ensureAuth(db, headers.get("Authorization"));
      const id = path.split("/").pop();
      const company = (db as any).companies.find((c: any) => c.id === id);
      if (!company) throw new LocalApiError(404, "Not found");
      Object.assign(company, body);
      saveDb(db);
      return { ok: true, status: company.status };
    }
    if (method === "GET" && path === "/api/admin/offers") {
      ensureAuth(db, headers.get("Authorization"));
      return { offers: localOffers };
    }
    if (method === "POST" && path === "/api/admin/offers") {
      ensureAuth(db, headers.get("Authorization"));
      const o = { id: uid(), ...body, status: body.status || "active", banner: { url: "" } };
      localOffers.push(o);
      (db as any).offers = localOffers;
      saveDb(db);
      return { ok: true, id: o.id };
    }
    if (method === "DELETE" && path.startsWith("/api/admin/offers/")) {
      ensureAuth(db, headers.get("Authorization"));
      const id = path.split("/").pop();
      (db as any).offers = localOffers.filter((o: any) => o.id !== id);
      saveDb(db);
      return { ok: true };
    }
    if (method === "GET" && path === "/api/admin/payouts") {
      ensureAuth(db, headers.get("Authorization"));
      return { payouts: (db as any).payouts };
    }
    if (method === "POST" && path.startsWith("/api/admin/payouts/") && path.endsWith("/process")) {
      ensureAuth(db, headers.get("Authorization"));
      const id = path.split("/")[4];
      const p = (db as any).payouts.find((x: any) => x.id === id);
      if (!p) throw new LocalApiError(404, "Not found");
      p.status = body.action === "reject" ? "rejected" : body.action === "paid" ? "paid" : body.action === "partial" ? "partial" : "approved";
      if (body.transactionId) p.transactionId = body.transactionId;
      saveDb(db);
      return { ok: true, status: p.status };
    }
    if (method === "GET" && path === "/api/vendor/payouts") {
      ensureAuth(db, headers.get("Authorization"));
      return { payouts: (db as any).payouts };
    }
    if (method === "POST" && path === "/api/vendor/payouts") {
      ensureAuth(db, headers.get("Authorization"));
      const p = {
        id: uid(),
        vendor: "Vendor",
        amountRequested: 5000,
        amountApproved: 0,
        amountRequestedDisplay: "₹5,000",
        amountApprovedDisplay: "₹0",
        status: "pending",
        transactionId: "",
      };
      (db as any).payouts.push(p);
      saveDb(db);
      return { ok: true, id: p.id };
    }
    if (method === "GET" && path.startsWith("/api/admin/bookings/") && path !== "/api/admin/bookings") {
      ensureAuth(db, headers.get("Authorization"));
      const id = path.split("/").pop()!;
      return {
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
      };
    }

    throw new LocalApiError(404, `Route not found: ${method} ${path}`);
  } catch (err) {
    if (err instanceof LocalApiError) {
      throw err;
    }
    throw new LocalApiError(500, err instanceof Error ? err.message : "Unknown error");
  }
}
