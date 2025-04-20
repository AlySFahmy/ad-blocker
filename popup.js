
const toggle = document.getElementById('toggle');

chrome.storage.local.get('blockingEnabled', (data) => {
  toggle.checked = data.blockingEnabled ?? true;
});


toggle.addEventListener('change', () => {
  chrome.storage.local.set({ blockingEnabled: toggle.checked });
});


