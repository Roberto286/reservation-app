# Reservation App Technical Specification

## 1. Database Schema

Il persistence layer usa **MongoDB** (con Mongoose). Ogni tabella seguente descrive una _collection_; i campi `string` che rappresentano chiavi fanno riferimento a ObjectId.

### users

| Campo        | Tipo                                 | Note                                               |
| ------------ | ------------------------------------ | -------------------------------------------------- |
| \_id         | string                               | primary key (UUID/ObjectId)                        |
| email        | string                               | unique, required                                   |
| passwordHash | string                               | required (BCrypt/Scrypt); omit only if auth mocked |
| displayName  | string                               | required                                           |
| role         | enum(`ADMIN`,`ORGANIZER`,`ATTENDEE`) | drives authorization guards                        |
| status       | enum(`ACTIVE`,`SUSPENDED`)           | block auth if suspended                            |
| lastLoginAt  | date                                 | optional                                           |
| createdAt    | date                                 | default now                                        |
| updatedAt    | date                                 | auto-managed                                       |

### events

| Campo           | Tipo                                              | Note                                               |
| --------------- | ------------------------------------------------- | -------------------------------------------------- |
| \_id            | string                                            | primary key                                        |
| title           | string                                            | required, 3-140 chars                              |
| description     | string                                            | optional long text                                 |
| location        | string                                            | optional                                           |
| startAt         | date                                              | required                                           |
| endAt           | date                                              | required, must be > startAt                        |
| maxParticipants | int                                               | required, >0; business rule: hard cap for bookings |
| reservedSeats   | int                                               | derived/denormalized counter, default 0            |
| status          | enum(`DRAFT`,`PUBLISHED`,`CANCELLED`,`COMPLETED`) | controls visibility/booking availability           |
| organizerId     | string                                            | FK → users.\_id (organizer role)                   |
| tags            | string[]                                          | optional (search filters)                          |
| createdAt       | date                                              | default now                                        |
| updatedAt       | date                                              | auto-managed                                       |

### bookings

| Campo         | Tipo                                            | Note                                              |
| ------------- | ----------------------------------------------- | ------------------------------------------------- |
| \_id          | string                                          | primary key                                       |
| eventId       | string                                          | FK → events.\_id                                  |
| attendeeId    | string                                          | FK → users.\_id                                   |
| seats         | int                                             | required; must keep total ≤ event.maxParticipants |
| status        | enum(`PENDING`,`CONFIRMED`,`CANCELLED`)         | cancellation frees seats; pending expires via job |
| paymentStatus | enum(`NOT_REQUIRED`,`AWAITING`,`PAID`,`FAILED`) | optional if payments added                        |
| note          | string                                          | optional                                          |
| createdAt     | date                                            | default now                                       |
| updatedAt     | date                                            | auto-managed                                      |
| cancelledAt   | date                                            | nullable; set when status `CANCELLED`             |

### Relazioni (ASCII)

```text
Users
├─< Events (organizerId)
│   ├─< Bookings (eventId)
│   │     └─ Users (attendeeId)
├─< Bookings (attendeeId)
```

## 2. Backend Service Schema

### Autenticazione

L'implementazione attuale (vedi `packages/be/src/auth`) usa `Passport` con `LocalStrategy` (email/password) e `JwtService` configurato con `expiresIn: "1h"`. Il payload include `{ sub, email, jti }` per consentire la revoca. **Non esiste refresh token**, quindi allo scadere dell'ora l'utente deve rieseguire il login. È richiesto un archivio di token revocati (es. Redis o collection `revoked_tokens`) consultato dalle guardie JWT per invalidare i token dopo il logout.

#### POST /auth/login

Descrizione: Autentica un utente email/password e fornisce un access token valido 1 ora.

Request body:

```json
{ "email": "string", "password": "string" }
```

Response: `200 OK`

```json
{
  "access_token": "jwt"
}
```

Errori: 400 credenziali mancanti, 401 credenziali errate, 423 utente sospeso.

#### POST /auth/logout

Descrizione: Invalida il token in uso aggiungendo il suo `jti` alla blacklist fino alla scadenza naturale.

Richiede header `Authorization: Bearer <token>`; body vuoto.

Response: `204 No Content`.

Errori: 401 token mancante/già revocato.

### Utenti

#### POST /users

Crea utente (solo admin).

Request:

```json
{
  "email": "string",
  "displayName": "string",
  "password": "string",
  "role": "ORGANIZER"
}
```

Response: `201 Created` con utente senza password.

Errori: 409 email già in uso.

#### GET /users/me

Ritorna profilo autenticato.

Response: `200 OK { ... }`

Errori: 401 token assente/scaduto.

#### PATCH /users/:id

Aggiorna displayName, status o role (guard admin).

Errori: 403 se non autorizzato.

### Eventi

#### GET /events

Query params: `dateFrom`, `dateTo`, `status`, `availableOnly=true`, paginazione.

Response: `200 OK` lista con campi base + `availableSeats`.

#### GET /events/:id

Include info evento + conteggio prenotazioni.

Errori: 404 non trovato.

#### POST /events

Crea evento (organizer/admin).

Request:

```json
{
  "title": "string",
  "description": "string",
  "location": "string",
  "startAt": "ISODate",
  "endAt": "ISODate",
  "maxParticipants": 120,
  "tags": ["music", "vip"]
}
```

Response: `201 Created`.

Flusso: dopo persistenza → crea notification `EVENT_CREATED` per organizer/admins.

#### PATCH /events/:id

Aggiorna campi mutabili (non ridurre maxParticipants sotto prenotazioni esistenti).

Errori: 409 se nuova capienza < posti confermati.

#### PATCH /events/:id/status

Cambia stato (publish/cancel/complete). Se `CANCELLED`, trigger notifica a tutti i prenotati.

Errori: 409 se si tenta di pubblicare evento senza slot disponibili.

#### DELETE /events/:id

Soft delete (status → CANCELLED). Richiede notifiche.

### Prenotazioni

#### GET /events/:id/bookings

Filtri: status, attendee email, pagination. Include disponibilità residua.

Response: `200 OK { "items": [ ... ], "availableSeats": 10 }`.

#### POST /events/:id/bookings

Crea prenotazione per utente corrente o admin per terzi.

Request:

```json
{
  "attendeeId": "string (optional, default requester)",
  "seats": 2,
  "note": "string"
}
```

Response: `201 Created { booking }`

Flusso:

1. Verifica evento `PUBLISHED` e `startAt > now`.
2. Lock/transaction: `reservedSeats + seats <= maxParticipants`.
3. Aggiorna contatori, crea booking, emette notifica `BOOKING_CREATED`.

Errori: 400 dati invalidi, 403 evento non prenotabile, 409 capienza piena, 404 evento/utente assente.

#### PATCH /bookings/:id

Permette update `status` o `seats` (solo se rimane ≤ disponibilità).

Response: `200 OK`.

Errori: 409 se ampliamento supera capienza; 403 se utente diverso.

#### POST /bookings/:id/cancel

Setta status `CANCELLED`, decrementa `reservedSeats`, invia notifica al partecipante.

Response: `200 OK`.

Errori: 409 se già cancellata.

#### DELETE /bookings/:id

Solo admin per hard delete (per auditing); preferire cancel.

### Support

#### GET /events/:id/availability

Endpoint leggero per polling realtime; ritorna `maxParticipants`, `reservedSeats`, `availableSeats`.

#### GET /stats/overview

Aggregati (eventi attivi, posti prenotati, cancellazioni). Usato dalla dashboard organizer.

## 3. Vincoli Logici Complessivi

- **Dipendenze tra servizi**: `auth` fornisce JWT ai guard Nest che proteggono `/events` e `/bookings`. Il modulo `bookings` dipende dal modulo `events` per validare stato/capienza e pubblica eventi di dominio verso `notifications`.
- **Flussi principali**:
  1. Organizer crea evento → servizio notification informa organizer/admin → frontend aggiorna lista.
  2. Utente prenota posti → locking ottimistico/atomico aggiorna `reservedSeats` → booking `PENDING` → opzionale conferma (PATCH) o automatica.
  3. Cancellazione evento → cascata di cancellazioni prenotazioni + notifiche e liberazione posti.
- **Edge case**: richieste parallele di booking (necessario `findOneAndUpdate` atomico o transaction); riduzione capienza con prenotazioni già confermate; eventi passati (bloccare nuove prenotazioni); refresh token revocati dopo logout; organizer che tenta di modificare evento cancellato; prenotazioni `PENDING` scadute (job che le marca `CANCELLED` restituendo posti).
