//======================
DODANE:

- użycie biblioteki do "sanitize" - DOMPurify, drobny problem, mianowicie większość bibliotek działa w środowisku, które musi mieć dostęp do obiektu window. DOMPurify działa po stronie klienta, gdyż nie polega na DOM, który jest dostępny tylko w przeglądarce. Dlatego też by nie zmieniać komponentu na komponent kliencki trzeba było poszukać biblioteki która wykonuje sanitację po stronie serwera, czyli taką która nie zależy od API przeglądarki.

Login and register:

- użycie bcript
- zahashowanie hasła i dodanie soli
- next-auth v5
- middleware
- logowanie przy użyciu server actions
- jest zabezpieczenie które powoduje, że jeżeli stworzymy konto za pomocą danego maila (czy to np. google czy github) to nie możemy zarejestrować się za pomocą tego samego maila przy pomocy innej metody, np. stworzyliśmy konto logując się za pomocą "google" i maila "abc@def.com" i następnie spróbujemy zalogować/zarejestrować się za pomocą "github" który jest zarejestrowany na ten sam email, czyli "abc@def.com" to nie będziemy mogli tego zrobić, przekieruje nas do default strony:
  https://gyazo.com/87876e9860c8c226ad0ee7e75515cb3e
  ale by nie korzystać z tej domyślnej strony, stworzyłem swój własny widok:
  https://gyazo.com/04c933853cf5c8f5416103c1c402b0f2
  a sytuację w której będziemy próbować logować się przy pomocy tego samego maila ale innej metody obsłużyłem wyświetlając po prostu błąd na stronie logowania:
  https://gyazo.com/d738c07b5b76a49080f626b23243aae3
  A wracając do kwestii logowania się za pomocą tego samego maila ale innej metody i tego dlaczego się tak domyślnie nie da, odpowiedź możemy znaleźć na:
  https://next-auth.js.org/faq
  w sekcji "security" i pytaniu "When I sign in with another account with the same email address, why are accounts not linked automatically?"
- dodałem zabezpieczenie które zabezpiecza przed stworzeniem konta mieszanego (np. zarejestrowanego za pomocą Googla i 0Auth (email + hasło)) - za pomocą resetu hasła

- do wysyłania emaila z potwierdzeniem przy rejestracji użyłem resend.com (podpiąć domenę przy produkcji)
  //======================

//======================//======================//======================
TODO:

- zmienić errory/success podczas rejestracji/logowania/resetu tak, że jak np. podczas rejestracji wykryje, że takie konto istnieje, lub podczas logowania poda się błędne dane, albo spróbuje zresetować hasło to nie informować czy podane dane są dobre czy nie, tylko coś w stylu "jeśli podane dane są prawidło to na podany email został właśnie wysłany link z resetem hasła"
- do pkt wcześniejszego: gdy rejestrujemy nowe konto i klikniemy dwa razy "Register" to za drugim razem wyskoczy informacja "Email already in use"!!
- WAŻNE: !!! dodać czas który musi upłynąć by móc ponownie wysłać emaila z resetem hasła oraz maila z potwierdzeniem przy rejestracji!! Reset hasła
- zablokować route'y które mają być nie widoczne dla zalogowanych, np. jeśli nie chcę by "http://localhost:3000/api/categories" (endpoint z którego API pobiera listę kategori) nie chcę by był publiczny to zablokować go dla niezalogowanych
- dodać w "catch" obsługę błędu UI
- captcha do logowania!
- zablokować logowanie na x czasu po np. 4x źle wpisanym haśle
- dodać tokeny CSRF – biblioteka "cursf" – a następnie dodać tokeny do inputów czyli np. podczas logowania oraz dodawania komentarzy

- write/page - wydzielić ten kod tak jak w innych page'ach

ZMIANA HASŁA:

- PO ZMIANIE HASŁA (w panelu admina) MA WYLOGOWAĆ, dodatkowo musi być wymagane potwierdzenie zmiany hasła wysłanym mailem
- po kilkukrotnym złym wpisaniu hasła (wymaganego podczas zmiany hasła w panelu admina) ma się wylogować lub zablokować logowanie na x czasu
- po resecie hasła (użytkownik nie zalogowany) gdy klikniemy w link w mailu z resetem hasła i wpiszemy nowe hasło to ma przekierować do strony logowania

KOMENTARZE:

- czyścić input komentarza po dodaniu
- nie można dodać pustego komentarza
- nie można dodać komentarza zawierającego tylko spacji

LOGOWANIE:

- kod weryfikacyjny dla 2FA musi mieć jakąś maksymalną ważność, np. 5 minut

Two Factor Authentication:

- przy włączeniu/wyłaczeniu 2FA ma się wylogować
- przy wyłączeniu 2FA ma wysłać maila z potwierdzeniem

Zabezpieczenia:

- by zabezpieczyć przed bruteforce:
  - dodać limit logowań na połączenie
  - dodać limit resetów hasła
  - dodać max aktywną sesję 1
  - captacha?

//======================//======================//======================

PROBLEMY!!

- wysyła maila z potwierdzeniem nawet jeśli hasło jest złe (a może to jest dobre rozwiązanie i po prostu wyświetlać inne informacje? a nie typu, że "Confirmation email sent!")
- upewnić się czy na produkcji nie ma tego problemu który jest na develope z potwierdzeniem tokena, czyli gdy potwierdzamy maila przez link to odświeża dwa razy i najpierw (czasem tylko mignie) pojawia się informacja, że email został potwierdzony, ale później pojawia się "Token does not exist"

//======================

## Project Structure

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

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

//======================
CHANGELOG:

## [0.9.7] - 2025-03-01

### Added

- Dodanie animowanego komponentu Loader z efektem macierzy
- Konfiguracja testów z użyciem Jest i React Testing Library
- Implementacja testów jednostkowych i integracyjnych dla komponentów Loader i WritePageView
- Optymalizacja konfiguracji Babel dla środowiska testowego

### Changed

- Redesign komponentu WritePageView z nowym interfejsem

## [0.9.61] - 2025-03-02 - Bezpieczeństwo cz. 2

### Added

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

### Changed

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

## [0.9.6] - 2025-02-25 - 2025-02-26 - Bezpieczeństwo

### Added

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

### Changed

- Przeniesienie komponentu Comments z molecules do organisms
- Aktualizacja stylów dla lepszej kompatybilności z trybem jasnym/ciemnym

## [0.9.5] - 2025-02-24 - "Editor's pick"

### Added

- Funkcjonalność "Editor's pick":
  - Administrator może oznaczyć do 3 postów jako "pick"
  - Nowa sekcja w Menu pokazująca wybrane posty
  - Przełącznik wyboru/odznaczenia w panelu administratora
  - Wyświetlanie liczby wybranych postów
  - Filtrowanie postów według statusu wyboru w panelu administratora
- Nowy endpoint API dla "Editor's pick" z kontrolą uwierzytelniania
- Nowe etykiety dla funkcjonalności "Editor's

### Changed

- Przeprojektowano filtry postów w panelu administratora
- Zaktualizowano komponent Menu, aby wyświetlał wybrane posty zamiast zakodowanych na stałe

## [0.9.4] - 2025-02-24

### Changed

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

## [0.9.3] - 2025-02-21

### Added

- Implementacja dedykowanej strony 404 dla nieistniejących kategorii
- Poprawa UX poprzez lepsze komunikaty o błędach

### Changed

- Przeprojektowanie interfejsu użytkownika:
  - Aktualizacja głównego motywu i tła aplikacji
  - Optymalizacja obrazów dla podstron
  - Modernizacja palety kolorów w nawigacji i nagłówkach
- Naprawa responsywności:
  - Poprawienie działania menu hamburgerowego na urządzeniach mobilnych
  - Dostosowanie układu do różnych rozmiarów ekranów

## [0.9.2] - 2025-01-24 - Admin Tabs

### Added

- System zakładek w panelu admina (AdminTabs)
  - Generyczny komponent dla zakładek
  - Dwie zakładki: "Posty" i "Użytkownicy"

### Changed

- Reorganizacja interfejsu panelu admina z wykorzystaniem systemu zakładek
- Przeniesienie listy postów do dedykowanej zakładki

## [0.9.1] - 2025-01-17 - Admin Posts List

### Added

- Lista postów w panelu admina (PostsList)
- Możliwość przeglądania i zarządzania postami
- Opcja ukrycia postów

## [0.9.0] - 2025-01-16 - Admin Panel

### Added

- Panel administratora z podstawowymi funkcjonalnościami
- Zabezpieczenia dostępu do panelu admina (role-based access control)
- Testy API i server actions w panelu admina

//======================
