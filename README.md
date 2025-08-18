# DiscGolf Webapp

En webapplikasjon for diskgolfspillere, lagledere og klubbadministratorer.  
Med **runde-spilling**, **scoreboard i sanntid**, **kartvisning**, **klubbsider med nyheter og baner**, samt **turneringsadministrasjon** – alt med rollebasert tilgangskontroll.

---

## 🌐 Live-versjon
[**Åpne DiscGolf Hub**](https://disk-applikasjon-39f504b7af19.herokuapp.com/)

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


