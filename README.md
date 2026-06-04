# Frontend — Gestion des établissements (React + Vite + Tailwind)

Interface web qui consomme l'API Spring Boot (`http://localhost:8080/api`).

## 1. Installer les dépendances

À la racine du dossier `gestion-ecoles-frontend` :

```bash
npm install
```

(Télécharge React, Vite, Tailwind… dans `node_modules`. À faire une seule fois.)

## 2. Lancer le frontend

> ⚠️ Le backend Spring Boot doit tourner **en parallèle** (`mvn spring-boot:run`
> dans l'autre projet), sinon la liste des établissements restera vide.

```bash
npm run dev
```

Ouvre ensuite l'adresse affichée, généralement : **http://localhost:5173**

## 3. Ce que tu verras

- **Établissements** (`/`) : la liste, récupérée depuis ton API. Le « Lycée
  Excellence » que tu as créé doit apparaître.
- **Détail** (`/etablissements/1`) : caractéristiques uniques + contact direction.
- **Communiqué** (`/communique`) : admission + frais (contenu à personnaliser).
- **Annonces** (`/annonces`) : exemples (à brancher au backend ensuite).
- **Contact** (`/contact`) : formulaire pour écrire au directeur.

## 4. Structure du projet

```
src/
├── main.jsx          → point d'entrée + routeur
├── App.jsx           → définit les pages (routes)
├── api.js            → tous les appels vers le backend
├── index.css         → styles Tailwind
├── components/
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   └── EtablissementCard.jsx
└── pages/
    ├── ListeEtablissements.jsx
    ├── DetailEtablissement.jsx
    ├── Communique.jsx
    ├── Annonces.jsx
    └── Contact.jsx
```

## Problème fréquent

Si la liste affiche **« Erreur de connexion à l'API »** :
1. Vérifie que le backend tourne (`mvn spring-boot:run`).
2. Ouvre `http://localhost:8080/api/etablissements` dans le navigateur : ça doit
   renvoyer du JSON. Si oui, le souci vient du CORS — vérifie que
   `CorsConfig.java` autorise bien `http://localhost:5173`.
