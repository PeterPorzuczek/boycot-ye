<conversation_summary>

<decisions>
1. Docelowa grupa odbiorców petycji to ogół społeczeństwa ("Świat")
2. Formularz będzie zbierał tylko imię, nazwisko i adres email
3. Użytkownik akceptuje jeden checkbox oraz decyduje czy jego podpis ma być publiczny
4. W pierwszej iteracji nie będzie zabezpieczeń przed botami (CAPTCHA)
5. Zalogowani użytkownicy będą mieli jedną opcję - rezygnację z podpisu
6. Email będzie maskowany: pierwsza litera + ostatni znak przed '@' + pełna domena
7. Nie planuje się mechanizmów moderacji treści ani weryfikacji użytkowników
8. Oczekiwany ruch: 1000 podpisów
9. Metryka sukcesu: wzrost liczby podpisów
10. Zgodność z RODO według standardowych praktyk internetowych
11. Integracja z social media planowana po MVP
12. Brak planowanych działań po zebraniu podpisów
13. Czas na przygotowanie MVP: 2 godziny
</decisions>

<matched_recommendations>
1. Priorytetyzacja funkcjonalności według wartości: podpisanie petycji > przeglądanie listy > edycja własnego podpisu
2. Maksymalne wykorzystanie możliwości uwierzytelniania PocketBase bez tworzenia własnych złożonych rozwiązań
3. Przygotowanie jasnej i zwięzłej treści petycji przed podpisaniem
4. Zapewnienie zgodności z RODO poprzez jawne formularze zgody
5. Ograniczenie funkcjonalności edycji do minimum (tylko usunięcie podpisu)
6. Stopniowe wdrażanie - najpierw podstawowy MVP, potem dodatkowe funkcje
7. Wykorzystanie gotowych komponentów UI z ekosystemu Vue dla przyspieszenia prac
</matched_recommendations>

<prd_planning_summary>
Projekt "Boycott Kanye" to aplikacja webowa umożliwiająca podpisywanie petycji sprzeciwiającej się antysemickim poglądom Kanye Westa. MVP koncentruje się na podstawowej funkcjonalności petycji online.

**Funkcjonalności MVP:**
- Prosta strona z opisem celu petycji
- Formularz zbierający imię, nazwisko i email (bez dodatkowych danych)
- Możliwość zaznaczenia zgody na potępienie poglądów rapera
- Opcja wyboru widoczności danych osobowych na liście podpisów
- Publiczna lista podpisów z częściowo zamaskowanymi adresami email
- Możliwość rezygnacji z podpisu dla zalogowanych użytkowników
- Uwierzytelnianie poprzez PocketBase
- Brak zaawansowanych zabezpieczeń przed botami w pierwszej wersji

**Ścieżki użytkownika:**
1. Niezalogowany użytkownik:
   - Przegląda listę podpisów
   - Zapoznaje się z celem petycji
   - Rejestruje się aby podpisać petycję

2. Zalogowany użytkownik:
   - Podpisuje petycję (zaznacza checkbox)
   - Wybiera widoczność swoich danych
   - Może wycofać swój podpis

**Kryteria sukcesu:**
- Wzrastająca liczba podpisów pod petycją
- Docelowo osiągnięcie około 1000 podpisów
- Sprawne działanie aplikacji bez opóźnień

**Stack techniczny:**
- Frontend: Vue 3 z minimalistycznym UI
- Backend: Node.js/Nest.js jako wrapper dla PocketBase
- Baza danych i uwierzytelnianie: PocketBase
</prd_planning_summary>

<unresolved_issues>
1. Czy czas realizacji MVP (2 godziny) jest realistyczny, biorąc pod uwagę wymagane funkcjonalności?
2. Jak dokładnie będzie wyglądać implementacja zgodności z RODO (określone jako "Zgodnie z zasadami internetu")?
3. Brak szczegółowego planu na skalowanie jeśli petycja zyska większą popularność niż przewidywane 1000 podpisów
4. Czy potwierdzenie email będzie wymagane przy rejestracji, czy użytkownicy będą mogli podpisywać się bez weryfikacji?
5. Jakiego rodzaju walidacja danych zostanie zastosowana przy podpisywaniu?
</unresolved_issues>

</conversation_summary>