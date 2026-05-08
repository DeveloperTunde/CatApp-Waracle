# CatApp - Waracle Tech Test

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
├── app/                          # Expo Router screens (must stay at root)
│   ├── _layout.tsx               # Root layout - QueryClient, SafeArea, error banner
│   ├── index.tsx                 # "/" - Cat gallery with FAB
│   └── upload.tsx                # "/upload" - Image upload screen
│
├── src/                          # All application source code
│   ├── components/
│   │   ├── ui/                   # UI - base design system primitives
│   │   ├── shared/               # Shared - reusable composed components
│   │   └── layouts/              # Layouts - feature-level components
│   ├── constants/
│   │   ├── colors.ts             # Global colour palette (primary: #f93b02)
│   │   ├── theme.ts              # Typography, spacing, border radius, shadows
│   │   └── api.ts                # Endpoints and page size
│   ├── hooks/
│   │   ├── useCatQueries.ts      # All TanStack Query hooks + mutations
│   │   ├── useImagePicker.ts     # Expo image picker with permission handling
│   │   └── useDebounce.ts        # Generic debounce hook
│   ├── services/
│   │   └── catApi.ts             # Axios client + all typed API functions
│   ├── stores/
│   │   ├── catStore.ts           # Zustand store - images, votes, favourites
│   │   └── uploadStore.ts        # Zustand store - upload flow state
│   ├── types/
│   │   └── index.ts              # Shared TypeScript interfaces
│   └── utils/                    # Helper/utility functions
│
├── assets/                       # App icon, splash, logo
│
├── __tests__/
│   ├── components/               # UI component tests
│   ├── hooks/                    # Hook unit tests
│   ├── services/                 # API service tests
│   └── stores/                   # Zustand store tests
│
├── .env.local                    # Local environment variables (git-ignored)
├── app.json                      # Expo config
├── babel.config.js               # Path aliases + Reanimated plugin
├── tsconfig.json                 # Strict TypeScript + path aliases
└── package.json
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

# You can also run this instead for dependency compactibility
npm install --legacy-peer-deps

# 2. Start the development server
npx expo start

# 3. Adding this for Testing Purposes and since this is not a production App
- create a .env.local file in the root of the project and the following

EXPO_PUBLIC_CAT_API_KEY=live_N5JEAmGHbOWfHLgcag5X9SM4gbr6DZ6xD4tKoA1g7GMAwDZAYCbghbUMhODPtazh
EXPO_PUBLIC_CAT_API_BASE_URL=https://api.thecatapi.com/v1


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

### ✅ Requirement 1 - Upload (`/upload`)

- Image picker with permission handling
- Validates file type (jpg, png, gif, webp)
- Uploads to `/images/upload` API
- Displays API + validation errors inline
- Redirects to `/` on success

### ✅ Requirement 2 - Cat Gallery (`/`)

- Responsive grid: up to 4 columns based on screen width
- Scales to 340px viewport
- FlashList for performant lazy rendering
- Infinite scroll pagination (page-based, 12 per page)
- Pull-to-refresh

### ✅ Requirement 3 - Favouriting

- Heart button overlay on each cat image
- Filled ❤️ = favourited, outline 🤍 = not favourited
- Optimistic updates with rollback on error
- Calls `POST /favourites` / `DELETE /favourites/:id`

### ✅ Requirement 4 - Voting

- Up/down arrow buttons below each image
- Toggles vote off if same direction clicked again
- Switches vote if opposite direction clicked
- Optimistic updates with rollback

### ✅ Requirement 5 - Scoring

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

All base components accept themed props-no raw strings:

```tsx
<AppText variant="h2" color="primary">Hello</AppText>
<AppView bg="surface" rounded="lg" shadow="md" p={16}>
  <AppButton variant="primary" label="Upload" />
</AppView>
```

## API Integration Notes

The Cat API requires an API key (`x-api-key` header) for all requests. The key is stored in `constants/api.ts`. In production you'd load this from an environment variable via `expo-constants`.

The `/images` endpoint returns only images uploaded by the API key owner (i.e. your uploads). Votes and favourites are also scoped per API key.
