# Dokument wymagań produktu (PRD) - Boycott Kanye

## 1. Przegląd produktu

Boycott Kanye to prosta aplikacja webowa umożliwiająca użytkownikom publiczne potępienie antysemickich i nazistowskich poglądów rapera Kanye Westa (Ye). Aplikacja pozwala na złożenie wirtualnego podpisu pod petycją, który może być opcjonalnie widoczny publicznie. Rozwiązanie zapewnia prostą nawigację dla niezalogowanych użytkowników (możliwość przeglądania listy podpisów) oraz zalogowanych (możliwość złożenia i wycofania podpisu).

Aplikacja zbudowana będzie w oparciu o Vue.js jako frontend oraz PocketBase jako gotowe rozwiązanie backendowe obsługujące bazę danych i uwierzytelnianie użytkowników. Backend zostanie zaimplementowany jako warstwa pośrednia (wrapper) w Node.js/Nest.js komunikująca się z PocketBase.

## 2. Problem użytkownika

Kanye West, jako osoba publiczna z ogromnym zasięgiem, zaczął głosić antysemickie poglądy, które są jawnym naruszeniem podstawowych praw i wartości społecznych. Jego zachowanie spotyka się z dezaprobatą wielu osób, które chciałyby wyrazić swój sprzeciw.

Problem:
- Brak zorganizowanego, prostego sposobu publicznego wyrażenia sprzeciwu wobec tych poglądów
- Trudność w pokazaniu skali społecznego niezadowolenia z takich wypowiedzi
- Brak platformy umożliwiającej zbiorowe potępienie tego typu zachowań

Boycott Kanye rozwiązuje ten problem poprzez stworzenie prostego mechanizmu petycji online, który umożliwia użytkownikom publiczne (lub prywatne) wyrażenie sprzeciwu wobec antysemickich poglądów Kanye Westa.

## 3. Wymagania funkcjonalne

### 3.1 Wymagania podstawowe
- Prosta strona główna z jasnym opisem celu petycji
- System rejestracji i logowania użytkowników (oparty na PocketBase)
- Formularz podpisu petycji zbierający:
  - Imię
  - Nazwisko
  - Adres email (pobierany z konta użytkownika)
  - Zgoda na potępienie poglądów rapera (checkbox)
  - Opcja wyboru widoczności danych osobowych na liście podpisów
- Publiczna lista podpisów z częściowo zamaskowanymi adresami email (pierwsza litera + ostatni znak przed @ + pełna domena)
- Możliwość wycofania podpisu dla zalogowanych użytkowników

### 3.2 Wymagania techniczne
- Frontend: Vue 3 z minimalistycznym interfejsem użytkownika
- Backend: Node.js/Nest.js jako wrapper dla PocketBase
- Baza danych i uwierzytelnianie: PocketBase
- Maskowanie adresów email na liście publicznej
- Przechowywanie tokenów sesji w localStorage

## 4. Granice produktu

### 4.1 W zakresie MVP
- Podstawowa funkcjonalność petycji online
- System rejestracji i logowania użytkowników
- Możliwość złożenia podpisu pod petycją
- Publiczna lista podpisów z ustawieniami prywatności
- Możliwość rezygnacji z podpisu

### 4.2 Poza zakresem MVP
- Strona z listą poglądów Kanye Westa
- Zabezpieczenia przed botami (CAPTCHA)
- Mechanizmy moderacji treści
- Zaawansowana walidacja danych
- Responsywny design
- Integracja z mediami społecznościowymi
- Zaawansowana edycja danych podpisu
- Potwierdzenie adresu email
- Działania po zebraniu podpisów

## 5. Historyjki użytkowników

### US-001 Przeglądanie strony głównej
Jako potencjalny sygnatariusz petycji, chcę zobaczyć stronę główną z informacjami o celu petycji, aby zrozumieć powód jej istnienia.

Kryteria akceptacji:
- Strona główna zawiera jasny opis celu petycji
- Strona główna wyjaśnia kontekst antysemickich wypowiedzi Kanye Westa
- Strona główna zawiera nawigację do pozostałych funkcji aplikacji

### US-002 Przeglądanie listy podpisów
Jako niezalogowany użytkownik, chcę przeglądać listę osób, które podpisały petycję, aby zobaczyć skalę sprzeciwu.

Kryteria akceptacji:
- Lista podpisów jest publicznie dostępna bez logowania
- Lista wyświetla imiona, nazwiska i częściowo zamaskowane adresy email (tylko jeśli użytkownik wyraził zgodę)
- Lista jest czytelna i dobrze zorganizowana

### US-003 Rejestracja użytkownika
Jako nowy użytkownik, chcę zarejestrować się w systemie, aby móc podpisać petycję.

Kryteria akceptacji:
- Formularz rejestracji zbiera niezbędne dane (imię, nazwisko, email, hasło)
- System przeprowadza podstawową walidację wprowadzonych danych
- Po rejestracji użytkownik otrzymuje dostęp do funkcji podpisania petycji
- Rejestracja nie wymaga potwierdzenia adresu email

### US-004 Logowanie użytkownika
Jako zarejestrowany użytkownik, chcę zalogować się do systemu, aby zarządzać swoim podpisem.

Kryteria akceptacji:
- Formularz logowania akceptuje email i hasło
- System weryfikuje poprawność danych logowania
- Po zalogowaniu użytkownik otrzymuje dostęp do funkcji podpisania/usunięcia podpisu
- Sesja użytkownika jest przechowywana w localStorage

### US-005 Podpisanie petycji
Jako zalogowany użytkownik, chcę podpisać petycję, aby wyrazić swój sprzeciw wobec poglądów Kanye Westa.

Kryteria akceptacji:
- Formularz podpisu zawiera checkbox zgody na potępienie poglądów
- Formularz zawiera opcję wyboru widoczności danych na liście publicznej
- System pobiera imię, nazwisko i email z konta użytkownika
- Podpis jest zapisywany w bazie danych i natychmiast widoczny na liście

### US-006 Wybór widoczności danych
Jako osoba podpisująca petycję, chcę zdecydować o widoczności moich danych, aby kontrolować swoją prywatność.

Kryteria akceptacji:
- Użytkownik może wybrać opcję publicznego wyświetlania swojego imienia i nazwiska
- Adres email jest zawsze maskowany (pierwsza litera + ostatni znak przed @ + domena)
- Wybór użytkownika jest respektowany na liście podpisów

### US-007 Usunięcie podpisu
Jako zalogowany użytkownik, chcę wycofać swój podpis, jeśli zmienię zdanie.

Kryteria akceptacji:
- Zalogowany użytkownik widzi opcję usunięcia swojego podpisu
- Po usunięciu podpis nie jest widoczny na liście publicznej
- Użytkownik może ponownie podpisać petycję po usunięciu podpisu

### US-008 Wylogowanie
Jako zalogowany użytkownik, chcę wylogować się z systemu, aby zakończyć sesję.

Kryteria akceptacji:
- Opcja wylogowania jest łatwo dostępna dla zalogowanych użytkowników
- Po wylogowaniu użytkownik traci dostęp do funkcji wymagających logowania
- Po wylogowaniu użytkownik może nadal przeglądać listę podpisów

## 6. Metryki sukcesu

### 6.1 Metryki ilościowe
- Osiągnięcie 1000 podpisów pod petycją
- Stały wzrost liczby podpisów w czasie
- Liczba zarejestrowanych użytkowników

### 6.2 Metryki jakościowe
- Sprawne działanie aplikacji bez opóźnień
- Pozytywny odbiór inicjatywy w mediach społecznościowych
- Brak problemów z użytkowaniem aplikacji zgłaszanych przez użytkowników

### 6.3 Mierzenie sukcesu
- Monitorowanie liczby podpisów w czasie
- Analiza ruchu na stronie
- Śledzenie czasu spędzonego na stronie przez użytkowników
