#!/usr/bin/env python3
"""
PWA Icon Generator for IslamHub
Generates PNG icons in multiple sizes from source image
"""

import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("Required package not found!")
    print("\nPlease install Pillow:")
    print("  pip3 install Pillow")
    print("\nOr run:")
    print("  python3 -m pip install Pillow")
    sys.exit(1)

# Icon sizes needed for PWA
SIZES = [72, 96, 128, 144, 152, 192, 384, 512]

def generate_icons():
    """Generate PNG icons from source image in multiple sizes"""
    
    script_dir = Path(__file__).parent
    
    # Try to find source image (PNG or SVG)
    source_path = None
    for ext in ['icon-source.png', 'icon-source.jpg', 'icon.svg']:
        test_path = script_dir / ext
        if test_path.exists():
            source_path = test_path
            break
    
    if not source_path:
        print("Error: No source image found!")
        print("Please save your icon as: icon-source.png")
        return False
    
    print(f"Reading source from: {source_path}")
    print(f"Generating {len(SIZES)} icon sizes...\n")
    
    try:
        # Open source image
        with Image.open(source_path) as img:
            # Convert to RGBA if needed
            if img.mode != 'RGBA':
                img = img.convert('RGBA')
            
            success_count = 0
            
            for size in SIZES:
                try:
                    output_path = script_dir / f'icon-{size}x{size}.png'
                    
                    # Resize image with high quality
                    resized = img.resize((size, size), Image.Resampling.LANCZOS)
                    
                    # Save as PNG
                    resized.save(output_path, 'PNG', optimize=True)
                    
                    file_size = output_path.stat().st_size / 1024
                    print(f"✓ Created icon-{size}x{size}.png ({file_size:.1f} KB)")
                    success_count += 1
                    
                except Exception as e:
                    print(f"✗ Failed to create icon-{size}x{size}.png: {e}")
            
            print(f"\n{'='*50}")
            print(f"Successfully generated {success_count}/{len(SIZES)} icons")
            print(f"{'='*50}\n")
            
            if success_count == len(SIZES):
                print("✓ All icons generated successfully!")
                print("\nNext steps:")
                print("1. Icons are ready in: islamhub/assets/icons/")
                print("2. manifest.json is already configured")
                print("3. Service Worker will cache these icons")
                print("4. Test PWA install on your device")
                return True
            else:
                print("⚠ Some icons failed to generate")
                return False
                
    except Exception as e:
        print(f"Error opening source image: {e}")
        return False

if __name__ == '__main__':
    print("="*50)
    print("IslamHub PWA Icon Generator")
    print("="*50 + "\n")
    
    if generate_icons():
        sys.exit(0)
    else:
        sys.exit(1)
