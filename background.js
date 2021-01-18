// Listen for new tabs.
chrome.tabs.onCreated.addListener(function (tab) {
  if (tab.url === '' || tab.pendingUrl === 'chrome://newtab/') {
    chrome.tabs.update(tab.id, { url: 'https://privanote.xyz' });
  }
});
