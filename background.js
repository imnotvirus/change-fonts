chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    const { host } = new URL(tab.url);
    console.log(`Tab updated: ${host}`);

    chrome.storage.sync.get([host], (result) => {
      if (chrome.runtime.lastError) {
        console.error(`Error retrieving font: ${chrome.runtime.lastError}`);
        return;
      }

      const font = result[host];
      if (font) {
        console.log(`Applying saved font: ${font} to ${host}`);
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          function: applyFontToPage,
          args: [font],
        });
      } else {
        console.log(`No saved font for ${host}`);
      }
    });
  }
});

function applyFontToPage(fontFamily) {
  console.log(`Applying font to page: ${fontFamily}`);
  const link = document.createElement("link");
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
    / /g,
    "+"
  )}&display=swap`;
  link.rel = "stylesheet";
  document.head.appendChild(link);

  document.body.style.fontFamily = fontFamily;

  const elementosDeTexto = document.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, span, a"
  );

  elementosDeTexto.forEach((elemento) => {
    elemento.style.fontFamily = fontFamily;
  });
}
