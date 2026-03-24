// background.js — Service worker that restores device preference when a tab navigates.

// When a tab finishes loading, push the stored device preference to the content script.
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status !== "complete") return;

  const key = `tab_${tabId}`;
  chrome.storage.local.get(key, items => {
    const deviceId = items[key];
    if (!deviceId) return;

    chrome.tabs.sendMessage(tabId, {
      type: "SET_AUDIO_OUTPUT",
      deviceId
    }).catch(() => {
      // Content script may not be injected on restricted pages — safe to ignore.
    });
  });
});

// Clean up stored preference when a tab is closed.
chrome.tabs.onRemoved.addListener(tabId => {
  chrome.storage.local.remove(`tab_${tabId}`);
});
