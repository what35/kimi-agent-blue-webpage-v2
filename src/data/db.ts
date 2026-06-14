/**
 * ============================================================
 * Data Layer — localStorage persistence abstraction
 * ============================================================
 * This file serves as the "database" layer of the application.
 * All storage operations go through here, so the rest of the app
 * doesn't need to know whether data is stored in localStorage,
 * IndexedDB, or a remote server.
 *
 * Architecture:
 *   UI Layer     → React components (sections/, components/)
 *   Logic Layer  → Context + Hooks (context/, hooks/)
 *   Data Layer   → This file — storage I/O abstraction
 * ============================================================
 */

import { SITE_DATA as defaultData } from './siteData';
import type { SiteData } from './siteData';

const STORAGE_KEY = 'dt1998_site_data';
const PASSWORD_KEY = 'dt1998_admin_password';
const DEFAULT_PASSWORD = 'dt1998';

/** Load site data from persistent storage */
export function loadSiteData(): SiteData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with defaults to handle schema upgrades
      return mergeWithDefaults(parsed);
    }
  } catch (e) {
    console.warn('[DB] Failed to load data, using defaults:', e);
  }
  return { ...defaultData };
}

/** Save site data to persistent storage */
export function saveSiteData(data: SiteData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('[DB] Failed to save data:', e);
    // localStorage quota exceeded — could fall back to IndexedDB here
  }
}

/** Reset to factory defaults */
export function resetSiteData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/** Get stored admin password */
export function getAdminPassword(): string {
  try {
    return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
  } catch {
    return DEFAULT_PASSWORD;
  }
}

/** Set new admin password */
export function setAdminPassword(password: string): void {
  try {
    localStorage.setItem(PASSWORD_KEY, password);
  } catch (e) {
    console.error('[DB] Failed to save password:', e);
  }
}

/** Merge stored data with schema defaults (handles new fields) */
function mergeWithDefaults(stored: Partial<SiteData>): SiteData {
  return {
    ...defaultData,
    ...stored,
    profile: {
      ...defaultData.profile,
      ...stored.profile,
      brand: { ...defaultData.profile.brand, ...stored.profile?.brand },
    },
    tools: stored.tools ?? defaultData.tools,
    ideas: stored.ideas ?? defaultData.ideas,
    foodSpots: stored.foodSpots ?? defaultData.foodSpots,
    contact: { ...defaultData.contact, ...stored.contact },
  };
}
