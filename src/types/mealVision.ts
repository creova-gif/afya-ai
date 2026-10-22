import { z } from 'zod';

export const DetectedFoodItemSchema = z.object({
  name: z.string(),
  nameSwahili: z.string(),
  portion: z.string(),
  calories: z.number(),
  proteinGrams: z.number(),
  carbsGrams: z.number(),
  fatGrams: z.number(),
});
export type DetectedFoodItem = z.infer<typeof DetectedFoodItemSchema>;

export const MealVisionAnalysisSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  dishNameSwahili: z.string(),
  dishNameEnglish: z.string(),
  confidence: z.number(),
  detectedItems: z.array(DetectedFoodItemSchema),
  totalCalories: z.number(),
  totalProtein: z.number(),
  totalCarbs: z.number(),
  totalFat: z.number(),
  healthScore: z.enum(['A', 'B', 'C', 'D']),
  swahiliDietAdvice: z.string(),
  culturalContext: z.string(),
});
export type MealVisionAnalysis = z.infer<typeof MealVisionAnalysisSchema>;

export interface MealPhotoPreset {
  id: string;
  dishNameSwahili: string;
  dishNameEnglish: string;
  imageUrl: string;
  description: string;
  mockAnalysis: MealVisionAnalysis;
}
