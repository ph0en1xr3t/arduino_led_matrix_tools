const ROWS = 8;
const COLS = 13;
let isPainting = false;
let paintState = null;

let frames = [
    {
        grid: Array(ROWS).fill().map(() => Array(COLS).fill(0)),
        delay: 55
    }
];
let currentFrameIndex = 0;
let isPlaying = false;
let playInterval;

const matrixGrid = document.getElementById('matrixGrid');
const frameList = document.getElementById('frameList');
const frameDelayInput = document.getElementById('frameDelay');
const delayValue = document.getElementById('delayValue');
const outputCode = document.getElementById('outputCode');
const playBtn = document.getElementById('playBtn');
const stopBtn = document.getElementById('stopBtn');

function initGrid() {
    matrixGrid.innerHTML = '';
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const led = document.createElement('div');
            led.className = 'led';
            led.dataset.row = r;
            led.dataset.col = c;
            led.addEventListener('mousedown', () => toggleLed(r, c));
            led.addEventListener('mouseenter', (e) => {
                if (e.buttons === 1) toggleLed(r, c, true);
            });
            matrixGrid.appendChild(led);
        }
    }
    matrixGrid.addEventListener('touchstart', handleTouchStart, { passive: false });
    matrixGrid.addEventListener('touchmove', handleTouchMove, { passive: false });
    matrixGrid.addEventListener('touchend', () => { isPainting = false; paintState = null; });
}

function handleTouchStart(e) {
    if (e.target.classList.contains('led')) {
        e.preventDefault();
        isPainting = true;
        const r = parseInt(e.target.dataset.row);
        const c = parseInt(e.target.dataset.col);
        const grid = frames[currentFrameIndex].grid;
        paintState = grid[r][c] ? 0 : 1;

        applyPaint(r, c);
    }
}

function handleTouchMove(e) {
    if (!isPainting) return;
    e.preventDefault();

    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);

    if (target && target.classList.contains('led')) {
        const r = parseInt(target.dataset.row);
        const c = parseInt(target.dataset.col);
        applyPaint(r, c);
    }
}

function applyPaint(r, c) {
    const grid = frames[currentFrameIndex].grid;
    if (grid[r][c] !== paintState) {
        grid[r][c] = paintState;
        renderGrid();
        updateFrameListItem(currentFrameIndex);
    }
}

function toggleLed(r, c, forceState = null) {
    const grid = frames[currentFrameIndex].grid;
    if (forceState !== null) {
        grid[r][c] = 1;
    } else {
        grid[r][c] = grid[r][c] ? 0 : 1;
    }
    renderGrid();
    updateFrameListItem(currentFrameIndex);
}

function renderGrid() {
    const grid = frames[currentFrameIndex].grid;
    const leds = matrixGrid.children;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const index = r * COLS + c;
            const led = leds[index];
            if (grid[r][c]) {
                led.classList.add('active');
            } else {
                led.classList.remove('active');
            }
        }
    }
    frameDelayInput.value = frames[currentFrameIndex].delay;
    delayValue.textContent = frames[currentFrameIndex].delay;
}

function renderFrameList() {
    frameList.innerHTML = '';
    frames.forEach((frame, index) => {
        const li = document.createElement('li');
        li.className = `frame-item ${index === currentFrameIndex ? 'active' : ''}`;
        li.innerHTML = `<span>Frame ${index + 1}</span> <small>${frame.delay}ms</small>`;
        li.onclick = () => selectFrame(index);
        frameList.appendChild(li);
    });
}

function updateFrameListItem(index) {
    const items = frameList.children;
    if (items[index]) {
        items[index].querySelector('small').textContent = `${frames[index].delay}ms`;
    }
}

function selectFrame(index) {
    if (index < 0 || index >= frames.length) return;
    currentFrameIndex = index;
    renderGrid();
    renderFrameList();
}

function addFrame() {
    frames.push({
        grid: Array(ROWS).fill().map(() => Array(COLS).fill(0)),
        delay: 55
    });
    selectFrame(frames.length - 1);
}

function duplicateFrame() {
    const currentGrid = frames[currentFrameIndex].grid;
    const newGrid = currentGrid.map(row => [...row]);
    const newFrame = {
        grid: newGrid,
        delay: frames[currentFrameIndex].delay
    };
    frames.splice(currentFrameIndex + 1, 0, newFrame);
    selectFrame(currentFrameIndex + 1);
}

function deleteFrame() {
    if (frames.length <= 1) {
        frames[0].grid = Array(ROWS).fill().map(() => Array(COLS).fill(0));
        renderGrid();
        return;
    }
    frames.splice(currentFrameIndex, 1);
    if (currentFrameIndex >= frames.length) {
        currentFrameIndex = frames.length - 1;
    }
    renderGrid();
    renderFrameList();
}

function clearFrame() {
    frames[currentFrameIndex].grid = Array(ROWS).fill().map(() => Array(COLS).fill(0));
    renderGrid();
}

function frameToHex(grid) {
    let fullBitString = "";
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            fullBitString += grid[r][c] ? "1" : "0";
        }
    }
    fullBitString += "0".repeat(24);

    const hexValues = [];
    for (let i = 0; i < 4; i++) {
        const chunk = fullBitString.substring(i * 32, (i + 1) * 32);
        const val = parseInt(chunk, 2);
        hexValues.push("0x" + val.toString(16).padStart(8, '0'));
    }
    return hexValues;
}

function exportCode() {
    let output = "const uint32_t led_animation[][5] = {\n";
    frames.forEach(frame => {
        const hexVals = frameToHex(frame.grid);
        output += `    {${hexVals.join(', ')}, ${frame.delay}},\n`;
    });
    output += "};";
    outputCode.value = output;
}

function hexToFrame(hexVals) {
    let fullBitString = "";
    hexVals.forEach(hex => {
        // Convert hex to 32-bit binary string
        let bin = parseInt(hex, 16).toString(2);
        bin = bin.padStart(32, '0');
        fullBitString += bin;
    });

    // We expect 128 bits total (4 * 32)
    // The grid is 8 * 13 = 104 bits

    const grid = Array(ROWS).fill().map(() => Array(COLS).fill(0));

    let bitIndex = 0;
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (bitIndex < fullBitString.length) {
                grid[r][c] = fullBitString[bitIndex] === '1' ? 1 : 0;
                bitIndex++;
            }
        }
    }
    return grid;
}

function importCode() {
    const code = outputCode.value;
    if (!code.trim()) {
        alert("Please paste the C code into the text area below first.");
        return;
    }

    // Regex to find rows: {0x..., 0x..., 0x..., 0x..., delay}
    const rowRegex = /\{([^\}]+)\}/g;
    const matches = [...code.matchAll(rowRegex)];

    if (matches.length === 0) {
        alert("No valid frames found in the code.");
        return;
    }

    const newFrames = [];

    matches.forEach(match => {
        const content = match[1];
        const parts = content.split(',').map(p => p.trim());

        // Expect at least 5 parts (4 hex + 1 delay)
        if (parts.length >= 5) {
            const hexVals = parts.slice(0, 4);
            const delay = parseInt(parts[4]);

            const grid = hexToFrame(hexVals);
            newFrames.push({
                grid: grid,
                delay: isNaN(delay) ? 55 : delay
            });
        }
    });

    if (newFrames.length > 0) {
        frames = newFrames;
        currentFrameIndex = 0;
        renderGrid();
        renderFrameList();
        alert(`Imported ${newFrames.length} frames.`);
    } else {
        alert("Failed to parse frames.");
    }
}

function playAnimation() {
    if (isPlaying) return;
    isPlaying = true;
    playBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';

    let playIndex = 0;

    const nextFrame = () => {
        if (!isPlaying) return;
        selectFrame(playIndex);
        const delay = frames[playIndex].delay;
        playIndex = (playIndex + 1) % frames.length;
        playInterval = setTimeout(nextFrame, delay);
    };

    nextFrame();
}

function stopAnimation() {
    isPlaying = false;
    clearTimeout(playInterval);
    playBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
}

document.getElementById('addFrameBtn').onclick = addFrame;
document.getElementById('prevFrameBtn').onclick = () => selectFrame(currentFrameIndex - 1);
document.getElementById('nextFrameBtn').onclick = () => selectFrame(currentFrameIndex + 1);
document.getElementById('dupBtn').onclick = duplicateFrame;
document.getElementById('delBtn').onclick = deleteFrame;
document.getElementById('clearBtn').onclick = clearFrame;
document.getElementById('playBtn').onclick = playAnimation;
document.getElementById('stopBtn').onclick = stopAnimation;
document.getElementById('importBtn').onclick = importCode;
document.getElementById('exportBtn').onclick = exportCode;

frameDelayInput.oninput = (e) => {
    let val = parseInt(e.target.value);
    frames[currentFrameIndex].delay = val;
    delayValue.textContent = val;
    updateFrameListItem(currentFrameIndex);
};

initGrid();
renderFrameList();
renderGrid();
