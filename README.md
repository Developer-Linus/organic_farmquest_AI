# 1. Project Title and Description
## 1.1. **Project Title**
- Organic Farmquest AI
## 1.2. **Audience**
Organic FarmQuest AI is designed for learners, casual gamers, and eco-curious beginners who want to explore the principles of organic farming through an engaging, story-driven experience. It also serves as a practical tool for educators looking to introduce sustainability concepts in an interactive and accessible way.<br>
## 1.3. **Why it Matters?**
Organic farming is more than just growing food. It is about sustainability, healthy ecosystems, and responsible choices. However, for many beginners, these concepts can feel abstract or overwhelming.<br>
**Organic FarmQuest AI** makes learning these practices accessible, engaging, and interactive by transforming them into an adventure game. Through story-driven choices, players gain knowledge about sustainable farming and experience the impact of their decisions in a dynamic, game-based environment. <br>

This project matters because it helps:
- Raise awareness of organic and eco-friendly practices
- Engage learners through interactive storytelling and gamification.
- Support educators with a creative tool for teaching sustainability.
- Inspire eco-conscious habits in everyday life.
> This project blends education with gameplay, contributing to cultivating a greener mindset for the next generation.
# 2. Tech Stack
## 2. Tech Stack  
## 2.1 Frontend  
- [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) – cross-platform mobile app development.  
## 2.2 Backend  
- [Appwrite](https://appwrite.io/) – managing authentication, database, storage, and serverless functions.  
## 2.3 AI / LLM  
- [Gemini API](https://ai.google.dev/) – generating dynamic, story-driven adventures.  
## 2.4 State Management  
- React hooks / Context API (scalable with [Zustand](https://zustand-demo.pmnd.rs/) or Redux if needed).  
## 2.5 Styling  
- [Tailwind CSS (via NativeWind)](https://www.nativewind.dev/) – utility-first styling for React Native.  
## 2.6 Game Logic  
- Custom story engine that tracks choices, points, and progression.  
## 2.7 Testing  
- [Jest](https://jestjs.io/) + [React Native Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/) – for unit and integration testing. 
## 2.8 Push Notifications  
- [Expo Notifications](https://docs.expo.dev/push-notifications/overview/) – sending reminders, challenges, and updates directly to users.
## 2.9 Optional Enhancements (Future)  
- **Analytics**: PostHog or Amplitude for tracking learning progress and engagement.  
- **CI/CD**: GitHub Actions + Expo EAS for automated builds and deployments.  
- **Offline Mode**: SQLite or Realm for saving progress when offline.
# 3. AI Integration Strategy
## 3.1. Code Generation
- I'll be using *Trae* IDE as my AI assistant for this project. Mostly, I will be using chat panel for brainstorming project structure, features, and evaluating the trade-offs of different approaches. I will then prompt the AI assistant via the chat panel to scaffold the project based on structure I decide. Next, I will prompt assistant to generate code for specific features or components. This way, I can focus on the creative aspects of the project while leveraging the power of AI to speed up the development process.
## 3.2. Testing
Testing in **Organic FarmQuest AI** is powered by **Jest** for unit and integration tests, and **React Native Testing Library** for UI and interaction testing.  
- **Unit Tests** cover isolated functionality such as point calculation, branching story logic, and choice validation.  
- **Integration Tests** ensure smooth interaction between the frontend, Appwrite backend, and Gemini API responses.  
- **UI Tests** validate user flows, such as selecting options, completing adventures, and triggering push notifications.  
To accelerate this process, an **AI assistant** is used to generate initial test cases. Prompts provided to the AI include:  
- *“Write a Jest unit test for the function that awards points when a player makes a correct choice.”*  
- *“Write an integration test that mocks Gemini API responses and verifies the story flow continues correctly.”*  
- *“Test that push notifications are scheduled when a user completes a game session.”*  
> All AI-generated tests are carefully reviewed to ensure they align with project intent and business logic, with special attention to **negative scenarios** (e.g., invalid inputs, failed API calls, or authentication errors).
## 3.3. Documentation
- Documentation in **Organic FarmQuest AI** is supported by an AI assistant to ensure clarity, consistency, and maintainability across the project. The process is structured as follows:
### 3.3.1 Docstrings  
- Generated with AI assistance using prompts that emphasize the **purpose and intent** of a function or class, rather than simply restating its implementation.  
- Follow a clear and consistent format (e.g., Google-style or reStructuredText).  
- Maintained by updating the AI prompt whenever business logic changes, ensuring docstrings stay aligned with project goals.  
### 3.3.2 Inline Comments  
- Written with AI to explain **why a piece of logic exists**, not just what the code does.  
- Used sparingly, placed only where the reasoning or decision-making is non-obvious.  
- Continuously reviewed to remove redundancy and ensure they add value to the reader.  
### 3.3.3 README  
- Drafted and refined using AI, focusing on conveying **project intent, design decisions, and usage instructions**.  
- Updated whenever major features, dependencies, or workflows change.  
- Maintained with prompts that prioritize **clarity and context** over verbose descriptions.  
### 3.3.4 AI Prompting Philosophy  
- Prompts given to the AI always highlight the need to capture **why and intent**, which are often overlooked in favor of describing **what** the code already states.  
- Example prompt: *“Write a docstring for this function explaining its purpose in the overall game flow, and why this logic is necessary, instead of restating the code.”*  
> This approach ensures that documentation remains meaningful, reducing cognitive load for developers and helping new contributors quickly understand both the **how** and the **why** of the project.
## 3.4. Context-Aware Techniques
- This project uses **context-aware AI workflows** in **Trae IDE** to ensure that generated code, tests, and documentation are always consistent with the actual system state. By feeding **API specifications, schemas, file trees, and diffs** into the AI assistant, we enable schema-aware development that reduces errors and accelerates iteration.
### 3.4.1 API Specifications
The project’s backend is powered by **Appwrite**, and its API specifications are made accessible to the AI assistant through the **Appwrite MCP server**. This allows the assistant to interpret available endpoints, parameters, authentication flows, and response types directly from the specification.  
With this, the AI can:
- Generate typed client functions from OpenAPI/GraphQL specifications  
- Build request flows that respect authentication and validation rules  
- Create accurate unit and integration tests for API endpoints  
### API Schemas
Beyond raw specifications, **schemas define the structure of data** in collections, documents, and queries. Feeding these schemas into Trae ensures the AI understands data models and constraints when generating code.  
This enables:
- Auto-suggesting strongly typed data models  
- Ensuring client code aligns with backend validations  
- Generating schema-compliant seed data for tests  
### 3.4.2 File Trees
Trae’s context servers provide the AI with the full repository structure, allowing it to recommend where new code, tests, or docs belong. This prevents misplaced files and maintains a clean, modular structure. For example, when adding a new farming game flow, the AI can propose the right feature directory and testing folder.
### 3.4.3 Diffs
Using `git diff`, the AI is fed only the relevant code changes. This narrows its focus to what actually changed and avoids unnecessary rewrites. Practical uses include:
- Generating docstrings for newly added functions  
- Writing targeted tests for updated modules  
- Updating README sections that reference modified workflows  
### 3.4.4 Why It Matters
By grounding Trae’s AI in **API specifications, schemas, file trees, and diffs**, we ensure all AI outputs are **accurate, maintainable, and contract-compliant**. This approach turns AI into a reliable, context-aware collaborator that helps us build faster while preserving the integrity of the project.




