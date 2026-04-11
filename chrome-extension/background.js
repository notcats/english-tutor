// Service worker — keeps extension alive and handles install
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Dictionary extension installed');
});
