/**
 * Background Service Worker
 * Coordinates persistent state configuration, tracks user active session timers,
 * and responds to incoming runtime event queries.
 */

interface FirewallSettings {
  shields: {
    hideComments: boolean;
    hideRecommendations: boolean;
    hideHomeFeed: boolean;
    disableAutoplay: boolean;
  };
  clickbait: {
    enabled: boolean;
    blurThumbnails: boolean;
    titleBlacklist: string[];
  };
  quota: {
    enabled: boolean;
    maxDailyMinutes: number;
    currentSecondsUsed: number;
    lastResetTimestamp: number;
  };
}

const DEFAULT_SETTINGS: FirewallSettings = {
  shields: {
    hideComments: true,
    hideRecommendations: true,
    hideHomeFeed: false,
    disableAutoplay: true
  },
  clickbait: {
    enabled: true,
    blurThumbnails: true,
    titleBlacklist: ["shocking", "unbelievable", "gone wrong", "will blow your mind", "click here"]
  },
  quota: {
    enabled: false,
    maxDailyMinutes: 30,
    currentSecondsUsed: 0,
    lastResetTimestamp: Date.now()
  }
};

// ==========================================================================
// Lifecycle Install Coordinator
// ==========================================================================
chrome.runtime.onInstalled.addListener((details: chrome.runtime.InstalledDetails) => {
  console.log("[Background] Service worker active. Installed reason:", details.reason);
  
  // Set default configurations on storage creation
  chrome.storage.sync.get("settings", (result: { [key: string]: any }) => {
    if (!result.settings) {
      chrome.storage.sync.set({ settings: DEFAULT_SETTINGS }, () => {
        console.log("[Background] Default firewall configurations initialized.");
      });
    }
  });
});

// ==========================================================================
// Message Coordinator (QUERY_STATE, RESET_TIMER)
// ==========================================================================
chrome.runtime.onMessage.addListener((message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void) => {
  const { action } = message;
  console.log(`[Background] Received request '${action}' from origin:`, sender.tab?.url || "popup");
  
  if (action === "QUERY_STATE") {
    chrome.storage.sync.get("settings", (result: { [key: string]: any }) => {
      const settings = result.settings || DEFAULT_SETTINGS;
      sendResponse({ status: "success", settings });
    });
    return true; // Keeps sendResponse active asynchronously
  }
  
  if (action === "RESET_TIMER") {
    chrome.storage.sync.get("settings", (result: { [key: string]: any }) => {
      const settings = result.settings || DEFAULT_SETTINGS;
      if (settings.quota) {
        settings.quota.currentSecondsUsed = 0;
        settings.quota.lastResetTimestamp = Date.now();
        chrome.storage.sync.set({ settings }, () => {
          console.log("[Background] Session timer reset successfully.");
          sendResponse({ status: "success", settings });
        });
      }
    });
    return true;
  }
  
  // Unknown actions
  sendResponse({ status: "error", message: `Unsupported request type: ${action}` });
});
