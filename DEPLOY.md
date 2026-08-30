# Deploying TayMade to your VPS (Docker, Ubuntu)

This brings the whole thing up — the website **and** its Postgres database — with one
command. No domain needed to start; you'll reach it at `http://YOUR_VPS_IP`.

> You run these on the **VPS** (via SSH). I can't SSH in for you, but paste me any
> error and I'll sort it.

---

## 1. Connect to the VPS
From your Windows machine (PowerShell or Terminal):
```bash
ssh your-user@YOUR_VPS_IP
```

## 2. Install Docker (once)
```bash
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```
Then **log out and back in** (`exit`, then `ssh` again) so Docker works without `sudo`.
Check it:
```bash
docker --version && docker compose version
```

## 3. Get the code onto the VPS
**Option A — Git (recommended, makes updates easy).** Push the project to a GitHub
repo (I'll give you the exact commands — just ask), then on the VPS:
```bash
git clone YOUR_REPO_URL taymade
cd taymade/web
```

**Option B — Copy from your PC (no GitHub).** From your Windows machine, in the
project folder, copy just the `web` folder up (skip the big generated folders):
```bash
scp -r web your-user@YOUR_VPS_IP:~/taymade-web
```
Then on the VPS: `cd ~/taymade-web`
(If `scp` complains about size, delete `web\node_modules`, `web\.next` and `web\.pgdata`
on your PC first — they're rebuilt on the server.)

## 4. Create the secrets file
In the `web` folder on the VPS:
```bash
cp .env.docker.example .env
```
Generate a session secret and note it:
```bash
openssl rand -hex 32
```
Open `.env` (`nano .env`) and set:
- `DB_PASSWORD=` a strong password you invent
- `AUTH_SECRET=` the 64-char string from the command above
- `SITE_URL=http://YOUR_VPS_IP` (optional, fine to leave blank for now)

Save (in nano: `Ctrl+O`, `Enter`, `Ctrl+X`).

## 5. Launch 🚀
```bash
docker compose up -d --build
```
The first build takes ~3–5 minutes (it installs everything and builds the site).
It automatically runs the database migrations and seeds the catalogue on first start.

## 6. See it
Open **`http://YOUR_VPS_IP`** in your browser.
Admin login: **`http://YOUR_VPS_IP/admin/login`**
- `admin@taymade.co.uk` / `taymade-admin`  (change this soon!)

---

## Everyday commands (run in the `web` folder)
| Do this | Command |
|---|---|
| See logs | `docker compose logs -f web` |
| Restart | `docker compose restart web` |
| Stop everything | `docker compose down` |
| Update after new code | `git pull` (option A) then `docker compose up -d --build` |
| Back up the database | `docker compose exec db pg_dump -U taymade taymade > backup.sql` |

## Gotchas
- **Port 80 in use?** If the site won't load and logs mention port 80, another web
  server (nginx/apache) is running. Either stop it (`sudo systemctl stop nginx`) or, in
  `docker-compose.yml`, change `"80:3000"` to `"8080:3000"` and visit `http://YOUR_VPS_IP:8080`.
- **Firewall.** Make sure port 80 is open: `sudo ufw allow 80/tcp` (if you use ufw), and
  open port 80 in your VPS provider's firewall/security-group panel too.
- **Low RAM.** The build needs ~2 GB. On a 1 GB VPS, add swap first, or ask me and I'll
  give you a lighter build path.
- **HTTPS + domain (later).** Once you point a domain at the VPS, tell me and I'll add
  automatic HTTPS (Caddy) — about a 5-minute change.
