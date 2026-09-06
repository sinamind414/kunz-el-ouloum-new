# MARQUE — كنز العلوم × مفتاح المنهجية

> **Document de décision — source unique de la marque.**
> Si un fichier de code diverge de ce document, c'est le code qui doit être corrigé.
> Le garde-fou `npm run check:miftah` (CI) prouve la cohérence `fiche ↔ spec ↔ carte`.
> Date de la décision : 2026-09-06.

---

## 1. La décision (actée)

**L'arme est le SVT BAC, et c'est tout.**

- La phrase-récit ne promet aucune matière.
- La transversalité **démontrée** = entre les 23 chapitres du SVT : « la même clé ouvre
  chaque salle » est prouvable aujourd'hui (méthode appliquée aux 23 leçons existantes).
  Ce n'est plus une hypothèse inter-matières, c'est un fait de produit.
- Le multi-matières **sort du récit** et vit ici, tel quel :

  > **À terme** : la même clé ouvrira d'autres salles (physique, maths) — à la condition
  > que la méthode soit validée avec un autre corps professoral.

  Pas de date, pas de promesse, une condition.

## 2. Le récit — une phrase, partout, jamais reformulée

**كنز العلوم يُفتح بمفتاح المنهجية**

| Élément du récit | Traduction produit (scope SVT BAC) |
|---|---|
| Le coffre (الكنز) | Le programme SVT BAC entier : 23 leçons, QCM, cartes, exercices |
| Les salles du coffre (غرف الكنز) | Les chapitres du programme SVT — une salle par chapitre |
| La clé (المفتاح) | La méthode : 4 étapes, 2 portes — valable sur chaque question du bac SVT |
| Le porteur de clé (حامل المفتاح) | Badge — drill maîtrisé |
| Le gardien du trésor (أمين الكنز) | Badge excellence |

**Phrase de positionnement** (cible : l'élève qui connaît le cours mais perd les points —
pas l'élève qui cherche du contenu) :

**المقرر موجود عندك. المفتاح يحوّله إلى نقاط.**

Elle ne sur-promet rien et nomme exactement la douleur que le produit traite.

## 3. Le nom — verrouillé

| Rang | Nom | Où | Règle |
|---|---|---|---|
| Officiel | **مفتاح المنهجية** | documents légaux / CGU, argumentaire prof-parent | jamais abrégé |
| Usage | **المفتاح** | UI, bouche de l'élève, copie d'examen | jamais autre chose |

**Variantes interdites dans l'UI** : le latin « MIFTAH » / « MIFTAH+ » comme nom,
« مفتاح الكنز » comme nom (expression poétique tolérée en interne, jamais en position
de nom — plus affichée dans l'UI depuis 2026-09-06).

**Clause de sauvegarde** (3 lignes, à recopier en fin de CGU et dans tout argumentaire) :

> المنهجية = la promesse,
> jamais la version figée.
> Le contenu de la clé peut évoluer.

## 4. Règle unique de placement

> **المفتاح partout où l'élève agit. مفتاح المنهجية partout où la marque se présente.
> Jamais les deux au même endroit.**

Exception documentée : **l'en-tête de la fiche imprimable** — nom d'usage en grand
(🔑 المفتاح) + nom officiel en petit (sous-titre), car la fiche est le support sur
lequel la marque se présente *à travers* l'action.

## 5. Tableau de placement (statut code au 2026-09-06)

| Emplacement | Ce qu'on écrit | Code ? |
|---|---|---|
| Nom de domaine / App Store | كنز العلوم — مفتاح المنهجية | ☐ au lancement |
| Titre de l'app (sous l'icône) | المفتاح | ☐ au lancement |
| Icône de l'app | Symbole clé (pas de texte) — 4 dents comptables | ☐ |
| Page d'accueil (hero) | Phrase-récit complète | ☐ au lancement (§7) |
| Splash screen | Phrase-récit | ☐ au lancement (§7) |
| Bio App Store / réseaux | Phrase-récit | ☐ au lancement |
| Bouton principal du menu | المفتاح | ☐ au lancement |
| **En-tête fiche imprimable** | 🔑 المفتاح (sous-titre petit : مفتاح المنهجية) | ✅ fait 2026-09-06 |
| **Copie d'examen de l'élève** | **RIEN — jamais aucun nom** | ✅ (aucun nom présent) |
| Argumentaire prof/parent | «نطبّق منهجية الإجابة الرسمية ضمن مفتاح ميكانيكي بسيط» | ☐ au lancement |
| Bouton du drill quotidien | شحذ المفتاح | ✅ (tab + section ك) |
| Niveau avancé / extension | المفتاح+ | ✅ fait 2026-09-06 |
| Badge niveau 1 (drill réussi) | حامل المفتاح | ☐ au lancement |
| Badge niveau expert | أمين الكنز | ☐ au lancement |
| Footer fiche (recto + verso) | مفتاح المنهجية · كنز العلوم | ✅ fait 2026-09-06 |

## 6. Identité visuelle (mécanique, pas artistique)

- Couleur dominante = **or/doré** (présent dans la fiche — à trancher : l'or réservé au
  « + » ou assumé décoratif → décision §8 b).
- Icône clé = **4 dents visibles et comptables** (1 dent = 1 étape) — le SVG de la
  fiche le fait déjà.
- **Aucun emoji dans les titres imprimables** (tofu à l'impression) → SVG / vectoriel.
  ⚠️ La fiche v3.1 actuelle contient des emojis (🔑 🧬 🚪 📷 🎬 🧠 📄 📝 📊 🧫🧱) :
  à traiter avant impression série (décision §8 e).
- Deux portes différenciées par **motif**, pas seulement couleur (accessibilité + N&B).

## 7. Ordre de mise en œuvre (ne pas paralléliser)

1. ✅ Nom verrouillé (§3) — ce document, 2026-09-06
2. ✅ Phrase-récit validée (§2) — figée dans `miftahSpec.ts` (`NARRATIVE_AR`)
3. ✅ Fiche corrigée + renommée — HTML, carte React et spec synchronisés 2026-09-06
4. ⏳ Test 5 puis 10 élèves sur la version corrigée (rappel du nom + phrase-récit, 24 h)
5. ⏳ Identité visuelle appliquée à l'app (§6)
6. ⏳ Placement complet (§5) au lancement public

## 8. Ce que la décision ne ferme PAS (en attente de l'owner)

| # | Décision | Question exacte |
|---|---|---|
| a | **Deuil de Boussole** | Date de retrait du « legacy en repli » de l'UI (outil unique, nom unique). |
| b | **L'or** | Règle écrite : l'or est réservé au « + » (base en teal) — OU or décoratif assumé et « clé dorée » retiré du nom du tier. Les deux ensemble = incohérent. |
| c | **Le badge** | 12/12 × 3 récompense la récitation. Critère de **transfert** à définir (ex. : 2 questions inédites bien structurées, sans la fiche). |
| d | **Test utilisateurs** | 10 élèves de bac SVT, phrase-récit + nom, 24 h, rappel. La seule chose qui transforme les 9,5/10 en fait. |
| e | **Emojis imprimables** | Supprimer les emojis des titres imprimables (tofu A4) — avec la prochaine refonte de fiche. |
| f | **`استنتج` (scoreur)** | La fiche porte `استنتج` côté « 🎬 فيلم » (1→2→3→4) ; le moteur (`methodologyEngine.ts`) le classe `descriptive` (interrupteur fermé, 1→2→4). Une des deux doit changer + invariant de test. |

## 9. Sources de vérité dans le code

| Fichier | Rôle |
|---|---|
| `src/data/miftahSpec.ts` | Source unique : noms, phrase-récit, positionnement, footers, erreurs, nomenclature |
| `public/miftah.html` | La fiche imprimable A4 recto/verso (statique, zéro JS) |
| `src/components/MiftahCard.tsx` | La carte in-app — rend depuis les constantes de la spec (footers, erreurs) |
| `src/data/methodologyEngine.ts` | Ré-exporte la spec ; porte le moteur des 12 verbes (⚠️ point f) |
| `scripts/check-miftah.ts` + `ci.yml` | Garde-fou de cohérence marque (job CI) |
| `src/data/v3Progress.ts` | Le déverrouillage 12/12 × 3 du مفتاح+ (la promesse de la carte est vraie) |

## 10. Bugs corrigés avec le renommage (2026-09-06)

1. **Débordement A4** — bloc print resserré (corps 10.4 px, interlignage 1.58, marges et
   paddings réduits, SVG clé 168×58) : le recto, enrichi de 3 nouveaux blocs, doit tenir
   sur UNE page. ⚠️ À valider par une vraie impression avant diffusion.
2. **« السنّ 0 » → « القفل »** — une clé n'a pas de « 0ᵉ dent » : l'étape 0 (اِفهم) est
   le قفل que la clé ouvre. Nomenclature spec : `qafal`.
3. **Erreurs 1-2-3 remontées au recto** — les trois erreurs de base (numéro, unité,
   xatima) accompagnent tout le monde dès le jour 1 ; 4-5 (formes avancées) restent
   sur le verso. Numérotation continue (`<ol start="4">`).
