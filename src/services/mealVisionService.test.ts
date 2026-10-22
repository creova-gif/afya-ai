import { describe, it, expect } from 'bun:test';
import { MealVisionService, MEAL_PHOTO_PRESETS } from './mealVisionService';

describe('MealVisionService Suite', () => {
  it('should have 4 authentic East African meal presets', () => {
    expect(MEAL_PHOTO_PRESETS.length).toBe(4);
    const ids = MEAL_PHOTO_PRESETS.map((p) => p.id);
    expect(ids).toContain('ugali-samaki-sukuma');
    expect(ids).toContain('chipsi-mayai-kachumbari');
    expect(ids).toContain('wali-maharage-mchicha');
    expect(ids).toContain('ndizi-nyama-mchuzi');
  });

  it('should accurately calculate macros for Ugali and Fish preset', async () => {
    const analysis = await MealVisionService.analyzeMeal({
      presetId: 'ugali-samaki-sukuma',
    });

    expect(analysis.dishNameSwahili).toContain('Ugali');
    expect(analysis.totalCalories).toBeGreaterThan(600);
    expect(analysis.totalProtein).toBeGreaterThan(40);
    expect(analysis.detectedItems.length).toBe(3);
    expect(analysis.healthScore).toBe('A');
  });

  it('should convert vision analysis into valid MealLog format', async () => {
    const analysis = await MealVisionService.analyzeMeal({
      presetId: 'wali-maharage-mchicha',
    });

    const mealLog = MealVisionService.toMealLog(analysis, 'lunch');
    expect(mealLog.type).toBe('lunch');
    expect(mealLog.totalCalories).toBe(analysis.totalCalories);
    expect(mealLog.foods.length).toBe(3);
    expect(mealLog.foods[0].name).toContain('Wali');
  });
});
