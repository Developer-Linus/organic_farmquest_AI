import { generateAndSaveStory } from "./story_service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topic, userId } = body;

    if (!topic || !userId) {
      return Response.json({ error: "Missing topic or userId" }, { status: 400 });
    }

    const story = await generateAndSaveStory(topic, userId);
    return Response.json(story, { status: 200 });
  } catch (error) {
    console.error("Error creating story:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}