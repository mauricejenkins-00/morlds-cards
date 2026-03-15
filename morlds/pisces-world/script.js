// Pisces Morld – metadata and controls
const piscesMorld = {
  id: "morld://pisces-world",
  name: "Pisces",
  mood: "flowing / bound / dual",
  seed: "0x1202",
  tags: ["zodiac", "pisces", "fish", "water", "duality"],
  planet: {
    name: "Two Fish",
    radius: "circular orbit",
    atmosphere: "glow / aquatic",
  },
  background: {
    style: "cosmic void",
    description: "Deep space with cyan accents.",
  },
};

const worldCore = document.getElementById("worldCore");
const worldOrbit = document.getElementById("worldOrbit");
const worldLabel = document.getElementById("worldLabel");
const morldUri = document.getElementById("morldUri");

const figureCard = document.querySelector(".figure-card");
const downloadCardBtn = document.getElementById("downloadCardBtn");
const nftModeBtn = document.getElementById("nftModeBtn");
const nftMintLink = document.getElementById("nftMintLink");

const metaId = document.getElementById("metaId");
const metaName = document.getElementById("metaName");
const metaMood = document.getElementById("metaMood");
const metaSeed = document.getElementById("metaSeed");
const metaPlanet = document.getElementById("metaPlanet");
const metaBackground = document.getElementById("metaBackground");
const metaTags = document.getElementById("metaTags");

const newTagInput = document.getElementById("newTagInput");
const addTagBtn = document.getElementById("addTagBtn");
const backToMainBtn = document.getElementById("backToMainBtn");

let zoomLevel = 1;
let rotationDeg = 0;
let isDragging = false;
let lastX = 0;
let autoRotate = true;
let lastFrameTime = null;
let isFullscreen = false;
let isNftMode = false;

function animationLoop(timestamp) {
  if (lastFrameTime == null) lastFrameTime = timestamp;
  const delta = timestamp - lastFrameTime;
  lastFrameTime = timestamp;

  if (autoRotate && !isDragging) {
    rotationDeg += delta * 0.006;
    applyOrbitTransform();
  }

  window.requestAnimationFrame(animationLoop);
}

function applyOrbitTransform() {
  if (!worldOrbit) return;
  worldOrbit.style.transform = `scale(${zoomLevel}) rotate(${rotationDeg}deg)`;
}

function applyMorld(morld) {
  if (worldLabel) worldLabel.textContent = `Morld: ${morld.name}`;
  if (morldUri) morldUri.textContent = morld.id.replace("morld://", "void://");

  if (metaId) metaId.textContent = morld.id;
  if (metaName) metaName.textContent = morld.name;
  if (metaMood) metaMood.textContent = morld.mood;
  if (metaSeed) metaSeed.textContent = morld.seed;

  const planetSummary = morld.planet
    ? `${morld.planet.name || "—"} · ${morld.planet.radius || "—"} · ${morld.planet.atmosphere || "—"}`
    : "—";
  const backgroundSummary = morld.background
    ? `${morld.background.style || "—"} – ${morld.background.description || ""}`.trim()
    : "—";

  if (metaPlanet) metaPlanet.textContent = planetSummary;
  if (metaBackground) metaBackground.textContent = backgroundSummary;
  if (metaTags) metaTags.innerHTML = renderTagPills(morld.tags);
}

function renderTagPills(tags) {
  if (!tags || !tags.length) return '<span class="meta-value">—</span>';
  return tags
    .map((t) => `<span class="tag-pill"><span>${t}</span></span>`)
    .join("");
}

function getActiveMorld() {
  return piscesMorld;
}

function setFullscreen(on) {
  const appShell = document.querySelector(".app-shell");
  if (!appShell) return;
  isFullscreen = on;
  appShell.classList.toggle("fullscreen-mode", on);

  if (on) {
    setZoom(1.15);
  }
}

function setZoom(newZoom) {
  zoomLevel = Math.min(1.6, Math.max(0.7, newZoom));
  applyOrbitTransform();
}

function captureCardToCanvas(skipImages) {
  const h2c = window.html2canvas || (typeof html2canvas !== "undefined" ? html2canvas : null);
  if (!h2c || !figureCard) return Promise.resolve(null);
  const opts = {
    backgroundColor: "#0a0a0a",
    scale: 1,
    logging: false,
    useCORS: true,
    allowTaint: false,
  };
  if (skipImages) {
    opts.ignoreElements = (el) => el.tagName === "IMG";
  }
  return h2c(figureCard, opts);
}

function downloadCardAsPng() {
  if (!figureCard) return;
  const h2c = window.html2canvas || (typeof html2canvas !== "undefined" ? html2canvas : null);
  if (!h2c) {
    alert("Download requires the page to be loaded (check your connection).");
    return;
  }

  const previousTransition = figureCard.style.transition;
  figureCard.style.transition = "none";
  if (downloadCardBtn) {
    downloadCardBtn.disabled = true;
    downloadCardBtn.textContent = "Saving…";
  }

  function done() {
    figureCard.style.transition = previousTransition;
    if (downloadCardBtn) {
      downloadCardBtn.disabled = false;
      downloadCardBtn.textContent = "Save PNG";
    }
  }

  captureCardToCanvas(false)
    .then((canvas) => {
      if (!canvas) {
        done();
        alert("Unable to capture card.");
        return;
      }
      let dataUrl;
      try {
        dataUrl = canvas.toDataURL("image/png");
      } catch (e) {
        dataUrl = null;
      }
      if (!dataUrl) {
        return captureCardToCanvas(true).then((fallbackCanvas) => {
          if (fallbackCanvas) {
            try {
              dataUrl = fallbackCanvas.toDataURL("image/png");
            } catch (e2) {}
          }
          if (!dataUrl) {
            done();
            alert("Image could not be exported.");
            return;
          }
          triggerDownload(dataUrl, "pisces-morld.png");
          done();
        });
      }
      triggerDownload(dataUrl, "pisces-morld.png");
      done();
    })
    .catch(() => {
      done();
      alert("Unable to capture card image.");
    });
}

function triggerDownload(dataUrl, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataUrl;
  link.click();
}

addTagBtn.addEventListener("click", () => {
  const raw = newTagInput.value.trim();
  if (!raw) return;
  if (!piscesMorld.tags.includes(raw)) {
    piscesMorld.tags.push(raw);
    if (metaTags) metaTags.innerHTML = renderTagPills(piscesMorld.tags);
  }
  newTagInput.value = "";
  newTagInput.focus();
});

newTagInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addTagBtn.click();
  }
});

if (downloadCardBtn) {
  downloadCardBtn.addEventListener("click", downloadCardAsPng);
}

if (nftModeBtn && figureCard) {
  nftModeBtn.addEventListener("click", () => {
    isNftMode = !isNftMode;
    figureCard.classList.toggle("figure-card--nft", isNftMode);

    if (isNftMode) {
      nftModeBtn.disabled = true;
      nftModeBtn.textContent = "Creating…";
      if (nftMintLink) nftMintLink.textContent = "";
      setTimeout(() => {
        captureCardToCanvas(false).then((canvas) => {
          if (canvas) {
            try {
              const dataUrl = canvas.toDataURL("image/png");
              triggerDownload(dataUrl, "pisces-morld-nft.png");
            } catch (_) {}
          }
          if (nftMintLink) {
            nftMintLink.innerHTML = `<a href="https://crypto.com/nft/" target="_blank" rel="noopener noreferrer">Mint "Pisces" on Crypto.com NFT</a>`;
          }
          nftModeBtn.disabled = false;
          nftModeBtn.textContent = "Revert";
        });
      }, 300);
    } else {
      nftModeBtn.textContent = "Create NFT";
      if (nftMintLink) nftMintLink.textContent = "";
    }
  });
}

zoomInBtn.addEventListener("click", () => setZoom(zoomLevel + 0.1));
zoomOutBtn.addEventListener("click", () => setZoom(zoomLevel - 0.1));

worldOrbit.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.08 : 0.08;
    setZoom(zoomLevel + delta);
  },
  { passive: false }
);

function onPointerDown(e) {
  isDragging = true;
  lastX = e.clientX;
  worldOrbit.setPointerCapture(e.pointerId);
}

function onPointerMove(e) {
  if (!isDragging) return;
  const dx = e.clientX - lastX;
  lastX = e.clientX;
  rotationDeg += dx * 0.35;
  applyOrbitTransform();
}

function onPointerUp(e) {
  isDragging = false;
  try {
    worldOrbit.releasePointerCapture(e.pointerId);
  } catch (_) {}
}

worldOrbit.addEventListener("pointerdown", onPointerDown);
worldOrbit.addEventListener("pointermove", onPointerMove);
worldOrbit.addEventListener("pointerup", onPointerUp);
worldOrbit.addEventListener("pointercancel", onPointerUp);
worldOrbit.addEventListener("pointerleave", (e) => {
  if (isDragging) onPointerUp(e);
});

if (backToMainBtn) {
  backToMainBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setFullscreen(false);
  });
}

worldOrbit.addEventListener("click", (e) => {
  if (isDragging) return;
  e.stopPropagation();
  setFullscreen(!isFullscreen);
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && isFullscreen) {
    setFullscreen(false);
  }
});

applyMorld(piscesMorld);
applyOrbitTransform();
window.requestAnimationFrame(animationLoop);
