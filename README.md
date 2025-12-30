# 🚀 NestJS + Prisma + Supabase (Boilerplate Pro)

Ce projet est un Starter Kit (Boilerplate) moderne et robuste pour le développement d'APIs REST performantes. Il combine la puissance de **NestJS**, la flexibilité de **Prisma ORM** et la scalabilité de **Supabase**.

---

## 🛠️ Stack Technique

*   **Framework :** [NestJS](https://nestjs.com/) (Architecture modulaire, TypeScript)
*   **ORM :** [Prisma](https://www.prisma.io/) (Gestion de schéma, migrations, typage automatique)
*   **Base de Données :** [Supabase](https://supabase.com/) (PostgreSQL managé)
*   **Authentification :** 
    *   [Passport.js](https://www.passportjs.org/) & [JWT](https://jwt.io/)
    *   Hashage des mots de passe avec **Bcrypt**
*   **Documentation :** [Swagger](https://swagger.io/) (Disponible sur `/api`)
*   **Validation :** `class-validator` & `class-transformer`

---

## ✨ Fonctionnalités Clés

*   **Système d'Authentification Complet :** Inscription, Connexion et récupération du profil sécurisée.
*   **CRUD complets :** Modules pour la gestion des **Équipes**, des **Joueurs** et des **Positions**.
*   **Connexion Optimisée :** Configuration spéciale pour Supabase utilisant le **Connection Pooler** (port 6543) avec `pgbouncer`, garantissant une stabilité maximale en production.
*   **Validation Globale :** Protection automatique des entrées API grâce aux Pipes de validation.
*   **Documentation Interactive :** Swagger UI intégré pour tester les routes en un clic.

---

## ⚙️ Installation et Configuration

### 1. Cloner le projet et installer les dépendances
```bash
npm install
```

### 2. Configurer les variables d'environnement
Créez un fichier `.env` à la racine et configurez votre URL Supabase :
```env
# Port 6543 pour le pooling (recommandé pour l'app)
DATABASE_URL="postgresql://postgres.[ID_PROJET]:[PASSWORD]@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Clé secrète pour les tokens JWT
JWT_SECRET="votre_cle_secrete_ultra_securisee"
```

### 3. Initialiser Prisma
Générez le client Prisma pour synchroniser les types :
```bash
npx prisma generate
```

### 4. Lancer l'application
```bash
# Mode développement
npm run start:dev
```

L'API sera accessible sur : `http://localhost:3001`
La documentation Swagger sur : `http://localhost:3001/api`

---

## 📂 Organisation du Projet

*   `src/auth` : Logique d'authentification (JWT, Strategies, DTOs).
*   `src/equipes`, `src/joueurs`, `src/positions` : Modules métier (CRUD).
*   `src/prisma.service.ts` : Service de connexion centralisé utilisant l'adaptateur `pg.Pool` pour une compatibilité parfaite avec Supabase.
*   `prisma/schema.prisma` : Définition des modèles de données.

---

## 💡 Notes sur la Base de Données (Supabase)

Ce boilerplate est configuré pour utiliser le **Pooler de Supabase**. 
- **Application :** Utilisez le port `6543` avec `?pgbouncer=true`.
- **Migrations :** Pour `prisma migrate dev`, il est recommandé d'utiliser une connexion directe (port `5432`) sans pgbouncer pour éviter les erreurs de transaction.

---

## 📜 Licence
Projet libre d'utilisation. Développé pour être une base solide pour tout nouveau projet NestJS.
