# LEAFer Studio

Öffentliche Shopify-App für Substratberatung sowie Produktcontent- und Bildprüfung.

## Architektur

- React Router 7 mit Shopify App Bridge und Polaris Web Components
- Shopify Managed Installation und Token Exchange
- GraphQL Admin API `2026-07` mit minimalem Scope `write_products`
- PostgreSQL/Prisma für mandantenspezifische Konfigurator-Regeln
- Theme App Extension statt direkter Theme-Manipulation
- Signierter App Proxy unter `/apps/leafer-configurator`
- verpflichtende Datenschutz-Webhooks für öffentliche Apps

## Lokale Entwicklung

Voraussetzungen: eine Shopify Partner-App, ein Development Store, Node gemäß `package.json`, Shopify CLI und PostgreSQL.

```bash
cp .env.example .env
npm install
npm run setup
npm run dev
```

Keine Schlüssel oder Tokens committen. `client_id` wird durch `shopify app config link` gesetzt.

## Content-CSV

Der Import erwartet Shopify-Spalten `Title`, `URL handle`, `Description`, `SEO title` und `SEO description`. Nur Hauptzeilen mit Titel werden aktualisiert. Variantenzeilen bleiben absichtlich unverändert. Jeder Datensatz wird per Handle aufgelöst; Shopify `userErrors` werden sichtbar zurückgegeben.

## Deployment auf app.leaferservice.com

1. PostgreSQL bereitstellen und `DATABASE_URL` setzen.
2. DNS für `app.leaferservice.com` auf den gewählten Node-Host richten.
3. Shopify-Konfiguration verknüpfen: `npm run config:link`.
4. `npm run typecheck`, `npm run build` und `npm run setup` ausführen.
5. App-Version mit `npm run deploy` bereitstellen.
6. Erst nach einem Test im Development Store veröffentlichen und zur App-Store-Prüfung einreichen.

Deployment und App-Store-Einreichung sind bewusst nicht automatisiert.
