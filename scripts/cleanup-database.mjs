import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const databaseId = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;

// Collection IDs
const COLLECTIONS = {
  USERS: 'users',
  STORIES: 'stories', 
  STORY_NODES: 'story_nodes'
};

async function deleteCollection(collectionId) {
  try {
    await databases.deleteCollection(databaseId, collectionId);
    console.log(`✅ Deleted collection: ${collectionId}`);
  } catch (error) {
    if (error.code === 404) {
      console.log(`ℹ️  Collection ${collectionId} doesn't exist, skipping deletion`);
    } else {
      console.error(`❌ Error deleting collection ${collectionId}:`, error.message);
    }
  }
}

async function cleanupDatabase() {
  console.log('🧹 Starting database cleanup...\n');

  try {
    // Delete all collections in reverse order to handle dependencies
    const collectionsToDelete = Object.values(COLLECTIONS).reverse();
    
    for (const collectionId of collectionsToDelete) {
      await deleteCollection(collectionId);
    }

    console.log('\n✅ Database cleanup completed successfully!');
    console.log('📝 You can now run "npm run init-db" to recreate the collections with the updated schema.');
    
  } catch (error) {
    console.error('❌ Database cleanup failed:', error);
    process.exit(1);
  }
}

// Run cleanup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupDatabase();
}

export { cleanupDatabase };