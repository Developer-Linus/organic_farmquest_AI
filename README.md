# Organic FarmQuest AI

> **Frontend Status Notice**: The frontend is currently experiencing some technical issues and is not working as intended. Active development is underway to resolve these issues and restore full functionality. The backend services, AI integration, and core game logic are fully operational.

## Table of Contents

- [Organic FarmQuest AI](#organic-farmquest-ai)
  - [Table of Contents](#table-of-contents)
  - [Project Overview](#project-overview)
    - [1.1. **Project Title**](#11-project-title)
    - [1.2. **Audience**](#12-audience)
    - [1.3. **Why it Matters?**](#13-why-it-matters)
  - [Quick Start](#quick-start)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Development Setup](#development-setup)
    - [Running the Application](#running-the-application)
      - [Development Mode](#development-mode)
      - [Production Build](#production-build)
  - [Features](#features)
    - [Implemented Features](#implemented-features)
      - [**Core Game Mechanics**](#core-game-mechanics)
      - [**User Authentication & Management**](#user-authentication--management)
      - [**Mobile-First Design**](#mobile-first-design)
      - [**Game Modes**](#game-modes)
      - [**Progress Tracking**](#progress-tracking)
    - [Upcoming Features](#upcoming-features)
  - [Tech Stack](#tech-stack)
    - [2.1 Frontend](#21-frontend)
    - [2.2 Backend](#22-backend)
    - [2.3 AI / LLM](#23-ai--llm)
    - [2.4 State Management](#24-state-management)
    - [2.5 Styling](#25-styling)
    - [2.6 Game Logic](#26-game-logic)
    - [2.7 Testing](#27-testing)
    - [2.8 Push Notifications](#28-push-notifications)
    - [2.9 Optional Enhancements (Future)](#29-optional-enhancements-future)
  - [Project Structure](#project-structure)
  - [AI Integration Strategy](#ai-integration-strategy)
    - [3.1. Code Generation](#31-code-generation)
    - [3.2. Testing](#32-testing)
    - [3.3. Documentation](#33-documentation)
      - [3.3.1 Docstrings](#331-docstrings)
      - [3.3.2 Inline Comments](#332-inline-comments)
      - [3.3.3 README](#333-readme)
      - [3.3.4 AI Prompting Philosophy](#334-ai-prompting-philosophy)
    - [3.4. Context-Aware Techniques](#34-context-aware-techniques)
      - [3.4.1 API Specifications](#341-api-specifications)
      - [API Schemas](#api-schemas)
      - [3.4.2 File Trees](#342-file-trees)
      - [3.4.3 Diffs](#343-diffs)
      - [3.4.4 Why It Matters](#344-why-it-matters)
  - [AI-Assisted Development Workflow](#ai-assisted-development-workflow)
    - [Comprehensive Commit Messages](#comprehensive-commit-messages)
  - [Testing](#testing)
    - [Test Coverage](#test-coverage)
    - [Running Tests](#running-tests)
    - [Test Structure](#test-structure)
  - [Deployment](#deployment)
    - [Development Environment](#development-environment)
    - [Production Deployment](#production-deployment)
    - [Environment Configuration](#environment-configuration)
  - [Contributing](#contributing)
    - [Development Workflow](#development-workflow)
    - [Code Standards](#code-standards)
    - [AI-Powered Development](#ai-powered-development)
  - [License](#license)

## Project Overview

### 1.1. **Project Title**
- Organic Farmquest AI

### 1.2. **Audience**
Organic FarmQuest AI is designed for learners, casual gamers, and eco-curious beginners who want to explore the principles of organic farming through an engaging, story-driven experience. It also serves as a practical tool for educators looking to introduce sustainability concepts in an interactive and accessible way.

### 1.3. **Why it Matters?**
Organic farming is more than just growing food. It is about sustainability, healthy ecosystems, and responsible choices. However, for many beginners, these concepts can feel abstract or overwhelming.

**Organic FarmQuest AI** makes learning these practices accessible, engaging, and interactive by transforming them into an adventure game. Through story-driven choices, players gain knowledge about sustainable farming and experience the impact of their decisions in a dynamic, game-based environment.

This project matters because it helps:
- Raise awareness of organic and eco-friendly practices
- Engage learners through interactive storytelling and gamification
- Support educators with a creative tool for teaching sustainability
- Inspire eco-conscious habits in everyday life

> This project blends education with gameplay, contributing to cultivating a greener mindset for the next generation.

## Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Yarn** package manager - [Installation guide](https://yarnpkg.com/getting-started/install)
- **Expo CLI** - Install globally: `npm install -g @expo/cli`
- **Git** - [Download here](https://git-scm.com/)

For mobile development:
- **Android Studio** (for Android development)
- **Xcode** (for iOS development, macOS only)
- **Expo Go** app on your mobile device

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Developer-Linus/organic_farmquest_AI.git
   cd organic_farmquest_ai
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env with your configuration
   # Add your Appwrite endpoint, project ID, and Google API key
   ```

### Development Setup

1. **Database Initialization**
   ```bash
   # Initialize the Appwrite database
   yarn init-db
   ```

2. **Start the development server**
   ```bash
   yarn start
   ```

3. **Run on specific platforms**
   ```bash
   # iOS (requires macOS and Xcode)
   yarn ios
   
   # Android (requires Android Studio)
   yarn android
   
   # Web browser
   yarn web
   ```

### Running the Application

#### Development Mode
```bash
# Start Expo development server
yarn start

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Generate test coverage report
yarn test:coverage
```

#### Production Build
```bash
# Build for production
expo build:android  # or expo build:ios
```

## Features

### Implemented Features

#### **Core Game Mechanics**
- **Story-driven gameplay** with branching narratives
- **Dynamic story generation** powered by Google Gemini AI
- **Choice-based progression** with meaningful consequences
- **Scoring system** based on farming knowledge and decisions
- **Multiple difficulty levels** (Easy, Medium, Hard)
- **Custom topic selection** for personalized learning experiences

#### **User Authentication & Management**
- **Secure user registration and login** via Appwrite
- **Guest mode** for quick play without account creation
- **User profile management** with progress tracking
- **Session persistence** across app launches

#### **Mobile-First Design**
- **Cross-platform compatibility** (iOS, Android, Web)
- **Responsive UI** optimized for mobile devices
- **Smooth animations** and transitions
- **Accessibility features** for inclusive gameplay

#### **Game Modes**
- **Adventure Mode**: Full story campaigns with multiple chapters
- **Challenge Mode**: Skill-testing scenarios
- **Quick Play**: 5-minute learning sessions
- **Custom Topics**: Player-defined farming scenarios

#### **Progress Tracking**
- **Achievement system** with unlockable badges
- **Score tracking** and leaderboards
- **Learning progress** across different farming topics
- **Game history** and statistics

### Upcoming Features

- **Multiplayer challenges** and competitions
- **Offline mode** for playing without internet
- **Push notifications** for daily challenges
- **Advanced analytics** for learning insights
- **Social sharing** of achievements
- **Expanded story content** and farming topics

## Tech Stack

### 2.1 Frontend  
- [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) – cross-platform mobile app development
- [TypeScript](https://www.typescriptlang.org/) – type-safe development
- [Expo Router](https://docs.expo.dev/router/introduction/) – file-based navigation

### 2.2 Backend  
- [Appwrite](https://appwrite.io/) – managing authentication, database, storage, and serverless functions
- [Node.js](https://nodejs.org/) – server-side JavaScript runtime

### 2.3 AI / LLM  
- [Google Gemini API](https://ai.google.dev/) – generating dynamic, story-driven adventures
- [AI SDK](https://sdk.vercel.ai/) – streamlined AI integration

### 2.4 State Management  
- React hooks / Context API (scalable with [Zustand](https://zustand-demo.pmnd.rs/) or Redux if needed)

### 2.5 Styling  
- [Tamagui](https://tamagui.dev/) – universal design system and UI components
- [Tailwind CSS (via NativeWind)](https://www.nativewind.dev/) – utility-first styling for React Native

### 2.6 Game Logic  
- Custom story engine that tracks choices, points, and progression
- [Zod](https://zod.dev/) – runtime type validation and schema parsing

### 2.7 Testing  
- [Jest](https://jestjs.io/) + [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/) – for unit and integration testing
- TypeScript strict mode for compile-time type checking

### 2.8 Push Notifications  
- [Expo Notifications](https://docs.expo.dev/push-notifications/overview/) – sending reminders, challenges, and updates directly to users

### 2.9 Optional Enhancements (Future)  
- **Analytics**: PostHog or Amplitude for tracking learning progress and engagement
- **CI/CD**: GitHub Actions + Expo EAS for automated builds and deployments
- **Offline Mode**: SQLite or Realm for saving progress when offline

## Project Structure

```
organic_farmquest_ai/
├── app/                          # Expo Router pages
│   ├── (tabs)/                      # Tab navigation screens
│   │   ├── index.tsx               # Home/Dashboard
│   │   ├── game.tsx                # Game center
│   │   ├── profile.tsx             # User profile
│   │   └── settings.tsx            # App settings
│   ├── auth/                       # Authentication screens
│   │   ├── login.tsx               # Login screen
│   │   └── register.tsx            # Registration screen
│   ├── game/                       # Game-specific screens
│   │   ├── setup.tsx               # Game configuration
│   │   ├── play.tsx                # Main gameplay
│   │   └── complete.tsx            # Game completion
│   └── api/                        # API route handlers
├── components/                   # Reusable UI components
├── lib/                         # Core libraries and utilities
│   ├── __tests__/                  # Library tests
│   ├── appwrite.ts                 # Appwrite configuration
│   ├── database.ts                 # Database operations
│   ├── api-client.ts               # API client utilities
│   ├── api-types.ts                # API type definitions
│   └── storyApi.ts                 # Story generation API
├── src/                         # Source code
│   ├── contexts/                   # React contexts
│   │   ├── GameContext.tsx         # Game state management
│   │   └── __tests__/              # Context tests
│   ├── types/                      # TypeScript type definitions
│   ├── schemas/                    # Zod validation schemas
│   ├── constants/                  # App constants and configuration
│   └── utils/                      # Utility functions
├── __tests__/                   # Global test files
├── scripts/                     # Build and deployment scripts
├── assets/                      # Images, fonts, and static assets
├── Configuration files
│   ├── package.json                # Dependencies and scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── jest.config.js              # Testing configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   └── app.json                    # Expo configuration
└── Documentation
    ├── README.md                   # This file
    └── README-DATABASE-SETUP.md    # Database setup guide
```

## AI Integration Strategy

### 3.1. Code Generation
I'm using *Trae* IDE as my AI assistant for this project. Mostly, I use the chat panel for brainstorming project structure, features, and evaluating the trade-offs of different approaches. I then prompt the AI assistant via the chat panel to scaffold the project based on the structure I decide. Next, I prompt the assistant to generate code for specific features or components. This way, I can focus on the creative aspects of the project while leveraging the power of AI to speed up the development process.

### 3.2. Testing
Testing in **Organic FarmQuest AI** is powered by **Jest** for unit and integration tests, and **React Native Testing Library** for UI and interaction testing.  
- **Unit Tests** cover isolated functionality such as point calculation, branching story logic, and choice validation
- **Integration Tests** ensure smooth interaction between the frontend, Appwrite backend, and Gemini API responses
- **UI Tests** validate user flows, such as selecting options, completing adventures, and triggering push notifications

To accelerate this process, an **AI assistant** is used to generate initial test cases. Prompts provided to the AI include:  
- *"Write a Jest unit test for the function that awards points when a player makes a correct choice."*  
- *"Write an integration test that mocks Gemini API responses and verifies the story flow continues correctly."*  
- *"Test that push notifications are scheduled when a user completes a game session."*  

> All AI-generated tests are carefully reviewed to ensure they align with project intent and business logic, with special attention to **negative scenarios** (e.g., invalid inputs, failed API calls, or authentication errors).

### 3.3. Documentation
Documentation in **Organic FarmQuest AI** is supported by an AI assistant to ensure clarity, consistency, and maintainability across the project. The process is structured as follows:

#### 3.3.1 Docstrings  
- Generated with AI assistance using prompts that emphasize the **purpose and intent** of a function or class, rather than simply restating its implementation
- Follow a clear and consistent format (e.g., Google-style or reStructuredText)
- Maintained by updating the AI prompt whenever business logic changes, ensuring docstrings stay aligned with project goals

#### 3.3.2 Inline Comments  
- Written with AI to explain **why a piece of logic exists**, not just what the code does
- Used sparingly, placed only where the reasoning or decision-making is non-obvious
- Continuously reviewed to remove redundancy and ensure they add value to the reader

#### 3.3.3 README  
- Drafted and refined using AI, focusing on conveying **project intent, design decisions, and usage instructions**
- Updated whenever major features, dependencies, or workflows change
- Maintained with prompts that prioritize **clarity and context** over verbose descriptions

#### 3.3.4 AI Prompting Philosophy  
- Prompts given to the AI always highlight the need to capture **why and intent**, which are often overlooked in favor of describing **what** the code already states
- Example prompt: *"Write a docstring for this function explaining its purpose in the overall game flow, and why this logic is necessary, instead of restating the code."*  

> This approach ensures that documentation remains meaningful, reducing cognitive load for developers and helping new contributors quickly understand both the **how** and the **why** of the project.

### 3.4. Context-Aware Techniques
This project uses **context-aware AI workflows** in **Trae IDE** to ensure that generated code, tests, and documentation are always consistent with the actual system state. By feeding **API specifications, schemas, file trees, and diffs** into the AI assistant, we enable schema-aware development that reduces errors and accelerates iteration.

#### 3.4.1 API Specifications
The project's backend is powered by **Appwrite**, and its API specifications are made accessible to the AI assistant through the **Appwrite MCP server**. This allows the assistant to interpret available endpoints, parameters, authentication flows, and response types directly from the specification.  

With this, the AI can:
- Generate typed client functions from OpenAPI/GraphQL specifications  
- Build request flows that respect authentication and validation rules  
- Create accurate unit and integration tests for API endpoints  

#### API Schemas
Beyond raw specifications, **schemas define the structure of data** in collections, documents, and queries. Feeding these schemas into Trae ensures the AI understands data models and constraints when generating code.  

This enables:
- Auto-suggesting strongly typed data models  
- Ensuring client code aligns with backend validations  
- Generating schema-compliant seed data for tests  

#### 3.4.2 File Trees
Trae's context servers provide the AI with the full repository structure, allowing it to recommend where new code, tests, or docs belong. This prevents misplaced files and maintains a clean, modular structure. For example, when adding a new farming game flow, the AI can propose the right feature directory and testing folder.

#### 3.4.3 Diffs
Using `git diff`, the AI is fed only the relevant code changes. This narrows its focus to what actually changed and avoids unnecessary rewrites. Practical uses include:
- Generating docstrings for newly added functions  
- Writing targeted tests for updated modules  
- Updating README sections that reference modified workflows  

#### 3.4.4 Why It Matters
By grounding Trae's AI in **API specifications, schemas, file trees, and diffs**, we ensure all AI outputs are **accurate, maintainable, and contract-compliant**. This approach turns AI into a reliable, context-aware collaborator that helps us build faster while preserving the integrity of the project.

## Testing

The project maintains high code quality through comprehensive testing:

### Test Coverage
- **Unit Tests**: Core business logic, utility functions, and data validation
- **Integration Tests**: API interactions, database operations, and service integrations
- **Component Tests**: UI components and user interactions
- **End-to-End Tests**: Complete user workflows and game scenarios

### Running Tests
```bash
# Run all tests
yarn test

# Run tests in watch mode during development
yarn test:watch

# Generate coverage report
yarn test:coverage

# Run tests for CI/CD
yarn test:ci
```

### Test Structure
- Tests are co-located with source code in `__tests__` directories
- Mock data and utilities are shared across test suites
- AI-generated tests are reviewed and validated for business logic accuracy

## Deployment

### Development Environment
```bash
# Start development server
yarn start

# Run on specific platforms
yarn ios      # iOS simulator
yarn android  # Android emulator
yarn web      # Web browser
```

### Production Deployment
The app is configured for deployment using Expo EAS Build:

```bash
# Build for production
eas build --platform all

# Submit to app stores
eas submit --platform all
```

### Environment Configuration
- Development: Local Appwrite instance or development server
- Staging: Staging environment with test data
- Production: Production Appwrite deployment with live data

## Contributing

We welcome contributions to Organic FarmQuest AI! Here's how you can help:

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Make your changes following our coding standards
4. Write or update tests for your changes
5. Run the test suite: `yarn test`
6. Commit your changes using conventional commits: `git commit -m "feat: add new farming scenario"`
7. Push to your fork and submit a pull request

### Code Standards
- Follow TypeScript strict mode guidelines
- Use Prettier for code formatting
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

### AI-Powered Development
This project leverages AI tools throughout the development process:
- **Code Generation**: AI assists in scaffolding components and features
- **Test Creation**: AI generates initial test cases that are then reviewed and refined
- **Documentation**: AI helps maintain clear and comprehensive documentation
- **Code Review**: AI-powered tools assist in identifying potential issues

## License

This project is licensed under the MIT License.

---




