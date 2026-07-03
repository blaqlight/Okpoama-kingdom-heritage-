/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Hero } from './components/Hero';
import { CulturalShowcase } from './components/CulturalShowcase';
import { CulinaryShowcase } from './components/CulinaryShowcase';
import { EcotourismGuide } from './components/EcotourismGuide';
import { PostcardGenerator } from './components/PostcardGenerator';
import { TriviaQuiz } from './components/TriviaQuiz';
import VirtualMuseum from './components/VirtualMuseum';
import { FESTIVALS, HISTORY, CULINARY, ATTRACTIONS, MUSEUM_ARTIFACTS } from './data/okpoamaData';
import { Compass, Sparkles, UtensilsCrossed, MapPin, Mail, Award, Anchor, Menu, X, Facebook, Twitter, Link, Map, Globe, Info, HelpCircle, Search, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ActiveTab = 'overview' | 'culture' | 'culinary' | 'ecotourism' | 'postcard' | 'quiz' | 'museum';

interface MapLandmark {
  id: string;
  name: string;
  top: string;
  left: string;
  category: string;
  description: string;
  significance: string;
  activity: string;
}

const MAP_LANDMARKS: MapLandmark[] = [
  {
    id: 'okpoama_town',
    name: 'Okpoama Royal Town',
    top: '55%',
    left: '42%',
    category: 'Sovereign Capital',
    description: 'The ancient capital of the Okpoama Kingdom. Home to the majestic Amanyanabo Palace and the seat of sovereign royal authority across the Brass Island estuaries.',
    significance: 'Cultural seat of governance, traditional masquerade festivals, and historical royal courts.',
    activity: 'Visit the Royal Court and the ancient town square.'
  },
  {
    id: 'salt_wells',
    name: 'The Sacred Salt Wells',
    top: '42%',
    left: '68%',
    category: 'Historical Industry',
    description: 'Geothermal saltwater springs nestled deep in the coastal forest. For centuries, Okpoama women harvested salt using specialized clay vessels (Ono-Aba) to create salt cakes used as primary Niger Delta currency.',
    significance: 'Historic mercantile powerhouse of the kingdom prior to colonial industrial import.',
    activity: 'Witness live salt-boiling workshops and traditional clay pot crafts.'
  },
  {
    id: 'brass_river',
    name: 'Brass River Estuary',
    top: '30%',
    left: '18%',
    category: 'Naval Trade Route',
    description: 'The historic western gateway connecting the Niger Delta creek network directly to the Atlantic. A hotspot of 19th-century trade and the frontline during colonial blockades.',
    significance: 'Key site of the famous 1895 Akassa Resistance defending indigenous free trade rights.',
    activity: 'Boat tours of the colonial ruins and historic naval waterways.'
  },
  {
    id: 'st_nicholas',
    name: 'St. Nicholas River',
    top: '28%',
    left: '82%',
    category: 'Eastern Boundary',
    description: 'A wide, scenic marine estuary framing the eastern boundary of Brass Island, leading directly to high-yield offshore fishing reserves.',
    significance: 'Sacred marine deity habitats and historic trade junction with neighboring coastal kingdoms.',
    activity: 'Guided canoe safaris through dense, untouched mangrove canopies.'
  },
  {
    id: 'okpoama_beaches',
    name: 'Golden Sand Coast',
    top: '78%',
    left: '52%',
    category: 'Ecotourism',
    description: 'Majestic golden sand beaches stretching continuously along the Atlantic Ocean. Famously clean and scenic, serving as vital nesting grounds for rare sea turtles.',
    significance: 'Home to the annual Oru Egbelegbe beach purification and marine conservation sites.',
    activity: 'Sunset beachcombing and leatherback sea turtle conservation walks.'
  }
];

interface SearchResult {
  id: string;
  name: string;
  description: string;
  type: 'artifact' | 'recipe' | 'site' | 'festival' | 'history';
  tab: ActiveTab;
  category: string;
  meta: string;
}

const searchIndex: SearchResult[] = [
  ...MUSEUM_ARTIFACTS.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    type: 'artifact' as const,
    tab: 'museum' as const,
    category: 'Museum Artifact',
    meta: `${item.era} ${item.material} ${item.history}`.toLowerCase()
  })),
  ...CULINARY.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    type: 'recipe' as const,
    tab: 'culinary' as const,
    category: 'Traditional Recipe',
    meta: `${item.translation} ${item.ingredients.map(i => i.name).join(' ')}`.toLowerCase()
  })),
  ...ATTRACTIONS.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    type: 'site' as const,
    tab: 'ecotourism' as const,
    category: `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} Destination`,
    meta: item.whyVisit.toLowerCase()
  })),
  ...FESTIVALS.map(item => ({
    id: item.id,
    name: item.name,
    description: item.description,
    type: 'festival' as const,
    tab: 'culture' as const,
    category: 'Cultural Festival',
    meta: `${item.nativeName} ${item.activities.join(' ')}`.toLowerCase()
  })),
  ...HISTORY.map(item => ({
    id: item.id,
    name: item.title,
    description: item.description,
    type: 'history' as const,
    tab: 'culture' as const,
    category: 'Historical Event',
    meta: `${item.year} ${item.impact}`.toLowerCase()
  }))
];

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedLandmarkId, setSelectedLandmarkId] = useState<string>('okpoama_town');
  const [showTradeRoute, setShowTradeRoute] = useState<boolean>(false);

  // Search States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState<'all' | 'artifact' | 'recipe' | 'site' | 'festival' | 'history'>('all');
  const [searchSelectedIndex, setSearchSelectedIndex] = useState(0);

  const [searchArtifactId, setSearchArtifactId] = useState<string | undefined>(undefined);
  const [searchDishId, setSearchDishId] = useState<string | undefined>(undefined);
  const [searchAttractionId, setSearchAttractionId] = useState<string | undefined>(undefined);
  const [searchFestivalId, setSearchFestivalId] = useState<string | undefined>(undefined);
  const [searchHistoryId, setSearchHistoryId] = useState<string | undefined>(undefined);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener for Search (⌘K / Ctrl+K or /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      } else if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset selected search index when query or filter changes
  useEffect(() => {
    setSearchSelectedIndex(0);
  }, [searchQuery, searchFilter]);

  // Focus search input when modal opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      document.body.style.overflow = 'hidden';
    } else {
      setSearchQuery('');
      document.body.style.overflow = '';
    }
  }, [isSearchOpen]);

  // Filter search results
  const filteredSearchResults = searchIndex.filter(item => {
    const matchesFilter = searchFilter === 'all' || item.type === searchFilter;
    if (!matchesFilter) return false;
    
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.meta.includes(query)
    );
  });

  const handleSelectSearchResult = (result: SearchResult) => {
    setIsSearchOpen(false);
    
    // Clear other search parameters first
    setSearchArtifactId(undefined);
    setSearchDishId(undefined);
    setSearchAttractionId(undefined);
    setSearchFestivalId(undefined);
    setSearchHistoryId(undefined);

    if (result.type === 'artifact') setSearchArtifactId(result.id);
    if (result.type === 'recipe') setSearchDishId(result.id);
    if (result.type === 'site') setSearchAttractionId(result.id);
    if (result.type === 'festival') setSearchFestivalId(result.id);
    if (result.type === 'history') setSearchHistoryId(result.id);

    setActiveTab(result.tab);
    triggerToast(`Navigated to ${result.name}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredSearchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSearchSelectedIndex(prev => (prev + 1) % filteredSearchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSearchSelectedIndex(prev => (prev - 1 + filteredSearchResults.length) % filteredSearchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelectSearchResult(filteredSearchResults[searchSelectedIndex]);
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
    }
  };

  const getResultIcon = (type: 'artifact' | 'recipe' | 'site' | 'festival' | 'history') => {
    switch (type) {
      case 'artifact': return <Compass className="w-4 h-4 text-amber-500" />;
      case 'recipe': return <UtensilsCrossed className="w-4 h-4 text-orange-500" />;
      case 'site': return <MapPin className="w-4 h-4 text-emerald-500" />;
      case 'festival': return <Sparkles className="w-4 h-4 text-pink-500" />;
      case 'history': return <Award className="w-4 h-4 text-blue-500" />;
    }
  };

  const navigationItems = [
    { id: 'overview', name: 'Overview', icon: <Anchor className="w-4 h-4" /> },
    { id: 'culture', name: 'Culture & traditions', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'museum', name: 'Virtual Museum', icon: <Compass className="w-4 h-4" /> },
    { id: 'culinary', name: 'Culinary Heritage', icon: <UtensilsCrossed className="w-4 h-4" /> },
    { id: 'ecotourism', name: 'Ecotourism & Beach', icon: <MapPin className="w-4 h-4" /> },
    { id: 'postcard', name: 'Postcard Studio', icon: <Mail className="w-4 h-4" /> },
    { id: 'quiz', name: 'Cultural Assessment', icon: <Award className="w-4 h-4" /> },
  ] as const;

  const triggerToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-12">
            <Hero onExploreClick={(tabId) => setActiveTab(tabId as ActiveTab)} />
            
            {/* Quick highlights grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="bg-white border border-stone-200/80 p-6 rounded-2xl space-y-3 shadow-xs">
                <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl w-fit">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-stone-900">
                  Oru Egbelegbe Festival
                </h3>
                <p className="font-sans text-xs text-stone-500 leading-relaxed">
                  Experience a historic periodic cycle of war canoes, sacred dances, and beach purification ceremonies that unite the coastal communities.
                </p>
                <button
                  onClick={() => setActiveTab('culture')}
                  className="font-sans text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer pt-1"
                >
                  Explore Traditions →
                </button>
              </div>

              <div className="bg-white border border-stone-200/80 p-6 rounded-2xl space-y-3 shadow-xs">
                <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl w-fit">
                  <UtensilsCrossed className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-stone-900">
                  The Gastronomy of Keke Fieye
                </h3>
                <p className="font-sans text-xs text-stone-500 leading-relaxed">
                  Enter the royal hearth and discover how to cook unripe plantains with snails, smoked fish, and clipped periwinkle shells.
                </p>
                <button
                  onClick={() => setActiveTab('culinary')}
                  className="font-sans text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer pt-1"
                >
                  Enter Kitchen Simulator →
                </button>
              </div>

              <div className="bg-white border border-stone-200/80 p-6 rounded-2xl space-y-3 shadow-xs">
                <div className="p-3 bg-amber-500/10 text-amber-600 rounded-xl w-fit">
                  <MapPin className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-base text-stone-900">
                  Brass Island Eco-Safaris
                </h3>
                <p className="font-sans text-xs text-stone-500 leading-relaxed">
                  Formulate custom travel drafts to visit pristine golden sands, whispering mangrove estuaries, and the sovereign court.
                </p>
                <button
                  onClick={() => setActiveTab('ecotourism')}
                  className="font-sans text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer pt-1"
                >
                  Plan Your Expedition →
                </button>
              </div>
            </div>

            {/* Introductory cultural highlight block */}
            <div className="bg-stone-50 border border-stone-200/50 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center text-left">
              <div className="flex-1 space-y-4">
                <h3 className="font-display text-2xl font-bold text-stone-900 tracking-tight leading-snug">
                  Preserving Sovereign Ijaw Legacies
                </h3>
                <p className="font-sans text-xs text-stone-600 leading-relaxed">
                  Okpoama Kingdom holds a revered chapter in the struggle for West African trade sovereignty. Known for defending free trade during the palm oil rivers era and resisting the Royal Niger Company's blockades in 1895, the kingdom's resilience flows within every native custom.
                </p>
                <div className="flex gap-4">
                  <div className="text-left">
                    <span className="font-display text-lg font-bold text-amber-600 block leading-none">1895</span>
                    <span className="font-sans text-4xs text-stone-400 block tracking-wider uppercase mt-1">Akassa Resistance</span>
                  </div>
                  <div className="h-8 w-px bg-stone-300" />
                  <div className="text-left">
                    <span className="font-display text-lg font-bold text-amber-600 block leading-none">XXI</span>
                    <span className="font-sans text-4xs text-stone-400 block tracking-wider uppercase mt-1">Amanyanabo Lineage</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-80 h-44 rounded-2xl overflow-hidden bg-stone-200 shrink-0 shadow-inner">
                <img
                  src="https://images.unsplash.com/photo-1590076275572-acdf4061a1b1?auto=format&fit=crop&w=600&q=80"
                  alt="Ancient Brass Island"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Virtual Museum Teaser Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center text-left relative overflow-hidden shadow-xl text-neutral-100">
              {/* Background Ambient Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full filter blur-3xl pointer-events-none" />
              <div className="flex-1 space-y-3 z-10">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-950/80 border border-amber-500/30 text-[10px] font-mono text-amber-400 uppercase tracking-widest">
                  Interactive Archives
                </span>
                <h3 className="font-display text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-100 to-amber-300 leading-snug">
                  Enter the Virtual Museum
                </h3>
                <p className="font-sans text-xs text-neutral-300 leading-relaxed max-w-xl">
                  Walk through the digital vaults of Okpoama Kingdom. Witness interactive 3D historical artifacts—from the Amanyanabo's Golden Scepter to King Koko's battle cannon—complete with full audio-narrated guides.
                </p>
                <button
                  onClick={() => {
                    setActiveTab('museum');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="mt-2 font-sans text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer pt-1"
                >
                  Enter Exhibition Hall →
                </button>
              </div>
              <div className="w-full md:w-56 h-36 rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800 shrink-0 shadow-inner z-10 relative">
                <img
                  src="https://images.unsplash.com/photo-1590076275572-acdf4061a1b1?auto=format&fit=crop&w=600&q=80"
                  alt="Royal Scepter Teaser"
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Vintage Stylized Map Section */}
            <div className="bg-stone-100 border border-stone-200/60 rounded-3xl p-6 md:p-8 space-y-6 text-left relative overflow-hidden shadow-xs">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-800 uppercase tracking-widest font-bold">
                    Sovereign Cartography
                  </span>
                  <h3 className="font-display text-2xl font-black text-stone-900 tracking-tight leading-none mt-1.5 flex items-center gap-2">
                    <Map className="w-5 h-5 text-amber-600" /> Waterways of Okpoama & Brass Island
                  </h3>
                  <p className="font-sans text-xs text-stone-500 mt-1 max-w-xl">
                    Explore the physical and strategic terrain of Brass Island. Click on the golden nautical markers to inspect local landmarks, ancient wells, and historical fronts.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Left Column: Interactive Map Canvas */}
                <div className="lg:col-span-8 flex flex-col justify-center">
                  <div className="relative w-full aspect-[3/2] rounded-2xl overflow-hidden border border-stone-300 shadow-md bg-stone-200 select-none">
                    {/* The vintage map image generated previously */}
                    <img
                      src="/src/assets/images/brass_island_map_1783094177634.jpg"
                      alt="Vintage Cartography of Brass Island and Okpoama waterways"
                      className="w-full h-full object-cover filter sepia-[0.1] contrast-[1.05]"
                      referrerPolicy="no-referrer"
                    />

                    {/* Trade Route SVG Path overlay */}
                    <AnimatePresence>
                      {showTradeRoute && (
                        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none">
                          {/* Shadow/Glow path */}
                          <motion.path
                            d="M 18,30 Q 30,50 42,55 T 68,42"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            opacity="0.35"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                          />
                          {/* Animated main dashed path */}
                          <motion.path
                            d="M 18,30 Q 30,50 42,55 T 68,42"
                            fill="none"
                            stroke="#d97706"
                            strokeWidth="0.8"
                            strokeLinecap="round"
                            strokeDasharray="2, 1.5"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                          />

                          {/* Historical labels along curves */}
                          <motion.text
                            x="31"
                            y="43"
                            fill="#d97706"
                            fontSize="2"
                            fontWeight="bold"
                            fontFamily="monospace"
                            textAnchor="middle"
                            transform="rotate(16, 31, 43)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.85 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            CANOE ROUTE
                          </motion.text>
                          <motion.text
                            x="54"
                            y="47"
                            fill="#d97706"
                            fontSize="2"
                            fontWeight="bold"
                            fontFamily="monospace"
                            textAnchor="middle"
                            transform="rotate(-15, 54, 47)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.85 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.7 }}
                          >
                            SALT CORRIDOR
                          </motion.text>
                        </svg>
                      )}
                    </AnimatePresence>

                    {/* Interactive pulsating pins */}
                    {MAP_LANDMARKS.map((landmark) => {
                      const isSelected = selectedLandmarkId === landmark.id;
                      return (
                        <button
                          key={landmark.id}
                          onClick={() => setSelectedLandmarkId(landmark.id)}
                          style={{ top: landmark.top, left: landmark.left }}
                          className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20 focus:outline-none"
                          id={`map-pin-${landmark.id}`}
                        >
                          <span className="absolute inset-0 rounded-full bg-amber-500/40 animate-ping scale-150 duration-1000" />
                          <div className={`relative w-7 h-7 rounded-full flex items-center justify-center border transition-all duration-300 ${
                            isSelected
                              ? 'bg-amber-600 border-amber-300 scale-125 shadow-lg shadow-amber-600/30 ring-4 ring-amber-500/20'
                              : 'bg-neutral-900/95 border-amber-500/70 hover:scale-110 hover:border-amber-400'
                          }`}>
                            <Anchor className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-amber-400'}`} />
                          </div>
                          
                          {/* Floating mini-tooltip */}
                          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-stone-900/95 text-stone-100 font-mono text-[9px] font-bold tracking-wider px-2 py-0.5 rounded shadow-md border border-stone-800 uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-30">
                            {landmark.name}
                          </div>
                        </button>
                      );
                    })}

                    {/* Overlay Control Panel */}
                    <div className="absolute top-4 left-4 z-30 bg-stone-900/90 backdrop-blur-md px-3.5 py-3 rounded-xl border border-stone-800/85 shadow-xl flex flex-col gap-1.5 max-w-[195px] pointer-events-auto">
                      <span className="text-[9px] font-mono text-amber-500 tracking-wider font-bold uppercase leading-none">Map Overlays</span>
                      <button
                        onClick={() => setShowTradeRoute(!showTradeRoute)}
                        className={`px-2.5 py-1.5 rounded-lg font-mono text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer leading-none ${
                          showTradeRoute
                            ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20'
                            : 'bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-700'
                        }`}
                        id="btn-toggle-trade-route"
                      >
                        <Compass className={`w-3.5 h-3.5 ${showTradeRoute ? 'animate-spin-slow text-white' : 'text-stone-400'}`} />
                        <span>19th-C. Trade Route</span>
                      </button>
                    </div>

                    {/* Scale and Compass elements to mimic authentic old maps */}
                    <div className="absolute bottom-4 left-4 bg-stone-900/85 backdrop-blur-md px-3 py-1.5 border border-stone-800 rounded-lg text-[9px] font-mono text-stone-300 tracking-wider flex items-center gap-2 pointer-events-none z-10">
                      <Compass className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                      <span>1:25,000 NAUTICAL GRID</span>
                    </div>

                    <div className="absolute top-4 right-4 bg-stone-900/85 backdrop-blur-md px-3 py-1.5 border border-stone-800 rounded-lg text-[9px] font-mono text-stone-300 tracking-wider flex flex-col pointer-events-none z-10">
                      <span className="text-amber-400 font-bold uppercase">Cape Formosa Bight</span>
                      <span className="text-[8px] text-stone-400">Brass District • Niger Delta</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Dynamic Inspector Details card */}
                <div className="lg:col-span-4 flex">
                  {(() => {
                    const landmark = MAP_LANDMARKS.find(l => l.id === selectedLandmarkId) || MAP_LANDMARKS[0];
                    return (
                      <div className="w-full bg-stone-50 border border-stone-200 p-6 rounded-2xl flex flex-col justify-between shadow-xs">
                        <div className="space-y-4">
                          <div className="border-b border-stone-200 pb-3">
                            <span className="text-[10px] font-mono text-amber-700 font-bold uppercase tracking-wider">
                              {landmark.category}
                            </span>
                            <h4 className="font-display font-black text-lg text-stone-900 tracking-tight leading-tight mt-0.5">
                              {landmark.name}
                            </h4>
                          </div>

                          <div className="space-y-3 font-sans text-xs text-stone-600 leading-relaxed">
                            <p>
                              {landmark.description}
                            </p>
                            
                            <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl space-y-1">
                              <span className="font-mono text-[9px] font-bold text-amber-800 uppercase tracking-widest flex items-center gap-1">
                                <Info className="w-3.5 h-3.5" /> Historical Significance
                              </span>
                              <p className="text-[11px] text-stone-700 font-medium">
                                {landmark.significance}
                              </p>
                            </div>

                            <div className="bg-stone-100 p-3 rounded-xl space-y-1">
                              <span className="font-mono text-[9px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-1">
                                <Globe className="w-3.5 h-3.5 text-stone-400" /> Active Tourism Guide
                              </span>
                              <p className="text-[11px] text-stone-700 font-medium">
                                {landmark.activity}
                              </p>
                            </div>

                            <AnimatePresence>
                              {showTradeRoute && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="bg-amber-950/5 border border-amber-500/15 p-3 rounded-xl space-y-1 overflow-hidden"
                                >
                                  <span className="font-mono text-[9px] font-bold text-amber-800 uppercase tracking-widest flex items-center gap-1">
                                    <Compass className="w-3.5 h-3.5 text-amber-600 animate-pulse" /> 19th-C. Commerce & Resistance
                                  </span>
                                  <p className="text-[11px] text-stone-700 font-medium leading-relaxed">
                                    Prior to industrial imports, salt from Okpoama forest wells fueled regional commerce. Indigenous merchant fleets navigated these winding waterways to deliver salt slabs to the Brass River Estuary, mounting fierce resistance against oppressive 19th-century colonial blockades and tax structures.
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Interactive Trigger that ties to other features! */}
                        <div className="pt-4 border-t border-stone-200 mt-6">
                          <button
                            onClick={() => {
                              if (landmark.id === 'salt_wells') {
                                setActiveTab('ecotourism');
                              } else if (landmark.id === 'okpoama_town') {
                                setActiveTab('culture');
                              } else if (landmark.id === 'brass_river') {
                                setActiveTab('culture');
                              } else if (landmark.id === 'okpoama_beaches') {
                                setActiveTab('ecotourism');
                              } else {
                                setActiveTab('ecotourism');
                              }
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-amber-600/10"
                          >
                            Explore This Site <Compass className="w-4 h-4 animate-pulse" />
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        );
      case 'culture':
        return <CulturalShowcase initialFestivalId={searchFestivalId} initialHistoryId={searchHistoryId} />;
      case 'museum':
        return <VirtualMuseum initialArtifactId={searchArtifactId} />;
      case 'culinary':
        return <CulinaryShowcase initialDishId={searchDishId} />;
      case 'ecotourism':
        return <EcotourismGuide initialAttractionId={searchAttractionId} />;
      case 'postcard':
        return <PostcardGenerator />;
      case 'quiz':
        return <TriviaQuiz />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col justify-between font-sans relative selection:bg-amber-100 selection:text-amber-950">
      
      {/* Toast Alert overlay */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white px-5 py-3 rounded-xl shadow-xl border border-stone-800 text-xs font-sans flex items-center gap-2">
          <Compass className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Header/Nav bar */}
      <header className="sticky top-0 bg-stone-50/85 backdrop-blur-md border-b border-stone-200/80 z-40">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-18 flex items-center justify-between">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-2 text-left cursor-pointer group focus:outline-none"
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden bg-stone-900 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-200">
              <img
                src="/src/assets/images/eagle_tusk_logo_1783093060033.jpg"
                alt="Okpoama Eagle and Elephant Tusk Royal Emblem"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="font-display font-black text-sm tracking-wide text-stone-900 uppercase leading-none">
                Okpoama Kingdom
              </h1>
              <p className="font-sans text-4xs tracking-widest text-stone-400 uppercase font-bold mt-0.5">
                Culture & traditions Portal
              </p>
            </div>
          </button>

          {/* Desktop Search bar trigger */}
          <div className="hidden lg:block flex-1 max-w-[150px] xl:max-w-[210px] mx-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full pl-3 pr-4 py-2 bg-stone-100 hover:bg-stone-200/50 border border-stone-200 rounded-xl text-left text-xs font-semibold text-stone-500 hover:text-stone-700 transition-colors cursor-pointer flex items-center justify-between shadow-3xs"
              title="Search kingdom artifacts, recipes, sites..."
              id="desktop-search-trigger"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="text-stone-400 font-sans font-medium text-3xs">Search...</span>
              </span>
              <kbd className="inline-flex h-4 items-center gap-0.5 rounded border border-stone-200/60 bg-white px-1.5 font-mono text-[8px] text-stone-400 font-bold">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Desktop Navigation links */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-amber-500/10 text-amber-900'
                    : 'text-stone-500 hover:text-stone-950 hover:bg-stone-50'
                }`}
                id={`nav-btn-${item.id}`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </nav>

          {/* Social icons / Quick share */}
          <div className="hidden lg:flex items-center gap-2.5 pl-4 border-l border-stone-200">
            <button
              onClick={() => triggerToast("Sharing tourism page to Facebook...")}
              className="p-2 text-stone-400 hover:text-amber-700 bg-stone-50 hover:bg-amber-50 border border-stone-200 rounded-lg transition-colors cursor-pointer"
              title="Share on Facebook"
            >
              <Facebook className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => triggerToast("Sharing tourism page to Twitter/X...")}
              className="p-2 text-stone-400 hover:text-amber-700 bg-stone-50 hover:bg-amber-50 border border-stone-200 rounded-lg transition-colors cursor-pointer"
              title="Share on Twitter"
            >
              <Twitter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                triggerToast("Development App URL copied to clipboard!");
              }}
              className="p-2 text-stone-400 hover:text-amber-700 bg-stone-50 hover:bg-amber-50 border border-stone-200 rounded-lg transition-colors cursor-pointer"
              title="Copy Link"
            >
              <Link className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile search trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden p-2.5 text-stone-500 hover:text-amber-700 bg-stone-100/85 hover:bg-amber-50 border border-stone-200 rounded-xl transition-all cursor-pointer mr-2 shadow-3xs"
            title="Search Kingdom"
            id="mobile-search-trigger"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 text-stone-600 hover:text-stone-950 hover:bg-stone-50 border border-stone-200 rounded-xl transition-all cursor-pointer"
            id="mobile-nav-toggle"
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-stone-200 py-3.5 px-4 space-y-1.5">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide text-left cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-amber-500/10 text-amber-900'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
                }`}
                id={`mobile-nav-btn-${item.id}`}
              >
                {item.icon}
                {item.name}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Floating Home Button */}
      {activeTab !== 'overview' && (
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={() => {
              setActiveTab('overview');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-3 rounded-full bg-stone-900/95 backdrop-blur-md text-white hover:bg-amber-600 border border-stone-800 hover:border-amber-400 font-mono text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xl group"
            id="floating-home-btn"
          >
            <Anchor className="w-3.5 h-3.5 text-amber-400 group-hover:text-white" />
            <span>Return Home</span>
          </button>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 md:px-6 py-8">
        {activeTab !== 'overview' && (
          <div className="mb-6 flex items-center justify-start">
            <button
              onClick={() => {
                setActiveTab('overview');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2 rounded-xl bg-white border border-stone-200 hover:border-amber-500/50 hover:bg-amber-50/50 text-stone-600 hover:text-amber-900 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xs"
              id="back-to-home-main-btn"
            >
              ← Back to Home Page
            </button>
          </div>
        )}
        {renderActiveContent()}
      </main>

      {/* Persistent Footer with educational details */}
      <footer className="bg-stone-950 text-white border-t border-stone-900 mt-16">
        <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 pb-8 border-b border-stone-900">
            {/* Left Column: branding info */}
            <div className="space-y-4 max-w-xs text-left">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌊</span>
                <h4 className="font-display font-extrabold text-sm tracking-widest uppercase text-white leading-none">
                  Okpoama Kingdom
                </h4>
              </div>
              <p className="font-sans text-2xs text-stone-400 leading-relaxed">
                An ancient sovereign realm located on Brass Island, Bayelsa State, Nigeria, preserving maritime traditions, sacred rites of passage, and historic sovereign struggles.
              </p>
            </div>

            {/* Center Column: Quick navigation */}
            <div className="text-left">
              <h5 className="font-display text-3xs font-bold text-amber-400 uppercase tracking-widest mb-3">
                Tourism Portal
              </h5>
              <div className="grid grid-cols-2 gap-x-8 gap-y-1.5 text-2xs text-stone-400 font-sans">
                {navigationItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 cursor-pointer text-left focus:outline-none"
                    id={`footer-nav-${item.id}`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Cultural Coordinates / Facts */}
            <div className="space-y-2.5 text-left text-2xs font-sans text-stone-400 shrink-0">
              <h5 className="font-display text-3xs font-bold text-amber-400 uppercase tracking-widest">
                Cultural Coordinates
              </h5>
              <div className="space-y-1 font-mono">
                <p>Latitude: 4.3167° N, Longitude: 6.3000° E</p>
                <p>Realm: Atlantic Bight of Bonny Entrance</p>
                <p>Regent: Amanyanabo Dynasty of Brass Island</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-stone-500 text-3xs font-mono font-bold uppercase tracking-wider">
            <span>© 2026 Okpoama Kingdom Tourism Bureau • All Rights Reserved</span>
            <div className="flex gap-4">
              <a href="#brand-logo-btn" className="hover:text-white">Back to Top</a>
              <span>•</span>
              <span className="text-stone-600">Built for Okpoama Cultural Conservation</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Dynamic Command Palette / Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 bg-stone-950/40 backdrop-blur-md"
            />

            {/* Modal Card wrapper */}
            <div className="flex min-h-full items-start justify-center p-4 pt-16 sm:p-6 sm:pt-28">
              <motion.div
                initial={{ opacity: 0, scale: 0.97, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full max-w-xl overflow-hidden rounded-2xl bg-white border border-stone-200 shadow-2xl flex flex-col relative z-10"
              >
                {/* Search Bar Input */}
                <div className="relative border-b border-stone-100 px-4 py-3.5 flex items-center">
                  <Search className="h-5 w-5 text-amber-600 shrink-0 mr-3" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Search artifacts, recipes, historical sites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                    className="w-full bg-transparent border-0 text-sm font-sans text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-0 py-0"
                    id="command-search-input"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="p-1 text-stone-400 hover:text-stone-600 rounded-md transition-colors mr-1 cursor-pointer"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  )}
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-700 rounded-lg text-3xs font-mono font-bold tracking-wider uppercase transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>Esc</span>
                  </button>
                </div>

                {/* Categories filtering tabs */}
                <div className="px-4 py-2 border-b border-stone-100 bg-stone-50/50 flex flex-wrap gap-1.5 items-center">
                  <span className="font-mono text-[9px] text-stone-400 font-bold uppercase mr-1">Filter:</span>
                  {[
                    { id: 'all', name: 'All' },
                    { id: 'artifact', name: 'Artifacts' },
                    { id: 'recipe', name: 'Recipes' },
                    { id: 'site', name: 'Sites' },
                    { id: 'festival', name: 'Festivals' },
                    { id: 'history', name: 'History' }
                  ].map((filterTab) => (
                    <button
                      key={filterTab.id}
                      onClick={() => setSearchFilter(filterTab.id as any)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold tracking-wide transition-all cursor-pointer ${
                        searchFilter === filterTab.id
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-100 text-stone-500 hover:text-stone-800'
                      }`}
                      id={`search-filter-tab-${filterTab.id}`}
                    >
                      {filterTab.name}
                    </button>
                  ))}
                </div>

                {/* Search Results list area */}
                <div className="max-h-96 overflow-y-auto p-2 space-y-0.5 custom-scrollbar bg-stone-50/20 text-left">
                  {filteredSearchResults.length > 0 ? (
                    filteredSearchResults.map((result, idx) => {
                      const isSelected = idx === searchSelectedIndex;
                      return (
                        <button
                          key={`${result.type}-${result.id}`}
                          onClick={() => handleSelectSearchResult(result)}
                          onMouseEnter={() => setSearchSelectedIndex(idx)}
                          className={`w-full text-left p-3 rounded-xl flex items-start gap-3 transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-amber-500/10 border border-amber-500/20 shadow-3xs' 
                              : 'border border-transparent hover:bg-stone-100/50'
                          }`}
                          id={`search-result-item-${idx}`}
                        >
                          <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                            isSelected ? 'bg-white shadow-3xs' : 'bg-stone-100'
                          }`}>
                            {getResultIcon(result.type)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-display font-bold text-xs text-stone-900 leading-snug">
                                {result.name}
                              </span>
                              <span className="px-1.5 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-[8px] font-mono font-bold text-stone-500 uppercase tracking-wide">
                                {result.category}
                              </span>
                            </div>
                            <p className="font-sans text-2xs text-stone-500 leading-relaxed mt-1 line-clamp-2">
                              {result.description}
                            </p>
                          </div>

                          <ChevronRight className={`w-4 h-4 mt-2 shrink-0 transition-transform ${
                            isSelected ? 'text-amber-600 translate-x-0.5' : 'text-stone-300'
                          }`} />
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-12 px-4 text-center">
                      <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-3">
                        <Search className="w-5 h-5 text-stone-400" />
                      </div>
                      <h4 className="font-display font-black text-xs text-stone-800 uppercase tracking-wider">No matching treasures found</h4>
                      <p className="font-sans text-2xs text-stone-400 max-w-xs mx-auto mt-1 leading-relaxed">
                        No artifacts, traditional recipes, or sacred spots match your search query. Try broadening your keywords.
                      </p>
                    </div>
                  )}
                </div>

                {/* Command palette shortcuts status footer */}
                <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[10px] font-mono text-stone-400">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <kbd className="border border-stone-200 bg-white px-1.5 py-0.5 rounded shadow-3xs font-sans text-3xs font-black">↑↓</kbd> Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="border border-stone-200 bg-white px-1.5 py-0.5 rounded shadow-3xs font-sans text-3xs font-black">Enter</kbd> Select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="border border-stone-200 bg-white px-1.5 py-0.5 rounded shadow-3xs font-sans text-3xs font-black">Esc</kbd> Close
                    </span>
                  </div>
                  <span className="hidden sm:inline font-semibold text-[9px] text-stone-300">
                    OKPOAMA KINGDOM PORTAL
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
