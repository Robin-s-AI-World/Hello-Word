import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import reactNativeWeb from 'vite-plugin-react-native-web';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Shared aliases for both web and native
const sharedAliases = {
  // Core shared code
  '@core': resolve(__dirname, 'src/core'),
  '@platforms': resolve(__dirname, 'src/platforms'),
  // Platform-specific overrides
  '@components': resolve(__dirname, 'src/platforms/web/components'),
  // React Native Web compatibility
  'react-native': 'react-native-web',
  // Root src alias
  '@': resolve(__dirname, 'src'),
  // HelloWord src alias for legacy imports
  '@helloword': resolve(__dirname, 'HelloWord/src'),
};

export default defineConfig({
  root: __dirname,
  publicDir: resolve(__dirname, 'public'),
  plugins: [
    react({
      // Use the new JSX runtime
      jsxRuntime: 'automatic',
      // Babel configuration for web
      babel: {
        plugins: [
          // Removed nativewind/babel and react-native-reanimated/plugin for web build
        ],
      },
    }),
    reactNativeWeb({
      // Enable React Native Web optimizations
      removeConsole: process.env.NODE_ENV === 'production',
    }),
  ],
  resolve: {
    alias: Object.entries({
      ...sharedAliases,
      // Browser polyfills for Node.js modules
      'fs': 'browserfs/dist/shims/fs.js',
      'path': 'browserfs/dist/shims/path.js',
      'crypto': 'crypto-browserify',
      'stream': 'stream-browserify',
      'util': 'util',
      'process': 'process/browser',
      'buffer': 'buffer',
      'events': 'events'
    }).map(([find, replacement]) => ({
      find,
      replacement,
    })),
    extensions: [
      // Platform-specific extensions
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      // Standard React Native extensions
      '.native.tsx',
      '.native.ts',
      '.native.jsx',
      '.native.js',
      // Standard extensions
      '.mjs',
      '.js',
      '.ts',
      '.jsx',
      '.tsx',
      '.json',
    ],
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/src-tauri/**',
        '**/android/**',
        '**/ios/**',
        '**/.git/**',
        '**/Docs/**',
        '**/assets/liturgical-data/**',
      ],
    },
  },
  define: {
    'process.env': {},
    global: 'globalThis',
    __DEV__: process.env.NODE_ENV !== 'production',
    'import.meta.env.VITE_BUILD_TIME': JSON.stringify(process.env.VITE_BUILD_TIME || String(Math.floor(Date.now() / 1000)))
  },
  optimizeDeps: {
    include: ['react-native-web', 'dexie', 'sql.js'],
    esbuildOptions: {
      // Fix for react-native-web
      resolveExtensions: ['.web.js', '.js', '.ts', '.tsx'],
      // Enable ES modules
      mainFields: ['module', 'main'],
      // Add support for JSX
      loader: { '.js': 'jsx' },
      // Define Node.js globals for browser
      define: {
        global: 'globalThis',
        process: 'process',
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: [
        'react-native-sqlite-storage',
        'react-native-fs', 
        '@react-native-async-storage/async-storage'
      ],
      output: {
        globals: {
          'react-native-sqlite-storage': 'ReactNativeSqliteStorage',
          'react-native-fs': 'ReactNativeFS',
          '@react-native-async-storage/async-storage': 'AsyncStorage'
        }
      }
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  }
});
