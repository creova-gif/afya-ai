/**
 * Recipe & Tanzanian Food Database Service
 * Comprehensive database of Tanzanian foods, recipes, and meal planning
 */

export interface TanzanianFood {
  id: string;
  name: string;
  swahiliName: string;
  category: 'staple' | 'protein' | 'vegetable' | 'fruit' | 'snack' | 'beverage';
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber: number; // grams
  portionSize: string;
  portionGrams: number;
  commonPortions: { name: string; multiplier: number }[];
  region?: string[];
  seasonal?: boolean;
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
}

export interface Recipe {
  id: string;
  name: {
    sw: string;
    en: string;
  };
  description: {
    sw: string;
    en: string;
  };
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
  cuisine: 'tanzanian' | 'swahili' | 'nyama_choma' | 'pilau' | 'ugali' | 'coastal';
  prepTime: number; // minutes
  cookTime: number; // minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: {
    foodId: string;
    amount: number;
    unit: string;
    notes?: string;
  }[];
  steps: {
    sw: string;
    en: string;
  }[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  };
  tags: string[];
  dietaryFlags: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    halal: boolean;
  };
  imageUrl?: string;
  region: string[];
  ageGroup: ('child' | 'teen' | 'adult' | 'elder')[];
}

export interface MealPlan {
  id: string;
  userId: string;
  familyMemberId?: string;
  weekStartDate: string;
  meals: {
    day: string;
    breakfast?: string; // recipe ID
    lunch?: string;
    dinner?: string;
    snacks?: string[];
  }[];
  generatedBy: 'ai' | 'manual';
  calorieTarget: number;
  dietaryPreferences: string[];
}

export interface ShoppingList {
  id: string;
  userId: string;
  mealPlanId?: string;
  items: {
    foodId: string;
    amount: number;
    unit: string;
    checked: boolean;
    category: string;
  }[];
  generatedAt: string;
  totalEstimatedCost?: number;
}

// Tanzanian Foods Database
export const TANZANIAN_FOODS: TanzanianFood[] = [
  // Staples
  {
    id: 'ugali',
    name: 'Ugali (maize meal)',
    swahiliName: 'Ugali',
    category: 'staple',
    calories: 112,
    protein: 2.4,
    carbs: 24,
    fat: 0.4,
    fiber: 1.2,
    portionSize: '1 kibamia (medium ball)',
    portionGrams: 100,
    commonPortions: [
      { name: 'kibamia dogo (small)', multiplier: 0.7 },
      { name: 'kibamia (medium)', multiplier: 1.0 },
      { name: 'kibamia kubwa (large)', multiplier: 1.5 },
    ],
    region: ['all'],
    vegetarian: true,
    vegan: true,
    glutenFree: true,
  },
  {
    id: 'wali',
    name: 'Rice (cooked)',
    swahiliName: 'Wali',
    category: 'staple',
    calories: 130,
    protein: 2.7,
    carbs: 28,
    fat: 0.3,
    fiber: 0.4,
    portionSize: '1 bakuli (cup)',
    portionGrams: 100,
    commonPortions: [
      { name: 'bakuli dogo', multiplier: 0.5 },
      { name: 'bakuli', multiplier: 1.0 },
      { name: 'bakuli kubwa', multiplier: 1.5 },
    ],
    region: ['all'],
    vegetarian: true,
    vegan: true,
    glutenFree: true,
  },
  {
    id: 'ndizi',
    name: 'Plantain (cooked)',
    swahiliName: 'Ndizi za kupika',
    category: 'staple',
    calories: 122,
    protein: 1.3,
    carbs: 31.9,
    fat: 0.4,
    fiber: 2.3,
    portionSize: '1 ndizi (medium)',
    portionGrams: 100,
    commonPortions: [
      { name: '1 ndizi dogo', multiplier: 0.7 },
      { name: '1 ndizi', multiplier: 1.0 },
      { name: '1 ndizi kubwa', multiplier: 1.3 },
    ],
    region: ['Kilimanjaro', 'Kagera', 'Coastal'],
    vegetarian: true,
    vegan: true,
    glutenFree: true,
  },

  // Proteins
  {
    id: 'dagaa',
    name: 'Dagaa (small dried fish)',
    swahiliName: 'Dagaa',
    category: 'protein',
    calories: 80,
    protein: 16,
    carbs: 0,
    fat: 1.5,
    fiber: 0,
    portionSize: '2 vijiko (tablespoons)',
    portionGrams: 30,
    commonPortions: [
      { name: '1 kijiko', multiplier: 0.5 },
      { name: '2 vijiko', multiplier: 1.0 },
      { name: '1 bakuli dogo', multiplier: 3.0 },
    ],
    region: ['Lake Victoria', 'Lake Tanganyika', 'Coastal'],
    vegetarian: false,
    vegan: false,
    glutenFree: true,
  },
  {
    id: 'nyama_ng_ombe',
    name: 'Beef',
    swahiliName: "Nyama ya ng'ombe",
    category: 'protein',
    calories: 250,
    protein: 26,
    carbs: 0,
    fat: 15,
    fiber: 0,
    portionSize: '1 kipande (piece)',
    portionGrams: 100,
    commonPortions: [
      { name: 'kipande dogo', multiplier: 0.7 },
      { name: 'kipande', multiplier: 1.0 },
      { name: 'kipande kubwa', multiplier: 1.5 },
    ],
    region: ['all'],
    vegetarian: false,
    vegan: false,
    glutenFree: true,
  },
  {
    id: 'kuku',
    name: 'Chicken',
    swahiliName: 'Kuku',
    category: 'protein',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    portionSize: '1 kipande (piece)',
    portionGrams: 100,
    commonPortions: [
      { name: 'paja (thigh)', multiplier: 1.2 },
      { name: 'kidari (breast)', multiplier: 1.5 },
      { name: 'ubawa (wing)', multiplier: 0.5 },
    ],
    region: ['all'],
    vegetarian: false,
    vegan: false,
    glutenFree: true,
  },
  {
    id: 'maharage',
    name: 'Beans (cooked)',
    swahiliName: 'Maharage',
    category: 'protein',
    calories: 127,
    protein: 8.7,
    carbs: 22.8,
    fat: 0.5,
    fiber: 6.4,
    portionSize: '1 bakuli (cup)',
    portionGrams: 100,
    commonPortions: [
      { name: 'bakuli dogo', multiplier: 0.5 },
      { name: 'bakuli', multiplier: 1.0 },
    ],
    region: ['all'],
    vegetarian: true,
    vegan: true,
    glutenFree: true,
  },

  // Vegetables
  {
    id: 'mchicha',
    name: 'Spinach/Amaranth greens',
    swahiliName: 'Mchicha',
    category: 'vegetable',
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    portionSize: '1 bakuli (cup cooked)',
    portionGrams: 100,
    commonPortions: [
      { name: 'bakuli dogo', multiplier: 0.5 },
      { name: 'bakuli', multiplier: 1.0 },
    ],
    region: ['all'],
    vegetarian: true,
    vegan: true,
    glutenFree: true,
  },
  {
    id: 'viazi_vikuu',
    name: 'Potatoes',
    swahiliName: 'Viazi vikuu',
    category: 'vegetable',
    calories: 77,
    protein: 2,
    carbs: 17,
    fat: 0.1,
    fiber: 2.2,
    portionSize: '1 kiazi (medium potato)',
    portionGrams: 100,
    commonPortions: [
      { name: 'kiazi dogo', multiplier: 0.7 },
      { name: 'kiazi', multiplier: 1.0 },
      { name: 'kiazi kubwa', multiplier: 1.5 },
    ],
    region: ['all'],
    vegetarian: true,
    vegan: true,
    glutenFree: true,
  },
  {
    id: 'nyanya',
    name: 'Tomatoes',
    swahiliName: 'Nyanya',
    category: 'vegetable',
    calories: 18,
    protein: 0.9,
    carbs: 3.9,
    fat: 0.2,
    fiber: 1.2,
    portionSize: '1 nyanya (medium tomato)',
    portionGrams: 100,
    commonPortions: [
      { name: 'nyanya dogo', multiplier: 0.6 },
      { name: 'nyanya', multiplier: 1.0 },
      { name: 'nyanya kubwa', multiplier: 1.4 },
    ],
    region: ['all'],
    vegetarian: true,
    vegan: true,
    glutenFree: true,
  },

  // Fruits
  {
    id: 'embe',
    name: 'Mango',
    swahiliName: 'Embe',
    category: 'fruit',
    calories: 60,
    protein: 0.8,
    carbs: 15,
    fat: 0.4,
    fiber: 1.6,
    portionSize: '1 embe (medium mango)',
    portionGrams: 100,
    commonPortions: [
      { name: 'embe dogo', multiplier: 0.7 },
      { name: 'embe', multiplier: 1.0 },
      { name: 'embe kubwa', multiplier: 1.5 },
    ],
    region: ['Coastal', 'Tanga', 'Morogoro'],
    seasonal: true,
    vegetarian: true,
    vegan: true,
    glutenFree: true,
  },
  {
    id: 'chungwa',
    name: 'Orange',
    swahiliName: 'Chungwa',
    category: 'fruit',
    calories: 47,
    protein: 0.9,
    carbs: 11.8,
    fat: 0.1,
    fiber: 2.4,
    portionSize: '1 chungwa (medium orange)',
    portionGrams: 100,
    commonPortions: [
      { name: 'chungwa dogo', multiplier: 0.7 },
      { name: 'chungwa', multiplier: 1.0 },
    ],
    region: ['all'],
    vegetarian: true,
    vegan: true,
    glutenFree: true,
  },

  // Snacks & Beverages
  {
    id: 'chai',
    name: 'Tea with milk and sugar',
    swahiliName: 'Chai ya maziwa',
    category: 'beverage',
    calories: 50,
    protein: 1.5,
    carbs: 8,
    fat: 1.5,
    fiber: 0,
    portionSize: '1 kikombe (cup)',
    portionGrams: 200,
    commonPortions: [
      { name: 'kikombe dogo', multiplier: 0.7 },
      { name: 'kikombe', multiplier: 1.0 },
      { name: 'kikombe kubwa', multiplier: 1.3 },
    ],
    region: ['all'],
    vegetarian: true,
    vegan: false,
    glutenFree: true,
  },
  {
    id: 'mandazi',
    name: 'Mandazi (fried dough)',
    swahiliName: 'Mandazi',
    category: 'snack',
    calories: 270,
    protein: 5,
    carbs: 35,
    fat: 12,
    fiber: 1.5,
    portionSize: '1 kipande (piece)',
    portionGrams: 60,
    commonPortions: [
      { name: '1 mandazi dogo', multiplier: 0.8 },
      { name: '1 mandazi', multiplier: 1.0 },
      { name: '1 mandazi kubwa', multiplier: 1.3 },
    ],
    region: ['Coastal', 'all'],
    vegetarian: true,
    vegan: false,
    glutenFree: false,
  },
  {
    id: 'kashata',
    name: 'Kashata (coconut candy)',
    swahiliName: 'Kashata',
    category: 'snack',
    calories: 150,
    protein: 1,
    carbs: 20,
    fat: 8,
    fiber: 2,
    portionSize: '1 kipande (piece)',
    portionGrams: 30,
    commonPortions: [
      { name: '1 kipande', multiplier: 1.0 },
    ],
    region: ['Coastal'],
    vegetarian: true,
    vegan: true,
    glutenFree: true,
  },
];

class RecipeService {
  /**
   * Search foods by name
   */
  searchFoods(query: string, language: 'sw' | 'en' = 'sw'): TanzanianFood[] {
    const lowerQuery = query.toLowerCase();
    return TANZANIAN_FOODS.filter(food => {
      if (language === 'sw') {
        return food.swahiliName.toLowerCase().includes(lowerQuery);
      }
      return food.name.toLowerCase().includes(lowerQuery) || 
             food.swahiliName.toLowerCase().includes(lowerQuery);
    });
  }

  /**
   * Get food by ID
   */
  getFoodById(id: string): TanzanianFood | undefined {
    return TANZANIAN_FOODS.find(food => food.id === id);
  }

  /**
   * Get foods by category
   */
  getFoodsByCategory(category: TanzanianFood['category']): TanzanianFood[] {
    return TANZANIAN_FOODS.filter(food => food.category === category);
  }

  /**
   * Calculate nutrition for portion
   */
  calculateNutrition(foodId: string, portionMultiplier: number = 1.0): {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
  } | null {
    const food = this.getFoodById(foodId);
    if (!food) return null;

    return {
      calories: Math.round(food.calories * portionMultiplier),
      protein: Math.round(food.protein * portionMultiplier * 10) / 10,
      carbs: Math.round(food.carbs * portionMultiplier * 10) / 10,
      fat: Math.round(food.fat * portionMultiplier * 10) / 10,
      fiber: Math.round(food.fiber * portionMultiplier * 10) / 10,
    };
  }

  /**
   * Get all foods
   */
  getAllFoods(): TanzanianFood[] {
    return TANZANIAN_FOODS;
  }

  /**
   * Filter foods by dietary requirements
   */
  filterByDietary(options: {
    vegetarian?: boolean;
    vegan?: boolean;
    glutenFree?: boolean;
  }): TanzanianFood[] {
    return TANZANIAN_FOODS.filter(food => {
      if (options.vegetarian && !food.vegetarian) return false;
      if (options.vegan && !food.vegan) return false;
      if (options.glutenFree && !food.glutenFree) return false;
      return true;
    });
  }
}

// Export singleton
export const recipeService = new RecipeService();

// Export utility functions
export const searchFoods = (query: string, lang: 'sw' | 'en' = 'sw') => 
  recipeService.searchFoods(query, lang);
export const getFoodById = (id: string) => recipeService.getFoodById(id);
export const getAllFoods = () => recipeService.getAllFoods();
export const calculateNutrition = (foodId: string, portion: number) => 
  recipeService.calculateNutrition(foodId, portion);
