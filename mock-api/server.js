// Simple mock of Kraftly's API. Built for the demo -- NOT for production.
// Webbmakarna AB / M & J

const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

// Läs .env lokalt om filen finns
if (typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile();
  } catch {
    console.error("Failed to load .env file");
  }
}

// CORS -- opens everything so it just works
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");

  if (req.method === "OPTIONS") return res.sendStatus(200);

  next();
});

// Health check – ska fungera utan API-key
app.get("/healthz", (req, res) => {
  res.json({ ok: true });
});

// API keys från environment
const configuredKeys = new Set(
  (process.env.API_KEYS || process.env.API_KEY || "")
    .split(",")
    .map((key) => key.trim())
    .filter(Boolean),
);

if (configuredKeys.size === 0) {
  console.error("API_KEY eller API_KEYS saknas");
  process.exit(1);
}

// API-key krävs för alla /api-anrop
app.use("/api", (req, res, next) => {
  const key = req.get("X-Api-Key");

  if (!key || !configuredKeys.has(key)) {
    console.error(
      `API auth failed: ${req.method} ${req.originalUrl} from ${req.ip}`,
    );

    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
});

const user = {
  id: 1,
  name: "Anna Andersson",
  email: "anna.andersson@example.com",
  address: "Solvägen 12, 802 67 Gävle",
  contract: "Rörligt pris",
  customerNo: "K-104233",
};

const invoices = [
  {
    id: "F-2026-06",
    period: "Juni 2026",
    amount: 412,
    status: "Obetald",
    due: "2026-07-31",
  },
  {
    id: "F-2026-05",
    period: "Maj 2026",
    amount: 486,
    status: "Betald",
    due: "2026-06-30",
  },
  {
    id: "F-2026-04",
    period: "April 2026",
    amount: 655,
    status: "Betald",
    due: "2026-05-31",
  },
  {
    id: "F-2026-03",
    period: "Mars 2026",
    amount: 918,
    status: "Betald",
    due: "2026-04-30",
  },
  {
    id: "F-2026-02",
    period: "Februari 2026",
    amount: 1204,
    status: "Betald",
    due: "2026-03-31",
  },
  {
    id: "F-2026-01",
    period: "Januari 2026",
    amount: 1345,
    status: "Betald",
    due: "2026-02-28",
  },
];

const consumption = {
  unit: "kWh",
  months: [
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dec",
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Maj",
    "Jun",
  ],
  values: [210, 195, 260, 340, 520, 680, 730, 640, 470, 320, 240, 205],
  pricePerKwh: 1.42,
};

// Login
app.post("/api/login", (req, res) => {
  res.json({ token: "fake-token-123", name: user.name });
});

app.get("/api/user", (req, res) => res.json(user));

app.get("/api/consumption", (req, res) => {
  // quick fix: dashboard felt too fast in the demo, added a delay so the spinner shows /J
  setTimeout(() => res.json(consumption), 600);
});

app.get("/api/invoices", (req, res) => res.json(invoices));

app.post("/api/move", (req, res) => {
  console.error("Move request:", req.body);

  res.json({
    ok: true,
    ref: "FLYTT-" + Math.floor(Math.random() * 90000 + 10000),
  });
});

app.put("/api/user", (req, res) => {
  Object.assign(user, req.body);
  res.json(user);
});

app.listen(port, () => {
  console.error(`Mock API on http://localhost:${port}`);
});
