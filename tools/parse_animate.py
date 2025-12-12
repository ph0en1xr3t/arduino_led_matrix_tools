import time
import os
import re
import sys
def parse_hex_values(hex_list):
    """
    Parses a list of 32-bit hex values into a single bitstream and returns the first 104 bits.
    """
    full_binary_string = ""
    for hex_val in hex_list:
        binary_string = bin(hex_val)[2:].zfill(32)
        full_binary_string += binary_string
    
    truncated_bits = full_binary_string[:104]
    
    bit_array = [int(bit) for bit in truncated_bits]
    
    return bit_array

if __name__ == "__main__":

    def parse_c_header(filename):
        """
        Parses a C header file to extract the HeartAnim array.
        Returns a list of lists, where each inner list contains the hex values and delay.
        """
        try:
            with open(filename, 'r') as f:
                content = f.read()
            match = re.search(r'\w+\[\]\[\d+\]\s*=\s*\{(.*?)\};', content, re.DOTALL)
            if not match:
                print(f"Error: Could not find a valid animation array in {filename}")
                return None
            array_content = match.group(1)
            rows = re.findall(r'\{([^\}]+)\}', array_content)
            parsed_data = []
            for row in rows:
                items = [item.strip() for item in row.split(',')]
                items = [item for item in items if item]
                row_data = []
                for item in items:
                    try:
                        if item.lower().startswith('0x'):
                            row_data.append(int(item, 16))
                        else:
                            row_data.append(int(item))
                    except ValueError:
                        continue
                
                if row_data:
                    parsed_data.append(row_data)
            
            return parsed_data
        except FileNotFoundError:
            print(f"Error: File {filename} not found.")
            return None

    def print_matrix(result, ascii_mode=False):
        if ascii_mode:
            symbols = {0: ".", 1: "o"}
        else:
            symbols = {0: "⬛", 1: "🟦"}
        rows = 8
        cols = 13
        output = []
        for i in range(rows):
            row_start = i * cols
            row_end = row_start + cols
            row_bits = result[row_start:row_end]
            output.append("".join(symbols[b] for b in row_bits))
        print("\n".join(output))

    import argparse
    parser = argparse.ArgumentParser(description="Parse and animate LED matrix data from a C header file.")
    parser.add_argument("filename", nargs="?", default="animation.h", help="Path to the C header file containing the animation array (default: animation.h)")
    parser.add_argument("--ascii", action="store_true", help="Use ASCII characters for legacy terminals")
    args = parser.parse_args()
    filename = args.filename

    anim = parse_c_header(filename)

    if anim:
        try:
            while True:
                for frame in anim:
                    if len(frame) < 5:
                        continue
                        
                    hex_values = frame[:4]
                    delay_ms = frame[4]
                    result = parse_hex_values(hex_values)                    
                    print("\033[H\033[J", end="")
                    
                    print(f"Animation from {filename} (Ctrl+C to stop)")
                    print_matrix(result, ascii_mode=args.ascii)
                    
                    time.sleep(delay_ms / 1000.0)
        except KeyboardInterrupt:
            print("\nAnimation stopped.")
    else:
        print("Failed to load animation data.")
