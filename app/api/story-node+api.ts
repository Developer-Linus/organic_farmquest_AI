import { generateAndSaveStoryNode } from "./story_service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { storyId, previousNodeId, choiceId } = body;

    if (!storyId || !previousNodeId || !choiceId) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const node = await generateAndSaveStoryNode(storyId, previousNodeId, choiceId);
    return Response.json(node, { status: 200 });
  } catch (error) {
    console.error("Error generating node:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}