# 🐱 CatApp — Waracle Tech Test

A production-quality React Native (Expo) app that integrates with [The Cat API](https://thecatapi.com).

## Tech Stack

| Concern          | Library                       |
| ---------------- | ----------------------------- |
| Framework        | Expo SDK 51 + Expo Router     |
| Language         | TypeScript (strict)           |
| State Management | Zustand + Immer               |
| List Rendering   | @shopify/FlashList            |
| Icons            | @expo/vector-icons (Ionicons) |
| Navigation       | Expo Router (file-based)      |
| Testing          | Jest + React Testing Library  |

## Architecture: Atomic Design

```
components/
├── ui/          # AppText, AppView, AppButton, IconButton, ScoreBadge, Divider
├── shared/      # VoteControls, ErrorBanner, EmptyState, ImagePickerButton
├── layouts/      # CatCard, CatGrid, AppHeader
└── templates/      # (reserved for full-screen layouts)
```

## Folder Structure

```
CatApp-Waracle/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout (providers, global error)
│   ├── index.tsx           # "/" — Cat gallery
│   └── upload.tsx          # "/upload" — Upload screen
├── components/
│   ├── ui/              # Base UI primitives
│   ├── shared/          # Composed UI units
│   └── layouts/          # Feature-level components
├── constants/
│   ├── colors.ts           # 🎨 Global color palette (primary: #f93b02)
│   ├── theme.ts            # Typography, spacing, shadows
│   └── api.ts              # Base URL, API key, page size
├── hooks/
│   ├── useImagePicker.ts   # Image library access
│   └── useDebounce.ts      # Debounce utility
├── services/
│   └── catApi.ts           # All API calls (typed)
├── stores/
│   ├── catStore.ts         # Images, votes, favourites + pagination
│   └── uploadStore.ts      # Upload flow state
├── types/
│   └── index.ts            # Shared TypeScript types
└── __tests__/
    ├── components/         # Atom/molecule unit tests
    ├── hooks/              # Hook tests
    ├── services/           # API service tests
    └── stores/             # Zustand store tests
```

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator / Android Emulator or Expo Go app

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Add the Cat API logo
# Download https://thatapicompany.com/wp-content/uploads/2025/05/theCatAPI-A-1.png
# Save as: assets/logo.png

# 3. Start the development server
npx expo start

# 4. Open on device
# Press 'i' for iOS simulator, 'a' for Android emulator
# Or scan QR code with Expo Go
```

### Running Tests

```bash
# Run all tests
npm test

# With coverage report
npm run test:coverage

# Type checking
npm run typecheck
```

## Features Implemented

### ✅ Requirement 1 — Upload (`/upload`)

- Image picker with permission handling
- Validates file type (jpg, png, gif, webp)
- Uploads to `/images/upload` API
- Displays API + validation errors inline
- Redirects to `/` on success

### ✅ Requirement 2 — Cat Gallery (`/`)

- Responsive grid: up to 4 columns based on screen width
- Scales to 340px viewport
- FlashList for performant lazy rendering
- Infinite scroll pagination (page-based, 12 per page)
- Pull-to-refresh

### ✅ Requirement 3 — Favouriting

- Heart button overlay on each cat image
- Filled ❤️ = favourited, outline 🤍 = not favourited
- Optimistic updates with rollback on error
- Calls `POST /favourites` / `DELETE /favourites/:id`

### ✅ Requirement 4 — Voting

- Up/down arrow buttons below each image
- Toggles vote off if same direction clicked again
- Switches vote if opposite direction clicked
- Optimistic updates with rollback

### ✅ Requirement 5 — Scoring

- Score = upvotes − downvotes
- Colour-coded badge: green (positive), red (negative), grey (zero)

## Design System

### Colours

```ts
primary: "#f93b02"; // Waracle orange-red
voteUp: "#22c55e"; // Green
voteDown: "#ef4444"; // Red
heartActive: "#ef4444"; // Red
```

### Component Hierarchy

All base components accept themed props — no raw strings:

```tsx
<AppText variant="h2" color="primary">Hello</AppText>
<AppView bg="surface" rounded="lg" shadow="md" p={16}>
  <AppButton variant="primary" label="Upload" />
</AppView>
```

## API Integration Notes

The Cat API requires an API key (`x-api-key` header) for all requests. The key is stored in `constants/api.ts`. In production you'd load this from an environment variable via `expo-constants`.

The `/images` endpoint returns only images uploaded by the API key owner (i.e. your uploads). Votes and favourites are also scoped per API key.
