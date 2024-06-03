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

        chrome.storage.sync.set({ [tabs[0].url]: selectedFont }).then(() => {
          console.log(`Font saved: ${selectedFont} for ${tabs[0].url}`);
        });
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

      chrome.storage.sync.remove(tabs[0].url).then(() => {
        console.log(`Font removed for ${tabs[0].url}`);
      });
    });
  });
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

  // Itera sobre cada elemento de texto e define a fonte para Arial
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
    elemento.style.fontFamily = '';
  });

}
