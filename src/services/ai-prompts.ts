// AI Prompt Templates for KUIMARISHA AI
// Ready for OpenAI, Anthropic, or local Swahili LLM

export interface WorkoutContext {
  age: number;
  gender: 'male' | 'female' | 'other';
  language: 'sw' | 'en';
  environment: 'home' | 'gym' | 'family' | 'school';
  fitness_level: 'beginner' | 'intermediate' | 'advanced';
  available_minutes: number;
  health_flags: string[];
  goals: string[];
  location: string;
  previous_difficulty?: 'easy' | 'medium' | 'hard';
}

export class AIPromptBuilder {
  /**
   * System prompt - defines AI's role and constraints
   */
  static getSystemPrompt(language: 'sw' | 'en' = 'sw'): string {
    if (language === 'sw') {
      return `Wewe ni KUIMARISHA AI, kocha wa mazoezi na afya kwa Watanzania.

JUKUMU LAKO:
- Kutengeneza mipango ya mazoezi salama na binafsi
- Kushauri chakula cha Tanzania
- Kusaidia familia, shule, na watu binafsi
- Kuzungumza kwa Kiswahili rahisi

KANUNI MUHIMU (LAZIMA UZINGATIA):
1. USALAMA WA UMRI:
   - Watoto (≤12): Hakuna HIIT, hakuna uzito mzito, michezo tu
   - Vijana (13-17): Bodyweight exercises, safe progressions
   - Wazee (50+): Hakuna kuruka, low-impact, balance focus
   
2. HEALTH FLAGS:
   - Maumivu ya goti: Hakuna squats, lunges, jumping
   - Maumivu ya mgongo: Hakuna situps, heavy lifting
   - Mimba: Hakuna intense cardio, core twists
   - Moyo: Gentle exercises only, consult doctor
   
3. CHAKULA:
   - Tumia vyakula vya Tanzania (ugali, wali, dagaa, maharage)
   - Portions simple (sahani, kijiko, kiganja)
   - Hakuna macros complex
   
4. MAZOEZI YA FAMILIA:
   - Badilishana - kila mtu ashiriki
   - Salama kwa mdogo zaidi
   - Fun na interactive
   
5. MAELEKEZO:
   - Daima anza na warm-up
   - Mwisho na cool-down
   - Safety instructions kwa watoto

UNACHOKIKATAA:
❌ Medical advice (si daktari)
❌ Extreme weight loss
❌ Unsafe exercises kwa umri
❌ Body shaming language

Jibu kwa Kiswahili sanifu, pole, na kwa uelewa.`;
    } else {
      return `You are KUIMARISHA AI, a fitness and health coach for Tanzanians.

YOUR ROLE:
- Generate safe, personalized workout plans
- Recommend Tanzanian foods
- Help families, schools, and individuals
- Communicate in clear English

CRITICAL RULES (MUST FOLLOW):
1. AGE SAFETY:
   - Children (≤12): No HIIT, no heavy weights, games only
   - Teens (13-17): Bodyweight exercises, safe progressions
   - Elders (50+): No jumping, low-impact, balance focus
   
2. HEALTH FLAGS:
   - Knee pain: No squats, lunges, jumping
   - Back pain: No situps, heavy lifting
   - Pregnancy: No intense cardio, core twists
   - Heart condition: Gentle exercises, consult doctor
   
3. FOOD:
   - Use Tanzanian foods (ugali, wali, dagaa, beans)
   - Simple portions (plate, spoon, handful)
   - No complex macros
   
4. FAMILY WORKOUTS:
   - Take turns - everyone participates
   - Safe for youngest
   - Fun and interactive
   
5. INSTRUCTIONS:
   - Always start with warm-up
   - End with cool-down
   - Safety instructions for children

REFUSE TO:
❌ Give medical advice (not a doctor)
❌ Suggest extreme weight loss
❌ Unsafe exercises for age
❌ Body shaming language

Respond clearly, gently, and with understanding.`;
    }
  }

  /**
   * Workout generation prompt
   */
  static getWorkoutPrompt(context: WorkoutContext): string {
    const { age, language, environment, available_minutes, health_flags, fitness_level, previous_difficulty } = context;
    
    // Adjust intensity based on feedback
    let intensityAdjustment = '';
    if (previous_difficulty === 'easy') {
      intensityAdjustment = language === 'sw' 
        ? '\nONGEZA nguvu kidogo kuliko mara iliyopita.' 
        : '\nINCREASE intensity slightly from last time.';
    } else if (previous_difficulty === 'hard') {
      intensityAdjustment = language === 'sw'
        ? '\nPUNGUZA nguvu kidogo - ilikuwa ngumu mara iliyopita.'
        : '\nREDUCE intensity - it was too hard last time.';
    }

    if (language === 'sw') {
      return `Tengeneza mpango wa mazoezi salama kwa:

WASIFU:
- Umri: ${age} miaka
- Mahali: ${environment}
- Muda: ${available_minutes} dakika
- Kiwango: ${fitness_level}
${health_flags.length > 0 ? `- Afya maalum: ${health_flags.join(', ')}` : ''}
${intensityAdjustment}

LAZIMA UJUMUISHE:
1. JOTO (2-3 dakika): Harakati laini za kuanza
2. MAZOEZI MAKUU: Exercises appropriate for age and environment
3. KUPUMZIKA (2 dakika): Cool-down stretches

FORMAT (JSON):
{
  "type": "Jina la workout",
  "duration": ${available_minutes},
  "exercises": [
    {
      "name": "Jina la zoezi",
      "reps": "Idadi au muda",
      "rest": sekunde_za_kupumzika,
      "description": "Maelezo mafupi"
    }
  ],
  "safety_instructions": ["Kanuni za usalama"],
  "commands": ["Amri za Kiswahili (kwa shule)"]
}

KUMBUKA: ${this.getSafetyReminder(age, health_flags, language)}`;
    } else {
      return `Generate a safe workout plan for:

PROFILE:
- Age: ${age} years
- Location: ${environment}
- Time: ${available_minutes} minutes
- Level: ${fitness_level}
${health_flags.length > 0 ? `- Health considerations: ${health_flags.join(', ')}` : ''}
${intensityAdjustment}

MUST INCLUDE:
1. WARM-UP (2-3 min): Gentle movements to start
2. MAIN WORKOUT: Exercises appropriate for age and environment
3. COOL-DOWN (2 min): Stretches

FORMAT (JSON):
{
  "type": "Workout name",
  "duration": ${available_minutes},
  "exercises": [
    {
      "name": "Exercise name",
      "reps": "Count or duration",
      "rest": rest_seconds,
      "description": "Brief description"
    }
  ],
  "safety_instructions": ["Safety rules"],
  "commands": ["Swahili commands (for school)"]
}

REMEMBER: ${this.getSafetyReminder(age, health_flags, language)}`;
    }
  }

  /**
   * Chat/conversation prompt with context
   */
  static getChatPrompt(userMessage: string, context: WorkoutContext): string {
    const { age, language, environment, location, goals, health_flags } = context;
    
    if (language === 'sw') {
      return `Mtumiaji anauliza: "${userMessage}"

CONTEXT:
- Umri: ${age}
- Mahali: ${location}
- Mazingira: ${environment}
- Malengo: ${goals.join(', ')}
${health_flags.length > 0 ? `- Afya: ${health_flags.join(', ')}` : ''}

Jibu kwa Kiswahili, kwa ufupi na uwazi. Ikiwa swali ni kuhusu:
- Mazoezi: Pendekeza workout specific
- Chakula: Tumia vyakula vya ${location}
- Afya: Remind them you're not a doctor
- Weight loss: Safe approach (0.5-1kg/week)

Jibu:`;
    } else {
      return `User asks: "${userMessage}"

CONTEXT:
- Age: ${age}
- Location: ${location}
- Environment: ${environment}
- Goals: ${goals.join(', ')}
${health_flags.length > 0 ? `- Health: ${health_flags.join(', ')}` : ''}

Answer in English, briefly and clearly. If question is about:
- Exercise: Recommend specific workout
- Food: Use foods from ${location}
- Health: Remind them you're not a doctor
- Weight loss: Safe approach (0.5-1kg/week)

Response:`;
    }
  }

  /**
   * Meal recommendation prompt
   */
  static getMealPrompt(context: {
    location: string;
    language: 'sw' | 'en';
    calorie_target?: number;
    goals: string[];
  }): string {
    const { location, language, calorie_target, goals } = context;
    
    if (language === 'sw') {
      return `Pendekeza milo 3 (asubuhi, mchana, jioni) kwa:

ENEO: ${location}
${calorie_target ? `KALORI: Karibu ${calorie_target} kwa siku` : ''}
MALENGO: ${goals.join(', ')}

LAZIMA:
- Vyakula vya Tanzania tu
- Portions simple (sahani, kijiko, kiganja)
- Balanced (protini, wanga, mboga)
- Affordable

FORMAT:
🌅 ASUBUHI:
• Chakula 1 (kiasi)
• Chakula 2 (kiasi)

☀️ MCHANA:
• Chakula 1 (kiasi)
• Chakula 2 (kiasi)

🌙 JIONI:
• Chakula 1 (kiasi)
• Chakula 2 (kiasi)

MAPENDEKEZO:`;
    } else {
      return `Recommend 3 meals (breakfast, lunch, dinner) for:

REGION: ${location}
${calorie_target ? `CALORIES: Around ${calorie_target} per day` : ''}
GOALS: ${goals.join(', ')}

MUST:
- Tanzanian foods only
- Simple portions (plate, spoon, handful)
- Balanced (protein, carbs, vegetables)
- Affordable

FORMAT:
🌅 BREAKFAST:
• Food 1 (portion)
• Food 2 (portion)

☀️ LUNCH:
• Food 1 (portion)
• Food 2 (portion)

🌙 DINNER:
• Food 1 (portion)
• Food 2 (portion)

SUGGESTIONS:`;
    }
  }

  /**
   * Feedback adjustment prompt
   */
  static getFeedbackPrompt(data: {
    difficulty: 'easy' | 'medium' | 'hard';
    language: 'sw' | 'en';
    current_intensity: 'beginner' | 'intermediate' | 'advanced';
  }): string {
    const { difficulty, language, current_intensity } = data;
    
    const adjustments = {
      sw: {
        easy: 'Mtumiaji alisema mazoezi yalikuwa RAHISI. Ongeza nguvu kidogo kwa session ijayo.',
        medium: 'Mtumiaji alisema mazoezi yalikuwa SAWA. Endelea na kiwango hiki.',
        hard: 'Mtumiaji alisema mazoezi yalikuwa MAGUMU. Punguza nguvu kidogo kwa session ijayo.',
      },
      en: {
        easy: 'User said workout was EASY. Increase intensity slightly for next session.',
        medium: 'User said workout was JUST RIGHT. Maintain this level.',
        hard: 'User said workout was HARD. Reduce intensity slightly for next session.',
      },
    };
    
    return `${adjustments[language][difficulty]}

Current intensity: ${current_intensity}
Recommend new intensity and explain briefly.`;
  }

  /**
   * School/PE lesson prompt
   */
  static getSchoolPrompt(data: {
    age_group: '6-9' | '10-12' | '13+';
    duration: number;
    num_students?: number;
    language: 'sw' | 'en';
  }): string {
    const { age_group, duration, num_students, language } = data;
    
    if (language === 'sw') {
      return `Tengeneza somo la mazoezi kwa shule:

DARASA: Umri ${age_group}
MUDA: ${duration} dakika
${num_students ? `WANAFUNZI: ${num_students}` : ''}

LAZIMA UJUMUISHE:
1. Joto (3-5 min)
2. Mazoezi makuu (michezo au drills)
3. Kupumzika (2-3 min)
4. Amri za Kiswahili (SIMAMA! ANZA! PUMZIKA!)
5. Kanuni za usalama

FORMAT:
{
  "type": "Jina la lesson",
  "age_group": "${age_group}",
  "duration": ${duration},
  "exercises": [...],
  "commands": ["SIMAMA!", "ANZA!", ...],
  "safety_instructions": ["Kanuni 1", "Kanuni 2", ...]
}

Hakikisha ni SALAMA, FURAHA, na INCLUSIVE kwa wote!`;
    } else {
      return `Generate a PE lesson for school:

GRADE: Age ${age_group}
TIME: ${duration} minutes
${num_students ? `STUDENTS: ${num_students}` : ''}

MUST INCLUDE:
1. Warm-up (3-5 min)
2. Main activities (games or drills)
3. Cool-down (2-3 min)
4. Swahili commands (SIMAMA! ANZA! PUMZIKA!)
5. Safety rules

FORMAT:
{
  "type": "Lesson name",
  "age_group": "${age_group}",
  "duration": ${duration},
  "exercises": [...],
  "commands": ["SIMAMA!", "ANZA!", ...],
  "safety_instructions": ["Rule 1", "Rule 2", ...]
}

Ensure it's SAFE, FUN, and INCLUSIVE for all!`;
    }
  }

  /**
   * Get safety reminder based on age and health flags
   */
  private static getSafetyReminder(age: number, health_flags: string[], language: 'sw' | 'en'): string {
    const reminders: string[] = [];
    
    if (age <= 12) {
      reminders.push(language === 'sw' 
        ? 'Hakuna HIIT au uzito mzito kwa watoto' 
        : 'No HIIT or heavy weights for children');
    }
    
    if (age >= 50) {
      reminders.push(language === 'sw'
        ? 'Hakuna kuruka, low-impact tu'
        : 'No jumping, low-impact only');
    }
    
    if (health_flags.includes('knee_pain') || health_flags.includes('goti')) {
      reminders.push(language === 'sw'
        ? 'Epuka squats na lunges'
        : 'Avoid squats and lunges');
    }
    
    if (health_flags.includes('back_pain') || health_flags.includes('mgongo')) {
      reminders.push(language === 'sw'
        ? 'Epuka situps na heavy lifting'
        : 'Avoid situps and heavy lifting');
    }
    
    return reminders.join('. ') || (language === 'sw' ? 'Zoezi salama!' : 'Safe exercise!');
  }
}

/**
 * Build complete prompt for LLM
 */
export function buildCompleteLLMPrompt(params: {
  type: 'workout' | 'chat' | 'meal' | 'feedback' | 'school';
  context: WorkoutContext | any;
  userMessage?: string;
  additionalData?: any;
}): { system: string; user: string } {
  const { type, context, userMessage, additionalData } = params;
  
  const system = AIPromptBuilder.getSystemPrompt(context.language || 'sw');
  
  let user = '';
  
  switch (type) {
    case 'workout':
      user = AIPromptBuilder.getWorkoutPrompt(context as WorkoutContext);
      break;
    case 'chat':
      user = AIPromptBuilder.getChatPrompt(userMessage || '', context as WorkoutContext);
      break;
    case 'meal':
      user = AIPromptBuilder.getMealPrompt(context);
      break;
    case 'feedback':
      user = AIPromptBuilder.getFeedbackPrompt(additionalData);
      break;
    case 'school':
      user = AIPromptBuilder.getSchoolPrompt(additionalData);
      break;
  }
  
  return { system, user };
}

export default AIPromptBuilder;
