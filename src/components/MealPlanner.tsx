import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, ChefHat, ShoppingCart, Sparkles, RefreshCw, Plus } from 'lucide-react';
import { UserProfile } from '../App';
import { searchFoods, getAllFoods, type TanzanianFood } from '../services/recipes';
import { toast } from 'sonner@2.0.3';

interface MealPlannerProps {
  profile: UserProfile;
  onBack: () => void;
}

interface DailyMeal {
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snacks?: string[];
  totalCalories: number;
}

interface WeeklyPlan {
  [key: string]: DailyMeal;
}

export function MealPlanner({ profile, onBack }: MealPlannerProps) {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan>({});
  const [selectedDay, setSelectedDay] = useState<string>(getDaysOfWeek()[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [calorieTarget, setCalorieTarget] = useState(profile.dailyCalorieTarget || 2000);

  const text = profile.language === 'sw' ? {
    title: 'Mpango wa Chakula',
    weeklyPlan: 'Mpango wa Wiki',
    generatePlan: 'Tengeneza Mpango',
    regenerate: 'Tengeneza Upya',
    calorieTarget: 'Lengo la Kalori',
    calories: 'Kalori',
    breakfast: 'Kiamsha Kinywa',
    lunch: 'Chakula cha Mchana',
    dinner: 'Chakula cha Jioni',
    snacks: 'Vitafunio',
    shoppingList: 'Orodha ya Ununuzi',
    generating: 'Inaandaa mpango wako...',
    days: {
      monday: 'Jumatatu',
      tuesday: 'Jumanne',
      wednesday: 'Jumatano',
      thursday: 'Alhamisi',
      friday: 'Ijumaa',
      saturday: 'Jumamosi',
      sunday: 'Jumapili',
    },
    preferences: 'Upendeleo',
    vegetarian: 'Mbogamboga',
    balanced: 'Sawa',
    highProtein: 'Protini nyingi',
    addMeal: 'Ongeza Chakula',
    noMeals: 'Hakuna chakula kimepangwa bado',
    startPlanning: 'Anza kupanga vyakula vyako vya wiki',
  } : {
    title: 'Meal Planner',
    weeklyPlan: 'Weekly Plan',
    generatePlan: 'Generate Plan',
    regenerate: 'Regenerate',
    calorieTarget: 'Calorie Target',
    calories: 'Calories',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snacks: 'Snacks',
    shoppingList: 'Shopping List',
    generating: 'Generating your plan...',
    days: {
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
      sunday: 'Sunday',
    },
    preferences: 'Preferences',
    vegetarian: 'Vegetarian',
    balanced: 'Balanced',
    highProtein: 'High Protein',
    addMeal: 'Add Meal',
    noMeals: 'No meals planned yet',
    startPlanning: 'Start planning your weekly meals',
  };

  function getDaysOfWeek(): string[] {
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  }

  const generateWeeklyPlan = async () => {
    setIsGenerating(true);
    toast.info(text.generating);

    // Simulate AI generation
    setTimeout(() => {
      const days = getDaysOfWeek();
      const newPlan: WeeklyPlan = {};

      days.forEach(day => {
        newPlan[day] = generateDailyMeal();
      });

      setWeeklyPlan(newPlan);
      setIsGenerating(false);
      toast.success(profile.language === 'sw' ? 'Mpango umetengenezwa!' : 'Plan generated!');
    }, 2000);
  };

  const generateDailyMeal = (): DailyMeal => {
    const allFoods = getAllFoods();
    
    // Simple meal generation logic
    const breakfast = allFoods.find(f => f.category === 'beverage' || f.swahiliName === 'Chai');
    const lunch = allFoods.find(f => f.category === 'staple' && f.swahiliName === 'Wali');
    const dinner = allFoods.find(f => f.category === 'staple' && f.swahiliName === 'Ugali');
    const snack = allFoods.find(f => f.category === 'snack');

    const totalCalories = (breakfast?.calories || 0) * 2 + 
                         (lunch?.calories || 0) * 3 + 
                         (dinner?.calories || 0) * 3 + 
                         (snack?.calories || 0);

    return {
      breakfast: generateMealDescription('breakfast'),
      lunch: generateMealDescription('lunch'),
      dinner: generateMealDescription('dinner'),
      snacks: [generateMealDescription('snack')],
      totalCalories: Math.round(totalCalories),
    };
  };

  const generateMealDescription = (mealType: string): string => {
    const mealSuggestions = {
      breakfast: {
        sw: ['Chai na Mandazi', 'Uji na Ndizi', 'Mkate na Mayai', 'Chai na Kashata'],
        en: ['Tea and Mandazi', 'Porridge and Banana', 'Bread and Eggs', 'Tea and Kashata'],
      },
      lunch: {
        sw: ['Wali, Maharage na Mchicha', 'Wali na Dagaa', 'Wali, Nyama na Viazi', 'Pilau na Kachumbari'],
        en: ['Rice, Beans and Spinach', 'Rice and Dagaa', 'Rice, Meat and Potatoes', 'Pilau and Salad'],
      },
      dinner: {
        sw: ['Ugali, Nyama na Mchicha', 'Ugali na Dagaa', 'Ndizi na Maharage', 'Ugali na Kuku'],
        en: ['Ugali, Meat and Spinach', 'Ugali and Dagaa', 'Plantain and Beans', 'Ugali and Chicken'],
      },
      snack: {
        sw: ['Embe', 'Chungwa', 'Kashata', 'Karanga'],
        en: ['Mango', 'Orange', 'Kashata', 'Peanuts'],
      },
    };

    const options = mealSuggestions[mealType as keyof typeof mealSuggestions];
    const lang = profile.language === 'sw' ? 'sw' : 'en';
    const meals = options[lang];
    return meals[Math.floor(Math.random() * meals.length)];
  };

  const hasAnyMeals = Object.keys(weeklyPlan).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#000000] via-[#0A1F0F] to-[#000000] text-white pb-20">
      {/* Header */}
      <div className="bg-[#0A1F0F]/80 backdrop-blur-md border-b border-[#1EB53A]/20 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{text.title}</h1>
            </div>
            <ChefHat className="w-8 h-8 text-[#1EB53A]" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Calorie Target */}
        <div className="bg-black/30 border border-white/10 rounded-3xl p-6">
          <label className="block text-sm text-white/60 mb-2">{text.calorieTarget}</label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={calorieTarget}
              onChange={(e) => setCalorieTarget(parseInt(e.target.value) || 2000)}
              className="flex-1 px-4 py-3 bg-black/30 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#1EB53A]"
            />
            <span className="text-white/60">{text.calories}</span>
          </div>
        </div>

        {/* Generate Button */}
        {!hasAnyMeals ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#1EB53A]/20 to-emerald-500/10 rounded-full flex items-center justify-center">
              <ChefHat className="w-12 h-12 text-[#1EB53A]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{text.noMeals}</h3>
            <p className="text-white/60 mb-6">{text.startPlanning}</p>
            <button
              onClick={generateWeeklyPlan}
              disabled={isGenerating}
              className="px-8 py-4 bg-gradient-to-r from-[#1EB53A] to-emerald-500 text-white rounded-full font-bold hover:shadow-lg transition-all inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Sparkles className="w-5 h-5" />
              {text.generatePlan}
            </button>
          </div>
        ) : (
          <>
            {/* Days Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {getDaysOfWeek().map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                    selectedDay === day
                      ? 'bg-[#1EB53A] text-white'
                      : 'bg-black/30 text-white/60 hover:bg-black/50'
                  }`}
                >
                  {text.days[day as keyof typeof text.days]}
                </button>
              ))}
            </div>

            {/* Daily Meals */}
            {weeklyPlan[selectedDay] && (
              <motion.div
                key={selectedDay}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* Breakfast */}
                <div className="bg-gradient-to-r from-orange-500/20 to-yellow-500/10 p-6 rounded-3xl border border-orange-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-2xl">☀️</div>
                    <h3 className="text-lg font-bold text-white">{text.breakfast}</h3>
                  </div>
                  <p className="text-white/80">{weeklyPlan[selectedDay].breakfast}</p>
                </div>

                {/* Lunch */}
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/10 p-6 rounded-3xl border border-blue-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-2xl">🌤️</div>
                    <h3 className="text-lg font-bold text-white">{text.lunch}</h3>
                  </div>
                  <p className="text-white/80">{weeklyPlan[selectedDay].lunch}</p>
                </div>

                {/* Dinner */}
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/10 p-6 rounded-3xl border border-purple-500/30">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-2xl">🌙</div>
                    <h3 className="text-lg font-bold text-white">{text.dinner}</h3>
                  </div>
                  <p className="text-white/80">{weeklyPlan[selectedDay].dinner}</p>
                </div>

                {/* Snacks */}
                {weeklyPlan[selectedDay].snacks && weeklyPlan[selectedDay].snacks!.length > 0 && (
                  <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/10 p-6 rounded-3xl border border-green-500/30">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-2xl">🍎</div>
                      <h3 className="text-lg font-bold text-white">{text.snacks}</h3>
                    </div>
                    <div className="space-y-2">
                      {weeklyPlan[selectedDay].snacks!.map((snack, index) => (
                        <p key={index} className="text-white/80">{snack}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total Calories */}
                <div className="bg-black/30 border border-white/10 rounded-3xl p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-white/60">{text.calories}</span>
                    <span className="text-2xl font-bold text-[#1EB53A]">
                      {weeklyPlan[selectedDay].totalCalories}
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#1EB53A] to-emerald-500"
                      style={{
                        width: `${Math.min((weeklyPlan[selectedDay].totalCalories / calorieTarget) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={generateWeeklyPlan}
                disabled={isGenerating}
                className="flex-1 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-semibold hover:bg-white/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                {text.regenerate}
              </button>
              <button
                className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {text.shoppingList}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
