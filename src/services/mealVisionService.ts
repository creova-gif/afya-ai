// East African Meal Vision & Nutrition Tracking Service
import { MealLog } from '../App';
import { MealPhotoPreset, MealVisionAnalysis, MealVisionAnalysisSchema } from '../types/mealVision';

export const MEAL_PHOTO_PRESETS: MealPhotoPreset[] = [
  {
    id: 'ugali-samaki-sukuma',
    dishNameSwahili: 'Ugali, Samaki wa Kukaanga na Sukuma Wiki',
    dishNameEnglish: 'Maize Fufu with Fried Tilapia & Collard Greens',
    imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    description: 'Chakula kikuu cha asili: ugali wa mahindi, samaki sato mzima na mboga za kukaanga.',
    mockAnalysis: {
      id: 'vis-ugali-samaki',
      timestamp: new Date().toISOString(),
      dishNameSwahili: 'Ugali, Samaki wa Kukaanga na Sukuma Wiki',
      dishNameEnglish: 'Maize Fufu with Fried Tilapia & Collard Greens',
      confidence: 0.94,
      detectedItems: [
        {
          name: 'Ugali (Maize)',
          nameSwahili: 'Ugali wa Mahindi',
          portion: 'Kipande 1 cha wastani (~250g)',
          calories: 280,
          proteinGrams: 6,
          carbsGrams: 58,
          fatGrams: 2,
        },
        {
          name: 'Fried Whole Tilapia',
          nameSwahili: 'Samaki Sato wa Kukaanga',
          portion: 'Samaki 1 mzima (~200g)',
          calories: 290,
          proteinGrams: 38,
          carbsGrams: 0,
          fatGrams: 14,
        },
        {
          name: 'Braised Sukuma Wiki',
          nameSwahili: 'Sukuma Wiki ya Kukaanga na Vitunguu',
          portion: 'Kikombe 1 (~100g)',
          calories: 65,
          proteinGrams: 3,
          carbsGrams: 7,
          fatGrams: 3,
        },
      ],
      totalCalories: 635,
      totalProtein: 47,
      totalCarbs: 65,
      totalFat: 19,
      healthScore: 'A',
      swahiliDietAdvice:
        'Mlo bora kabisa wenye uwiano mzuri wa protini nyingi kutoka kwa samaki na nyuzinyuzi za sukuma wiki. Punguza kiasi cha mafuta yanayotumika kukaanga samaki iwapo unafuatilia uzito.',
      culturalContext: 'Mlo pendwa zaidi ukanda wa Ziwa Victoria na pwani ya Tanzania.',
    },
  },
  {
    id: 'wali-maharage-mchicha',
    dishNameSwahili: 'Wali wa Nazi, Maharage na Mchicha',
    dishNameEnglish: 'Coconut Rice with Stewed Kidney Beans & Spinach',
    imageUrl: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&auto=format&fit=crop&q=80',
    description: 'Mlo kamili wa asili unaotoa protini mimea na madini ya chuma.',
    mockAnalysis: {
      id: 'vis-wali-maharage',
      timestamp: new Date().toISOString(),
      dishNameSwahili: 'Wali wa Nazi, Maharage na Mchicha',
      dishNameEnglish: 'Coconut Rice with Stewed Kidney Beans & Spinach',
      confidence: 0.91,
      detectedItems: [
        {
          name: 'Coconut White Rice',
          nameSwahili: 'Wali wa Nazi',
          portion: 'Kikombe 1 na nusu (~200g)',
          calories: 310,
          proteinGrams: 5,
          carbsGrams: 54,
          fatGrams: 8,
        },
        {
          name: 'Stewed Kidney Beans',
          nameSwahili: 'Maharage ya Nazi',
          portion: 'Kikombe 1 (~180g)',
          calories: 220,
          proteinGrams: 14,
          carbsGrams: 36,
          fatGrams: 2,
        },
        {
          name: 'Sautéed Spinach / Mchicha',
          nameSwahili: 'Mchicha wa Kukaanga',
          portion: 'Kikombe 1/2 (~80g)',
          calories: 45,
          proteinGrams: 2,
          carbsGrams: 4,
          fatGrams: 2,
        },
      ],
      totalCalories: 575,
      totalProtein: 21,
      totalCarbs: 94,
      totalFat: 12,
      healthScore: 'A',
      swahiliDietAdvice:
        'Chaguo zuri sana la protini ya mimea. Maharage yanasaidia mmeng’enyo na afya ya moyo. Ikiwezekana badili wali mweupe kuwa wali wa brown kwa nyuzinyuzi zaidi.',
      culturalContext: 'Mlo wa kitamaduni unaopendwa sana mchana maeneo ya pwani na mijini.',
    },
  },
  {
    id: 'chipsi-mayai-kachumbari',
    dishNameSwahili: 'Chipsi Mayai (Zege) na Kachumbari',
    dishNameEnglish: 'French Fry Omelette with Fresh Tomato Salsa',
    imageUrl: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80',
    description: 'Chakula maarufu cha mitaani cha haraka kikiwa na mayai 2 na viazi.',
    mockAnalysis: {
      id: 'vis-chipsi-mayai',
      timestamp: new Date().toISOString(),
      dishNameSwahili: 'Chipsi Mayai (Zege) na Kachumbari',
      dishNameEnglish: 'French Fry Omelette with Fresh Tomato Salsa',
      confidence: 0.96,
      detectedItems: [
        {
          name: 'Fried Potatoes (Chips)',
          nameSwahili: 'Viazi vya Kukaanga (Chipsi)',
          portion: 'Sahani 1 ya wastani (~200g)',
          calories: 420,
          proteinGrams: 4,
          carbsGrams: 55,
          fatGrams: 22,
        },
        {
          name: 'Eggs (2 medium)',
          nameSwahili: 'Mayai 2 ya Kienyeji',
          portion: 'Mayai 2 (~100g)',
          calories: 145,
          proteinGrams: 12,
          carbsGrams: 1,
          fatGrams: 10,
        },
        {
          name: 'Kachumbari (Tomato & Onion Salsa)',
          nameSwahili: 'Kachumbari ya Nyanya, Kitunguu na Pilipili',
          portion: 'Vijiko 3 vya chakula (~50g)',
          calories: 25,
          proteinGrams: 1,
          carbsGrams: 4,
          fatGrams: 0,
        },
      ],
      totalCalories: 590,
      totalProtein: 17,
      totalCarbs: 60,
      totalFat: 32,
      healthScore: 'C',
      swahiliDietAdvice:
        'Mlo wenye mafuta na wanga mwingi. Ongeza kachumbari nyingi zaidi bila mayonesi, na uhakikishe unakunywa maji ya kutosha. Yafaa kuliwa mara chache kwa wiki.',
      culturalContext: 'Street food nambari moja nchini Tanzania inayopatikana kila kona.',
    },
  },
  {
    id: 'ndizi-nyama-mchuzi',
    dishNameSwahili: 'Ndizi Nyama (Machalari ya Ndizi)',
    dishNameEnglish: 'Green Banana & Beef Stew',
    imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=600&auto=format&fit=crop&q=80',
    description: 'Mchemsho maarufu wa ndizi mbichi na nyama laini ya ng’ombe yenye mchuzi.',
    mockAnalysis: {
      id: 'vis-ndizi-nyama',
      timestamp: new Date().toISOString(),
      dishNameSwahili: 'Ndizi Nyama (Machalari ya Ndizi)',
      dishNameEnglish: 'Green Banana & Beef Stew',
      confidence: 0.92,
      detectedItems: [
        {
          name: 'Cooked Green Cooking Bananas',
          nameSwahili: 'Ndizi Mbichi Zilizopikwa (Bukoba/Kagera style)',
          portion: 'Ndizi 3 za wastani (~250g)',
          calories: 260,
          proteinGrams: 3,
          carbsGrams: 64,
          fatGrams: 1,
        },
        {
          name: 'Lean Beef Pieces',
          nameSwahili: 'Nyama ya Ng\'ombe Isiyo na Mafuta',
          portion: 'Vipande 4 (~120g)',
          calories: 210,
          proteinGrams: 28,
          carbsGrams: 0,
          fatGrams: 9,
        },
        {
          name: 'Tomato & Carrot Stew Broth',
          nameSwahili: 'Mchuzi wa Nyanya, Karoti na Hoho',
          portion: 'Kikombe 1/2 cha mchuzi (~100g)',
          calories: 50,
          proteinGrams: 1,
          carbsGrams: 6,
          fatGrams: 2,
        },
      ],
      totalCalories: 520,
      totalProtein: 32,
      totalCarbs: 70,
      totalFat: 12,
      healthScore: 'A',
      swahiliDietAdvice:
        'Chakula chenye virutubisho vingi vya madini ya potasiamu (kutoka kwenye ndizi) na madini ya chuma na protini kutoka kwenye nyama. Hakina mafuta mengi.',
      culturalContext: 'Chakula cha kitamaduni cha maeneo ya Mbinga, Kagera na Kilimanjaro.',
    },
  },
];

export class MealVisionService {
  /**
   * Analyze an uploaded meal image or preset
   */
  public static async analyzeMeal(params: {
    presetId?: string;
    imageFile?: File;
  }): Promise<MealVisionAnalysis> {
    // If a preset is requested, return its tuned clinical model analysis
    if (params.presetId) {
      const preset = MEAL_PHOTO_PRESETS.find((p) => p.id === params.presetId);
      if (preset) {
        return MealVisionAnalysisSchema.parse(preset.mockAnalysis);
      }
    }

    // If an image file was uploaded, parse and estimate (simulated multi-modal vision inference)
    const fileName = params.imageFile ? params.imageFile.name.toLowerCase() : '';

    if (fileName.includes('samaki') || fileName.includes('fish') || fileName.includes('ugali')) {
      return MealVisionAnalysisSchema.parse(MEAL_PHOTO_PRESETS[0].mockAnalysis);
    } else if (fileName.includes('chips') || fileName.includes('zege') || fileName.includes('yai')) {
      return MealVisionAnalysisSchema.parse(MEAL_PHOTO_PRESETS[2].mockAnalysis);
    } else if (fileName.includes('ndizi') || fileName.includes('banana') || fileName.includes('machalari')) {
      return MealVisionAnalysisSchema.parse(MEAL_PHOTO_PRESETS[3].mockAnalysis);
    }

    // Default to balanced local dish
    const defaultAnalysis = MEAL_PHOTO_PRESETS[1].mockAnalysis;
    return MealVisionAnalysisSchema.parse({
      ...defaultAnalysis,
      id: `vis-${Date.now()}`,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Convert MealVisionAnalysis into standard App MealLog
   */
  public static toMealLog(
    analysis: MealVisionAnalysis,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' = 'lunch'
  ): MealLog {
    return {
      id: `meal-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      type: mealType,
      foods: analysis.detectedItems.map((item) => ({
        name: `${item.nameSwahili} (${item.portion})`,
        portion: item.portion,
        calories: item.calories,
      })),
      totalCalories: analysis.totalCalories,
    };
  }
}
