# DiscGolf Webapp

En webapplikasjon for diskgolfspillere, lagledere og klubbadministratorer.  
Med **runde-spilling**, **scoreboard i sanntid**, **kartvisning**, **klubbsider med nyheter og baner**, samt **turneringsadministrasjon** – alt med rollebasert tilgangskontroll.

---

## 🚀 Komme i gang

### Forutsetninger

- Node.js 20.16.0
- npm

### Installasjon

1. **Klon repositoryet**

   ```bash
   git clone <repository-url>
   cd DiscGolf_Webapp
   ```

2. **Installer avhengigheter**

   **Fra root-mappen (anbefalt):**

   ```bash
   npm run install:all
   ```

   **Eller manuelt:**

   ```bash
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

3. **Konfigurer miljøvariabler**

   **Backend:** Kopier `.env.example` til `.env` i `backend/` mappen og fyll ut verdiene:

   ```bash
   cd backend
   cp .env.example .env
   ```

   Rediger `backend/.env` med dine verdier:

   ```env
   MONGODB_URI=mongodb://localhost:27017/discgolf
   PORT=8000
   NODE_ENV=development
   SESSION_SECRET=ditt-session-secret-her
   REACT_APP_API_BASE_URL=http://localhost:8000
   EPOST_BRUKER=din-epost@gmail.com
   EPOST_PASSORD=ditt-app-passord
   ```

   **Frontend:** Kopier `.env.example` til `.env` i `frontend/` mappen:

   ```bash
   cd frontend
   cp .env.example .env
   ```

   Rediger `frontend/.env` for lokal utvikling:

   ```env
   REACT_APP_API_BASE_URL=http://localhost:8000
   ```

   **Merk:**

   - Vite leser automatisk `.env` filer fra `frontend/` mappen
   - Variabler som starter med `REACT_APP_` eller `VITE_` blir tilgjengelige i koden
   - For å generere en sikker `SESSION_SECRET`, kjør: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Kjøre prosjektet

**Fra root-mappen kan du kjøre:**

**Utvikling (starter både backend og frontend):**

```bash
npm run dev
```

Starter både backend (port 8000) og frontend (port 3000) samtidig.

**Kun backend:**

```bash
npm run dev:backend
```

**Kun frontend:**

```bash
npm run dev:frontend
```

**Produksjon:**

```bash
npm run build        # Bygger frontend
npm start            # Starter backend (produksjon)
npm run preview      # Preview av bygget frontend
```

### Testing

**Fra root-mappen:**

```bash
npm test                    # Kjører alle tester (backend + frontend)
npm run test:backend        # Kun backend-tester
npm run test:frontend       # Kun frontend-tester
npm run test:watch         # Watch mode for begge
```

**Eller fra hver mappe:**

```bash
cd backend && npm test
cd frontend && npm test -- --run
```

**Test coverage:**

```bash
cd backend && npm run test:coverage
cd frontend && npm run test:coverage
```

---

## 📚 Dokumentasjon

- **API dokumentasjon:** OpenAPI/Swagger spesifikasjon i `backend/openapi.json`
- **Miljøvariabler:** Se `.env.example` filer i `backend/` og `frontend/` for alle tilgjengelige variabler

---

## 🚀 Funksjoner

### Spill og konkurranse

- **Runder & Scoreboard**  
  Spill runder, registrer score og se oppdatert leaderboard i sanntid med Socket.IO.
- **Poengtavler**  
  Se historiske resultater og statistikk for spillere og klubber.
- **Turneringer**  
  Opprett og administrer turneringer med tidspunkter, baner og deltakere.

### Klubbadministrasjon

- **Klubbsider**  
  Opprett og administrer klubbprofiler med nyheter, baner og medlemmer.
- **Baner**  
  Opprett, rediger og administrer diskgolfbaner med detaljert informasjon.
- **Nyheter**  
  Publiser og administrer nyheter for klubben.
- **Medlemskap**  
  Håndter medlemskap, invitasjoner og abonnementer.

### Kart og visning

- **Kartvisning**  
  Interaktiv visning av baner og hull med Mapbox GL JS.
- **Baneinformasjon**  
  Detaljert informasjon om hver bane med reviews og vurderinger.

### Brukerhåndtering

- **Autentisering**  
  Sikker innlogging med Passport.js, passordtilbakestilling og glemt passord-funksjonalitet.
- **Brukerprofiler**  
  Administrer brukerinformasjon, endre passord og slette konto.
- **Rollebasert tilgangskontroll (RBAC)**  
  Ulike roller: spiller, lagleder, klubbadmin, hoved-admin (superadmin).

### Administrasjon

- **Admin Dashboard**  
  Sentral administrasjonspanel for superadmins.
- **Brukeradministrasjon**  
  Administrer alle brukere, roller og tilganger.
- **Systemlogg**  
  Spor alle systemhendelser og brukeraktiviteter.
- **Klubbadministrasjon**  
  Administrer alle klubber fra ett sentralt sted.

### Sanntid og kommunikasjon

- **Live oppdateringer**  
  Socket.IO gir oppdateringer av scoreboard, nyheter og invitasjoner uten sideoppfriskning.
- **Varsling**  
  Real-time varsler for invitasjoner, nyheter og viktige hendelser.

### Internasjonalisering

- **Flerspråklig støtte**  
  i18next for støtte av flere språk (norsk og engelsk).

---

## 🛠️ Teknologistack

### Backend

- **Node.js 20.16.0 + Express.js 5** – API-ruter, autentisering, RBAC.
- **MongoDB (MongoDB Node Driver 6)** – NoSQL-database for brukere, klubber, baner, runder, turneringer.
- **Passport.js + express-session** – Autentisering med local strategy og session management.
- **Socket.IO 4** – Sanntid scoreoppdateringer, nyheter og invitasjoner.
- **Sikkerhetslag:**
  - **Helmet** – HTTP header security.
  - **CORS** – Cross-Origin Resource Sharing konfigurert.
  - **express-rate-limit** – Rate limiting for API-endepunkter.
  - **Custom CSRF protection** – Double-submit cookie pattern.
  - **express-validator** – Input validering og sanitization.
- **Nodemailer** – E-post sending for passordtilbakestilling og kontaktskjema.
- **Jest + Supertest** – Testing framework for API og middleware.

### Frontend

- **React.js 19** – Moderne UI med gjenbrukbare komponenter og hooks.
- **Vite 7** – Rask build tool og dev server (migrert fra Create React App).
- **React Router v5** – Navigasjon mellom sider med beskyttede ruter.
- **Tailwind CSS 4** – Utility-first CSS for rask og responsiv styling.
- **fetch API** – Native API-kall til backend.
- **Socket.IO-client** – Live scoreboard, nyheter og invitasjoner.
- **Mapbox GL JS** – Interaktive kartvisninger for baner.
- **i18next** – Internasjonalisering (norsk/engelsk).
- **Vitest** – Testing framework med jsdom.

---

## 📐 Arkitektur

Applikasjonen følger **MERN-stackens trelagsmodell**:

1. **Frontend** – React-app som kommuniserer med API-et.  
2. **Backend** – Express-server med API-ruter og RBAC.  
3. **Database** – MongoDB Atlas for datalagring.

**Kommunikasjon:**

- RESTful API-er for CRUD-operasjoner.
- WebSockets (Socket.IO) for sanntid:
  - `rundeLagret` – Oppdatering når en runde lagres.
  - `akseptertOppdatert` – Oppdatering av aksepterte spillere.
  - `akseptertFerdig` – Når alle spillere har akseptert.
  - `nyhetOppdatert` – Når nye nyheter publiseres.
  - `invitasjonOppdatert` – Når invitasjoner sendes/oppdateres.

**Prosjektstruktur:**

```text
DiscGolf_Webapp/
├── backend/
│   ├── __tests__/          # Jest tester
│   ├── models/            # MongoDB modeller
│   ├── ruter/             # API ruter
│   │   ├── brukerhandtering/
│   │   ├── csrf.js
│   │   ├── klubbhandtering.js
│   │   └── Turneringer.js
│   ├── app.js             # Express app
│   └── db.js              # Database tilkobling
├── frontend/
│   ├── src/
│   │   ├── _components/   # Gjenbrukbare komponenter
│   │   ├── Admin/        # Admin-komponenter
│   │   ├── BrukerHandtering/
│   │   ├── KlubbHandtering/
│   │   ├── test/         # Vitest tester
│   │   └── utils/        # Hjelpefunksjoner
│   ├── public/           # Statiske filer
│   └── vite.config.js    # Vite konfigurasjon
└── package.json          # Root scripts
```

---

## 🔐 Roller og tilgang

| Rolle                    | Rettigheter                                                                                                                                    |
|--------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| Spiller                  | Delta i runder, se leaderboard, opprette profil, se klubbsider                                                                                 |
| Lagleder                 | Administrere lag, invitere spillere, opprette runder                                                                                           |
| Klubbadmin               | Opprette/redigere baner, administrere klubbside, publisere nyheter, administrere medlemmer                                                       |
| Hoved-admin (Superadmin) | Full tilgang: brukeradministrasjon, systemlogg, globale innstillinger, administrere alle klubber                                               |

## 🧪 Testing

Prosjektet har omfattende testdekning:

- **Backend:** 41 tester med Jest
  - CSRF protection
  - Validering
  - Systemlogger
  - Tilgangskontroll
  - Turneringer
  - Klubbhandtering
  - Brukerhandtering

- **Frontend:** 13 tester med Vitest
  - Komponentrenderering
  - Brukerinteraksjoner
  - Routing

Kjør alle tester: `npm test`

## 🔒 Sikkerhet

Prosjektet implementerer flere sikkerhetslag:

- **CSRF Protection** – Custom implementasjon med double-submit cookie pattern
- **Rate Limiting** – Beskyttelse mot brute-force angrep på innlogging
- **Input Validering** – express-validator for all brukerinput
- **Session Security** – Secure cookies, httpOnly, sameSite i produksjon
- **Helmet** – HTTP security headers
- **CORS** – Konfigurert for spesifikke origins
- **Passordhashing** – bcryptjs for sikker lagring av passord

---

## 📄 Lisens

Dette prosjektet er lisensiert under MIT License.

**Programmerere:**

- Bjarne Hovd Beruldsen
- Laurent Zogaj
- Abdinasir Ali
- Severin Waller Sørensen
- Ylli Ujkani

Se [LICENSE](LICENSE) filen for detaljer.
