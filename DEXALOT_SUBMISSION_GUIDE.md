# Instrukcja przesyłania raportu Bug Bounty dla Dexalot (HackenProof)

Jeśli znalazłeś krytyczną podatność w ekosystemie Dexalot, postępuj zgodnie z poniższą instrukcją, aby zapewnić poprawność zgłoszenia i zmaksymalizować szansę na nagrodę.

## 1. Wybierz odpowiedni program
Dexalot prowadzi obecnie dwa główne programy na platformie HackenProof:

*   **Dexalot Smart Contracts**: [https://hackenproof.com/programs/dexalot-smart-contracts-2](https://hackenproof.com/programs/dexalot-smart-contracts-2)
    *   **Nagroda za Critical**: do **$100,000**.
    *   Zakres: Inteligentne kontrakty (Solidity).
*   **Dexalot Web & Mobile**: [https://hackenproof.com/programs/dexalot-web-and-mobile](https://hackenproof.com/programs/dexalot-web-and-mobile)
    *   **Nagroda za Critical**: do **$10,000**.
    *   Zakres: Interfejs webowy (app.dexalot.com), API, aplikacje mobilne.

## 2. Definicja podatności "Critical"
Zgłoszenie zostanie uznane za krytyczne, jeśli wykazuje wysoki wpływ i wysokie prawdopodobieństwo eksploatacji. Przykłady:
*   Kradzież lub utrata środków użytkowników.
*   Trwałe zablokowanie funduszy.
*   Możliwość manipulacji arkuszem zleceń (Order Book) prowadząca do strat.
*   Zdalne wykonanie kodu (RCE) na infrastrukturze krytycznej.

## 3. Przygotuj raport (Szablon)
Raport powinien być napisany w języku angielskim. Poniżej znajduje się struktura, którą powinieneś wypełnić:

**Title:** [Krótki, konkretny opis problemu]
**Severity:** Critical
**Description:** [Szczegółowy opis techniczny podatności. Jak działa, gdzie się znajduje.]
**Impact:** [Opisz konsekwencje biznesowe i finansowe. Co może stracić Dexalot lub jego użytkownicy?]
**Steps to Reproduce:**
1. [Krok 1]
2. [Krok 2]
3. ...
**Proof of Concept (PoC):** [Link do skryptu, kod exploita lub wideo demonstrujące błąd. W przypadku kontraktów najlepiej dostarczyć test w Foundry lub Hardhat.]
**Recommended Mitigation:** [Jak naprawić ten błąd?]

## 4. Ważne uwagi
*   **Opłata PoC**: Niektóre programy na HackenProof wymagają opłaty w wysokości **$5** przy przesyłaniu raportu z PoC (ma to na celu ograniczenie spamu).
*   **Poufność**: Nie publikuj informacji o błędzie publicznie przed jego naprawieniem i uzyskaniem zgody od zespołu Dexalot (zasada Responsible Disclosure).
*   **KYC**: Aby wypłacić nagrodę, HackenProof może wymagać przejścia procedury weryfikacji tożsamości.

---
**Potrzebujesz pomocy?**
Mogę pomóc Ci w:
1. Przetłumaczeniu Twoich ustaleń na techniczny język angielski.
2. Sformatowaniu i dopracowaniu kodu Proof of Concept (PoC).
3. Sprawdzeniu, czy raport spełnia wszystkie wymogi formalne programu.
