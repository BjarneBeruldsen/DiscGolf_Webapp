# DiscGolf Webapp

En webapplikasjon for diskgolfspillere, lagledere og klubbadministratorer.  
Med **runde-spilling**, **scoreboard i sanntid**, **kartvisning**, **klubbsider med nyheter og baner**, samt **turneringsadministrasjon** – alt med rollebasert tilgangskontroll.

---

## 🌐 Live-versjon
[**Åpne DiscGolf Hub**](https://disk-applikasjon-39f504b7af19.herokuapp.com/)

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
   ```bash
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

3. **Konfigurer miljøvariabler**
   
   Opprett `.env` fil i `backend/` mappen:
   ```env
   MONGODB_URI=mongodb://localhost:27017/discgolf
   SESSION_SECRET=ditt-session-secret
   NODE_ENV=development
   PORT=8000
   ```

### Kjøre prosjektet

**Utvikling:**
```bash
npm run dev
```
Starter både backend (port 8000) og frontend (port 3000).

**Produksjon:**
```bash
cd frontend && npm run build
npm start
```

### Testing

```bash
cd backend && npm test
cd frontend && npm test -- --run
```

---

## 🚀 Funksjoner

- **Runder & Scoreboard**  
  Spill runder, registrer score og se oppdatert leaderboard i sanntid.
- **Kartvisning**  
  Interaktiv visning av baner og hull (Leaflet / Mapbox).
- **Klubbsider**  
  Opprett og administrer klubbprofiler med nyheter, baner og medlemmer.
- **Turneringer**  
  Opprett og administrer turneringer med tidspunkter, baner og deltakere.
- **Rollebasert tilgangskontroll (RBAC)**  
  Ulike roller: spiller, lagleder, klubbadmin, superadmin.
- **Live oppdateringer**  
  Socket.IO gir oppdateringer av scoreboard uten sideoppfriskning.

---

## 🛠️ Teknologistack

### Backend
- **Node.js + Express.js** – API-ruter, autentisering, RBAC.
- **MongoDB (MongoDB Node Driver)** – NoSQL-database for brukere, klubber, baner, runder, turneringer.
- **Passport.js + express-session** – Autentisering og brukerøkter.
- **Socket.IO** – Sanntid scoreoppdateringer.
- **Helmet, CORS, rate-limit** – Sikkerhetslag.

### Frontend
- **React.js** – Moderne UI med gjenbrukbare komponenter.
- **React Router** – Navigasjon mellom sider.
- **Tailwind CSS** – Rask og responsiv styling.
- **fetch/axios** – API-kall.
- **Socket.IO-client** – Live scoreboard.
- **Leaflet / Mapbox GL JS** – Kartvisning.

---

## 📐 Arkitektur

Applikasjonen følger **MERN-stackens trelagsmodell**:  
1. **Frontend** – React-app som kommuniserer med API-et.  
2. **Backend** – Express-server med API-ruter og RBAC.  
3. **Database** – MongoDB Atlas for datalagring.

**Kommunikasjon:**
- RESTful API-er for CRUD-operasjoner.
- WebSockets (Socket.IO) for sanntid.

---

## 🔐 Roller og tilgang

| Rolle        | Rettigheter |
|--------------|-------------|
| Spiller      | Delta i runder, se leaderboard, opprette profil |
| Lagleder     | Administrere lag, invitere spillere |
| Klubbadmin   | Opprette baner, administrere klubbside og nyheter |
| Superadmin   | Full tilgang til alle ressurser og innstillinger |

---

## 📄 Lisens

Dette prosjektet er lisensiert under MIT License.

**Forfattere:**
- Bjarne Hovd Beruldsen
- Laurent Zogaj
- Abdinasir Ali
- Severin Waller Sørensen
- Ylli Ujkani

Se [LICENSE](LICENSE) filen for detaljer.


