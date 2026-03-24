// popup.js — Lists audio output devices and sends the selected device to the content script.
// Device enumeration happens inside the active tab (via chrome.scripting.executeScript)
// because extension popups cannot call getUserMedia.

const deviceListEl = document.getElementById("device-list");
const loadingEl = document.getElementById("loading");
const noDevicesEl = document.getElementById("no-devices");
const errorEl = document.getElementById("error-msg");
const statusEl = document.getElementById("status");

let currentTabId = null;

// ── Helpers ────────────────────────────────────────────

function showStatus(message, type = "success") {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`;
  statusEl.classList.remove("hidden");
  setTimeout(() => statusEl.classList.add("hidden"), 3000);
}

function showError(message) {
  errorEl.textContent = message;
  errorEl.classList.remove("hidden");
}

function deviceIcon(label) {
  const l = label.toLowerCase();
  if (l.includes("headphone") || l.includes("headset") || l.includes("earphone"))
    return "🎧";
  if (l.includes("bluetooth") || l.includes("airpods"))
    return "📡";
  if (l.includes("hdmi") || l.includes("display") || l.includes("monitor"))
    return "🖥️";
  return "🔈";
}

// ── Enumerate devices from the tab's page context ──────

async function enumerateDevicesInTab() {
  // This function is serialized and executed inside the web page,
  // so getUserMedia uses the *page's* origin (e.g. youtube.com)
  // where the browser can show a normal permission prompt.
  const results = await chrome.scripting.executeScript({
    target: { tabId: currentTabId },
    func: async () => {
      try {
        let devices = await navigator.mediaDevices.enumerateDevices();
        let outputs = devices.filter(d => d.kind === "audiooutput");

        // If labels are blank, request mic permission to unlock them
        if (outputs.length > 0 && !outputs[0].label) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          stream.getTracks().forEach(t => t.stop());
          devices = await navigator.mediaDevices.enumerateDevices();
          outputs = devices.filter(d => d.kind === "audiooutput");
        }

        return {
          ok: true,
          devices: outputs.map(d => ({ deviceId: d.deviceId, label: d.label || "Default" }))
        };
      } catch (e) {
        return { ok: false, error: e.message };
      }
    }
  });

  return results[0].result;
}

// ── Load devices ───────────────────────────────────────

async function loadDevices() {
  loadingEl.classList.remove("hidden");
  deviceListEl.classList.add("hidden");
  noDevicesEl.classList.add("hidden");
  errorEl.classList.add("hidden");

  let result;
  try {
    result = await enumerateDevicesInTab();
  } catch (err) {
    loadingEl.classList.add("hidden");
    showError("Cannot access this tab. Try reloading the page.");
    return;
  }

  loadingEl.classList.add("hidden");

  if (!result || !result.ok) {
    showError(result?.error || "Microphone permission was denied. Allow it in the page's address bar and reopen this popup.");
    return;
  }

  const audioOutputs = result.devices;

  if (audioOutputs.length === 0) {
    noDevicesEl.classList.remove("hidden");
    return;
  }

  // Retrieve currently selected device for this tab
  const stored = await chrome.storage.local.get(`tab_${currentTabId}`);
  const activeDeviceId = stored[`tab_${currentTabId}`] || "";

  deviceListEl.innerHTML = "";
  for (const device of audioOutputs) {
    const li = document.createElement("li");
    li.dataset.deviceId = device.deviceId;

    const icon = document.createElement("span");
    icon.className = "icon";
    icon.textContent = deviceIcon(device.label);

    const label = document.createElement("span");
    label.className = "label";
    label.textContent = device.label;
    label.title = device.label;

    li.appendChild(icon);
    li.appendChild(label);

    if (device.deviceId === activeDeviceId) {
      li.classList.add("active");
    }

    li.addEventListener("click", () => selectDevice(device.deviceId, device.label));
    deviceListEl.appendChild(li);
  }

  deviceListEl.classList.remove("hidden");
}

// ── Select device ──────────────────────────────────────

async function selectDevice(deviceId, label) {
  try {
    // Save preference
    await chrome.storage.local.set({ [`tab_${currentTabId}`]: deviceId });

    // Send to content script
    await chrome.tabs.sendMessage(currentTabId, {
      type: "SET_AUDIO_OUTPUT",
      deviceId
    });

    // Update UI
    document.querySelectorAll("#device-list li").forEach(li => {
      li.classList.toggle("active", li.dataset.deviceId === deviceId);
    });

    showStatus(`Audio → ${label}`, "success");
  } catch (err) {
    showStatus("Failed to switch device. Reload the tab and retry.", "error");
    console.error("Audio Redirector:", err);
  }
}

// ── Init ───────────────────────────────────────────────

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTabId = tab.id;
  await loadDevices();
})();
