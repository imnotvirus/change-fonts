chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete' && tab.url) {
            console.log(`Tab updated: ${tab.url}`);
            chrome.storage.sync.get([tab.url], function(result) {
                if (result[tab.url]) {
                    console.log(`Applying saved font: ${result[tab.url]} to ${tab.url}`);
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        function: applyFontToPage,
                        args: [result[tab.url]]
                    });
                }
            });
        }
    });
});

function applyFontToPage(fontFamily) {
    console.log(`Applying font to page: ${fontFamily}`);
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    document.body.style.fontFamily = fontFamily;
}
