# Project Index: SanctissiMissa (Hello, Word)

Generated: 2026-02-16
Last Updated: 2026-02-16
Author: Robin L. M. Cheung, MBA
License: Copyright (C) 2025 - All rights reserved

## Project Structure

```
Hello-Word/
├── HelloWord/                  # React Native app (mobile + web entry)
│   ├── App.tsx                 # RN app entry component
│   ├── index.js                # RN native entry
│   ├── index.web.js            # RN web entry
│   ├── index.html              # Web HTML shell
│   ├── vite.config.ts          # HelloWord-level Vite config
│   ├── src/
│   │   ├── platforms/web/      # Web-specific RN components
│   │   │   ├── main.tsx        # Web bootstrap
│   │   │   └── ActualLiturgicalApp.tsx
│   │   ├── core/
│   │   │   ├── components/     # Core RN components (3 files)
│   │   │   │   ├── AppBar.tsx
│   │   │   │   ├── BottomNav.tsx
│   │   │   │   └── Card.tsx
│   │   │   └── theme/
│   │   │       ├── ThemeProvider.tsx
│   │   │       └── themeConfig.ts
│   │   └── __tests__/          # Jest tests (2 files)
├── src/                        # Shared core source
│   ├── api/                    # API layer
│   │   ├── liturgical.ts       # Native API client
│   │   └── liturgical.web.ts   # Web API client
│   ├── components/             # UI components (8 files)
│   │   ├── LiturgicalApp.tsx   # Main app component
│   │   ├── DatabaseImportProgress.tsx
│   │   ├── CalendarDashboard.tsx
│   │   ├── LiturgicalCalendar.tsx
│   │   ├── MassTexts.tsx
│   │   ├── SaintsInfo.tsx
│   │   ├── ParishDashboard.tsx
│   │   └── Journal.tsx
│   ├── core/
│   │   ├── services/           # Business logic (8 files)
│   │   │   ├── CalendarService.ts      # Kalendar parsing, date fetches
│   │   │   ├── DirectoriumService.ts   # Transfer rules, temporal assignments
│   │   │   ├── LiturgicalEngineService.ts  # Precedence/rank logic
│   │   │   ├── LiturgicalDatabaseImporter.ts # DB import service
│   │   │   ├── TextFileParserService.ts    # File format parsing
│   │   │   ├── TextParsingService.ts       # Text structure parsing
│   │   │   ├── dataManager.ts          # Data access layer
│   │   │   └── textService.ts          # Liturgical text management
│   │   ├── types/              # TypeScript types
│   │   │   ├── liturgical.ts   # Core domain types
│   │   │   └── services.ts    # Service interfaces
│   │   └── utils/
│   │       └── DateUtils.ts   # Date/liturgical calculations
│   ├── platforms/              # Platform abstraction
│   │   ├── storageFactory.ts  # Factory pattern
│   │   ├── web/
│   │   │   ├── StorageService.ts     # Dexie IndexedDB
│   │   │   └── webSqliteStorage.ts   # sql.js WASM
│   │   └── native/
│   │       └── sqliteStorage.ts      # react-native-sqlite-storage
│   └── shared/                 # Shared UI
│       ├── components/Button/
│       └── themes/             # Theme system (5 themes)
│           ├── ThemeProvider.tsx
│           ├── base.ts
│           ├── brutalist.ts
│           ├── liquidGlass.ts
│           ├── retro.ts
│           └── skeuomorphic.ts
├── liturgical-api/             # Express.js backend API
│   ├── server.js               # Express server entry
│   ├── liturgical-engine.js    # Core liturgical calculation engine
│   ├── setup-database.js       # DB initialization
│   └── test-api.js             # API tests
├── src-tauri/                  # Tauri 2.x desktop wrapper
│   ├── src/
│   │   ├── main.rs             # Rust entry
│   │   └── lib.rs              # Tauri commands (greet)
│   ├── Cargo.toml
│   └── tauri.conf.json         # App config: SanctissiMissa
├── public/                     # Static web assets
│   ├── service-worker.js       # PWA service worker
│   ├── sw.js                   # Workbox SW
│   ├── manifest.json           # PWA manifest
│   └── sql-wasm.wasm           # SQL.js WASM binary
├── data/                       # Knowledge graph data
│   ├── hkg-foundations/        # Hybrid Knowledge Graph foundation
│   │   ├── neo4j-entities.json
│   │   ├── neo4j-relations.json
│   │   ├── qdrant-documents.json
│   │   ├── postgres-audit-logs.json
│   │   └── uuid-mapping.json
│   └── word-network/           # Word relationship network
├── scripts/
│   └── setup_environment.sh
├── Docs/                       # Project documentation
│   ├── Architecture/           # Architecture snapshots
│   ├── Planning/               # PRD, conventions, features
│   ├── checklists/             # Session checklists
│   └── Examples/               # Reference HTML examples
├── docs/                       # Additional docs
│   ├── analysis/               # Code analysis reports
│   ├── architecture/           # API specs
│   ├── checklists/             # More checklists
│   └── hkg/                    # HKG installation docs
├── test-output/                # Generated test reports
├── index.html                  # Root web entry
├── vite.config.ts              # Root Vite config
├── tsconfig.json               # Root TypeScript config
├── tailwind.config.js          # TailwindCSS config
└── workbox-config.js           # PWA Workbox config
```

## Entry Points

| Platform | Entry File | Description |
|----------|------------|-------------|
| Web (Vite) | `index.html` | Root web entry via Vite |
| React Native | `HelloWord/index.js` | Native mobile entry |
| RN Web | `HelloWord/index.web.js` | React Native Web entry |
| Tauri Desktop | `src-tauri/src/main.rs` | Rust → sanctissimissa::run() |
| Liturgical API | `liturgical-api/server.js` | Express.js HTTP API |
| Tests | `HelloWord/__tests__/` | Jest unit/integration tests |

## Core Modules

### Services (`src/core/services/`)

| Service | Purpose |
|---------|---------|
| **CalendarService** | Fetches/parses Kalendar files from Divinum Officium GitHub |
| **DirectoriumService** | Transfer rules and temporal assignments |
| **LiturgicalEngineService** | Precedence/rank logic for feast/feria resolution |
| **LiturgicalDatabaseImporter** | Imports Divinum Officium database |
| **TextFileParserService** | Parses DO-format text files |
| **TextParsingService** | Structures liturgical text components |
| **dataManager** | Data access layer, coordinates storage |
| **textService** | Liturgical text management and lookup |

### Types (`src/core/types/liturgical.ts`)

Key interfaces:
- `LiturgicalSeason` enum (ADVENT, CHRISTMASTIDE, SEPTUAGESIMA, LENT, PASCHALTIDE, TIME_AFTER_PENTECOST)
- `BilingualText` - Latin/English text pairs
- `LiturgicalDay` - Calendar day info with rank, color, commemorations
- `VoiceNote` - Audio recording metadata
- `JournalEntry` - Personal journal entries
- `SaintInfo` / `MartyrologicalEntry` - Saint information
- `ParishInfo` / `ParishEvent` / `Newsletter` - Parish data
- `CachedLiturgicalData` - Cached liturgical content

### Platform Abstraction (`src/platforms/`)

```
storageFactory.ts
├── isBrowser? → WebStorageService (Dexie + IndexedDB)
└── native → NativeStorageService (react-native-sqlite-storage)
```

### Theme System (`src/shared/themes/`)

5 themes available:
- `base.ts` - Default theme
- `brutalist.ts` - Brutalist design
- `liquidGlass.ts` - Glass morphism
- `retro.ts` - Retro styling
- `skeuomorphic.ts` - Skeuomorphic design

## Configuration

| File | Purpose |
|------|---------|
| `package.json` (root) | Root dependencies, Tauri scripts |
| `HelloWord/package.json` | React Native dependencies |
| `liturgical-api/package.json` | Express API dependencies |
| `vite.config.ts` | Vite bundler config |
| `tsconfig.json` | TypeScript compiler options |
| `tailwind.config.js` | TailwindCSS/NativeWind |
| `workbox-config.js` | PWA service worker config |
| `src-tauri/tauri.conf.json` | Tauri 2.x desktop config |
| `src-tauri/Cargo.toml` | Rust dependencies |

## Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.1.0 | UI framework |
| react-native | ^0.80.1 | Mobile framework |
| react-native-web | ^0.20.0 | Web compatibility |
| vite | ^5/^6 | Web bundler |
| dexie | ^4.0.11 | IndexedDB wrapper |
| sql.js | ^1.13.0 | Browser SQLite (WASM) |
| sqlite3 | ^5.1.7 | Native SQLite |
| express | ^4.18.2 | API server |
| @tauri-apps/cli | ^2.10.0 | Desktop builds |

## Quick Start

```bash
# Web development (from root)
npm run dev                    # Vite dev server at :5173
npm run build                  # Production build

# React Native (from HelloWord/)
cd HelloWord && npm start      # Metro bundler
cd HelloWord && npm run ios    # iOS simulator
cd HelloWord && npm run android # Android

# Liturgical API
cd liturgical-api && npm start # Express API (port 3000)

# Tauri Desktop
npm run tauri:dev              # Dev with hot reload
npm run tauri:build            # Production build

# Testing
cd HelloWord && npm test       # Jest tests
```

## Documentation Map

| Document | Topic |
|----------|-------|
| `CLAUDE.md` | Claude Code instructions & constraints |
| `ARCHITECTURE.md` | System architecture overview |
| `ARCHITECTURE-DYNAMIC-LITURGICAL-CALENDAR.md` | Dynamic calendar design |
| `ARCHITECTURE-YEAR-AGNOSTIC-LITURGICAL-ENGINE.md` | Year-agnostic engine |
| `ROADMAP.md` | Feature roadmap |
| `COMPREHENSIVE_SCHEMA_DOCUMENTATION.md` | Database schema |
| `liturgical-api/LITURGICAL_API_DOCUMENTATION.md` | API reference |
| `liturgical-api/HYBRID_KNOWLEDGE_GRAPH_DOCUMENTATION.md` | HKG architecture |

## File Counts

| Category | Count |
|----------|-------|
| Source (TS/TSX) | ~35 files |
| Services | 8 files |
| Components | 11 files |
| Tests | 2 files |
| Rust (Tauri) | 2 files |
| JS (liturgical-api) | 4 files |
| Documentation (MD) | ~80 files |
| Data (JSON) | 10 files |

## Known Issues

| Issue | Location | Notes |
|-------|----------|-------|
| Merge conflicts | `src/core/types/liturgical.ts` | Unresolved |
| CLI missing | Report command | See CLAUDE.md for fix |

## Development Constraints

- **NO placeholder data** - Calculate on-demand, cache only what's used
- **Match divinumofficium.com exactly** - Any mismatch is a blocker
- **Clean room implementation** - No direct copying from reference
- **Offline-first architecture** - SQLite/IndexedDB storage
- **Tauri 2.x** - Desktop builds use Tauri 2.10+

## Token Efficiency

**Reading this index**: ~3K tokens vs full codebase (~60K tokens) = **95% reduction**

---

*This index is auto-generated. Update when project structure changes significantly.*
