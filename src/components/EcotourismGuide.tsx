/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ATTRACTIONS } from '../data/okpoamaData';
import { AttractionItem } from '../types';
import { Compass, Calendar, User, Plane, CheckCircle2, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { TidalChart } from './TidalChart';

export const EcotourismGuide: React.FC<{ initialAttractionId?: string }> = ({ initialAttractionId }) => {
  const [selectedAttraction, setSelectedAttraction] = useState<AttractionItem>(ATTRACTIONS[0]);
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    if (initialAttractionId) {
      const attraction = ATTRACTIONS.find(a => a.id === initialAttractionId);
      if (attraction) {
        setSelectedAttraction(attraction);
      }
    }
  }, [initialAttractionId]);

  // Booking Form State
  const [visitorName, setVisitorName] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [preferredTour, setPreferredTour] = useState('Okpoama Beach Camping');
  const [partySize, setPartySize] = useState('1');
  const [showItinerary, setShowItinerary] = useState(false);

  const filteredAttractions = filterType === 'all'
    ? ATTRACTIONS
    : ATTRACTIONS.filter(attr => attr.type === filterType);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim()) return;
    setShowItinerary(true);
  };

  const getTourAdvice = () => {
    switch (preferredTour) {
      case 'Okpoama Beach Camping':
        return 'Pack high-SPF sunscreen, a windproof tent, and waterproof beachwear. The ocean surf is high-energy!';
      case 'Mangrove Canoe Safari':
        return 'We recommend bringing eco-safe bug repellent, lightweight clothing, and a high-zoom camera for exotic nesting herons.';
      case 'Palace Heritage Tour':
        return 'Wear modest, respectful clothing. Ensure your camera device is only used after receiving direct consent from the palace guides.';
      case 'Salt Wells Workshop':
        return 'Wear closed-toe boots or shoes suitable for forest trails. You will witness traditional clay boiling demonstrations!';
      default:
        return 'Dress comfortably, stay hydrated, and support local native guides.';
    }
  };

  return (
    <div className="space-y-12">
      {/* Visual filter bar */}
      <div className="flex flex-wrap justify-center gap-2 border-b border-stone-200 pb-5">
        {['all', 'beach', 'heritage', 'nature', 'landmark'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4.5 py-2 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all duration-200 cursor-pointer border ${
              filterType === type
                ? 'bg-amber-500 border-amber-500 text-stone-950 shadow-sm'
                : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-900'
            }`}
            id={`filter-btn-${type}`}
          >
            {type === 'all' ? 'All Attractions' : type}
          </button>
        ))}
      </div>

      {/* Main Attraction Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAttractions.map((attr) => (
          <button
            key={attr.id}
            onClick={() => setSelectedAttraction(attr)}
            className={`text-left rounded-2xl border overflow-hidden flex flex-col h-full bg-white transition-all duration-300 group cursor-pointer ${
              selectedAttraction.id === attr.id
                ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md scale-102'
                : 'border-stone-200 hover:border-stone-300 hover:shadow-sm'
            }`}
            id={`attr-card-${attr.id}`}
          >
            {/* Visual thumbnail */}
            <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
              <img
                src={attr.imageFallback}
                alt={attr.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-3 left-3 font-sans text-4xs font-bold uppercase tracking-wider bg-stone-950/70 backdrop-blur-md text-amber-400 border border-stone-800 px-2 py-0.5 rounded">
                {attr.type}
              </span>
            </div>

            <div className="p-4.5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-display font-extrabold text-sm text-stone-900 tracking-tight leading-snug group-hover:text-amber-700 transition-colors duration-200">
                  {attr.name}
                </h4>
                <p className="font-sans text-2xs text-stone-500 leading-relaxed mt-1 line-clamp-3">
                  {attr.description}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-3xs font-mono font-bold uppercase tracking-wider text-amber-800">
                <span>Explore Guide</span>
                <Compass className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Attraction Deep-Dive detail & Etiquette panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedAttraction.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-12"
        >
          {/* Detail card image side */}
          <div className="lg:col-span-5 h-64 lg:h-auto min-h-64 relative bg-stone-100">
            <img
              src={selectedAttraction.imageFallback}
              alt={selectedAttraction.name}
              className="w-full h-full object-cover absolute inset-0"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-stone-950/90 via-stone-950/40 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white pr-6 lg:max-w-xs">
              <span className="font-sans text-4xs px-2.5 py-0.5 bg-amber-500 text-stone-950 font-bold rounded-full uppercase tracking-wider">
                {selectedAttraction.type} Guide
              </span>
              <h3 className="font-display text-xl md:text-2xl font-extrabold tracking-tight mt-1.5 text-white">
                {selectedAttraction.name}
              </h3>
            </div>
          </div>

          {/* Detail card text side */}
          <div className="lg:col-span-7 p-6 md:p-8 space-y-6">
            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">
                Destination Overview
              </h4>
              <p className="font-sans text-sm text-stone-700 leading-relaxed">
                {selectedAttraction.description}
              </p>
            </div>

            <div>
              <h4 className="font-display text-xs font-bold uppercase tracking-widest text-amber-600 mb-2">
                Why It's Special
              </h4>
              <p className="font-sans text-xs text-stone-600 leading-relaxed font-medium">
                {selectedAttraction.whyVisit}
              </p>
            </div>

            {/* Cultural Etiquette Board */}
            <div className="p-5 bg-stone-50 border border-stone-100 rounded-2xl">
              <h4 className="font-display text-xs font-bold uppercase tracking-widest text-stone-950 mb-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4.5 h-4.5 text-amber-600" />
                Preserve Tradition: Tourist Etiquette
              </h4>
              
              <ul className="space-y-2.5">
                {selectedAttraction.etiquette.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-600 font-sans leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Interactive D3 Tidal Chart */}
      <TidalChart />

      {/* Interactive Itinerary Form / Planner */}
      <div className="bg-stone-950 text-white rounded-3xl border border-stone-800 p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Left Side: Form */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="font-mono text-3xs uppercase tracking-widest text-amber-400 font-bold block mb-1">
              Virtual Trip planner
            </span>
            <h3 className="font-display text-2xl font-extrabold text-white tracking-tight">
              Plan Your Ecotourism <span className="text-amber-400">Adventure</span>
            </h3>
            <p className="font-sans text-xs text-stone-400 leading-relaxed mt-1">
              Draft your custom itinerary to visit Brass Island. Fill in your travel details to draft a culturally immersive itinerary.
            </p>
          </div>

          <form onSubmit={handleInquirySubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="font-sans text-2xs font-bold text-stone-400 uppercase tracking-wider block">
                Traveler Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-stone-500" />
                <input
                  type="text"
                  required
                  placeholder="e.g., Emmanuel Kpe"
                  value={visitorName}
                  onChange={(e) => setVisitorName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-3 pl-11 pr-4 text-sm font-sans text-stone-100 placeholder-stone-600 outline-none transition-all duration-200"
                  id="planner-input-name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-sans text-2xs font-bold text-stone-400 uppercase tracking-wider block">
                  Date of Arrival
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-stone-500 pointer-events-none" />
                  <input
                    type="date"
                    required
                    value={travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-3 pl-11 pr-4 text-xs font-sans text-stone-100 outline-none transition-all duration-200"
                    id="planner-input-date"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-sans text-2xs font-bold text-stone-400 uppercase tracking-wider block">
                  Party Size
                </label>
                <select
                  value={partySize}
                  onChange={(e) => setPartySize(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-3 px-4 text-sm font-sans text-stone-100 outline-none transition-all duration-200"
                  id="planner-input-size"
                >
                  {['1', '2', '3-5', '6-10', '10+'].map(val => (
                    <option key={val} value={val}>{val} {val === '1' ? 'Explorer' : 'Explorers'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-sans text-2xs font-bold text-stone-400 uppercase tracking-wider block">
                Primary Activity Goal
              </label>
              <select
                value={preferredTour}
                onChange={(e) => setPreferredTour(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 rounded-xl py-3 px-4 text-sm font-sans text-stone-100 outline-none transition-all duration-200"
                id="planner-input-tour"
              >
                <option value="Okpoama Beach Camping">Okpoama Beach Surf Camping & Sunset</option>
                <option value="Mangrove Canoe Safari">Canoe Safari through River Mangroves</option>
                <option value="Palace Heritage Tour">Historical Palace Archival Tour</option>
                <option value="Salt Wells Workshop">Ancient Clay Pot Salt Boiling Workshop</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer font-sans text-sm mt-2"
              id="planner-submit-btn"
            >
              <Plane className="w-4.5 h-4.5" />
              Generate Cultural Itinerary Draft
            </button>
          </form>
        </div>

        {/* Right Side: Draft Results */}
        <div className="lg:col-span-7 flex flex-col justify-center h-full">
          <AnimatePresence mode="wait">
            {showItinerary ? (
              <motion.div
                key="itinerary-draft"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="p-6 bg-stone-900 border border-stone-850 rounded-2xl space-y-4 shadow-inner"
              >
                <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                  <span className="font-mono text-3xs font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Draft Itinerary: OKP-PRV-2026
                  </span>
                  <span className="font-mono text-3xs font-bold text-stone-500 uppercase">
                    Status: Validated
                  </span>
                </div>

                <div className="space-y-3.5">
                  <p className="font-sans text-xs text-stone-300 leading-relaxed">
                    Welcome to Brass, <strong className="text-white">{visitorName}</strong>! Your customized coastal itinerary for <strong className="text-white">{travelDate}</strong> with a group of <strong className="text-white">{partySize}</strong> has been drafted:
                  </p>

                  <div className="space-y-2.5">
                    <div className="flex items-start gap-3 p-3 bg-stone-950/50 rounded-xl border border-stone-800/60">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        1
                      </div>
                      <div className="text-xs font-sans">
                        <strong className="text-white block">Day 1: Arrival & Palace Welcome</strong>
                        <span className="text-stone-400">Arrive via boat from Yenagoa or Port Harcourt. Receive traditional welcome briefing and local orientation regarding Brass Island geography.</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-stone-950/50 rounded-xl border border-stone-800/60">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        2
                      </div>
                      <div className="text-xs font-sans">
                        <strong className="text-white block">Day 2: Primary Activity — {preferredTour}</strong>
                        <span className="text-stone-400">Embark with an certified native tour guide. {getTourAdvice()}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-stone-950/50 rounded-xl border border-stone-800/60">
                      <div className="w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                        3
                      </div>
                      <div className="text-xs font-sans">
                        <strong className="text-white block">Day 3: Culinary Feast & Sea Bathing</strong>
                        <span className="text-stone-400">Dine on fresh Keke Fieye at a native coastal lodge. Enjoy a sunset walk along Okpoama Beach to experience coastal tranquility.</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-xl text-stone-400 text-2xs leading-relaxed flex gap-2.5 items-start">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-400 block mb-0.5 font-sans font-semibold uppercase tracking-wider">Note on Eco-Safety & Customs:</strong>
                      As a guest, respect local ecological laws. Do not harvest mangrove shoots, disturb nesting zones, or litter Okpoama Beach. Respect the shrines. Happy exploring!
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-right">
                  <button
                    onClick={() => setShowItinerary(false)}
                    className="font-sans text-2xs font-bold text-amber-400 hover:text-amber-300 uppercase tracking-widest flex items-center gap-1.5 ml-auto cursor-pointer"
                    id="planner-clear-btn"
                  >
                    Modify Search Parameters
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="border border-stone-800 border-dashed rounded-2xl p-8 text-center space-y-3.5 bg-stone-900/10 h-full flex flex-col items-center justify-center">
                <HelpCircle className="w-10 h-10 text-stone-700 animate-pulse" />
                <div className="max-w-xs space-y-1">
                  <h4 className="font-display text-sm font-bold text-stone-300">
                    Itinerary Awaiting Parameters
                  </h4>
                  <p className="font-sans text-2xs text-stone-500 leading-relaxed">
                    Fill out the planning parameters on the left to generate an authentic, culturally safe travel draft for Brass Island.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
