# SIT v2.0 - Self-Hosting Guide

[![Wspieraj projekt / Support Project](https://img.shields.io/badge/💖%20Wspieraj%20mnie%20%2F%20Donate-Donatr-ff69b4?style=for-the-badge&logo=heart)](https://donatr.ee/ojjja?utm_source=copy&utm_medium=share)

> **💖 Wspieraj rozwój projektu / Support Development:** [Wspieraj twórcę na Donatr / Donate via Donatr](https://donatr.ee/ojjja?utm_source=copy&utm_medium=share)

## Wymagania
- Node.js 18+ lub Bun
- Supabase CLI
- Konto Supabase

## Instalacja
npm install

## Konfiguracja
1. Utworz projekt Supabase
2. Ustaw zmienne VITE_SUPABASE_URL i VITE_SUPABASE_PUBLISHABLE_KEY w .env
3. npx supabase link --project-ref <ref>
4. npx supabase db push
5. npx supabase functions deploy --all

## Sekrety Edge Functions
- LOVABLE_API_KEY (agent-chat)
- REPLICATE_API_TOKEN (generate-voice)
- N8N_MCP_URL, N8N_MCP_TOKEN (n8n-mcp-proxy)

## Uruchomienie
npm run dev
