<<<<<<< HEAD
# 📱 Instrukcja Wdrożenia Ekosystemu z Poziomu Smartfona (Vercel & ChatGPT & Gemini Pro)

> **Ten dokument przeprowadzi Cię krok po kroku przez bezdotykowe wdrożenie całego ekosystemu INCANTO (IrisVault + ASI Bridge + ClusterLaunch + AI Chat) przy użyciu wyłącznie telefonu komórkowego.**
=======
# 📱 Instrukcja Wdrożenia Ekosystemu `incanto-vibe-coder` z Poziomu Smartfona (Vercel & ChatGPT & Gemini Pro)

> **Ten dokument przeprowadzi Cię krok po kroku przez bezdotykowe wdrożenie całego ekosystemu INCANTO oraz Vibe Coder (`incanto-vibe-coder`) powiązanego z repozytorium GitHub `Paparara1/Incanto` przy użyciu wyłącznie telefonu komórkowego.**
>>>>>>> feat/incanto-mobile-ai-pwa-transformers-biometrics-13908196613832524937

---

## 🚀 Opcja 1: Wdrożenie 1-Kliknięciem z Poziomu Vercel (Mobile Browser)

1. Otwórz przeglądarkę na telefonie (Chrome, Safari, Brave) i zaloguj się na swoje konto na [vercel.com](https://vercel.com).
2. Kliknij przycisk **"Add New..."** -> **"Project"**.
<<<<<<< HEAD
3. Wybierz swoje repozytorium GitHub: `incanto` / `incantocore`.
4. Vercel automatycznie wykryje plik `vercel.json` znajdujący się w korzeniu repozytorium.
5. *(Opcjonalnie)* W sekcji **Environment Variables** możesz dodać klucze API:
   - `OPENAI_API_KEY` — Twój klucz API dla ChatGPT (gpt-4o-mini).
   - `GEMINI_API_KEY` — Twój klucz API dla Google Gemini Pro.
   *(Jeśli nie dodasz kluczy, ekosystem automatycznie użyje wbudowanego silnika offline ASI Bridge!)*
6. Kliknij **"Deploy"**.
7. Po ~30 sekundach otrzymasz produkcyjny adres URL (np. `https://incanto-master-ecosystem.vercel.app`).
=======
3. Wybierz swoje repozytorium GitHub: **`Paparara1/Incanto`**.
4. Podaj nazwę projektu: **`incanto-vibe-coder`**.
5. Vercel automatycznie wykryje plik `vercel.json` znajdujący się w korzeniu repozytorium `Paparara1/Incanto`.
6. *(Opcjonalnie)* W sekcji **Environment Variables** możesz dodać klucze API:
   - `OPENAI_API_KEY` — Twój klucz API dla ChatGPT (gpt-4o-mini).
   - `GEMINI_API_KEY` — Twój klucz API dla Google Gemini Pro.
   *(Jeśli nie dodasz kluczy, ekosystem automatycznie użyje wbudowanego silnika offline ASI Bridge i lokalnych szablonów!)*
7. Kliknij **"Deploy"**.
8. Po ~30 sekundach otrzymasz produkcyjny adres URL (np. `https://incanto-vibe-coder.vercel.app`).
>>>>>>> feat/incanto-mobile-ai-pwa-transformers-biometrics-13908196613832524937

---

## 🤖 Opcja 2: Wdrożenie przez ChatGPT z Wtyczką / Integracją Vercel

Jeśli używasz aplikacji ChatGPT z podpiętą integracją Vercel:
1. Wpisz w czacie ChatGPT na telefonie:
<<<<<<< HEAD
   > *"Wdróż najnowszą wersję mojego repozytorium GitHub na Vercel z pliku vercel.json."*
2. Integracja Vercel automatycznie pobierze pliki z repozytorium i utworzy nową wersję produkcyjną.
=======
   > *"Wdróż najnowszą wersję mojego repozytorium GitHub Paparara1/Incanto jako projekt incanto-vibe-coder na Vercel z pliku vercel.json."*
2. Integracja Vercel automatycznie pobierze pliki z repozytorium `Paparara1/Incanto` i utworzy nową wersję produkcyjną.
>>>>>>> feat/incanto-mobile-ai-pwa-transformers-biometrics-13908196613832524937
3. ChatGPT zwróci Ci aktywny link produkcyjny.

---

<<<<<<< HEAD
## 👁️ Co zawiera Twój aktywny link produkcyjny?

Po otwarciu wygenerowanego linku na telefonie:
* **`https://twoja-domena.vercel.app/`** — Główny Master Ekosystem łączący skaner biometryczny IrisVault, kompilator intencji ASI Bridge oraz czat AI z Gemini Pro.
* **`https://twoja-domena.vercel.app/api/auth`** — Serverless API weryfikacji biometrycznej i generowania tokenów ZK-Iris.
* **`https://twoja-domena.vercel.app/api/intent`** — Serverless API kompilacji intencji (Intent-to-Action) na czysty kod / Docker / Terraform.
* **`https://twoja-domena.vercel.app/api/chat`** — Serverless API łączące się z Gemini Pro oraz ChatGPT.
* **`https://twoja-domena.vercel.app/irisvault/`** — Dedykowana aplikacja portfela biometrycznego z animowanym skanerem oka.
* **`https://twoja-domena.vercel.app/kobalt/`** — Offline generator kodu AI (Kobalt AI Builder).
=======
## 👁️ Co zawiera Twój aktywny link produkcyjny `incanto-vibe-coder`?

Po otwarciu wygenerowanego linku na telefonie:
* **`https://incanto-vibe-coder.vercel.app/`** — Główny Master Ekosystem łączący skaner biometryczny IrisVault, kompilator intencji ASI Bridge oraz czat AI z Gemini Pro.
* **`https://incanto-vibe-coder.vercel.app/vibe-coder/`** lub **`/vibe/`** — Dedykowany moduł **GitHub Vibe Coding AI Suite** do generowania kodu i automatycznych commitów do GitHub.
* **`https://incanto-vibe-coder.vercel.app/api/auth`** — Serverless API weryfikacji biometrycznej i generowania tokenów ZK-Iris.
* **`https://incanto-vibe-coder.vercel.app/api/intent`** — Serverless API kompilacji intencji (Intent-to-Action) na czysty kod / Docker / Terraform.
* **`https://incanto-vibe-coder.vercel.app/api/chat`** — Serverless API łączące się z Gemini Pro oraz ChatGPT.
* **`https://incanto-vibe-coder.vercel.app/irisvault/`** — Dedykowana aplikacja portfela biometrycznego z animowanym skanerem oka.
* **`https://incanto-vibe-coder.vercel.app/kobalt/`** — Offline generator kodu AI (Kobalt AI Builder).
>>>>>>> feat/incanto-mobile-ai-pwa-transformers-biometrics-13908196613832524937

---

## 🛡️ Bezpieczeństwo i Zero Vendor Lock-in
Wszystkie punkty końcowe i komponenty zostały zbudowane tak, aby działały bez wymogu lokalnego serwera czy terminala CLI. Całość jest w 100% Twoją własnością intelektualną.
