import React, { useState } from 'react';
import { 
  Utensils, 
  Droplet, 
  Flame, 
  Moon, 
  Check, 
  Plus, 
  Minus, 
  AlertCircle, 
  Sparkles, 
  Heart, 
  Footprints, 
  Clock 
} from 'lucide-react';
import { FoodActivityLog } from './types';

interface FoodActivityGuidanceProps {
  lifestyle: FoodActivityLog[];
  onUpdateWater: (glasses: number) => void;
  onAddMeal: (meal: { type: 'breakfast'|'lunch'|'dinner'|'snack'; description: string; tags: any[] }) => void;
}

export const FoodActivityGuidance: React.FC<FoodActivityGuidanceProps> = ({
  lifestyle,
  onUpdateWater,
  onAddMeal,
}) => {
  const latestLog = lifestyle[0];
  const [waterCount, setWaterCount] = useState<number>(latestLog?.waterGlasses || 7);
  const waterTarget = latestLog?.waterTarget || 8;

  // New meal form state
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('snack');
  const [mealDesc, setMealDesc] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('iron-rich');

  const handleWaterChange = (delta: number) => {
    const updated = Math.max(0, Math.min(16, waterCount + delta));
    setWaterCount(updated);
    onUpdateWater(updated);
  };

  const handleMealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealDesc.trim()) return;
    onAddMeal({
      type: mealType,
      description: mealDesc.trim(),
      tags: [selectedTag],
    });
    setMealDesc('');
  };

  return (
    <div id="herhealth-food-activity-guidance" className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-sky-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <Utensils className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-[#0B1E3D]">Food, Hydration & Activity Guidance</h2>
          </div>
          <p className="text-xs text-slate-600">
            Evidence-informed lifestyle practices, micronutrient nourishment, and somatic movement tailored for female endocrine health.
          </p>
        </div>
      </div>

      {/* Wellness Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>General Wellness Disclaimer:</strong> Nutrition and physical activity suggestions here are for general educational wellness and do not substitute for personalized medical nutrition therapy or individualized dietary prescriptions from a registered dietitian.
        </p>
      </div>

      {/* Interactive Hydration & Daily Target Tracker */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hydration Tracker */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-sky-500" />
              <h3 className="text-base font-bold text-[#0B1E3D]">Daily Hydration</h3>
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              {waterCount} / {waterTarget} Glasses
            </span>
          </div>

          <div className="text-center py-3 space-y-2">
            <div className="text-3xl font-black text-[#0B1E3D]">
              {(waterCount * 250) / 1000} <span className="text-sm font-normal text-slate-500">Liters</span>
            </div>
            <p className="text-xs text-slate-500">
              {waterCount >= waterTarget ? 'Daily target reached!' : `${waterTarget - waterCount} glasses remaining`}
            </p>

            <div className="flex items-center justify-center gap-4 pt-2">
              <button
                onClick={() => handleWaterChange(-1)}
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-lg transition-colors cursor-pointer"
                title="Remove a glass"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleWaterChange(1)}
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white flex items-center gap-1.5 font-bold text-xs shadow-xs transition-colors cursor-pointer"
                title="Add a glass (250ml)"
              >
                <Plus className="w-4 h-4" />
                <span>Log Glass (250ml)</span>
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 bg-sky-50/50 p-3 rounded-2xl border border-sky-100">
            <strong>Hydration Tip:</strong> Consistent hydration aids in reducing fluid retention bloating and alleviates tension headaches across the cycle.
          </p>
        </div>

        {/* Daily Activity Goals */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Footprints className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-bold text-[#0B1E3D]">Daily Movement</h3>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Active Goals
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0B1E3D] block">Step Count</span>
                <span className="text-slate-500">Goal: 8,000 steps</span>
              </div>
              <span className="text-sm font-black text-teal-700">7,420</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <span className="font-bold text-[#0B1E3D] block">Gentle Movement</span>
                <span className="text-slate-500">Yoga / Walking / Stretching</span>
              </div>
              <span className="text-sm font-black text-teal-700">35 min</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 bg-teal-50/50 p-3 rounded-2xl border border-teal-100">
            <strong>Gentle Somatics:</strong> Hip-opening poses (Baddha Konasana, Child’s Pose) relieve pelvic congestion and lumbar strain.
          </p>
        </div>

        {/* Sleep & Lifestyle Habits */}
        <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-5 h-5 text-indigo-600" />
              <h3 className="text-base font-bold text-[#0B1E3D]">Sleep & Stress Habits</h3>
            </div>
            <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
              Score: 4/5
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-700">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Caffeine stopped 8 hours before bed</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Cool room temperature (18–20°C)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>10-minute diaphragmatic breathing practiced</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100">
            <strong>Circadian Sync:</strong> Exposure to natural morning sunlight within 30 minutes of waking stabilizes morning cortisol and nighttime melatonin.
          </p>
        </div>
      </div>

      {/* 4 Pillars of Female Nutrition Cards */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B1E3D]">Core Pillars of Women’s Nutritional Health</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {/* Iron-Rich Foods */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2">
            <span className="font-bold text-rose-900 block text-sm">1. Iron-Rich Foods</span>
            <p className="text-slate-600 leading-relaxed">
              Replenishes hemoglobin lost during menstruation. Incorporate lentils, chickpeas, spinach, moringa leaves, pumpkin seeds, and beets.
            </p>
            <div className="text-[11px] font-semibold text-rose-800 bg-rose-100/80 p-2 rounded-xl">
              Tip: Pair with Vitamin C (lemon, amla, bell peppers) to boost non-heme iron absorption.
            </div>
          </div>

          {/* Clean Protein */}
          <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-2">
            <span className="font-bold text-teal-900 block text-sm">2. Adequate Protein</span>
            <p className="text-slate-600 leading-relaxed">
              Essential for neurotransmitter synthesis and hormone peptide building blocks. Aim for 1.0–1.2g/kg body weight from dal, eggs, tofu, fish, paneer, and Greek yogurt.
            </p>
            <div className="text-[11px] font-semibold text-teal-800 bg-teal-100/80 p-2 rounded-xl">
              Tip: Consuming protein at breakfast blunts glucose spikes and stabilizes mid-morning cravings.
            </div>
          </div>

          {/* Fiber & Fruits/Vegetables */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
            <span className="font-bold text-emerald-900 block text-sm">3. Rainbow Fiber</span>
            <p className="text-slate-600 leading-relaxed">
              Cruciferous vegetables (broccoli, cauliflower) supply diindolylmethane (DIM) which supports healthy estrogen clearance via hepatic beta-glucuronidase pathways.
            </p>
            <div className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 p-2 rounded-xl">
              Tip: Target 25–30g of prebiotic dietary fiber daily from chia seeds, oats, and berries.
            </div>
          </div>

          {/* Healthy Fats & Anti-Inflammatory */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
            <span className="font-bold text-amber-900 block text-sm">4. Anti-Inflammatory Fats</span>
            <p className="text-slate-600 leading-relaxed">
              Omega-3 fatty acids attenuate inflammatory prostaglandins (PGE2) responsible for uterine cramping. Walnuts, flaxseeds, cold-pressed olive oil, and salmon.
            </p>
            <div className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 p-2 rounded-xl">
              Tip: Add ground flaxseeds to morning oatmeal or yogurt for gentle phytoestrogen balance.
            </div>
          </div>
        </div>
      </div>

      {/* Quick Meal Logging Card */}
      <div className="bg-white p-6 rounded-3xl border border-sky-100 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-[#0B1E3D]">Log a Nourishing Meal or Snack</h3>

        <form onSubmit={handleMealSubmit} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Meal Type</label>
            <select
              value={mealType}
              onChange={(e: any) => setMealType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-teal-500 capitalize"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nutritional Highlight</label>
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-teal-500"
            >
              <option value="iron-rich">Iron-Rich</option>
              <option value="protein">High Protein</option>
              <option value="fiber">Fiber / Prebiotic</option>
              <option value="calcium">Calcium Rich</option>
              <option value="anti-inflammatory">Anti-Inflammatory</option>
            </select>
          </div>

          <div className="sm:col-span-2 flex items-end gap-2">
            <div className="flex-1">
              <label className="block font-bold text-slate-700 mb-1">Description</label>
              <input
                type="text"
                placeholder="e.g. Lentil soup with steamed spinach and lemon..."
                value={mealDesc}
                onChange={(e) => setMealDesc(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-teal-500"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Log</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
