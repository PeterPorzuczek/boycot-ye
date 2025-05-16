# Aplikacja - Boycott Kanye (MVP)

## Główny problem
Kanye West to postać publiczna, która ostatnio głosi antysemickie poglądy. Jest to jawne naruszanie praw, które ustaliśmy. Jego zachowanie nie podoba się wielu ludziom. Chciałbym utworzyć produkt, który pozwala podpisać się wirtualnie pod petycją, której celem jest potępienie nazistowskich poglądów rapera nazwyjającego siebie Ye czy też Yeezusem.

## Najmniejszy zestaw funkcjonalności
- Zapisanie informacji o zaznaczeniu checkboxa.
- Wybranie opcji publikacji Imienia oraz Nazwiska na liscie wraz z wykorzystanym adresem email, który będzie miał wykropkowany username ale domena będzie widoczna.
- Użytkownicy mogą w każdej chwili powrócić i zmienić swoje zdanie.
- Bez logowania widać na stronie listę oraz możliwość zapisania się.
- Po zalogowaniu można się zapisać.

## Co NIE wchodzi w zakres MVP
Strona z listą poglądów Kanye.

## Kryteria sukcesu
Prosta aplikacja która pozwala przeczytać o celu petycji. Opcja rejestracji w celu odznaczenia checkboxa popieram cancel culture w stosunku do osoby rapera Kanye West oraz nie zgadzam się z jego poglądami dotyczącymi Nazizmu.

----

Zakres MVP:
  Prosta strona statyczna HTML/JS (bez Vue) opisująca cel petycji
  Podstawowy formularz do podpisania (imię, nazwisko, email, zgoda)
  PocketBase jako backend
  Wyświetlanie listy podpisów
  System logowania/uwierzytelniania
Rezygnujemy z:
  Możliwości edycji/usuwania podpisu
  Responsywnego designu
  Zaawansowanej walidacji
  
Plan działania

  Konfiguracja Backend z PocketBase
    Utworzenie kolekcji "signatures"
    Konfiguracja pól (imię, nazwisko, email (od uzytkownika ktory się zarejestrował), zgoda)
    Ustawienie uprawnień dla zalogownych do dodawania wpisów
    Maskowanie części adresu email
  Frontend -Vue 3 (1h):
    Prosty HTML z opisem petycji i formularzem
    Vanilla JS do komunikacji z API
    Minimalistyczny CSS
  Integracja i funkcjonalności:
    Podpięcie formularza do PocketBase
    Pobieranie i wyświetlanie listy podpisów  
  Testy i wdrożenie:
    Lokalne testy funkcjonalności
    Wdrożenie na hosting

----

Zanim przejdę do analizy Twojego pomysłu, chciałbym dowiedzieć się więcej o:
Jakie jest Twoje doświadczenie programistyczne? W jakich technologiach czujesz się najlepiej?
Jaki stack technologiczny preferujesz dla tego projektu (frontend, backend, baza danych)?
Czy masz doświadczenie w tworzeniu systemów uwierzytelniania użytkowników?
Czy posiadasz już jakieś zasoby (np. hosting, domenę) do wdrożenia projektu?
Czy planujesz pracować nad tym projektem samodzielnie czy z kimś?
Te informacje pomogą mi lepiej ocenić wykonalność projektu w założonym czasie.

1. Javascript oraz Vue. 
2. Front - vue (osobny projekt), Back - Node.js/Nest, który wysyła i komunikuje się z PocketBase.
3. Tak
4. tak
5. samodzielnie z wykorzystaniem asystenta AI.

----

Przejdźmy do analizy projektu "Boycott Kanye":

1. Czy aplikacja rozwiązuje realny problem?

Tak, aplikacja odpowiada na realny problem społeczny - sprzeciw wobec kontrowersyjnych wypowiedzi osoby publicznej. Petycje online są uznanym narzędziem wyrażania zbiorowego sprzeciwu i budowania świadomości społecznej. Projekt ma jasno określony cel i grupę odbiorców.

2. Czy w aplikacji można skupić się na 1-2 kluczowych funkcjach?

Zdecydowanie tak. Główne funkcje to:
Możliwość podpisania petycji (zaznaczenie checkboxa)
Zarządzanie widocznością danych osobowych (imię, nazwisko, częściowo ukryty email)
To bardzo precyzyjnie określony zakres, który ułatwi skupienie się na dobrej implementacji.

3. Czy jest możliwy do wdrożenia w 6 tygodni pracując po godzinach z AI?
Tak, jest to bardzo realny termin, szczególnie z:
Twoim doświadczeniem w JavaScript/Vue
Znajomością systemów uwierzytelniania
Posiadaniem już infrastruktury (hosting, domena)
Jasno określonym MVP (bez zbędnych funkcji)
PocketBase, który znacznie upraszcza backend
Szacuję, że z pomocą AI możesz ukończyć projekt w 3-4 tygodnie.

4. Potencjalne trudności:
Moderacja treści - weryfikacja czy wpisy użytkowników nie zawierają nieodpowiednich treści
Zabezpieczenia przed botami - aby uniknąć fałszywych podpisów
RODO/GDPR - przetwarzanie danych osobowych wymaga zgodności z przepisami
Skalowanie - jeśli petycja zyska popularność, może być konieczne przygotowanie na zwiększony ruch
Biorąc pod uwagę Twoje umiejętności i wybrany stack (Vue + Node.js/Nest + PocketBase), projekt wydaje się bardzo dobrze dopasowany do Twoich możliwości i jest wykonalny w założonym czasie.

----

mam tylko 3 godziny

Tylko 3 godziny to radykalnie zmienia sytuację. W tak krótkim czasie pełny projekt z Vue, Nest i PocketBase jest nierealistyczny.
Oto bardziej realistyczne podejście na 3 godziny:
Drastycznie uprość stack:
Użyj gotowego szablonu HTML/CSS/JS zamiast Vue
Wykorzystaj Firebase/Supabase zamiast własnego backendu
Zrezygnuj z własnego systemu uwierzytelniania
MVP w 3 godziny:
Statyczna strona opisująca cel petycji
Prosty formularz zapisujący dane bezpośrednio do bazy
Wyświetlanie listy podpisów z Firebase/Supabase
Konkretny plan działania:
30 min: Przygotowanie prostej strony HTML
45 min: Konfiguracja Firebase/Supabase
45 min: Integracja formularza z bazą danych
30 min: Wyświetlanie listy podpisów
30 min: Testy i wdrożenie
Jeśli masz tylko 3 godziny, najrozsądniej byłoby stworzyć bardzo prosty prototyp koncepcyjny bez większości zaplanowanych funkcjonalności.