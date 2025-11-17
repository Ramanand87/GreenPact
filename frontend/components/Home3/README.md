# Home3 - Full 3D Immersive Experience

## Overview
Home3 is a cutting-edge, fully 3D version of the GreenPact landing page that uses **Three.js** and **React Three Fiber** to create an immersive spatial experience. Unlike Home2 which uses pseudo-3D CSS effects, Home3 features real 3D objects, animations, and interactions.

## Features

### 🌟 Real 3D Elements
- **Three.js Canvas**: Every section includes an interactive 3D canvas
- **3D Geometries**: Spheres, boxes, toruses, and custom shapes
- **Particle Systems**: Floating particles and sparkles throughout
- **Holographic Effects**: Glass-like transparent materials with transmission

### 🎨 Components

#### 1. **Hero3DFull**
- Animated 3D spheres floating in space
- Rotating 3D text with "GreenPact 3D"
- Holographic cards with transmission materials
- Interactive particle system
- Orbit controls for exploration
- 3D stat cards at the bottom

#### 2. **Stats3DFull**
- Interactive 3D stat cards that float and rotate
- Each card has holographic borders and glow effects
- Sparkle particle effects around each stat
- Full orbital camera controls
- Real-time animations synchronized

#### 3. **FeatureShowcase3DFull**
- 6 feature cards arranged in 3D space
- Each card has:
  - Distorting sphere icons
  - Metallic materials with emissive properties
  - Hover effects with scale animations
  - Dynamic particle systems
- 2D feature grid below with detailed descriptions

#### 4. **Workflow3DFull**
- 5 phase nodes connected by animated lines
- Each node features:
  - Rotating sphere with glow rings
  - Pulsing ring animations
  - Numbered indicators
- Animated connection lines between phases
- Ambient particles floating in space
- 2D workflow details grid

#### 5. **Testimonials3DFull**
- 3D testimonial cards in space
- Holographic borders and effects
- Quote icons as 3D spheres
- 5-star rating visualization
- Orbiting ambient glow spheres
- Detailed testimonial grid below

#### 6. **CallToAction3DFull**
- Animated distorting cube centerpiece
- Orbiting icon spheres
- Pulsing concentric rings
- Floating 3D text
- 150+ sparkle particles
- Trust indicators and feature cards

## Technical Stack

### Dependencies (Already Installed)
- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for React Three Fiber
- `three` - Core 3D library
- `framer-motion` - 2D animations and transitions
- `lucide-react` - Icon library

### Key Technologies
- **Three.js**: 3D graphics library
- **React Three Fiber**: React renderer for Three.js
- **WebGL**: Hardware-accelerated 3D rendering
- **Drei Helpers**: Float, Text, RoundedBox, Sparkles, etc.

## 3D Features Used

### Materials
- `MeshStandardMaterial` - PBR materials with metalness/roughness
- `MeshBasicMaterial` - Unlit materials for glows
- `MeshDistortMaterial` - Animated distortion effects
- `MeshTransmissionMaterial` - Glass/holographic effects

### Geometries
- `SphereGeometry` - Spherical objects
- `BoxGeometry` - Cubic shapes
- `IcosahedronGeometry` - Complex polyhedrons
- `TorusGeometry` - Ring shapes
- `RingGeometry` - Flat rings
- `OctahedronGeometry` - 8-sided shapes

### Helpers (from Drei)
- `Float` - Floating animation
- `Text` - 3D text rendering
- `RoundedBox` - Rounded cube shapes
- `Sparkles` - Particle effects
- `OrbitControls` - Camera controls
- `Environment` - Environment lighting
- `Line` - 3D lines

### Lighting
- `ambientLight` - Global illumination
- `pointLight` - Omnidirectional lights
- `spotLight` - Focused cone lights

## Navigation & Access

To view the Home3 page:
1. Navigate to `/home3` in your browser
2. Or visit: `http://localhost:3000/home3`

## Performance Considerations

- All 3D scenes use optimized geometries
- Particle counts are balanced for performance
- WebGL rendering is hardware-accelerated
- Animations use `requestAnimationFrame` via `useFrame`

## Interactions

- **Drag to Rotate**: Click and drag in 3D canvases
- **Scroll to Zoom**: Zoom in/out in most scenes
- **Hover Effects**: Many 3D objects respond to hover
- **Auto-Rotate**: Most scenes have gentle auto-rotation

## Color Scheme

- Primary: Emerald/Green (#10b981)
- Secondary: Lime (#84cc16)
- Accent: Teal, Cyan variations
- Background: Dark slate (950, 900)
- Emissive glows throughout

## Browser Support

- Modern browsers with WebGL 2.0 support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile support (may have reduced particles)

## Future Enhancements

Potential additions:
- VR/AR support via WebXR
- Physics simulation with Cannon.js
- More complex 3D models (GLTF)
- Post-processing effects (bloom, depth of field)
- Interactive 3D contract visualization
- Real-time data integration

## Comparison with Home2

| Feature | Home2 | Home3 |
|---------|-------|-------|
| 3D Engine | CSS 3D Transforms | Three.js/WebGL |
| Interactivity | Limited | Full orbit controls |
| Particles | None | Extensive sparkles |
| Materials | CSS gradients | PBR materials |
| Lighting | None | Multiple light sources |
| Performance | Very fast | Hardware dependent |
| Immersion | Pseudo-3D | True 3D space |

## Development Notes

- Each component is self-contained with its own scene
- All 3D objects are optimized for performance
- Color values use Three.js Color objects
- Animations are time-based for consistency
- Responsive design maintained with 2D overlays

---

**Built with ❤️ using React Three Fiber and Three.js**
