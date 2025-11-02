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

# 4. Lancer l'app
npx expo start
```

### Sur mobile :
- Scannez le **QR code** avec **Expo Go** (iOS/Android)

### Sur émulateur :
- `a` → Android  
- `i` → iOS

> **Note** : L'app fonctionne **même sans réseau** grâce au mode offline.

---

## Configuration API

- L’app utilise automatiquement :
  ```ts
  http://10.0.2.2:3000  → Android Emulator  
  http://localhost:3000 → iOS / Expo Go
  ```
- Aucune modification nécessaire si votre `server.js` écoute sur le port `3000`.

---

## Fonctionnement clé

### 1. **Thème clair/sombre**
- Bouton **soleil/lune** en haut à droite de l’écran principal
- Persistance via `AsyncStorage`
- Appliqué **sur toutes les pages** via `ThemeContext`

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
