# Prompt: Proof of Concept dla aplikacji "Boycott Kanye"

Twoim zadaniem jest wygenerowanie prostego proof of concept dla aplikacji "Boycott Kanye" - petycji online potępiającej antysemickie poglądy Kanye Westa. PoC powinien weryfikować WYŁĄCZNIE kluczową funkcjonalność: możliwość podpisania petycji i wyświetlania listy podpisów.

## Stack technologiczny
- Frontend: Vue 3 + Axios
- Backend: Nest.js jako wrapper dla PocketBase 
- Baza danych/uwierzytelnianie: PocketBase

## Funkcjonalność do zweryfikowania:
1. Prosta rejestracja i logowanie użytkownika (wykorzystaj gotowe funkcje PocketBase)
2. Podpisanie petycji przez zalogowanego użytkownika (zapisanie checkbox + opcja widoczności danych)
3. Wyświetlanie publicznej listy podpisów z maskowanymi adresami email
4. Możliwość usunięcia własnego podpisu

## Wyłącz następujące funkcje:
- Responsywny design
- Weryfikację email
- Potwierdzenia i walidacje
- CAPTCHA czy zabezpieczenia przeciw botom
- Integracje z mediami społecznościowymi
- Zaawansowaną edycję podpisów
- Dashboard i analitykę

## Wymagania dla PoC:
- Minimalistyczny interfejs użytkownika
- Bezpośrednia integracja z PocketBase
- Minimalna konfiguracja niezbędna do działania
- Szybki czas wdrożenia

## Instrukcje wykonania:
1. Najpierw przedstaw plan pracy dla PoC - podziel zadanie na etapy
2. Opisz przewidywany czas realizacji każdego etapu
3. OCZEKUJ MOJEJ AKCEPTACJI planu zanim przejdziesz dalej
4. Dopiero po akceptacji rozpocznij generowanie kodu dla PoC
5. Generuj kod w małych, sprawdzalnych fragmentach

Celem PoC jest WYŁĄCZNIE potwierdzenie wykonalności kluczowych funkcji, nie tworzenie pełnej aplikacji produkcyjnej.