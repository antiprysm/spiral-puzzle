# Hambungle Domain + Deployment Checklist

## 1) Keep existing Render static site service
- Reuse the current Render static site tied to this repo.
- Keep the existing build/publish configuration unchanged except for custom domains.

## 2) Add hambungle.com custom domain in Render
1. Open Render dashboard → Static Site → **Settings** → **Custom Domains**.
2. Add `hambungle.com`.
3. Add `www.hambungle.com` (optional but recommended).
4. Wait for Render to provision managed TLS certificates (automatic SSL).

## 3) Update SiteGround DNS
Point `hambungle.com` to Render using one of the following:
- **A record** at root (`@`) to the Render static site IP shown in Render.
- or **CNAME** (if using subdomain such as `www`) to the Render static site hostname.

Suggested setup:
- `@` → `A` → `<render-ip>`
- `www` → `CNAME` → `<your-render-static-site>.onrender.com`

## 4) Add 301 redirect from spiralpuzzle.com
In Render custom domains, configure `spiralpuzzle.com` as a **redirect domain** to:
- `https://hambungle.com/apps/spiral-puzzle`
- Redirect type: **301 permanent**.

If Render UI does not allow domain-scoped redirect for your plan, use SiteGround DNS + forwarding rules or your registrar's URL forwarding for `spiralpuzzle.com`.

## 5) Update store listings
Use these policy URLs in listings:
- Spiral Word Puzzle privacy policy: `https://hambungle.com/privacy/spiral-puzzle/`
- CatchLedger privacy policy: `https://hambungle.com/privacy/catchledger/`

Also set app/marketing URLs:
- Spiral Word Puzzle app page: `https://hambungle.com/apps/spiral-puzzle/`
- CatchLedger app page: `https://hambungle.com/apps/catchledger/`

## 6) API/leaderboard safety
This change only updates static site pages and documentation. Existing API/leaderboard endpoints remain untouched.
