import sys

def parse_frames(filename):
    """
    Parses a text file containing animation frames.
    Frames are separated by empty lines.
    Returns a list of frames, where each frame is a list of strings (rows).
    """
    with open(filename, 'r') as f:
        content = f.read()   
    raw_frames = content.strip().split('\n\n')    
    frames = []
    for rf in raw_frames:
        lines = rf.strip().split('\n')
        lines = [l for l in lines if l.strip()]
        if lines:
            frames.append(lines)    
    return frames

def frame_to_hex(frame_grid):
    """
    Converts a 13x8 grid (list of strings) into 4 32-bit hex values.
    """
    if len(frame_grid) != 8:
        print(f"Warning: Frame has {len(frame_grid)} rows, expected 8. Padding/Truncating.")
        if len(frame_grid) < 8:
            frame_grid += [''] * (8 - len(frame_grid))
        else:
            frame_grid = frame_grid[:8]

    full_bit_string = ""
    for row in frame_grid:
        row = row.ljust(13, '.')[:13]        
        for char in row:
            if char in ['#', '1', '@', '*']:
                full_bit_string += "1"
            else:
                full_bit_string += "0"
    
    full_bit_string += "0" * 24
    
    hex_values = []
    for i in range(4):
        chunk = full_bit_string[i*32 : (i+1)*32]
        val = int(chunk, 2)
        hex_values.append(val)
        
    return hex_values

def generate_c_array(frames, delay_ms=55):
    output = "const uint32_t HeartAnim[][5] = {\n"
    
    for frame in frames:
        hex_vals = frame_to_hex(frame)
        hex_str = ", ".join([f"0x{val:08x}" for val in hex_vals])
        output += f"    {{{hex_str}, {delay_ms}}},\n"
        
    output += "};\n"
    return output

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 generate_anim.py <input_file> [delay_ms]")
        sys.exit(1)     
    input_file = sys.argv[1]
    delay = 55
    if len(sys.argv) > 2:
        try:
            delay = int(sys.argv[2])
        except ValueError:
            pass
            
    frames = parse_frames(input_file)
    c_code = generate_c_array(frames, delay)    
    print(c_code)
