# Audio Redirector

A Microsoft Edge extension that lets you route any tab's audio to a specific output device — speakers, headphones, Bluetooth, HDMI, and more — with a single click.

## Features

- **Per-tab control** — Choose a different output device for each tab.
- **Auto-detection** — Lists all connected audio output devices automatically.
- **Persistent within tab** — Device preference sticks when you navigate within the same tab.
- **Lightweight** — No background network requests, no analytics, no data collection.
- **Works with all sites** — YouTube, Spotify, Netflix, SoundCloud, and any page that uses `<audio>` or `<video>` elements.

## Installation

### From the Edge Add-ons Store

*(Link will be available after publishing)*

### Manual / Developer Install

1. Clone or download this repository.
2. Open `edge://extensions/` in Microsoft Edge.
3. Enable **Developer mode** (toggle in the left sidebar).
4. Click **Load unpacked** and select the `audio-redirector` folder.

## Usage

1. Open a website that plays audio (e.g., YouTube).
2. Click the **Audio Redirector** icon in the toolbar.
3. Select the desired output device from the list.
4. Audio from that tab will immediately switch to the selected device.

> **First-time note:** The browser may ask for microphone permission on the page. This is required to reveal audio device names — the extension does **not** record any audio.

## Permissions

| Permission | Purpose |
|---|---|
| `activeTab` | Access the current tab when you click the icon |
| `storage` | Remember device selection per tab |
| `scripting` | Enumerate devices and redirect audio in page context |
| `<all_urls>` | Inject the redirect script on any site |

## Privacy

Audio Redirector collects **zero** user data. See [PRIVACY.md](PRIVACY.md) for the full privacy policy.

## Tech Stack

- Manifest V3
- `HTMLMediaElement.setSinkId()` Web API
- `navigator.mediaDevices.enumerateDevices()` Web API
- Pure JavaScript — no frameworks, no build step

## Author

- **joshivilas** — [GitHub](https://github.com/joshivilas/)

## License

MIT
