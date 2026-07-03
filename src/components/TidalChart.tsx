/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Anchor, 
  Waves, 
  Sun, 
  Sunset, 
  Moon, 
  Sunrise, 
  Play, 
  Pause, 
  RefreshCw, 
  AlertCircle, 
  Info, 
  CheckCircle2,
  Clock,
  Compass,
  ArrowRight
} from 'lucide-react';

interface TideDataPoint {
  hour: number;
  height: number; // in meters
  type: 'rising' | 'falling' | 'slack';
}

export const TidalChart: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 260 });
  const [selectedHour, setSelectedHour] = useState<number>(8);
  const [tideCycle, setTideCycle] = useState<'spring' | 'neap'>('spring');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playIntervalRef = useRef<number | null>(null);

  // 1. Generate realistic semi-diurnal tides for Brass Estuary
  // Spring tides have larger amplitudes, Neap tides have smaller ones
  const getTideData = (): TideDataPoint[] => {
    const data: TideDataPoint[] = [];
    const amplitude = tideCycle === 'spring' ? 1.0 : 0.5;
    const baseHeight = 1.3;

    for (let h = 0; h <= 24; h++) {
      // Primary M2 tidal frequency (approx 12.42 hours per cycle) + secondary solar frequency
      // h(t) = base + amp * sin(2*pi*h / 12.42) + tiny secondary cycle
      const angle1 = (2 * Math.PI * h) / 12.2;
      const angle2 = (2 * Math.PI * h) / 6.1;
      const height = baseHeight + amplitude * Math.sin(angle1 - 1.2) + 0.15 * Math.sin(angle2);
      
      // Determine if rising or falling based on derivative
      const delta = 0.01;
      const hNext = baseHeight + amplitude * Math.sin((2 * Math.PI * (h + delta)) / 12.2 - 1.2) + 0.15 * Math.sin((2 * Math.PI * (h + delta)) / 6.1);
      const isRising = hNext > height;

      data.push({
        hour: h % 24,
        height: Math.max(0.2, parseFloat(height.toFixed(2))),
        type: Math.abs(hNext - height) < 0.015 ? 'slack' : (isRising ? 'rising' : 'falling'),
      });
    }
    return data;
  };

  const tideData = getTideData();
  const currentTidePoint = tideData[selectedHour];

  // 2. Setup ResizeObserver for responsive sizing
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      // Keep ratio pleasing
      setDimensions({
        width: Math.max(300, width),
        height: 240,
      });
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // 3. Play simulation loop
  useEffect(() => {
    if (isPlaying) {
      playIntervalRef.current = window.setInterval(() => {
        setSelectedHour((prev) => (prev + 1) % 24);
      }, 1000);
    } else {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
        playIntervalRef.current = null;
      }
    }

    return () => {
      if (playIntervalRef.current) {
        clearInterval(playIntervalRef.current);
      }
    };
  }, [isPlaying]);

  // 4. Render D3 Elements dynamically inside useEffect or render directly from data
  // Using React for drawing JSX based on D3 calculations (the most robust hybrid pattern)
  const margin = { top: 25, right: 35, bottom: 35, left: 45 };
  const chartWidth = dimensions.width - margin.left - margin.right;
  const chartHeight = dimensions.height - margin.top - margin.bottom;

  // X & Y D3 scales
  const xScale = d3.scaleLinear()
    .domain([0, 24])
    .range([0, chartWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, 2.5]) // tides range up to 2.5m
    .range([chartHeight, 0]);

  // Create SVG path string using D3 line/area generator
  const lineGenerator = d3.line<TideDataPoint>()
    .x(d => xScale(d.hour))
    .y(d => yScale(d.height))
    .curve(d3.curveMonotoneX);

  const areaGenerator = d3.area<TideDataPoint>()
    .x(d => xScale(d.hour))
    .y0(chartHeight)
    .y1(d => yScale(d.height))
    .curve(d3.curveMonotoneX);

  const linePath = lineGenerator(tideData) || '';
  const areaPath = areaGenerator(tideData) || '';

  // Get tide state label & color
  const getTideStateText = (point: TideDataPoint) => {
    if (point.height >= 1.9) return { text: 'High Tide (Slack)', color: 'text-amber-600', bg: 'bg-amber-500/10 border-amber-500/20' };
    if (point.height <= 0.6) return { text: 'Low Tide (Slack)', color: 'text-sky-600', bg: 'bg-sky-500/10 border-sky-500/20' };
    return point.type === 'rising' 
      ? { text: 'Rising Flood Tide', color: 'text-emerald-600', bg: 'bg-emerald-500/10 border-emerald-500/20' }
      : { text: 'Ebbing Ebb Tide', color: 'text-orange-600', bg: 'bg-orange-500/10 border-orange-500/20' };
  };

  // Generate safety status based on tidal levels for safe boat tours
  const getSafetyGuidance = (height: number) => {
    if (height < 0.7) {
      return {
        status: 'Shallow Waters Caution',
        color: 'text-amber-700 bg-amber-50 border-amber-200',
        badge: 'bg-amber-500/10 text-amber-800 border-amber-500/20',
        summary: 'Estuary levels are low. Deep mudbanks and submerged mangrove roots are highly exposed.',
        motor: 'Extreme Hazard: Avoid motorized speedboats in creek channels due to prop damage risk.',
        canoe: 'Great for expert sea-kayaking; however, shallow channels may force short portages over sandbars.',
        walking: 'Optimal: Ideal for walking exploring exposed sand flats, tidal pools, and coastal shell middens.'
      };
    } else if (height > 1.9) {
      return {
        status: 'Deep High-Water Alert',
        color: 'text-blue-900 bg-blue-50 border-blue-200',
        badge: 'bg-blue-500/10 text-blue-800 border-blue-500/20',
        summary: 'Tide is fully peaking. Waterways are wide, deep, and tidal currents can be swift near channels.',
        motor: 'Optimal: Ideal for large motor-driven tours and deep-draft boats heading offshore.',
        canoe: 'Safe; but strong estuary outflow can cause heavy resistance when paddling against currents.',
        walking: 'Caution: Sandy beach shores are highly narrow. Avoid being trapped near high rocky headlands.'
      };
    } else {
      return {
        status: 'Safe Safe Passage Window',
        color: 'text-emerald-900 bg-emerald-50 border-emerald-200',
        badge: 'bg-emerald-500/10 text-emerald-800 border-emerald-500/20',
        summary: 'Moderate flow water levels. Creek channels are safely deep enough for standard exploration.',
        motor: 'Safe: Keep normal lookouts for occasional branches or drifting mangrove stumps.',
        canoe: 'Optimal: Perfect flow. Scenic canopy tours inside forest corridors are highly recommended.',
        walking: 'Safe: Beaches are wide and accessible. High-ground coastal trails are dry and navigable.'
      };
    }
  };

  const safety = getSafetyGuidance(currentTidePoint.height);

  // Time-of-day icon and background representation
  const getTimeOfDayTheme = (hour: number) => {
    if (hour >= 6 && hour < 11) return { label: 'Morning Sunrise', icon: <Sunrise className="w-4 h-4 text-amber-500" /> };
    if (hour >= 11 && hour < 16) return { label: 'Noon Sun', icon: <Sun className="w-4 h-4 text-orange-500" /> };
    if (hour >= 16 && hour < 19) return { label: 'Golden Sunset', icon: <Sunset className="w-4 h-4 text-rose-500" /> };
    return { label: 'Night Moon', icon: <Moon className="w-4 h-4 text-indigo-400" /> };
  };

  const timeTheme = getTimeOfDayTheme(selectedHour);

  // Helper to draw clean time markers
  const hoursTicks = [0, 4, 8, 12, 16, 20, 24];

  return (
    <div className="bg-white border border-stone-200 rounded-3xl p-6 md:p-8 space-y-8 text-left shadow-xs">
      {/* Header section with instructions & toggles */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div>
          <span className="px-2.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-[10px] font-mono text-amber-800 uppercase tracking-widest font-bold">
            Real-Time Coastal Navigation
          </span>
          <h3 className="font-display text-xl md:text-2xl font-black text-stone-900 tracking-tight leading-none mt-1.5 flex items-center gap-2">
            <Waves className="w-5 h-5 text-amber-600" /> Tidal Patterns & Marine Safety
          </h3>
          <p className="font-sans text-xs text-stone-500 mt-1 max-w-xl">
            Semidiurnal tides govern the Brass River Estuary. Plan safe motorized excursions or mangrove canoe tours by mapping current water heights.
          </p>
        </div>

        {/* Spring vs Neap Selector and Simulation controls */}
        <div className="flex items-center gap-2">
          <div className="bg-stone-100 p-1 rounded-xl border border-stone-200/80 flex">
            <button
              onClick={() => { setTideCycle('spring'); }}
              className={`px-3 py-1.5 rounded-lg font-mono text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                tideCycle === 'spring'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              id="tide-spring-btn"
            >
              Spring Tide
            </button>
            <button
              onClick={() => { setTideCycle('neap'); }}
              className={`px-3 py-1.5 rounded-lg font-mono text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                tideCycle === 'neap'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              id="tide-neap-btn"
            >
              Neap Tide
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Interactive Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Col: D3 Chart Representation */}
        <div className="lg:col-span-8 flex flex-col space-y-4" ref={containerRef}>
          <div className="relative border border-stone-200/80 bg-stone-50/50 rounded-2xl p-4 overflow-hidden shadow-xs">
            
            {/* Hour marker display overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-stone-200 px-3 py-1.5 rounded-xl shadow-xs z-10 pointer-events-none">
              {timeTheme.icon}
              <div className="flex flex-col">
                <span className="font-mono text-[9px] text-stone-400 uppercase font-bold leading-none">Simulated Hour</span>
                <span className="font-display font-extrabold text-xs text-stone-900 leading-tight mt-0.5">
                  {selectedHour.toString().padStart(2, '0')}:00 {selectedHour >= 12 ? 'PM' : 'AM'}
                </span>
              </div>
            </div>

            {/* Simulated Live stats */}
            <div className="absolute top-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-stone-200 px-3 py-1.5 rounded-xl shadow-xs z-10 pointer-events-none">
              <div className="flex flex-col text-right">
                <span className="font-mono text-[9px] text-stone-400 uppercase font-bold leading-none">Estuary Height</span>
                <span className="font-display font-extrabold text-xs text-amber-700 leading-tight mt-0.5">
                  {currentTidePoint.height.toFixed(2)} meters
                </span>
              </div>
              <div className="w-1.5 h-6 rounded-full bg-amber-500/10 relative overflow-hidden shrink-0">
                <div 
                  className="absolute bottom-0 left-0 right-0 bg-amber-600 transition-all duration-300"
                  style={{ height: `${(currentTidePoint.height / 2.5) * 100}%` }}
                />
              </div>
            </div>

            {/* SVG Render Container */}
            <svg 
              ref={svgRef}
              width={dimensions.width} 
              height={dimensions.height}
              className="overflow-visible"
            >
              <g transform={`translate(${margin.left}, ${margin.top})`}>
                
                {/* 1. Grid lines */}
                {yScale.ticks(5).map((tick, i) => (
                  <g key={i} transform={`translate(0, ${yScale(tick)})`}>
                    <line 
                      x1={0} 
                      x2={chartWidth} 
                      stroke="#e7e5e4" 
                      strokeWidth={1}
                      strokeDasharray="2 4"
                    />
                    <text 
                      x={-10} 
                      y={4} 
                      textAnchor="end" 
                      className="font-mono text-[9px] fill-stone-400 font-bold"
                    >
                      {tick.toFixed(1)}m
                    </text>
                  </g>
                ))}

                {/* Tide level threshold limit guides */}
                <line 
                  x1={0} 
                  x2={chartWidth} 
                  y1={yScale(1.9)} 
                  y2={yScale(1.9)} 
                  stroke="#ef4444" 
                  strokeWidth={0.8}
                  strokeDasharray="4 4"
                  opacity={0.5}
                />
                <text 
                  x={chartWidth - 5} 
                  y={yScale(1.9) - 4} 
                  textAnchor="end" 
                  className="font-mono text-[8px] fill-red-500/80 uppercase font-bold"
                >
                  High Water Limit (1.9m)
                </text>

                <line 
                  x1={0} 
                  x2={chartWidth} 
                  y1={yScale(0.7)} 
                  y2={yScale(0.7)} 
                  stroke="#3b82f6" 
                  strokeWidth={0.8}
                  strokeDasharray="4 4"
                  opacity={0.5}
                />
                <text 
                  x={chartWidth - 5} 
                  y={yScale(0.7) - 4} 
                  textAnchor="end" 
                  className="font-mono text-[8px] fill-blue-500/80 uppercase font-bold"
                >
                  Low Water Limit (0.7m)
                </text>

                {/* 2. X-Axis hour labels */}
                {hoursTicks.map((tick, i) => (
                  <g key={i} transform={`translate(${xScale(tick)}, ${chartHeight})`}>
                    <line 
                      y1={0} 
                      y2={4} 
                      stroke="#d6d3d1" 
                      strokeWidth={1} 
                    />
                    <text 
                      y={15} 
                      textAnchor="middle" 
                      className="font-mono text-[9px] fill-stone-400 font-bold"
                    >
                      {tick === 24 ? '24h' : `${tick}:00`}
                    </text>
                  </g>
                ))}

                {/* 3. Spline Area fill under tidal height */}
                <path 
                  d={areaPath} 
                  fill="url(#tide-gradient)" 
                  opacity="0.8"
                />

                {/* 4. Spline Boundary Line */}
                <path 
                  d={linePath} 
                  fill="none" 
                  stroke="#d97706" 
                  strokeWidth={2.2} 
                />

                {/* 5. Custom gradients defs */}
                <defs>
                  <linearGradient id="tide-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#d97706" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#b45309" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* 6. Active selected hour cursor line & tracker point */}
                <g transform={`translate(${xScale(selectedHour)}, 0)`}>
                  <line 
                    y1={0} 
                    y2={chartHeight} 
                    stroke="#b45309" 
                    strokeWidth={1.5} 
                    strokeDasharray="2 2"
                    opacity={0.85}
                  />
                  
                  {/* Glowing active point */}
                  <circle 
                    cy={yScale(currentTidePoint.height)} 
                    r={6} 
                    className="fill-amber-600 stroke-white stroke-2 shadow-xs"
                  />
                  <circle 
                    cy={yScale(currentTidePoint.height)} 
                    r={12} 
                    className="fill-amber-500/30 animate-pulse"
                  />
                </g>

                {/* 7. Hover Rect overlay to make user clicking or dragging incredibly seamless */}
                <rect
                  width={chartWidth}
                  height={chartHeight}
                  fill="transparent"
                  className="cursor-pointer pointer-events-auto"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const h = Math.round(xScale.invert(x));
                    setSelectedHour(Math.min(24, Math.max(0, h)) % 24);
                  }}
                  onMouseMove={(e) => {
                    if (e.buttons === 1) { // dragging support
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left;
                      const h = Math.round(xScale.invert(x));
                      setSelectedHour(Math.min(24, Math.max(0, h)) % 24);
                    }
                  }}
                />
              </g>
            </svg>
          </div>

          {/* Timeline range slider and simulation controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-stone-50 border border-stone-200/60 rounded-2xl p-4">
            {/* Play/Pause Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className={`p-2.5 rounded-xl flex items-center justify-center cursor-pointer transition-colors shadow-xs ${
                  isPlaying 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-stone-900 hover:bg-stone-850 text-white'
                }`}
                title={isPlaying ? 'Pause Simulation' : 'Start Autoplay'}
                id="tide-play-btn"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={() => { setSelectedHour(new Date().getHours()); setIsPlaying(false); }}
                className="p-2.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 cursor-pointer transition-colors shadow-xs"
                title="Reset to current local hour"
                id="tide-reset-btn"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <div className="text-left">
                <span className="font-mono text-[9px] text-stone-400 uppercase font-bold leading-none block">Mode</span>
                <span className="font-sans text-2xs font-semibold text-stone-700">
                  {isPlaying ? 'Looping Day' : 'Interactive Manual'}
                </span>
              </div>
            </div>

            {/* Slider control */}
            <div className="flex-1 w-full flex items-center gap-4">
              <span className="font-mono text-3xs text-stone-400 font-bold">0:00</span>
              <input 
                type="range"
                min="0"
                max="23"
                value={selectedHour}
                onChange={(e) => { setSelectedHour(parseInt(e.target.value)); setIsPlaying(false); }}
                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-600 focus:outline-none"
                id="tide-slider-input"
              />
              <span className="font-mono text-3xs text-stone-400 font-bold">23:00</span>
            </div>
          </div>
        </div>

        {/* Right Col: Dynamic Safety Advice & Tourism Recommendations */}
        <div className="lg:col-span-4 flex flex-col justify-between">
          <div className="bg-stone-50 border border-stone-200 p-5 rounded-2xl flex flex-col h-full justify-between gap-5 shadow-xs">
            
            {/* Header Status */}
            <div className="space-y-4">
              <div className="border-b border-stone-200 pb-3 flex items-start justify-between gap-3">
                <div className="text-left">
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider border ${getTideStateText(currentTidePoint).bg} ${getTideStateText(currentTidePoint).color}`}>
                    {getTideStateText(currentTidePoint).text}
                  </span>
                  <h4 className="font-display font-black text-sm text-stone-900 tracking-tight leading-tight mt-2 flex items-center gap-1">
                    <Compass className="w-4.5 h-4.5 text-amber-600 shrink-0" /> Marine Safety Guard
                  </h4>
                </div>
              </div>

              {/* Tide conditions details list */}
              <div className="space-y-3.5 text-left text-xs font-sans text-stone-600 leading-relaxed">
                <div className={`p-3.5 rounded-xl border ${safety.color} space-y-1`}>
                  <strong className="font-display text-2xs font-extrabold uppercase tracking-wider block">
                    {safety.status}
                  </strong>
                  <p className="text-[11px] font-medium text-stone-700">
                    {safety.summary}
                  </p>
                </div>

                {/* Submerged status alerts */}
                <div className="space-y-3.5 pt-1.5">
                  <div className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-lg bg-stone-200/75 flex items-center justify-center shrink-0 font-mono text-[9px] font-bold text-stone-600 uppercase">
                      Mot
                    </div>
                    <div>
                      <strong className="text-stone-900 text-2xs font-bold block">Motorboat Navigation</strong>
                      <p className="text-[11px] text-stone-500 leading-normal mt-0.5">{safety.motor}</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-lg bg-stone-200/75 flex items-center justify-center shrink-0 font-mono text-[9px] font-bold text-stone-600 uppercase">
                      Can
                    </div>
                    <div>
                      <strong className="text-stone-900 text-2xs font-bold block">Mangrove Canoe Safari</strong>
                      <p className="text-[11px] text-stone-500 leading-normal mt-0.5">{safety.canoe}</p>
                    </div>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <div className="w-5 h-5 rounded-lg bg-stone-200/75 flex items-center justify-center shrink-0 font-mono text-[9px] font-bold text-stone-600 uppercase">
                      Sho
                    </div>
                    <div>
                      <strong className="text-stone-900 text-2xs font-bold block">Shore walks & Camping</strong>
                      <p className="text-[11px] text-stone-500 leading-normal mt-0.5">{safety.walking}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tidal fact footer */}
            <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex gap-2.5 items-start text-left">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[10px] text-stone-600 leading-relaxed">
                <strong className="text-stone-800 font-semibold block">Did You Know?</strong>
                Okpoama's ancient salt wells depend on these tides! Coastal waters flood the salt plains during high spring tides, replenishing the geothermal wells with heavy brine.
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
