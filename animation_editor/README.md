# LED Matrix Animation Editor

A web-based visual editor for creating animations on a 13x8 LED matrix. Design frames, preview animations, and export C code for microcontrollers.

![Animation Editor Main Interface](screenshots/main-interface.png)

## Features

### 🎨 Visual Grid Editor
- **13x8 LED Matrix**: Click or drag to toggle individual LEDs on/off
- **Touch Support**: Works on mobile devices with touch drawing
- **Real-time Preview**: See your changes instantly with glowing LED effects

![Grid Editor](screenshots/grid-editor.png)

### 🎬 Frame Management
- **Add Frames**: Create new blank frames with the `+` button
- **Duplicate**: Copy the current frame to create variations
- **Delete**: Remove unwanted frames
- **Navigate**: Use `<` and `>` buttons or click frames in the sidebar

![Frame Management](screenshots/frame-management.png)

### ⏱️ Timing Control
- **Delay Slider**: Adjust frame duration from 10ms to 500ms
- **Per-frame Timing**: Each frame can have its own delay value
- **Real-time Display**: See the current delay value as you adjust

![Delay Slider](screenshots/delay-slider.png)

### ▶️ Animation Preview
- **Play/Stop**: Preview your complete animation in the browser
- **Accurate Timing**: Respects individual frame delays

![Animation Preview](screenshots/animation-preview.png)

### 📤 Import/Export
- **Export C**: Generate microcontroller-ready C code
- **Import C**: Paste existing C code to continue editing
- **Standard Format**: Compatible with common LED matrix libraries

![Import Export](screenshots/import-export.png)

## Getting Started

### Quick Start
1. Open `index.html` in any modern web browser
2. Click on LEDs to draw your first frame
3. Add more frames using the `+` button
4. Adjust timing with the delay slider
5. Click **Export C** to get your code

### Drawing Tips
- **Click**: Toggle a single LED
- **Click & Drag**: Paint multiple LEDs (turns them ON)
- **Touch Devices**: Tap and swipe to draw

## Interface Overview

```
┌─────────────────────────────────────────────────────────┐
│  LED Matrix Animator          [Import C] [Export C]     │  ← Header
├─────────────┬───────────────────────────────────────────┤
│   Frames    │                                           │
│   [+]       │         ┌─────────────────────┐           │
│             │         │                     │           │
│  Frame 1    │         │    13x8 LED Grid    │           │  ← Editor Area
│  Frame 2    │         │                     │           │
│  Frame 3    │         └─────────────────────┘           │
│   ...       │                                           │
│             │      [<] [Play] [>] [Clear] [Dup] [Del]   │  ← Controls
│             │              Delay: 55ms ────○────        │  ← Slider
├─────────────┴───────────────────────────────────────────┤
│  [C code output / input textarea]                       │  ← Output Panel
└─────────────────────────────────────────────────────────┘
```

## Export Format

The editor exports C code in this format:

```c
const uint32_t HeartAnim[][5] = {
    {0x00000000, 0x00000000, 0x00000000, 0x00000000, 55},
    {0x0c300c30, 0x1e781e78, 0x3ffc1ffc, 0x0ff807f0, 100},
    // ... more frames
};
```

Each row contains:
- **4 hex values**: 32-bit chunks encoding the 104 LED states (8×13)
- **1 delay value**: Frame duration in milliseconds

## Mobile Support

The editor is fully responsive and works on mobile devices:

![Mobile View](screenshots/mobile-view.png)

- Sidebar becomes horizontal scrollable frame list
- Grid scales to fit screen width
- Touch drawing supported
- Import/Export panel visible at bottom

## Browser Compatibility

- ✅ Chrome / Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome for Android)

## File Structure

```
animation_editor/
├── index.html      # Main HTML structure
├── style.css       # Styling and responsive design
├── script.js       # Animation logic and UI interactions
├── README.md       # This documentation
└── screenshots/    # Documentation images
    ├── main-interface.png
    ├── grid-editor.png
    ├── frame-management.png
    ├── delay-slider.png
    ├── animation-preview.png
    ├── import-export.png
    └── mobile-view.png
```

## Usage with Microcontrollers

1. Design your animation in the editor
2. Click **Export C** to generate code
3. Copy the generated array to your project
4. Use your LED matrix library to display frames

Example usage (pseudo-code):
```c
#include "animation.h"

void playAnimation() {
    for (int i = 0; i < FRAME_COUNT; i++) {
        displayFrame(HeartAnim[i]);
        delay(HeartAnim[i][4]);  // Delay is the 5th element
    }
}
```

## Tips & Tricks

1. **Start Simple**: Begin with 2-3 frames before creating complex animations
2. **Use Duplicate**: Copy a frame and make small changes for smooth transitions
3. **Test Often**: Use Play to preview frequently while editing
4. **Adjust Timing**: Slower delays (100-200ms) work better for detailed frames
5. **Import to Edit**: Paste existing C code to modify animations

## Keyboard Shortcuts

Currently, all interactions are mouse/touch based. Keyboard shortcuts may be added in future versions.

## Troubleshooting

### Animation won't play
- Ensure you have at least one frame
- Check that frame delays are reasonable (10-500ms)

### Import not working
- Paste the complete C array including `{` and `}`
- Ensure hex values are in `0x00000000` format
- Each frame needs exactly 4 hex values + 1 delay

### LEDs not responding on mobile
- Make sure you're using a supported browser
- Try refreshing the page
- Ensure touch events aren't being blocked

---

## Screenshots Setup

To add screenshots to this documentation:

1. Create a `screenshots` folder in the `animation_editor` directory
2. Take screenshots of each feature
3. Save them with the names referenced above:
   - `main-interface.png`
   - `grid-editor.png`
   - `frame-management.png`
   - `delay-slider.png`
   - `animation-preview.png`
   - `import-export.png`
   - `mobile-view.png`

Recommended screenshot dimensions:
- Desktop views: 1200x800px
- Mobile views: 400x800px
