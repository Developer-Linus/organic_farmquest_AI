import { Client, Databases } from 'node-appwrite';
import { config } from 'dotenv';

// Load environment variables
config();

// Database Configuration (copied from src/constants/index.ts)
const DATABASE_CONFIG = {
  DATABASE_ID: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
  COLLECTIONS: {
    USERS: 'users',
    STORIES: 'stories',
    STORY_NODES: 'story_nodes',
    STORY_JOBS: 'story_jobs',
  }
};

// Initialize Appwrite client with server SDK
const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY); // Server API key required

const databases = new Databases(client);

// Collection schemas definition
const COLLECTION_SCHEMAS = {
    [DATABASE_CONFIG.COLLECTIONS.USERS]: {
        name: 'Users',
        attributes: [
            { key: 'email', type: 'string', size: 255, required: true },
            { key: 'name', type: 'string', size: 100, required: true },
            { key: 'hashed_password', type: 'string', size: 255, required: true },
            { key: 'games_won', type: 'integer', required: false, default: 0 }
        ],
        indexes: [
            { key: 'email_index', type: 'unique', attributes: ['email'] }
        ]
    },
    [DATABASE_CONFIG.COLLECTIONS.STORIES]: {
        name: 'Stories',
        attributes: [
            { key: 'story_id', type: 'string', size: 50, required: true },
            { key: 'user_id', type: 'string', size: 50, required: true },
            { key: 'topic', type: 'string', size: 100, required: true },
            { key: 'status', type: 'string', size: 20, required: true },
            { key: 'current_node_id', type: 'string', size: 50, required: false },
            { key: 'is_won', type: 'boolean', required: false, default: false }
        ],
        indexes: [
            { key: 'user_stories', type: 'key', attributes: ['user_id'] },
            { key: 'status_index', type: 'key', attributes: ['status'] }
        ]
    },
    [DATABASE_CONFIG.COLLECTIONS.STORY_NODES]: {
        name: 'Story Nodes',
        attributes: [
            { key: 'node_id', type: 'string', size: 50, required: true },
            { key: 'story_id', type: 'string', size: 50, required: true },
            { key: 'content', type: 'string', size: 1500, required: true }, // Reduced from 2000
            { key: 'is_root', type: 'boolean', required: false, default: false },
            { key: 'is_ending', type: 'boolean', required: false, default: false },
            { key: 'is_winning_ending', type: 'boolean', required: false, default: false },
            { key: 'choices', type: 'string', size: 5000, required: false } // Reduced from 10000
        ],
        indexes: [
            { key: 'story_nodes', type: 'key', attributes: ['story_id'] },
            { key: 'node_id_index', type: 'unique', attributes: ['node_id'] }
        ]
    },
    [DATABASE_CONFIG.COLLECTIONS.STORY_JOBS]: {
        name: 'Story Jobs',
        attributes: [
            { key: 'job_id', type: 'string', size: 50, required: true },
            { key: 'story_id', type: 'string', size: 50, required: true },
            { key: 'status', type: 'string', size: 20, required: true },
            { key: 'ai_prompt', type: 'string', size: 1500, required: true }, // Reduced from 2000
            { key: 'generated_content', type: 'string', size: 5000, required: false }, // Reduced from 10000
            { key: 'completed_at', type: 'datetime', required: false }
        ],
        indexes: [
            { key: 'story_jobs', type: 'key', attributes: ['story_id'] },
            { key: 'job_id_index', type: 'unique', attributes: ['job_id'] },
            { key: 'status_jobs', type: 'key', attributes: ['status'] }
        ]
    }
};

async function createDatabase() {
    try {
        console.log('🔍 Checking if database exists...');
        
        // Try to get the database first
        try {
            const existingDb = await databases.get(DATABASE_CONFIG.DATABASE_ID);
            console.log(`✅ Database "${existingDb.name}" already exists`);
            return existingDb;
        } catch (error) {
            if (error.code === 404) {
                console.log('📝 Creating new database...');
                const database = await databases.create(
                    DATABASE_CONFIG.DATABASE_ID,
                    'FarmQuest Database'
                );
                console.log(`✅ Database "${database.name}" created successfully`);
                return database;
            }
            throw error;
        }
    } catch (error) {
        console.error('❌ Error creating database:', error.message);
        throw error;
    }
}

async function createCollection(collectionId, schema) {
    try {
        console.log(`🔍 Checking collection: ${schema.name}...`);
        
        // Try to get the collection first
        try {
            const existingCollection = await databases.getCollection(
                DATABASE_CONFIG.DATABASE_ID,
                collectionId
            );
            console.log(`✅ Collection "${schema.name}" already exists`);
            return existingCollection;
        } catch (error) {
            if (error.code === 404) {
                console.log(`📝 Creating collection: ${schema.name}...`);
                
                // Create the collection
                const collection = await databases.createCollection(
                    DATABASE_CONFIG.DATABASE_ID,
                    collectionId,
                    schema.name,
                    ['read("any")', 'write("users")'], // Default permissions
                    false, // documentSecurity
                    true   // enabled
                );
                
                console.log(`✅ Collection "${schema.name}" created successfully`);
                return collection;
            }
            throw error;
        }
    } catch (error) {
        console.error(`❌ Error creating collection ${schema.name}:`, error.message);
        
        // Enhanced error logging
        console.log('  🔍 Full error object:', JSON.stringify({
            name: error.name,
            code: error.code,
            type: error.type,
            response: error.response
        }, null, 2));
        
        console.log('  🔍 Error properties:', {
            name: error.name,
            message: error.message,
            code: error.code,
            type: error.type,
            status: error.status,
            response: error.response,
            stack: error.stack
        });
        
        console.log('  🔍 Error constructor:', error.constructor.name);
        
        throw error;
    }
}

async function createAttributes(collectionId, attributes) {
    for (const attr of attributes) {
        try {
            console.log(`  📝 Creating attribute: ${attr.key}...`);
            
            switch (attr.type) {
                case 'string':
                    await databases.createStringAttribute(
                        DATABASE_CONFIG.DATABASE_ID,
                        collectionId,
                        attr.key,
                        attr.size,
                        attr.required,
                        attr.default || null
                    );
                    break;
                case 'integer':
                    await databases.createIntegerAttribute(
                        DATABASE_CONFIG.DATABASE_ID,
                        collectionId,
                        attr.key,
                        attr.required,
                        null, // min
                        null, // max
                        attr.default || null
                    );
                    break;
                case 'boolean':
                    await databases.createBooleanAttribute(
                        DATABASE_CONFIG.DATABASE_ID,
                        collectionId,
                        attr.key,
                        attr.required,
                        attr.default || null
                    );
                    break;
                case 'datetime':
                    await databases.createDatetimeAttribute(
                        DATABASE_CONFIG.DATABASE_ID,
                        collectionId,
                        attr.key,
                        attr.required,
                        attr.default || null
                    );
                    break;
                default:
                    console.warn(`⚠️  Unknown attribute type: ${attr.type}`);
            }
            
            console.log(`  ✅ Attribute "${attr.key}" created`);
            
            // Increased delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            if (error.code === 409) {
                console.log(`  ℹ️  Attribute "${attr.key}" already exists`);
            } else {
                console.error(`  ❌ Error creating attribute ${attr.key}:`, error.message);
                console.error(`  🔍 Full error object:`, JSON.stringify(error, null, 2));
                console.error(`  🔍 Error properties:`, {
                    name: error.name,
                    message: error.message,
                    code: error.code,
                    type: error.type,
                    status: error.status,
                    response: error.response,
                    stack: error.stack?.split('\n').slice(0, 3).join('\n') // First 3 lines of stack
                });
                console.error(`  🔍 Error constructor:`, error.constructor.name);
                throw error;
            }
        }
    }
}

async function createIndexes(collectionId, indexes) {
    for (const index of indexes) {
        try {
            console.log(`  📝 Creating index: ${index.key}...`);
            
            await databases.createIndex(
                DATABASE_CONFIG.DATABASE_ID,
                collectionId,
                index.key,
                index.type,
                index.attributes
            );
            
            console.log(`  ✅ Index "${index.key}" created`);
            
            // Increased delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
            
        } catch (error) {
            if (error.code === 409) {
                console.log(`  ℹ️  Index "${index.key}" already exists`);
            } else {
                console.error(`  ❌ Error creating index ${index.key}:`, error.message);
                console.error(`  🔍 Full error object:`, JSON.stringify(error, null, 2));
                console.error(`  🔍 Error properties:`, {
                    name: error.name,
                    message: error.message,
                    code: error.code,
                    type: error.type,
                    status: error.status,
                    response: error.response,
                    stack: error.stack?.split('\n').slice(0, 3).join('\n') // First 3 lines of stack
                });
                console.error(`  🔍 Error constructor:`, error.constructor.name);
                throw error;
            }
        }
    }
}

async function initializeDatabase() {
    try {
        console.log('🚀 Starting database initialization...\n');
        console.log('📋 Environment check:');
        console.log(`  • Endpoint: ${process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT}`);
        console.log(`  • Project ID: ${process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID}`);
        console.log(`  • Database ID: ${DATABASE_CONFIG.DATABASE_ID}`);
        console.log(`  • API Key: ${process.env.APPWRITE_API_KEY ? '✅ Set' : '❌ Missing'}\n`);
        
        // Create database
        await createDatabase();
        
        // Create collections with attributes and indexes
        for (const [collectionId, schema] of Object.entries(COLLECTION_SCHEMAS)) {
            console.log(`\n📦 Processing collection: ${schema.name}`);
            
            // Create collection
            await createCollection(collectionId, schema);
            
            // Add delay between collection creation and attribute creation
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Create attributes
            if (schema.attributes && schema.attributes.length > 0) {
                console.log(`  📋 Creating ${schema.attributes.length} attributes...`);
                await createAttributes(collectionId, schema.attributes);
            }
            
            // Add delay between attributes and indexes
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Create indexes
            if (schema.indexes && schema.indexes.length > 0) {
                console.log(`  🔍 Creating ${schema.indexes.length} indexes...`);
                await createIndexes(collectionId, schema.indexes);
            }
            
            console.log(`✅ Collection "${schema.name}" setup complete`);
        }
        
        console.log('\n🎉 Database initialization completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`  • Database: FarmQuest Database`);
        console.log(`  • Collections: ${Object.keys(COLLECTION_SCHEMAS).length}`);
        console.log(`  • Total attributes: ${Object.values(COLLECTION_SCHEMAS).reduce((sum, schema) => sum + (schema.attributes?.length || 0), 0)}`);
        console.log(`  • Total indexes: ${Object.values(COLLECTION_SCHEMAS).reduce((sum, schema) => sum + (schema.indexes?.length || 0), 0)}`);
        
    } catch (error) {
        console.error('\n💥 Database initialization failed:', error.message);
        process.exit(1);
    }
}

// Run the initialization - Always run when this file is executed
initializeDatabase();

export { initializeDatabase, COLLECTION_SCHEMAS };