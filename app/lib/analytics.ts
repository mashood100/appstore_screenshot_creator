import { logEvent } from 'firebase/analytics';
import { getFirebaseAnalytics } from './firebase';

interface ScreenshotExportedParams {
  slide_type: string;
  device: string;
  theme: string;
  export_dimensions: string;
  locale: string;
}

interface ExportBatchParams {
  slide_count: number;
}

async function safeLogEvent(eventName: string, params?: Record<string, string | number>) {
  try {
    const analytics = await getFirebaseAnalytics();
    if (analytics) {
      logEvent(analytics, eventName, params);
    }
  } catch {
    // Silently ignore analytics errors so they never break the app
  }
}

export function logScreenshotExported(params: ScreenshotExportedParams) {
  safeLogEvent('screenshot_exported', { ...params });
}

export function logExportAllStarted(params: ExportBatchParams) {
  safeLogEvent('export_all_started', { ...params });
}

export function logExportAllCompleted(params: ExportBatchParams) {
  safeLogEvent('export_all_completed', { ...params });
}
