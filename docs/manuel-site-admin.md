# Manuel d'administration — Site FMA

**Version :** 1.0  
**Public :** équipe éditoriale et technique FMA  
**URL d'accès :** `/admin/login`

---

## 1. Connexion et sécurité

### 1.1 Se connecter

1. Ouvrir `/admin/login`.
2. Saisir l'**adresse e-mail** et le **mot de passe** fournis par l'administrateur système.
3. Cliquer sur **Se connecter**.

En cas d'erreur : vérifier les identifiants. Après connexion, vous arrivez sur le **Dashboard**.

### 1.2 Se déconnecter

Dans la barre latérale gauche, en bas : **Déconnexion**.

### 1.3 Voir le site public

Lien **Voir le site** (ouvre `/fr` dans un nouvel onglet) — utile pour vérifier les modifications après enregistrement.

### 1.4 Bonnes pratiques

- Ne partagez pas vos identifiants.
- Publiez uniquement du contenu validé (statut **Publié**).
- Préférez l'onglet **FR** comme référence, puis complétez **EN** et **AR** si nécessaire.
- Après une modification importante, videz le cache navigateur ou testez en navigation privée.

---

## 2. Interface générale

### 2.1 Barre latérale

Le menu est organisé en **4 groupes** :

| Groupe | Rubriques |
|--------|-----------|
| **Contenu** | Dashboard, Page d'accueil, La FMA, Actualités, Publications, Conventions, Particuliers, Entreprises, Contact, Chiffres clés |
| **Organisation** | Membres FMA, Équipe, Formations, Liens utiles, Vocabulaire, Médias* |
| **Communication** | Messages, Newsletter |
| **Système** | Menu de navigation, Logo du site, Footer, Paramètres |

\* *L'entrée « Médias » est présente dans le menu ; la page dédiée peut ne pas être encore disponible selon la version déployée.*

### 2.2 En-tête de page

Chaque écran affiche un **titre**, un **sous-titre** explicatif et parfois un bouton d'action (**Nouvelle actualité**, **Nouvelle publication**, etc.).

### 2.3 Formulaires multilingues

La plupart des contenus éditoriaux utilisent des onglets **FR / EN / AR**. Le français est en général obligatoire pour la publication.

### 2.4 Upload de fichiers

- **Images** : JPG, PNG, WebP, SVG (selon les écrans).
- **PDF** : pour les publications et conventions.
- Les fichiers sont stockés dans `public/uploads/` sur le serveur.
- **Bandeaux hero** (pages internes) : format recommandé **500 × 162 px** (ratio 37:10), idéalement **1000 × 324 px** pour les écrans Retina.
- **Fond hero accueil** : recommandé **2560 × 1440 px** (16:9).

### 2.5 Enregistrement

Cliquez sur **Enregistrer** (ou **Sauvegarder**) en bas de chaque formulaire. Un message de succès confirme l'opération. Certaines pages rechargent automatiquement le site public après quelques minutes (cache).

---

## 3. Dashboard (`/admin/dashboard`)

Vue d'ensemble :

- **Cartes statistiques** : nombre d'actualités, publications, messages, abonnés newsletter, membres, formations — cliquables pour accéder à la rubrique.
- **Messages récents** : derniers messages du formulaire contact (pastille bleue = non lu).
- **Actions rapides** : raccourcis vers La FMA, nouvelle actualité, nouvelle publication, nouveau membre, nouvelle formation.
- **Résumé** : articles publiés, abonnés actifs, messages non lus.

---

## 4. Contenu — pages du site

### 4.1 Page d'accueil (`/admin/page-accueil`)

Gère tout le contenu visible sur `/fr` :

| Section admin | Effet sur le site |
|---------------|-------------------|
| **Hero** | Badge, titre, sous-titre, 2 boutons CTA, fond (couleur ou image) |
| **Chiffres clés** | Section chiffres de l'accueil (cartes, chiffre global, image, légende) — peut référencer les données « Chiffres clés » |
| **Carrousel Interventions FMA** | Galerie à dossiers, affichée sur l'accueil + publications |
| **Carrousel Réseaux sociaux** | Idem pour la galerie réseaux sociaux |

**Galeries à dossiers :** créer des dossiers, y ajouter des photos, définir une couverture, option « afficher dans le carrousel ».

### 4.2 Page La FMA (`/admin/la-fma`)

- **Image hero** de la page institutionnelle.
- **Textes** : titre hero, présentation, statistiques (année de fondation, etc.), missions, blocs organisation, valeurs, titres de sections.

> Les **photos du comité / direction** se gèrent dans **Équipe**. Les **logos des sociétés membres** dans **Membres FMA**.

### 4.3 Actualités (`/admin/actualites`)

**Liste :** titre, catégorie, statut (Brouillon / Publié), date, badge « Popup » si annonce activée.

**Créer / modifier une actualité :**

| Champ | Description |
|-------|-------------|
| Titre, slug | URL de l'article (`/fr/actualites/[slug]`) |
| Onglets FR/EN/AR | Titre, extrait, contenu riche (éditeur WYSIWYG) |
| Catégorie | Classement pour les filtres publics |
| Statut | `DRAFT` = invisible · `PUBLISHED` = visible |
| Date de publication | Affichage chronologique |
| Image à la une | Upload ou URL |
| À la une / Popup | Mise en avant ; popup d'annonce sur l'accueil (1 seule active à la fois en pratique) |
| SEO | Titre et description pour les moteurs de recherche |

**Image hero actualités :** bandeau en haut de la page liste `/fr/actualites`.

Actions : **Modifier**, **Supprimer**, **Aperçu** (si disponible).

### 4.4 Publications (`/admin/publications`)

**Types de publications documentaires :**

- Chiffres clés
- Faits marquants
- Le Courrier de l'assurance

**Images hero par type :** un bandeau par onglet (Chiffres clés, Faits marquants, Courrier, Interventions FMA, Réseaux sociaux).

**Galeries :** Interventions FMA et Réseaux sociaux — gestion identique aux carrousels de l'accueil (dossiers + photos).

**Créer / modifier une publication :**

| Champ | Description |
|-------|-------------|
| Type | Détermine la liste publique (`?type=…`) |
| Titre multilingue | FR recommandé |
| Slug | Identifiant URL |
| Année | Filtre par année sur le site |
| PDF | Fichier consultable en visionneuse |
| Image de couverture | Optionnelle |
| Lien « Lire la suite » | URL externe alternative au PDF |
| Statut | Brouillon / Publié |
| À la une / Popup | Mise en avant ; popup publication sur l'accueil |

### 4.5 Chiffres clés (`/admin/chiffres-cles`)

- **Image hero** pour l'onglet publications « Chiffres clés ».
- **Structure du chiffre d'affaires** : tableau éditorial (lignes, catégories, pourcentages) alimentant les cartes de l'accueil lorsque la source est « base chiffres clés ».

### 4.6 Conventions (`/admin/conventions`)

Gestion des conventions professionnelles (page Découvrir le secteur / Conventions) :

- Titre multilingue, slug unique
- PDF optionnel
- Statut brouillon / publié — seules les **publiées** apparaissent sur le site

### 4.7 Particuliers (`/admin/particuliers`)

- Image **hero**
- **Cartes d'assurance** (titre, description, lien, icône)
- Bloc **CTA** en bas de page

### 4.8 Entreprises & Professionnels (`/admin/entreprises`)

Même logique que Particuliers : hero, cartes de contenu, CTA — pour la page `/fr/entreprises`.

### 4.9 Page Contact (`/admin/page-contact`)

Contenu **affiché** sur `/fr/contact` :

- Image hero
- Titres et textes du formulaire (multilingue)
- Adresse, téléphone, e-mail, horaires
- URL d'intégration Google Maps

> Les **messages reçus** se consultent dans **Communication → Messages**, pas ici.

### 4.10 Formations (`/admin/formations`)

Page `/fr/decouvrir-le-secteur/formations` :

- Hero, fiches formations, FAQ, bloc CTA
- Création / édition / suppression de fiches individuelles

### 4.11 Liens utiles (`/admin/liens-utiles`)

Liens classés affichés sur Découvrir le secteur / Liens utiles — URL complète `https://…`, textes multilingues.

### 4.12 Vocabulaire (`/admin/vocabulaire`)

Glossaire assurance — terme et définition en FR (EN/AR optionnels), page publique Vocabulaire utile.

---

## 5. Organisation

### 5.1 Membres FMA (`/admin/membres`)

Sociétés adhérentes affichées sur **La FMA → Membres** :

| Champ | Description |
|-------|-------------|
| Nom (multilingue) | Raison sociale |
| Logo | Image uploadée |
| Catégorie | Regroupement à l'affichage |
| Ordre | Tri d'affichage |
| Actif | Visible / masqué sur le site |

Les **12 premiers membres actifs** (par ordre) sont mis en avant sur la page publique.

### 5.2 Équipe (`/admin/equipe`)

Personnes affichées sur **La FMA** (comité directeur et équipe opérationnelle) :

| Champ | Description |
|-------|-------------|
| Nom, fonction | Multilingue |
| Photo | Portrait |
| Service (`department`) | **`comite_directeur`** → section Comité Directeur · **`direction`** (ou autre) → Équipe opérationnelle |
| Ordre | Position dans l'organigramme (ex. `10`, `20` pour les lignes ; `11`, `12` pour colonnes) |
| Actif | Visible / masqué |

**Comité directeur :** cartes avec initiales / photo.  
**Équipe opérationnelle :** organigramme hiérarchique selon l'ordre numérique.

### 5.3 Formations, Liens utiles, Vocabulaire

Voir section 4 — listes avec boutons **Nouveau**, **Modifier**, **Supprimer**.

---

## 6. Communication

### 6.1 Messages (`/admin/contact`)

Messages envoyés via le **formulaire de contact** public :

- Liste avec nom, objet, date, statut lu / non lu
- Consultation du détail (e-mail, téléphone, message)
- Marquer comme lu

Le dashboard affiche le nombre de messages non lus.

### 6.2 Newsletter (`/admin/newsletter`)

- **Statistiques** : total inscrits, confirmés, en attente
- **Liste des abonnés** : e-mail, date d'inscription, langue, statut actif

Les inscriptions proviennent du formulaire sur l'**accueil** du site public.

---

## 7. Système

### 7.1 Menu de navigation (`/admin/menu`)

Structure du **header** du site public :

- Entrées de menu principales (libellés FR/EN/AR)
- **Sous-liens** (children) pour les menus déroulants
- URLs : utiliser `[locale]` pour la langue dynamique (ex. `/[locale]/la-fma`)

Après modification : **Enregistrer** — le menu public se met à jour.

### 7.2 Logo du site (`/admin/logo`)

| Élément | Usage |
|---------|--------|
| **Logo header/footer** | Image affichée sur le site (versions clair/sombre si logo par défaut FMA) |
| **Lien du logo** | URL de destination au clic (souvent l'accueil) |
| **Logo spinner** | Image au centre de l'écran de chargement (navigation entre pages) |

Aperçu intégré pour le spinner.

### 7.3 Footer (`/admin/footer`)

- Description institutionnelle (FR/EN/AR)
- Adresse, téléphone(s), e-mail
- URLs des réseaux sociaux (Facebook, LinkedIn, X, Instagram, YouTube)

Affiché en bas de **toutes** les pages publiques.

### 7.4 Paramètres (`/admin/parametres`)

- **Thème site public** : couleurs principales (brand, fonds, textes)
- **Thème administration** : apparence de l'espace admin

Modifications visibles après enregistrement et rechargement.

---

## 8. Popups d'annonce (actualités & publications)

Sur une actualité ou publication **publiée**, l'option **Annoncer en popup** (ou équivalent) affiche une fenêtre modale aux visiteurs :

- Uniquement sur l'**accueil** ou la **première page** visitée dans la session
- Une actualité et/ou une publication peuvent être candidates — la logique priorise le contenu configuré

Désactiver l'option pour retirer la popup.

---

## 9. Correspondance admin → site public

| Administration | Page publique (FR) |
|----------------|-------------------|
| Page d'accueil | `/fr` |
| La FMA | `/fr/la-fma` |
| Actualités | `/fr/actualites` |
| Publications | `/fr/publications?type=…` |
| Chiffres clés (structure) | Section chiffres accueil + publications |
| Conventions | `/fr/decouvrir-le-secteur/conventions` |
| Formations | `/fr/decouvrir-le-secteur/formations` |
| Liens utiles | `/fr/decouvrir-le-secteur/liens-utiles` |
| Vocabulaire | `/fr/decouvrir-le-secteur/vocabulaire` |
| Particuliers | `/fr/particuliers` |
| Entreprises | `/fr/entreprises` |
| Page Contact | `/fr/contact` |
| Menu / Logo / Footer | Toutes les pages |
| Membres FMA | `/fr/la-fma` (section Membres) |
| Équipe | `/fr/la-fma` (Comité + Équipe opérationnelle) |

---

## 10. Workflow éditorial recommandé

### Nouvelle actualité

1. **Actualités → Nouvelle actualité**
2. Rédiger en FR, compléter EN/AR si besoin
3. Choisir catégorie, image, date
4. Statut **Brouillon** → relire → **Publié**
5. Vérifier sur `/fr/actualites`

### Nouvelle publication PDF

1. **Publications → Nouvelle publication**
2. Type, année, titre, upload PDF
3. **Publié**
4. Vérifier sur `/fr/publications?type=…`

### Mise à jour des chiffres de l'accueil

1. **Chiffres clés** → modifier la structure
2. **Page d'accueil** → vérifier que les cartes pointent vers la bonne source
3. Enregistrer et contrôler la section sur `/fr`

### Nouveau membre du comité

1. **Équipe → Ajouter un membre**
2. Service = `comite_directeur`, photo, ordre
3. Actif = oui
4. Vérifier sur `/fr/la-fma`

---

## 11. Dépannage

| Problème | Piste de résolution |
|----------|---------------------|
| Modification invisible sur le site | Attendre le cache (~5 min) ; Ctrl+F5 ; vérifier statut **Publié** |
| Upload échoue | Taille / format fichier ; espace disque serveur |
| Image hero déformée | Respecter ratio 37:10 (500×162 px) |
| Menu incorrect | Vérifier `[locale]` dans les URLs du menu admin |
| Popup indésirable | Désactiver « Annoncer en popup » sur l'article concerné |
| PDF ne s'ouvre pas | Re-uploader le fichier ; vérifier publication active |
| Connexion impossible | Contacter l'administrateur (réinitialisation mot de passe) |

---

## 12. Déploiement (rappel technique)

- Les **uploads** (`public/uploads/`) doivent être **persistants** en production (volume disque ou stockage externe).
- Variables d'environnement : base de données, authentification, e-mail (contact, newsletter).
- L'admin n'est **pas indexé** par les moteurs de recherche (`noindex`).

---

*Document généré pour l'espace d'administration FMA — Fédération Marocaine de l'Assurance.*
