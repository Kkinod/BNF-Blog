# Projekt Blog

## Spis treści

- [Dodane](#dodane)
- [TODO](#todo)
- [Problemy](#problemy)
- [Struktura Projektu](#struktura-projektu)
- [Rozpoczęcie pracy](#rozpoczęcie-pracy)
- [Changelog](#changelog)

  - [[0.9.43] - Posts: API Optimization](#0943---posts-api-optimization)
  - [[0.9.42] - Posts: API and Security Improvements](#0942---posts-api-and-security-improvements)
  - [[0.9.41] - Posts: Delete Implementation](#0941---posts-delete-implementation)
  - [[0.9.4] - Posts: Edit Implementation](#094---posts-edit-implementation)
  - [[0.9.3] - Authentication Security](#093---authentication-security)
  - [[0.9.2] - Hooks Refactoring and Improvements](#092---hooks-refactoring-and-improvements)
  - [[0.9.1] - Email Verification Process Improvements](#091---email-verification-process-improvements)
  - [[0.9.0] - Error Handling and API Tests](#090---error-handling-and-api-tests)
  - [[0.8.9] - Security & Editor Enhancements](#089---security--editor-enhancements)
  - [[0.8.8] - Tests](#088---tests)
  - [[0.8.7] - Loader and Testing Enhancements](#087---loader-and-testing-enhancements)
  - [[0.8.61] - Security Part 2](#0861---security-part-2)
  - [[0.8.6] - Security](#086---security)
  - [[0.8.5] - "Editor's pick"](#085---editors-pick)
  - [[0.8.4] - Caching and Hidden Posts Enhancements](#084---caching-and-hidden-posts-enhancements)
  - [[0.8.3] - 404 Page and UI Improvements](#083---404-page-and-ui-improvements)
  - [[0.8.2] - Admin Panel Tabs](#082---admin-panel-tabs)
  - [[0.8.1] - Admin Panel Posts List](#081---admin-panel-posts-list)
  - [[0.8.0] - Admin Panel](#080---admin-panel)

  [Dokumentacja testów bezpieczeństwa](./docs/security-tests.md)

## Dodane

- Użyta biblioteki do "sanitize" - DOMPurify, drobny problem, mianowicie większość bibliotek działa w środowisku, które musi mieć dostęp do obiektu window. DOMPurify działa po stronie klienta, gdyż nie polega na DOM, który jest dostępny tylko w przeglądarce. Dlatego też by nie zmieniać komponentu na komponent kliencki trzeba było poszukać biblioteki która wykonuje sanitację po stronie serwera, czyli taką która nie zależy od API przeglądarki.

### Login and register:

- Użycie bcript
- Zahashowanie hasła + sól
- next-auth v5
- Middleware
- Logowanie przy użyciu server actions
- Jest zabezpieczenie które powoduje, że jeżeli stworzymy konto za pomocą danego maila (czy to np. google czy github) to nie możemy zarejestrować się za pomocą tego samego maila przy pomocy innej metody, np. stworzyliśmy konto logując się za pomocą "google" i maila "abc@def.com" i następnie spróbujemy zalogować/zarejestrować się za pomocą "github" który jest zarejestrowany na ten sam email, czyli "abc@def.com" to nie będziemy mogli tego zrobić, przekieruje nas do default strony:
  ![Default page](https://i.gyazo.com/87876e9860c8c226ad0ee7e75515cb3e.png)
  ale by nie korzystać z tej domyślnej strony, stworzyłem swój własny widok:
  ![New view page](https://i.gyazo.com/04c933853cf5c8f5416103c1c402b0f2.png)
  a sytuację w której będziemy próbować logować się przy pomocy tego samego maila ale innej metody obsłużyłem wyświetlając po prostu błąd na stronie logowania:
  ![New view page](https://i.gyazo.com/d738c07b5b76a49080f626b23243aae3.png)
  A wracając do kwestii logowania się za pomocą tego samego maila ale innej metody i tego dlaczego się tak domyślnie nie da, odpowiedź możemy znaleźć na:
  https://next-auth.js.org/faq
  w sekcji "security" i pytaniu "When I sign in with another account with the same email address, why are accounts not linked automatically?"
- Dodane zabezpieczenie przed stworzeniem konta mieszanego (np. zarejestrowanego za pomocą Googla i 0Auth (email + hasło)) - za pomocą resetu hasła
- Do wysyłania emaila z potwierdzeniem przy rejestracji użyty resend.com

## TODO

### Ważne!

- POPRAWIC wymagania co do hasła (NIST 800-63B), szczególnie, że teraz np. przy rejestracji gdy podamy za krótkie hasło to wyskakuje, że "Password is required" i nie ma żadnych wymagań poza 7 znakami

- Zmienić errory/success podczas rejestracji/logowania/resetu tak, że jak np. podczas rejestracji wykryje, że takie konto istnieje, lub podczas logowania poda się błędne dane, albo spróbuje zresetować hasło to nie informować czy podane dane są dobre czy nie, tylko coś w stylu "jeśli podane dane są prawidło to na podany email został właśnie wysłany link z resetem hasła"
- WAŻNE: !!! dodać czas który musi upłynąć by móc ponownie wysłać emaila z resetem hasła!! Reset hasła
- Captcha do logowania!
- Sprawdzić czy potrzebne jest dadanie tokenów CSRF – biblioteka "cursf" lub "next-csrf" – a następnie dodać tokeny do inputów czyli np. podczas logowania oraz dodawania komentarzy

### Zmiana hasła:

- PO ZMIANIE HASŁA (w panelu admina) MA WYLOGOWAĆ, dodatkowo musi być wymagane potwierdzenie zmiany hasła wysłanym mailem
- Po kilkukrotnym złym wpisaniu hasła (wymaganego podczas zmiany hasła w panelu admina) ma się wylogować lub zablokować logowanie na x czasu
- Po resecie hasła (użytkownik nie zalogowany) gdy klikniemy w link w mailu z resetem hasła i wpiszemy nowe hasło to ma przekierować do strony logowania

Tymczasem ma być:

- Jak złe hasło to informacja, że złe dane
- Jak dobre hasło to przenosić na stronę z informacją, że mail wysłany, czyli to samo co w sytuacji gdy zarejestrujemy się. Zabezpieczyć przed ciągłym wysyłaniem emaila np. cofając się i ponownie się logując

### Rejestracja:

- Drugi input gdzie wymagane jest potwierdzenie hasła

### Two Factor Authentication:

- Przy włączeniu/wyłaczeniu 2FA ma się wylogować
- Przy wyłączeniu 2FA ma wysłać maila z potwierdzeniem

### Zabezpieczenia:

- By zabezpieczyć przed bruteforce:
  - Dodać max aktywną sesję 1
  - Captacha?

### "DEFAULT" zdjęcia do posta:

- Niech każda kategoria ma inne domyślne zdjęcie

  Dodatkowo zabawne:

  - Grafika gdy próbujemy przejść na post którego nie ma
  - Grafika gdy próbujemy przejść na stronę której nie ma, np. /aaa

## Problemy

- Wysyła maila z potwierdzeniem nawet jeśli hasło jest złe (a może to jest dobre rozwiązanie i po prostu wyświetlać inne informacje? a nie typu, że "Confirmation email sent!")
- Jeśli ukryjemy jakiś post i wrócimy na stronę główną, to wygląda jakby nie przeładowywało strony, ponieważ post nie ukrywa się np. z sekcji "What's hot" dopiero po odświeżeniu strony

## Struktura Projektu

```
src/
├── app/                    # Next.js routing and pages
│   ├── (protected)/        # Protected routes (requires authentication)
│   ├── api/                # Backend API endpoints (route handlers)
│   │   ├── posts/
│   │   ├── comments/
│   │   ├── categories/
│   │   ├── admin/
│   │   └── auth/
│   ├── write/              # Post creation page
│   ├── category/           # Category view page
│   ├── register/           # User registration page
│   ├── reset/              # Password reset page
│   ├── new-verification/   # Email verification page
│   ├── new-password/       # New password setup page
│   ├── login/              # Login page
│   ├── error/              # Error page
│   └── posts/              # Blog posts pages
│
├── features/               # Main application features
│   ├── auth/               # Authentication feature
│   │   └── utils/          # Auth utilities
│   │       └── data/       # Auth data handling functions
│   │           ├── paswordResetToken.tsx
│   │           ├── twoFactorToken.tsx
│   │           ├── accout.tsx
│   │           ├── twoFactorConfirmation.tsx
│   │           ├── verificationToken.tsx
│   │           └── user.tsx
│   │
│   └── blog/              # Blog feature
│       ├── api/           # Client-side API communication functions
│       │   ├── comments/
│       │   ├── posts/
│       │   ├── pickPosts/
│       │   ├── popularPosts/
│       │   ├── singlePost/
│       │   ├── cardList/
│       │   └── categories/
│       └── utils/        # Blog utilities
│
├── hooks/                # Custom React hooks
│   ├── auth/
│   └── blog/
│
├── shared/               # Shared resources
│   ├── components/       # All React components
│   │   ├── atoms/        # Basic components (buttons, inputs, etc.)
│   │   ├── molecules/    # Composite components (forms, cards, etc.)
│   │   ├── organisms/    # Complex components (headers, footers, etc.)
│   │   ├── pages/        # Page components
│   │   └── ui/           # UI components
│   │
│   ├── utils/            # Shared utilities
│   ├── context/          # React contexts
│   └── middleware.ts     # Application middleware
│
├── providers/            # React providers
│   ├── AuthProvider.tsx
│   └── ThemePrvider.tsx
│
└── config/               # Application configuration
    ├── constants.ts
    └── config.ts
```

This structure follows a feature-based organization pattern where:

- Each feature (auth, blog) has its own directory with related components, API calls, and utilities
- Shared components and utilities are centralized in the `shared` directory
- All custom hooks are grouped in the `hooks` directory
- API endpoints are organized by feature in the `app/api` directory
- Pages and routing are handled by Next.js in the `app` directory

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Rozpoczęcie pracy

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Changelog

### [0.9.43] - Posts: API Optimization

#### Changed

- Optymalizacja API pobierającego listę postów:
  - Usunięcie pola `desc` z odpowiedzi API dla list postów, co znacząco zmniejsza ilość przesyłanych danych
  - Utworzenie dedykowanego typu `ListPost` dla postów w listach (bez dużych pól HTML)
  - Aktualizacja wszystkich komponentów klienckich do korzystania z nowego typu
  - Ulepszenie zapytania Prisma, aby pobierały tylko niezbędne pola, poprawiając wydajność i zmniejszając problemy z pamięcią podręczną
- Rozwiązanie problemów z limitami pamięci cache w Next.js:
  - Zmniejszenie rozmiaru odpowiedzi API dla list postów poprzez wykluczenie dużych opisów HTML
  - Optymalizacja wywołań `$transaction` do precyzyjnego pobierania tylko wymaganych danych
  - Aktualizacja komponentów wyświetlających listy postów (panel admina, strona główna)

### [0.9.42] - Posts: API and Security Improvements

#### Added

- Ulepszenie zabezpieczeń i kontroli dostępu do postów:
  - Administratorzy mogą zawsze przeglądać posty (włącznie z ukrytymi)
  - Pozostali użytkownicy widzą tylko posty oznaczone jako widoczne (isVisible: true)
  - Licznik wyświetleń (views) zwiększany tylko dla niebędących administratorami
  - Wzmocniona kontrola dostępu przy pobieraniu pojedynczego posta
- Rozszerzenie funkcjonalności API dla postów:
  - Ulepszenie endpointu GET do pobierania pojedynczego posta
  - Optymalizacja pobierania danych z bazy (włączenie danych użytkownika w zapytaniu)
  - Standardowa obsługa błędów dla wszystkich metod HTTP
  - Lepsza walidacja i obsługa nietypowych przypadków
- Aktualizacja obsługi błędów API:
  - Spójne obsługiwanie błędów 404 dla nieistniejących postów
  - Standardowa obsługa niedozwolonych metod HTTP
  - Jednolite komunikaty błędów i odpowiednie kody odpowiedzi

#### Changed

- Refaktoryzacja systemu pobierania pojedynczego posta:
  - Poprawa struktury danych zwracanej przez API
  - Optymalizacja wydajności przez eliminację zbędnych zapytań do bazy
  - Spójne uwzględnianie uprawnień użytkownika
- Ulepszenie komunikatów i etykiet:
  - Standardowe komunikaty błędów z modułu labels
  - Jednolite nazewnictwo zgodne z konwencją w całym projekcie

### [0.9.41] - Posts: Delete Implementation

#### Added

- Pełna funkcjonalność usuwania postów:
  - Implementacja metody DELETE w API dla postów
  - Walidacja uprawnień użytkownika (tylko admin może usuwać posty)
  - Weryfikacja istnienia posta przed usunięciem
  - Obsługa błędów podczas procesu usuwania
- Rozszerzenie obsługi błędów API:
  - Standardowe komunikaty błędów dla brakującego ID posta
  - Właściwa obsługa przypadków gdy post nie istnieje
  - Ujednolicone komunikaty potwierdzające usunięcie posta

### [0.9.4] - Posts: Edit Implementation

#### Added

- Implementacja pełnej funkcjonalności edycji postów:
  - Formularz edycji postów z dynamicznym ładowaniem istniejących danych
  - Walidacja formularza z komunikatami błędów
  - Możliwość edycji wszystkich pól: tytułu, treści, kategorii i obrazka
  - Automatyczne zapisywanie oryginalnego obrazka jeśli nie został zmieniony
- Przetwarzanie zmian w API:
  - Endpointy do aktualizacji postów z pełną walidacją po stronie serwera
  - Zabezpieczenia przed duplikacją tytułów
  - Weryfikacja uprawnień użytkownika do edycji posta
- Testy jednostkowe dla hooka useEditPostForm:
  - Testy inicjalizacji z danymi posta
  - Testy walidacji formularza
  - Testy obsługi błędów API
  - Testy poprawnego wykonania aktualizacji

#### Changed

- Rozszerzenie API postów o metodę PATCH do aktualizacji
- Optymalizacja pobierania danych posta przed edycją
- Usprawnienie UX dla formularza edycji

### [0.9.3] - Authentication Security

#### Added

- Wdrożenie zaawansowanych mechanizmów bezpieczeństwa uwierzytelniania:
  - Normalizacja czasu odpowiedzi dla procesów uwierzytelniania
  - Spójne odpowiedzi serwera niezależnie od poprawności danych
  - Ochrona przed atakami typu enumeration (wyliczanie użytkowników)
  - Jednolite komunikaty błędów dla zwiększenia prywatności użytkowników
- Kompleksowe testy bezpieczeństwa:
  - Testy różnych scenariuszy uwierzytelniania
  - Analiza odporności na potencjalne zagrożenia
  - Weryfikacja spójności zachowania systemu
  - Pomyślne wyniki testów bezpieczeństwa (patrz [dokumentacja testów](./docs/security-tests.md))

#### Changed

- Refaktoryzacja procesów uwierzytelniania:
  - Ujednolicenie obsługi błędów w procesach logowania, rejestracji i resetowania hasła
  - Optymalizacja wydajności przy zachowaniu wysokiego poziomu bezpieczeństwa
  - Poprawa UX podczas procesów uwierzytelniania
- Aktualizacja konfiguracji dla mechanizmów bezpieczeństwa

#### Security

- Wzmocnienie ochrony przed atakami czasowymi (timing attacks)
- Zabezpieczenie przed atakami typu brute force poprzez normalizację odpowiedzi
- Ochrona prywatności użytkowników poprzez ujednolicone komunikaty

### [0.9.2] - Hooks Refactoring and Improvements

#### Added

- Dodano testy jednostkowe dla hooków:
  - useTimeCounter
  - useTwoFactorAuth
  - useEmailVerification

#### Changed

- Refaktoryzacja hooka useTimeCounter:
  - Poprawiona logika odliczania czasu
  - Lepsze zarządzanie zasobami i czyszczenie interwałów
  - Dokładniejsze formatowanie czasu (format MM:SS)
- Refaktoryzacja hooka useTwoFactorAuth:
  - Uproszczenie logiki zarządzania kodem 2FA
  - Poprawiona obsługa błędów i walidacja danych
  - Lepsza integracja z useTimeCounter

#### Fixed

- Poprawiono obsługę wygasania kodu 2FA
- Naprawiono problemy z resetowaniem timera

### [0.9.1] - Email Verification Process Improvements

#### Added

- Ulepszony system weryfikacji email:
  - Dodanie limitu czasu między kolejnymi próbami wysłania emaila weryfikacyjnego
  - Wyświetlanie czasu pozostałego do możliwości ponownego wysłania emaila
  - Wizualne wskazanie stanu przycisku "Resend verification email"

#### Changed

- Poprawiony proces logowania dla niezweryfikowanych kont:
  - Przekierowanie na stronę weryfikacji zamiast wyświetlania komunikatu toast
  - Weryfikacja poprawności danych logowania przed wysłaniem emaila weryfikacyjnego
  - Ujednolicenie komunikatów o błędach podczas logowania
- Refaktoryzacja komponentu LoginPageView:
  - Wydzielenie logiki do dedykowanych hooków (useEmailVerification, useTwoFactorAuth, useTimeCounter)
  - Podział na mniejsze komponenty (LoginForm, TwoFactorForm, VerificationView)
  - Poprawa testów jednostkowych
  - Zwiększenie modularności i czytelności kodu
  - Ułatwienie utrzymania i rozszerzania funkcjonalności

#### Fixed

- Naprawiono problem z wielokrotnym wysyłaniem emaili weryfikacyjnych
- Poprawiono obsługę błędów podczas procesu weryfikacji
- Usprawniono UX podczas procesu weryfikacji email
- Naprawiono problem z niepoprawnym sprawdzaniem kodu 2FA
- Poprawiono obsługę importów w komponentach związanych z logowaniem

### [0.9.0] - Error Handling and API Tests

#### Added

- Implementacja globalnej obsługi błędów zgodnie z najlepszymi praktykami Next.js 14:

  - Dodanie komponentu `error.tsx` dla obsługi błędów na poziomie strony
  - Dodanie komponentu `global-error.tsx` dla obsługi błędów na poziomie root
  - Dodanie komponentu `loading.tsx` dla obsługi stanu ładowania
  - Implementacja dynamicznej trasy catch-all dla poprawnej obsługi 404
  - Usunięcie logowania błędów do konsoli ze względów bezpieczeństwa

- Standaryzacja obsługi błędów w API:

  - Refaktoryzacja wszystkich endpointów API do korzystania z modułu `api-error-handler`
  - Ujednolicenie odpowiedzi błędów z odpowiednimi kodami HTTP
  - Implementacja obsługi niedozwolonych metod HTTP
  - Dodanie nagłówków cache dla optymalizacji wydajności

- Rozszerzenie testów API:
  - Dodanie testów dla wszystkich endpointów API
  - Testy dla różnych scenariuszy błędów i poprawnych odpowiedzi
  - Testy dla różnych metod HTTP
  - Testy dla różnych parametrów zapytań

#### Changed

- Usunięcie niestandardowego komponentu `ErrorBoundary` na rzecz wbudowanych mechanizmów Next.js
- Poprawa nawigacji z komponentu `not-found` do strony głównej
- Optymalizacja komponentu `loading` z wykorzystaniem natywnych animacji
- Zwiększenie bezpieczeństwa aplikacji poprzez usunięcie logowania szczegółów błędów

### [0.8.9] - Security & Editor Enhancements

#### Added

- Implementacja kompleksowych zabezpieczeń aplikacji:

  - Dodanie nagłówków bezpieczeństwa w middleware (CSP, X-Content-Type-Options, X-Frame-Options, HSTS)
  - Konfiguracja kontroli dostępu dla różnych ról użytkowników
  - Obsługa przekierowań dla chronionych tras
  - Konfiguracja nagłówków cache dla API i stron

- Standaryzacja obsługi błędów API:

  - Utworzenie modułu api-error-handler do ujednoliconej obsługi błędów
  - Dodanie funkcji pomocniczych dla typowych błędów (unauthorized, forbidden, not found)
  - Implementacja obsługi błędów metodą HTTP

- Ochrona przed atakami XSS:

  - Dodanie konfiguracji XSS z białą listą dozwolonych tagów i atrybutów HTML
  - Konfiguracja bezpiecznego przetwarzania treści HTML w postach
  - Implementacja sanityzacji danych wejściowych

- Rozszerzenie edytora treści:
  - Dodanie obsługi wstawiania i formatowania obrazów w edytorze ReactQuill
  - Implementacja modułu zmiany rozmiaru obrazów
  - Dodanie opcji formatowania tekstu (pogrubienie, podkreślenie, przekreślenie, kod)
  - Rozszerzenie konfiguracji edytora o dodatkowe opcje formatowania

### [0.8.8] - Tests

#### Added

- Dodanie testów dla komponentu Pages: LoginPageView, RegisterPageView, ResetPageView, NewPasswordPageView, NewVerificationPageView, AuthErrorPageView, UserInfoPageView, WritePageView
- Dodanie testów dla hooków: useCurrentUser, useCurrentRole, usePostForm, useImageUpload

### [0.8.7] - Loader and Testing Enhancements

#### Added

- Dodanie animowanego komponentu Loader z efektem macierzy
- Konfiguracja testów z użyciem Jest i React Testing Library
- Implementacja testów jednostkowych i integracyjnych dla komponentów Loader i WritePageView
- Optymalizacja konfiguracji Babel dla środowiska testowego

#### Changed

- Redesign komponentu WritePageView z nowym interfejsem

### [0.8.61] - Security Part 2

#### Added

- Implementacja kompleksowego systemu rate limitingu:
  - Wykorzystanie Upstash Redis jako bazy danych do przechowywania limitów
  - Implementacja sliding window rate limitów dla krytycznych akcji:
    - Logowanie
    - Rejestracja
    - Reset hasła
    - Komentarze
    - Ponowne wysłanie emaila weryfikacyjnego
  - Stworzenie reużywalnej funkcji pomocniczej do spójnej implementacji limitów
  - Identyfikacja użytkowników z wykorzystaniem zaawansowanych technik
  - Przyjazne dla użytkownika komunikaty o błędach z informacją o czasie oczekiwania
  - Formatowanie czasu oczekiwania w czytelnym formacie
  - Standardowe kody HTTP 429 (Too Many Requests) dla przekroczenia limitów
  - Nagłówki Retry-After dla zgodności ze standardami HTTP

#### Changed

- Rozdzielenie kodu serwerowego i klienckiego:
  - Dodanie odpowiednich dyrektyw do plików serwerowych
  - Wydzielenie funkcji formatowania czasu do osobnego pliku dla użycia po stronie klienta
- Standaryzacja obsługi błędów w całej aplikacji:
  - Zastąpienie niestandardowych typów błędów standardowymi kodami HTTP
  - Ujednolicenie obsługi błędów rate limitingu we wszystkich komponentach
  - Uproszczenie sprawdzania błędów
- Poprawa UX poprzez wyświetlanie czasu oczekiwania w komunikatach o błędach
- Zwiększenie bezpieczeństwa aplikacji przed atakami typu brute force
- Refaktoryzacja komponentów formularzy (LoginPageView, RegisterPageView, ResetPageView)
- Optymalizacja obsługi błędów w komponencie Comments
- Implementacja łagodnej degradacji dla błędów rate limitingu

### [0.8.6] - Security

#### Added

- Dodano Content Security Policy (CSP) w celu zwiększenia bezpieczeństwa aplikacji
- Wdrożono ochronę przed popularnymi zagrożeniami internetowymi
- Ograniczono ładowanie zasobów tylko do zaufanych źródeł
- Wzmocniono ochronę treści generowanych przez użytkowników

Comments

- Sanityzacja XSS dla komentarzy na backendzie
- Walidacja pustych komentarzy zarówno na frontendzie jak i backendzie
- Walidacja długości komentarza z licznikiem znaków
- Konfiguracja maksymalnej długości komentarza jako współdzielona stała
- Wyświetlanie pozostałej liczby znaków w formularzu komentarza
- Zaimplementowano rate limiting dla komentarzy z wykorzystaniem Upstash Redis
- Dodano wyświetlanie czasu oczekiwania przy przekroczeniu limitu komentarzy
- Ulepszenie obsługi błędów i informacji zwrotnych dla użytkownika z powiadomieniami toast

#### Changed

- Przeniesienie komponentu Comments z molecules do organisms
- Aktualizacja stylów dla lepszej kompatybilności z trybem jasnym/ciemnym

### [0.8.5] - "Editor's pick"

#### Added

- Funkcjonalność "Editor's pick":
  - Administrator może oznaczyć do 3 postów jako "pick"
  - Nowa sekcja w Menu pokazująca wybrane posty
  - Przełącznik wyboru/odznaczenia w panelu administratora
  - Wyświetlanie liczby wybranych postów
  - Filtrowanie postów według statusu wyboru w panelu administratora
- Nowy endpoint API dla "Editor's pick" z kontrolą uwierzytelniania
- Nowe etykiety dla funkcjonalności "Editor's

#### Changed

- Przeprojektowano filtry postów w panelu administratora
- Zaktualizowano komponent Menu, aby wyświetlał wybrane posty zamiast zakodowanych na stałe

### [0.8.4] - Caching and Hidden Posts Enhancements

#### Changed

- Implementacja systemu cachowania dla popularnych postów:
  - Dodanie nagłówka Cache-Control z max-age
  - Wprowadzenie mechanizmu stale-while-revalidate
  - Optymalizacja wydajności i redukcja obciążenia bazy danych
  - Poprawa responsywności interfejsu użytkownika
- Zabezpieczenie ukrytych postów:
  - Ukryte posty są niedostępne przez API
  - Próba bezpośredniego dostępu do ukrytego posta zwraca 404
  - Ukryte posty widoczne tylko w panelu administratora
- Ulepszenia w panelu administratora:
  - Blokowanie przycisków hide/show podczas przetwarzania żądania
  - Zapobieganie wielokrotnym kliknięciom podczas zmiany widoczności posta

### [0.8.3] - 404 Page and UI Improvements

#### Added

- Implementacja dedykowanej strony 404 dla nieistniejących kategorii
- Poprawa UX poprzez lepsze komunikaty o błędach

#### Changed

- Przeprojektowanie interfejsu użytkownika:
  - Aktualizacja głównego motywu i tła aplikacji
  - Optymalizacja obrazów dla podstron
  - Modernizacja palety kolorów w nawigacji i nagłówkach
- Naprawa responsywności:
  - Poprawienie działania menu hamburgerowego na urządzeniach mobilnych
  - Dostosowanie układu do różnych rozmiarów ekranów

### [0.8.2] - Admin Panel Tabs

#### Added

- System zakładek w panelu admina (AdminTabs)
  - Generyczny komponent dla zakładek
  - Dwie zakładki: "Posty" i "Użytkownicy"

#### Changed

- Reorganizacja interfejsu panelu admina z wykorzystaniem systemu zakładek
- Przeniesienie listy postów do dedykowanej zakładki

### [0.8.1] - Admin Panel Posts List

#### Added

- Lista postów w panelu admina (PostsList)
- Możliwość przeglądania i zarządzania postami
- Opcja ukrycia postów

### [0.8.0] - Admin Panel

#### Added

- Panel administratora z podstawowymi funkcjonalnościami
- Zabezpieczenia dostępu do panelu admina (kontrola dostępu na podstawie ról)
- Testy API i server actions w panelu admina
