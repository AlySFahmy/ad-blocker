
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ blockingEnabled: true });
  });
  

  chrome.storage.onChanged.addListener((changes) => {
    if (changes.blockingEnabled) {
      const isEnabled = changes.blockingEnabled.newValue;
  
      chrome.declarativeNetRequest.updateEnabledRulesets({
        enableRulesetIds: isEnabled ? ["block-ads"] : [],
        disableRulesetIds: isEnabled ? [] : ["block-ads"]
        
      });
    }
  });
  