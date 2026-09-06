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
| c | **Le badge** | ✅ **Décidé (D1, 2026-09-06)** — حامل المفتاح = drill 12/12 sur 3 jours distincts · أمين الكنز = noyau stable sur 3 types de questions différents (= déblocage du verso). |
| d | **Test utilisateurs** | ✅ **Protocole prêt (D3, 2026-09-06)** — §11 D3 ; à exécuter par l'owner (étape 4 de l'ordre §7). |
| e | **Emojis imprimables** | Supprimer les emojis des titres imprimables (tofu A4) — avec la prochaine refonte de fiche. |
| f | **`استنتج` (scoreur)** | ✅ **Décidé (D2, 2026-09-06)** — le moteur suit la fiche (استنتج = 🎬 فيلم, 1→2→3→4). Implémentation code PENDING (spec §11 D2) — **prérequis de la Phase 1**. |

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

## 11. Décisions actées — bilan de l'audit « apprendre le مفتاح dans l'app » (2026-09-06)

Bilan complet : `docs/AUDIT_APPROCHE_APP.md`. Trois décisions sont actées ci-dessous.
**D1 et D2 sont implémentées en code (2026-09-06)** ; D3 est prêt à exécuter par l'owner.

### D1 — Sémantique du 12/12 ×3 + cibles de déblocage (audit §3.1 + §3.2)

- **Sémantique** : 12/12 sur **3 jours distincts** (pas « consécutifs »). Un échec **allonge
  l'intervalle** (J+1) **sans remettre le compteur à zéro** — le streak-reset actuel est le plus
  punitif et va à l'encontre de la logique d'espacement du plan pédagogique.
- **Cibles** : le 12/12 × 3 jours débloque **la Phase 2 (écriture guidée) + la badge
  « حامل المفتاح »**. Le **verso (المفتاح+)** n'est publié qu'après **noyau stable sur 3 types de
  questions différents** (= la badge « أمين الكنز »).
- **Fait (texte)** : fiche ك (`public/miftah.html` + `MiftahCard.tsx`) + `miftahSpec.ts`
  (`DRILL.goal`, `UNLOCK_RULE`) — verrouillé par `check:miftah`.
- **✅ Implémenté (code, 2026-09-06)** : `src/data/v3Progress.ts` — jours distincts
  (`applyDrillResult`, échec → intervalle +1 j, pas de reset) ; verso débloqué à 3 types
  maîtrisés (`recordTypeMastery` = stage 4 au seuil `passIcmThreshold`) ; flag legacy
  grandfatheré ; badges. Tests : `src/utils/__tests__/v3ProgressD1.test.ts` (16 tests).

### D2 — `استنتج` : le moteur suit la fiche (prérequis Phase 1)

- **Décision** : استنتج = 🎬 **فيلم** (parcours 1→2→3→4, la dent 3 = lien causal est requise).
- **Justification** : le contenu de l'app l'exige — les 20+ prompts « استنتج لماذا / معنى / دور »
  d'`activeLessons.ts` demandent une réponse raisonnée, et le propre `goodExample` de la carte
  moteur (« عن طريق تخريب بنيته الفراغية ») contient déjà un mécanisme causal. Le moteur (carte
  `verb_deduce_v1` classée `descriptive`, parcours 1→4) est l'outlier : tel quel, il sanctionnerait
  (`premature_interpretation`) exactement ce que le bac récompense. **La fiche ne change pas ;
  le moteur change.**
- **✅ Implémenté (code, 2026-09-06), spec d'implémentation** :
  1. `src/data/methodologyEngine.ts` — carte `verb_deduce_v1` : `category` descriptive →
     reasoned ; `VERB_V2_META.verb_deduce_v1` : `step3Mode:'explain'`, `path:[1,2,3,4]`,
     `typicalErrorTag:'unsupported_claim'`, `stepMap` à 4 entrées (longueur = `structureSteps`,
     qui devient 4 — ajouter la step du lien) ; `goodExample` ré-annoté sur 4 étapes si la
     suite de tests l'exige (connecteur causal explicite).
  2. `src/lib/validation/verbMapping.ts` — entrée `استنتج` : `synthesize`/loiFocus 5/
     `['TEXT_STRUCTURE']` → `interpret`/loiFocus 3/`['CAUSAL','LEVELS']` (aligné sur فسر).
  3. **Vérification** : invariants v2 (mode DEV) + `tests/boussole.test.ts` (boucle 12 verbes)
     + `npm run test:vitest` (verbMapping / practiceContextMapping).
- **État** : fiche, moteur (`verb_deduce_v1` + `VERB_V2_META` + scoreur + `verbMapping` +
  gabarits Boussole) alignés sur le film 1→2→3→4 — la fiche reste la référence.

### D3 — Protocole du test utilisateurs (10 élèves) — prêt à exécuter

- **But** : (1) rappel du nom d'usage + phrase-récit ; (2) valider les 12 consignes du drill
  **avant** production du pool ≥ 50 ; (3) vérifier que le drill mesure la règle, pas la
  mémorisation des 12 items.
- **Échantillon** : 10 élèves de bac SVT (3 en difficulté / 4 moyens / 3 « excellence »),
  20 min avec un enseignant. Données **agrégées** uniquement (pas de classement individuel).
- **T0 (20 min)** : (a) fiche montrée 1 min · (b) l'enseignant lit 1× le bloc ك + les 2 portes ·
  (c) drill des 12 consignes (4 exemples de la fiche + 8 tirées de la banque) — noter score/temps
  · (d) prononcer 1× la phrase-récit + le nom d'usage.
- **T+24 h (5 min, sans la fiche)** : ① « ما اسم المنهجية؟ » (attendu : المفتاح) ·
  ② reformuler la phrase-récit · ③ les 4 dents dans l'ordre · ④ classifier 3 consignes
  nouvelles (ورقة/رأس + صورة/فيلم) · ⑤ question libre : « ما أول ما تفعله قبل كتابة الإجابة؟ »
- **Seuils de décision** :

| Mesure | Seuil | Sinon |
|---|---|---|
| Nom d'usage rappelé | ≥ 8/10 | renommer ou re-tester le nom |
| Phrase-récit (± 1 mot) | ≥ 7/10 | alléger la phrase |
| 4 dents à T+24 h | 10/10 | renforcer l'animation Phase 0 |
| Drill T0 (moyenne) | ≥ 9/12 | réécrire les consignes |
| Classification T+24 h | ≥ 2/3 chez ≥ 8/10 | le drill n'automatise pas encore |
| T+24 h ≥ T0 sur les mêmes items | — | **mémorisation d'items → produire le pool ≥ 50 avant la Phase 1** |

- **Lien avec D1** : le test utilise la sémantique « 3 jours distincts » — les consignes du
  drill tournent d'un jour à l'autre (pas les mêmes 12 deux jours de suite).

### Ordre de dépendances (avant tout code moteur)

| # | Action | Statut 2026-09-06 |
|---|---|---|
| 0 | D1 — textes fiche + spec + garde-fou + code `v3Progress` | ✅ fait (textes + code) |
| 1 | D2 — `استنتج` (code) | ✅ fait — **prérequis Phase 1 levé** |
| 2 | D3 — test 10 élèves | ⏳ exécution par l'owner — valide les consignes avant le pool ≥ 50 |
| 3 | Builds app (Phase 0 → 4, mode examen) | ⏳ ordre complet : `docs/AUDIT_APPROCHE_APP.md` §6 |
