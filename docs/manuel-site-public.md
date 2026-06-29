# Manuel du site public — Fédération Marocaine de l'Assurance (FMA)

**Version :** 1.0  
**Public :** visiteurs du site institutionnel  
**Langues du site :** français, anglais, arabe

---

## 1. Présentation

Le site institutionnel de la FMA informe le public, les professionnels et les médias sur le secteur des assurances au Maroc. Il est disponible en **trois langues** :

| Langue   | Code URL  | Exemple d'accueil   |
|----------|-----------|---------------------|
| Français | `/fr/...` | `https://…/fr`      |
| Anglais  | `/en/...` | `https://…/en`      |
| Arabe    | `/ar/...` | `https://…/ar` (RTL)|

Le français est la langue par défaut.

---

## 2. Éléments communs à toutes les pages

### 2.1 En-tête (header)

- **Logo FMA** (en haut à gauche) : retour à l'accueil ou vers une URL configurée.
- **Menu principal** (écran large) : liens en gras, avec sous-menus déroulants pour *Publications* et *Découvrir le secteur*.
- **Recherche** (icône loupe) : ouvre la page de recherche.
- **Langue** : bascule entre FR, EN et AR ; le contenu et l'URL s'adaptent.
- **Thème** : bascule **clair / sombre** ; le choix est mémorisé dans le navigateur.
- **Menu mobile** (écran réduit) : bouton hamburger, navigation en panneau plein écran avec sous-menus repliables.

L'en-tête reste **fixe** en haut de page ; le fond devient plus marqué au défilement.

### 2.2 Pied de page (footer)

- **Navigation** : reprend les principales rubriques du site.
- **Contact** : adresse, téléphone(s), e-mail.
- **Réseaux sociaux** : Facebook, LinkedIn, X, Instagram, YouTube (si renseignés).
- **Liens légaux** : Mentions légales, Politique de confidentialité.
- **Copyright** : année en cours + FMA.

### 2.3 Chargement des pages

Lors d'une navigation ou du chargement, un **écran de chargement** affiche le logo FMA dans un anneau animé.

### 2.4 Fenêtres d'annonce (popups)

À l'**accueil** ou lors de la **première page visitée** dans la session, le site peut afficher :

- une **actualité** mise en avant ;
- une **publication** mise en avant.

La popup peut être fermée ; elle ne réapparaît pas sur les pages suivantes de la même session de navigation.

### 2.5 Lien « Retour à l'accueil »

Sur les pages intérieures, un bandeau en haut (sous l'en-tête) propose un lien **Retour à l'accueil** et, le cas échéant, une **image hero** propre à la rubrique.

---

## 3. Page d'accueil (`/fr`, `/en`, `/ar`)

De haut en bas :

1. **Hero** — Titre, sous-titre, badge, deux boutons d'action ; fond couleur ou photo configurable.
2. **Chiffres clés** — Indicateurs du secteur (cartes animées, visuel + grille de chiffres).
3. **Interventions FMA** — Carrousel de photos (si contenu disponible) + lien « Voir tout ».
4. **Réseaux sociaux** — Carrousel d'images (si contenu disponible).
5. **Dernières actualités** — Aperçu des news + lien vers la liste complète.
6. **Newsletter** — Formulaire d'inscription par e-mail.

**Actions possibles :** consulter les chiffres, parcourir les carrousels, lire une actualité, s'inscrire à la newsletter, utiliser les boutons du hero.

---

## 4. Rubriques principales

### 4.1 La FMA (`/fr/la-fma`)

Présentation de la fédération :

- Bandeau hero + image
- **Présentation** (texte + chiffres : année de fondation, etc.)
- **Missions** (cartes par mission)
- **Organisation** (organes : Assemblée générale, etc.)
- **Comité directeur** (membres avec photo/initiales)
- **Valeurs**
- **Équipe opérationnelle** (organigramme)
- **Membres** (logos des entreprises adhérentes par catégorie)

### 4.2 Publications (`/fr/publications`)

Accès par type via le menu ou l'URL :

| Type                      | Paramètre URL              | Contenu                    |
|---------------------------|----------------------------|----------------------------|
| Chiffres clés             | `?type=chiffres-cles`      | Documents statistiques     |
| Faits marquants           | `?type=faits-marquants`    | Publications événementielles |
| Le Courrier de l'assurance| `?type=courrier`           | Newsletter institutionnelle|
| Interventions FMA         | `?type=interventions-fma`  | Galerie photos (dossiers)  |
| Réseaux sociaux           | `?type=reseaux-sociaux`    | Galerie photos             |

**Publications documentaires :**

- Liste en cartes avec **date** (calendrier visuel), titre, type.
- **Filtre par année** (si plusieurs années disponibles).
- Actions : **Consulter le PDF** (visionneuse intégrée) ou **Lire la suite** (lien externe).

**Galeries :**

- Grille d'images ou navigation par **dossiers** (Interventions FMA).
- Clic sur une image : agrandissement / lien associé si configuré.

### 4.3 Actualités (`/fr/actualites`)

- Liste des articles avec **filtre par catégorie** et **recherche textuelle**.
- **Pagination** (9 articles par page).
- Clic sur une carte → **article détaillé** (`/fr/actualites/[slug]`).

En anglais : `/en/news` — structure identique.

### 4.4 Découvrir le secteur (`/fr/decouvrir-le-secteur`)

Page hub avec 4 entrées :

| Rubrique                    | URL (FR)           | Contenu type              |
|-----------------------------|--------------------|---------------------------|
| Conventions professionnelles | `…/conventions`  | Textes / documents        |
| Liens utiles                | `…/liens-utiles`   | Liens externes classés    |
| Formations                  | `…/formations`     | Offres de formation       |
| Vocabulaire utile           | `…/vocabulaire`    | Lexique assurance         |

Chaque sous-page a son bandeau hero et son contenu éditorial.

### 4.5 Particuliers (`/fr/particuliers`)

- Présentation des **types d'assurance** pour le grand public (cartes : auto, habitation, etc.).
- Certaines cartes mènent vers des **pages de détail**.
- Bloc d'appel à l'action en bas de page.

En anglais : `/en/individuals`.

### 4.6 Entreprises & Professionnels (`/fr/entreprises`)

- Contenu orienté **professionnels** et entreprises (hero + sections éditoriales).

En anglais : `/en/businesses`.

### 4.7 Contact (`/fr/contact`)

**Colonne gauche — Coordonnées :**

- Adresse postale
- Téléphone
- E-mail
- Horaires d'ouverture
- Carte Google Maps intégrée (si configurée)

**Colonne droite — Formulaire :**

| Champ                    | Obligatoire |
|--------------------------|-------------|
| Nom complet              | Oui         |
| E-mail                   | Oui         |
| Téléphone                | Non         |
| Objet (liste déroulante) | Oui         |
| Message                  | Oui         |

Objets proposés : Information générale, Publications, Formations, Adhésion, Presse, Autre.

Après envoi réussi : message de confirmation ; possibilité d'envoyer un autre message.

---

## 5. Recherche (`/fr/recherche`)

- Champ de recherche (minimum **2 caractères**).
- Résultats dans **Actualités** et **Publications** (titres et extraits).
- Liens directs vers chaque résultat.

En anglais : `/en/search`.

---

## 6. Newsletter (accueil)

- Saisir une **adresse e-mail valide**.
- Cliquer sur **S'inscrire**.
- Message de succès ou d'erreur selon la réponse du serveur.

---

## 7. Consultation de documents PDF

Sur les cartes de publication :

- **Consulter le PDF** ouvre une **visionneuse modale** dans le site (sans quitter la page).
- Fermeture par le bouton prévu ou la touche Échap.

---

## 8. Accessibilité et confort de lecture

- **Contraste** : thème clair et sombre.
- **Navigation clavier** : liens et boutons focusables.
- **Arabe** : mise en page RTL automatique.
- **Textes** : tailles adaptatives selon la taille d'écran.

---

## 9. Tableau des URLs principales (FR / EN)

| Page                 | Français                              | Anglais                               |
|----------------------|---------------------------------------|---------------------------------------|
| Accueil              | `/fr`                                 | `/en`                                 |
| La FMA               | `/fr/la-fma`                          | `/en/the-fma`                         |
| Actualités           | `/fr/actualites`                      | `/en/news`                            |
| Publications         | `/fr/publications?type=chiffres-cles` | `/en/publications?type=chiffres-cles` |
| Découvrir le secteur | `/fr/decouvrir-le-secteur`            | `/en/discover-the-sector`             |
| Particuliers         | `/fr/particuliers`                    | `/en/individuals`                     |
| Entreprises          | `/fr/entreprises`                     | `/en/businesses`                      |
| Contact              | `/fr/contact`                         | `/en/contact`                         |
| Recherche            | `/fr/recherche`                       | `/en/search`                          |

Les URLs en arabe utilisent le préfixe `/ar/` avec les mêmes chemins que le français, sauf exceptions (`/en/the-fma`, `/en/news`, etc.).

---

## 10. Contenu dynamique

Le contenu affiché (textes, chiffres, images, publications, actualités, menu, footer) est **géré depuis l'interface d'administration**. Ce manuel décrit l'**expérience visiteur**.

---

## 11. Problèmes courants

| Situation                         | Conseil                                              |
|-----------------------------------|------------------------------------------------------|
| Page blanche ou erreur            | Actualiser (Ctrl+F5) ou vider le cache               |
| PDF ne s'ouvre pas                | Vérifier la publication ; essayer un autre navigateur|
| Formulaire contact en erreur      | Vérifier les champs obligatoires et le format e-mail |
| Langue incorrecte                 | Utiliser le sélecteur de langue en haut à droite     |
| Popup d'annonce gênante           | La fermer ; elle ne reviendra pas dans la même session |

---

*Document généré pour le site public FMA — Fédération Marocaine de l'Assurance.*
