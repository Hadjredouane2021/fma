# FMA - Fédération Marocaine de l'Assurance

Plateforme web institutionnelle — Next.js 15 + MySQL + Prisma + Tailwind CSS

## Stack technique

- **Framework** : Next.js 15 (App Router, Server Components)
- **Langage** : TypeScript strict
- **Base de données** : MySQL 8 + Prisma ORM
- **Styles** : Tailwind CSS v4
- **Auth** : NextAuth v5 (JWT sessions)
- **i18n** : next-intl — FR / EN / AR avec support RTL
- **Icons** : Lucide React | **Animations** : Framer Motion

---

## Prérequis

- Node.js >= 18 | MySQL >= 8 | npm >= 9

---

## Installation locale

### 1. Configurer l'environnement

```bash
cd fma
cp .env.example .env
# Éditer .env avec vos identifiants MySQL et SMTP
```

### 2. Créer la base de données MySQL

```sql
CREATE DATABASE fma_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'fma_user'@'localhost' IDENTIFIED BY 'VotreMotDePasse';
GRANT ALL PRIVILEGES ON fma_db.* TO 'fma_user'@'localhost';
FLUSH PRIVILEGES;
```

Mettre à jour `.env` :
```
DATABASE_URL="mysql://fma_user:VotreMotDePasse@localhost:3306/fma_db"
```

### 3. Installer et initialiser

```bash
npm install
npm install -D ts-node
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Lancer le serveur

```bash
npm run dev
```

| URL | Description |
|-----|-------------|
| http://localhost:3000/fr | Site français |
| http://localhost:3000/en | Site anglais |
| http://localhost:3000/ar | Site arabe (RTL) |
| http://localhost:3000/admin/login | Administration |

**Accès admin :** `admin@fma.org.ma` / `Admin@FMA2026!`

---

## Structure du projet

```
fma/
├── prisma/
│   ├── schema.prisma       # 15 tables
│   └── seed.ts             # Données FMA réelles
├── src/
│   ├── app/
│   │   ├── [locale]/       # Pages publiques FR/EN/AR
│   │   │   ├── page.tsx                   # Accueil
│   │   │   ├── la-fma/                    # La FMA
│   │   │   ├── actualites/                # Liste + détail article
│   │   │   ├── publications/              # Publications PDF
│   │   │   ├── decouvrir-le-secteur/      # Conventions, formations, vocabulaire, liens
│   │   │   ├── particuliers/              # 7 assurances individuelles
│   │   │   ├── entreprises/               # Produits pro + FAQ
│   │   │   ├── contact/                   # Formulaire + carte
│   │   │   └── recherche/                 # Recherche globale
│   │   ├── admin/                         # Backoffice /admin
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── actualites/                # CRUD posts FR/EN/AR
│   │   │   ├── publications/
│   │   │   ├── membres/
│   │   │   ├── formations/
│   │   │   ├── contact/                   # Messages non lus
│   │   │   └── newsletter/                # Abonnés + export
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   ├── contact/                   # Anti-spam + rate limit
│   │   │   ├── newsletter/                # Double opt-in
│   │   │   ├── search/
│   │   │   └── admin/                     # CRUD protégés par session
│   │   ├── sitemap.ts                     # Sitemap dynamique multilingue
│   │   └── robots.ts
│   ├── components/
│   │   ├── layout/     # Header (mega menu sticky), Footer
│   │   ├── common/     # NewsCard, PublicationCard, KeyFigures, Newsletter
│   │   ├── ui/         # Button, Card, Badge
│   │   └── admin/      # AdminSidebar
│   ├── i18n/
│   │   ├── messages/   # fr.json, en.json, ar.json
│   │   ├── routing.ts  # URLs localisées
│   │   └── request.ts
│   ├── lib/
│   │   ├── prisma.ts   # Singleton client
│   │   ├── auth.ts     # NextAuth config
│   │   ├── mailer.ts   # SMTP nodemailer
│   │   └── utils.ts    # cn, slug, dates, RTL
│   ├── middleware.ts   # Protection admin + i18n routing
│   └── types/index.ts  # Types globaux
├── .env
├── .env.example
├── next.config.ts      # next-intl plugin
├── tailwind.config.ts  # Couleurs FMA (bleu, or, cyan)
└── package.json
```

---

## Tables Prisma (MySQL)

| Table | Description |
|-------|-------------|
| `users` | Admins avec rôles ADMIN/EDITOR/VIEWER |
| `posts` | Actualités multilingues + SEO + catégorie |
| `categories` | Catégories actualités |
| `publications` | PDFs (chiffres-clés, faits marquants, courrier) |
| `pages` | Pages CMS statiques |
| `media` | Médiathèque |
| `members` | Sociétés membres avec logos |
| `team_members` | Équipe FMA (direction, opérationnel, comité) |
| `formations` | Formations professionnelles |
| `useful_links` | Liens utiles |
| `glossary_terms` | Vocabulaire FR/EN/AR |
| `conventions` | Conventions professionnelles |
| `contact_messages` | Messages formulaire (statut lu/non-lu) |
| `newsletter_subscribers` | Abonnés avec double opt-in |
| `settings` | Configuration site |
| `translations` | Traductions dynamiques DB |

---

## Commandes

```bash
npm run dev           # Développement (http://localhost:3000)
npm run build         # Build production
npm run start         # Démarrer en production
npm run db:generate   # Générer client Prisma
npm run db:push       # Sync schéma → DB (sans migration)
npm run db:migrate    # Créer et appliquer migration
npm run db:seed       # Insérer données initiales FMA
npm run db:studio     # Interface visuelle Prisma Studio
```

---

## Déploiement OVH / VPS (Ubuntu 22.04)

### Installation serveur

```bash
# Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs mysql-server nginx certbot python3-certbot-nginx
npm install -g pm2

# Base de données
sudo mysql -e "CREATE DATABASE fma_prod CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Déploiement

```bash
git clone https://github.com/votre-repo/fma.git /var/www/fma
cd /var/www/fma
npm install
# Configurer .env pour production
npx prisma generate && npx prisma db push && npx prisma db seed
npm run build
pm2 start npm --name "fma" -- start
pm2 save && pm2 startup
```

### Nginx

```nginx
server {
    server_name fmsar.org.ma www.fmsar.org.ma;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    location /uploads {
        alias /var/www/fma/public/uploads;
        expires 30d;
    }
}
```

```bash
sudo certbot --nginx -d fmsar.org.ma -d www.fmsar.org.ma
```

---

## Variables d'environnement (production)

```bash
DATABASE_URL="mysql://fma_user:STRONG_PWD@localhost:3306/fma_prod"
NEXTAUTH_URL="https://fmsar.org.ma"
NEXTAUTH_SECRET="$(openssl rand -base64 64)"
NEXT_PUBLIC_APP_URL="https://fmsar.org.ma"
SMTP_HOST="smtp.votre-provider.ma"
SMTP_USER="contact@fma.org.ma"
SMTP_PASS="votre_mot_de_passe_smtp"
SMTP_FROM="FMA <contact@fma.org.ma>"
```
