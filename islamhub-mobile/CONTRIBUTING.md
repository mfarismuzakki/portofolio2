# Contributing to IslamHub Mobile

First off, thank you for considering contributing to IslamHub Mobile! It's people like you that make IslamHub such a great tool for the Muslim Ummah.

## 📜 Code of Conduct

### Our Pledge

We as members, contributors, and leaders pledge to make participation in our community a harassment-free experience for everyone, regardless of age, body size, visible or invisible disability, ethnicity, sex characteristics, gender identity and expression, level of experience, education, socio-economic status, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Islamic Guidelines

As this is an Islamic application:
- All contributions should align with Islamic principles
- Content must be respectful and authentic
- Religious content must be verified from authentic sources
- Avoid controversial topics without proper scholarly guidance

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find that you don't need to create one. When you are creating a bug report, please include as many details as possible:

**Great Bug Report Template:**

```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Device Information:**
 - Device: [e.g. Samsung Galaxy S21]
 - Android Version: [e.g. 12]
 - App Version: [e.g. 1.0.0]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Clear title and description** of the enhancement
- **Step-by-step description** of the suggested enhancement
- **Explain why this enhancement would be useful** to most users
- **List some other apps where this enhancement exists**, if applicable

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. Ensure the test suite passes
4. Make sure your code follows the existing style
5. Write a clear commit message
6. Update documentation if needed

## 🔧 Development Setup

### Prerequisites

- Node.js (v16+)
- Android Studio
- JDK 11 or 17
- Git

### Setup Steps

```bash
# 1. Fork and clone the repo
git clone https://github.com/YOUR_USERNAME/islamhub-mobile.git
cd islamhub-mobile

# 2. Install dependencies
npm install

# 3. Copy files to www
./build-scripts.sh

# 4. Sync to Android
npx cap sync android

# 5. Open in Android Studio
npx cap open android
```

### Development Workflow

```bash
# 1. Create a new branch
git checkout -b feature/your-feature-name

# 2. Make your changes in the root files (js/, css/, etc)
code js/app.js

# 3. Copy to www/
./build-scripts.sh

# 4. Test changes
npx cap sync android
cd android && ./gradlew installDebug

# 5. Commit your changes
git add .
git commit -m "Add feature: description"

# 6. Push to your fork
git push origin feature/your-feature-name

# 7. Create Pull Request
```

## 📝 Coding Standards

### JavaScript

```javascript
// Use clear, descriptive variable names
const prayerTimes = await fetchPrayerTimes();

// Add comments for complex logic
// Calculate time difference in milliseconds
const timeDiff = nextPrayer.timestamp - Date.now();

// Use async/await instead of callbacks
async function loadQuranData() {
    try {
        const data = await fetch('/api/quran');
        return await data.json();
    } catch (error) {
        console.error('Failed to load Quran data:', error);
    }
}

// Use meaningful function names
function calculateInheritanceShares(heirs) {
    // Implementation
}
```

### CSS

```css
/* Use BEM naming convention */
.prayer-card { }
.prayer-card__title { }
.prayer-card__time { }
.prayer-card--highlighted { }

/* Group related properties */
.component {
    /* Positioning */
    position: relative;
    top: 0;
    
    /* Display & Box Model */
    display: flex;
    width: 100%;
    padding: 1rem;
    
    /* Visual */
    background: white;
    border: 1px solid #ddd;
    
    /* Typography */
    font-size: 1rem;
    color: #333;
    
    /* Animation */
    transition: all 0.3s ease;
}
```

### File Organization

```
js/
├── app.js              # Main application logic
├── apps/               # Feature modules
│   ├── adzan/
│   │   └── adzan-app.js
│   ├── alquran/
│   │   └── alquran-app.js
│   └── ...
├── data/               # Data files
│   ├── hadith-collection.js
│   └── ...
└── utils/              # Utility functions
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add prayer time widget
fix: correct Qibla direction calculation
docs: update installation guide
style: format code with prettier
refactor: simplify audio player logic
test: add unit tests for inheritance calculator
chore: update dependencies
```

**Examples:**

```
feat(quran): add bookmark sync functionality
fix(adzan): resolve audio playback issue on Android 12
docs(readme): add troubleshooting section
refactor(qibla): optimize compass performance
test(sholat): add tests for prayer time calculations
```

## 🧪 Testing

### Before Submitting PR

Run these tests:

```bash
# 1. Build test
cd android && ./gradlew assembleDebug

# 2. Install and manual test
./gradlew installDebug

# 3. Check for errors
adb logcat | grep -i error

# 4. Test on multiple Android versions if possible
```

### Testing Checklist

- [ ] App builds without errors
- [ ] No console errors in logcat
- [ ] Feature works as expected
- [ ] UI is responsive
- [ ] No memory leaks
- [ ] Tested on Android 8.0+
- [ ] Documentation updated

## 📚 Documentation

### Update Documentation When:

- Adding new features
- Changing existing functionality
- Fixing bugs that affect usage
- Updating dependencies

### Documentation Files

- `README.md` - User-facing documentation
- `DEVELOPMENT_GUIDE.md` - Developer setup and workflow
- `TESTING_GUIDE.md` - Testing procedures
- `CHANGELOG.md` - Version history
- Code comments - Inline documentation

## 🎨 UI/UX Guidelines

### Design Principles

1. **Islamic Aesthetics**: Clean, minimal, respectful
2. **Accessibility**: Easy to use for all age groups
3. **Performance**: Fast and responsive
4. **Consistency**: Uniform design across features

### Color Palette

```css
--primary-green: #1a472a;      /* Main brand color */
--light-green: #2d5a3d;        /* Secondary */
--accent-gold: #d4af37;        /* Accents */
--text-dark: #1a1a1a;          /* Main text */
--text-light: #666666;         /* Secondary text */
--background: #f5f5f5;         /* Background */
```

### Typography

- **Headers**: Use clear hierarchy (h1 > h2 > h3)
- **Body**: Readable font size (16px base)
- **Arabic**: Use proper Arabic fonts with ligatures

## 🌍 Internationalization

### Adding Translations

```javascript
// lang/en.js
export const en = {
    prayer_times: "Prayer Times",
    next_prayer: "Next Prayer",
    // ...
};

// lang/id.js
export const id = {
    prayer_times: "Waktu Sholat",
    next_prayer: "Sholat Berikutnya",
    // ...
};
```

### Guidelines

- Keep translations accurate and culturally appropriate
- Test RTL layout for Arabic
- Ensure religious terms are properly translated

## 🔒 Security

### Reporting Security Issues

**DO NOT** create public GitHub issues for security vulnerabilities.

Instead:
1. Email: security@islamhub.app
2. Provide detailed description
3. Include steps to reproduce
4. Suggest a fix if possible

### Security Best Practices

- Never commit API keys or secrets
- Validate all user inputs
- Use HTTPS for all API calls
- Sanitize data before storage
- Follow Android security guidelines

## 🏷️ Versioning

We use [Semantic Versioning](https://semver.org/):

- **MAJOR** version: Incompatible API changes
- **MINOR** version: Add functionality (backwards compatible)
- **PATCH** version: Bug fixes (backwards compatible)

Example: `1.2.3`
- 1 = Major version
- 2 = Minor version
- 3 = Patch version

## 📦 Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release branch
4. Build and test thoroughly
5. Create signed APK
6. Tag release in Git
7. Create GitHub release
8. Announce on social media

## 💡 Feature Requests

We love feature requests! Before submitting:

1. **Search existing issues** - Maybe it's already requested
2. **Provide context** - Why is this feature useful?
3. **Be specific** - Detailed description helps
4. **Consider alternatives** - Are there other solutions?

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
A clear description of the problem.

**Describe the solution you'd like**
A clear description of what you want to happen.

**Describe alternatives you've considered**
Other solutions you've thought about.

**Additional context**
Screenshots, mockups, or examples.
```

## 🤔 Questions?

- Check [documentation](README.md)
- Search [existing issues](https://github.com/yourusername/islamhub-mobile/issues)
- Ask in [discussions](https://github.com/yourusername/islamhub-mobile/discussions)

## 🙏 Recognition

Contributors will be:
- Listed in `CONTRIBUTORS.md`
- Credited in release notes
- Mentioned on social media (with permission)
- Added to "About" section in app (major contributions)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Thank You! 🌟

Every contribution, no matter how small, helps make IslamHub better for Muslims around the world.

*Jazakallahu Khairan for your interest in contributing!*

**May Allah accept our efforts and make this project beneficial for the Ummah.**

---

*Last updated: November 2025*
