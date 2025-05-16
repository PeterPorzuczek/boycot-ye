# Tech Stack: Wrapper dla PocketBase "Boycott Kanye"

## Frontend - Vue.js:
- **Vue 3** jako lekki framework do stworzenia interfejsu użytkownika
- **Axios** do komunikacji z API
- **Własne CSS** dla szybkiego stylowania bez nadmiarowego CSS
- Minimalistyczna struktura komponentów (widok petycji, formularz, lista podpisów)

## Backend - Nest.js (Wrapper dla PocketBase):
- Własne koncowki, które odpytują PocketBase (const PocketBase = require('pocketbase/cjs');)
- Credentiale w .env
- PocketBase jako baza danych (No SQL)
- Mechanizm uwierzytelniania PocketBase
- Wykorzystanie gotowych kolekcji `users` dla uwierzytelniania
- Dedykowana kolekcja `signatures` z relacją do użytkowników
- Reguły dostępu: publiczne odczytywanie podpisów, prywatna edycja

## Integracja:
- Frontend działa jako "wrapper" (nakładka) komunikująca się z PocketBase API
- Wykorzystanie PocketBase SDK/klienta JavaScript
- Lokalne przechowywanie tokenów sesji w localStorage

## Deployment:
- Statyczny hosting dla frontendu (GitHub Pages/Netlify)
- PocketBase uruchomiony na minimalnym VPS (DigitalOcean/Hetzner)
- Prosty setup bez złożonej infrastruktury CI/CD
