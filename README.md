# Creating and Playing LED Matrix Animations for Arduino® Uno Q 

A set of tools designed to create, edit, and play animations for a 13x8 LED matrix. Whether you prefer a visual editor or working with ASCII art, these tools have you covered.

## The Toolkit

1.  **Animation Editor**: A web-based visual editor to draw frames and export C code.
2.  **Hex Parser (`tools/parse_and_animate.py`)**: A Python script to play back animations in your terminal from C header files.
3.  **Generator (`tools/generate_animation.py`)**: A Python script to convert ASCII art text files into C arrays.

---

## 1. Visual Animation Editor

The easiest way to get started is with the visual editor.

### How to use
1.  Navigate to the `animation_editor` folder.
2.  Open `index.html` in your web browser.

### Features
-   **Draw**: Click or drag on the 13x8 grid to toggle LEDs.
-   **Timeline**: Add, duplicate, or delete frames to build your sequence.
-   **Preview**: Hit "Play" to see your animation in action.
-   **Import/Export**:
    -   **Export C**: Generates the C array code needed for your microcontroller.
    -   **Import C**: Paste existing C code to edit it.
-   **Mobile Friendly**: Works great on your phone for on-the-go editing.

---

## 2. Playing Animations (`parse_animate.py`)

Once you have your animation exported as a C header file (e.g., `animation.h`), you can preview it directly in your terminal.

### Usage
Run the script with Python 3:

```bash
python3 parse_animate.py [filename] [options]
```

### Arguments
-   `filename`: Path to the C header file (default: `animation.h`).
-   `--ascii`: Use simple ASCII characters (`.` and `o`) instead of Unicode squares. Useful for legacy terminals.

### Example
```bash
#if unicode support is not present else without --ascii
python3 parse_animate.py animation.h --ascii 
```

### Input Format
The script expects a C header file containing an array of 32-bit integers. The array name doesn't matter.

```c
const uint32_t led_animation[][5] = {
    {0xHEX1, 0xHEX2, 0xHEX3, 0xHEX4, DELAY_MS},
    // ... more frames
};
```

---

## 3. ASCII Art Generator (`generate_animation.py`)

If you prefer text editors, you can draw your frames using ASCII art and convert them.

### Input Format (`animation_input.txt`)
Draw your 13x8 frames using `.` (off) and `#` (on). Separate frames with an empty line.

```bash
...##...##...
..####.####..
..#########..
...#######...
....#####....
.....###.....
......#......
.............

...##...##...
.............
..#########..
...#######...
....#####....
.....###.....
......#......
.............
```

### Usage
```bash
cd tools
python3 generate_animation.py animation_input.txt
```

This will output the corresponding C array code to the console, which you can save to a file.

---

## Workflow Summary

1.  **Create**: Use the **Web Editor** to draw your animation visually OR write an **ASCII text file**.
2.  **Export**: Get the C code array (e.g., `const uint32_t Anim[][5] = ...`).
3.  **Save**: Save this code into a header file (e.g., `animation.h`).
4.  **Preview**: Run `python3 parse_hex.py animation.h` to watch it in your terminal.
5.  **Deploy**: Copy the C code into your microcontroller project.
