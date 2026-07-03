/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCw, 
  Sparkles, 
  Layers, 
  Grid, 
  Info, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  Award, 
  Clock, 
  ShieldAlert,
  Search,
  BookOpen,
  Camera,
  CameraOff,
  Smartphone,
  CheckCircle2,
  Move,
  X,
  Scan,
  QrCode
} from 'lucide-react';
import { MUSEUM_ARTIFACTS } from '../data/okpoamaData';
import { MuseumArtifact } from '../types';

export default function VirtualMuseum({ initialArtifactId }: { initialArtifactId?: string }) {
  const [selectedArtifact, setSelectedArtifact] = useState<MuseumArtifact>(MUSEUM_ARTIFACTS[0]);
  const [viewMode, setViewMode] = useState<'spotlight' | 'grid'>('spotlight');
  const [activeEraFilter, setActiveEraFilter] = useState<string>('All');
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [audioCaptions, setAudioCaptions] = useState<string>('');
  const [flippedCards, setFlippedCards] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    if (initialArtifactId) {
      const artifact = MUSEUM_ARTIFACTS.find(a => a.id === initialArtifactId);
      if (artifact) {
        setSelectedArtifact(artifact);
        setViewMode('spotlight');
      }
    }
  }, [initialArtifactId]);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // AR Modal State
  const [isARModalOpen, setIsARModalOpen] = useState<boolean>(false);
  const [arArtifact, setArArtifact] = useState<MuseumArtifact | null>(null);
  const [arTab, setArTab] = useState<'explain' | 'simulator'>('explain');
  const [isLiveCameraOn, setIsLiveCameraOn] = useState<boolean>(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [arPosition, setArPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [arScale, setArScale] = useState<number>(1.0);
  const [arRotation, setArRotation] = useState<number>(0);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [hasScannedSurface, setHasScannedSurface] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [isAnchorPlaced, setIsAnchorPlaced] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const openARModal = (artifact: MuseumArtifact) => {
    setArArtifact(artifact);
    setIsARModalOpen(true);
    setArTab('explain');
    setArPosition({ x: 0, y: 0 });
    setArScale(1.0);
    setArRotation(0);
    setHasScannedSurface(false);
    setIsScanning(false);
    setIsAnchorPlaced(false);
  };

  const closeARModal = () => {
    setIsARModalOpen(false);
    stopCamera();
    setArArtifact(null);
  };

  const startCamera = async () => {
    setIsScanning(true);
    setScanProgress(0);
    setHasScannedSurface(false);
    setIsAnchorPlaced(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } } 
      });
      setCameraStream(stream);
      setIsLiveCameraOn(true);
    } catch (err) {
      console.error("Camera access failed:", err);
      // Fallback: simulate camera without actual webcam
      setIsLiveCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsLiveCameraOn(false);
    setHasScannedSurface(false);
    setIsScanning(false);
    setIsAnchorPlaced(false);
  };

  useEffect(() => {
    if (isLiveCameraOn && videoRef.current && cameraStream) {
      videoRef.current.srcObject = cameraStream;
    }
  }, [isLiveCameraOn, cameraStream]);

  // Simulate scanning progress
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsScanning(false);
            setHasScannedSurface(true);
            return 100;
          }
          return prev + 10;
        });
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isScanning]);

  // Extract unique eras for filtering
  const eras = ['All', ...Array.from(new Set(MUSEUM_ARTIFACTS.map(a => a.era)))];

  // Filter artifacts
  const filteredArtifacts = MUSEUM_ARTIFACTS.filter(artifact => {
    const matchesEra = activeEraFilter === 'All' || artifact.era === activeEraFilter;
    const matchesSearch = artifact.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          artifact.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          artifact.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesEra && matchesSearch;
  });

  // Toggle card flip (for grid view)
  const toggleCardFlip = (id: string) => {
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Audio Guide controller using Web Speech API
  const handlePlayAudioGuide = (artifact: MuseumArtifact) => {
    if ('speechSynthesis' in window) {
      // If already playing this, pause/stop it
      if (isPlayingAudio) {
        window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
        setAudioCaptions('');
        return;
      }

      window.speechSynthesis.cancel(); // Stop any ongoing speech

      const utterance = new SpeechSynthesisUtterance(artifact.audioGuideText);
      
      // Try to find an elegant English voice (like UK or male/female depth)
      const voices = window.speechSynthesis.getVoices();
      const idealVoice = voices.find(v => v.lang.includes('en-GB') || v.lang.includes('en-NG')) || voices.find(v => v.lang.startsWith('en'));
      if (idealVoice) {
        utterance.voice = idealVoice;
      }
      
      utterance.rate = 0.95; // Slightly slower, majestic museum pace
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsPlayingAudio(true);
        setAudioCaptions(artifact.audioGuideText);
      };

      utterance.onend = () => {
        setIsPlayingAudio(false);
        setAudioCaptions('');
      };

      utterance.onerror = () => {
        setIsPlayingAudio(false);
        setAudioCaptions('');
      };

      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback if SpeechSynthesis is not supported
      setIsPlayingAudio(true);
      setAudioCaptions(`[Voice Synthesis Unsupported] Narrator: "${artifact.audioGuideText}"`);
      setTimeout(() => {
        setIsPlayingAudio(false);
        setAudioCaptions('');
      }, 8000);
    }
  };

  // Cancel audio on unmount or artifact change
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    // If artifact changes, stop current audio
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setAudioCaptions('');
  }, [selectedArtifact]);

  // Navigate Spotlight mode
  const handlePrevSpotlight = () => {
    const currentIndex = MUSEUM_ARTIFACTS.findIndex(a => a.id === selectedArtifact.id);
    const prevIndex = (currentIndex - 1 + MUSEUM_ARTIFACTS.length) % MUSEUM_ARTIFACTS.length;
    setSelectedArtifact(MUSEUM_ARTIFACTS[prevIndex]);
  };

  const handleNextSpotlight = () => {
    const currentIndex = MUSEUM_ARTIFACTS.findIndex(a => a.id === selectedArtifact.id);
    const nextIndex = (currentIndex + 1) % MUSEUM_ARTIFACTS.length;
    setSelectedArtifact(MUSEUM_ARTIFACTS[nextIndex]);
  };

  return (
    <div id="virtual-museum-root" className="min-h-screen bg-neutral-950 text-neutral-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Upper Ambient Glow decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-gold-900/10 via-transparent to-transparent pointer-events-none blur-3xl" />

      {/* Header */}
      <div id="museum-header" className="max-w-7xl mx-auto text-center mb-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-950/40 border border-gold-500/30 text-gold-400 text-xs font-mono uppercase tracking-wider mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
          Interactive Exhibition
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gold-100 via-gold-300 to-gold-500 mb-4"
        >
          THE AMANYANABO'S ARCHIVE
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="max-w-2xl mx-auto text-neutral-400 text-sm sm:text-base font-serif italic"
        >
          "Step into a digital treasury of Okpoama Kingdom. Witness the bronze, mahogany, and sacred artifacts that defended the sovereign shores of Brass Island across generations."
        </motion.p>
      </div>

      {/* Controls & Search Toolbar */}
      <div id="museum-toolbar" className="max-w-7xl mx-auto mb-8 bg-neutral-900/50 backdrop-blur-md border border-neutral-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center relative z-10">
        {/* Filter Eras */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-mono text-gold-500 uppercase tracking-widest mr-2 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Era:
          </span>
          {eras.map(era => (
            <button
              key={era}
              id={`filter-era-${era.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setActiveEraFilter(era)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeEraFilter === era 
                  ? 'bg-gold-500 text-neutral-950 font-semibold shadow-lg shadow-gold-500/10' 
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
              }`}
            >
              {era}
            </button>
          ))}
        </div>

        {/* Search and View Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="relative w-full md:w-60">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="museum-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search relic, material..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-gold-500/50 transition-colors"
            />
          </div>

          <div className="flex bg-neutral-950 p-1 rounded-lg border border-neutral-800 shrink-0">
            <button
              id="btn-view-spotlight"
              onClick={() => setViewMode('spotlight')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'spotlight' 
                  ? 'bg-neutral-800 text-gold-400' 
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Spotlight View"
            >
              <Compass className="w-4 h-4" />
            </button>
            <button
              id="btn-view-grid"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-all ${
                viewMode === 'grid' 
                  ? 'bg-neutral-800 text-gold-400' 
                  : 'text-neutral-500 hover:text-neutral-300'
              }`}
              title="Gallery Grid"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Museum Container */}
      <div className="max-w-7xl mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {viewMode === 'spotlight' ? (
            /* ================== SPOTLIGHT VIEW ================== */
            <motion.div
              key="spotlight-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Left Column: Interactive 3D Card Spotlight */}
              <div className="lg:col-span-7 flex flex-col justify-between bg-neutral-900/40 border border-neutral-800/70 rounded-3xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-sm">
                
                {/* Background Ambient Spotlight Glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-gold-500/5 rounded-full filter blur-3xl pointer-events-none" />
                
                {/* Carousel Top Navigation */}
                <div className="flex justify-between items-center mb-6">
                  <div className="text-xs font-mono text-neutral-400">
                    EXHIBIT <span className="text-gold-400 font-bold font-sans">
                      {MUSEUM_ARTIFACTS.findIndex(a => a.id === selectedArtifact.id) + 1}
                    </span> OF {MUSEUM_ARTIFACTS.length}
                  </div>
                  <div className="flex gap-2">
                    <button
                      id="btn-spotlight-prev"
                      onClick={handlePrevSpotlight}
                      className="p-1.5 rounded-full bg-neutral-800/80 border border-neutral-700/50 hover:bg-neutral-700 text-neutral-300 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      id="btn-spotlight-next"
                      onClick={handleNextSpotlight}
                      className="p-1.5 rounded-full bg-neutral-800/80 border border-neutral-700/50 hover:bg-neutral-700 text-neutral-300 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main 3D Card Container */}
                <div className="flex-1 flex flex-col justify-center items-center py-6 perspective-1000">
                  <motion.div
                    key={selectedArtifact.id}
                    initial={{ rotateY: -15, opacity: 0, scale: 0.95 }}
                    animate={{ rotateY: 0, opacity: 1, scale: 1 }}
                    exit={{ rotateY: 15, opacity: 0, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    whileHover={{ rotateY: 5, rotateX: -2, z: 20 }}
                    className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-gold-500/20 bg-neutral-950 group cursor-grab active:cursor-grabbing preserve-3d"
                  >
                    {/* Shadow overlay for depth */}
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-neutral-950/40 z-10 mix-blend-multiply" />
                    
                    {/* Golden Inner Frame */}
                    <div className="absolute inset-4 border border-gold-500/20 rounded-xl z-20 pointer-events-none group-hover:border-gold-500/40 transition-colors" />

                    {/* Artifact Image */}
                    <img
                      src={selectedArtifact.imageFallback}
                      alt={selectedArtifact.name}
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    {/* Meta Badge Tags inside Card */}
                    <div className="absolute top-6 left-6 z-20 flex flex-col gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-gold-950/90 border border-gold-500/30 text-[10px] font-mono text-gold-300 w-fit">
                        {selectedArtifact.era}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-md bg-neutral-900/90 border border-neutral-800 text-[10px] font-mono text-neutral-300 w-fit">
                        {selectedArtifact.material}
                      </span>
                    </div>

                    {/* Dimension Tag */}
                    {selectedArtifact.dimensions && (
                      <div className="absolute top-6 right-6 z-20 bg-black/70 backdrop-blur-md border border-neutral-800 text-[10px] font-mono px-2 py-0.5 rounded text-neutral-400">
                        {selectedArtifact.dimensions}
                      </div>
                    )}

                    {/* Floating Glow Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-gold-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

                    {/* Card Footer Text */}
                    <div className="absolute bottom-6 left-6 right-6 z-20">
                      <p className="text-xs text-gold-400 font-mono tracking-wider uppercase mb-1">Okpoama Historical Relic</p>
                      <h3 className="text-xl sm:text-2xl font-display font-bold text-neutral-100 tracking-wide leading-tight drop-shadow-md">
                        {selectedArtifact.name}
                      </h3>
                    </div>
                  </motion.div>
                </div>

                {/* Subtitle / Tip instructions */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest flex items-center justify-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-gold-500/60" /> Hover and move cursor to explore 3D tilt perspective
                  </span>
                  
                  <button
                    onClick={() => openARModal(selectedArtifact)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-gold-500 hover:from-amber-400 hover:to-gold-400 text-neutral-950 font-mono text-2xs font-bold uppercase tracking-wider shadow-lg shadow-gold-500/10 active:scale-95 transition-all cursor-pointer"
                    id={`btn-ar-spotlight-${selectedArtifact.id}`}
                  >
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" /> View in AR
                  </button>
                </div>
              </div>

              {/* Right Column: Information, Simulated Audio Guide & Curatorial Notes */}
              <div className="lg:col-span-5 flex flex-col gap-6 justify-between">
                
                {/* Curator Speech / Sound Wave Box */}
                <div id="museum-audio-guide-panel" className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm relative overflow-hidden">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-xs font-mono text-gold-500 uppercase tracking-wider">Audio Guide System</h4>
                      <h3 className="text-lg font-display font-semibold text-neutral-200">Interactive Oral Narration</h3>
                    </div>
                    
                    <button
                      id="btn-play-audio-guide"
                      onClick={() => handlePlayAudioGuide(selectedArtifact)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                        isPlayingAudio 
                          ? 'bg-amber-600 text-neutral-100 animate-pulse' 
                          : 'bg-gold-500 text-neutral-950 hover:bg-gold-400 font-medium'
                      }`}
                    >
                      {isPlayingAudio ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5" /> Stop Guide
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5" /> Play Guide
                        </>
                      )}
                    </button>
                  </div>

                  {/* Waveform Animation */}
                  <div className="h-10 flex items-center gap-1 px-4 bg-neutral-950/60 rounded-xl border border-neutral-900 overflow-hidden mb-4 justify-center">
                    {isPlayingAudio ? (
                      Array.from({ length: 24 }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ 
                            height: [8, Math.random() * 28 + 8, 8] 
                          }}
                          transition={{ 
                            duration: 0.6 + Math.random() * 0.4, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="w-1 bg-gradient-to-t from-gold-600 to-gold-400 rounded-full"
                        />
                      ))
                    ) : (
                      <div className="text-xs font-mono text-neutral-600 tracking-wider flex items-center gap-1.5">
                        <Activity className="w-3 h-3 text-neutral-600" /> Audio Wave Idle — Click play to begin
                      </div>
                    )}
                  </div>

                  {/* Subtitles / Caption Panel */}
                  <AnimatePresence>
                    {audioCaptions && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bg-neutral-950/80 p-3.5 rounded-xl border border-neutral-900 text-xs leading-relaxed text-neutral-300 font-serif italic text-center"
                      >
                        <span className="text-[10px] font-mono text-gold-500 uppercase not-italic block mb-1">Curator Voice Transcript:</span>
                        "{audioCaptions}"
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Cultural Context Binder */}
                <div id="museum-artifact-details" className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-2xl backdrop-blur-sm flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-gold-500" />
                      <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Historical Preservation Dossier</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neutral-100 to-neutral-300 mb-2">
                      {selectedArtifact.name}
                    </h2>

                    <div className="grid grid-cols-2 gap-4 mb-4 bg-neutral-950/40 p-3 rounded-xl border border-neutral-900">
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase block">Era/Origin</span>
                        <span className="text-xs font-sans text-neutral-300 font-semibold">{selectedArtifact.era}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-neutral-500 uppercase block">Medium/Material</span>
                        <span className="text-xs font-sans text-neutral-300 font-semibold">{selectedArtifact.material}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-mono text-gold-400 uppercase tracking-wider mb-1">Visual & Ritual Purpose</h4>
                        <p className="text-neutral-300 text-sm leading-relaxed">{selectedArtifact.description}</p>
                      </div>

                      <div className="border-t border-neutral-800/80 pt-3">
                        <h4 className="text-xs font-mono text-gold-400 uppercase tracking-wider mb-1">The Provenance & History</h4>
                        <p className="text-neutral-400 text-sm leading-relaxed font-serif italic">{selectedArtifact.history}</p>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal small previews carousel */}
                  <div className="mt-6 border-t border-neutral-800/80 pt-4">
                    <h4 className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mb-2.5">Artifact Catalog Picker:</h4>
                    <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-neutral-800 scrollbar-track-transparent">
                      {MUSEUM_ARTIFACTS.map(artifact => {
                        const isSelected = selectedArtifact.id === artifact.id;
                        return (
                          <button
                            key={artifact.id}
                            id={`spotlight-thumb-${artifact.id}`}
                            onClick={() => setSelectedArtifact(artifact)}
                            className={`relative w-14 h-14 rounded-lg overflow-hidden border shrink-0 transition-all ${
                              isSelected 
                                ? 'border-gold-500 ring-2 ring-gold-500/20 scale-95' 
                                : 'border-neutral-800 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img 
                              src={artifact.imageFallback} 
                              alt={artifact.name} 
                              className="w-full h-full object-cover"
                            />
                            {isSelected && (
                              <div className="absolute inset-0 bg-gold-950/20 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-ping" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          ) : (
            /* ================== GRID VIEW ================== */
            <motion.div
              key="grid-view"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {filteredArtifacts.length === 0 ? (
                <div className="text-center py-20 bg-neutral-900/20 border border-neutral-800 rounded-3xl p-8">
                  <ShieldAlert className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
                  <p className="text-neutral-400 font-serif italic">No relics matched your filters inside the Royal Archive.</p>
                  <button 
                    onClick={() => { setActiveEraFilter('All'); setSearchQuery(''); }}
                    className="mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs text-gold-400 font-mono rounded-xl transition-all"
                  >
                    Clear Filter
                  </button>
                </div>
              ) : (
                <div id="museum-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArtifacts.map((artifact, index) => {
                    const isFlipped = flippedCards[artifact.id] || false;
                    return (
                      <motion.div
                        key={artifact.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="perspective-1000 h-96 w-full cursor-pointer relative group"
                        onClick={() => toggleCardFlip(artifact.id)}
                      >
                        {/* The flipping wrapper */}
                        <div 
                          className={`w-full h-full transition-transform duration-700 preserve-3d relative ${
                            isFlipped ? 'rotate-y-180' : ''
                          }`}
                          style={{ transform: isFlipped ? 'rotateY(180deg)' : 'none' }}
                        >
                          
                          {/* CARD FRONT SIDE */}
                          <div className="absolute inset-0 bg-neutral-900/90 border border-neutral-800 hover:border-gold-500/30 rounded-2xl p-5 flex flex-col justify-between backface-hidden shadow-xl overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent pointer-events-none z-10" />
                            
                            {/* Inner Gold border decoration */}
                            <div className="absolute inset-3 border border-neutral-800/60 rounded-xl pointer-events-none group-hover:border-gold-500/10 transition-colors z-20" />

                            {/* Top info */}
                            <div className="flex justify-between items-start z-20 relative">
                              <span className="px-2.5 py-0.5 rounded-md bg-gold-950/90 border border-gold-500/20 text-[9px] font-mono text-gold-400">
                                {artifact.era}
                              </span>
                              <span className="text-[10px] text-neutral-500 font-mono group-hover:text-gold-400 transition-colors flex items-center gap-1 bg-neutral-950/60 px-2 py-0.5 rounded">
                                <RotateCw className="w-2.5 h-2.5" /> FLIP INFO
                              </span>
                            </div>

                            {/* Center Preview Image */}
                            <div className="absolute inset-0 z-0">
                              <img 
                                src={artifact.imageFallback} 
                                alt={artifact.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover opacity-35 group-hover:opacity-45 transition-all duration-500 group-hover:scale-105"
                              />
                            </div>

                            {/* Lower Title & Material Info */}
                            <div className="z-20 relative">
                              <span className="text-[10px] font-mono text-gold-500 uppercase tracking-wider block mb-1">
                                {artifact.material}
                              </span>
                              <h3 className="text-xl font-display font-semibold text-neutral-100 tracking-wide mb-2 line-clamp-2">
                                {artifact.name}
                              </h3>
                              <p className="text-neutral-400 text-xs font-serif italic line-clamp-2 leading-relaxed">
                                {artifact.description}
                              </p>
                            </div>
                          </div>

                          {/* CARD BACK SIDE (Rotated 180 deg) */}
                          <div 
                            className="absolute inset-0 bg-neutral-950 border border-gold-500/30 rounded-2xl p-6 flex flex-col justify-between shadow-2xl overflow-hidden backface-hidden"
                            style={{ transform: 'rotateY(180deg)' }}
                          >
                            {/* Inner gold design frame */}
                            <div className="absolute inset-3 border border-gold-500/10 rounded-xl pointer-events-none" />

                            <div className="relative z-10 flex flex-col justify-between h-full">
                              <div>
                                <div className="flex justify-between items-start mb-2 border-b border-neutral-800 pb-2">
                                  <h4 className="text-xs font-mono text-gold-400 uppercase tracking-widest">Dossier Secrets</h4>
                                  <span className="text-[9px] font-mono text-neutral-500 flex items-center gap-1">
                                    <RotateCw className="w-2.5 h-2.5" /> REVERT
                                  </span>
                                </div>

                                <h3 className="text-base font-display font-bold text-neutral-100 tracking-wide mb-2">
                                  {artifact.name}
                                </h3>

                                <div className="space-y-2">
                                  <div>
                                    <span className="text-[9px] font-mono text-neutral-500 uppercase block">Historical Provenance:</span>
                                    <p className="text-neutral-300 text-xs font-serif italic leading-relaxed line-clamp-4">
                                      {artifact.history}
                                    </p>
                                  </div>
                                  
                                  {artifact.dimensions && (
                                    <div className="border-t border-neutral-900 pt-1">
                                      <span className="text-[9px] font-mono text-neutral-500 uppercase inline">Dimensions: </span>
                                      <span className="text-xs font-sans text-neutral-400">{artifact.dimensions}</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex justify-between items-center mt-3 border-t border-neutral-900 pt-2.5">
                                <button
                                  id={`btn-grid-audio-${artifact.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation(); // Avoid re-flipping card on button click
                                    handlePlayAudioGuide(artifact);
                                  }}
                                  className="flex items-center gap-1 text-[10px] font-mono text-gold-400 hover:text-gold-300 transition-colors cursor-pointer"
                                >
                                  <Volume2 className="w-3 h-3" /> Guide
                                </button>

                                <button
                                  id={`btn-grid-ar-${artifact.id}`}
                                  onClick={(e) => {
                                    e.stopPropagation(); // Avoid re-flipping card on button click
                                    openARModal(artifact);
                                  }}
                                  className="flex items-center gap-1 text-[10px] font-mono text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                                >
                                  <Sparkles className="w-3 h-3 animate-pulse" /> View AR
                                </button>
                                
                                <span className="text-[9px] font-mono text-neutral-500">
                                  {artifact.era}
                                </span>
                              </div>
                            </div>
                          </div>

                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Curator Footnote */}
      <div className="max-w-7xl mx-auto mt-20 text-center relative z-10">
        <div className="inline-block p-6 rounded-2xl bg-neutral-900/20 border border-neutral-800/80 backdrop-blur-sm max-w-xl">
          <Award className="w-6 h-6 text-gold-500 mx-auto mb-2.5" />
          <p className="text-xs text-neutral-400 leading-relaxed font-serif">
            The collections within the Okpoama Virtual Museum are digitized under the sovereign authority of the Royal Council of the Amanyanabo of Okpoama. All historical materials are cataloged for global educational purposes.
          </p>
        </div>
      </div>

      {/* ================== AUGMENTED REALITY (AR) MODAL ================== */}
      <AnimatePresence>
        {isARModalOpen && arArtifact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden my-8"
              id="ar-modal"
            >
              {/* Close Button */}
              <button
                onClick={closeARModal}
                className="absolute top-5 right-5 z-30 p-2 rounded-full bg-neutral-950/80 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-100 transition-colors cursor-pointer"
                id="btn-close-ar"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Banner Header */}
              <div className="p-6 md:p-8 bg-gradient-to-r from-amber-950/30 to-neutral-900 border-b border-neutral-800/80 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="text-xs font-mono text-amber-500 uppercase tracking-widest font-bold">
                    Augmented Reality Spatial Portal
                  </div>
                  <h3 className="text-2xl font-display font-extrabold text-neutral-100 tracking-tight">
                    View "{arArtifact.name}" in your Space
                  </h3>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-neutral-800/60 px-6 md:px-8 bg-neutral-950/40">
                <button
                  onClick={() => { setArTab('explain'); stopCamera(); }}
                  className={`py-3.5 px-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    arTab === 'explain'
                      ? 'border-amber-500 text-amber-400 font-semibold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                  id="tab-ar-explain"
                >
                  <Smartphone className="w-3.5 h-3.5 inline mr-1.5" /> Mobile Setup Guide
                </button>
                <button
                  onClick={() => setArTab('simulator')}
                  className={`py-3.5 px-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                    arTab === 'simulator'
                      ? 'border-amber-500 text-amber-400 font-semibold'
                      : 'border-transparent text-neutral-400 hover:text-neutral-200'
                  }`}
                  id="tab-ar-simulator"
                >
                  <Camera className="w-3.5 h-3.5 inline mr-1.5" /> Interactive AR Web Simulator
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6 md:p-8">
                {arTab === 'explain' ? (
                  /* EXPLAIN TAB: MOBILE INSTRUCTIONS */
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    {/* Left: Mobile QR Code Simulation */}
                    <div className="md:col-span-5 flex flex-col items-center text-center p-6 bg-neutral-950/80 border border-neutral-800 rounded-2xl">
                      <div className="relative p-4 bg-white rounded-2xl shadow-inner mb-4">
                        {/* Mock QR Code vector style */}
                        <div className="w-40 h-40 bg-neutral-100 p-2 rounded flex flex-col justify-between border-2 border-stone-200">
                          <div className="flex justify-between h-1/4">
                            <div className="w-8 h-8 bg-neutral-900 rounded border-4 border-neutral-900" />
                            <div className="w-4 h-4 bg-neutral-900/40" />
                            <div className="w-8 h-8 bg-neutral-900 rounded border-4 border-neutral-900" />
                          </div>
                          <div className="flex justify-between items-center h-1/2 px-2">
                            <div className="w-6 h-10 bg-neutral-900/80 rounded" />
                            {/* Eagle center emblem overlay */}
                            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                              🦅
                            </div>
                            <div className="w-6 h-8 bg-neutral-900/60 rounded" />
                          </div>
                          <div className="flex justify-between h-1/4">
                            <div className="w-8 h-8 bg-neutral-900 rounded border-4 border-neutral-900" />
                            <div className="w-4 h-4 bg-neutral-900/30" />
                            <div className="w-8 h-8 bg-neutral-900 rounded border-4 border-neutral-900" />
                          </div>
                        </div>
                      </div>
                      <span className="text-2xs font-mono text-amber-500 uppercase tracking-widest mb-1">
                        Instant WebAR Access
                      </span>
                      <h4 className="text-sm font-display font-semibold text-neutral-200 mb-2">
                        Scan with Mobile Camera
                      </h4>
                      <p className="text-neutral-400 text-xs leading-relaxed max-w-xs">
                        Point your mobile camera at this QR code to launch the augmented reality camera view directly on your phone. No app installation required!
                      </p>
                    </div>

                    {/* Right: Steps */}
                    <div className="md:col-span-7 space-y-6">
                      <h4 className="text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
                        How to place this relic in your room:
                      </h4>

                      <div className="space-y-4">
                        <div className="flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-500 font-mono text-xs font-bold shrink-0">
                            1
                          </div>
                          <div>
                            <h5 className="font-display font-bold text-sm text-neutral-200">
                              Position your device
                            </h5>
                            <p className="font-sans text-xs text-neutral-400 mt-0.5 leading-relaxed">
                              Hold your smartphone comfortably and aim the rear camera at a flat, clear surface—such as a sturdy table, countertop, or the floor.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-500 font-mono text-xs font-bold shrink-0">
                            2
                          </div>
                          <div>
                            <h5 className="font-display font-bold text-sm text-neutral-200">
                              Detect surface plane
                            </h5>
                            <p className="font-sans text-xs text-neutral-400 mt-0.5 leading-relaxed">
                              Move your phone slowly in a gentle circular motion. The WebAR engine will analyze surface texture and construct an invisible tracking grid.
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-lg bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-500 font-mono text-xs font-bold shrink-0">
                            3
                          </div>
                          <div>
                            <h5 className="font-display font-bold text-sm text-neutral-200">
                              Tap to place & adjust
                            </h5>
                            <p className="font-sans text-xs text-neutral-400 mt-0.5 leading-relaxed">
                              Once the surface is calibrated, tap the screen to drop the <strong>{arArtifact.name}</strong>. Use two fingers to pinch-to-scale, or drag to rotate.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-neutral-800 flex justify-end">
                        <button
                          onClick={() => setArTab('simulator')}
                          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold text-xs font-mono uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
                        >
                          Try Simulator on Web <Camera className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* SIMULATOR TAB: INTERACTIVE SANDBOX */
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                    {/* Left: Simulated AR screen viewport */}
                    <div className="lg:col-span-7 flex flex-col">
                      <div 
                        className="relative aspect-[4/3] rounded-2xl border border-neutral-800 bg-neutral-950 overflow-hidden shadow-inner flex flex-col justify-center items-center"
                      >
                        {/* Background camera feed / ambient render */}
                        {isLiveCameraOn ? (
                          <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-cover bg-center opacity-45 mix-blend-overlay"
                               style={{ backgroundImage: `url('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80')` }} />
                        )}

                        {/* Scan Sweep overlay */}
                        {isScanning && (
                          <div className="absolute inset-0 bg-neutral-950/80 z-20 flex flex-col justify-center items-center p-6 text-center">
                            <Scan className="w-10 h-10 text-amber-500 animate-bounce mb-3" />
                            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest font-semibold mb-2">
                              Scanning Environment...
                            </div>
                            <div className="w-48 bg-neutral-800 rounded-full h-1.5 overflow-hidden border border-neutral-700">
                              <div 
                                className="bg-amber-500 h-1.5 rounded-full transition-all duration-200" 
                                style={{ width: `${scanProgress}%` }}
                              />
                            </div>
                            <div className="text-[10px] font-mono text-neutral-500 mt-2">
                              DO NOT MOVE DEVICE • {scanProgress}% COMPLETE
                            </div>
                          </div>
                        )}

                        {/* Scanner grid line effect */}
                        {!hasScannedSurface && !isScanning && (
                          <div className="absolute inset-0 z-10 bg-neutral-950/60 flex flex-col justify-center items-center text-center p-4">
                            <button
                              onClick={startCamera}
                              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono text-2xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer mb-2"
                            >
                              Initialize Plane Scanner
                            </button>
                            <p className="text-[10px] font-mono text-neutral-400 max-w-xs">
                              {isLiveCameraOn ? 'Webcam feed is running. Click to map the physical surface coordinates.' : 'Project the artifact into your local surroundings via webcam, or launch mock scan!'}
                            </p>
                          </div>
                        )}

                        {/* Simulated Grid Target Overlay */}
                        {hasScannedSurface && (
                          <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
                            {/* Reticle guide line */}
                            <div className="w-40 h-40 border border-dashed border-amber-500/40 rounded-full animate-spin-slow flex items-center justify-center">
                              <div className="w-20 h-20 border border-dotted border-amber-500/20 rounded-full" />
                            </div>
                          </div>
                        )}

                        {/* Superimposed Artifact! */}
                        {hasScannedSurface && (
                          <motion.div
                            style={{ 
                              x: arPosition.x, 
                              y: arPosition.y,
                              scale: arScale,
                              rotate: `${arRotation}deg`
                            }}
                            className="absolute w-44 h-44 z-20 preserve-3d"
                            id="ar-superimposed-item"
                          >
                            <img
                              src={arArtifact.imageFallback}
                              alt={arArtifact.name}
                              className={`w-full h-full object-contain filter drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)] ${
                                isAnchorPlaced ? 'ring-2 ring-emerald-500/50 rounded-xl' : 'animate-pulse'
                              }`}
                              referrerPolicy="no-referrer"
                            />
                            {/* Hover info badge */}
                            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-md px-2..5 py-0.5 border border-neutral-800 rounded text-[9px] font-mono text-amber-400 uppercase tracking-widest whitespace-nowrap">
                              {isAnchorPlaced ? '🟢 Anchored Relic' : '✨ Adjusting Spatial Bounds'}
                            </div>
                          </motion.div>
                        )}

                        {/* Top Overlay Banner (Camera status) */}
                        <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center pointer-events-none">
                          <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md border border-neutral-800 px-3 py-1 rounded-full text-[10px] font-mono">
                            <span className={`w-1.5 h-1.5 rounded-full ${isLiveCameraOn ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                            {isLiveCameraOn ? 'WEBCAM ACTIVE' : 'ROOM SIMULATOR'}
                          </div>
                          
                          {isLiveCameraOn && (
                            <button
                              onClick={(e) => { e.stopPropagation(); stopCamera(); }}
                              className="pointer-events-auto bg-black/75 hover:bg-neutral-800 border border-neutral-800 p-1.5 rounded-full text-neutral-400 hover:text-neutral-100 transition-colors cursor-pointer"
                              title="Turn Off Webcam"
                            >
                              <CameraOff className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Simulator guide under preview */}
                      <p className="text-[10px] font-mono text-neutral-500 text-center mt-3 uppercase tracking-wider">
                        Use controls in inspector side-panel to scale, rotate and drop relic.
                      </p>
                    </div>

                    {/* Right: Inspector sidebar panel */}
                    <div className="lg:col-span-5 bg-neutral-950/60 border border-neutral-800 p-5 rounded-2xl flex flex-col justify-between">
                      <div className="space-y-5">
                        <div className="border-b border-neutral-900 pb-3">
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">Interactive Inspector</span>
                          <h4 className="text-base font-display font-bold text-neutral-100">Relic Transformation</h4>
                        </div>

                        {/* If not yet scanned, prompt scanner */}
                        {!hasScannedSurface ? (
                          <div className="text-center py-10">
                            <Scan className="w-8 h-8 text-neutral-600 mx-auto mb-2 animate-pulse" />
                            <p className="text-xs font-mono text-neutral-500 uppercase tracking-wide leading-relaxed">
                              Waiting for Environment plane detection...
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {/* Translation Sliders */}
                            <div>
                              <div className="flex justify-between items-center mb-1 text-[10px] font-mono">
                                <span className="text-neutral-400">HORIZONTAL (X-AXIS)</span>
                                <span className="text-amber-500">{arPosition.x}px</span>
                              </div>
                              <input
                                type="range"
                                min="-150"
                                max="150"
                                value={arPosition.x}
                                onChange={(e) => setArPosition(prev => ({ ...prev, x: parseInt(e.target.value) }))}
                                className="w-full accent-amber-500 cursor-pointer"
                              />
                            </div>

                            <div>
                              <div className="flex justify-between items-center mb-1 text-[10px] font-mono">
                                <span className="text-neutral-400">VERTICAL (Y-AXIS)</span>
                                <span className="text-amber-500">{arPosition.y}px</span>
                              </div>
                              <input
                                type="range"
                                min="-120"
                                max="120"
                                value={arPosition.y}
                                onChange={(e) => setArPosition(prev => ({ ...prev, y: parseInt(e.target.value) }))}
                                className="w-full accent-amber-500 cursor-pointer"
                              />
                            </div>

                            {/* Rotation Slider */}
                            <div>
                              <div className="flex justify-between items-center mb-1 text-[10px] font-mono">
                                <span className="text-neutral-400">SPATIAL ROTATION</span>
                                <span className="text-amber-500">{arRotation}°</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="360"
                                value={arRotation}
                                onChange={(e) => setArRotation(parseInt(e.target.value))}
                                className="w-full accent-amber-500 cursor-pointer"
                              />
                            </div>

                            {/* Scale Slider */}
                            <div>
                              <div className="flex justify-between items-center mb-1 text-[10px] font-mono">
                                <span className="text-neutral-400">PHYSICAL SCALE</span>
                                <span className="text-amber-500">{arScale.toFixed(2)}x</span>
                              </div>
                              <input
                                type="range"
                                min="0.3"
                                max="2.0"
                                step="0.05"
                                value={arScale}
                                onChange={(e) => setArScale(parseFloat(e.target.value))}
                                className="w-full accent-amber-500 cursor-pointer"
                              />
                            </div>

                            {/* Reset Button */}
                            <button
                              onClick={() => {
                                setArPosition({ x: 0, y: 0 });
                                setArScale(1.0);
                                setArRotation(0);
                                setIsAnchorPlaced(false);
                              }}
                              className="w-full py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[10px] font-mono text-neutral-400 hover:text-neutral-200 uppercase tracking-widest rounded transition-colors cursor-pointer"
                            >
                              Reset Transformation Matrix
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Anchor Placement Button */}
                      {hasScannedSurface && (
                        <div className="mt-6 border-t border-neutral-900 pt-4">
                          <button
                            onClick={() => setIsAnchorPlaced(!isAnchorPlaced)}
                            className={`w-full py-3.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              isAnchorPlaced 
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/10' 
                                : 'bg-gradient-to-r from-amber-500 to-gold-500 text-neutral-950 hover:from-amber-400 hover:to-gold-400 shadow-lg shadow-gold-500/10'
                            }`}
                          >
                            {isAnchorPlaced ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 animate-bounce" /> Relic Anchored Successfully!
                              </>
                            ) : (
                              <>
                                <Move className="w-4 h-4" /> Place & Anchor in Environment
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
