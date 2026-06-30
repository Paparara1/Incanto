# Inkanto AI — Twój darmowy asystent

Projekt darmowego agenta AI zintegrowanego z logowaniem Google.

## Dlaczego to jest darmowe?
Aplikacja wykorzystuje model **Google Gemini 1.5 Flash**, który oferuje bardzo hojny darmowy plan (Free Tier). Dzięki temu możesz rozmawiać z Inkanto bez opłat "Top Up", o ile używasz własnego klucza API.

## Funkcje
- **Logowanie Google:** Bezpieczny dostęp tylko dla Ciebie.
- **Natywny Czat:** Szybki i responsywny interfejs wbudowany bezpośrednio w stronę.
- **Brak opłat Base44:** Nie korzystamy już z zewnętrznych platform płatnych od wiadomości.

## Konfiguracja (Wymagane)

Aby Inkanto ożyło, musisz dodać dwa klucze w panelu sterowania Vercel (Environment Variables):

1. **VITE_GOOGLE_CLIENT_ID**: Uzyskasz go w [Google Cloud Console](https://console.cloud.google.com/).
2. **GEMINI_API_KEY**: Twój klucz do "mózgu" AI.
   - Wejdź na [Google AI Studio](https://aistudio.google.com/).
   - Kliknij "Get API key".
   - Skopiuj klucz i dodaj go do Vercel jako `GEMINI_API_KEY`.

## Rozwój lokalny

Jeśli chcesz uruchomić projekt u siebie:
1. Skopiuj `.env.example` do `.env`.
2. Wklej swoje klucze.
3. Uruchom:
```bash
npm install
npm run dev
```

## Jak to działa?
- **Frontend:** React + Vite.
- **Backend:** Vercel Serverless Functions (folder `/api`), który bezpiecznie łączy się z Google Gemini, chroniąc Twój klucz API przed światem.
