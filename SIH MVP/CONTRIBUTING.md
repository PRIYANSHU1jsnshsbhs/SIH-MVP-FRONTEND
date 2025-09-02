# Contributing to SIH MVP - Comprehensive India Geofencing System

Thank you for your interest in contributing to our Smart India Hackathon project! We welcome contributions from developers, designers, and domain experts.

## 🚀 Quick Start

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/YOUR_USERNAME/SIH-MVP-FRONTEND.git`
3. **Install dependencies**: `npm install`
4. **Create a branch**: `git checkout -b feature/your-feature-name`
5. **Make changes and test**
6. **Submit a pull request**

## 🎯 How to Contribute

### 🐛 Bug Reports
- Check if the issue already exists
- Use the bug report template
- Include steps to reproduce
- Add screenshots if applicable

### ✨ Feature Requests
- Describe the problem you're solving
- Explain your proposed solution
- Consider the impact on existing users
- Check if it aligns with project goals

### 🔧 Code Contributions

#### Areas where we need help:
- **New Data Sources**: Integration with government APIs
- **Risk Assessment**: Improving risk calculation algorithms
- **UI/UX**: Enhancing user interface and experience
- **Performance**: Optimizing map rendering and data loading
- **Testing**: Adding unit and integration tests
- **Documentation**: Improving code comments and guides

#### Coding Standards:
- Use **React Hooks** and functional components
- Follow **ES6+** JavaScript standards
- Use **meaningful variable names**
- Add **JSDoc comments** for functions
- Keep components **small and focused**
- Use **Tailwind CSS** for styling

#### File Structure:
```
src/
├── components/     # Reusable UI components
├── utils/          # Utility functions and data processing
├── services/       # API integrations
└── data/          # Static data files
```

## 🧪 Testing

Before submitting a PR:

1. **Test the application**:
   ```bash
   npm run dev
   ```

2. **Check for linting errors**:
   ```bash
   npm run lint
   ```

3. **Build successfully**:
   ```bash
   npm run build
   ```

4. **Test with different data scenarios**

## 📝 Pull Request Process

1. **Update documentation** if needed
2. **Add/update tests** for new features
3. **Follow the PR template**
4. **Request review** from maintainers
5. **Address feedback** promptly

### PR Guidelines:
- **Clear title** describing the change
- **Detailed description** of what and why
- **Link to related issues**
- **Screenshots** for UI changes
- **Breaking changes** clearly marked

## 🏗️ Development Environment

### Prerequisites:
- Node.js 18+
- npm or yarn
- Git
- Weather API key (free from weatherapi.com)

### Setup:
```bash
# Clone and setup
git clone https://github.com/PRIYANSHU1jsnshsbhs/SIH-MVP-FRONTEND.git
cd "SIH MVP"
npm install

# Environment setup
cp .env.example .env
# Add your API keys to .env

# Start development
npm run dev
```

### Tools we use:
- **React 18** with Hooks
- **Vite** for fast development
- **Tailwind CSS** for styling
- **Leaflet** for maps
- **ESLint** for code quality

## 🎨 Design Guidelines

### UI/UX Principles:
- **Emergency-first**: Critical information should be immediately visible
- **Color-coded**: Use consistent colors for risk levels
- **Mobile-friendly**: Responsive design for all devices
- **Accessible**: Follow WCAG guidelines
- **Fast**: Optimize for quick loading

### Risk Level Colors:
- 🔴 **Extreme**: #991b1b (Red)
- 🟠 **High**: #ef4444 (Orange-Red)
- 🟡 **Medium**: #f97316 (Orange)
- 🟢 **Low**: #fbbf24 (Yellow)

## 📊 Data Guidelines

### Adding New Risk Types:

1. **Define the data structure**:
```javascript
const NEW_RISK_ZONES = [
  {
    name: "Risk Zone Name",
    lat: 28.6139,
    lng: 77.2090,
    type: "risk_type",
    severity: "high|medium|low|extreme",
    // Additional properties
  }
]
```

2. **Create fetcher function**:
```javascript
export const fetchNewRiskData = async () => {
  // Process and return geofences
  return zones.map(zone => createGeofence({...}))
}
```

3. **Add to main aggregator** in `fetchAllRealTimeGeofencesExtended`

### Data Sources:
- **Real APIs**: Weather, earthquakes, traffic
- **Simulated Data**: Based on public information for demonstration
- **Government APIs**: When available and permitted

## 🔒 Security

### Guidelines:
- **Never commit API keys** or sensitive data
- **Use environment variables** for configuration
- **Validate all user inputs**
- **Follow security best practices**

### Reporting Security Issues:
- Email security issues privately
- Don't post security vulnerabilities in public issues
- We'll respond within 48 hours

## 🌍 Internationalization

Future considerations:
- **Multi-language support** for different Indian languages
- **Regional data** specific to states/districts
- **Cultural considerations** in UI design
- **Local emergency contacts** and procedures

## 📞 Getting Help

- **GitHub Discussions**: For questions and ideas
- **Issues**: For bugs and feature requests
- **Pull Requests**: For code contributions
- **Email**: For private communications

## 📜 Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please:

- **Be respectful** and inclusive
- **Focus on constructive feedback**
- **Help others learn and grow**
- **Report inappropriate behavior**

## 🏆 Recognition

Contributors will be acknowledged in:
- **README.md** contributors section
- **Release notes** for significant contributions
- **Project documentation**

## 🚀 Project Roadmap

### Phase 1 (Current):
- ✅ Basic geofencing system
- ✅ Multiple risk types
- ✅ Interactive map interface

### Phase 2 (Future):
- 🔄 Real government API integration
- 🔄 Mobile application
- 🔄 Real-time notifications
- 🔄 Machine learning predictions

### Phase 3 (Long-term):
- 🔄 Emergency response integration
- 🔄 Multi-language support
- 🔄 Offline capabilities
- 🔄 Advanced analytics

---

**Thank you for contributing to making India safer through technology!**

For any questions, feel free to reach out through GitHub issues or discussions.
