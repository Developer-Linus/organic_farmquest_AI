import { Client, Databases } from "node-appwrite";
import { DATABASE_CONFIG } from "../../../src/constants";

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

const databases = new Databases(client);

export default async function handler(req, res) {
  if (req.method === "PATCH") {
    try {
      const { storyId, currentNodeId, isWon } = req.body;

      if (!storyId || !currentNodeId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      await databases.updateDocument(
        DATABASE_CONFIG.DATABASE_ID,
        DATABASE_CONFIG.COLLECTIONS.STORIES,
        storyId,
        { current_node_id: currentNodeId, is_won: isWon ?? false }
      );

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error updating progress:", error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}