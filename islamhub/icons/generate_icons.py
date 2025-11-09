#!/usr/bin/env python3
"""
PWA Icon Generator for IslamHub
Generates PNG icons in multiple sizes from SVG source
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
    import cairosvg
except ImportError:
    print("Required packages not found!")
    print("\nPlease install required packages:")
    print("  pip3 install Pillow cairosvg")
    print("\nOr run:")
    print("  python3 -m pip install Pillow cairosvg")
    sys.exit(1)

# Icon sizes needed for PWA
SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

def generate_icons():
    """Generate PNG icons from SVG in multiple sizes"""
    
    script_dir = Path(__file__).parent
    svg_path = script_dir / 'icon.svg'
    
    if not svg_path.exists():
        print(f"Error: {svg_path} not found!")
        return False
    
    print(f"Reading SVG from: {svg_path}")
    print(f"Generating {len(SIZES)} icon sizes...\n")
    
    success_count = 0
    
    for size in SIZES:
        try:
            output_path = script_dir / f'icon-{size}x{size}.png'
            
            # Convert SVG to PNG using cairosvg
            cairosvg.svg2png(
                url=str(svg_path),
                write_to=str(output_path),
                output_width=size,
                output_height=size
            )
            
            print(f"Generated: icon-{size}x{size}.png")
            success_count += 1
            
        except Exception as e:
            print(f"Failed to generate {size}x{size}: {e}")
    
    print(f"\nSuccessfully generated {success_count}/{len(SIZES)} icons!")
    
    if success_count == len(SIZES):
        print("\nAll icons generated successfully!")
        print("📱 Your PWA is now ready to be installed!")
        return True
    else:
        print(f"\nWarning: Only {success_count} out of {len(SIZES)} icons were generated")
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("IslamHub PWA Icon Generator")
    print("=" * 60)
    print()
    
    success = generate_icons()
    
    if success:
        print("\nNext steps:")
        print("1. Icons are saved in the assets/icons/ folder")
        print("2. Open your PWA in Chrome on mobile")
        print("3. Look for the 'Install' option in the menu")
        print("4. Test the installation!")
    
    sys.exit(0 if success else 1)
