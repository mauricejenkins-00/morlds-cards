// Simple in-memory "Morld" definitions with metadata.
const defaultMorlds = [
  {
    id: "morld://unformed-deep",
    name: "Unformed Deep",
    mood: "void / without form",
    seed: "0x0000",
    tags: ["void", "deep", "still"],
    planet: {
      name: "Unformed Sphere",
      radius: "medium",
      atmosphere: "none / hinted",
    },
    background: {
      style: "dense void",
      description: "Barely lit horizon in deep black.",
    },
    style: {
      coreGradient:
        "radial-gradient(circle at 30% 18%, #fff7e6 0, #ffcf8c 16%, #ff9800 40%, #f57c00 62%, #3e2723 100%)",
      orbitGlow: "rgba(255, 153, 0, 0.55)",
    },
  },
  {
    id: "morld://moving-waters",
    name: "Moving Waters",
    mood: "dark / restless",
    seed: "0x0102",
    tags: ["waters", "motion", "genesis"],
    planet: {
      name: "Waters Over Deep",
      radius: "large",
      atmosphere: "formless mist",
    },
    background: {
      style: "restless deep",
      description: "Shifting greys over unseen depths.",
    },
    style: {
      coreGradient:
        "radial-gradient(circle at 28% 18%, #fff7e6 0, #ffd28f 18%, #ffa000 42%, #f57c00 62%, #3e2723 100%)",
      orbitGlow: "rgba(255, 160, 0, 0.6)",
    },
  },
  {
    id: "morld://hovering-spirit",
    name: "Hovering Over Deep",
    mood: "silent / expectant",
    seed: "0x0304",
    tags: ["hovering", "breath", "waters"],
    planet: {
      name: "Brooded Deep",
      radius: "medium-large",
      atmosphere: "thin veil",
    },
    background: {
      style: "expectant stillness",
      description: "Dark waters with a faint, waiting glow.",
    },
    style: {
      coreGradient:
        "radial-gradient(circle at 35% 22%, #fff9e6 0, #ffd89b 18%, #ff9800 42%, #ef6c00 64%, #3e2723 100%)",
      orbitGlow: "rgba(255, 180, 0, 0.65)",
    },
  },
];

const DB_KEY = "morldsDb:v1";

function loadMorldsFromDb() {
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (!raw) return defaultMorlds.slice();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || !parsed.length) return defaultMorlds.slice();
    return parsed;
  } catch (_) {
    return defaultMorlds.slice();
  }
}

function saveMorldsToDb(morlds) {
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(morlds));
  } catch (_) {}
}

let morlds = loadMorldsFromDb();

const earthCoreGradient =
  "radial-gradient(circle at 20% 25%, #f7fbff 0, #d9f0ff 12%, transparent 30%)," +
  "radial-gradient(circle at 68% 30%, #e3f4ff 0, #b9e1ff 16%, transparent 34%)," +
  "radial-gradient(circle at 30% 70%, #338a3e 0, #1b5e20 20%, transparent 48%)," +
  "radial-gradient(circle at 72% 72%, #4caf50 0, #2e7d32 22%, transparent 50%)," +
  "radial-gradient(circle at 50% 55%, #1e88e5 0, #1565c0 40%, #0d47a1 70%, #02040b 100%)";

const worldCore = document.getElementById("worldCore");
const worldOrbit = document.getElementById("worldOrbit");
const worldLabel = document.getElementById("worldLabel");
const morldUri = document.getElementById("morldUri");

const figureCard = document.querySelector(".figure-card");
const downloadCardBtn = document.getElementById("downloadCardBtn");
const nftModeBtn = document.getElementById("nftModeBtn");
const nftMintLink = document.getElementById("nftMintLink");

const innerCoreLayer = document.querySelector(".element-layer--inner-core");
const outerCoreLayer = document.querySelector(".element-layer--outer-core");
const mantleLayer = document.querySelector(".element-layer--mantle");
const crustLayer = document.querySelector(".element-layer--crust");
const oceansLayer = document.querySelector(".element-layer--oceans");
const atmosphereLayer = document.querySelector(".element-layer--atmosphere");

const metaId = document.getElementById("metaId");
const metaName = document.getElementById("metaName");
const metaMood = document.getElementById("metaMood");
const metaSeed = document.getElementById("metaSeed");
const metaPlanet = document.getElementById("metaPlanet");
const metaBackground = document.getElementById("metaBackground");
const metaTags = document.getElementById("metaTags");

const newTagInput = document.getElementById("newTagInput");
const addTagBtn = document.getElementById("addTagBtn");

const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");

let zoomLevel = 1;
let rotationDeg = 0;
let isDragging = false;
let lastX = 0;
let autoRotate = true;
let lastFrameTime = null;
let isFullscreen = false;
let isPlayingFormation = false;
let formationTimeouts = [];
let baseCoreGradient = null;
let formationCompleted = false;
let isNftMode = false;

function clearFormationSequence() {
  formationTimeouts.forEach((id) => clearTimeout(id));
  formationTimeouts = [];
  isPlayingFormation = false;
}

function setLayerVisibility(visibleInner, visibleOuter, visibleMantle, visibleCrust, visibleOceans, visibleAtmo) {
  const pairs = [
    [innerCoreLayer, visibleInner],
    [outerCoreLayer, visibleOuter],
    [mantleLayer, visibleMantle],
    [crustLayer, visibleCrust],
    [oceansLayer, visibleOceans],
    [atmosphereLayer, visibleAtmo],
  ];
  pairs.forEach(([el, on]) => {
    if (!el) return;
    el.classList.toggle("layer-visible", !!on);
  });
}

function playFormationSequence() {
  if (!worldCore || !worldLabel) return;
  clearFormationSequence();
  isPlayingFormation = true;
  formationCompleted = false;

  worldCore.style.backgroundImage =
    "radial-gradient(circle at 40% 30%, #0b0b0b 0, #151515 28%, #000000 70%)";
  setLayerVisibility(false, false, false, false, false, false);
  worldLabel.textContent = "Dust & cold gas";

  formationTimeouts.push(
    setTimeout(() => {
      worldCore.style.backgroundImage =
        "radial-gradient(circle at 35% 25%, #fff6e3 0, #f5d2a0 20%, #5a331b 55%, #000000 100%)";
      setLayerVisibility(true, false, false, false, false, false);
      worldLabel.textContent = "Inner core formed";
    }, 900)
  );

  formationTimeouts.push(
    setTimeout(() => {
      worldCore.style.backgroundImage =
        "radial-gradient(circle at 32% 20%, #fff3dd 0, #ffcc8a 18%, #ff8f00 40%, #3e2723 85%)";
      setLayerVisibility(true, true, false, false, false, false);
      worldLabel.textContent = "Outer core molten";
    }, 1900)
  );

  formationTimeouts.push(
    setTimeout(() => {
      worldCore.style.backgroundImage =
        "radial-gradient(circle at 30% 18%, #fff3dd 0, #ffc777 20%, #ff8f00 40%, #75422a 70%, #1a0d08 100%)";
      setLayerVisibility(true, true, true, false, false, false);
      worldLabel.textContent = "Mantle rising";
    }, 2900)
  );

  formationTimeouts.push(
    setTimeout(() => {
      worldCore.style.backgroundImage =
        "radial-gradient(circle at 28% 18%, #fff2da 0, #ffc36b 20%, #f57c00 42%, #5d3723 74%, #100806 100%)";
      setLayerVisibility(true, true, true, true, false, false);
      worldLabel.textContent = "Crust cooling";
    }, 3900)
  );

  formationTimeouts.push(
    setTimeout(() => {
      worldCore.style.backgroundImage =
        "radial-gradient(circle at 30% 20%, #f4fbff 0, #cde9ff 18%, #4fa3ff 40%, #01579b 62%, #0b1020 100%)";
      setLayerVisibility(true, true, true, true, true, false);
      worldLabel.textContent = "Oceans collected";
    }, 4900)
  );

  formationTimeouts.push(
    setTimeout(() => {
      worldCore.style.backgroundImage =
        "radial-gradient(circle at 30% 18%, #f9fdff 0, #d0ebff 20%, #4fa3ff 42%, #01579b 64%, #02030b 100%)";
      setLayerVisibility(true, true, true, true, true, true);
      worldLabel.textContent = "Atmosphere breathing";
    }, 5900)
  );

  formationTimeouts.push(
    setTimeout(() => {
      worldCore.style.backgroundImage = earthCoreGradient;
      setLayerVisibility(true, true, true, true, true, true);
      worldLabel.textContent = "Earth-like globe formed";
      isPlayingFormation = false;
      formationCompleted = true;
    }, 7200)
  );
}

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

function renderTagPills(tags) {
  if (!tags || !tags.length) return '<span class="meta-value">—</span>';
  return tags.map((t) => `<span class="tag-pill"><span>${t}</span></span>`).join("");
}

function applyOrbitTransform() {
  worldOrbit.style.transform = `scale(${zoomLevel}) rotate(${rotationDeg}deg)`;
}

function setFullscreen(on) {
  const appShell = document.querySelector(".app-shell");
  if (!appShell) return;
  isFullscreen = on;
  appShell.classList.toggle("fullscreen-mode", on);

  if (on) {
    setZoom(1.1);
    playFormationSequence();
  } else {
    clearFormationSequence();
    if (!formationCompleted) {
      setLayerVisibility(true, true, true, true, true, true);
      const activeMorld = getActiveMorld();
      if (activeMorld && activeMorld.style && activeMorld.style.coreGradient) {
        worldCore.style.backgroundImage = activeMorld.style.coreGradient;
        worldLabel.textContent = `Morld: ${activeMorld.name}`;
      }
    }
  }
}

function applyMorld(morld) {
  worldCore.style.backgroundImage = morld.style.coreGradient;
  baseCoreGradient = morld.style.coreGradient;
  worldOrbit.style.boxShadow =
    `0 0 60px ${morld.style.orbitGlow}, 0 0 160px ${morld.style.orbitGlow} inset`;
  worldLabel.textContent = `Morld: ${morld.name}`;
  morldUri.textContent = morld.id.replace("morld://", "void://");

  metaId.textContent = morld.id;
  metaName.textContent = morld.name;
  metaMood.textContent = morld.mood;
  metaSeed.textContent = morld.seed;
  const planetSummary = morld.planet
    ? `${morld.planet.name || "—"} · ${morld.planet.radius || "—"} · ${morld.planet.atmosphere || "—"}`
    : "—";
  const backgroundSummary = morld.background
    ? `${morld.background.style || "—"} – ${morld.background.description || ""}`.trim()
    : "—";
  metaPlanet.textContent = planetSummary;
  metaBackground.textContent = backgroundSummary;
  metaTags.innerHTML = renderTagPills(morld.tags);
}

function getActiveMorld() {
  return morlds[0];
}

addTagBtn.addEventListener("click", () => {
  const raw = newTagInput.value.trim();
  if (!raw) return;
  const morld = getActiveMorld();
  if (!morld.tags.includes(raw)) {
    morld.tags.push(raw);
    metaTags.innerHTML = renderTagPills(morld.tags);
    saveMorldsToDb(morlds);
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
  if (skipImages) opts.ignoreElements = (el) => el.tagName === "IMG";
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
            alert("Image could not be exported (try opening the page from a web server).");
            return;
          }
          const active = getActiveMorld();
          const baseName = active ? String(active.id).replace("morld://", "") : "morld-card";
          triggerDownload(dataUrl, (baseName || "morld-card") + ".png");
          done();
        });
      } else {
        const active = getActiveMorld();
        const baseName = active ? String(active.id).replace("morld://", "") : "morld-card";
        triggerDownload(dataUrl, (baseName || "morld-card") + ".png");
        done();
      }
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

if (downloadCardBtn) downloadCardBtn.addEventListener("click", downloadCardAsPng);

async function generateCardGif() {
  if (!figureCard) return null;
  const h2c = window.html2canvas || (typeof html2canvas !== "undefined" ? html2canvas : null);
  const GifConstructor = window.GIF || (typeof GIF !== "undefined" ? GIF : null);
  if (!h2c) {
    alert("NFT export requires the page to be loaded (check your connection).");
    return null;
  }

  const originalAutoRotate = autoRotate;
  const originalRotation = rotationDeg;
  autoRotate = false;

  const frameCount = 5;
  const canvases = [];

  for (let i = 0; i < frameCount; i++) {
    rotationDeg = originalRotation + (360 / frameCount) * i;
    applyOrbitTransform();
    await new Promise((r) => setTimeout(r, 120));
    const canvas = await captureCardToCanvas(false);
    if (!canvas) {
      const fallback = await captureCardToCanvas(true);
      if (fallback) canvases.push(fallback);
    } else {
      try {
        canvas.toDataURL("image/png");
        canvases.push(canvas);
      } catch (e) {
        const fallback = await captureCardToCanvas(true);
        if (fallback) canvases.push(fallback);
      }
    }
  }

  rotationDeg = originalRotation;
  applyOrbitTransform();
  autoRotate = originalAutoRotate;

  if (canvases.length === 0) {
    alert("Could not capture frames. Try Save PNG instead.");
    return null;
  }

  if (!GifConstructor) {
    triggerDownload(canvases[0].toDataURL("image/png"), "morld-card-nft.png");
    if (nftMintLink) {
      const active = getActiveMorld();
      const name = active ? active.name : "Morld card";
      nftMintLink.innerHTML = `<a href="https://crypto.com/nft/" target="_blank" rel="noopener noreferrer">Mint "${name}" on Crypto.com NFT</a>`;
    }
    return null;
  }

  try {
    const gif = new GifConstructor({
      workers: 0,
      quality: 10,
      background: "#0a0a0a",
    });

    for (let i = 0; i < canvases.length; i++) {
      gif.addFrame(canvases[i], { delay: 150, copy: true });
    }

    return await new Promise((resolve, reject) => {
      gif.on("finished", (blob) => {
        const url = URL.createObjectURL(blob);
        const active = getActiveMorld();
        const baseName = active ? String(active.id).replace("morld://", "") : "morld-card";
        triggerDownload(url, (baseName || "morld-card") + "-nft.gif");
        resolve(url);
      });
      gif.on("abort", () => reject(new Error("GIF aborted")));
      gif.render();
    });
  } catch (err) {
    triggerDownload(canvases[0].toDataURL("image/png"), "morld-card-nft.png");
    if (nftMintLink) {
      const active = getActiveMorld();
      const name = active ? active.name : "Morld card";
      nftMintLink.innerHTML = `<a href="https://crypto.com/nft/" target="_blank" rel="noopener noreferrer">Mint "${name}" on Crypto.com NFT</a>`;
    }
    return null;
  }
}

if (nftModeBtn && figureCard) {
  nftModeBtn.addEventListener("click", async () => {
    isNftMode = !isNftMode;
    figureCard.classList.toggle("figure-card--nft", isNftMode);

    if (isNftMode) {
      nftModeBtn.disabled = true;
      nftModeBtn.textContent = "Creating…";
      if (nftMintLink) nftMintLink.textContent = "";
      await generateCardGif();
      if (nftMintLink) {
        const active = getActiveMorld();
        const name = active ? active.name : "Morld card";
        nftMintLink.innerHTML = `<a href="https://crypto.com/nft/" target="_blank" rel="noopener noreferrer">Mint "${name}" on Crypto.com NFT</a>`;
      }
      nftModeBtn.disabled = false;
      nftModeBtn.textContent = "Revert";
    } else {
      nftModeBtn.textContent = "Create NFT";
      if (nftMintLink) nftMintLink.textContent = "";
    }
  });
}

function setZoom(newZoom) {
  zoomLevel = Math.min(1.6, Math.max(0.7, newZoom));
  applyOrbitTransform();
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
  if (!isDragging) return;
  onPointerUp(e);
});

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

applyMorld(getActiveMorld());
applyOrbitTransform();
window.requestAnimationFrame(animationLoop);
