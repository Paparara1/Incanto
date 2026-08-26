# 📱 Instrukcja Wdrożenia Ekosystemu `incanto-vibe-coder` z Poziomu Smartfona (Vercel & ChatGPT & Gemini Pro)

> **Ten dokument przeprowadzi Cię krok po kroku przez bezdotykowe wdrożenie całego ekosystemu INCANTO oraz Vibe Coder (`incanto-vibe-coder`) powiązanego z repozytorium GitHub `Paparara1/Incanto` przy użyciu wyłącznie telefonu komórkowego.**

---

## 🚀 Opcja 1: Wdrożenie 1-Kliknięciem z Poziomu Vercel (Mobile Browser)

1. Otwórz przeglądarkę na telefonie (Chrome, Safari, Brave) i zaloguj się na swoje konto na [vercel.com](https://vercel.com).
2. Kliknij przycisk **"Add New..."** -> **"Project"**.
3. Wybierz swoje repozytorium GitHub: **`Paparara1/Incanto`**.
4. Podaj nazwę projektu: **`incanto-vibe-coder`**.
5. Vercel automatycznie wykryje plik `vercel.json` znajdujący się w korzeniu repozytorium `Paparara1/Incanto`.
6. *(Opcjonalnie)* W sekcji **Environment Variables** możesz dodać klucze API:
   - `OPENAI_API_KEY` — Twój klucz API dla ChatGPT (gpt-4o-mini).
   - `GEMINI_API_KEY` — Twój klucz API dla Google Gemini Pro.
   *(Jeśli nie dodasz kluczy, ekosystem automatycznie użyje wbudowanego silnika offline ASI Bridge i lokalnych szablonów!)*
7. Kliknij **"Deploy"**.
8. Po ~30 sekundach otrzymasz produkcyjny adres URL (np. `https://incanto-vibe-coder.vercel.app`).

---

## 🤖 Opcja 2: Wdrożenie przez ChatGPT z Wtyczką / Integracją Vercel

Jeśli używasz aplikacji ChatGPT z podpiętą integracją Vercel:
1. Wpisz w czacie ChatGPT na telefonie:
   > *"Wdróż najnowszą wersję mojego repozytorium GitHub Paparara1/Incanto jako projekt incanto-vibe-coder na Vercel z pliku vercel.json."*
2. Integracja Vercel automatycznie pobierze pliki z repozytorium `Paparara1/Incanto` i utworzy nową wersję produkcyjną.
3. ChatGPT zwróci Ci aktywny link produkcyjny.

---

## 👁️ Co zawiera Twój aktywny link produkcyjny `incanto-vibe-coder`?

Po otwarciu wygenerowanego linku na telefonie:
* **`https://incanto-vibe-coder.vercel.app/`** — Główny Master Ekosystem łączący skaner biometryczny IrisVault, kompilator intencji ASI Bridge oraz czat AI z Gemini Pro.
* **`https://incanto-vibe-coder.vercel.app/vibe-coder/`** lub **`/vibe/`** — Dedykowany moduł **GitHub Vibe Coding AI Suite** do generowania kodu i automatycznych commitów do GitHub.
* **`https://incanto-vibe-coder.vercel.app/api/auth`** — Serverless API weryfikacji biometrycznej i generowania tokenów ZK-Iris.
* **`https://incanto-vibe-coder.vercel.app/api/intent`** — Serverless API kompilacji intencji (Intent-to-Action) na czysty kod / Docker / Terraform.
* **`https://incanto-vibe-coder.vercel.app/api/chat`** — Serverless API łączące się z Gemini Pro oraz ChatGPT.
* **`https://incanto-vibe-coder.vercel.app/irisvault/`** — Dedykowana aplikacja portfela biometrycznego z animowanym skanerem oka.
* **`https://incanto-vibe-coder.vercel.app/kobalt/`** — Offline generator kodu AI (Kobalt AI Builder).

---

## 🛡️ Bezpieczeństwo i Zero Vendor Lock-in
Wszystkie punkty końcowe i komponenty zostały zbudowane tak, aby działały bez wymogu lokalnego serwera czy terminala CLI. Całość jest w 100% Twoją własnością intelektualną.
