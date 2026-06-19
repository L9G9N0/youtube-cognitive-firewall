import { useState, useEffect } from 'react';
import './App.css';

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
  }
};

function App() {
  const [settings, setSettings] = useState<FirewallSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');
  const [useExtensionStorage, setUseExtensionStorage] = useState(false);

  // Load configuration settings
  useEffect(() => {
    const hasChromeStorage = !!(typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync);
    setUseExtensionStorage(hasChromeStorage);

    if (hasChromeStorage) {
      chrome.storage.sync.get("settings", (result: { [key: string]: any }) => {
        if (result.settings) {
          setSettings(result.settings);
        } else {
          // Initialize default storage values
          chrome.storage.sync.set({ settings: DEFAULT_SETTINGS });
        }
        setIsLoaded(true);
      });
    } else {
      // Local development mock fallback
      const localData = localStorage.getItem("mock_settings");
      if (localData) {
        setSettings(JSON.parse(localData));
      }
      setIsLoaded(true);
    }
  }, []);

  // Save updates helper
  const saveSettings = (updated: FirewallSettings) => {
    setSettings(updated);
    if (useExtensionStorage) {
      chrome.storage.sync.set({ settings: updated }, () => {
        console.log("[FirewallPopup] Configurations saved to Chrome Sync.");
      });
    } else {
      localStorage.setItem("mock_settings", JSON.stringify(updated));
    }
  };

  // Switch toggle actions
  const handleShieldToggle = (key: keyof FirewallSettings['shields']) => {
    const updated = {
      ...settings,
      shields: {
        ...settings.shields,
        [key]: !settings.shields[key]
      }
    };
    saveSettings(updated);
  };

  const handleClickbaitToggle = (key: keyof FirewallSettings['clickbait']) => {
    const updated = {
      ...settings,
      clickbait: {
        ...settings.clickbait,
        [key]: !settings.clickbait[key]
      }
    };
    saveSettings(updated);
  };

  // Keyword Blacklist utilities
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanWord = newKeyword.trim().toLowerCase();
    if (cleanWord && !settings.clickbait.titleBlacklist.includes(cleanWord)) {
      const updated = {
        ...settings,
        clickbait: {
          ...settings.clickbait,
          titleBlacklist: [...settings.clickbait.titleBlacklist, cleanWord]
        }
      };
      saveSettings(updated);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (wordToRemove: string) => {
    const updated = {
      ...settings,
      clickbait: {
        ...settings.clickbait,
        titleBlacklist: settings.clickbait.titleBlacklist.filter(w => w !== wordToRemove)
      }
    };
    saveSettings(updated);
  };

  if (!isLoaded) {
    return (
      <div className="popup-loading">
        <div className="spinner"></div>
        <span>Loading Firewall rules...</span>
      </div>
    );
  }

  return (
    <div className="popup-container">
      {/* Header */}
      <header className="popup-header">
        <div className="logo-section">
          <svg className="firewall-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <div className="logo-text">
            <h2>Cognitive Firewall</h2>
            <span className="platform-tag">YouTube Shield</span>
          </div>
        </div>
        {!useExtensionStorage && (
          <span className="dev-badge" title="Running in simulated local mock storage">Simulated</span>
        )}
      </header>

      {/* Content panel */}
      <main className="popup-body">
        {/* Category Section: Distraction Shields */}
        <section class-name="settings-section">
          <h3>Distraction Shields</h3>
          <div className="controls-list">
            <label className="switch-row">
              <div className="control-meta">
                <span className="control-title">Block Comments</span>
                <span className="control-desc">Hides the comment section under videos</span>
              </div>
              <div className="switch-wrapper">
                <input
                  type="checkbox"
                  checked={settings.shields.hideComments}
                  onChange={() => handleShieldToggle('hideComments')}
                />
                <span className="slider"></span>
              </div>
            </label>

            <label className="switch-row">
              <div className="control-meta">
                <span className="control-title">Hide Recommendation Sidebar</span>
                <span className="control-desc">Blocks related video sidebar suggestions</span>
              </div>
              <div className="switch-wrapper">
                <input
                  type="checkbox"
                  checked={settings.shields.hideRecommendations}
                  onChange={() => handleShieldToggle('hideRecommendations')}
                />
                <span className="slider"></span>
              </div>
            </label>

            <label className="switch-row">
              <div className="control-meta">
                <span className="control-title">Block Homepage Feed</span>
                <span className="control-desc">Blocks infinite home feeds scroll</span>
              </div>
              <div className="switch-wrapper">
                <input
                  type="checkbox"
                  checked={settings.shields.hideHomeFeed}
                  onChange={() => handleShieldToggle('hideHomeFeed')}
                />
                <span className="slider"></span>
              </div>
            </label>
          </div>
        </section>

        {/* Category Section: Clickbait Filter */}
        <section className="settings-section">
          <h3>Clickbait Filters</h3>
          <div className="controls-list">
            <label className="switch-row">
              <div className="control-meta">
                <span className="control-title">Enable Filters</span>
                <span className="control-desc">Scrub target clickbait nodes from lists</span>
              </div>
              <div className="switch-wrapper">
                <input
                  type="checkbox"
                  checked={settings.clickbait.enabled}
                  onChange={() => handleClickbaitToggle('enabled')}
                />
                <span className="slider"></span>
              </div>
            </label>

            {settings.clickbait.enabled && (
              <>
                <label className="switch-row indented">
                  <div className="control-meta">
                    <span className="control-title">Blur Thumbnails</span>
                    <span className="control-desc">Applies blur layers on video thumbnails</span>
                  </div>
                  <div className="switch-wrapper">
                    <input
                      type="checkbox"
                      checked={settings.clickbait.blurThumbnails}
                      onChange={() => handleClickbaitToggle('blurThumbnails')}
                    />
                    <span className="slider"></span>
                  </div>
                </label>

                {/* Keyword list manager */}
                <div className="keyword-manager-group">
                  <span className="manager-label">Filtered Title Keywords</span>
                  <form onSubmit={handleAddKeyword} className="keyword-input-row">
                    <input
                      type="text"
                      placeholder="Add keyword (e.g. shock, blow your mind)..."
                      value={newKeyword}
                      onChange={(e) => setNewKeyword(e.target.value)}
                    />
                    <button type="submit" aria-label="Add keyword">+</button>
                  </form>
                  <div className="keywords-tags-cloud">
                    {settings.clickbait.titleBlacklist.length === 0 ? (
                      <span className="empty-keywords-text">No active title filters.</span>
                    ) : (
                      settings.clickbait.titleBlacklist.map((word) => (
                        <span key={word} className="keyword-tag">
                          <span>{word}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveKeyword(word)}
                            aria-label={`Remove filter for ${word}`}
                          >
                            &times;
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="popup-footer">
        <span>Version 0.1.0 • Open Source</span>
      </footer>
    </div>
  );
}

export default App;
