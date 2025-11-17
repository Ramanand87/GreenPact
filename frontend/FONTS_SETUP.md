# 3D Text Fonts Setup

## Font Requirements

The Home3 components use 3D text rendering which requires typeface.json font files.

## Required Fonts

The components reference:
- `/fonts/helvetiker_regular.typeface.json`
- `/fonts/helvetiker_bold.typeface.json`

## Installation Options

### Option 1: Download from Three.js Repository
Download the typeface fonts from the official Three.js examples:
- [helvetiker_regular.typeface.json](https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json)
- [helvetiker_bold.typeface.json](https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json)

Place these files in: `frontend/public/fonts/`

### Option 2: Use Alternative Fonts
You can use any Three.js compatible typeface font. Other options:
- `gentilis_regular.typeface.json`
- `optimer_regular.typeface.json`
- `droid_sans_regular.typeface.json`

### Option 3: Disable 3D Text Temporarily
If you want to test without fonts, you can comment out the `<Rotating3DText />` component in `Hero3DFull.jsx` or replace `Text3D` with regular `Text` component from Drei.

## Creating Custom Fonts

To convert your own fonts to typeface.json:
1. Visit [Facetype.js](http://gero3.github.io/facetype.js/)
2. Upload your .ttf or .otf font
3. Download the generated .json file
4. Place it in `/public/fonts/`

## Current Setup

The components will look for fonts at:
```
frontend/public/fonts/helvetiker_regular.typeface.json
frontend/public/fonts/helvetiker_bold.typeface.json
```

If fonts are missing, you'll see a loading error in the browser console. The page will still work, but 3D text won't render.

## Quick Fix Command

Run this in PowerShell from the frontend directory:

```powershell
# Create fonts directory if it doesn't exist
New-Item -ItemType Directory -Force -Path "public/fonts"

# Download helvetiker fonts
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_regular.typeface.json" -OutFile "public/fonts/helvetiker_regular.typeface.json"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/fonts/helvetiker_bold.typeface.json" -OutFile "public/fonts/helvetiker_bold.typeface.json"
```

## Verification

After adding fonts, restart your dev server and check the browser console for any font loading errors.
