# 🗄️ Automatic Database Setup

This project includes an automatic database initialization script that creates all necessary Appwrite collections with proper schemas, attributes, and indexes.

## 🚀 Quick Setup

### 1. Get Your Appwrite API Key

1. Go to your [Appwrite Console](https://cloud.appwrite.io)
2. Navigate to your project settings
3. Go to **API Keys** section
4. Click **Create API Key**
5. Give it a name like "Database Setup"
6. Select the following scopes:
   - `databases.read`
   - `databases.write`
   - `collections.read`
   - `collections.write`
   - `attributes.read`
   - `attributes.write`
   - `indexes.read`
   - `indexes.write`

### 2. Update Environment Variables

Add your API key to the `.env` file:

```env
APPWRITE_API_KEY=your_actual_api_key_here
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Database Initialization

```bash
npm run init-db
```

## 📊 What Gets Created

The script automatically creates the following collections:

### 👥 Users Collection
- **Purpose**: Store user profiles and game progress
- **Attributes**:
  - `email` (string, required, unique)
  - `name` (string, required)
  - `avatar` (string, optional)
  - `level` (integer, default: 1)
  - `experience` (integer, default: 0)
  - `coins` (integer, default: 0)

### 📚 Stories Collection
- **Purpose**: Store game stories and sessions
- **Attributes**:
  - `title` (string, required)
  - `description` (string, optional)
  - `topic` (string, required)
  - `difficulty` (string, required)
  - `userId` (string, required)
  - `status` (string, required)
  - `currentNodeId` (string, optional)
  - `score` (integer, default: 0)
  - `completedAt` (datetime, optional)

### 🌳 Story Nodes Collection
- **Purpose**: Store individual story segments and choices
- **Attributes**:
  - `storyId` (string, required)
  - `content` (string, required)
  - `nodeType` (string, required)
  - `choices` (string, optional) - JSON format
  - `parentNodeId` (string, optional)
  - `isRoot` (boolean, default: false)
  - `order` (integer, default: 0)

### ⚙️ Story Jobs Collection
- **Purpose**: Track AI generation jobs and their status
- **Attributes**:
  - `storyId` (string, required)
  - `userId` (string, required)
  - `jobType` (string, required)
  - `status` (string, required)
  - `prompt` (string, optional)
  - `result` (string, optional)
  - `error` (string, optional)
  - `retryCount` (integer, default: 0)
  - `startedAt` (datetime, optional)
  - `completedAt` (datetime, optional)

## 🔍 Indexes Created

The script also creates optimized indexes for better query performance:

- **Users**: Email uniqueness index
- **Stories**: User stories index, status index
- **Story Nodes**: Story nodes index, parent nodes index
- **Story Jobs**: Story jobs index, user jobs index, status jobs index

## 🛡️ Permissions

Collections are created with the following default permissions:
- **Read**: `any` (public read access)
- **Write**: `users` (authenticated users only)

## ⚠️ Important Notes

1. **API Key Security**: Never commit your actual API key to version control
2. **One-Time Setup**: The script is idempotent - it won't recreate existing collections
3. **Rate Limiting**: The script includes delays to avoid Appwrite rate limits
4. **Error Handling**: Comprehensive error handling with detailed logging

## 🔧 Troubleshooting

### Common Issues

**"Invalid API key" Error**
- Ensure your API key has the correct scopes
- Check that the API key is correctly set in `.env`

**"Database not found" Error**
- The script will automatically create the database if it doesn't exist
- Ensure your `DATABASE_ID` in `.env` matches your Appwrite project

**"Rate limit exceeded" Error**
- The script includes built-in delays, but you can increase them if needed
- Wait a few minutes and try again

### Manual Verification

After running the script, you can verify the setup in your Appwrite Console:

1. Go to **Databases** section
2. Select your database
3. Check that all 4 collections are present
4. Verify attributes and indexes for each collection

## 🔄 Re-running the Script

The script is safe to run multiple times. It will:
- Skip existing databases and collections
- Skip existing attributes and indexes
- Only create missing components

## 📝 Customization

To modify the database schema:

1. Edit `scripts/init-database.js`
2. Update the `COLLECTION_SCHEMAS` object
3. Run `npm run init-db` again

The script will create any new attributes or indexes while preserving existing data.

---

**Need help?** Check the console output for detailed logs and error messages.