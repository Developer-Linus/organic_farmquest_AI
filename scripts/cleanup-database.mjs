import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';
import readline from 'readline';

// Load environment variables
dotenv.config();

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

const databases = new Databases(client);
const databaseId = process.env.DATABASE_ID;

// Collection IDs - Updated to match the actual schema
const COLLECTIONS = {
  USERS: 'users',
  STORIES: 'stories', 
  STORY_NODES: 'story_nodes',
  STORY_JOBS: 'story_jobs'
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/**
 * Promisified question function for readline
 */
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

/**
 * Display environment configuration for verification
 */
function displayEnvironmentInfo() {
  console.log('🔍 Environment Configuration:');
  console.log(`  • Endpoint: ${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || '❌ Not set'}`);
  console.log(`  • Project ID: ${process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '❌ Not set'}`);
  console.log(`  • Database ID: ${databaseId || '❌ Not set'}`);
  console.log(`  • API Key: ${process.env.APPWRITE_API_KEY ? '✅ Set' : '❌ Not set'}`);
  console.log();
}

/**
 * Check if collections exist and get their document counts
 */
async function getCollectionInfo() {
  const collectionInfo = {};
  
  for (const [name, id] of Object.entries(COLLECTIONS)) {
    try {
      const collection = await databases.getCollection(databaseId, id);
      // Try to get document count (this might fail if collection is empty or has permissions issues)
      try {
        const documents = await databases.listDocuments(databaseId, id, [], 1);
        collectionInfo[name] = {
          exists: true,
          name: collection.name,
          totalDocuments: documents.total || 0
        };
      } catch (docError) {
        collectionInfo[name] = {
          exists: true,
          name: collection.name,
          totalDocuments: 'Unknown (permission/access issue)'
        };
      }
    } catch (error) {
      if (error.code === 404) {
        collectionInfo[name] = { exists: false };
      } else {
        collectionInfo[name] = { 
          exists: false, 
          error: error.message 
        };
      }
    }
  }
  
  return collectionInfo;
}

/**
 * Display collection information
 */
function displayCollectionInfo(collectionInfo) {
  console.log('📊 Current Collections Status:');
  
  let existingCollections = 0;
  let totalDocuments = 0;
  
  for (const [name, info] of Object.entries(collectionInfo)) {
    if (info.exists) {
      existingCollections++;
      const docCount = typeof info.totalDocuments === 'number' ? info.totalDocuments : 0;
      if (typeof info.totalDocuments === 'number') {
        totalDocuments += info.totalDocuments;
      }
      
      console.log(`  ✅ ${name}: "${info.name}" (${info.totalDocuments} documents)`);
    } else if (info.error) {
      console.log(`  ❌ ${name}: Error - ${info.error}`);
    } else {
      console.log(`  ⚪ ${name}: Does not exist`);
    }
  }
  
  console.log();
  console.log(`📈 Summary: ${existingCollections}/${Object.keys(COLLECTIONS).length} collections exist`);
  if (typeof totalDocuments === 'number' && totalDocuments > 0) {
    console.log(`📄 Total documents that will be deleted: ${totalDocuments}`);
  }
  console.log();
}

/**
 * Get user confirmation with multiple safety checks
 */
async function getUserConfirmation(collectionInfo) {
  const existingCollections = Object.values(collectionInfo).filter(info => info.exists).length;
  
  if (existingCollections === 0) {
    console.log('ℹ️  No collections found to delete. Cleanup not needed.');
    return false;
  }

  // First confirmation - general warning
  console.log('⚠️  WARNING: This operation will PERMANENTLY DELETE all collections and their data!');
  console.log('⚠️  This action CANNOT be undone!');
  console.log();
  
  const firstConfirm = await askQuestion('Are you sure you want to proceed? (yes/no): ');
  if (firstConfirm !== 'yes') {
    console.log('❌ Operation cancelled by user.');
    return false;
  }

  // Second confirmation - environment specific
  console.log();
  console.log('🔍 Please verify you are targeting the correct environment:');
  displayEnvironmentInfo();
  
  const envConfirm = await askQuestion('Is this the correct environment to clean up? (yes/no): ');
  if (envConfirm !== 'yes') {
    console.log('❌ Operation cancelled - environment verification failed.');
    return false;
  }

  // Third confirmation - type confirmation phrase
  console.log();
  console.log('🚨 FINAL CONFIRMATION REQUIRED');
  console.log('To proceed with the deletion, please type exactly: DELETE ALL DATA');
  console.log();
  
  const finalConfirm = await askQuestion('Type the confirmation phrase: ');
  if (finalConfirm !== 'delete all data') {
    console.log('❌ Operation cancelled - confirmation phrase did not match.');
    return false;
  }

  return true;
}

async function deleteCollection(collectionId, collectionName) {
  try {
    console.log(`🗑️  Deleting collection: ${collectionName} (${collectionId})...`);
    await databases.deleteCollection(databaseId, collectionId);
    console.log(`✅ Successfully deleted collection: ${collectionName}`);
  } catch (error) {
    if (error.code === 404) {
      console.log(`ℹ️  Collection ${collectionName} doesn't exist, skipping deletion`);
    } else {
      console.error(`❌ Error deleting collection ${collectionName}:`, error.message);
      throw error; // Re-throw to stop the cleanup process
    }
  }
}

async function cleanupDatabase() {
  console.log('🧹 Database Cleanup Tool');
  console.log('========================\n');

  try {
    // Validate environment variables
    if (!process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 
        !process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || 
        !process.env.APPWRITE_API_KEY || 
        !databaseId) {
      console.error('❌ Missing required environment variables!');
      console.error('Please ensure the following are set in your .env file:');
      console.error('  - EXPO_PUBLIC_APPWRITE_ENDPOINT');
      console.error('  - EXPO_PUBLIC_APPWRITE_PROJECT_ID');
      console.error('  - APPWRITE_API_KEY');
      console.error('  - DATABASE_ID');
      process.exit(1);
    }

    // Display environment info
    displayEnvironmentInfo();

    // Get current collection information
    console.log('🔍 Checking current database state...\n');
    const collectionInfo = await getCollectionInfo();
    displayCollectionInfo(collectionInfo);

    // Get user confirmation
    const confirmed = await getUserConfirmation(collectionInfo);
    if (!confirmed) {
      rl.close();
      return;
    }

    console.log('\n🚀 Starting cleanup process...\n');

    // Delete all collections in reverse order to handle dependencies
    const collectionsToDelete = Object.entries(COLLECTIONS).reverse();
    
    for (const [name, id] of collectionsToDelete) {
      const info = collectionInfo[name];
      if (info && info.exists) {
        await deleteCollection(id, info.name || name);
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log('\n✅ Database cleanup completed successfully!');
    console.log('📝 You can now run "npm run init-db" to recreate the collections with the updated schema.');
    
  } catch (error) {
    console.error('\n❌ Database cleanup failed:', error.message);
    console.error('💡 Please check your environment configuration and try again.');
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run cleanup if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanupDatabase();
}

export { cleanupDatabase };