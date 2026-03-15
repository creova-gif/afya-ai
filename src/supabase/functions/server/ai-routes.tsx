import { Hono } from "npm:hono";
import * as kv from "./kv_store.tsx";

const aiRoutes = new Hono();

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIGenerateRequest {
  messages: ChatMessage[];
  temperature?: number;
  responseFormat?: 'text' | 'json';
}

/**
 * POST /ai/generate - Generate AI response using OpenAI
 */
aiRoutes.post('/generate', async (c) => {
  try {
    const body: AIGenerateRequest = await c.req.json();
    const { messages, temperature = 0.7, responseFormat = 'text' } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return c.json({ error: 'Messages array is required' }, 400);
    }

    // Get OpenAI API key from environment
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiApiKey) {
      console.warn('OPENAI_API_KEY not set - using fallback demo mode');
      // Return a demo response
      return c.json({
        message: generateDemoResponse(messages),
        usage: { demo: true }
      });
    }

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Fast and cost-effective model
        messages,
        temperature,
        ...(responseFormat === 'json' ? { response_format: { type: 'json_object' } } : {}),
      }),
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      console.error('OpenAI API error:', errorData);
      
      // Fallback to demo response on error
      return c.json({
        message: generateDemoResponse(messages),
        usage: { demo: true, error: errorData.error?.message }
      });
    }

    const data = await openaiResponse.json();
    const aiMessage = data.choices[0]?.message?.content || '';

    return c.json({
      message: aiMessage,
      usage: data.usage,
    });
  } catch (err) {
    console.error('AI generation error:', err);
    return c.json({ error: `AI generation failed: ${err.message}` }, 500);
  }
});

/**
 * POST /ai/conversation - Save AI conversation to database
 */
aiRoutes.post('/conversation', async (c) => {
  try {
    const body = await c.req.json();
    const { userId, user_message, ai_response, context } = body;

    if (!userId || !user_message || !ai_response) {
      return c.json({ error: 'userId, user_message, and ai_response are required' }, 400);
    }

    // Create conversation record
    const conversationId = `conv_${userId}_${Date.now()}`;
    const conversationData = {
      id: conversationId,
      user_id: userId,
      user_message,
      ai_response,
      context: context || {},
      created_at: new Date().toISOString(),
    };

    // Store in KV store with conversation ID as key
    await kv.set(conversationId, conversationData);

    // Also store a reference in user's conversation list
    const userConversationsKey = `user_conversations_${userId}`;
    const existingConversations = await kv.get(userConversationsKey) || [];
    const updatedConversations = [
      conversationId,
      ...existingConversations.slice(0, 49), // Keep last 50 conversations
    ];
    await kv.set(userConversationsKey, updatedConversations);

    return c.json({ success: true, conversationId });
  } catch (err) {
    console.error('Save conversation error:', err);
    return c.json({ error: `Failed to save conversation: ${err.message}` }, 500);
  }
});

/**
 * GET /ai/conversation/:userId - Get user's conversation history
 */
aiRoutes.get('/conversation/:userId', async (c) => {
  try {
    const userId = c.req.param('userId');
    const limit = parseInt(c.req.query('limit') || '20');

    if (!userId) {
      return c.json({ error: 'userId is required' }, 400);
    }

    // Get user's conversation IDs
    const userConversationsKey = `user_conversations_${userId}`;
    const conversationIds = await kv.get(userConversationsKey) || [];

    // Get the actual conversation data
    const limitedIds = conversationIds.slice(0, limit);
    const conversations = await kv.mget(limitedIds);

    return c.json({ conversations });
  } catch (err) {
    console.error('Get conversation history error:', err);
    return c.json({ error: `Failed to get conversation history: ${err.message}` }, 500);
  }
});

/**
 * Generate demo response when OpenAI is not available
 */
function generateDemoResponse(messages: ChatMessage[]): string {
  const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || '';
  
  // Detect if it's a workout request
  if (lastUserMessage.toLowerCase().includes('workout') || 
      lastUserMessage.toLowerCase().includes('mazoezi') ||
      lastUserMessage.toLowerCase().includes('format (json)')) {
    return JSON.stringify({
      type: 'Mazoezi ya Msingi',
      duration: 20,
      exercises: [
        {
          name: 'Joto - Kunyoosha Mikono',
          reps: '30 seconds',
          rest: 10,
          description: 'Zungusha mikono kwa mzunguko',
        },
        {
          name: 'Squats',
          reps: '10 reps',
          rest: 30,
          description: 'Shuka kama unakaa kitini',
        },
        {
          name: 'Push-ups',
          reps: '5 reps',
          rest: 30,
          description: 'Usukume mwili kutoka chini',
        },
        {
          name: 'Plank',
          reps: '20 seconds',
          rest: 30,
          description: 'Simama kwa mikono na miguu',
        },
        {
          name: 'Kupumzika - Kunyoosha',
          reps: '2 minutes',
          rest: 0,
          description: 'Nyoosha mikono na miguu pole pole',
        },
      ],
      safety_instructions: [
        'Kumbuka kunywa maji kabla na baada ya mazoezi',
        'Simama ikiwa unahisi uchovu mwingi',
      ],
      commands: ['ANZA!', 'PUMZIKA!', 'ENDELEA!', 'MWISHO!'],
    });
  }

  // Detect if it's a school lesson request
  if (lastUserMessage.toLowerCase().includes('school') || 
      lastUserMessage.toLowerCase().includes('shule') ||
      lastUserMessage.toLowerCase().includes('pe lesson')) {
    return JSON.stringify({
      type: 'Somo la Mazoezi',
      age_group: '10-12',
      duration: 30,
      exercises: [
        {
          name: 'Joto - Kukimbia Mahali Moja',
          reps: '2 minutes',
          rest: 30,
          description: 'Kimbia bila kusogea mbele',
        },
        {
          name: 'Mchezo - Tag',
          reps: '10 minutes',
          rest: 60,
          description: 'Mtu mmoja anafuata wengine',
        },
        {
          name: 'Kupumzika - Kunyoosha',
          reps: '2 minutes',
          rest: 0,
          description: 'Nyoosha mikono na miguu',
        },
      ],
      commands: ['SIMAMA!', 'ANZA!', 'PUMZIKA!', 'MWISHO!'],
      safety_instructions: [
        'Simama ikiwa unahisi uchovu',
        'Nywa maji mara kwa mara',
      ],
    });
  }

  // Default chat response
  const isSwahili = lastUserMessage.includes('wa') || lastUserMessage.includes('na') || lastUserMessage.includes('ya');
  
  if (isSwahili) {
    return 'Asante kwa swali lako! Nina tayari kukusaidia na mazoezi na chakula. Je, ungependa mazoezi ya leo au ushauri wa chakula? (DEMO MODE - OpenAI API key haijawekwa)';
  } else {
    return 'Thank you for your question! I\'m ready to help you with workouts and nutrition. Would you like today\'s workout or food advice? (DEMO MODE - OpenAI API key not configured)';
  }
}

export default aiRoutes;
