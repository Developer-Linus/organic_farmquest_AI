import {Client, Account, Databases } from 'react-native-appwrite';
import { DATABASE_CONFIG } from '@/constants';
export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: "com.knus.farmquest",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.DATABASE_ID,
    userCollectionId: process.env.USER_COLLECTION_ID,
}
// Create database client
export const client = new Client().setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId);

// Appwrite services
export const account = new Account(client); 
export const databases = new Databases(client);

// Unified database helper -wires Appwrite config with database constants
export const db = {
    databaseId: appwriteConfig.databaseId,
    collections: DATABASE_CONFIG.COLLECTIONS,
}
