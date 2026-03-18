# Contributing to BizCollab ERP/CRM

First off, thank you for considering contributing to BizCollab! It's people like you that make BizCollab such a great tool for businesses.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to bizcollab@gmail.com.

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**

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

**Environment:**

- OS: [e.g. Windows 10, macOS 12.0, Ubuntu 22.04]
- Browser: [e.g. Chrome 120, Firefox 121]
- Node.js version: [e.g. 18.17.0]
- MongoDB version: [e.g. 6.0.5]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Features

Feature suggestions are welcome! Please provide:

**Feature Request Template:**

```markdown
**Is your feature request related to a problem?**
A clear and concise description of what the problem is.

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### Code Contributions

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Setup

### Prerequisites

- Node.js 18+
- MongoDB 6+
- Git

### Setup Steps

1. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/bizcollab-erp-crm.git
   cd bizcollab-erp-crm
   ```

2. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/bizcollab-erp-crm.git
   ```

3. **Install dependencies**

   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your configuration

   # Frontend
   cd ../frontend
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Start development servers**

   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

## Coding Standards

### JavaScript/React

- Use ES6+ features
- Follow Airbnb JavaScript Style Guide
- Use functional components with hooks
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable and function names

### File Naming

- Components: PascalCase (e.g., `ClientList.jsx`)
- Utilities: camelCase (e.g., `formatMoney.js`)
- Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

### Code Formatting

We use ESLint and Prettier. Before committing:

```bash
# Backend
cd backend
npm run lint
npm run format

# Frontend
cd frontend
npm run lint
npm run format
```

### Component Structure

```jsx
// Imports
import React, { useState, useEffect } from "react";
import { Button } from "antd";
import useLanguage from "@/locale/useLanguage";

// Component
export default function MyComponent({ prop1, prop2 }) {
  // Hooks
  const translate = useLanguage();
  const [state, setState] = useState(null);

  // Effects
  useEffect(() => {
    // Effect logic
  }, []);

  // Handlers
  const handleClick = () => {
    // Handler logic
  };

  // Render
  return <div>{/* JSX */}</div>;
}
```

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```bash
feat(auth): add two-factor authentication

Implemented TOTP-based 2FA for enhanced security.
Users can now enable 2FA in their profile settings.

Closes #123
```

```bash
fix(invoice): correct tax calculation for GST

Fixed rounding error in GST calculation that was
causing discrepancies in invoice totals.

Fixes #456
```

```bash
docs(readme): update installation instructions

Added troubleshooting section and clarified
MongoDB setup steps.
```

## Pull Request Process

### Before Submitting

- [ ] Code follows the project's coding standards
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] Documentation updated (if needed)
- [ ] Commit messages follow guidelines
- [ ] Branch is up-to-date with main

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

Describe how you tested your changes

## Screenshots (if applicable)

Add screenshots here

## Checklist

- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where needed
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
```

### Review Process

1. At least one maintainer must review and approve
2. All CI checks must pass
3. No merge conflicts
4. Documentation updated (if needed)

### After Approval

- Maintainers will merge your PR
- Your contribution will be credited in release notes
- Thank you for contributing! 🎉

## Development Workflow

### Branching Strategy

- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: New features
- `fix/*`: Bug fixes
- `hotfix/*`: Urgent production fixes

### Workflow

1. **Create branch from `develop`**

   ```bash
   git checkout develop
   git pull upstream develop
   git checkout -b feature/my-feature
   ```

2. **Make changes and commit**

   ```bash
   git add .
   git commit -m "feat(scope): description"
   ```

3. **Keep branch updated**

   ```bash
   git fetch upstream
   git rebase upstream/develop
   ```

4. **Push and create PR**
   ```bash
   git push origin feature/my-feature
   ```

## Testing

### Running Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# E2E tests
npm run test:e2e
```

### Writing Tests

- Write tests for new features
- Update tests for bug fixes
- Aim for >80% code coverage
- Test edge cases

### Test Structure

```javascript
describe("Component/Function Name", () => {
  it("should do something specific", () => {
    // Arrange
    const input = "test";

    // Act
    const result = myFunction(input);

    // Assert
    expect(result).toBe("expected");
  });
});
```

## Documentation

### Code Comments

- Use JSDoc for functions
- Explain "why", not "what"
- Keep comments up-to-date

### JSDoc Example

```javascript
/**
 * Calculates the total amount including tax
 * @param {number} amount - The base amount
 * @param {number} taxRate - Tax rate as percentage
 * @returns {number} Total amount with tax
 */
function calculateTotal(amount, taxRate) {
  return amount * (1 + taxRate / 100);
}
```

## Getting Help

- **Discord**: [Join our community](https://discord.gg/bizcollab)
- **Email**: bizcollab@gmail.com
- **Issues**: [GitHub Issues](https://github.com/yourusername/bizcollab-erp-crm/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/bizcollab-erp-crm/discussions)

## Recognition

Contributors will be recognized in:

- README.md contributors section
- Release notes
- Project website (coming soon)

## License

By contributing, you agree that your contributions will be licensed under the AGPL-3.0 License.

---

**Thank you for contributing to BizCollab!** 🙏

Your efforts help make business management easier for everyone.
