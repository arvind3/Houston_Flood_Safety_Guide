# Houston Flood Safety Guide

An interactive website created as an **IB Middle Years Programme** student project about flood safety in Houston, Texas.

## Live Demo

Visit: `https://[your-username].github.io/Houston_Flood_Safety_Guide`

## Deploy to GitHub Pages

1. **Create a new public repository** on GitHub (e.g., `Houston_Flood_Safety_Guide`)

2. **Push all files:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/[your-username]/Houston_Flood_Safety_Guide.git
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repo → **Settings** → **Pages**
   - Under "Source", select **Branch: main** and folder **/ (root)**
   - Click **Save**

4. **Access your site** at `https://[your-username].github.io/Houston_Flood_Safety_Guide` (may take 1-2 minutes)

## Local Preview

Simply open `index.html` in any browser — no build step required.

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- [Leaflet.js](https://leafletjs.com/) — interactive flood zone map
- [Chart.js](https://www.chartjs.org/) — data visualizations
- [Google Fonts](https://fonts.google.com/) — Inter + Space Grotesk

## File Structure

```
├── index.html          ← main page
├── css/style.css       ← all styles
├── js/main.js          ← all interactivity
├── assets/images/      ← graphics (if any)
└── README.md           ← this file
```
