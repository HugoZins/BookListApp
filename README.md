# **BookListApp** – Gestion de bibliothèque mobile

Application **React Native (Expo)** de gestion d'une bibliothèque personnelle, connectée à **votre API locale** (`server.js` du dossier `API-BOOKS`).  
**Ce dépôt contient uniquement le frontend** – **le serveur n’est pas inclus**.

---

## Fonctionnalités implémentées (20/20)

| Fonctionnalité | Statut |
|----------------|--------|
| Liste des livres avec recherche, filtres (lus/non lus/favoris) et tri (titre/auteur/thème) | Done |
| Ajout, modification, suppression de livres | Done |
| Notes par livre | Done |
| Favoris (cœur) | Done |
| Notation (étoiles) | Done |
| Couverture personnalisée (galerie) | Done |
| **Mode hors ligne** (AsyncStorage) | Done |
| **Thème clair/sombre global** (Context + persistance) | Done |
| **Intégration OpenLibrary** (nombre d’éditions) | Done |
| **Bouton thème (soleil/lune)** dans le header | Done |

---

## Structure du projet

```
BookListApp/
├── app/
│   ├── _layout.tsx          → ThemeProvider + Stack global 
│   ├── index.tsx            → Liste principale (recherche, filtres, tri)
│   ├── add.tsx              → Formulaire d'ajout
│   ├── [id].tsx             → Détail du livre + notes + OpenLibrary
│   └── ...
├── components/
│   ├── BookCard.tsx         → Carte livre (affichage + favori + suppression)
│   ├── DeleteModal.tsx      → Confirmation suppression
│   └── ...
├── context/
│   └── ThemeContext.tsx     → Gestion globale du thème (clair/sombre)
├── lib/
│   ├── api.ts               → Requêtes Axios + mode offline
│   └── ...
└── package.json
```

---

## Lancement du projet

> **Prérequis** : Votre API `server.js` doit être **lancée sur `http://localhost:3000`**

### Étapes :

```bash
# 1. Cloner le dépôt
git clone https://github.com/HugoZins/BookListApp.git
cd BookListApp

# 2. Installer les dépendances
npm install

# 3. Lancer votre API (dans un autre terminal)
cd ../API-BOOKS
node server.js
# → Doit afficher : "API démarrée sur http://localhost:3000"
```

---

## **ÉTAPE CRUCIALE : Configurer l'IP locale**

> **Le téléphone (Expo Go) ne peut pas accéder à `localhost` du PC.**  
> **Vous devez utiliser l’IP locale de votre machine.**

### Trouvez l’**IP locale** de votre ordinateur :

| OS | Commande |
|----|---------|
| **Windows** | `ipconfig` → cherche `Adresse IPv4` (ex: `192.168.1.35`) |
| **Mac** | `ifconfig` → cherche `en0` ou `wlan0` |
| **Linux** | `ip addr show` |

**Exemple : `192.168.1.35`**

---

### Modifiez `lib/api.ts`

```ts
// REMPLACEZ CETTE LIGNE :
const API_BASE = 'http://192.168.1.XX:3000';

// PAR VOTRE IP (exemple) :
const API_BASE = 'http://192.168.1.35:3000';
```

> **Assurez-vous que votre téléphone est sur le même Wi-Fi que le PC.**

---

### Lancer l'app

```bash
npx expo start --clear
```

#### Sur mobile :
- Scannez le **QR code** avec **Expo Go**

#### Sur émulateur :
- `a` → Android  
- `i` → iOS

> **Note** : L'app fonctionne **même sans réseau** grâce au mode offline.

---

## Fonctionnement clé

### 1. **Thème clair/sombre**
- Bouton **soleil/lune** en haut à droite
- Persistance via `AsyncStorage`
- Appliqué **sur toutes les pages**

### 2. **Mode hors ligne**
- Les livres sont **sauvegardés localement**
- Chargement au démarrage même sans réseau
- Synchronisation automatique dès que le réseau revient

### 3. **OpenLibrary**
- Dans la fiche d’un livre :  
  `Éditions OpenLibrary : 27`

---

## Technologies utilisées

| Technologie | Rôle |
|-------------|------|
| **Expo Router** | Navigation basée sur fichiers |
| **React Native** | UI native |
| **Axios** | Requêtes API |
| **AsyncStorage** | Persistance locale |
| **Context API** | Thème global |
| **react-native-ratings** | Étoiles |
| **expo-image-picker** | Couverture |
