# Morlds HUD

A simple HUD that displays your Morlds. Each tile shows a live iframe preview of the Morld; clicking opens it in a new tab.

The Morlds (Unformed Deep, Pisces) live in `Morld (1)/` and `Morld (2)/` at the repo root. The catalog points to those folders so the HUD and GitHub Pages load them correctly.

## Run locally

```bash
npx serve .
```

Open `http://localhost:3000/`. On GitHub Pages the site is at **https://mauricejenkins-00.github.io/morlds-cards/**.

## Structure

- `index.html`, `style.css`, `app.js` – Solar system HUD
- `morlds-catalog.json` – Morld list; `path` must match folder names in the repo
- `Morld (1)/` – Unformed Deep (Void World)
- `Morld (2)/` – Pisces

## Adding more Morlds

1. Add a folder at the repo root (e.g. `Morld (3)/`) with `index.html`, `script.js`, `style.css`.
2. Add an entry to `morlds-catalog.json` with a `path` that matches the folder name:

```json
{
  "id": "morld://your-id",
  "name": "Your Morld Name",
  "path": "Morld (3)/index.html",
  "tags": []
}
```
