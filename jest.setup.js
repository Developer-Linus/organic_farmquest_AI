// Mock React Native modules
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios || obj.default),
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 667 })),
  },
}));

// Mock Expo modules
jest.mock('expo-constants', () => ({
  default: {
    expoConfig: {
      extra: {
        appwriteEndpoint: 'https://test.appwrite.io/v1',
        appwriteProjectId: 'test-project',
        appwriteDatabaseId: 'test-database',
        googleApiKey: 'test-api-key',
      },
    },
  },
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

// Mock Appwrite
jest.mock('appwrite', () => ({
  Client: jest.fn(() => ({
    setEndpoint: jest.fn().mockReturnThis(),
    setProject: jest.fn().mockReturnThis(),
  })),
  Account: jest.fn(() => ({
    create: jest.fn(),
    createEmailPasswordSession: jest.fn(),
    get: jest.fn(),
    deleteSession: jest.fn(),
  })),
  Databases: jest.fn(() => ({
    createDocument: jest.fn(),
    getDocument: jest.fn(),
    listDocuments: jest.fn(),
    updateDocument: jest.fn(),
  })),
  ID: {
    unique: jest.fn(() => 'mock-id'),
  },
  Query: {
    equal: jest.fn(),
    orderDesc: jest.fn(),
    limit: jest.fn(),
  },
}));

// Mock AI SDK
jest.mock('@ai-sdk/google', () => ({
  google: jest.fn(() => ({
    generateText: jest.fn(),
  })),
}));

jest.mock('ai', () => ({
  generateText: jest.fn(),
}));

// Global test utilities
global.mockUser = {
  $id: 'test-user-id',
  email: 'test@example.com',
  name: 'Test User',
};

global.mockStory = {
  id: 'test-story-id',
  content: 'Test story content',
  choices: [
    { id: 'choice-1', text: 'Choice 1', points: 10 },
    { id: 'choice-2', text: 'Choice 2', points: 5 },
  ],
};

// Silence console warnings during tests
const originalWarn = console.warn;
console.warn = (...args) => {
  if (
    typeof args[0] === 'string' &&
    (args[0].includes('Warning:') || args[0].includes('React'))
  ) {
    return;
  }
  originalWarn(...args);
};