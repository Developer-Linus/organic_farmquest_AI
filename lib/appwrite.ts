import { Client, Account, Databases } from "react-native-appwrite";
import { DATABASE_CONFIG } from "../src/constants/index";

export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
  platform: "com.knus.farmquest",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!,
  userCollectionId: process.env.EXPO_PUBLIC_USER_COLLECTION_ID || "users",
};

// --- Client ---
export const client = new Client()
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

// --- Services ---
export const account = new Account(client);
export const databases = new Databases(client);

// --- Database helper ---
export const db = {
  databaseId: appwriteConfig.databaseId,
  collections: DATABASE_CONFIG.COLLECTIONS,
};

// --- Guest Helpers ---
export const ensureGuestSession = async () => {
  try {
    // If there's already a session, return it
    const session = await account.getSession("current");
    return session;
  } catch {
    // Otherwise, create an anonymous session
    return await account.createAnonymousSession();
  }
};

export const getCurrentUser = async () => {
  try {
    await ensureGuestSession();
    return await account.get();
  } catch (err) {
    console.error("Failed to get current user:", err);
    return null;
  }
};