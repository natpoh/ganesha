import re
import sys

def parse_svg_path(d):
    # Regex to find commands and coordinate pairs
    # Potrace uses spaces and - signs effectively
    # Commands: M (abs), m (rel), c (rel cubic), l (rel line), z (close)
    
    # Split by commands
    tokens = re.findall(r'([A-Za-z])|([-+]?[0-9]*\.?[0-9]+)', d)
    
    current_x = 0
    current_y = 0
    
    min_x = float('inf')
    max_x = float('-inf')
    min_y = float('inf')
    max_y = float('-inf')
    
    def update_bounds(x, y):
        nonlocal min_x, max_x, min_y, max_y
        if x < min_x: min_x = x
        if x > max_x: max_x = x
        if y < min_y: min_y = y
        if y > max_y: max_y = y

    cmd = None
    
    # Flatten tokens list of tuples
    flat_tokens = []
    for t in tokens:
        if t[0]: flat_tokens.append(t[0])
        elif t[1]: flat_tokens.append(float(t[1]))
        
    i = 0
    while i < len(flat_tokens):
        val = flat_tokens[i]
        if isinstance(val, str):
            cmd = val
            i += 1
            if cmd == 'z' or cmd == 'Z':
                # Close path, usually goes back to start, but for bbox we just ignore specific close line unless needed
                continue
        else:
            # We have coordinates, behavior depends on cmd
            if cmd == 'M':
                # Absolute move x y
                current_x = val
                current_y = flat_tokens[i+1]
                update_bounds(current_x, current_y)
                i += 2
                # Subsequent pairs are treated as L (absolute) usually, but potrace might use explicit commands
                # Potrace often does M ... c ...
                # If implict L happens, we need to handle it. 
                # But SVG spec says: "If a moveto is followed by multiple pairs of coordinates, the subsequent pairs are treated as implicit lineto commands"
                cmd = 'L' 
            
            elif cmd == 'm':
                # Relative move dx dy
                current_x += val
                current_y += flat_tokens[i+1]
                update_bounds(current_x, current_y)
                i += 2
                cmd = 'l' # Implicit lineto relative

            elif cmd == 'l':
                # Relative line dx dy
                current_x += val
                current_y += flat_tokens[i+1]
                update_bounds(current_x, current_y)
                i += 2
            
            elif cmd == 'c':
                # Relative cubic bezier: dx1 dy1 dx2 dy2 dx dy
                # We check the end point. For tight bbox we should check control points too.
                # CP1
                cp1_x = current_x + val
                cp1_y = current_y + flat_tokens[i+1]
                update_bounds(cp1_x, cp1_y)
                
                # CP2
                cp2_x = current_x + flat_tokens[i+2]
                cp2_y = current_y + flat_tokens[i+3]
                update_bounds(cp2_x, cp2_y)
                
                # End Point
                current_x += flat_tokens[i+4]
                current_y += flat_tokens[i+5]
                update_bounds(current_x, current_y)
                
                i += 6
            else:
                # Unhandled command, skip one number (unsafe but simple for now)
                print(f"Unhandled command or data: {cmd} {val}")
                i += 1
                
    return min_x, max_x, min_y, max_y

def main():
    try:
        with open(r'c:\wsl\ganesha\assets\art_logo.svg', 'r') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    # Extract all paths d="..."
    path_data = re.findall(r'd="([^"]+)"', content)
    full_path_string = " ".join(path_data)
    
    # Potrace output usually matches the coordinate system logic we saw
    # Just one huge string usually works or concatenated
    
    if not full_path_string:
        print("No path data found")
        return

    min_x, max_x, min_y, max_y = parse_svg_path(full_path_string)
    
    print(f"Internal Bounds: X[{min_x}, {max_x}], Y[{min_y}, {max_y}]")
    
    # Calculate SVG coordinates
    # transform="translate(0,2208) scale(0.1,-0.1)"
    # SVG_X = 0.1 * X_int
    # SVG_Y = 2208 - 0.1 * Y_int
    
    # Y is flipped, so Y_max_int approaches Y_min_svg (top)
    svg_x1 = 0.1 * min_x
    svg_x2 = 0.1 * max_x
    
    svg_y1 = 2208 - 0.1 * max_y
    svg_y2 = 2208 - 0.1 * min_y
    
    print(f"SVG Coordinates: x={svg_x1:.2f}, y={svg_y1:.2f}, w={svg_x2-svg_x1:.2f}, h={svg_y2-svg_y1:.2f}")

    # Padding
    padding = 10
    final_x = svg_x1 - padding
    final_y = svg_y1 - padding
    final_w = (svg_x2 - svg_x1) + (padding * 2)
    final_h = (svg_y2 - svg_y1) + (padding * 2)
    
    print(f"Proposed ViewBox: {final_x:.2f} {final_y:.2f} {final_w:.2f} {final_h:.2f}")

if __name__ == "__main__":
    main()
