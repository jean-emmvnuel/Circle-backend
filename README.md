# Circle - Backend API ⭕

Circle est le backend d'un réseau social innovant dédié aux informaticiens. Cette plateforme permet la communication en temps réel, la gestion de communautés thématiques et l'interaction directe avec l'équipe de développement pour un feedback continu.

## 🚀 Technologies Utilisées

- **Framework:** [NestJS](https://nestjs.com/)
- **Base de données:** [Supabase](https://supabase.com/) & [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Temps Réel:** [Socket.io](https://socket.io/)
- **Authentification:** JWT (JSON Web Token) & Passport
- **Langage:** TypeScript

## 🛠️ Fonctionnalités Principales

### 💬 Messagerie en Temps Réel
- **Chats Directs:** Conversations privées entre deux utilisateurs.
- **Chats de Groupe:** Espaces de discussion restreints à plusieurs membres.
- **Communautés de Discussion:** Salons publics organisés par **langages de programmation** ou **domaines d'expertise** (ex: JavaScript, DevOps, IA).

### 📢 Système de Feedback & Annonces
- **Feedback Utilisateur:** Chaque interface utilisateur intègre un chat direct avec le compte officiel **Circle** pour envoyer des retours techniques ou suggestions.
- **Interface Admin Circle:** Tous les feedbacks sont centralisés sur le compte spécial de l'application Circle.
- **Broadcast:** Capacité pour le compte Circle d'envoyer des annonces à l'ensemble des utilisateurs (anciens et nouveaux).

### 📧 Messagerie vers Non-Inscrits (Workflow Email)
- Possibilité d'envoyer un message à un utilisateur via son adresse email même s'il n'a pas encore de compte.
- **Persistance:** Les messages sont stockés en attente.
- **Récupération:** Dès que l'utilisateur crée un compte avec l'email correspondant, tous les messages passés sont automatiquement chargés dans son interface.

## ⚙️ Installation

1. **Cloner le projet**
   ```bash
   git clone <repository-url>
   cd Circle-back
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration des variables d'environnement**
   Créez un fichier `.env` à la racine :
   ```env
   DATABASE_URL="votre_url_supabase_prisma"
   JWT_SECRET="votre_secret_jwt"
   ```

4. **Initialiser Prisma**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Lancer le serveur**
   ```bash
   npm run start:dev
   ```

## 📡 Événements Socket.io (Aperçu)

| Événement | Description |
| :--- | :--- |
| `connection` | Initialise la session temps réel |
| `joinRoom` | Rejoint un groupe ou une communauté |
| `sendMessage` | Envoie un message (direct, groupe ou feedback) |
| `receiveMessage` | Reçu par le destinataire en temps réel |
| `broadcast` | (Admin) Envoi groupé à tous les sockets connectés |

## 🔌 Connexion Frontend (Socket.io)

Pour connecter votre application frontend (Vue, React, etc.) au système temps réel de Circle :

### 1. Installation du client
```bash
npm install socket.io-client
```

### 2. Initialisation de la connexion
Il est recommandé d'utiliser le token JWT pour sécuriser la connexion socket.

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  auth: {
    token: `Bearer ${localStorage.getItem('token')}` // Envoyer le JWT
  }
});

socket.on("connect", () => {
  console.log("Connecté au serveur de Circle ⭕");
});
```

### 3. Rejoindre une conversation
```javascript
// Pour rejoindre un chat direct ou un groupe
socket.emit('joinRoom', { conversationId: "ID_DE_LA_CONV" });
```

### 4. Envoyer et Recevoir
```javascript
// Envoyer un message
const sendMessage = (content, conversationId) => {
  socket.emit('sendMessage', {
    conversationId,
    content
  });
};

// Écouter les nouveaux messages
socket.on('receiveMessage', (message) => {
  console.log("Nouveau message reçu:", message);
  // Mettre à jour l'interface UI ici
});
```


## 🏗️ Structure de la Base de Données (Concepts)

Pour supporter ces fonctionnalités, le schéma Prisma inclura :
- `User`: Informations de profil et credentials.
- `Message`: Contenu, expéditeur, destinataire (User ou Room) et email (pour les non-inscrits).
- `Room`: Entités pour les groupes et communautés.
- `CircleFeedback`: Table spécifique pour le suivi des retours via le compte système.

## 👨‍💻 Auteur
Développé dans le cadre du projet **Circle** - Le réseau social des passionnés d'informatique.
