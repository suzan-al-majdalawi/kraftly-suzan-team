require("dotenv").config({
  path: require("path").join(__dirname, ".env"),
});

const express = require("express");
const jwt = require("jsonwebtoken");

const SECRET = process.env.JWT_SECRET;

if (!SECRET) {
  throw new Error("JWT_SECRET saknas i mock-api/.env");
}

const app = express();

app.use(express.json());

// CORS

app.use((req, res, next) => {
  if (req.url.startsWith("/api/v2/auth/login")) {
    req.url = req.url.replace(/^\/api\/v2\/auth\/login/, "/api/login");
  } else if (req.url.startsWith("/api/v2/auth/refresh")) {
    req.url = req.url.replace(/^\/api\/v2\/auth\/refresh/, "/api/auth/refresh");
  } else if (req.url.startsWith("/api/v2/auth/logout")) {
    req.url = req.url.replace(/^\/api\/v2\/auth\/logout/, "/api/auth/logout");
  } else if (req.url.startsWith("/api/v2/")) {
    req.url = req.url.replace(/^\/api\/v2/, "/api");
  }

  next();
});

app.get("/healthz", (req, res) => res.send("ok"));

// Stöd både gamla /api-adresser och frontendens /api/v2-adresser.
app.use((req, res, next) => {
  if (req.url.startsWith("/api/v2/")) {
    req.url = req.url.replace(/^\/api\/v2/, "/api");
  }
  next();
});

// ---------------------------------------------------------------------------
// Databas för lokal utveckling och test
// ---------------------------------------------------------------------------
const users = [
  {
    id: 1,
    email: "anna.andersson@example.com",
    password: "sommar2026",
    name: "Anna Andersson",
    address: "Solvägen 12, 802 67 Gävle",
    contract: "Rörligt pris",
    customerNo: "K-104233",
    role: "customer",
  },
  {
    id: 2,
    email: "bo.bergstrom@example.com",
    password: "bo1234",
    name: "Bo Bergström",
    address: "Kvarnbacken 4, 621 45 Visby",
    contract: "Fast pris 1 år",
    customerNo: "K-208811",
    role: "customer",
  },
  {
    id: 3,
    email: "support@kraftly.se",
    password: "Kraftly2019!",
    name: "Kundservice",
    address: "Kraftly AB, Box 1, 111 22 Stockholm",
    contract: "-",
    customerNo: "K-000001",
    role: "support",
  },
];

const invoices = {
  "K-104233": [
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
  ],
  "K-208811": [
    {
      id: "F-2026-06",
      period: "Juni 2026",
      amount: 289,
      status: "Obetald",
      due: "2026-07-31",
    },
    {
      id: "F-2026-05",
      period: "Maj 2026",
      amount: 301,
      status: "Betald",
      due: "2026-06-30",
    },
  ],
  "K-000001": [],
};

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

const messages = {
  1: [
    {
      id: "m1",
      date: "2026-09-01",
      html: "Välkommen till <b>nya Mina sidor</b>! Här ser du förbrukning, fakturor och meddelanden från oss.",
    },
    {
      id: "m2",
      date: "2026-09-15",
      html: 'Din faktura för <b>juni</b> förfaller 31 juli. <a href="/fakturor">Se fakturan</a>.',
    },
  ],
  2: [
    {
      id: "m1",
      date: "2026-09-01",
      html: "Välkommen till <b>nya Mina sidor</b>!",
    },
  ],
  3: [],
};

const publicUser = ({
  id,
  name,
  email,
  address,
  contract,
  customerNo,
  role,
}) => ({ id, name, email, address, contract, customerNo, role });

const createToken = (user) =>
  jwt.sign(
    {
      sub: String(user.id),
      name: user.name,
      customerNo: user.customerNo,
      role: user.role,
    },
    SECRET,
    { expiresIn: "2h" },
  );

const setSessionCookie = (res, token) => {
  // Secure=false behövs för lokal HTTP-utveckling.
  // Använd HTTPS och Secure=true i en riktig driftsmiljö.
  res.cookie("kraftly_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
    maxAge: 2 * 60 * 60 * 1000,
  });
};

const clearSessionCookie = (res) => {
  res.clearCookie("kraftly_session", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  });
};

// Läser cookies utan extra paket.
const readCookie = (req, name) => {
  const cookies = (req.headers.cookie || "").split(";");

  const entry = cookies
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  return entry ? decodeURIComponent(entry.slice(name.length + 1)) : null;
};

const getToken = (req) => {
  const header = req.get("Authorization") || "";

  if (header.startsWith("Bearer ")) {
    return header.slice(7);
  }

  return readCookie(req, "kraftly_session");
};

// ---------------------------------------------------------------------------
// Auth – offentliga endpoints måste ligga före requireLogin
// ---------------------------------------------------------------------------
app.post("/api/login", (req, res) => {
  const { email, password } = req.body || {};

  const user = users.find((item) => item.email === email);

  if (!user) {
    return res.status(401).json({ error: "Okänd e-postadress" });
  }

  if (user.password !== password) {
    return res.status(401).json({ error: "Fel lösenord" });
  }

  const token = createToken(user);

  setSessionCookie(res, token);

  res.json({
    token,
    accessToken: token,
    name: user.name,
    user: publicUser(user),
  });
});

app.post("/api/auth/refresh", (req, res) => {
  const token = readCookie(req, "kraftly_session");

  if (!token) {
    return res.status(401).json({ error: "Ingen aktiv session" });
  }

  try {
    const payload = jwt.verify(token, SECRET);
    const user = users.find((item) => String(item.id) === payload.sub);

    if (!user) {
      clearSessionCookie(res);
      return res.status(401).json({ error: "Användaren finns inte" });
    }

    const accessToken = createToken(user);

    setSessionCookie(res, accessToken);

    res.json({
      accessToken,
      token: accessToken,
      name: user.name,
    });
  } catch {
    clearSessionCookie(res);
    res.status(401).json({ error: "Sessionen har gått ut" });
  }
});

app.post("/api/auth/logout", (req, res) => {
  clearSessionCookie(res);
  res.sendStatus(204);
});

// ---------------------------------------------------------------------------
// Skyddade endpoints
// ---------------------------------------------------------------------------
const requireLogin = (req, res, next) => {
  const token = getToken(req);

  if (!token) {
    return res.status(401).json({ error: "Logga in först" });
  }

  try {
    req.auth = jwt.verify(token, SECRET);
    req.user = users.find((user) => String(user.id) === req.auth.sub);

    if (!req.user) {
      return res.status(401).json({ error: "Användaren finns inte" });
    }

    next();
  } catch {
    res.status(401).json({ error: "Ogiltig eller utgången token" });
  }
};

app.use("/api", requireLogin);

app.get("/api/user", (req, res) => {
  res.json(publicUser(req.user));
});

app.put("/api/user", (req, res) => {
  const { name, email, address } = req.body || {};

  if (typeof name === "string") req.user.name = name;
  if (typeof email === "string") req.user.email = email;
  if (typeof address === "string") req.user.address = address;

  console.log("user updated:", req.user.email, req.user.address);

  res.json(publicUser(req.user));
});

app.get("/api/consumption", (req, res) => {
  setTimeout(() => res.json(consumption), 300);
});

app.get("/api/invoices", (req, res) => {
  const customerNo =
    req.user.role === "support" && req.query.customerNo
      ? req.query.customerNo
      : req.user.customerNo;

  res.json(invoices[customerNo] || []);
});

app.get("/api/messages", (req, res) => {
  res.json(messages[req.user.id] || []);
});

app.post("/api/move", (req, res) => {
  const { address, zip, city, date } = req.body || {};

  if (
    ![address, zip, city, date].every(
      (value) => typeof value === "string" && value.trim(),
    )
  ) {
    return res
      .status(400)
      .json({ error: "Fyll i adress, postnummer, ort och datum" });
  }

  const ref = `FLYTT-${Math.floor(Math.random() * 90000 + 10000)}`;

  if (!messages[req.user.id]) {
    messages[req.user.id] = [];
  }

  messages[req.user.id].push({
    id: ref,
    date: new Date().toISOString().slice(0, 10),
    html: `Vi har tagit emot din flyttanmälan till <b>${address}, ${zip} ${city}</b> (inflyttning ${date}). Referens ${ref}.`,
  });

  res.json({ ok: true, ref });
});

app.get("/api/admin/customers", (req, res) => {
  if (req.auth.role !== "support") {
    return res.status(403).json({ error: "Bara för kundservice" });
  }

  res.json(users.map(publicUser));
});

if (require.main === module) {
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`Kraftly campaign API on port ${port}`);
  });
}

module.exports = app;
