# Ghid de Lansare în Producție: Butcher's Cut

Acest ghid descrie configurarea aplicației pentru producție pe conturile clientului (frizerului), asigurând că acesta deține proprietatea asupra datelor și serviciilor, în timp ce dezvoltatorul păstrează accesul tehnic pentru mentenanță și actualizări.

---

## 1. Modelul de Colaborare: Clientul Deține, Dezvoltatorul Menține

Pentru a evita complicațiile legale și de facturare, se folosește modelul standard din industrie:
* **Clientul deține:** Contul Supabase (datele clienților și programările), domeniul web și contul Vercel.
* **Dezvoltatorul menține:** Accesul la cod prin GitHub și rol de colaborator tehnic în Supabase și Vercel.

### Avantajul integrării GitHub + Vercel
Odată configurată legătura inițială, **mentenanța zilnică nu necesită acces în conturile clientului**:
1. Tu modifici codul pe calculatorul tău.
2. Rulezi `git push origin main`.
3. Vercel detectează automat modificarea, compilează aplicația și o publică live pe domeniul clientului în aproximativ 30 de secunde.

---

## 2. Pasul 1: Configurarea Bazei de Date (Supabase)

Clientul își creează un cont gratuit pe [supabase.com](https://supabase.com).

### 2.1. Crearea Proiectului
1. Click pe **New Project**.
2. **Name:** `Butchers Cut`
3. **Database Password:** Se alege o parolă puternică (salvată într-un manager de parole).
4. **Region:** `Central EU (Frankfurt)` — esențial pentru latență minimă (~30-40ms față de România).
5. Click pe **Create new project**.

### 2.2. Popularea Bazei de Date (Schema SQL)
1. În meniul din stânga, deschide **SQL Editor**.
2. Click pe **New query**.
3. Copiază întregul conținut al fișierului `supabase_schema.sql` din proiect.
4. Lipește-l în editor și apasă pe butonul **Run** (dreapta-jos).
5. Mesajul `Success. No rows returned` confirmă crearea tabelelor (`services`, `working_hours`, `appointments`), a politicilor de securitate și a datelor inițiale.

### 2.3. Copierea Cheilor de Conectare
1. Mergi la **Project Settings** (iconița cu rotiță din stânga jos) -> **API**.
2. Copiază următoarele două valori:
   * **Project URL** (ex: `https://xyzcompany.supabase.co`)
   * **Project API keys -> `anon` / `public`** (cheia lungă care începe cu `eyJh...`)

### 2.4. Oferirea Accesului Dezvoltatorului
1. În Supabase, mergi la **Project Settings** -> **Members** -> **Invite**.
2. Clientul introduce adresa ta de email și îți acordă rolul de **Developer** sau **Admin**.

---

## 3. Pasul 2: Găzduirea și Publicarea (Vercel)

Clientul își creează un cont pe [vercel.com](https://vercel.com) (se poate autentifica direct cu email sau GitHub).

### 3.1. Importul Proiectului
1. În panoul Vercel, click pe **Add New...** -> **Project**.
2. Selectează repository-ul GitHub `AldeaAlex/ButchersCut`.
   *(Dacă repository-ul este pe contul tău de GitHub, poți conecta direct contul tău, sau poți transfera repository-ul către contul de GitHub al clientului și să rămâi colaborator).*
3. **Framework Preset:** Vite (este detectat automat).
4. **Root Directory:** `./`

### 3.2. Setarea Variabilelor de Mediu
Înainte de a apăsa Deploy, deschide secțiunea **Environment Variables** și adaugă cele două chei obținute la Pasul 2.3:
* `VITE_SUPABASE_URL` = `https://xyzcompany.supabase.co`
* `VITE_SUPABASE_ANON_KEY` = `cheia-ta-anon-publica`

5. Click pe **Deploy**.
6. În 1-2 minute, aplicația este live pe un domeniu temporar de tip `butchers-cut.vercel.app`.

---

## 4. Pasul 3: Conectarea Domeniului Propriu (ex: butcherscut.ro)

Dacă frizerul deține un domeniu (cumpărat de la RoTLD, Hostico, Cloudflare etc.):

1. În proiectul din Vercel, mergi la **Settings** -> **Domains**.
2. Introdu domeniul dorit (ex: `butcherscut.ro` sau `programari.butcherscut.ro`) și apasă **Add**.
3. Vercel va genera instrucțiunile DNS exacte:
   * **Pentru domeniu rădăcină (`butcherscut.ro`):**
     * Tip: `A Record`
     * Nume / Host: `@`
     * Valoare: `76.76.21.21`
   * **Pentru subdomeniu (`www.butcherscut.ro`):**
     * Tip: `CNAME`
     * Nume / Host: `www`
     * Valoare: `cname.vercel-dns.com`
4. Clientul (sau dezvoltatorul, dacă primește acces) introduce aceste înregistrări în panoul registrar-ului DNS.
5. Vercel generează automat un certificat de securitate SSL gratuit (HTTPS) în 5-15 minute.

---

## 5. Pasul 4: Verificarea Funcționalităților în Producție

După publicare, testează următoarele puncte cheie:

1. **PWA (Instalare pe Mobil):**
   * Deschide site-ul pe iPhone în Safari: verifică dacă apare bannerul și ghidul de adăugare pe ecranul principal.
   * Deschide site-ul pe Android în Chrome: verifică butonul de instalare nativă.
2. **Fluxul de Programare în 3 Pași:**
   * Fă o programare de test pe telefon: selectează serviciul -> alege ora -> introdu numele -> confirmă.
   * Verifică dacă programarea apare în panoul Supabase în tabelul `appointments`.
   * Apasă butonul „Adaugă în Calendar” și verifică dacă se deschide corect Apple Calendar / Google Calendar.
3. **Panoul de Administrare:**
   * Accesează `/admin`.
   * Introdu parola prestabilită (`butcher2026`).
   * Testează schimbarea parolei din tab-ul **Securitate & Parolă**.
   * Testează modificarea unui preț și verifică dacă modificarea se vede pe prima pagină.

---

## 6. Pasul 5: Mentenanță și Actualizări Viitoare

Când frizerul solicită modificări (schimbare de texte, servicii noi, ajustări de design):

1. Faci modificările în cod local.
2. Testezi build-ul: `npm run build`.
3. Trimiți modificarea:
   ```bash
   git add .
   git commit -m "actualizare tarife si texte"
   git push origin main
   ```
4. Vercel detectează automat noul commit și publică versiunea actualizată fără ca frizerul să facă vreo acțiune.

---

## 7. Costuri Recurente Estimate

Toate uneltele alese au planuri gratuite generoase, ideale pentru un salon de frizerie:
* **Vercel Hobby Plan:** Gratuit (lățime de bandă 100 GB/lună, mai mult decât suficient).
* **Supabase Free Tier:** Gratuit (până la 500 MB spațiu de stocare și 50.000 de utilizatori activi lunar — suficient pentru zeci de mii de programări).
* **Domeniu web (.ro):** ~10-12 EUR / an (plătit de client).
