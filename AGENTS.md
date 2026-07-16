# Connect Mobile App Agent Guide

## Expo SDK Requirement

- Use Expo SDK 57 APIs and patterns rather than relying on behavior from earlier SDK versions.
- Prefer `bunx expo install <package>` when adding Expo or React Native dependencies so compatible versions are selected.
- Expo SDK 57 requires Node.js `22.13.x` or newer.

## Project Overview

This repository is an Expo and React Native mobile app named `Connect`.

- Expo SDK version: `57.0.4`
- React Native version: `0.86.0`
- React version: `19.2.3`
- TypeScript version: `6.0.3`
- Package manager: Bun
- App entry: `expo-router/entry`
- Navigation: Expo Router with typed routes and native tabs
- State: Zustand with MMKV-backed persistence
- Device data: `expo-contacts`
- React Compiler: enabled in `app.json`

## Architecture

- `src/app`: Expo Router routes and layouts. Route groups, nested layouts, and dynamic routes must follow Expo Router file-based conventions.
- `src/app/(tabs)`: Native tab layout and tab-owned screens for contacts, favorites, and profile.
- `src/features`: Domain-focused components, models, and services. Keep contacts and favorites behavior within their existing feature folders.
- `src/features/contacts/contacts-service.ts`: Contact permission and device-contact access. Keep direct `expo-contacts` transport logic in focused service modules rather than screens or presentation components.
- `src/components`: Reusable UI and application-wide shared components.
- `src/components/core-components`: Low-level shared UI primitives.
- `src/constants`: Shared colors, font values, images, strings, and barrel exports.
- `src/helpers`: Cross-feature pure helpers and reusable data transformations.
- `src/hooks`: Reusable React hooks and hook barrel exports.
- `src/store`: Zustand stores, actions, and persistence selection.
- `src/storage`: MMKV initialization and storage adapters.
- `src/themes`: Shared theme objects and text styles.
- `src/types`: Cross-feature application types when a type does not belong to a specific feature.
- `assets`: Fonts, icons, images, and Expo icon assets.
- `ios` and `android`: Generated native projects. They are ignored by Git and should be treated as high-impact build output unless a task explicitly requires native changes.

## Commands

- `bun install`: Install dependencies from `bun.lock`.
- `bun run start`: Start Metro for Expo Go or an installed development build.
- `bun run android`: Generate when necessary, build, and run the Android app.
- `bun run ios`: Generate when necessary, build, and run the iOS app.
- `bun run web`: Start the web app.
- `bun run lint`: Run Expo ESLint with the project flat configuration.
- `bun run format:check`: Check Prettier formatting.
- `bun run format`: Format supported project files with Prettier.
- `bunx tsc --noEmit`: Run TypeScript validation without emitting files.

## Clean Code Requirements

- Match the existing TypeScript, Expo, and React Native patterns.
- Keep changes focused and avoid unrelated refactors.
- Preserve user changes. Do not rewrite, revert, or reformat unrelated files.
- A single file should never have more than 1000 lines of code.
- Code should never repeat in multiple places without abstraction.
- Reuse existing constants, helpers, themes, components, hooks, store actions, service methods, and types before adding new ones.
- Avoid hardcoded colors, route names, permission text, storage keys, secrets, and repeated strings when existing constants or configuration values apply.
- Keep direct device and external-service access in feature service modules.
- Keep route screens focused on orchestration and composition rather than device transport or storage implementation details.
- Keep durable state changes inside Zustand actions and keep MMKV access behind the shared storage adapter.
- Persist only values that must survive launches. Do not persist derived data, temporary UI state, or store actions.
- Use external API payload and response keys exactly as provided. Do not normalize, rename, alias, or reshape external keys unless an explicit application model boundary requires it.
- Keep platform-specific behavior explicit with `Platform` checks and preserve behavior on unaffected platforms.

## Comments And File Organization

- Always add comments for functions.
- For file-scoped or local helper functions, use concise `//` comments.
- Example: `//function to find the first visible contact section`
- For custom, common, exported, or reusable functions, use JSDoc comments.
- Group file internals with spacing and concise `//` section comments.
- Group imports, constants, types, state, variables, store selectors/actions, hooks, handlers, effects, render helpers, styles, and exports where applicable.
- Keep groups readable and consistent with nearby files.
- File and folder names must describe the code they contain.

## Imports And Exports

- Group imports with blank lines and concise `//import ...` headers describing each non-empty group.
- Preferred import order: React, React Native, Expo, and third-party packages first; then `//import constants`, `//import components`, `//import hooks`, `//import store`, `//import helpers/services`, `//import assets`, and `//import types` as applicable.
- Do not add empty import group comments.
- Use the `@/` TypeScript alias for modules under `src` when importing across feature or folder boundaries.
- Use relative imports for closely related modules when that matches the surrounding folder pattern.
- Use barrel imports and exports whenever possible and applicable.
- Prefer existing `index.ts` files for grouped exports.
- Add or update barrel exports when introducing reusable modules and the surrounding folder already follows that pattern.
- Avoid creating barrel files for one-off modules that are not reused.
- Use `import type` for type-only imports.

## Expo, Native, And Secrets Safety

- Prefer Expo configuration in `app.json` and supported config plugins over direct native project edits.
- Consult the Expo SDK 57 documentation before using unstable APIs such as native tabs or changing platform configuration.
- Do not generate or commit `ios` or `android` unless the task explicitly requires native project files.
- Keep native changes minimal and task-driven when native editing is unavoidable.
- Do not commit `.env` files, access tokens, service credentials, signing keys, provisioning profiles, keystores, Pods, Gradle caches, build outputs, generated bundles, or local machine configuration.
- Keep contact permission text and other platform permission configuration in `app.json` or an appropriate config plugin.
- Preserve the configured application identifiers, URL scheme, EAS project ID, and platform icons unless the task explicitly changes them.

## Testing Expectations

- No Jest or other unit-test runner is currently configured. Do not claim automated unit-test coverage that the project cannot run.
- Add a test framework only when the task explicitly requires it or when its introduction is approved as part of the work.
- Run targeted checks for the files and behavior changed.
- Run `bunx tsc --noEmit` for TypeScript changes.
- Run `bun run lint` and `bun run format:check` before handoff when feasible.
- Treat existing lint findings separately from regressions introduced by the current task. Report them instead of silently changing unrelated code.
- For visible mobile UI, navigation, gestures, permissions, or platform behavior, validate the relevant flow in the installed development build with Argent when available.
- Verify both iOS and Android when changing shared platform behavior; otherwise test the affected platform and preserve the other platform's behavior.
- Documentation-only changes do not require app runtime tests.
