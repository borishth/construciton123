# Separate Styles from Component Logic

## Goal
Make the codebase clean and professional by extracting all `StyleSheet.create()` blocks into dedicated style files under a `styles/` directory. Each screen file will only contain component logic (imports, state, handlers, JSX).

## Proposed Structure
```
app/
├── (main)/
│   ├── _layout.tsx        ← logic only
│   ├── index.tsx           ← logic only
│   ├── inspections-tab.tsx ← logic only
│   ├── service-tab.tsx     ← logic only
│   ├── yolo-scanner.tsx    ← logic only
│   └── performance.tsx     ← logic only
├── start-inspection.tsx    ← logic only
├── service-request.tsx     ← logic only
├── checklists.tsx          ← logic only
├── reports.tsx             ← logic only
├── inspections.tsx         ← logic only
├── service.tsx             ← logic only
├── (auth)/login.tsx        ← logic only
styles/
├── main/
│   ├── layout.styles.ts
│   ├── home.styles.ts
│   ├── inspections-tab.styles.ts
│   ├── service-tab.styles.ts
│   ├── yolo-scanner.styles.ts
│   └── performance.styles.ts
├── start-inspection.styles.ts
├── service-request.styles.ts
├── checklists.styles.ts
├── reports.styles.ts
├── inspections.styles.ts
├── service.styles.ts
└── login.styles.ts
```

## Skipped Files (too small to split)
- [notifications.tsx](file:///f:/DigiQC/DigiQC-mobile/app/notifications.tsx) (~3 styles)
- [ai-assistant.tsx](file:///f:/DigiQC/DigiQC-mobile/app/ai-assistant.tsx) (~3 styles)

## Pattern
Each style file will export a single `styles` object:
```ts
// styles/main/home.styles.ts
import { StyleSheet, Dimensions } from 'react-native';
const { width: SW } = Dimensions.get('window');
export const styles = StyleSheet.create({ ... });
```

Each screen file will import it:
```ts
// app/(main)/index.tsx
import { styles } from '@/styles/main/home.styles';
```

## Verification
- Run `npx expo start` and verify all screens render identically
- No visual changes — purely a code organization refactor
