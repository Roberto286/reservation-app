# Reservation App

Sistema di gestione prenotazioni per eventi con autenticazione multi-ruolo (Admin, Organizer, Attendee).

## 🌐 Demo Live

**[https://reservations-app.sda.pp.ua](https://reservations-app.sda.pp.ua)**

Demo funzionante dell'applicazione in produzione.

## 🏗️ Architettura

Monorepo PNPM con tre package:

- **`packages/be`**: Backend NestJS 11 + MongoDB/Mongoose
- **`packages/fe`**: Frontend Angular 20 (zoneless, standalone)
- **`packages/shared`**: DTOs, enums e tipi condivisi

## 🚀 Quick Start

### Prerequisiti

- Node.js 18+
- PNPM 8.14+
- Docker & Docker Compose (per MongoDB)

### Installazione

```bash
# Clona il repository
git clone https://github.com/Roberto286/reservation-app.git
cd reservation-app

# Installa le dipendenze
pnpm install
```

### Avvio con Docker (consigliato)

```bash
# Avvia tutti i servizi (backend, frontend, MongoDB)
pnpm start:docker
```

Questo comando:

- Avvia MongoDB su porta 27017
- Avvia il backend su http://localhost:3000
- Avvia il frontend su http://localhost:4200

### Avvio manuale

Se preferisci avviare i servizi separatamente:

```bash
# 1. Avvia MongoDB localmente o via Docker
docker run -d -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=mongo \
  -e MONGO_INITDB_ROOT_PASSWORD=mongo \
  mongo:latest

# 2. Configura le variabili d'ambiente
# Crea un file .env con:
# DB_CONNECTION_STRING=mongodb://mongo:mongo@localhost:27017/reservation-app?authSource=admin

# 3. Avvia backend e frontend
pnpm start:dev
```

## 📋 Features

### Autenticazione

- Login con email/password (JWT, 1h expiry)
- Tre ruoli: `ADMIN`, `ORGANIZER`, `ATTENDEE`
- Password validation: min 8 caratteri, numero, maiuscola, minuscola

### Eventi

- Creazione e gestione eventi (solo organizzatori)
- Campi: titolo, descrizione, location, date, posti max
- Stati: `DRAFT`, `PUBLISHED`, `CANCELLED`, `COMPLETED`
- Categorie: `Musica` `Vita notturna` `Arti sceniche` `Festività Affari`

### Prenotazioni

- Booking con specifica del numero di posti
- Controllo disponibilità real-time
- Stati: `PENDING`, `CONFIRMED`, `CANCELLED`

## 🛠️ Tecnologie

### Backend

- NestJS 11
- MongoDB + Mongoose
- Passport (JWT + Local Strategy)
- BCrypt per hashing password
- class-validator per validazione DTO

### Frontend

- Angular 20 (zoneless, standalone components)
- Signals per state management
- daisyUI 5 + Tailwind CSS 4
- Reactive Forms
- ngx-cookie-service per auth state

## 📁 Struttura Progetto

```
reservation-app/
├── packages/
│   ├── be/               # Backend NestJS
│   │   └── src/
│   │       ├── auth/     # Autenticazione JWT
│   │       ├── users/    # Gestione utenti
│   │       ├── events/   # Gestione eventi
│   │       ├── bookings/ # Gestione prenotazioni
│   │       └── schemas/  # Mongoose schemas
│   ├── fe/               # Frontend Angular
│   │   └── src/
│   │       ├── app/
│   │       │   ├── components/  # UI components
│   │       │   ├── pages/       # Route pages
│   │       │   └── core/        # Services, guards, interceptors
│   │       └── environments/
│   └── shared/           # Tipi condivisi
│       └── src/
│           ├── dto/      # Data Transfer Objects
│           └── enums/    # Enumerazioni
├── docs/
│   └── system-spec.md    # Specifica tecnica completa
├── http-requests/        # Test API (VS Code REST Client)
└── compose.yml           # Docker Compose config
```

## 📚 API Endpoints

### Autenticazione

- `POST /auth/login` - Login utente
- `POST /auth/logout` - Logout (revoca token)

### Utenti

- `POST /users/signup` - Registrazione
- `GET /users/profile` - Profilo utente corrente

### Eventi

- `GET /events` - Lista eventi (con filtri)
- `POST /events` - Crea evento (organizer)
- `GET /events/:id` - Dettaglio evento
- `PATCH /events/:id` - Aggiorna evento
- `DELETE /events/:id` - Elimina evento

### Prenotazioni

- `POST /bookings` - Crea prenotazione
- `GET /bookings/my` - Prenotazioni utente
- `DELETE /bookings/:id` - Cancella prenotazione

Vedi `http-requests/*.http` per esempi d'uso completi.

## 🔒 Validazione Password

Password requirements:

- Minimo 8 caratteri
- Almeno un numero
- Almeno una lettera minuscola
- Almeno una lettera maiuscola

Regex: `^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$`

## 🗄️ Database

MongoDB collections:

- `users` - Utenti con ruoli e stato
- `events` - Eventi con organizzatore
- `bookings` - Prenotazioni con tracking posti

Vedi `docs/system-spec.md` per schema completo e regole di business.

## 🐛 Troubleshooting

### MongoDB connection error

Verifica che MongoDB sia avviato e che `DB_CONNECTION_STRING` nel file `.env` sia corretto.

### Port già in uso

- Backend: modifica porta in `packages/be/src/main.ts`
- Frontend: usa `ng serve --port 4300`

### Problemi di build

```bash
# Pulisci e reinstalla
rm -rf node_modules packages/*/node_modules pnpm-lock.yaml
pnpm install

# Rebuilda shared package
pnpm --filter @reservation-app/shared build
```
