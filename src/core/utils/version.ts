/**
 * Version utility - reads version info from version.json
 * Copyright (C) 2025 Robin L. M. Cheung, MBA. All rights reserved.
 */

export interface VersionInfo {
  version: string;
  versionBase: string;
  buildNumber: string;
  buildDate: string;
  productName: string;
  internalName: string;
}

// Default version info (fallback if version.json fails to load)
const DEFAULT_VERSION: VersionInfo = {
  version: '0.1a-00000',
  versionBase: '0.1a',
  buildNumber: '00000',
  buildDate: new Date().toISOString(),
  productName: 'Hello-Word',
  internalName: 'SanctissiMissa',
};

let cachedVersion: VersionInfo | null = null;

/**
 * Get the current version info
 * In production, this reads from the bundled version.json
 * In development, returns default values
 */
export function getVersionInfo(): VersionInfo {
  if (cachedVersion) {
    return cachedVersion;
  }

  try {
    // @ts-ignore - TypeScript doesn't understand dynamic JSON imports
    const versionData = require('../../version.json');
    cachedVersion = versionData as VersionInfo;
    return cachedVersion!;
  } catch {
    // If version.json doesn't exist or fails to load, use defaults
    console.warn('version.json not found, using default version');
    return DEFAULT_VERSION;
  }
}

/**
 * Get the full version string (e.g., "0.1a-46239")
 */
export function getFullVersion(): string {
  return getVersionInfo().version;
}

/**
 * Get just the build number (e.g., "46239")
 */
export function getBuildNumber(): string {
  return getVersionInfo().buildNumber;
}

/**
 * Get the product name (e.g., "Hello-Word")
 */
export function getProductName(): string {
  return getVersionInfo().productName;
}

/**
 * Get the internal app name (e.g., "SanctissiMissa")
 */
export function getInternalName(): string {
  return getVersionInfo().internalName;
}

/**
 * Get formatted version for display
 * Format: "v0.1a-46239"
 */
export function getDisplayVersion(): string {
  return `v${getFullVersion()}`;
}

/**
 * Get build date formatted for display
 */
export function getBuildDateFormatted(): string {
  const info = getVersionInfo();
  try {
    const date = new Date(info.buildDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return info.buildDate;
  }
}

/**
 * Generate the filename for distributable builds
 * Format: Hello-Word-0.1a-XXXXX.{ext}
 */
export function getDistFilename(extension: string): string {
  const info = getVersionInfo();
  return `${info.productName}-${info.version}.${extension}`;
}

export default {
  getVersionInfo,
  getFullVersion,
  getBuildNumber,
  getProductName,
  getInternalName,
  getDisplayVersion,
  getBuildDateFormatted,
  getDistFilename,
};
