# 🌱 Organic FarmQuest AI - Project Rules & Guidelines

## 📋 Table of Contents
- [Security Guidelines](#-security-guidelines)
- [Performance Standards](#-performance-standards)
- [Code Quality & Best Practices](#-code-quality--best-practices)
- [Architecture Principles](#-architecture-principles)
- [Development Workflow](#-development-workflow)
- [Testing Requirements](#-testing-requirements)
- [Documentation Standards](#-documentation-standards)
- [Deployment & CI/CD](#-deployment--cicd)

---

## 🔒 Security Guidelines

### 1. **Environment Variables & Secrets**
- ✅ **NEVER** commit API keys, tokens, or sensitive data to version control
- ✅ Use `.env` files for local development (already in `.gitignore`)
- ✅ Store production secrets in secure environment variable services
- ✅ Rotate API keys regularly (minimum every 90 days)
- ✅ Use different API keys for development, staging, and production

### 2. **Authentication & Authorization**
- ✅ Implement proper session management with Appwrite
- ✅ Use secure password policies (min 8 chars, mixed case, numbers, symbols)
- ✅ Implement rate limiting for authentication endpoints
- ✅ Add proper logout functionality that clears all session data
- ✅ Validate user permissions before accessing protected resources

### 3. **Data Protection**
- ✅ Sanitize all user inputs before processing
- ✅ Implement proper data validation on both client and server
- ✅ Use HTTPS for all API communications
- ✅ Encrypt sensitive data at rest in Appwrite collections
- ✅ Implement proper error handling without exposing sensitive information

### 4. **API Security**
- ✅ Validate all API requests and responses
- ✅ Implement proper CORS policies
- ✅ Use API versioning for backward compatibility
- ✅ Add request/response logging for security monitoring
- ✅ Implement API rate limiting to prevent abuse

---

## ⚡ Performance Standards

### 1. **Mobile Performance**
- ✅ App startup time: < 3 seconds on mid-range devices
- ✅ Screen transition animations: 60 FPS minimum
- ✅ Memory usage: < 150MB for typical usage
- ✅ Battery optimization: Minimize background processing

### 2. **Network Optimization**
- ✅ API response times: < 2 seconds for story generation
- ✅ Implement proper caching strategies for static content
- ✅ Use image optimization and lazy loading
- ✅ Implement offline functionality for core features
- ✅ Compress API payloads when possible

### 3. **Code Performance**
- ✅ Use React.memo() for expensive components
- ✅ Implement proper list virtualization for long lists
- ✅ Optimize re-renders with useCallback and useMemo
- ✅ Bundle size: Keep main bundle < 2MB
- ✅ Code splitting for non-critical features

### 4. **Database Performance**
- ✅ Design efficient Appwrite collection schemas
- ✅ Implement proper indexing for frequently queried fields
- ✅ Use pagination for large data sets
- ✅ Cache frequently accessed data locally
- ✅ Optimize query patterns to minimize database calls

---

## 🏗️ Code Quality & Best Practices

### 1. **TypeScript Standards**
- ✅ **Strict mode enabled** - No `any` types allowed
- ✅ Define proper interfaces for all data structures
- ✅ Use union types for controlled values
- ✅ Implement proper error types and handling
- ✅ Document complex types with JSDoc comments

### 2. **React Native Best Practices**
- ✅ Use functional components with hooks
- ✅ Implement proper component composition
- ✅ Follow React Native performance guidelines
- ✅ Use proper key props for list items
- ✅ Implement accessibility features (screen readers, etc.)

### 3. **Code Organization**
- ✅ Follow feature-based folder structure
- ✅ Separate business logic from UI components
- ✅ Use custom hooks for reusable logic
- ✅ Implement proper separation of concerns
- ✅ Keep components small and focused (< 200 lines)

### 4. **Naming Conventions**
- ✅ Use PascalCase for components and types
- ✅ Use camelCase for functions and variables
- ✅ Use UPPER_SNAKE_CASE for constants
- ✅ Use descriptive names that explain intent
- ✅ Prefix boolean variables with `is`, `has`, `can`, `should`

---

## 🏛️ Architecture Principles

### 1. **Clean Architecture**
- ✅ Separate presentation, business logic, and data layers
- ✅ Use dependency injection for testability
- ✅ Implement proper abstraction layers
- ✅ Follow SOLID principles
- ✅ Design for scalability and maintainability

### 2. **State Management**
- ✅ Use React Context for global state
- ✅ Keep local state when possible
- ✅ Implement proper state normalization
- ✅ Use reducers for complex state logic
- ✅ Avoid prop drilling with proper context design

### 3. **Error Handling**
- ✅ Implement global error boundaries
- ✅ Use proper error types and messages
- ✅ Log errors for debugging and monitoring
- ✅ Provide user-friendly error messages
- ✅ Implement retry mechanisms for network failures

### 4. **Modularity**
- ✅ Design reusable components and utilities
- ✅ Implement proper module boundaries
- ✅ Use composition over inheritance
- ✅ Create pluggable architecture for features
- ✅ Minimize coupling between modules

---

## 🔄 Development Workflow

### 1. **Git Workflow**
- ✅ Use conventional commit messages (`feat:`, `fix:`, `docs:`, etc.)
- ✅ Create feature branches for new development
- ✅ Require pull request reviews before merging
- ✅ Use semantic versioning for releases
- ✅ Keep commit history clean and meaningful

### 2. **Code Review Standards**
- ✅ Review for security vulnerabilities
- ✅ Check performance implications
- ✅ Verify test coverage
- ✅ Ensure code follows project standards
- ✅ Validate documentation updates

### 3. **Branch Protection**
- ✅ Protect main branch from direct pushes
- ✅ Require status checks to pass
- ✅ Require up-to-date branches before merging
- ✅ Require signed commits for security
- ✅ Automatically delete merged branches

---

## 🧪 Testing Requirements

### 1. **Test Coverage**
- ✅ Minimum 80% code coverage for critical paths
- ✅ 100% coverage for utility functions
- ✅ Test all error scenarios and edge cases
- ✅ Include integration tests for API interactions
- ✅ Performance tests for critical user flows

### 2. **Testing Strategy**
- ✅ Unit tests with Jest and React Native Testing Library
- ✅ Integration tests for component interactions
- ✅ E2E tests for critical user journeys
- ✅ Visual regression tests for UI components
- ✅ Performance tests for app startup and navigation

### 3. **Test Quality**
- ✅ Write descriptive test names and descriptions
- ✅ Use proper test data and mocking strategies
- ✅ Test behavior, not implementation details
- ✅ Maintain test independence and isolation
- ✅ Regular test maintenance and updates

---

## 📚 Documentation Standards

### 1. **Code Documentation**
- ✅ JSDoc comments for all public functions and classes
- ✅ Inline comments for complex business logic
- ✅ README files for each major module
- ✅ API documentation with examples
- ✅ Architecture decision records (ADRs)

### 2. **User Documentation**
- ✅ Clear setup and installation instructions
- ✅ Development environment setup guide
- ✅ Deployment procedures and requirements
- ✅ Troubleshooting guides and FAQs
- ✅ Contributing guidelines for new developers

### 3. **Documentation Maintenance**
- ✅ Update documentation with code changes
- ✅ Review documentation in pull requests
- ✅ Regular documentation audits and updates
- ✅ Version documentation with releases
- ✅ Keep examples and screenshots current

---

## 🚀 Deployment & CI/CD

### 1. **Continuous Integration**
- ✅ Automated testing on all pull requests
- ✅ Code quality checks and linting
- ✅ Security vulnerability scanning
- ✅ Build verification for all platforms
- ✅ Performance regression testing

### 2. **Deployment Strategy**
- ✅ Staged deployments (dev → staging → production)
- ✅ Automated deployment pipelines
- ✅ Rollback capabilities for failed deployments
- ✅ Environment-specific configurations
- ✅ Health checks and monitoring

### 3. **Release Management**
- ✅ Semantic versioning for all releases
- ✅ Automated changelog generation
- ✅ Release notes with user-facing changes
- ✅ Coordinated releases across platforms
- ✅ Post-deployment verification and monitoring

---

## 🎯 Enforcement & Compliance

### 1. **Automated Enforcement**
- ✅ ESLint and Prettier for code formatting
- ✅ TypeScript strict mode for type safety
- ✅ Pre-commit hooks for quality checks
- ✅ Automated security scanning
- ✅ Performance monitoring and alerts

### 2. **Manual Reviews**
- ✅ Architecture review for major changes
- ✅ Security review for sensitive features
- ✅ Performance review for critical paths
- ✅ Documentation review for completeness
- ✅ Regular code quality audits

### 3. **Continuous Improvement**
- ✅ Regular retrospectives and process improvements
- ✅ Technology stack updates and evaluations
- ✅ Performance optimization initiatives
- ✅ Security assessment and improvements
- ✅ Developer experience enhancements

---

## 📞 Support & Resources

### 1. **Getting Help**
- Create GitHub issues for bugs and feature requests
- Use project discussions for questions and ideas
- Follow the contributing guidelines for pull requests
- Consult the troubleshooting guide for common issues

### 2. **External Resources**
- [React Native Best Practices](https://reactnative.dev/docs/performance)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Expo Development Guidelines](https://docs.expo.dev/)

---

**Remember: These rules are living guidelines that should evolve with the project. Regular reviews and updates ensure they remain relevant and effective.**