# Inkanto AI Landing Page

Projekt strony typu Landing Page dla agenta AI "Inkanto", zintegrowany z Google OAuth i czatem Base44.

## Funkcje
- **Autoryzacja Google:** Dostęp do czatu jest chroniony logowaniem przez Google.
- **Personalizacja:** Strona główna wita zalogowanego użytkownika po imieniu.
- **Integracja Base44:** Czat jest osadzony jako iframe, dostępny tylko dla zalogowanych.
- **SPA Routing:** Obsługa tras (`/` oraz `/chat`) z przekierowaniem nieautoryzowanych użytkowników.

## Konfiguracja (Wymagane)

Aby aplikacja działała poprawnie po wdrożeniu, należy skonfigurować zmienne środowiskowe w panelu Vercel (lub lokalnie w pliku `.env`):

1. **VITE_GOOGLE_CLIENT_ID**: Twój identyfikator klienta z [Google Cloud Console](https://console.cloud.google.com/).
   - Pamiętaj, aby w Google Cloud Console dodać `https://ojjja.de` (lub Twoją domenę) do "Authorized JavaScript origins" oraz "Authorized redirect URIs".

## Jak uzyskać "Auto-Login" (Single Sign-On)?

Aby użytkownik nie musiał logować się dwa razy (raz na Twojej stronie i drugi raz wewnątrz czatu), musisz skonfigurować SSO w panelu Base44:

1. Zaloguj się do swojego panelu sterowania na [Base44](https://app.base44.com/).
2. Przejdź do ustawień swojego agenta (Superagent).
3. Znajdź sekcję **Authentication** lub **SSO**.
4. Włącz obsługę Google OAuth i wprowadź ten sam **Client ID** oraz **Client Secret**, których używasz w tej aplikacji.
5. Dzięki temu, gdy użytkownik jest zalogowany w Twojej aplikacji, Base44 automatycznie rozpozna sesję Google i pozwoli na rozmowę bez dodatkowego klikania.

## Rozwój lokalny

```bash
npm install
npm run dev
```

## Notatka o płatnościach (Top Up)
Ta aplikacja służy jako "opakowanie" i system kontroli dostępu. Same kredyty na rozmowę z agentem (tzw. Top Up) są zarządzane bezpośrednio przez platformę Base44 i zależą od Twojego planu u dostawcy agenta AI.
