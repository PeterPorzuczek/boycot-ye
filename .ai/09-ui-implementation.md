# Plan implementacji widoku strony podpisywania petycji

## 1. Przegląd
Widok "Podpisywanie petycji" to kluczowy element aplikacji "Boycott Kanye", umożliwiający zalogowanym użytkownikom złożenie wirtualnego podpisu pod petycją potępiającą antysemickie i nazistowskie poglądy Kanye Westa. Widok zawiera formularz z checkboxem zgody oraz opcją wyboru widoczności danych osobowych użytkownika na publicznej liście podpisów.

## 2. Routing widoku
- Ścieżka: `/sign`
- Wymaganie: dostęp tylko dla zalogowanych użytkowników (chronione przez Vue Router guards)
- Przekierowanie: po podpisaniu → `/thank-you`

## 3. Struktura komponentów

SignPage
├── PageHeader
├── SignForm
│ ├── UserInfoSection
│ ├── ConsentCheckbox
│ ├── VisibilityToggle
│ └── SubmitButton
└── PageFooter


## 4. Szczegóły komponentów
### SignPage
- Opis komponentu: Główny komponent strony podpisywania petycji, zawierający nagłówek, formularz podpisu i stopkę.
- Główne elementy: Kontener strony, hook `useAuth()` do pobierania danych zalogowanego użytkownika, hook `useSignature()` do sprawdzania i zarządzania stanem podpisu.
- Obsługiwane interakcje: Przekierowanie przy braku logowania, przekierowanie jeśli użytkownik już podpisał.
- Obsługiwana walidacja: Sprawdzenie czy użytkownik jest zalogowany.
- Typy: AuthState, SignatureState
- Propsy: Brak (komponent najwyższego poziomu).

### SignForm
- Opis komponentu: Formularz podpisania petycji zawierający dane użytkownika, checkbox zgody i opcję widoczności.
- Główne elementy: Formularz HTML, sekcja danych użytkownika (imię, nazwisko, email), checkbox zgody, przełącznik widoczności, przycisk "Podpisz petycję".
- Obsługiwane interakcje: 
  - Zmiana stanu checkboxa zgody
  - Zmiana stanu opcji widoczności
  - Wysłanie formularza
- Obsługiwana walidacja: 
  - Checkbox zgody musi być zaznaczony (walidacja UI i API)
  - Dane użytkownika muszą być uzupełnione (z systemu autentykacji)
- Typy: User, SignFormModel, CreateSignatureDto
- Propsy: 
  - user: User - dane zalogowanego użytkownika
  - onSubmit: Function - funkcja wywoływana po pomyślnym złożeniu formularza

### UserInfoSection
- Opis komponentu: Sekcja wyświetlająca dane użytkownika, które będą dołączone do podpisu.
- Główne elementy: Pola wyświetlające imię, nazwisko i email użytkownika (nieedytowalne).
- Obsługiwane interakcje: Brak (komponent tylko do wyświetlania).
- Obsługiwana walidacja: Brak.
- Typy: User
- Propsy: 
  - user: User - dane zalogowanego użytkownika

### ConsentCheckbox
- Opis komponentu: Checkbox potwierdzający zgodę na potępienie poglądów Kanye Westa.
- Główne elementy: Input typu checkbox, etykieta opisująca cel petycji.
- Obsługiwane interakcje: Zmiana stanu checkboxa.
- Obsługiwana walidacja: Checkbox musi być zaznaczony, aby można było złożyć podpis.
- Typy: Brak specyficznych typów.
- Propsy: 
  - value: boolean - stan checkboxa
  - onChange: Function - funkcja obsługująca zmianę stanu

### VisibilityToggle
- Opis komponentu: Przełącznik określający, czy dane użytkownika mają być widoczne na publicznej liście podpisów.
- Główne elementy: Input typu checkbox lub przełącznik, etykieta opisująca efekt wyboru.
- Obsługiwane interakcje: Zmiana stanu przełącznika.
- Obsługiwana walidacja: Brak (opcjonalny wybór).
- Typy: Brak specyficznych typów.
- Propsy: 
  - value: boolean - stan widoczności
  - onChange: Function - funkcja obsługująca zmianę stanu

### SubmitButton
- Opis komponentu: Przycisk wysyłający formularz podpisu.
- Główne elementy: Przycisk typu submit, wskaźnik ładowania podczas wysyłania.
- Obsługiwane interakcje: Kliknięcie przycisku.
- Obsługiwana walidacja: Przycisk nieaktywny, gdy formularz jest nieprawidłowy lub w trakcie wysyłania.
- Typy: Brak specyficznych typów.
- Propsy: 
  - isSubmitting: boolean - stan wysyłania formularza
  - isValid: boolean - czy formularz jest prawidłowo wypełniony

## 5. Typy
```typescript
// Podstawowy typ użytkownika
interface User {
  id: string;
  name: string;
  email: string;
}

// Model formularza podpisu
interface SignFormModel {
  agreeCheckbox: boolean;
  publicDisplay: boolean;
  isSubmitting: boolean;
  error: string | null;
}

// DTO do tworzenia podpisu
interface CreateSignatureDto {
  userId: string;
  agreeCheckbox: boolean;
  publicDisplay: boolean;
}

// Stan autentykacji
interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
}

// Stan podpisu
interface SignatureState {
  hasUserSigned: boolean;
  signature: SignatureDto | null;
}

// Odpowiedź API dla podpisu
interface SignatureDto {
  id: string;
  user: string;
  agree_checkbox: boolean;
  public_display: boolean;
  created: string;
  expand: {
    id: string;
    name: string;
    email: string;
  };
}
```

## 6. Zarządzanie stanem
Widok wykorzysta dwa customowe hooki do zarządzania stanem:

### useAuth()
Hook odpowiedzialny za zarządzanie stanem autentykacji:
```javascript
export function useAuth() {
  const user = ref(null);
  const token = ref(localStorage.getItem('token'));
  const isLoggedIn = computed(() => !!token.value);

  // Metody logowania, rejestracji i wylogowania...

  return {
    user,
    token,
    isLoggedIn
  };
}
```

### useSignature()
Hook odpowiedzialny za zarządzanie stanem podpisu:
```javascript
export function useSignature() {
  const signature = ref(null);
  const hasUserSigned = computed(() => !!signature.value);
  const isCreatingSignature = ref(false);
  const error = ref(null);

  const fetchUserSignature = async () => {
    // Implementacja pobierania podpisu użytkownika
  };

  const createSignature = async (signatureData) => {
    // Implementacja tworzenia podpisu
  };

  return {
    signature,
    hasUserSigned,
    isCreatingSignature,
    error,
    fetchUserSignature,
    createSignature
  };
}
```

### Lokalny stan komponentu
Komponent `SignPage` będzie zarządzał lokalnym stanem formularza:
```javascript
const formState = reactive({
  agreeCheckbox: false,
  publicDisplay: true,
  isSubmitting: false,
  error: null
});
```

## 7. Integracja API
Widok integruje się z API poprzez endpoint `/api/signatures`:

### Tworzenie podpisu
- Metoda: `POST`
- Endpoint: `/api/signatures`
- Dane wejściowe: 
  ```json
  {
    "userId": "string",
    "agreeCheckbox": true,
    "publicDisplay": true
  }
  ```
- Nagłówki: `Authorization: Bearer {token}`
- Odpowiedź sukcesu (201):
  ```json
  {
    "id": "string",
    "user": "string",
    "agree_checkbox": true,
    "public_display": true,
    "created": "string",
    "expand": {
      "id": "string",
      "name": "string",
      "email": "string"
    }
  }
  ```
- Błędy: 
  - 400: Nieprawidłowe dane
  - 401: Brak autoryzacji
  - 409: Użytkownik już podpisał petycję

### Sprawdzanie statusu podpisu
- Metoda: `GET`
- Endpoint: `/api/signatures/me`
- Nagłówki: `Authorization: Bearer {token}`
- Odpowiedź sukcesu (200): Dane podpisu (jak powyżej)
- Błędy: 
  - 401: Brak autoryzacji
  - 404: Użytkownik nie podpisał jeszcze petycji

## 8. Interakcje użytkownika
1. **Wejście na stronę**:
   - System sprawdza stan autentykacji
   - Jeśli użytkownik nie jest zalogowany: przekierowanie do `/login`
   - Jeśli użytkownik jest zalogowany: sprawdzenie czy już podpisał petycję
   - Jeśli już podpisał: przekierowanie do `/profile`
   - Jeśli nie podpisał: wyświetlenie formularza

2. **Interakcja z formularzem**:
   - Zaznaczenie/odznaczenie checkboxa zgody
   - Włączenie/wyłączenie opcji widoczności danych
   - Przycisk "Podpisz petycję" jest aktywny tylko gdy checkbox zgody jest zaznaczony

3. **Wysłanie formularza**:
   - Kliknięcie przycisku "Podpisz petycję"
   - Wyświetlenie wskaźnika ładowania
   - Wysłanie danych do API
   - Po sukcesie: przekierowanie do `/thank-you`
   - W przypadku błędu: wyświetlenie komunikatu o błędzie

## 9. Warunki i walidacja
1. **Walidacja checkboxa zgody**:
   - Checkbox musi być zaznaczony, aby aktywować przycisk "Podpisz petycję"
   - Walidacja na poziomie UI: blokada przycisku
   - Walidacja na poziomie API: sprawdzenie wartości `agreeCheckbox`

2. **Walidacja autentykacji**:
   - Użytkownik musi być zalogowany
   - Walidacja na poziomie UI: przekierowanie do `/login`
   - Walidacja na poziomie API: sprawdzenie tokenu

3. **Walidacja unikalności podpisu**:
   - Użytkownik może mieć tylko jeden podpis
   - Walidacja na poziomie UI: sprawdzenie `hasUserSigned`
   - Walidacja na poziomie API: sprawdzenie czy użytkownik już podpisał (kod 409)

## 10. Obsługa błędów
1. **Błędy autentykacji**:
   - Wygaśnięcie tokenu: przekierowanie do `/login`
   - Brak wymaganych uprawnień: wyświetlenie komunikatu o błędzie

2. **Błędy API**:
   - 400 (Bad Request): wyświetlenie komunikatu o nieprawidłowych danych
   - 409 (Conflict): wyświetlenie informacji, że użytkownik już podpisał petycję i przekierowanie do `/profile`
   - 500 (Server Error): wyświetlenie ogólnego komunikatu o błędzie serwera

3. **Błędy połączenia**:
   - Utrata połączenia: wyświetlenie komunikatu o braku możliwości połączenia z serwerem
   - Timeout: wyświetlenie komunikatu o zbyt długim czasie oczekiwania

## 11. Kroki implementacji
1. Utworzenie struktury plików:
   ```
   src/
   ├── views/
   │   └── SignPage.vue
   ├── components/
   │   ├── SignForm.vue
   │   ├── UserInfoSection.vue
   │   ├── ConsentCheckbox.vue
   │   ├── VisibilityToggle.vue
   │   └── SubmitButton.vue
   ├── composables/
   │   ├── useAuth.js
   │   └── useSignature.js
   ├── router/
   │   └── index.js (dodanie zabezpieczonej ścieżki)
   └── api/
       └── signatures.js (metody API)
   ```

2. Implementacja customowych hooków:
   - Utworzenie `useAuth.js` do zarządzania autentykacją
   - Utworzenie `useSignature.js` do zarządzania stanem podpisu

3. Dodanie zabezpieczonej ścieżki w routerze:
   - Konfiguracja ścieżki `/sign` z meta: `{ requiresAuth: true }`
   - Implementacja guard nawigacji sprawdzający token

4. Implementacja komponentów:
   - Implementacja komponentu `SignPage.vue` z logiką sprawdzania stanu użytkownika
   - Implementacja `SignForm.vue` z logiką formularza
   - Implementacja pozostałych komponentów formularza

5. Integracja z API:
   - Utworzenie metod API dla podpisów
   - Implementacja obsługi błędów

6. Testowanie:
   - Testowanie funkcjonalności jako zalogowany/niezalogowany użytkownik
   - Testowanie walidacji formularza
   - Testowanie obsługi różnych odpowiedzi API

7. Implementacja nawigacji po akcjach:
   - Przekierowanie po podpisaniu petycji
   - Przekierowanie w przypadku błędów