# IslamHub CSS Architecture

This directory contains modular CSS files for better maintainability and organization.

## Structure

```
css/
├── main.css              # Main entry point - imports all modules
├── variables.css         # CSS custom properties (colors, fonts, shadows)
├── base.css             # Base styles, resets, scrollbar
├── animations.css       # Keyframe animations
├── hero.css            # Hero section and landing page
├── navigation.css      # App navigation and menu
├── cards.css           # Card components
├── widgets.css         # Floating widgets, notifications
├── components.css      # App components, loading states
├── adzan.css          # Adzan-specific styles
└── responsive.css     # Mobile responsive styles
```

## File Descriptions

### 1. **variables.css** (45 lines)
- CSS custom properties
- Color palette (cyan, blue, green, purple)
- Typography (Orbitron, Rajdhani)
- Shadows and gradients

### 2. **base.css** (85 lines)
- HTML/Body base styles
- Custom scrollbar styling
- Background effects
- Global resets

### 3. **animations.css** (80 lines)
- Grid animation
- Floating particles
- Bounce, fade, pulse effects
- Loading spinner animations

### 4. **hero.css** (210 lines)
- Hero section
- Hero content and text
- Motivational quote section
- Scroll indicator

### 5. **navigation.css** (195 lines)
- App navigation bar
- Navigation tabs (desktop)
- Bottom navigation (mobile)
- Active states and transitions

### 6. **cards.css** (285 lines)
- App cards (large)
- Compact cards (small)
- Badge styles (LIVE, UJI COBA, SOON)
- Hover effects and animations

### 7. **widgets.css** (195 lines)
- Floating prayer widget
- Notification container
- Install prompt
- Toast messages

### 8. **components.css** (165 lines)
- App component containers
- Component loading states
- Component wrapper (iframe)
- Footer

### 9. **adzan.css** (345 lines)
- Prayer table styling
- Hadith ticker
- Controls and buttons
- Sunnah section
- Row highlighting

### 10. **responsive.css** (365 lines)
- Mobile breakpoints (768px, 480px)
- Navigation adjustments
- Card responsive layouts
- Font size scaling

## Usage

The modular structure is automatically loaded via `main.css`:

```html
<link rel="stylesheet" href="css/main.css">
```

## Benefits

1. **Better Organization**: Each file has a specific purpose
2. **Easier Maintenance**: Find and edit styles quickly
3. **Improved Performance**: Browser can cache individual files
4. **Team Collaboration**: Multiple developers can work on different files
5. **Scalability**: Easy to add new modules as the app grows

## Maintenance

- Keep each file focused on its specific domain
- Use meaningful CSS class names
- Document complex selectors with comments
- Test responsive breakpoints after changes

## Backup

Original monolithic file backed up as: `style.css.backup` (2173 lines)

---

**Last Updated**: October 18, 2025
**Maintained by**: IslamHub Development Team
