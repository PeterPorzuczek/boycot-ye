<conversation_summary>
<decisions>
1. Struktura nawigacji: Opis strony i tytuł "Boycott Kanye" na górze, poniżej call to action, liczba zebranych podpisów, a następnie lista podpisów; przycisk "zapisz się" przekierowuje do ekranu logowania/rejestracji.
2. Po rejestracji użytkownik potwierdza zgodę na podpisanie petycji, a po podpisie wyświetlany jest ekran z możliwością udostępnienia w mediach społecznościowych.
3. Lista podpisów będzie paginowana (10 ostatnich podpisów na stronie).
4. Podejście do responsywności: mobile first.
5. Brak dodatkowego systemu powiadomień (toast, alert) przy operacjach podpisywania/wycofywania podpisu.
6. Maskowanie adresów email na liście podpisów.
7. Formularz podpisania petycji na osobnej stronie.
8. Status podpisu widoczny dla zalogowanego użytkownika na wszystkich stronach.
9. Aplikacja będzie oferować tryb jasny/ciemny.
10. Błędy autoryzacji i wygaśnięcie sesji obsługiwane przez przekierowanie do ekranu logowania/rejestracji.
11. Użytkownik nie będzie mógł zmieniać hasła, ale będzie mógł edytować swój podpis i widoczność adresu email.
12. Brak dodatkowych pól walidacyjnych (np. siła hasła) w formularzu rejestracji.
13. Wyświetlanie stanów ładowania i błędów podczas komunikacji z API.
</decisions>

<matched_recommendations>
1. Struktura nawigacji z osobnymi widokami dla: strony głównej, listy podpisów, formularza logowania/rejestracji i panelu użytkownika.
2. Rezygnacja z Vuex i Pinia do zarządzania stanem aplikacji.
3. Implementacja interceptorów Axios do automatycznego dodawania tokenów autoryzacyjnych i obsługi wygasłych sesji.
4. Stworzenie osobnych komponentów dla formularzy logowania, rejestracji i podpisywania petycji z walidacją po stronie klienta.
5. Zaprojektowanie komponentu podpisu z możliwością renderowania różnych wersji w zależności od statusu zalogowania i właściciela podpisu.
6. Zapewnienie mechanizmu śledzenia stanu podpisu zalogowanego użytkownika poprzez wywołanie `/api/signatures/me` po zalogowaniu.
7. Zastosowanie responsywnego układu z minimum trzema breakpointami (mobile, tablet, desktop) z wykorzystaniem CSS flexbox/grid.
8. Implementacja globalnej obsługi błędów API z odpowiednimi komunikatami dla użytkownika.
9. Implementacja mechanizmu zabezpieczającego strony wymagające autoryzacji poprzez Vue Router guards.
</matched_recommendations>

<ui_architecture_planning_summary>
# Architektura UI dla "Boycott Kanye" MVP

Aplikacja "Boycott Kanye" to platforma umożliwiająca użytkownikom publiczne potępienie antysemickich i nazistowskich poglądów rapera Kanye Westa (Ye). Opierając się na wymaganiach produktu, stacku technologicznym i planie API, ustalono następującą architekturę UI:

## Struktura widoków i nawigacji

1. **Strona główna**:
   - Tytuł "Boycott Kanye" na górze
   - Opis celu petycji
   - Call to action (button "Zapisz się")
   - Licznik zebranych podpisów
   - Lista ostatnich 10 podpisów z paginacją

2. **Ekran logowania/rejestracji**:
   - Dostępny po kliknięciu "Zapisz się" na stronie głównej
   - Osobne formularze dla logowania i rejestracji
   - Podstawowa walidacja bez dodatkowych pól (np. siła hasła)

3. **Ekran podpisywania petycji**:
   - Formularz zgody na potępienie poglądów rapera
   - Opcja wyboru widoczności danych osobowych

4. **Ekran podziękowania/udostępniania**:
   - Wyświetlany po podpisaniu petycji
   - Opcje udostępnienia w mediach społecznościowych

5. **Panel użytkownika**:
   - Informacja o statusie podpisu
   - Możliwość edycji podpisu i widoczności adresu email
   - Opcja wycofania podpisu

## Integracja z API i zarządzanie stanem

1. **Autentykacja**:
   - Wykorzystanie endpointów `/api/auth/register` i `/api/auth/login`
   - Przechowywanie tokenów w localStorage
   - Interceptory Axios do automatycznego dodawania tokenów
   - Przekierowanie do ekranu logowania w przypadku wygaśnięcia sesji

2. **Zarządzanie podpisami**:
   - Pobieranie wszystkich podpisów z `/api/signatures/all`
   - Sprawdzanie statusu podpisu użytkownika przez `/api/signatures/me`
   - Tworzenie podpisu przez `/api/signatures`
   - Usuwanie podpisu przez `/api/signatures/{id}`

3. **Zarządzanie stanem**:
   - Bez wykorzystania Vuex czy Pinia
   - Proste zarządzanie stanem z wykorzystaniem właściwości komponentów
   - Przekazywanie danych między komponentami przez props i emisję zdarzeń

## Responsywność i dostępność

1. **Podejście mobile-first**:
   - Responsywny układ z minimum trzema breakpointami (mobile, tablet, desktop)
   - Wykorzystanie CSS flexbox/grid

2. **Tryb jasny/ciemny**:
   - Możliwość przełączania między trybami

## Bezpieczeństwo

1. **Autoryzacja na poziomie UI**:
   - Vue Router guards do zabezpieczenia stron wymagających logowania
   - Automatyczne przekierowanie do logowania przy wygaśnięciu sesji

2. **Zabezpieczenia API**:
   - Tokeny JWT do autoryzacji
   - Maskowanie adresów email na liście podpisów

## Komponenty

1. **Komponenty nawigacyjne**:
   - Nagłówek z tytułem i stanem logowania
   - Menu nawigacyjne
   - Stopka

2. **Komponenty formularzy**:
   - Formularz logowania
   - Formularz rejestracji
   - Formularz podpisu petycji

3. **Komponenty listy**:
   - Lista podpisów
   - Paginacja
   - Pojedynczy element podpisu (różne wersje zależnie od stanu)

4. **Komponenty stanu**:
   - Wskaźniki ładowania
   - Komunikaty o błędach
   - Status podpisu użytkownika
</ui_architecture_planning_summary>

<unresolved_issues>
1. Dokładna specyfikacja wyglądu UI (kolory, typografia, układ) nie została określona.
2. Szczegółowy mechanizm udostępniania w mediach społecznościowych wymaga doprecyzowania.
3. Dokładne zachowanie aplikacji podczas utraty połączenia internetowego nie zostało określone.
4. Sposób implementacji trybu jasnego/ciemnego (przełącznik, automatyczne wykrywanie preferencji systemu) wymaga doprecyzowania.
5. Szczegóły dotyczące implementacji maskowania adresów email (jaki dokładnie format maskowania) wymagają doprecyzowania.
</unresolved_issues>
</conversation_summary>