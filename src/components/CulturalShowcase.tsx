/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FESTIVALS, HISTORY, DYNASTY } from '../data/okpoamaData';
import { Shield, FileText, Crown, Calendar, Sparkles, Compass, Users, Ship, ArrowRight, BookOpen, Droplets } from 'lucide-react';
import { FestivalItem, HistoricalEvent } from '../types';

export const CulturalShowcase: React.FC<{ initialFestivalId?: string; initialHistoryId?: string }> = ({ initialFestivalId, initialHistoryId }) => {
  const [activeSubTab, setActiveSubTab] = useState<'festivals' | 'masquerades' | 'history'>('festivals');
  const [selectedFestival, setSelectedFestival] = useState<FestivalItem>(FESTIVALS[0]);
  const [selectedHistory, setSelectedHistory] = useState<HistoricalEvent>(HISTORY[0]);

  useEffect(() => {
    if (initialFestivalId) {
      const festival = FESTIVALS.find(f => f.id === initialFestivalId);
      if (festival) {
        setSelectedFestival(festival);
        setActiveSubTab('festivals');
      }
    } else if (initialHistoryId) {
      const historyItem = HISTORY.find(h => h.id === initialHistoryId);
      if (historyItem) {
        setSelectedHistory(historyItem);
        setActiveSubTab('history');
      }
    }
  }, [initialFestivalId, initialHistoryId]);

  // Map icon strings to Lucide components
  const getHistoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <Shield className="w-5 h-5 text-amber-500" />;
      case 'FileText': return <FileText className="w-5 h-5 text-amber-500" />;
      case 'Crown': return <Crown className="w-5 h-5 text-amber-500" />;
      default: return <Compass className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-12">
      {/* Sub tab navigation */}
      <div className="flex justify-center border-b border-stone-200 pb-4">
        <div className="inline-flex bg-stone-100 p-1.5 rounded-xl border border-stone-200/50">
          <button
            onClick={() => setActiveSubTab('festivals')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeSubTab === 'festivals'
                ? 'bg-white text-stone-900 shadow-md'
                : 'text-stone-500 hover:text-stone-900'
            }`}
            id="subtab-festivals"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            Festivals & traditions
          </button>
          <button
            onClick={() => setActiveSubTab('masquerades')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeSubTab === 'masquerades'
                ? 'bg-white text-stone-900 shadow-md'
                : 'text-stone-500 hover:text-stone-900'
            }`}
            id="subtab-masquerades"
          >
            <Droplets className="w-4 h-4 text-amber-500" />
            Sacred Masquerades
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeSubTab === 'history'
                ? 'bg-white text-stone-900 shadow-md'
                : 'text-stone-500 hover:text-stone-900'
            }`}
            id="subtab-history"
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            Royal Dynasty & History
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'festivals' && (
          <motion.div
            key="festivals-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Festival selector list */}
            <div className="lg:col-span-4 space-y-4">
              <h3 className="font-display text-lg font-bold text-stone-900 tracking-tight mb-2 flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-600" />
                Traditional Celebrations
              </h3>
              <p className="font-sans text-xs text-stone-500 leading-relaxed mb-4">
                The Ijaw culture is celebrated through dynamic displays of aquatic mastery, spiritual cycles, and rites of passage. Select a celebration below:
              </p>
              
              <div className="space-y-3">
                {FESTIVALS.map((fest) => (
                  <button
                    key={fest.id}
                    onClick={() => setSelectedFestival(fest)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                      selectedFestival.id === fest.id
                        ? 'bg-amber-50 border-amber-300 shadow-sm text-amber-950'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                    }`}
                    id={`fest-btn-${fest.id}`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-display font-bold text-sm tracking-tight">
                        {fest.name}
                      </h4>
                      {fest.nativeName && (
                        <span className="font-sans text-2xs px-1.5 py-0.5 bg-stone-100 border border-stone-200 rounded text-stone-500 font-medium">
                          {fest.nativeName}
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-xs text-stone-500 line-clamp-2">
                      {fest.description}
                    </p>
                    <div className="mt-2.5 flex items-center gap-1.5 text-2xs font-mono font-bold uppercase tracking-wider text-amber-700">
                      <Calendar className="w-3.5 h-3.5" />
                      {fest.season}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Festival deep-dive details card */}
            <div className="lg:col-span-8">
              <motion.div
                key={selectedFestival.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm flex flex-col h-full"
              >
                {/* Visual Banner */}
                <div className="relative h-64 w-full overflow-hidden bg-stone-100">
                  <img
                    src={selectedFestival.imageFallback}
                    alt={selectedFestival.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white pr-6">
                    <span className="font-sans text-2xs px-2.5 py-1 bg-amber-500 text-stone-950 font-bold rounded-full uppercase tracking-wider">
                      {selectedFestival.season}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight mt-2 text-white">
                      {selectedFestival.name} {selectedFestival.nativeName && `(${selectedFestival.nativeName})`}
                    </h3>
                  </div>
                </div>

                {/* Cultural Copy Content */}
                <div className="p-6 md:p-8 space-y-6 flex-1">
                  <div>
                    <h4 className="font-display text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">
                      Cultural Overview
                    </h4>
                    <p className="font-sans text-sm text-stone-700 leading-relaxed">
                      {selectedFestival.description}
                    </p>
                  </div>

                  <div className="p-4 bg-stone-50 border border-stone-100 rounded-xl">
                    <h5 className="font-sans font-semibold text-xs text-stone-900 uppercase tracking-wider mb-1.5">
                      Socio-Spiritual Significance
                    </h5>
                    <p className="font-sans text-xs text-stone-600 leading-relaxed">
                      {selectedFestival.significance}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-display text-xs font-bold uppercase tracking-widest text-amber-600 mb-3">
                      Core Ceremonies & Activities
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      {selectedFestival.activities.map((activity, index) => {
                        const [title, desc] = activity.split(':');
                        return (
                          <div
                            key={index}
                            className="p-4 bg-amber-50/20 hover:bg-amber-50/40 border border-amber-500/10 hover:border-amber-500/20 rounded-xl transition-all duration-200"
                          >
                            <span className="font-sans font-bold text-sm text-amber-900 block mb-1">
                              {title}
                            </span>
                            <span className="font-sans text-xs text-stone-600 leading-relaxed block">
                              {desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'masquerades' && (
          <motion.div
            key="masquerades-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Column: Visual Showcase */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm p-4 animate-fade-in">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-100 border border-stone-100 group">
                  <img
                    src="/src/assets/images/okpoama_masquerade_1783093610214.jpg"
                    alt="Traditional Okpoama Oru Masquerade"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 font-mono text-[10px] font-bold text-white uppercase tracking-widest bg-amber-600 px-2 py-0.5 rounded">
                    Oru Sacred Dancer
                  </span>
                </div>
                
                <div className="mt-4 p-3.5 bg-stone-50 rounded-xl border border-stone-200/50 space-y-2.5">
                  <h4 className="font-display font-bold text-xs text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Masquerade Regalia Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-2xs font-sans text-stone-600">
                    <div>
                      <span className="font-semibold text-stone-900 block mb-0.5">Spiritual Vestment</span>
                      Oru Raffia Fiber & Camwood
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900 block mb-0.5">Carved Headpiece</span>
                      Mahogany or Iroko Wood
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900 block mb-0.5">Primary Clay Dye</span>
                      Kaolin (Nzu) & Indigo (Uli)
                    </div>
                    <div>
                      <span className="font-semibold text-stone-900 block mb-0.5">Main Representation</span>
                      Water Spirits (Oru Deities)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Cultural Explanation (Why they have it) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-stone-200 p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
                <div>
                  <span className="font-mono text-2xs font-bold text-amber-700 uppercase tracking-widest block mb-2">
                    Sacred Coastal Heritage
                  </span>
                  <h3 className="font-display text-2xl font-extrabold text-stone-900 tracking-tight">
                    Why the Okpoama Kingdom Celebrates Masquerades
                  </h3>
                  <p className="font-sans text-sm text-stone-600 leading-relaxed mt-3">
                    In Okpoama Kingdom and the wider coastal Ijaw nation, masquerades are not mere theatrical entertainment. They represent a deep, ancestral, and metaphysical bond between the community and the spiritual forces of the water. Known as <strong>Oru</strong>, these masquerades serve several sacred pillars:
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Pillar 1 */}
                  <div className="flex gap-4 p-4 rounded-xl bg-amber-50/30 border border-amber-500/10 hover:border-amber-500/20 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <Droplets className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-stone-900">
                        1. Honoring the Water Spirits (Oru)
                      </h4>
                      <p className="font-sans text-xs text-stone-600 leading-relaxed mt-1">
                        As an island community situated between the Atlantic ocean and winding salt-water estuaries, Okpoama’s life, trade, and survival have always depended on the sea. The masquerades personify these marine spirits, seeking their blessing to ensure smooth ocean navigation, protection from storms, and bountiful fishing catches.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 2 */}
                  <div className="flex gap-4 p-4 rounded-xl bg-amber-50/30 border border-amber-500/10 hover:border-amber-500/20 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-stone-900">
                        2. Spiritual Cleansing & Purification
                      </h4>
                      <p className="font-sans text-xs text-stone-600 leading-relaxed mt-1">
                        Masquerades are viewed as cosmic cleansers. During major cycles like the legendary <em>Oru Egbelegbe Festival</em>, the masquerader sweeps through the community to absorb and wash away misfortune, illness, and discord, returning the kingdom to a state of spiritual equilibrium, fertile soil, and peace.
                      </p>
                    </div>
                  </div>

                  {/* Pillar 3 */}
                  <div className="flex gap-4 p-4 rounded-xl bg-amber-50/30 border border-amber-500/10 hover:border-amber-500/20 transition-all">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-amber-700" />
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-sm text-stone-900">
                        3. Preserving Generational Identity & Pride
                      </h4>
                      <p className="font-sans text-xs text-stone-600 leading-relaxed mt-1">
                        The preparation of the masquerade—from carving the specialized masks depicting marine creatures to weaving the heavy raffia and learning the intricate, acrobatic drumming paces—unites the youth and elders. It passes down ancestral history, ethical codes, and cultural pride in a living, breathing sensory masterpiece.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-900 text-stone-100 rounded-xl border border-stone-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="font-mono text-[10px] font-bold text-amber-400 uppercase tracking-widest block">
                      Royal Proclamation
                    </span>
                    <p className="font-sans text-xs text-stone-300 italic">
                      "To look upon the Oru is to look into the soul of the tides. It is our covenant with the deep."
                    </p>
                  </div>
                  <Crown className="w-8 h-8 text-amber-500 shrink-0 opacity-80" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'history' && (
          <motion.div
            key="history-panel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Timeline Left */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="font-display text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <Ship className="w-5 h-5 text-amber-600" />
                Historic Landmarks
              </h3>
              <p className="font-sans text-xs text-stone-500 leading-relaxed mb-4">
                The strategic position of Okpoama on Brass Island made it a vital nexus during the pre-colonial palm oil trade and anti-colonial sovereignty movements. Select a historical epoch:
              </p>

              <div className="relative border-l border-stone-200 pl-6 ml-3 space-y-6">
                {HISTORY.map((evt) => (
                  <button
                    key={evt.id}
                    onClick={() => setSelectedHistory(evt)}
                    className="relative w-full text-left focus:outline-none cursor-pointer block group"
                    id={`hist-btn-${evt.id}`}
                  >
                    {/* Ring Indicator */}
                    <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 bg-white transition-all duration-200 ${
                      selectedHistory.id === evt.id
                        ? 'border-amber-500 scale-125 shadow-sm'
                        : 'border-stone-300 group-hover:border-stone-400'
                    }`} />

                    <div className={`p-4 rounded-xl border transition-all duration-200 ${
                      selectedHistory.id === evt.id
                        ? 'bg-amber-50 border-amber-300 text-amber-950'
                        : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700'
                    }`}>
                      <span className="font-mono text-xs font-bold text-amber-700 block mb-1">
                        Epoch {evt.year}
                      </span>
                      <h4 className="font-display font-extrabold text-sm tracking-tight text-stone-900">
                        {evt.title}
                      </h4>
                      <p className="font-sans text-xs text-stone-500 line-clamp-2 mt-1">
                        {evt.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Timeline Content / Ruler profiles Right */}
            <div className="lg:col-span-7 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedHistory.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-stone-900 text-white p-6 md:p-8 rounded-2xl border border-stone-800 shadow-sm relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex items-center gap-3.5 pb-4 border-b border-stone-800 mb-6">
                    <div className="p-3 bg-stone-800 rounded-xl">
                      {getHistoryIcon(selectedHistory.visualIcon)}
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-amber-400 tracking-wider">
                        Okpoama Kingdom Chronicles • Year {selectedHistory.year}
                      </span>
                      <h3 className="font-display text-xl md:text-2xl font-extrabold tracking-tight">
                        {selectedHistory.title}
                      </h3>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-display text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
                        Historical Narrative
                      </h4>
                      <p className="font-sans text-sm text-stone-300 leading-relaxed">
                        {selectedHistory.description}
                      </p>
                    </div>

                    <div className="p-4 bg-stone-950/60 rounded-xl border border-stone-800/80">
                      <h4 className="font-display text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
                        Historical Impact & Legacy
                      </h4>
                      <p className="font-sans text-xs text-stone-400 leading-relaxed">
                        {selectedHistory.impact}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Profiles of Key Dynasties */}
              <div className="bg-white border border-stone-200 p-6 rounded-2xl">
                <h3 className="font-display text-base font-bold text-stone-900 tracking-tight mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  Dynasty Leadership & Lineage
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {DYNASTY.map((ruler) => (
                    <div
                      key={ruler.id}
                      className="p-4 bg-stone-50 hover:bg-stone-100/70 border border-stone-200/60 rounded-xl transition-all duration-200"
                    >
                      <span className="font-mono text-2xs text-amber-700 bg-amber-100/50 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider mb-2 inline-block">
                        {ruler.reign}
                      </span>
                      <h4 className="font-display font-bold text-sm tracking-tight text-stone-900 mb-0.5">
                        {ruler.title}
                      </h4>
                      <p className="font-sans text-2xs text-stone-500 italic mb-2">
                        {ruler.name}
                      </p>
                      <p className="font-sans text-2xs text-stone-600 leading-relaxed">
                        {ruler.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
