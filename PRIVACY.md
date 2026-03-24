# Privacy Policy — Audio Redirector

**Last updated:** March 24, 2026

## Overview

Audio Redirector is a browser extension that lets you route a tab's audio to a specific output device (speakers, headphones, Bluetooth, HDMI, etc.).

## Data Collection

**Audio Redirector does not collect, transmit, or store any personal data.**

### What the extension stores locally

- **Device preference per tab** — When you select an audio output device, the chosen device ID is saved in the browser's local storage (`chrome.storage.local`) so the preference persists while the tab is open. This data is deleted automatically when the tab is closed.

### What the extension does NOT do

- Does not collect or transmit any data to external servers.
- Does not track browsing history, search queries, or page content.
- Does not use analytics, telemetry, or crash-reporting services.
- Does not store any data outside the browser's local extension storage.
- Does not record or access microphone audio. The temporary microphone permission request is solely to allow the browser to reveal audio output device names — the microphone stream is immediately discarded.

## Permissions Explained

| Permission | Why it's needed |
|---|---|
| `activeTab` | To interact with the current tab when the user clicks the extension icon. |
| `storage` | To remember the selected device for each tab. |
| `scripting` | To enumerate audio devices in the tab's page context and to redirect audio output. |
| `host_permissions (<all_urls>)` | To inject the audio-redirect content script on any website that plays audio. |

## Third-Party Services

This extension does not use any third-party services, SDKs, or libraries.

## Changes to This Policy

If this policy is updated, the new version will be published alongside the extension update.

## Contact

- **Author:** joshivilas
- **GitHub:** [https://github.com/joshivilas/](https://github.com/joshivilas/)

If you have questions or concerns about this policy, please open an issue on GitHub.
