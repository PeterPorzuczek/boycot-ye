Zoptymalizowany plan pracy dla Proof of Concept "Boycott Kanye" (2 godziny)
Poniżej przedstawiam zrewidowany plan pracy z ograniczeniem czasowym do 2 godzin, skupiający się wyłącznie na absolutnie niezbędnych elementach:

Etap 1: Konfiguracja środowiska i PocketBase (Szacowany czas: 25 minut)
  Utworzenie podstawowej struktury projektu Vue 3
  Instalacja niezbędnych zależności (Vue 3, PocketBase SDK)
  Uruchomienie i konfiguracja PocketBase
  Utworzenie kolekcji signatures z polami: user_id, agree_checkbox, public_display
Etap 2: Backend - bezpośrednie połączenie z PocketBase (Szacowany czas: 20 minut)
  Implementacja bezpośredniego połączenia Vue z PocketBase (z Nest.js)
  Konfiguracja klienta PocketBase w Vue
  Utworzenie podstawowych funkcji dostępu do danych
Etap 3: Frontend - funkcjonalność uwierzytelniania (Szacowany czas: 25 minut)
  Implementacja prostego formularza rejestracji
  Implementacja prostego formularza logowania
  Zarządzanie sesją użytkownika
Etap 4: Frontend - funkcjonalność petycji (Szacowany czas: 40 minut)
  Implementacja formularza podpisania petycji (checkbox + widoczność)
  Implementacja listy podpisów z maskowanymi adresami email
  Implementacja przycisku usunięcia własnego podpisu
Etap 5: Testowanie i finalizacja (Szacowany czas: 10 minut)
  Szybkie testowanie przepływu użytkownika
  Poprawki krytycznych błędów
  Całkowity szacowany czas: 2 godziny
  Ten plan znacząco upraszcza implementację:
  Usunięto oddzielny backend Nest.js na rzecz bezpośredniego połączenia z PocketBase
  Maksymalnie uproszczono UI bez dodatkowych elementów
  Skupiono się wyłącznie na kluczowych funkcjonalnościach
  Zminimalizowano czas testowania

chce żębyś zaczął prace od przygotowania schem dla backendu w takim formacie 

/**
 * Posts collection schema definition
 */

export const postsCollection = {
  name: 'posts',
  type: 'base',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true
    },
    {
      name: 'content',
      type: 'text', 
      required: false
    },
    {
      name: 'published',
      type: 'bool',
      required: false
    },
    {
      name: 'created',
      type: 'date',
      required: false
    }
  ],
  // API access rules
  listRule: '@request.auth.id != ""',      
  viewRule: '@request.auth.id != ""',      
  createRule: '@request.auth.id != ""',    
  updateRule: '@request.auth.id != ""',    
  deleteRule: '@request.auth.id != ""'     
  
  /* Alternatively, you can use more restrictive rules:
  
  listRule: 'published = true || @request.auth.id != ""',  // Published posts visible to all, unpublished only to auth users
  viewRule: 'published = true || @request.auth.id != ""',  // Same as list
  createRule: '@request.auth.id != ""',  // Only authenticated users
  updateRule: '@request.auth.id != ""',  // Only authenticated users
  deleteRule: '@request.auth.id != ""'   // Only authenticated users
  
  */
}; 