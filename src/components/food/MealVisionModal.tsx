import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import {
  Camera,
  Upload,
  Sparkles,
  Flame,
  CheckCircle2,
  Utensils,
  Plus,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { MEAL_PHOTO_PRESETS, MealVisionService } from '../../services/mealVisionService';
import { MealVisionAnalysis } from '../../types/mealVision';
import { MealLog } from '../../App';

interface MealVisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveMeal: (meal: MealLog) => void;
}

export const MealVisionModal: React.FC<MealVisionModalProps> = ({
  isOpen,
  onClose,
  onSaveMeal,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(MEAL_PHOTO_PRESETS[0].id);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<MealVisionAnalysis | null>(null);
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('lunch');
  const [uploadedPreview, setUploadedPreview] = useState<string | null>(null);

  const handleSelectPreset = (id: string) => {
    setSelectedPresetId(id);
    setUploadedPreview(null);
    setAnalysis(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedPreview(event.target?.result as string);
        setSelectedPresetId('');
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
      toast.info('Picha ya chakula imepakiwa. Bonyeza kuchambua lishe.');
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await MealVisionService.analyzeMeal({
        presetId: selectedPresetId || undefined,
      });
      setAnalysis(result);
      toast.success('Picha imechambuliwa kikamilifu!');
    } catch (err: any) {
      console.error('Vision analysis error:', err);
      toast.error('Haikuweza kuchambua picha ya chakula.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSaveToMealLog = () => {
    if (!analysis) return;
    const mealLog = MealVisionService.toMealLog(analysis, mealType);
    onSaveMeal(mealLog);
    toast.success(`${analysis.dishNameSwahili} imehifadhiwa kwenye rekodi za leo!`);
    onClose();
  };

  const activePreset = MEAL_PHOTO_PRESETS.find((p) => p.id === selectedPresetId);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-4 sm:p-6 bg-background rounded-3xl border shadow-2xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2.5 py-0.5">
              <Camera className="w-3.5 h-3.5 mr-1" />
              AI Meal Vision Kamera
            </Badge>
            <Badge variant="outline" className="text-xs text-muted-foreground">
              Vyakula vya Asili vya Tanzania
            </Badge>
          </div>
          <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
            Piga Picha ya Chakula Chako
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            AI inatambua viungo vya sahani yako, inakadiria kalori, protini, wanga na mafuta kulingana na vyakula vya Tanzania.
          </DialogDescription>
        </DialogHeader>

        {/* 1-Click Tanzanian Food Presets */}
        <div className="space-y-2 pt-2">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Vyakula vya Majaribio (East African Presets)
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MEAL_PHOTO_PRESETS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.id)}
                  className={`text-left p-2 rounded-2xl border transition-all text-xs space-y-1 overflow-hidden relative ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500'
                      : 'border-border/80 bg-card hover:bg-muted/50'
                  }`}
                >
                  <img
                    src={preset.imageUrl}
                    alt={preset.dishNameSwahili}
                    className="w-full h-16 object-cover rounded-xl mb-1.5"
                  />
                  <p className="font-semibold text-foreground line-clamp-1">{preset.dishNameSwahili}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1">{preset.mockAnalysis.totalCalories} kcal</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Upload or Selected Image Display */}
        <div className="space-y-3 pt-2">
          <div className="relative border-2 border-dashed border-border/80 rounded-2xl p-4 text-center hover:border-emerald-500/40 transition-colors bg-muted/20">
            {uploadedPreview || activePreset ? (
              <div className="relative rounded-xl overflow-hidden max-h-56 mx-auto flex items-center justify-center">
                <img
                  src={uploadedPreview || activePreset?.imageUrl}
                  alt="Meal Preview"
                  className="max-h-56 w-auto object-cover rounded-xl shadow-md"
                />
                <label className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full border shadow-sm text-xs font-medium cursor-pointer hover:bg-background flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-primary" />
                  Badilisha Picha
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            ) : (
              <label className="cursor-pointer py-6 flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold text-foreground">Bofya hapa kupakia picha ya chakula</span>
                <span className="text-xs text-muted-foreground">Inasaidia JPG, PNG, WEBP kutoka kwenye simu</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>
            )}
          </div>

          <Button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full h-11 rounded-2xl font-semibold shadow-md gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isAnalyzing ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                AI inatambua viungo na kupima lishe...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Chambua Sahani Hii (Scan Nutrition)
              </>
            )}
          </Button>
        </div>

        {/* Nutritional Breakdown Results */}
        {analysis && (
          <div className="mt-4 space-y-4 pt-4 border-t">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">{analysis.dishNameSwahili}</h3>
                <p className="text-xs text-muted-foreground">{analysis.dishNameEnglish}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 px-2 py-0.5 text-xs font-bold">
                  Daraja: {analysis.healthScore}
                </Badge>
              </div>
            </div>

            {/* Macro Cards Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <Card className="rounded-2xl border bg-card/60 p-2.5">
                <Flame className="w-4 h-4 mx-auto text-amber-500 mb-1" />
                <span className="text-base font-extrabold text-foreground">{analysis.totalCalories}</span>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Kalori (kcal)</p>
              </Card>
              <Card className="rounded-2xl border bg-card/60 p-2.5">
                <div className="w-4 h-4 mx-auto text-blue-500 font-bold mb-1">🥩</div>
                <span className="text-base font-extrabold text-foreground">{analysis.totalProtein}g</span>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Protini</p>
              </Card>
              <Card className="rounded-2xl border bg-card/60 p-2.5">
                <div className="w-4 h-4 mx-auto text-amber-600 font-bold mb-1">🌾</div>
                <span className="text-base font-extrabold text-foreground">{analysis.totalCarbs}g</span>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Wanga</p>
              </Card>
              <Card className="rounded-2xl border bg-card/60 p-2.5">
                <div className="w-4 h-4 mx-auto text-orange-500 font-bold mb-1">🥑</div>
                <span className="text-base font-extrabold text-foreground">{analysis.totalFat}g</span>
                <p className="text-[10px] text-muted-foreground uppercase font-bold">Mafuta</p>
              </Card>
            </div>

            {/* Food Items Breakdown */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Vipimo Vilivyotambuliwa Kwenye Sahani
              </Label>
              <div className="space-y-1.5">
                {analysis.detectedItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-muted/40 border text-xs">
                    <div>
                      <span className="font-semibold text-foreground">{item.nameSwahili}</span>
                      <span className="text-muted-foreground ml-1.5 text-[11px]">({item.portion})</span>
                    </div>
                    <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      {item.calories} kcal
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cultural & Dietary Advice in Swahili */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs space-y-1">
              <div className="flex items-center text-emerald-800 dark:text-emerald-300 font-semibold">
                <Info className="w-3.5 h-3.5 mr-1" />
                Ushauri wa Lishe kwa Kiswahili
              </div>
              <p className="text-muted-foreground leading-relaxed">{analysis.swahiliDietAdvice}</p>
            </div>

            {/* Save to Food Tracking */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-1 w-full sm:w-auto">
                <Label className="text-xs text-muted-foreground whitespace-nowrap">Muda wa Mlo:</Label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value as any)}
                  className="h-9 rounded-xl border bg-card px-2 text-xs font-medium w-full sm:w-auto"
                >
                  <option value="breakfast">Kifungua Kinywa (Breakfast)</option>
                  <option value="lunch">Chakula cha Mchana (Lunch)</option>
                  <option value="dinner">Chakula cha Jioni (Dinner)</option>
                  <option value="snack">Vitafunwa (Snack)</option>
                </select>
              </div>

              <Button
                onClick={handleSaveToMealLog}
                className="w-full sm:flex-1 h-9 rounded-xl font-semibold bg-primary text-primary-foreground gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Hifadhi Kwenye Rekodi za Leo (Log Meal)
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
