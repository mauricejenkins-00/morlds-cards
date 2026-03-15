# Morlds HUD

A simple HUD that displays your Morlds. Each tile shows a live iframe preview of the Morld; clicking opens it in a new tab.

The Morlds (Unformed Deep, Pisces) are included inside this project under `morlds/`, so no screenshots or external paths are required. Animations and behavior are preserved.

## Run

From the **Morlds-Holder** folder:

```bash
cd C:\Users\Manny\Desktop\Morlds-Holder
npx serve .
```

Open `http://localhost:3000/`. Tiles show live previews; clicking a tile opens that Morld in a new tab.

## Structure

- `index.html`, `style.css`, `app.js` – HUD (header + grid of tiles with iframe previews)
- `morlds-catalog.json` – List of Morlds (`name`, `path`, `tags`)
- `morlds/unformed-deep/` – Void World Morld (planet layers, formation animation)
- `morlds/pisces-world/` – Pisces Morld (two fish, orbit)

## Adding more Morlds

1. Add a folder under `morlds/` with the Morld’s `index.html`, `script.js`, and `style.css`.
2. Add an entry to `morlds-catalog.json`:

```json
{
  "id": "morld://your-id",
  "name": "Your Morld Name",
  "path": "morlds/your-folder/index.html",
  "tags": []
}
```
