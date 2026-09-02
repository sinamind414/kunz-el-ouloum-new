# SPEC BOUSSOLE NSOE — كوكبة النظام

## Lot 1: Fichiers à créer

### src/components/CompassRose.tsx
- Rose des vents animée avec aiguille qui tourne
- Labels NORDE → SUD → OUEST → EST en arabe
- Animation au changement de cap

### src/data/methodologyVerbs.ts (mise à jour)
- Mapping verbes → caps
- 12 verbes avec cap dominant

## Lot 2: Fichiers à modifier

### src/App.tsx
- Renommer "المحاكي" → "بوصلة NSOE"
- Tab terminology: "المراحل الأربعة" → "الشمال، الجنوب، الغرب، الشرق"
- Afficher rose des vents en haut

### src/components/MethodologyCompilerView.tsx
- Tab "محاكي التدريب" → "بوصلة NSOE"
- Renommer les 4 stades:
  - 1. Modelage → "الشمال: انظرْ"
  - 2. Complétion → "الجنوب: اجمعْ"
  - 3. Production guidée → "الغرب: اغصْ"
  - 4. Bac → "الشرق: أشرقْ"
- ICM → "علامة الملاحة"
- Matrice → "خريطة الرياح"

## Lot 3: Points de vigilance
- Texte arabe fourni dans conception_boussole_NSOE.html
- Aucun changement du moteur de score