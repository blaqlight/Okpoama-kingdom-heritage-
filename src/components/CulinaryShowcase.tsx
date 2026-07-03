/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CULINARY } from '../data/okpoamaData';
import { ChefHat, Flame, ThumbsUp, RotateCcw, AlertTriangle, Sparkles, BookOpen, UtensilsCrossed } from 'lucide-react';
import { CulinaryItem } from '../types';

export const CulinaryShowcase: React.FC<{ initialDishId?: string }> = ({ initialDishId }) => {
  const [selectedDish, setSelectedDish] = useState<CulinaryItem>(CULINARY[0]);
  
  // Cooking Game State
  const [cookingStage, setCookingStage] = useState<'ingredients' | 'steps' | 'completed'>('ingredients');
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [gameFeedback, setGameFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  useEffect(() => {
    if (initialDishId) {
      const dish = CULINARY.find(d => d.id === initialDishId);
      if (dish) {
        setSelectedDish(dish);
        setCookingStage('ingredients');
        setSelectedIngredients([]);
        setGameFeedback(null);
      }
    }
  }, [initialDishId]);

  // Available ingredients rack (including distractors)
  const ingredientsRack = [
    { name: 'Unripe Plantains (Diced)', icon: '🍌', correct: true, desc: 'Adds thick starches and robust body to the broth.' },
    { name: 'Fresh Water Snails', icon: '🐌', correct: true, desc: 'Premium forest-coastal protein, cleaned with lime.' },
    { name: 'Unshelled Periwinkles', icon: '🐚', correct: true, desc: 'The signature clipped shells that add sea flavor.' },
    { name: 'Raw White Rice', icon: '🌾', correct: false, desc: 'Not part of this traditional plantain pottage!' },
    { name: 'Dry Smoked Fish', icon: '🐟', correct: true, desc: 'Infuses deep, smoky wood-fire essence.' },
    { name: 'Sweet Soy Sauce', icon: '🫙', correct: false, desc: 'An Asian seasoning, foreign to the ancient Ijaw clay pot.' },
    { name: 'Local Scent Leaf (Effirin)', icon: '🌿', correct: true, desc: 'Aromatic medicinal herb that locks in the sweet fragrance.' },
    { name: 'Irish Potatoes', icon: '🥔', correct: false, desc: 'Not a traditional tuber in the Niger Delta swamps!' },
    { name: 'Red Palm Oil', icon: '🏺', correct: true, desc: 'Pure palm extract that binds the seafood and starch.' },
    { name: 'Sugarcane Sticks', icon: '🎋', correct: false, desc: 'Too sweet! This will ruin the savory seafood balance.' }
  ];

  const totalRequiredCount = ingredientsRack.filter(i => i.correct).length;

  const handleIngredientClick = (ing: { name: string; icon: string; correct: boolean; desc: string }) => {
    if (cookingStage !== 'ingredients') return;

    if (selectedIngredients.includes(ing.name)) {
      // Deselect
      setSelectedIngredients(prev => prev.filter(name => name !== ing.name));
      setGameFeedback(null);
      return;
    }

    if (!ing.correct) {
      setGameFeedback({
        text: `The ancestors shake their heads! ${ing.name} is not part of Keke Fieye. Try again!`,
        isError: true
      });
      return;
    }

    const nextSelection = [...selectedIngredients, ing.name];
    setSelectedIngredients(nextSelection);
    setGameFeedback({
      text: `Excellent choice! Added ${ing.name}. ${ing.desc}`,
      isError: false
    });

    if (nextSelection.length === totalRequiredCount) {
      setGameFeedback({
        text: "Incredible! You have selected all the correct traditional ingredients. Now, light the flame and let's cook!",
        isError: false
      });
    }
  };

  const startCookingProcess = () => {
    setCookingStage('steps');
    setCurrentStepIndex(0);
    setGameFeedback(null);
  };

  const handleNextStep = () => {
    if (currentStepIndex < selectedDish.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setCookingStage('completed');
    }
  };

  const resetCookingGame = () => {
    setCookingStage('ingredients');
    setSelectedIngredients([]);
    setGameFeedback(null);
    setCurrentStepIndex(0);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left panel: culinary menu & detailed dish profiles */}
      <div className="lg:col-span-5 space-y-6">
        <h3 className="font-display text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <UtensilsCrossed className="w-5 h-5 text-amber-600" />
          Ijaw Culinary Arts
        </h3>
        <p className="font-sans text-xs text-stone-500 leading-relaxed">
          The gastronomy of the Okpoama Kingdom revolves around the pristine bounty of the delta water-creeks and forests. Fresh seafood is coupled with unripe tubers and fragrant medicinal leaves.
        </p>

        {/* Dish toggles */}
        <div className="grid grid-cols-2 gap-3">
          {CULINARY.map((dish) => (
            <button
              key={dish.id}
              onClick={() => {
                setSelectedDish(dish);
                resetCookingGame();
              }}
              className={`p-4 rounded-xl text-left border transition-all duration-200 cursor-pointer ${
                selectedDish.id === dish.id
                  ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-sm'
                  : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
              }`}
              id={`dish-btn-${dish.id}`}
            >
              <span className="font-display font-extrabold text-sm block">
                {dish.name}
              </span>
              {dish.translation && (
                <span className="font-sans text-2xs italic text-stone-500 block mt-0.5">
                  {dish.translation}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dish Details Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <span className="text-2xl">🍽️</span>
            <div>
              <h4 className="font-display font-bold text-base text-stone-900 leading-tight">
                About {selectedDish.name}
              </h4>
              <p className="font-sans text-2xs italic text-stone-500">
                Traditional Ijaw Recipe
              </p>
            </div>
          </div>

          <p className="font-sans text-xs text-stone-600 leading-relaxed">
            {selectedDish.description}
          </p>

          <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl">
            <h5 className="font-mono text-2xs uppercase tracking-wider font-bold text-amber-700 mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Did You Know?
            </h5>
            <p className="font-sans text-2xs text-stone-600 leading-relaxed">
              {selectedDish.funFact}
            </p>
          </div>

          <div>
            <h5 className="font-sans font-bold text-xs text-stone-900 mb-2">
              Authentic Ingredients
            </h5>
            <div className="grid grid-cols-2 gap-2">
              {selectedDish.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-stone-50 border border-stone-100 rounded-lg">
                  <span className="text-sm shrink-0">{ing.icon}</span>
                  <div>
                    <span className="font-sans text-3xs font-semibold text-stone-800 block leading-tight">
                      {ing.name}
                    </span>
                    <span className="font-sans text-4xs text-stone-500 block leading-tight">
                      {ing.description}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right panel: The interactive cooking simulator */}
      <div className="lg:col-span-7">
        <div className="bg-stone-950 text-white rounded-3xl border border-stone-800 p-6 md:p-8 flex flex-col h-full relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Interactive Cooking Portal Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
            <div className="flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-amber-400" />
              <h3 className="font-display text-sm font-bold tracking-widest text-stone-300 uppercase">
                The Royal Kitchen Simulator
              </h3>
            </div>
            <span className="font-sans text-2xs px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold rounded-full uppercase tracking-wider">
              {cookingStage === 'ingredients' ? 'Step 1: Prep' : cookingStage === 'steps' ? 'Step 2: Cook' : 'Chef Mastered'}
            </span>
          </div>

          <AnimatePresence mode="wait">
            {cookingStage === 'ingredients' ? (
              <motion.div
                key="ingredients-game"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-display text-lg font-bold text-white tracking-tight mb-2">
                    Prepare a Pot of <span className="text-amber-400">Keke Fieye</span>
                  </h4>
                  <p className="font-sans text-xs text-stone-400 leading-relaxed mb-6">
                    Enter the hearth where wood fires simmer. Below are both authentic local ingredients and foreign distractors. Click to select the <strong>6 required traditional ingredients</strong> to load your clay pot!
                  </p>

                  {/* Ingredients Grid Selection */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {ingredientsRack.map((ing, idx) => {
                      const isSelected = selectedIngredients.includes(ing.name);
                      return (
                        <button
                          key={idx}
                          onClick={() => handleIngredientClick(ing)}
                          className={`p-3 rounded-xl border text-center flex flex-col items-center justify-between gap-2.5 transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-500 shadow-md scale-102 text-white'
                              : 'bg-stone-900/60 hover:bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                          }`}
                          id={`ing-btn-${idx}`}
                        >
                          <span className="text-3xl filter drop-shadow">{ing.icon}</span>
                          <span className="font-sans text-4xs font-bold tracking-wide uppercase line-clamp-2 block leading-snug">
                            {ing.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Progress bar and feedback */}
                <div className="space-y-4 pt-6 border-t border-stone-900 mt-6">
                  {/* Progress indicator */}
                  <div className="flex items-center justify-between text-2xs font-mono font-bold text-stone-400">
                    <span>Hearth Pot Loading:</span>
                    <span className="text-amber-400">
                      {selectedIngredients.length} / {totalRequiredCount} Ingredients
                    </span>
                  </div>
                  <div className="h-2 bg-stone-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                      style={{ width: `${(selectedIngredients.length / totalRequiredCount) * 100}%` }}
                    />
                  </div>

                  {/* Game Feedback box */}
                  <div className="min-h-12 flex items-center justify-center">
                    {gameFeedback ? (
                      <div className={`p-3.5 rounded-xl border w-full flex items-center gap-3 text-xs font-sans ${
                        gameFeedback.isError
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      }`}>
                        {gameFeedback.isError ? (
                          <AlertTriangle className="w-4.5 h-4.5 text-rose-400 shrink-0" />
                        ) : (
                          <Sparkles className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                        )}
                        <p className="leading-relaxed">{gameFeedback.text}</p>
                      </div>
                    ) : (
                      <p className="font-sans text-3xs text-stone-500 italic text-center">
                        Select ingredients above to stock your culinary pot.
                      </p>
                    )}
                  </div>

                  {/* Action button */}
                  {selectedIngredients.length === totalRequiredCount && (
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={startCookingProcess}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer font-sans text-sm"
                      id="cook-sim-start-btn"
                    >
                      <Flame className="w-4.5 h-4.5 animate-pulse" />
                      Light the Wood Fire & Cook!
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ) : cookingStage === 'steps' ? (
              <motion.div
                key="steps-game"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-display text-lg font-bold text-white tracking-tight mb-2">
                    Cooking in Progress: <span className="text-amber-400">{selectedDish.name}</span>
                  </h4>
                  <p className="font-sans text-xs text-stone-400 leading-relaxed mb-6">
                    Step-by-step traditional hearth preparation method. Pay close attention to the order of heat and spice:
                  </p>

                  <div className="p-6 bg-stone-900/50 border border-stone-800 rounded-2xl flex flex-col md:flex-row items-center gap-6 relative">
                    {/* Step bubble icon */}
                    <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                      <span className="text-amber-400 font-display text-2xl font-bold">
                        {currentStepIndex + 1}
                      </span>
                    </div>

                    <div className="flex-1 space-y-1.5 text-center md:text-left">
                      <span className="font-mono text-3xs uppercase tracking-widest text-amber-400 font-bold block">
                        Stage {currentStepIndex + 1} of {selectedDish.steps.length}
                      </span>
                      <p className="font-sans text-sm text-stone-200 leading-relaxed font-medium">
                        {selectedDish.steps[currentStepIndex]}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-6 border-t border-stone-900 mt-6">
                  {/* Progress bar */}
                  <div className="h-1 bg-stone-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${((currentStepIndex + 1) / selectedDish.steps.length) * 100}%` }}
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={resetCookingGame}
                      className="px-4 py-3 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-400 hover:text-stone-200 font-semibold rounded-xl transition-all duration-200 flex items-center gap-1.5 cursor-pointer text-xs font-sans"
                      id="cook-sim-reset-btn"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold rounded-xl shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs font-sans"
                      id="cook-sim-next-btn"
                    >
                      {currentStepIndex < selectedDish.steps.length - 1 ? (
                        <>
                          <Flame className="w-3.5 h-3.5 animate-pulse" />
                          Proceed to Next Stage
                        </>
                      ) : (
                        <>
                          <ThumbsUp className="w-3.5 h-3.5" />
                          Finish Preparing Dish!
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="completed-game"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 flex-1 flex flex-col justify-center items-center text-center py-8"
              >
                <div className="w-20 h-20 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center animate-bounce mb-4">
                  <ChefHat className="w-10 h-10 text-amber-400" />
                </div>

                <div className="space-y-2.5 max-w-md">
                  <h4 className="font-display text-2xl font-extrabold text-white tracking-tight">
                    A Culinary Triumph!
                  </h4>
                  <p className="font-sans text-xs text-stone-300 leading-relaxed">
                    The fire has died down, the scent leaves have infused, and the periwinkles are perfectly spiced. You have successfully prepared a majestic pot of authentic <strong>{selectedDish.name}</strong> according to the sacred traditions of the Okpoama Kingdom!
                  </p>
                  <p className="font-sans text-2xs italic text-amber-400 bg-amber-500/5 px-4 py-2 border border-amber-500/20 rounded-xl">
                    "Iya o! You eat with your hands, suck the periwinkle shells with a loud pop, and honor the coastal waters!"
                  </p>
                </div>

                <div className="flex gap-4 pt-4 w-full max-w-sm">
                  <button
                    onClick={resetCookingGame}
                    className="flex-1 py-3 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-200 font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer text-xs font-sans"
                    id="cook-sim-again-btn"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Cook Again
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
