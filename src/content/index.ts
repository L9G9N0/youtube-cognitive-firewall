/**
 * Content Script Injection
 * Directly runs inside YouTube tabs. Uses MutationObservers to hide distracting
 * layout modules (comments, recommendations) and filter clickbait titles/thumbnails.
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
}

class CognitiveFirewall {
  private settings: FirewallSettings | null = null;
  private observer: MutationObserver | null = null;
  private cssElement: HTMLStyleElement | null = null;

  constructor() {
    this.init();
  }

  private init() {
    console.log("[CognitiveFirewall] Initializing client injection script...");
    
    // Retrieve settings configuration from background coordinator
    chrome.runtime.sendMessage({ action: "QUERY_STATE" }, (response: any) => {
      if (response && response.status === "success") {
        this.settings = response.settings;
        this.applyFirewallRules();
      } else {
        console.error("[CognitiveFirewall] Failed to retrieve firewall settings.");
      }
    });

    // Listen to live configuration updates in storage
    chrome.storage.onChanged.addListener((changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === "sync" && changes.settings) {
        this.settings = changes.settings.newValue as FirewallSettings;
        this.applyFirewallRules();
      }
    });
  }

  private applyFirewallRules() {
    if (!this.settings) return;
    
    // Establish styling rules overrides inside document head
    this.injectCustomStyles();
    
    // Start DOM Mutation Observer to capture lazily-loaded dynamic modules
    this.startDomObserver();
    
    // Run an initial sweep of existing page nodes
    this.executeFilterSweep();
  }

  private injectCustomStyles() {
    if (this.cssElement) {
      this.cssElement.remove();
    }
    
    const cssRules: string[] = [];
    const s = this.settings;
    
    if (s?.shields.hideComments) {
      // YouTube comments section selectors
      cssRules.push("ytd-comments, #comments, #sections.ytd-comments-header-renderer { display: none !important; }");
    }
    
    if (s?.shields.hideRecommendations) {
      // Recommendations sidebar selectors (video detail page)
      cssRules.push("#secondary, ytd-watch-next-secondary-results-renderer { display: none !important; }");
    }
    
    if (s?.shields.hideHomeFeed) {
      // YouTube home page feed container selectors
      cssRules.push("ytd-browse[page-subtype='home'] { display: none !important; }");
    }
    
    if (s?.clickbait.enabled && s.clickbait.blurThumbnails) {
      // Blurs thumbnails across grids and recommendations
      cssRules.push("ytd-thumbnail img, .ytp-videowall-still-image, .style-scope.ytd-moving-thumbnail-renderer { filter: blur(10px) grayscale(80%) !important; transition: filter 0.3s ease !important; }");
      cssRules.push("ytd-thumbnail:hover img, .ytp-videowall-still-image:hover { filter: none !important; }");
    }
    
    this.cssElement = document.createElement("style");
    this.cssElement.textContent = cssRules.join("\n");
    document.head.appendChild(this.cssElement);
    console.log("[CognitiveFirewall] Dynamic CSS styling rules injected.");
  }

  private startDomObserver() {
    if (this.observer) {
      this.observer.disconnect();
    }
    
    // Observe DOM node modifications to scrub clickbait on scrolling
    this.observer = new MutationObserver((mutations) => {
      let shouldCheck = false;
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          shouldCheck = true;
          break;
        }
      }
      if (shouldCheck) {
        this.executeFilterSweep();
      }
    });
    
    this.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    
    console.log("[CognitiveFirewall] DOM MutationObserver initiated.");
  }

  private executeFilterSweep() {
    const s = this.settings;
    if (!s || !s.clickbait.enabled || s.clickbait.titleBlacklist.length === 0) return;
    
    // Select video title nodes (supports home grid, sidebars, search items)
    const titleElements = document.querySelectorAll(
      "#video-title, #video-title-link, .yt-core-attributed-string--link-inherit, h3.title-and-status-span"
    );
    
    titleElements.forEach((el) => {
      const titleText = el.textContent?.toLowerCase() || "";
      
      const containsBlacklistedWord = s.clickbait.titleBlacklist.some((word) => 
        titleText.includes(word.toLowerCase())
      );
      
      if (containsBlacklistedWord) {
        // Trace ancestor to find target card container to hide completely
        const cardContainer = el.closest(
          "ytd-rich-item-renderer, ytd-video-renderer, ytd-compact-video-renderer, ytd-grid-video-renderer"
        ) as HTMLElement;
        
        if (cardContainer && cardContainer.style.display !== "none") {
          cardContainer.style.display = "none";
          console.log(`[CognitiveFirewall] Clickbait filtered (Blocked title: "${el.textContent?.trim()}")`);
        }
      }
    });
  }

  public destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.cssElement) {
      this.cssElement.remove();
    }
  }
}

// Launch the Firewall injection
const firewallInstance = new CognitiveFirewall();

// Handle tab unload
window.addEventListener("unload", () => {
  firewallInstance.destroy();
});
