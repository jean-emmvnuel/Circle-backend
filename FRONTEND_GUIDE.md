# 🚀 Guide d'Intégration Frontend (Vue.js)

Ce document récapitule comment connecter votre frontend Vue.js au backend NestJS (Circle-back).

---

## 🏗️ Configuration de base

- **Base URL API** : `http://localhost:3001`
- **Socket.io URL** : `http://localhost:3001`
- **Format Auth** : JWT (JSON Web Token)

---

## 🔑 Authentification (REST)

### 1. Inscription
**POST** `/auth/register`
```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "mon_pseudo"
}
```

### 2. Connexion
**POST** `/auth/login` -> Renvoie un token.
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
*Note : Stockez le token dans `localStorage` ou un store (Pinia).*

### 3. Header Authorization
Pour toutes les requêtes protégées :
`Authorization: Bearer <votre_token>`

---

## 🔌 Connexion Temps Réel (Socket.io)

### Installation
`npm install socket.io-client`

### Initialisation
```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  auth: {
    token: `Bearer ${localStorage.getItem('token')}`
  },
  transports: ['websocket']
});
```

---

## 📡 Événements Socket.io

### 📤 Émis par le Frontend (Actions)

| Événement | Charge utile (Payload) | Description |
| :--- | :--- | :--- |
| `dm:create` | `{ recipientId?: string, recipientEmail?: string }` | Crée ou récupère une conversation directe. |
| `dm:join` | `"id_de_la_conversation"` | Rejoint la "room" (`dm:ID`) pour les messages en direct. |
| `dm:send` | `{ conversationId: string, content: string }` | Envoie un message. |

### 📥 Reçus par le Frontend (Écoute)

| Événement | Données reçues | Usage suggéré |
| :--- | :--- | :--- |
| `conversation:new` | `Object (Conversation)` | Ajouter la conversation à votre liste latérale (SideBar). |
| `dm:new-message` | `Object (Message)` | Ajouter le message au chat ouvert OU mettre à jour le dernier message dans la SideBar. |

#### 📦 Structure d'un Message reçu :
```json
{
  "id": "uuid",
  "content": "Bonjour !",
  "createdAt": "2024-01-06T...",
  "conversationId": "uuid",
  "senderId": "uuid",
  "sender": {
    "id": "uuid",
    "username": "Alice",
    "email": "alice@ex.com"
  },
  "conversation": {
    "id": "uuid",
    "members": [ ... ]
  }
}
```

---

## 📁 Endpoints API (REST)

### 💬 Messages (Historique & Envoi)
- **GET** `/messages?conversationId=...&limit=20&cursor=...` : Récupère l'historique paginé.
- **POST** `/messages` : `{ "conversationId": "uuid", "content": "..." }` (Émet aussi un événement Socket).

### 👥 Conversations
- **GET** `/conversations` : Liste vos chats avec le **dernier message inclus**.
- **POST** `/conversations/direct` : `{ "recipientId": "...", "recipientEmail": "..." }`.

---

## ️⚡ Gestion "Intelligente" des Emails
Si vous créez une conversation avec un `recipientEmail` :
1. Si l'email correspond à un utilisateur déjà inscrit, le backend bascule automatiquement sur son **UserId**.
2. Si l'utilisateur n'existe pas, il reste en tant qu'invité (`invitedEmail`).
3. **Auto-messagerie** : Il est impossible de s'envoyer un message à soi-même (bloqué par le serveur).

---

## ⚠️ Notes Importantes
1. **Mises à jour SideBar** : L'événement `dm:new-message` est désormais envoyé à tous les membres via leur room personnelle (`user:ID`). Vous recevrez donc les notifs de messages même si vous n'avez pas encore fait de `dm:join`.
2. **CORS** : Configuré sur `*` pour le développement.
