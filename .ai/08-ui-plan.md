# Architektura UI dla "Boycott Kanye"

## 1. Przegląd struktury UI

Aplikacja "Boycott Kanye" to platforma umożliwiająca użytkownikom publiczne potępienie antysemickich i nazistowskich poglądów rapera Kanye Westa poprzez złożenie wirtualnego podpisu pod petycją. Architektura UI jest prosta i zorientowana na cel, z klarownym podziałem na widoki dla niezalogowanych i zalogowanych użytkowników. Interfejs zaprojektowano zgodnie z podejściem mobile-first, z trybem jasnym/ciemnym oraz maskowaniem adresów email dla zachowania prywatności.

Struktura aplikacji składa się z następujących głównych elementów:
- Strona główna z opisem petycji i listą podpisów
- System logowania i rejestracji
- Formularz składania podpisu
- Panel użytkownika do zarządzania podpisem
- Ekran podziękowania i udostępniania

## 2. Lista widoków

### 2.1. Strona główna (/)
- **Główny cel**: Informowanie o petycji i zachęcanie do jej podpisania
- **Kluczowe informacje**:
  - Tytuł "Boycott Kanye" i opis celu petycji
  - Call to action (przycisk "Zapisz się")
  - Licznik zebranych podpisów
  - Lista ostatnich 10 podpisów z paginacją
- **Kluczowe komponenty**:
  - Nagłówek z tytułem i stanem logowania
  - Sekcja opisu petycji
  - Przycisk CTA
  - Licznik podpisów
  - Lista podpisów z paginacją
  - Przełącznik trybu jasny/ciemny
- **Względy UX/dostępności/bezpieczeństwa**:
  - Jasna hierarchia informacji
  - Maskowanie adresów email na liście
  - Wyświetlanie tylko danych, na których publikację wyrazili zgodę użytkownicy

### 2.2. Strona logowania (/login)
- **Główny cel**: Umożliwienie użytkownikom logowania do systemu
- **Kluczowe informacje**:
  - Formularz logowania
  - Link do rejestracji
- **Kluczowe komponenty**:
  - Formularz z polami email i hasło
  - Przycisk "Zaloguj się"
  - Link "Nie masz konta? Zarejestruj się"
  - Obsługa błędów logowania
- **Względy UX/dostępności/bezpieczeństwa**:
  - Walidacja formularza w czasie rzeczywistym
  - Zabezpieczenie przed wielokrotnymi próbami logowania
  - Przechowywanie tokenu JWT w localStorage

### 2.3. Strona rejestracji (/register)
- **Główny cel**: Umożliwienie nowym użytkownikom utworzenia konta
- **Kluczowe informacje**:
  - Formularz rejestracji
  - Link do logowania
- **Kluczowe komponenty**:
  - Formularz z polami: imię i nazwisko, email, hasło, potwierdzenie hasła
  - Przycisk "Zarejestruj się"
  - Link "Masz już konto? Zaloguj się"
  - Obsługa błędów rejestracji
- **Względy UX/dostępności/bezpieczeństwa**:
  - Podstawowa walidacja bez dodatkowych pól
  - Jasne komunikaty o błędach
  - Automatyczne przekierowanie po udanej rejestracji

### 2.4. Strona podpisywania petycji (/sign)
- **Główny cel**: Umożliwienie zalogowanym użytkownikom podpisania petycji
- **Kluczowe informacje**:
  - Dane użytkownika (imię, nazwisko, email)
  - Checkbox zgody na potępienie poglądów
  - Opcja widoczności danych na liście publicznej
- **Kluczowe komponenty**:
  - Formularz podpisu z danymi użytkownika (nieedytowalne)
  - Checkbox zgody
  - Przełącznik widoczności danych
  - Przycisk "Podpisz petycję"
- **Względy UX/dostępności/bezpieczeństwa**:
  - Zabezpieczenie strony przez Vue Router guards
  - Jasne wyjaśnienie konsekwencji wyboru widoczności danych
  - Walidacja zgody użytkownika

### 2.5. Strona potwierdzenia podpisu (/thank-you)
- **Główny cel**: Podziękowanie za podpisanie i umożliwienie udostępnienia
- **Kluczowe informacje**:
  - Potwierdzenie złożenia podpisu
  - Aktualna liczba podpisów
  - Opcje udostępniania w mediach społecznościowych
- **Kluczowe komponenty**:
  - Komunikat podziękowania
  - Licznik podpisów
  - Przyciski do udostępniania (Facebook, Twitter, itp.)
  - Przycisk "Powrót na stronę główną"
- **Względy UX/dostępności/bezpieczeństwa**:
  - Wyraźne oznaczenie sukcesu akcji
  - Łatwe opcje udostępniania
  - Zabezpieczenie przed dostępem niezalogowanych użytkowników

### 2.6. Panel użytkownika (/profile)
- **Główny cel**: Zarządzanie podpisem przez zalogowanego użytkownika
- **Kluczowe informacje**:
  - Status podpisu
  - Opcje edycji widoczności danych
  - Opcja wycofania podpisu
- **Kluczowe komponenty**:
  - Informacja o statusie podpisu
  - Przełącznik widoczności danych
  - Przycisk "Zapisz zmiany"
  - Przycisk "Wycofaj podpis" z potwierdzeniem
  - Przycisk "Wyloguj"
- **Względy UX/dostępności/bezpieczeństwa**:
  - Zabezpieczenie strony przez Vue Router guards
  - Potwierdzenie przed wycofaniem podpisu
  - Jasne komunikaty o skutkach akcji

### 2.7. Strona 404 (/*)
- **Główny cel**: Informowanie o nieznalezionej stronie
- **Kluczowe informacje**:
  - Komunikat o błędzie
  - Link do strony głównej
- **Kluczowe komponenty**:
  - Komunikat o nieznalezionej stronie
  - Przycisk "Powrót na stronę główną"
- **Względy UX/dostępności/bezpieczeństwa**:
  - Przyjazny komunikat o błędzie
  - Łatwa nawigacja powrotna

## 3. Mapa podróży użytkownika

### Podpisanie petycji (główna ścieżka)
1. Użytkownik wchodzi na stronę główną (/)
2. Użytkownik czyta opis petycji i decyduje się ją podpisać
3. Użytkownik klika przycisk "Zapisz się"
4. **Dla niezalogowanych użytkowników**:
   - System przekierowuje na stronę logowania (/login)
   - Użytkownik wybiera rejestrację, jeśli nie ma konta (/register)
   - Po rejestracji/logowaniu, system przekierowuje do formularza podpisu
5. Użytkownik trafia na stronę podpisywania petycji (/sign)
6. Użytkownik zaznacza checkbox zgody i wybiera opcję widoczności danych
7. Użytkownik klika "Podpisz petycję"
8. System zapisuje podpis i przekierowuje na stronę potwierdzenia (/thank-you)
9. Użytkownik może udostępnić petycję w mediach społecznościowych
10. Użytkownik wraca na st