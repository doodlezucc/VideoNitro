chrome.runtime.onMessage.addListener(function(request, sender) {
    if (request.action === "enable") {
        chrome.browserAction.setIcon({ path: "icons/icon.png", tabId: sender.tab.id });
        chrome.browserAction.setPopup({
            tabId: sender.tab.id,
            popup: "popup.html"
        });
    }
});