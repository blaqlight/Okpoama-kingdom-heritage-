/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Anchor, Compass, Calendar, MapPin, Award } from 'lucide-react';

interface HeroProps {
  onExploreClick: (tabId: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  return (
    <div className="relative overflow-hidden bg-stone-900 text-white rounded-3xl mb-12 shadow-xl border border-stone-800">
      {/* Absolute background patterns */}
      <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-30 pointer-events-none transition-all duration-1000"
           style={{ backgroundImage: `url('/src/assets/images/okpoama_beach_1783092788317.jpg')` }} />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/80 to-transparent pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-6 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left column: Text content */}
        <motion.div 
          className="flex-1 space-y-6 text-left"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold tracking-wider uppercase font-sans">
            <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            Okpoama Kingdom, Bayelsa State
          </div>
          
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white">
            The Pearl of the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-gold-400 to-amber-600">Atlantic</span>
          </h1>

          <p className="font-sans text-stone-300 text-base md:text-lg leading-relaxed max-w-xl">
            Sailing the borders of Brass Island on Nigeria's southern tip, Okpoama is an ancient coastal realm of the Ijaw nation. Rich in seafaring tradition, heroic history, and spectacular mangrove sanctuaries, this is a kingdom where culture is whispered by the Atlantic breeze.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <button 
              onClick={() => onExploreClick('culture')}
              className="px-6 py-3 bg-gradient-to-r from-amber-600 via-amber-500 to-gold-500 hover:from-amber-700 hover:via-amber-600 hover:to-gold-600 text-stone-950 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform active:scale-95 cursor-pointer font-sans"
              id="hero-btn-culture"
            >
              Discover Culture
            </button>
            <button 
              onClick={() => onExploreClick('ecotourism')}
              className="px-6 py-3 bg-stone-800 hover:bg-stone-700 text-white font-medium rounded-xl border border-stone-700 hover:border-stone-600 transition-all duration-200 cursor-pointer font-sans"
              id="hero-btn-visit"
            >
              Explore Attractions
            </button>
          </div>
        </motion.div>

        {/* Right column: Quick facts card */}
        <motion.div 
          className="w-full md:w-80 bg-stone-950/70 backdrop-blur-md border border-stone-800 rounded-2xl p-6 relative overflow-hidden"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <h2 className="font-display text-xs tracking-widest font-bold text-amber-400 uppercase mb-4 pb-2 border-b border-stone-800">
            Kingdom Overview
          </h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-stone-900 rounded-lg text-amber-500 shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-stone-500 text-2xs uppercase tracking-wider font-mono font-bold">Geographic Realm</p>
                <p className="text-stone-200 text-sm font-sans font-medium">Brass Island, Brass LGA, Bayelsa State, Nigeria</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-stone-900 rounded-lg text-amber-500 shrink-0">
                <Anchor className="w-4 h-4" />
              </div>
              <div>
                <p className="text-stone-500 text-2xs uppercase tracking-wider font-mono font-bold">Sovereign Throne</p>
                <p className="text-stone-200 text-sm font-sans font-medium">HRM King Ebitimi Banigo, Okpo XXI (Amanyanabo of Okpoama)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-stone-900 rounded-lg text-amber-500 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-stone-500 text-2xs uppercase tracking-wider font-mono font-bold">Signature Event</p>
                <p className="text-stone-200 text-sm font-sans font-medium text-amber-400">Oru Egbelegbe Cultural Festival</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 bg-stone-900 rounded-lg text-amber-500 shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <p className="text-stone-500 text-2xs uppercase tracking-wider font-mono font-bold">Native Dialect</p>
                <p className="text-stone-200 text-sm font-sans font-medium">Nembe-Ijaw language branch</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
