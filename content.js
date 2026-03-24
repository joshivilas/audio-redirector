// content.js — Runs in every page. Redirects <audio> and <video> elements to the
// selected output device using HTMLMediaElement.setSinkId().

(() => {
  "use strict";

  let targetDeviceId = "";

  // ── Apply setSinkId to a single media element ────────

  function applyDevice(el) {
    if (typeof el.setSinkId !== "function") return;
    if (el.dataset.audioRedirectorSink === targetDeviceId) return; // already set

    el.setSinkId(targetDeviceId)
      .then(() => {
        el.dataset.audioRedirectorSink = targetDeviceId;
      })
      .catch(err => {
        console.warn("Audio Redirector: setSinkId failed", err);
      });
  }

  // ── Apply to all existing media elements ─────────────

  function applyToAll() {
    const mediaEls = document.querySelectorAll("audio, video");
    mediaEls.forEach(applyDevice);
  }

  // ── MutationObserver: catch dynamically added media ──

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        if (node.tagName === "AUDIO" || node.tagName === "VIDEO") {
          applyDevice(node);
        }

        // Also check children (e.g. YouTube injects nested structures)
        if (node.querySelectorAll) {
          node.querySelectorAll("audio, video").forEach(applyDevice);
        }
      }
    }
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  // ── Listen for messages from the popup / background ──

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === "SET_AUDIO_OUTPUT") {
      targetDeviceId = message.deviceId;
      applyToAll();
      sendResponse({ ok: true });
    }

    if (message.type === "GET_CURRENT_DEVICE") {
      sendResponse({ deviceId: targetDeviceId });
    }
  });
})();
