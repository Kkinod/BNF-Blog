//======================
WAŻNE: /settings dostepne bez logowania.... (tym samym /server oraz /admin - wynikające z zakładek "/settings")

- użycie biblioteki do "sanitize" - DOMPurify, drobny problem, mianowicie większość bibliotek działa w środowisku, które musi mieć dostęp do obiektu window. DOMPurify działa po stronie klienta, gdyż nie polega na DOM, który jest dostępny tylko w przeglądarce. Dlatego też by nie zmieniać komponentu na komponent kliencki trzeba było poszukać biblioteki która wykonuje sanitację po stronie serwera, czyli taką która nie zależy od API przeglądarki.

Login and register

- add bcript library
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

TODO:

- zmienić errory/success podczas rejestracji/logowania/resetu tak, że jak np. podczas rejestracji wykryje, że takie konto istnieje, lub podczas logowania poda się błędne dane, albo spróbuje zresetować hasło to nie informować czy podane dane są dobre czy nie, tylko coś w stylu "jeśli podane dane są prawidło to na podany email został właśnie wysłany link z resetem hasła"
- WAŻNE: !!! dodać czas który musi upłynąć by móc ponownie wysłać emaila z resetem hasła oraz maila z potwierdzeniem przy rejestracji!! Reset hasła
- zablokować route'y które mają być nie widoczne dla zalogowanych, np. jeśli nie chcę by "http://localhost:3000/api/categories" (endpoint z którego API pobiera listę kategori) nie chcę by był publiczny to zablokować go dla niezalogowanych
- poprawić wyświetlanie daty w komentarzach!
- dodać w "catch" obsługę błędu UI
- captcha do logowania!
- zablokować logowanie na x czasu po np. 4x źle wpisanym haśle
- dodać tokeny CSRF – biblioteka „cursf” – a następnie dodać tokeny do inputów czyli np. podczas logowania oraz dodawania komentarzy

PROBLEMY!!

- wysyła maila z potwierdzeniem nawet jeśli hasło jest złe (a może to jest dobre rozwiązanie i po prostu wyświetlać inne informacje? a nie typu, że "Confirmation email sent!")
- upewnić się czy na produkcji nie ma tego problemu który jest na developie z potwierdzeniem tokena, czyli gdy potwierdzamy maila przez link to odświeża dwa razy i najpierw (czasem tylko mignie) pojawia się informacja, że email został potwierdzony, ale później pojawia się "Token does not exist"

//======================
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
