document.addEventListener("DOMContentLoaded", function () {
  const fontSelect = document.getElementById("fontSelect");
  const applyFontButton = document.getElementById("applyFont");
  const resetFontButton = document.getElementById("resetFont");

  const googleFonts = [
    "Roboto",
    "Open Sans",
    "Lato",
    "Montserrat",
    "Oswald",
    "Source Sans Pro",
    "Slabo 27px",
    "Raleway",
    "PT Sans",
    "Merriweather",
  ];

  googleFonts.forEach((font) => {
    const option = document.createElement("option");
    option.value = font;
    option.textContent = font;
    fontSelect.appendChild(option);
  });

  applyFontButton.addEventListener("click", () => {
    const selectedFont = fontSelect.value;
    if (selectedFont) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(`Applying font: ${selectedFont} to ${tabs[0].url}`);
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id },
          function: applyFontToPage,
          args: [selectedFont],
        });

        saveFontToWebsite(tabs[0].url, selectedFont);
      });
    }
  });

  resetFontButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log(`Resetting font for ${tabs[0].url}`);
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: resetFontOnPage,
      });

      const { host } = new URL(tabs[0].url);
      chrome.storage.sync.remove(host, () => {
        console.log(`Font removed for ${host}`);
      });
    });
  });
});

function saveFontToWebsite(url, font) {
  const { host } = new URL(url);

  chrome.storage.sync.set({ [host]: font }, () => {
    if (chrome.runtime.lastError) {
      console.error(`Error saving font: ${chrome.runtime.lastError}`);
      return;
    }

    console.log(`Font saved: ${font} for ${host}`);
  });
}

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

function resetFontOnPage() {
  console.log(`Resetting font on page`);
  document.body.style.fontFamily = "";

  const elementosDeTexto = document.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, span, a"
  );

  elementosDeTexto.forEach((elemento) => {
    elemento.style.fontFamily = "";
  });
}
