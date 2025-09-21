import type { GameTopic, GameDifficulty } from '../src/types';

// Base prompt configuration
export const PROMPT_CONFIG = {
  maxTokens: 1000,
  temperature: 0.7,
  topP: 0.9,
} as const;

// Topic-specific knowledge bases
export const TOPIC_KNOWLEDGE = {
  vegetables: {
    easy: [
      'Basic vegetable identification (carrots, lettuce, tomatoes)',
      'Simple growing conditions (sun, water, soil)',
      'Common garden tools (shovel, watering can)',
      'Harvest timing basics',
    ],
    medium: [
      'Companion planting principles',
      'Soil pH and nutrient requirements',
      'Pest identification and organic solutions',
      'Seasonal planting schedules',
      'Crop rotation basics',
    ],
    hard: [
      'Advanced soil management and composting',
      'Integrated pest management systems',
      'Greenhouse and hydroponic techniques',
      'Seed saving and plant breeding',
      'Market gardening strategies',
    ],
  },
  fruits: {
    easy: [
      'Common fruit identification (apples, berries, citrus)',
      'Basic fruit tree care',
      'Simple harvesting techniques',
      'Fruit storage basics',
    ],
    medium: [
      'Pruning techniques for fruit trees',
      'Pollination requirements',
      'Disease prevention in fruit crops',
      'Grafting basics',
      'Orchard layout planning',
    ],
    hard: [
      'Advanced grafting and rootstock selection',
      'Integrated orchard management',
      'Post-harvest handling and processing',
      'Fruit breeding and variety development',
      'Commercial fruit production systems',
    ],
  },
  herbs: {
    easy: [
      'Common culinary herbs (basil, parsley, mint)',
      'Basic herb growing in containers',
      'Simple harvesting and drying',
      'Kitchen garden basics',
    ],
    medium: [
      'Medicinal herb cultivation',
      'Herb preservation techniques',
      'Essential oil production basics',
      'Herb garden design',
      'Seasonal herb management',
    ],
    hard: [
      'Advanced herbal medicine preparation',
      'Commercial herb production',
      'Distillation and extraction techniques',
      'Herb quality control and testing',
      'Regulatory compliance for herb products',
    ],
  },
  grains: {
    easy: [
      'Basic grain identification (wheat, corn, rice)',
      'Simple grain storage',
      'Basic milling concepts',
      'Grain cooking basics',
    ],
    medium: [
      'Grain crop rotation systems',
      'Harvesting and threshing techniques',
      'Grain quality assessment',
      'Small-scale grain processing',
      'Cover crop integration',
    ],
    hard: [
      'Advanced breeding programs',
      'Large-scale grain storage systems',
      'Commodity market strategies',
      'Precision agriculture techniques',
      'Grain processing and value-adding',
    ],
  },
  livestock: {
    easy: [
      'Basic animal care (feeding, watering, shelter)',
      'Common farm animals (chickens, goats, pigs)',
      'Simple animal health signs',
      'Basic egg and milk collection',
    ],
    medium: [
      'Breeding and reproduction management',
      'Pasture management and rotation',
      'Animal nutrition planning',
      'Basic veterinary care',
      'Livestock housing design',
    ],
    hard: [
      'Advanced genetics and breeding programs',
      'Large-scale livestock operations',
      'Feed formulation and optimization',
      'Disease prevention protocols',
      'Sustainable livestock systems',
    ],
  },
} as const;

// Difficulty-specific story characteristics
export const DIFFICULTY_CHARACTERISTICS = {
  easy: {
    storyLength: '3-4 decision points',
    complexity: 'Simple, straightforward scenarios',
    vocabulary: 'Basic agricultural terms',
    concepts: 'Fundamental farming principles',
    choices: 'Clear right/wrong answers',
  },
  medium: {
    storyLength: '5-6 decision points',
    complexity: 'Multi-step problem solving',
    vocabulary: 'Intermediate technical terms',
    concepts: 'Interconnected farming systems',
    choices: 'Multiple valid approaches with trade-offs',
  },
  hard: {
    storyLength: '6-8 decision points',
    complexity: 'Complex scenarios with multiple variables',
    vocabulary: 'Advanced technical terminology',
    concepts: 'Sophisticated agricultural systems',
    choices: 'Nuanced decisions requiring deep knowledge',
  },
} as const;

// Story start prompt template
export function generateStoryStartPrompt(topic: GameTopic, difficulty: GameDifficulty): string {
  const knowledge = TOPIC_KNOWLEDGE[topic][difficulty];
  const characteristics = DIFFICULTY_CHARACTERISTICS[difficulty];

  return `You are an expert agricultural educator creating an interactive farming story game. 

**Topic**: ${topic.charAt(0).toUpperCase() + topic.slice(1)}
**Difficulty**: ${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}

**Knowledge Focus**: ${knowledge.join(', ')}

**Story Requirements**:
- Length: ${characteristics.storyLength}
- Complexity: ${characteristics.complexity}
- Vocabulary: ${characteristics.vocabulary}
- Concepts: ${characteristics.concepts}
- Choice Style: ${characteristics.choices}

**Your Task**: Create the opening scenario for an engaging farming story that teaches about ${topic}. The story should:

1. **Set an engaging scene** that immediately draws the player into a realistic farming situation
2. **Introduce a clear challenge or problem** related to ${topic} that needs to be solved
3. **Provide educational context** naturally woven into the narrative
4. **End with 3 meaningful choices** that will impact the story direction

**Response Format**:
{
  "content": "Your engaging story opening (2-3 paragraphs)",
  "choices": [
    {
      "id": "choice_1",
      "text": "Choice 1 description",
      "is_correct": true/false
    },
    {
      "id": "choice_2", 
      "text": "Choice 2 description",
      "is_correct": true/false
    },
    {
      "id": "choice_3",
      "text": "Choice 3 description", 
      "is_correct": true/false
    }
  ]
}

**Important Guidelines**:
- Make the story immersive and relatable
- Include specific ${topic} knowledge naturally
- Ensure choices have clear consequences
- Use appropriate vocabulary for ${difficulty} level
- Focus on practical, real-world farming scenarios
- Make learning feel natural, not forced`;
}

// Next node prompt template
export function generateNextNodePrompt(
  topic: GameTopic,
  difficulty: GameDifficulty,
  storyHistory: string,
  userChoice: string,
  isCorrectChoice: boolean
): string {
  const knowledge = TOPIC_KNOWLEDGE[topic][difficulty];
  const characteristics = DIFFICULTY_CHARACTERISTICS[difficulty];

  return `You are continuing an interactive farming story game about ${topic}.

**Previous Story Context**:
${storyHistory}

**Player's Choice**: "${userChoice}"
**Choice Quality**: ${isCorrectChoice ? 'Correct/Good decision' : 'Incorrect/Poor decision'}

**Knowledge Focus**: ${knowledge.join(', ')}
**Difficulty**: ${difficulty} (${characteristics.complexity})

**Your Task**: Continue the story based on the player's choice. You should:

1. **Acknowledge the choice** and show its immediate consequences
2. **Provide educational feedback** about why the choice was good/bad
3. **Advance the story** with new challenges or developments
4. **Determine if this should be an ending** or continue with new choices

**Response Format**:
{
  "content": "Story continuation (2-3 paragraphs showing consequences and new developments)",
  "isEnding": true/false,
  "isWinning": true/false (only if isEnding is true),
  "choices": [
    // Only include if isEnding is false
    {
      "id": "choice_1",
      "text": "Choice 1 description",
      "is_correct": true/false
    },
    {
      "id": "choice_2",
      "text": "Choice 2 description", 
      "is_correct": true/false
    },
    {
      "id": "choice_3",
      "text": "Choice 3 description",
      "is_correct": true/false
    }
  ]
}

**Guidelines**:
- Show realistic consequences of the player's decision
- Provide educational value about ${topic}
- If ending the story, make it satisfying and educational
- Winning endings should require mostly correct choices
- Losing endings should teach what went wrong
- Keep the tone encouraging even for mistakes
- Use appropriate ${difficulty} level vocabulary and concepts`;
}

// Choice feedback prompt template
export function generateChoiceFeedbackPrompt(
  topic: GameTopic,
  difficulty: GameDifficulty,
  choice: string,
  isCorrect: boolean
): string {
  return `Provide educational feedback for a ${difficulty} level ${topic} farming decision.

**Player's Choice**: "${choice}"
**Choice Quality**: ${isCorrect ? 'Correct' : 'Incorrect'}

**Your Task**: Explain in 1-2 sentences why this choice is ${isCorrect ? 'good' : 'problematic'} from a farming perspective.

**Guidelines**:
- Be educational but encouraging
- Explain the reasoning clearly
- Use appropriate technical level for ${difficulty}
- Focus on practical farming knowledge
- If incorrect, suggest what would be better`;
}

// Story summary prompt template
export function generateStorySummaryPrompt(
  topic: GameTopic,
  difficulty: GameDifficulty,
  storyHistory: string,
  finalOutcome: 'won' | 'lost'
): string {
  return `Create a learning summary for a completed ${topic} farming story game.

**Story History**:
${storyHistory}

**Final Outcome**: Player ${finalOutcome}
**Topic**: ${topic}
**Difficulty**: ${difficulty}

**Your Task**: Create a concise educational summary that:

1. **Highlights key learning points** from the story
2. **Explains what the player did well** (even if they lost)
3. **Identifies areas for improvement** (if applicable)
4. **Provides encouragement** for continued learning

**Response Format**:
{
  "summary": "2-3 paragraph learning summary",
  "keyLessons": [
    "Lesson 1",
    "Lesson 2", 
    "Lesson 3"
  ],
  "encouragement": "Motivational message for the player"
}

**Guidelines**:
- Focus on educational value over game mechanics
- Be positive and encouraging
- Highlight real-world farming applications
- Suggest next steps for learning`;
}

// Prompt validation and safety
export function validatePromptResponse(response: any, expectedFormat: string): boolean {
  try {
    // Basic structure validation
    if (!response || typeof response !== 'object') {
      return false;
    }

    // Check required fields based on expected format
    if (expectedFormat === 'story_start' || expectedFormat === 'next_node') {
      return !!(response.content && Array.isArray(response.choices));
    }

    if (expectedFormat === 'feedback') {
      return typeof response === 'string' && response.length > 0;
    }

    if (expectedFormat === 'summary') {
      return !!(response.summary && Array.isArray(response.keyLessons) && response.encouragement);
    }

    return false;
  } catch (error) {
    console.error('Prompt response validation error:', error);
    return false;
  }
}

// Content safety filters
export function sanitizeContent(content: string): string {
  // Remove potentially harmful content
  const sanitized = content
    .replace(/\b(hack|exploit|cheat|bypass)\b/gi, 'solve')
    .replace(/\b(kill|destroy|harm)\b/gi, 'manage')
    .trim();

  return sanitized;
}

// Export all prompt utilities
export const promptUtils = {
  generateStoryStartPrompt,
  generateNextNodePrompt,
  generateChoiceFeedbackPrompt,
  generateStorySummaryPrompt,
  validatePromptResponse,
  sanitizeContent,
  TOPIC_KNOWLEDGE,
  DIFFICULTY_CHARACTERISTICS,
  PROMPT_CONFIG,
};