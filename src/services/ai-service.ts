// AI Service - OpenAI Integration for KUIMARISHA AI
import { buildCompleteLLMPrompt, WorkoutContext } from './ai-prompts';
import { getCurrentSession } from '../utils/supabase/client';

interface AIResponse {
  message: string;
  data?: any;
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * AI Service for real-time workout generation, meal planning, and coaching
 */
export class AIService {
  private static API_BASE = '/make-server-24b55e7e';

  /**
   * Generate a personalized workout using AI
   */
  static async generateWorkout(context: WorkoutContext): Promise<any> {
    const { system, user } = buildCompleteLLMPrompt({
      type: 'workout',
      context,
    });

    const response = await this.callAI({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.7,
      responseFormat: 'json',
      language: context.language,
    });

    try {
      // Parse JSON response
      const workoutData = JSON.parse(response.message);
      return workoutData;
    } catch (err) {
      console.error('Failed to parse AI workout response:', err);
      // Return fallback workout if parsing fails
      return this.getFallbackWorkout(context);
    }
  }

  /**
   * Chat with AI Coach
   */
  static async chat(userMessage: string, context: WorkoutContext, conversationHistory: ChatMessage[] = []): Promise<string> {
    const { system, user } = buildCompleteLLMPrompt({
      type: 'chat',
      context,
      userMessage,
    });

    // Build conversation with history
    const messages: ChatMessage[] = [
      { role: 'system', content: system },
      ...conversationHistory,
      { role: 'user', content: user },
    ];

    const response = await this.callAI({
      messages,
      temperature: 0.8,
      language: context.language,
    });

    return response.message;
  }

  /**
   * Generate meal plan
   */
  static async generateMealPlan(context: {
    location: string;
    language: 'sw' | 'en';
    calorie_target?: number;
    goals: string[];
  }): Promise<string> {
    const { system, user } = buildCompleteLLMPrompt({
      type: 'meal',
      context,
    });

    const response = await this.callAI({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.7,
      language: context.language,
    });

    return response.message;
  }

  /**
   * Generate school PE lesson
   */
  static async generateSchoolLesson(data: {
    age_group: '6-9' | '10-12' | '13+';
    duration: number;
    num_students?: number;
    language: 'sw' | 'en';
  }): Promise<any> {
    const { system, user } = buildCompleteLLMPrompt({
      type: 'school',
      context: { language: data.language },
      additionalData: data,
    });

    const response = await this.callAI({
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.7,
      responseFormat: 'json',
      language: data.language,
    });

    try {
      return JSON.parse(response.message);
    } catch (err) {
      console.error('Failed to parse AI school lesson response:', err);
      return this.getFallbackSchoolLesson(data);
    }
  }

  /**
   * Call AI backend (server handles the actual OpenAI/Claude API call)
   */
  private static async callAI(params: {
    messages: ChatMessage[];
    temperature?: number;
    responseFormat?: 'text' | 'json';
    language?: 'sw' | 'en';
  }): Promise<AIResponse> {
    const auth = await this.sessionAuth();
    if (!auth) {
      throw new Error('Authentication required');
    }
    const headers = auth.headers;

    try {
      const response = await fetch(`${this.API_BASE}/ai/generate`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: params.messages.filter((message) => message.role !== 'system'),
          temperature: params.temperature,
          responseFormat: params.responseFormat,
          language: params.language ?? 'sw',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(errorData.error || 'AI generation failed');
        (error as Error & { code?: string }).code = errorData.code;
        throw error;
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error('AI Service error:', err);
      throw err;
    }
  }

  /**
   * Session access token only. Returns null when nobody is signed in.
   */
  private static async sessionAuth(): Promise<{ headers: Record<string, string>; userId: string } | null> {
    try {
      const session = await getCurrentSession();
      if (!session?.access_token || !session.user?.id) return null;
      return {
        userId: session.user.id,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
      };
    } catch {
      return null;
    }
  }

  /**
   * Fallback workout when AI is unavailable
   */
  private static getFallbackWorkout(context: WorkoutContext): any {
    const isSwahili = context.language === 'sw';
    
    return {
      type: isSwahili ? 'Mazoezi ya Msingi' : 'Basic Workout',
      duration: context.available_minutes || 20,
      exercises: [
        {
          name: isSwahili ? 'Joto - Kunyoosha Mikono' : 'Warm-up - Arm Circles',
          reps: '30 seconds',
          rest: 10,
          description: isSwahili ? 'Zungusha mikono kwa mzunguko' : 'Circle arms in wide motion',
        },
        {
          name: isSwahili ? 'Squats' : 'Squats',
          reps: context.fitness_level === 'beginner' ? '10 reps' : '15 reps',
          rest: 30,
          description: isSwahili ? 'Shuka kama unakaa kitini' : 'Lower as if sitting in a chair',
        },
        {
          name: 'Push-ups',
          reps: context.fitness_level === 'beginner' ? '5 reps' : '10 reps',
          rest: 30,
          description: isSwahili ? 'Usukume mwili kutoka chini' : 'Push your body up from the ground',
        },
        {
          name: isSwahili ? 'Plank' : 'Plank',
          reps: '20 seconds',
          rest: 30,
          description: isSwahili ? 'Simama kwa mikono na miguu' : 'Hold position on hands and feet',
        },
        {
          name: isSwahili ? 'Kupumzika - Kunyoosha' : 'Cool-down - Stretching',
          reps: '2 minutes',
          rest: 0,
          description: isSwahili ? 'Nyoosha mikono na miguu pole pole' : 'Gently stretch arms and legs',
        },
      ],
      safety_instructions: [
        isSwahili ? 'Kumbuka kunywa maji kabla na baada ya mazoezi' : 'Remember to drink water before and after',
        isSwahili ? 'Simama ikiwa unahisi uchovu mwingi' : 'Stop if you feel too tired',
      ],
      commands: isSwahili 
        ? ['ANZA!', 'PUMZIKA!', 'ENDELEA!', 'MWISHO!']
        : ['START!', 'REST!', 'CONTINUE!', 'FINISH!'],
    };
  }

  /**
   * Fallback school lesson when AI is unavailable
   */
  private static getFallbackSchoolLesson(data: {
    age_group: '6-9' | '10-12' | '13+';
    duration: number;
    language: 'sw' | 'en';
  }): any {
    const isSwahili = data.language === 'sw';
    
    return {
      type: isSwahili ? 'Somo la Mazoezi' : 'PE Lesson',
      age_group: data.age_group,
      duration: data.duration,
      exercises: [
        {
          name: isSwahili ? 'Joto - Kukimbia Mahali Moja' : 'Warm-up - Running in Place',
          reps: '2 minutes',
          rest: 30,
          description: isSwahili ? 'Kimbia bila kusogea mbele' : 'Run without moving forward',
        },
        {
          name: isSwahili ? 'Mchezo - Tag' : 'Game - Tag',
          reps: '10 minutes',
          rest: 60,
          description: isSwahili ? 'Mtu mmoja anafuata wengine' : 'One person chases others',
        },
        {
          name: isSwahili ? 'Kupumzika - Kunyoosha' : 'Cool-down - Stretching',
          reps: '2 minutes',
          rest: 0,
          description: isSwahili ? 'Nyoosha mikono na miguu' : 'Stretch arms and legs',
        },
      ],
      commands: ['SIMAMA!', 'ANZA!', 'PUMZIKA!', 'MWISHO!'],
      safety_instructions: [
        isSwahili ? 'Simama ikiwa unahisi uchovu' : 'Stop if you feel tired',
        isSwahili ? 'Nywa maji mara kwa mara' : 'Drink water regularly',
      ],
    };
  }

  /**
   * Save conversation to database
   */
  static async saveConversation(userId: string, conversationData: {
    user_message: string;
    ai_response: string;
    context: any;
  }): Promise<void> {
    try {
      const auth = await this.sessionAuth();
      if (!auth) return;
      if (userId !== auth.userId) {
        console.error('Refusing to save a conversation for a different user');
        return;
      }

      const response = await fetch(`${this.API_BASE}/ai/conversation`, {
        method: 'POST',
        headers: auth.headers,
        body: JSON.stringify({
          userId: auth.userId,
          ...conversationData,
        }),
      });
      if (!response.ok) {
        console.error('Failed to save conversation');
      }
    } catch (err) {
      console.error('Failed to save conversation:', err);
      // Non-critical error, don't throw
    }
  }

  /**
   * Get conversation history
   */
  static async getConversationHistory(userId: string, limit = 20): Promise<ChatMessage[]> {
    try {
      const auth = await this.sessionAuth();
      if (!auth || userId !== auth.userId) {
        return [];
      }

      const response = await fetch(
        `${this.API_BASE}/ai/conversation/${encodeURIComponent(auth.userId)}?limit=${limit}`,
        { headers: auth.headers },
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch conversation history');
      }

      const data = await response.json();
      return data.conversations || [];
    } catch (err) {
      console.error('Failed to get conversation history:', err);
      return [];
    }
  }
}

export default AIService;
