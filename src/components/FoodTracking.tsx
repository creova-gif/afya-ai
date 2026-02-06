import { useState } from 'react';
import { ArrowLeft, Plus, Search, Flame, Apple, Coffee, UtensilsCrossed, Cookie } from 'lucide-react';
import { UserProfile, MealLog } from '../App';

interface FoodTrackingProps {
  profile: UserProfile;
  todayMeals: MealLog[];
  onAddMeal: (meal: MealLog) => void;
  onBack: () => void;
}

export function FoodTracking({ profile, todayMeals, onAddMeal, onBack }: FoodTrackingProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [showAddMeal, setShowAddMeal] = useState(false);

  const text = profile.language === 'sw' ? {
    nutrition: 'Lishe',
    calories: 'Kalori',
    consumed: 'Uliyokula',
    remaining: 'Iliyobaki',
    breakfast: 'Kifungua Kinywa',
    lunch: 'Chakula cha Mchana',
    dinner: 'Chakula cha Jioni',
    snack: 'Vitafunwa',
    addMeal: 'Ongeza Mlo',
    search: 'Tafuta chakula...',
    tanzanianFoods: 'Vyakula vya Tanzania',
    popular: 'Maarufu',
  } : {
    nutrition: 'Nutrition',
    calories: 'Calories',
    consumed: 'Consumed',
    remaining: 'Remaining',
    breakfast: 'Breakfast',
    lunch: 'Lunch',
    dinner: 'Dinner',
    snack: 'Snack',
    addMeal: 'Add Meal',
    search: 'Search food...',
    tanzanianFoods: 'Tanzanian Foods',
    popular: 'Popular',
  };

  // Tanzanian foods database
  const tanzanianFoods = [
    { name: 'Ugali', nameEn: 'Ugali (Maize Porridge)', calories: 120, portion: '1 cup', icon: '🌾' },
    { name: 'Wali', nameEn: 'Rice', calories: 200, portion: '1 cup', icon: '🍚' },
    { name: 'Nyama ya Ng\'ombe', nameEn: 'Beef', calories: 250, portion: '100g', icon: '🥩' },
    { name: 'Samaki', nameEn: 'Fish', calories: 180, portion: '100g', icon: '🐟' },
    { name: 'Dagaa', nameEn: 'Sardines', calories: 150, portion: '50g', icon: '🐠' },
    { name: 'Maharage', nameEn: 'Beans', calories: 110, portion: '1 cup', icon: '🫘' },
    { name: 'Ndizi', nameEn: 'Banana', calories: 90, portion: '1 medium', icon: '🍌' },
    { name: 'Mkate', nameEn: 'Bread', calories: 80, portion: '1 slice', icon: '🍞' },
    { name: 'Chapati', nameEn: 'Flatbread', calories: 140, portion: '1 piece', icon: '🫓' },
    { name: 'Pilau', nameEn: 'Spiced Rice', calories: 280, portion: '1 cup', icon: '🍛' },
    { name: 'Mchuzi wa Nyanya', nameEn: 'Tomato Sauce', calories: 60, portion: '1/2 cup', icon: '🍅' },
    { name: 'Mayai', nameEn: 'Eggs', calories: 70, portion: '1 egg', icon: '🥚' },
  ];

  const caloriesConsumed = todayMeals.reduce((sum, meal) => sum + meal.totalCalories, 0);
  const caloriesTarget = profile.dailyCalorieTarget || 2000;
  const caloriesRemaining = caloriesTarget - caloriesConsumed;
  const caloriesPercent = Math.min((caloriesConsumed / caloriesTarget) * 100, 100);

  const getMealIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return <Coffee className="w-5 h-5" />;
      case 'lunch': return <UtensilsCrossed className="w-5 h-5" />;
      case 'dinner': return <Apple className="w-5 h-5" />;
      case 'snack': return <Cookie className="w-5 h-5" />;
      default: return <Apple className="w-5 h-5" />;
    }
  };

  const handleAddFood = (food: typeof tanzanianFoods[0]) => {
    const newMeal: MealLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: selectedMealType,
      foods: [{ name: profile.language === 'sw' ? food.name : food.nameEn, portion: food.portion, calories: food.calories }],
      totalCalories: food.calories,
    };
    onAddMeal(newMeal);
    setShowAddMeal(false);
  };

  const filteredFoods = tanzanianFoods.filter(food =>
    food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    food.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#000000] pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#000000]/90 backdrop-blur-xl border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-3xl text-white tracking-tight flex-1" style={{ fontWeight: 800 }}>
              {text.nutrition}
            </h1>
            <button
              onClick={() => setShowAddMeal(true)}
              className="w-10 h-10 rounded-full bg-[#FF6B35] flex items-center justify-center hover:bg-[#E85A2A] transition-colors shadow-lg"
            >
              <Plus className="w-5 h-5 text-white" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Calories Ring - Apple style */}
        <div className="bg-gradient-to-br from-[#FF6B35]/20 to-[#E85A2A]/10 backdrop-blur-xl border border-[#FF6B35]/30 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-white" style={{ fontWeight: 700 }}>{text.calories}</h2>
            <Flame className="w-6 h-6 text-[#FF6B35]" strokeWidth={2.5} />
          </div>

          {/* Calorie Ring */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="rgba(255, 107, 53, 0.2)"
                  strokeWidth="16"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="#FF6B35"
                  strokeWidth="16"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - caloriesPercent / 100)}`}
                  className="transition-all duration-1000"
                />
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-4xl text-white mb-1" style={{ fontWeight: 800 }}>
                  {caloriesConsumed}
                </div>
                <div className="text-sm text-white/60" style={{ fontWeight: 600 }}>
                  of {caloriesTarget}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white/5 rounded-2xl">
              <div className="text-2xl text-white mb-1" style={{ fontWeight: 700 }}>
                {caloriesConsumed}
              </div>
              <div className="text-xs text-white/60" style={{ fontWeight: 600 }}>
                {text.consumed}
              </div>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-2xl">
              <div className="text-2xl text-white mb-1" style={{ fontWeight: 700 }}>
                {caloriesRemaining > 0 ? caloriesRemaining : 0}
              </div>
              <div className="text-xs text-white/60" style={{ fontWeight: 600 }}>
                {text.remaining}
              </div>
            </div>
          </div>
        </div>

        {/* Meals List */}
        <div>
          <h2 className="text-xl text-white mb-4 px-1" style={{ fontWeight: 700 }}>Today's Meals</h2>
          <div className="space-y-3">
            {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => {
              const typedMealType = mealType as 'breakfast' | 'lunch' | 'dinner' | 'snack';
              const meals = todayMeals.filter(m => m.type === typedMealType);
              const totalCals = meals.reduce((sum, m) => sum + m.totalCalories, 0);

              return (
                <div
                  key={mealType}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF6B35] to-[#E85A2A] flex items-center justify-center">
                        {getMealIcon(mealType)}
                      </div>
                      <div>
                        <h3 className="text-base text-white" style={{ fontWeight: 700 }}>
                          {text[typedMealType as keyof typeof text]}
                        </h3>
                        <p className="text-sm text-white/60" style={{ fontWeight: 500 }}>
                          {totalCals > 0 ? `${totalCals} cal` : 'Not logged'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedMealType(typedMealType);
                        setShowAddMeal(true);
                      }}
                      className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-white" strokeWidth={3} />
                    </button>
                  </div>

                  {/* Food items */}
                  {meals.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                      {meals.map((meal) => (
                        <div key={meal.id}>
                          {meal.foods.map((food, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <span className="text-white/80">{food.name}</span>
                              <span className="text-white/60">{food.calories} cal</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      {showAddMeal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#1C1C1E] rounded-t-3xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#1C1C1E] border-b border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl text-white" style={{ fontWeight: 700 }}>{text.addMeal}</h3>
                <button
                  onClick={() => setShowAddMeal(false)}
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <Plus className="w-5 h-5 text-white rotate-45" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  placeholder={text.search}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#FF6B35] transition-colors"
                  style={{ fontWeight: 500 }}
                />
              </div>
            </div>

            {/* Food List */}
            <div className="p-6 overflow-y-auto max-h-[calc(80vh-140px)]">
              <h4 className="text-sm text-white/60 mb-3" style={{ fontWeight: 600 }}>
                {text.tanzanianFoods}
              </h4>
              <div className="space-y-2">
                {filteredFoods.map((food, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddFood(food)}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 text-left transition-all active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{food.icon}</div>
                        <div>
                          <div className="text-base text-white" style={{ fontWeight: 600 }}>
                            {profile.language === 'sw' ? food.name : food.nameEn}
                          </div>
                          <div className="text-sm text-white/60" style={{ fontWeight: 500 }}>
                            {food.portion}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg text-white" style={{ fontWeight: 700 }}>
                          {food.calories}
                        </div>
                        <div className="text-xs text-white/60">cal</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
